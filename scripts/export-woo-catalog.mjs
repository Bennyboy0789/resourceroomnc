/**
 * Exports the live WooCommerce catalog to scripts/catalog.json.
 *
 * Step one of the migration. This touches nothing — it only reads the public
 * Store API and writes a normalized file for review, so the catalog can be
 * checked before `seed-stripe.mjs` pushes it into Stripe.
 *
 *   node scripts/export-woo-catalog.mjs
 *
 * Two shapes in the source data are worth understanding:
 *
 * 1. Variation prices are not in the product listing. Each variation has to be
 *    fetched on its own (`/products/<id>`), which is why this makes ~99 extra
 *    requests. They are batched rather than fired all at once.
 *
 * 2. An attribute can be declared "used for variations" and still be left unset
 *    on every variation — Woo treats that as "any value". Semester on the
 *    Homeschool Co-Op does exactly this: it is asked at checkout but changes
 *    neither the price nor which variation is bought. Those are flagged
 *    `informational` here so the UI can still collect the answer and pass it
 *    through as order metadata without pretending it selects anything.
 */

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const STORE = "https://resourceroomnc.com/wp-json/wc/store/v1";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "catalog.json");

/**
 * Which page each store product belongs to. Anything not listed here is skipped,
 * which keeps retired and one-off products out of the new site by default.
 */
const PROGRAM_BY_SLUG = {
  "homeschool-co-op-holly-springs-nc": "homeschool-co-op",
  stem: "camps",
  "teacher-workdays": "camps",
  /* scratch-coding retired: pulled from the site, then archived in Stripe.
     Listing it here would pull it back in on the next export. */
  "educational-workshops": "camps",
  "sat-prep-in-north-carolina": "sat-act-prep",
  "act-prep-in-north-carolina": "sat-act-prep",
  "college-admissions": "college-prep",
  "executive-functioning-coaching-and-support": "tutoring",
  "summer-bridge-programs-in-nc": "tutoring",
  "ms-sams-new-2-numbers": "tutoring",
  "story-stations": "tutoring",
  "crafty-learning": "tutoring",
};

const decode = (s) =>
  String(s ?? "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&")
    .replace(/&#039;|&#8217;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();

async function get(url) {
  const res = await fetch(url, { headers: { "User-Agent": "resourceroom-migration" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

/** Runs tasks with a small concurrency cap so the store is not hammered. */
async function pool(items, limit, fn) {
  const out = [];
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (cursor < items.length) {
        const index = cursor++;
        out[index] = await fn(items[index]);
      }
    }),
  );
  return out;
}

const all = await get(`${STORE}/products?per_page=100`);
console.log(`fetched ${all.length} products`);

const wanted = all.filter((p) => PROGRAM_BY_SLUG[p.slug]);
const products = [];

for (const p of wanted) {
  const variations = p.variations ?? [];

  if (p.type === "simple") {
    const amount = Number(p.prices?.price ?? 0);
    if (!amount) {
      console.log(`  skip ${p.slug} (simple, no price)`);
      continue;
    }
    products.push({
      wooId: p.id,
      slug: p.slug,
      name: decode(p.name),
      programSlug: PROGRAM_BY_SLUG[p.slug],
      attributes: [],
      variants: [{ wooId: p.id, amount, options: {} }],
    });
    console.log(`  ${p.slug}: simple @ ${amount}`);
    continue;
  }

  if (!variations.length) {
    console.log(`  skip ${p.slug} (variable, no variations)`);
    continue;
  }

  const priced = await pool(variations, 6, async (v) => {
    const detail = await get(`${STORE}/products/${v.id}`);
    return {
      wooId: v.id,
      amount: Number(detail.prices?.price ?? 0),
      options: Object.fromEntries(
        (v.attributes ?? [])
          .filter((a) => a.value !== null && a.value !== "None" && a.value !== "")
          .map((a) => [decode(a.name), decode(a.value)]),
      ),
    };
  });

  const usable = priced.filter((v) => v.amount > 0);

  // Nothing left to sell — every variation was free or unpriced.
  if (!usable.length) {
    console.log(`  skip ${p.slug} (variable, no priced variations)`);
    continue;
  }

  // An attribute that never carries a value on any variation is collected but
  // not selected on — see the file header.
  const attributes = (p.attributes ?? [])
    .filter((a) => a.has_variations)
    .map((a) => {
      const name = decode(a.name);
      const used = usable.some((v) => v.options[name] !== undefined);
      return {
        name,
        options: a.terms.map((t) => decode(t.name)),
        informational: !used,
      };
    });

  products.push({
    wooId: p.id,
    slug: p.slug,
    name: decode(p.name),
    programSlug: PROGRAM_BY_SLUG[p.slug],
    attributes,
    variants: usable,
  });

  const flagged = attributes.filter((a) => a.informational).map((a) => a.name);
  console.log(
    `  ${p.slug}: ${usable.length}/${variations.length} priced variants` +
      (flagged.length ? `  [informational: ${flagged.join(", ")}]` : ""),
  );
}

const catalog = {
  generatedAt: new Date().toISOString(),
  source: STORE,
  currency: "usd",
  products,
};

await writeFile(OUT, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(
  `\nwrote ${OUT}\n  ${products.length} products, ` +
    `${products.reduce((n, p) => n + p.variants.length, 0)} variants`,
);
