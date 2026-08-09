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
  /** `metadata.woo_slug` — how a product page names the product it sells. */
  slug: string;
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
    /*
     * Paginated, not a single page.
     *
     * `limit: 100` is Stripe's maximum per request, and the seeded catalog is
     * already over it — 102 prices across 9 products, with STEM alone holding
     * 55 weekly sessions. A single page silently dropped the two oldest, which
     * cost Homeschool Co-Op one of its ten enrolment options: no error, just a
     * combination a family could not buy. `autoPagingToArray` needs an explicit
     * ceiling, so both are set well above the present catalog with room to grow.
     */
    const [products, prices] = await Promise.all([
      stripe.products.list({ active: true, limit: 100 }).autoPagingToArray({ limit: 500 }),
      stripe.prices
        .list({ active: true, limit: 100, expand: ["data.product"] })
        .autoPagingToArray({ limit: 2000 }),
    ]);

    /*
     * Stripe lists prices newest-first, but the seed script creates them in
     * catalog.json order — which is the curated, chronological order for
     * date-shaped attributes like camp weeks. Restoring creation order here is
     * what keeps "June 7-June 11" before "July 12-July 16" in the picker;
     * parsing the option strings instead is a dead end, since most carry no
     * year and the camp season wraps around the calendar.
     */
    prices.sort((a, b) => a.created - b.created);

    const byProduct = new Map<string, CatalogVariant[]>();

    for (const price of prices) {
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

    for (const product of products) {
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
        slug: product.metadata?.woo_slug ?? "",
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

/**
 * A single product by its catalog slug, for the product pages that sell one
 * thing. Returns null when Stripe has no such product — the page then shows its
 * content and consultation CTA rather than a broken buy box.
 */
export async function getProduct(slug: string) {
  if (!slug) return null;
  const catalog = await getCatalog();
  return catalog.find((product) => product.slug === slug) ?? null;
}

export function formatAmount(amount: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100);
}
