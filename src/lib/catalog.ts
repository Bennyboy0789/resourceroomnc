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
   * Options that are full. Shown, struck through and unselectable rather than
   * removed: a family looking for the week their neighbour booked should see
   * that it exists and has gone, not silently fail to find it.
   */
  soldOut: string[];
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
  /**
   * `metadata.sold_out = "true"` on the Stripe Price.
   *
   * Deliberately not archiving the price: archiving removes the option from
   * the page entirely, and a camp week that filled should still be visible.
   * Keeping it in metadata also means a week closes and reopens from the
   * Stripe dashboard, with no deploy — which matters in camp season, when
   * that happens far more often than the code changes.
   */
  soldOut: boolean;
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

const MONTHS: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

/* Leading three letters of a month, any tail ("Sept", "March"), then the day.
   No `g` flag: these are reused across calls and `lastIndex` would carry. */
const MONTH_DAY = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*(\d{1,2})\b/i;
const YEAR = /\b(20\d{2})\b/;

/**
 * The calendar date an option chip names, or null when it does not name one.
 *
 * Camp options are sold as dates — "Sept 21, 2026", "Summer August 24-28,
 * 2026" — next to a few that are not, like "Extended Day Per Day". Only the
 * first month/day in the label is read, so a range sorts by the day it starts.
 *
 * The year is required rather than inferred. A camp season spans two Augusts,
 * so "Aug 9- Aug 13" alone is genuinely ambiguous, and guessing would file a
 * 2027 week silently among the 2026 ones. Anything without a year is treated
 * as undated and keeps its position instead.
 */
export function optionDate(label: string): number | null {
  const monthDay = MONTH_DAY.exec(label);
  const year = YEAR.exec(label);
  if (!monthDay || !year) return null;

  const month = MONTHS[monthDay[1].toLowerCase()];
  return Date.UTC(Number(year[1]), month, Number(monthDay[2]));
}

/**
 * Dated options in calendar order, undated ones first in the order given.
 *
 * Stripe has no ordering of its own. `prices.list` returns newest-first, and
 * the seed script writes a product's prices faster than the one-second
 * resolution of `created` — so whole batches share a timestamp, the tie-break
 * is arbitrary, and the camp chips came out as "Oct 12, Sept 21, Aug 21".
 * Reading the date off the label is stable however Stripe happens to answer.
 *
 * Undated options lead because they are the add-ons — extended day, single
 * day — which belong above a year of dates rather than lost inside them.
 */
function inCalendarOrder(options: string[]): string[] {
  const dated: { label: string; at: number }[] = [];
  const undated: string[] = [];

  for (const label of options) {
    const at = optionDate(label);
    if (at === null) undated.push(label);
    else dated.push({ label, at });
  }

  dated.sort((a, b) => a.at - b.at);
  return [...undated, ...dated.map((option) => option.label)];
}

/**
 * A catalog product with its dated options narrowed to the given months.
 *
 * The STEM catalog product is one Stripe SKU spanning the full track-out
 * year, but the page that markets it as "Summer Camps" should only offer the
 * weeks a family searching for summer camp is actually looking for.
 *
 * Undated options — Extended Day, Single Day — pass through untouched; the
 * filter only judges options that name a date. A week is kept or dropped by
 * the month it *starts* in, same as the calendar-order sort above, so a week
 * labelled "Aug 30 – Sept 3" counts as August.
 *
 * `months` is 0-indexed (June is 5), matching `Date`.
 */
export function filterByMonth(product: CatalogProduct, months: number[]): CatalogProduct {
  const keep = new Set(months);

  const attributes = product.attributes.map((attribute) => {
    if (attribute.informational) return attribute;
    return {
      ...attribute,
      options: attribute.options.filter((option) => {
        const at = optionDate(option);
        return at === null || keep.has(new Date(at).getUTCMonth());
      }),
    };
  });

  const survivingByAttribute = new Map(attributes.map((a) => [a.name, new Set(a.options)]));
  const variants = product.variants.filter((variant) =>
    Object.entries(variant.options).every(
      ([name, value]) => survivingByAttribute.get(name)?.has(value) ?? true,
    ),
  );

  return { ...product, attributes, variants };
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
     * Stripe lists prices newest-first; creation order is closer to the order
     * the seed script wrote them in, so it is the better default for variants.
     *
     * It is not enough for the picker on its own. `created` has one-second
     * resolution and the seed script writes far faster than that, so batches
     * of prices tie and the tie-break is whatever order Stripe returned —
     * which is what shuffled the camp chips. Option order is settled by the
     * date in the label instead, in `inCalendarOrder` below.
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
        soldOut: price.metadata?.sold_out === "true",
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
            soldOut: [],
            informational: true,
          };
        }
        const seen: string[] = [];
        for (const variant of variants) {
          const value = variant.options[name];
          if (value && !seen.includes(value)) seen.push(value);
        }

        /*
         * Sold out only when every price carrying that value is sold out. On a
         * product with one attribute that is the single price behind the chip;
         * on a multi-attribute product it means the option is unbuyable in
         * every remaining combination, which is the only case where striking
         * it through is honest.
         */
        const soldOut = seen.filter((value) => {
          const carrying = variants.filter((variant) => variant.options[name] === value);
          return carrying.length > 0 && carrying.every((variant) => variant.soldOut);
        });

        /* Only the derived options are reordered. An informational attribute's
           list is hand-written in product metadata, so its author's order is
           the intended one. */
        return { name, options: inCalendarOrder(seen), soldOut, informational: false };
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
