/**
 * Pushes scripts/catalog.json into Stripe as Products and Prices.
 *
 *   node scripts/export-woo-catalog.mjs      # step 1 — fetch and review
 *   STRIPE_SECRET_KEY=sk_test_... node scripts/seed-stripe.mjs --dry-run
 *   STRIPE_SECRET_KEY=sk_test_... node scripts/seed-stripe.mjs
 *
 * Run it against a TEST key first. `--dry-run` prints the plan and writes
 * nothing.
 *
 * Idempotent by design, so it is safe to re-run after editing catalog.json:
 * products are matched on `metadata.woo_id` and prices on `lookup_key`. Stripe
 * prices are immutable, so a changed amount cannot be edited — the old price is
 * deactivated, its lookup key is released, and a new price takes it over. Carts
 * and past orders keep pointing at the old price ID, which is exactly what you
 * want for anyone mid-purchase.
 *
 * Structure Stripe has no native concept of is carried in metadata; see
 * src/lib/catalog.ts for the reader that decodes it.
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import Stripe from "stripe";

const DRY = process.argv.includes("--dry-run");
const key = process.env.STRIPE_SECRET_KEY;

if (!key) {
  console.error("STRIPE_SECRET_KEY is required.");
  process.exit(1);
}
if (key.startsWith("sk_live") && !process.argv.includes("--live")) {
  console.error("Refusing to touch a live key without --live. Test it first.");
  process.exit(1);
}

const stripe = new Stripe(key);
const here = dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(await readFile(join(here, "catalog.json"), "utf8"));

/** Stable, human-readable handle for a variant's price. */
const lookupKey = (productSlug, variantWooId) => `rr_${productSlug}_${variantWooId}`.slice(0, 200);

/** Describes a variant in words: "High School / 2 Classes". */
const describe = (options) => Object.values(options).join(" / ") || "Standard";

async function findProduct(wooId) {
  const found = await stripe.products.search({
    query: `metadata['woo_id']:'${wooId}'`,
    limit: 1,
  });
  return found.data[0] ?? null;
}

async function findPrice(key) {
  const found = await stripe.prices.list({ lookup_keys: [key], limit: 1 });
  return found.data[0] ?? null;
}

let created = 0;
let updated = 0;
let replaced = 0;
let unchanged = 0;

for (const product of catalog.products) {
  const priceAttributes = product.attributes.filter((a) => !a.informational);
  const informational = product.attributes.filter((a) => a.informational);

  const metadata = {
    woo_id: String(product.wooId),
    woo_slug: product.slug,
    program_slug: product.programSlug,
    attribute_order: product.attributes.map((a) => a.name).join("|"),
    informational: informational.map((a) => a.name).join("|"),
  };

  // Informational attributes have no prices to read options from, so their
  // choices ride on the product itself.
  for (const attribute of informational) {
    metadata[`options_${attribute.name}`] = attribute.options.join("|");
  }

  let stripeProduct = DRY ? null : await findProduct(product.wooId);

  if (stripeProduct) {
    if (!DRY) {
      await stripe.products.update(stripeProduct.id, { name: product.name, metadata });
    }
    updated++;
    console.log(`~ product ${product.slug} (${stripeProduct.id})`);
  } else {
    if (!DRY) {
      stripeProduct = await stripe.products.create({ name: product.name, metadata });
    }
    created++;
    console.log(`+ product ${product.slug}${DRY ? " (dry run)" : ` (${stripeProduct.id})`}`);
  }

  for (const variant of product.variants) {
    const key = lookupKey(product.slug, variant.wooId);
    const optionMetadata = Object.fromEntries(
      priceAttributes
        .filter((a) => variant.options[a.name])
        .map((a) => [`opt_${a.name}`, variant.options[a.name]]),
    );

    const existing = DRY ? null : await findPrice(key);

    if (existing && existing.unit_amount === variant.amount) {
      await stripe.prices.update(existing.id, {
        metadata: { ...optionMetadata, woo_id: String(variant.wooId) },
        nickname: describe(variant.options),
      });
      unchanged++;
      continue;
    }

    if (existing) {
      // Amount changed. Immutable, so retire it and free the lookup key.
      await stripe.prices.update(existing.id, { active: false, lookup_key: null });
      replaced++;
      console.log(
        `  ! ${key}: ${existing.unit_amount} -> ${variant.amount} (old price retired)`,
      );
    }

    if (!DRY) {
      await stripe.prices.create({
        product: stripeProduct.id,
        currency: catalog.currency,
        unit_amount: variant.amount,
        lookup_key: key,
        transfer_lookup_key: false,
        nickname: describe(variant.options),
        metadata: { ...optionMetadata, woo_id: String(variant.wooId) },
      });
    }

    if (!existing) {
      created++;
      console.log(`  + ${key} @ ${variant.amount} ${describe(variant.options)}`);
    }
  }
}

console.log(
  `\n${DRY ? "[dry run] " : ""}created ${created}, updated ${updated}, ` +
    `replaced ${replaced}, unchanged ${unchanged}`,
);
