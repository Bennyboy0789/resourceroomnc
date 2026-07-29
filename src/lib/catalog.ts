import "server-only";
import { getStripe } from "@/lib/stripe";

/**
 * Reads the enrollment catalog back out of Stripe.
 *
 * Stripe is the source of truth for what things cost, but Stripe has no notion
 * of a "variant with attributes" — it only has Products and Prices. The seed
 * script encodes the missing structure in metadata, and this module decodes it:
 *
 *   Product.metadata.program_slug   which program page it belongs on
 *   Product.metadata.attribute_order  pipe-separated, fixes the select order
 *   Product.metadata.informational  pipe-separated, collected but not priced
 *   Price.metadata.opt_<Attribute>  this variant's value for that attribute
 *
 * Prices are read live so a change in the Stripe dashboard reaches the site
 * without a deploy; callers wrap this in Next's revalidation.
 */

export type CatalogAttribute = {
  name: string;
  options: string[];
  /**
   * Asked at enrollment but not part of choosing a variant — it carries no
   * price of its own and is passed through as order metadata. Migrated from
   * Woo attributes that were marked "used for variations" yet left unset on
   * every variation.
   */
  informational: boolean;
};

export type CatalogVariant = {
  priceId: string;
  amount: number;
  currency: string;
  /** Attribute name to value, for the price-bearing attributes only. */
  options: Record<string, string>;
};

export type CatalogProduct = {
  id: string;
  name: string;
  description: string | null;
  programSlug: string;
  attributes: CatalogAttribute[];
  variants: CatalogVariant[];
  /** Cheapest variant, for "from $X" labels. */
  fromAmount: number;
};

const OPTION_PREFIX = "opt_";

function splitList(value: string | undefined) {
  return (value ?? "")
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
}

export async function getCatalog(): Promise<CatalogProduct[]> {
  const stripe = getStripe();
  if (!stripe) return [];

  try {
    const [products, prices] = await Promise.all([
      stripe.products.list({ active: true, limit: 100 }),
      stripe.prices.list({ active: true, limit: 100, expand: ["data.product"] }),
    ]);

    const byProduct = new Map<string, CatalogVariant[]>();

    for (const price of prices.data) {
      if (price.unit_amount == null) continue;

      const productId =
        typeof price.product === "string" ? price.product : (price.product?.id ?? "");
      if (!productId) continue;

      const options: Record<string, string> = {};
      for (const [key, value] of Object.entries(price.metadata ?? {})) {
        if (key.startsWith(OPTION_PREFIX) && value) {
          options[key.slice(OPTION_PREFIX.length)] = value;
        }
      }

      const list = byProduct.get(productId) ?? [];
      list.push({
        priceId: price.id,
        amount: price.unit_amount,
        currency: price.currency,
        options,
      });
      byProduct.set(productId, list);
    }

    const catalog: CatalogProduct[] = [];

    for (const product of products.data) {
      const programSlug = product.metadata?.program_slug;
      const variants = byProduct.get(product.id) ?? [];
      if (!programSlug || !variants.length) continue;

      const informational = new Set(splitList(product.metadata?.informational));
      const order = splitList(product.metadata?.attribute_order);

      // Options come from the prices themselves so the picker can never offer a
      // combination that has no price behind it. Informational attributes have
      // no prices, so their options are carried on the product instead.
      const attributes: CatalogAttribute[] = order.map((name) => {
        if (informational.has(name)) {
          return {
            name,
            options: splitList(product.metadata?.[`options_${name}`]),
            informational: true,
          };
        }
        const seen: string[] = [];
        for (const variant of variants) {
          const value = variant.options[name];
          if (value && !seen.includes(value)) seen.push(value);
        }
        return { name, options: seen, informational: false };
      });

      catalog.push({
        id: product.id,
        name: product.name,
        description: product.description,
        programSlug,
        attributes: attributes.filter((a) => a.options.length > 0),
        variants: variants.sort((a, b) => a.amount - b.amount),
        fromAmount: Math.min(...variants.map((v) => v.amount)),
      });
    }

    return catalog;
  } catch (error) {
    // A Stripe outage or a bad key should cost the enrollment form, not the
    // whole page — every program page still has its content and phone number.
    console.error("[catalog] failed to load from Stripe:", error);
    return [];
  }
}

export async function getProductsForProgram(programSlug: string) {
  const catalog = await getCatalog();
  return catalog.filter((product) => product.programSlug === programSlug);
}

export function formatAmount(amount: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100);
}
