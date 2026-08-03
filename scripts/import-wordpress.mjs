/**
 * Imports blog posts and course products from the live WordPress site.
 *
 *   node scripts/import-wordpress.mjs
 *
 * Writes `src/content/blog.ts` and `src/content/courses.ts`, and downloads
 * every referenced image into `public/images/blog` and `public/images/courses`.
 *
 * Re-run it whenever Joe publishes on WordPress: the generated files are
 * overwritten wholesale, so edit the source in WordPress rather than the
 * output here. Everything else under `src/content` is hand-authored and is
 * never touched by this script.
 *
 * The WordPress REST API is public on resourceroomnc.com, so no credentials
 * are needed. WooCommerce prices are not exposed through it — those are
 * scraped from the rendered product page, which is the only place they appear.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WP = "https://resourceroomnc.com/wp-json/wp/v2";
const UA = "Mozilla/5.0 (compatible; ResourceRoomImporter/1.0)";

/** Products that already have a hand-written program page. */
const PROGRAM_PRODUCTS = new Set([
  "private-tutoring-for-all-subjects-in-nc",
  "teacher-workdays",
  "stem",
  "sat-prep-in-north-carolina",
  "act-prep-in-north-carolina",
  "pathways-academy",
  "homeschool-co-op-holly-springs-nc",
  "aba-educational-support",
  "college-admissions",
  "iep-advocacy",
  "executive-functioning-coaching-and-support",
  "summer-bridge-programs-in-nc",
]);

/** WordPress product categories collapsed into the groups the site shows. */
const CATEGORY_MAP = {
  "STEAM Programs": "STEAM Programs",
  "Lego Robotics": "LEGO Robotics",
  "Gaming Education": "Gaming Education",
  "Emerging Learners Programs": "Emerging Learners",
  Workshops: "Workshops",
  "Tutoring Programs": "Tutoring Programs",
  "Test Prep Programs": "Test Prep",
  Uncategorized: "STEAM Programs",
};

/**
 * Near-duplicate WordPress tags folded into one canonical tag.
 *
 * Tags were added post by post over five years, so the same idea accumulated
 * several spellings — "tutor", "tutoring" and "private tutoring" sat on almost
 * the same posts, and half the tag list was one-post dead ends that could not
 * lead a reader anywhere.
 *
 * The line drawn here is synonyms and spelling variants only. Distinct topics
 * that merely happen to be rare — ADHD, Drones, Robots, Pathways Academy,
 * Reading Mastery, anxiety in children, Global Careers — keep their own tag
 * even at one post each. Collapsing those would lose real meaning rather than
 * remove duplication.
 *
 * Merging here rather than in WordPress leaves Joe's tags untouched at the
 * source and keeps it reversible: delete an entry and the next import splits
 * the tag back out. Keys are matched case-insensitively.
 */
const TAG_ALIASES = {
  // Tutoring
  tutor: "Tutoring",
  tutoring: "Tutoring",
  "private tutoring": "Tutoring",

  // Testing. SAT and ACT stay distinct from each other and from the general
  // testing tag — they are the terms families actually search for.
  sat: "SAT",
  "sat test prep": "SAT",
  act: "ACT",
  "act test prep": "ACT",
  "test prep": "Test Prep",
  "standardized testing": "Test Prep",
  "standardized tests": "Test Prep",
  "test-optional": "Test Prep",

  // STEAM. Resource Room brands its own programs STEAM, so that wins over STEM.
  steam: "STEAM",
  stem: "STEAM",

  // Autism kept separate from neurodiversity: one is a diagnosis families
  // search by name, the other is the broader umbrella.
  autism: "Autism",
  "autism support": "Autism",
  "autism resources": "Autism",
  "autism parenting": "Autism",
  "neurodiverse learners": "Neurodiversity",
  "neurodiverse students": "Neurodiversity",
  neurodiversity: "Neurodiversity",

  // ABA
  "aba services": "ABA",
  "aba therapy": "ABA",
  "applied behavior analysis": "ABA",
  "behavior therapy": "ABA",
  "choosing an aba provider": "ABA",

  // Special education
  "special education": "Special Education",
  "iep support": "Special Education",
  "disability support": "Special Education",
  "inclusive learning": "Special Education",

  // College
  college: "College Prep",
  "college prep": "College Prep",
  "college admissions": "College Prep",
  "college planning": "College Prep",
  "admissions strategy": "College Prep",
  "north carolina colleges": "North Carolina Colleges",
  "unc chapel hill": "North Carolina Colleges",
  "unc system": "North Carolina Colleges",
  "financial aid": "Financial Aid & Scholarships",
  scholarships: "Financial Aid & Scholarships",
  "merit scholarships": "Financial Aid & Scholarships",
  "affordable college education": "Financial Aid & Scholarships",
  "high school juniors": "High School",
  "high school seniors": "High School",

  // Language
  "second language": "Second Language",
  "language clubs": "Second Language",
  "language courses": "Second Language",
  multilingualism: "Second Language",
  "study abroad": "Study Abroad",
  "study abroad programs": "Study Abroad",

  // Thinking skills
  "critical thinking skills": "Critical Thinking",
  "analytical skills": "Critical Thinking",
  "problem-solving skills": "Critical Thinking",
  "informed decision making": "Critical Thinking",

  // Audience and place. "North Carolina" is the safe canonical: a post about
  // Holly Springs is also about NC, but not the reverse.
  "parent resources": "Parent Resources",
  "parent support": "Parent Resources",
  "holly springs nc": "North Carolina",
  "north carolina": "North Carolina",

  // Casing only — no merge. Every tag the map touches comes out title-cased,
  // so these two would otherwise be the only lowercase entries in the cloud.
  "remote learning": "Remote Learning",
  "anxiety in children": "Anxiety in Children",
};

function canonicalTag(name) {
  return TAG_ALIASES[name.toLowerCase()] ?? name;
}

/**
 * Blog authorship.
 *
 * Answer engines and Google both weight author identity heavily when deciding
 * whether to cite a source, and "written by a logo" is the weakest possible
 * signal — especially on a site whose whole argument is that real credentialed
 * educators run the programs.
 *
 * The live WordPress site publishes no byline and its users endpoint is locked,
 * so the ids cannot be resolved to names automatically. Joe is the stated
 * author of the whole blog, so he is the default and every post gets him.
 *
 * `description` is the load-bearing field: it is what carries the credentials
 * into the Person node, which is where the E-E-A-T value actually sits.
 */
const DEFAULT_AUTHOR = {
  name: "Joe Cuccurullo",
  jobTitle: "Co-founder, Resource Room Learning Center",
  url: "/about",
  image: "/images/joe-cuccurullo.jpg",
  description:
    "Licensed special education teacher who has taught in the New York City and Wake County (WCPSS) public school systems, and served as a Behavior Support Teacher. Co-founded Resource Room in 2015 and leads its IEP and 504 advocacy.",
};

/**
 * Per-author overrides, keyed by WordPress author id.
 *
 * Deliberately empty. Two ids are in use in WordPress — 3 (24 posts) and 11
 * (8 posts) — and the users endpoint is locked down, so the ids alone could
 * not settle who wrote what. Joe confirmed on 2026-08-02 that all 32 are his;
 * the two ids are the same person under two logins. Everything therefore falls
 * back to DEFAULT_AUTHOR by design, not by omission.
 *
 * If a second writer joins, add an entry keyed by their WordPress id.
 */
const BLOG_AUTHORS = {};

function authorFor(id) {
  return BLOG_AUTHORS[id] ?? DEFAULT_AUTHOR;
}

async function getAll(endpoint) {
  const out = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${WP}/${endpoint}?per_page=100&page=${page}`, {
      headers: { "User-Agent": UA },
    });
    if (!res.ok) break;
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    out.push(...batch);
    if (page >= Number(res.headers.get("x-wp-totalpages") || 1)) break;
  }
  return out;
}

const NAMED_ENTITIES = {
  nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'",
  hellip: "…", mdash: "—", ndash: "–", rsquo: "’", lsquo: "‘",
  ldquo: "“", rdquo: "”", eacute: "é", deg: "°", trade: "™",
  reg: "®", copy: "©", times: "×", middot: "·", bull: "•",
};

function decode(text = "") {
  return String(text)
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => NAMED_ENTITIES[name.toLowerCase()] ?? match);
}

/**
 * Turns escaped markup back into real tags.
 *
 * Several posts were authored by pasting HTML into the WordPress editor, which
 * escaped the opening bracket but often not the closing one — the body arrives
 * containing literal `&lt;h2>…&lt;/h2>`. Left alone that renders as visible
 * angle brackets to the reader. Only tag-shaped sequences are converted, so
 * prose like "5 &lt; 10" is left as it is.
 */
function unescapeTags(html = "") {
  return html.replace(
    /&lt;(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s[^<>]*?)?)(?:&gt;|>)/g,
    (_match, slash, tag, attrs) => `<${slash}${tag}${attrs ?? ""}>`,
  );
}

/** Collapses a WordPress HTML blob down to plain paragraphs. */
function toParagraphs(html = "") {
  let t = unescapeTags(html);
  t = t.replace(/<!--[\s\S]*?-->/g, " ");
  t = t.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ");
  t = t.replace(/<\/(p|div|li|h[1-6]|tr|blockquote)>/gi, "\n");
  t = t.replace(/<br[^>]*>/gi, "\n");
  t = t.replace(/<[^>]+>/g, " ");
  t = decode(t);
  // Decoding can expose further escaped markup; clear whatever it revealed.
  t = t.replace(/<[^>]+>/g, " ");
  t = t.replace(/[ \t ]+/g, " ");
  return t
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

const ALLOWED = new Set([
  "p", "h2", "h3", "h4", "ul", "ol", "li", "a", "strong", "b", "em", "i",
  "blockquote", "figure", "figcaption", "img", "hr", "br", "table", "thead",
  "tbody", "tr", "th", "td",
]);

/**
 * Strips a WordPress post body back to semantic HTML.
 *
 * The newer posts were authored as complete HTML documents pasted into the
 * editor, inline styles and all, so this unwraps the document, drops every
 * presentational attribute, and keeps only the tags the article styles cover.
 * Headings are demoted where needed so the page keeps a single h1.
 */
function cleanPostHtml(html = "") {
  /*
   * First: turn half-escaped markup back into real tags. One post arrives as
   * `&lt;h2>…&lt;/h2>` throughout, and without this the reader sees the angle
   * brackets printed on the page instead of a heading. Doing it here rather
   * than downstream means the whitelist below still governs what survives.
   */
  let t = unescapeTags(html);

  t = t.replace(/<!--[\s\S]*?-->/g, "");
  t = t.replace(/<(script|style|head|title|meta|link)[^>]*>[\s\S]*?<\/\1>/gi, "");
  t = t.replace(/<(meta|link)[^>]*>/gi, "");
  t = t.replace(/<!DOCTYPE[^>]*>/gi, "");

  // Unwrap the pasted document down to its body, then its article.
  const body = t.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (body) t = body[1];
  const article = t.match(/<article[^>]*>([\s\S]*)<\/article>/i);
  if (article) t = article[1];

  t = t.replace(/<\/?(html|body|article|section|main|header|footer|nav|div|span)[^>]*>/gi, "");
  t = t.replace(/<h1([^>]*)>/gi, "<h2$1>").replace(/<\/h1>/gi, "</h2>");

  // Drop every attribute except href/src/alt, which carry meaning.
  t = t.replace(/<([a-zA-Z0-9]+)((?:\s+[^>]*)?)>/g, (match, tag, attrs) => {
    const name = tag.toLowerCase();
    if (!ALLOWED.has(name)) return "";
    const keep = [];
    const href = attrs.match(/\shref\s*=\s*["']([^"']*)["']/i);
    const src = attrs.match(/\ssrc\s*=\s*["']([^"']*)["']/i);
    const alt = attrs.match(/\salt\s*=\s*["']([^"']*)["']/i);
    if (name === "a" && href) keep.push(`href="${href[1]}"`);
    if (name === "img" && src) keep.push(`src="${src[1]}"`);
    if (name === "img") keep.push(`alt="${alt ? alt[1] : ""}"`, 'loading="lazy"');
    return `<${name}${keep.length ? " " + keep.join(" ") : ""}>`;
  });
  t = t.replace(/<\/([a-zA-Z0-9]+)>/g, (match, tag) =>
    ALLOWED.has(tag.toLowerCase()) ? `</${tag.toLowerCase()}>` : "",
  );

  t = t.replace(/<p>\s*<\/p>/g, "");
  t = t.replace(/\s{2,}/g, " ");
  t = t.replace(/>\s+</g, ">\n<");
  t = t.trim();

  /*
   * Contiguous heading levels.
   *
   * Five 2021 posts open straight at h3 with no h2, so the page outline jumps
   * h1 -> h3. Rather than rewrite them in WordPress, the levels are normalised
   * on import: the shallowest heading present becomes h2 and the rest shift by
   * the same amount, which preserves the author's relative structure while
   * removing the skip. Capped at h4 so nothing lands below the styles.
   */
  const levels = [...t.matchAll(/<h([2-4])[^>]*>/g)].map((m) => Number(m[1]));
  if (levels.length) {
    const shift = Math.min(...levels) - 2;
    if (shift > 0) {
      t = t.replace(/<(\/?)h([2-4])>/g, (_m, slash, level) => {
        const next = Math.min(4, Math.max(2, Number(level) - shift));
        return `<${slash}h${next}>`;
      });
    }
  }

  return t;
}

function extFromUrl(url) {
  const clean = url.split("?")[0];
  const ext = path.extname(clean);
  return ext || ".jpg";
}

async function download(url, destDir, baseName) {
  if (!url) return null;
  await mkdir(destDir, { recursive: true });
  const dest = path.join(destDir, `${baseName}${extFromUrl(url)}`);
  if (existsSync(dest)) return dest;
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return null;
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    return dest;
  } catch {
    return null;
  }
}

/** Pulls every WooCommerce price shown on a product page. */
async function scrapePrices(url) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return null;
    const html = await res.text();
    const summary = html.match(/<p class="price">([\s\S]*?)<\/p>/i);
    const scope = summary ? summary[1] : "";
    const amounts = [
      ...scope.matchAll(/woocommerce-Price-amount amount[^>]*>[\s\S]*?&#36;<\/span>([\d,.]+)/g),
    ].map((m) => Number(m[1].replace(/,/g, "")));
    if (!amounts.length) return null;
    return { low: Math.min(...amounts), high: Math.max(...amounts) };
  } catch {
    return null;
  }
}

/** "Exploration of Drones: Coding with Tello (Grades 6-8)" -> "Grades 6-8" */
function gradesFrom(name) {
  const m = name.match(/\(?\b((?:Grades?|K)[^)]*?)\)?\s*$/i);
  if (!m) return null;
  const value = m[1].trim().replace(/^[-–—\s]+/, "");
  return /grade|^k\b/i.test(value) ? value : null;
}

function esc(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function tsString(value) {
  return `\`${esc(value)}\``;
}

async function main() {
  console.log("fetching WordPress content…");
  const [posts, categories, products, productCats, media, tags, productTags] =
    await Promise.all([
      getAll("posts"),
      getAll("categories"),
      getAll("product"),
      getAll("product_cat"),
      getAll("media"),
      getAll("tags"),
      getAll("product_tag"),
    ]);
  console.log(
    `  ${posts.length} posts · ${products.length} products · ${media.length} media`,
  );

  const mediaById = new Map(media.map((m) => [m.id, m]));
  const catById = new Map(categories.map((c) => [c.id, c]));
  const tagById = new Map(tags.map((t) => [t.id, t]));
  const productCatById = new Map(productCats.map((c) => [c.id, c]));

  // ---------------------------------------------------------------- blog ---
  const blogDir = path.join(ROOT, "public", "images", "blog");
  const blogEntries = [];

  for (const post of posts) {
    const featured = mediaById.get(post.featured_media);
    const saved = featured ? await download(featured.source_url, blogDir, post.slug) : null;

    let html = cleanPostHtml(post.content.rendered);

    // Inline images point at wp-content; pull them local and rewrite.
    const srcs = [...html.matchAll(/<img src="([^"]+)"/g)].map((m) => m[1]);
    let inlineIndex = 0;
    for (const src of srcs) {
      if (!src.startsWith("http")) continue;
      const file = await download(src, blogDir, `${post.slug}-inline-${++inlineIndex}`);
      if (file) html = html.split(src).join(`/images/blog/${path.basename(file)}`);
    }

    const bodyText = toParagraphs(html).join(" ");

    /*
     * WordPress auto-excerpts the raw post body, and the newer posts open with
     * a pasted <title> tag — so those excerpts start with the headline and the
     * site name. Take the first real paragraph of the cleaned body instead and
     * fall back to the WordPress excerpt only when there isn't one.
     */
    const firstParagraph = toParagraphs(html).find((line) => line.split(/\s+/).length > 12);
    let excerpt = firstParagraph ?? toParagraphs(post.excerpt.rendered).join(" ");
    excerpt = excerpt.replace(/\s*\[…\]\s*$/, "").trim();
    if (excerpt.length > 260) {
      excerpt = `${excerpt.slice(0, 257).replace(/[\s,;:]+\S*$/, "")}…`;
    }

    blogEntries.push({
      slug: post.slug,
      title: decode(post.title.rendered),
      date: post.date.slice(0, 10),
      /*
       * Freshness signal. Several posts were back-dated in WordPress, so
       * `modified` can land *before* `date` — emitting that as dateModified
       * would be nonsense schema. Clamped to never precede publication.
       */
      modified:
        post.modified.slice(0, 10) > post.date.slice(0, 10)
          ? post.modified.slice(0, 10)
          : post.date.slice(0, 10),
      /*
       * WordPress author id. The users endpoint is locked (401) and no byline
       * is rendered anywhere on the live site, so names are not derivable —
       * see BLOG_AUTHORS above.
       */
      authorId: post.author ?? null,
      categories: post.categories
        .map((id) => catById.get(id)?.name)
        .filter((n) => n && n !== "Uncategorized")
        .map(decode),
      /*
       * A handful of WordPress tags are entire sentences pasted into the tag
       * field ("homeschool-co-op-holly-springs-nc-wake-county-…"). Those make a
       * useless tag page and wreck a tag cloud, so anything past six words is
       * dropped rather than shown.
       */
      /* Deduped after aliasing: a post carrying both "tutor" and "tutoring"
         would otherwise end up with "Tutoring" listed twice. */
      tags: [
        ...new Set(
          post.tags
            .map((id) => tagById.get(id)?.name)
            .filter(Boolean)
            .map(decode)
            .filter((name) => name.split(/\s+/).length <= 6)
            .map(canonicalTag),
        ),
      ],
      excerpt: excerpt || bodyText.slice(0, 240),
      readingMinutes: Math.max(1, Math.round(bodyText.split(/\s+/).length / 220)),
      image: saved ? `/images/blog/${path.basename(saved)}` : null,
      imageAlt: decode(featured?.alt_text || "") || decode(post.title.rendered),
      html,
      /* Plain body text, for the client-side search index. */
      plain: bodyText,
      legacyPath: new URL(post.link).pathname,
    });
  }

  blogEntries.sort((a, b) => (a.date < b.date ? 1 : -1));

  /*
   * WordPress taxonomy archives. The category slug WordPress uses is not
   * always the slug our own category pages derive from the display name
   * ("Tutoring" lives at /category/tutoring-2 there), so both are carried.
   */
  const usedCategoryNames = new Set(blogEntries.flatMap((post) => post.categories));
  const legacyCategories = categories
    .filter((c) => usedCategoryNames.has(decode(c.name)))
    .map((c) => ({ from: `/category/${c.slug}`, category: decode(c.name) }));
  /*
   * Tag archives now exist on the new site, so a WordPress tag maps onto ours
   * whenever the name survived the length filter above. The rest fall back to
   * the blog index.
   */
  /*
   * Resolved through the alias map, so a merged tag's old WordPress URL lands
   * on the canonical archive — /tag/private-tutoring goes to /blog/tag/tutoring
   * rather than 404ing on a page that no longer exists.
   */
  const keptTagNames = new Set(blogEntries.flatMap((post) => post.tags));
  const legacyTags = tags.map((t) => {
    const canonical = canonicalTag(decode(t.name));
    return {
      from: `/tag/${t.slug}`,
      tag: keptTagNames.has(canonical) ? canonical : null,
    };
  });

  const blogFile = `${header("blog posts", "blog")}
export type BlogPost = {
  slug: string;
  title: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  /** Last edit, never earlier than publication. Feeds schema dateModified. */
  modified: string;
  /** Named author. The description carries credentials into Person schema. */
  author: { name: string; jobTitle?: string; url?: string; image?: string; description?: string };
  categories: string[];
  tags: string[];
  excerpt: string;
  readingMinutes: number;
  image: string | null;
  imageAlt: string;
  /** Sanitised article body. Only the tags the article styles cover survive. */
  html: string;
  /**
   * Body as plain text. Server-side only — feeds the search index the blog
   * page builds, and must never be shipped to the browser whole.
   */
  plain: string;
  /** The URL this lived at on WordPress, used to build redirects. */
  legacyPath: string;
};

export const posts: BlogPost[] = [
${blogEntries
  .map(
    (p) => `  {
    slug: ${tsString(p.slug)},
    title: ${tsString(p.title)},
    date: ${tsString(p.date)},
    modified: ${tsString(p.modified)},
    author: {
      name: ${tsString(authorFor(p.authorId).name)},
      jobTitle: ${tsString(authorFor(p.authorId).jobTitle)},
      url: ${tsString(authorFor(p.authorId).url)},
      image: ${tsString(authorFor(p.authorId).image)},
      description: ${tsString(authorFor(p.authorId).description)},
    },
    categories: [${p.categories.map(tsString).join(", ")}],
    tags: [${p.tags.map(tsString).join(", ")}],
    excerpt: ${tsString(p.excerpt)},
    readingMinutes: ${p.readingMinutes},
    image: ${p.image ? tsString(p.image) : "null"},
    imageAlt: ${tsString(p.imageAlt)},
    legacyPath: ${tsString(p.legacyPath)},
    plain: ${tsString(p.plain)},
    html: ${tsString(p.html)},
  },`,
  )
  .join("\n")}
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}

export const blogCategories = [...new Set(posts.flatMap((post) => post.categories))].sort();

/** Every tag with its post count, most-used first — drives the tag cloud. */
export const blogTags: { name: string; count: number }[] = (() => {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
})();

/**
 * WordPress taxonomy archives that need somewhere to land after the cutover.
 * Both map onto the equivalent archive here; a tag we dropped as unusable
 * falls back to the blog index rather than 404.
 */
export const legacyCategoryPaths: { from: string; category: string }[] = [
${legacyCategories.map((c) => `  { from: ${tsString(c.from)}, category: ${tsString(c.category)} },`).join("\n")}
];

export const legacyTagPaths: { from: string; tag: string | null }[] = [
${legacyTags.map((t) => `  { from: ${tsString(t.from)}, tag: ${t.tag ? tsString(t.tag) : "null"} },`).join("\n")}
];
`;

  await writeFile(path.join(ROOT, "src", "content", "blog.ts"), blogFile, "utf8");
  console.log(`  wrote src/content/blog.ts (${blogEntries.length} posts)`);

  // ------------------------------------------------------------- courses ---
  const courseDir = path.join(ROOT, "public", "images", "courses");
  const courseEntries = [];

  for (const product of products) {
    if (PROGRAM_PRODUCTS.has(product.slug)) continue;

    const featured = mediaById.get(product.featured_media);
    const saved = featured ? await download(featured.source_url, courseDir, product.slug) : null;
    const price = await scrapePrices(product.link);

    const rawCats = product.product_cat
      .map((id) => decode(productCatById.get(id)?.name || ""))
      .filter(Boolean);
    const group =
      rawCats.map((c) => CATEGORY_MAP[c]).find(Boolean) ?? "STEAM Programs";
    const name = decode(product.title.rendered);

    courseEntries.push({
      slug: product.slug,
      name,
      group,
      grades: gradesFrom(name),
      summary: toParagraphs(product.excerpt.rendered).join(" "),
      body: toParagraphs(product.content.rendered),
      price,
      image: saved ? `/images/courses/${path.basename(saved)}` : null,
      imageAlt: decode(featured?.alt_text || "") || name,
      legacyPath: new URL(product.link).pathname,
    });
  }

  courseEntries.sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name));

  const coursesFile = `${header("course catalog", "courses")}
export type Course = {
  slug: string;
  name: string;
  /** The catalog group this course is listed under. */
  group: string;
  /** Grade band pulled off the course title, where it states one. */
  grades: string | null;
  summary: string;
  /** Course description, one entry per paragraph. */
  body: string[];
  /** Published rate. Null where the live site quotes on consultation. */
  price: { low: number; high: number } | null;
  image: string | null;
  imageAlt: string;
  /** The URL this lived at on WordPress, used to build redirects. */
  legacyPath: string;
};

export const courses: Course[] = [
${courseEntries
  .map(
    (c) => `  {
    slug: ${tsString(c.slug)},
    name: ${tsString(c.name)},
    group: ${tsString(c.group)},
    grades: ${c.grades ? tsString(c.grades) : "null"},
    summary: ${tsString(c.summary)},
    price: ${c.price ? `{ low: ${c.price.low}, high: ${c.price.high} }` : "null"},
    image: ${c.image ? tsString(c.image) : "null"},
    imageAlt: ${tsString(c.imageAlt)},
    legacyPath: ${tsString(c.legacyPath)},
    body: [
${c.body.map((line) => `      ${tsString(line)},`).join("\n")}
    ],
  },`,
  )
  .join("\n")}
];

export function getCourse(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug);
}

export const courseGroups = [...new Set(courses.map((course) => course.group))];

export function coursesInGroup(group: string): Course[] {
  return courses.filter((course) => course.group === group);
}

/**
 * WooCommerce product-tag archives. Thin, near-duplicate pages with no
 * equivalent here, so they fold back into the catalog rather than 404.
 */
export const legacyProductTagPaths: string[] = [
${productTags.map((t) => `  ${tsString(`/product-tag/${t.slug}`)},`).join("\n")}
];
`;

  await writeFile(path.join(ROOT, "src", "content", "courses.ts"), coursesFile, "utf8");
  console.log(`  wrote src/content/courses.ts (${courseEntries.length} courses)`);
}

function header(what, file) {
  return `/**
 * GENERATED FILE — do not edit by hand.
 *
 * Imported from the ${what} on resourceroomnc.com by
 * \`node scripts/import-wordpress.mjs\`. Re-running the script overwrites this
 * file wholesale, so make content changes in WordPress and re-import.
 *
 * Source of truth: https://resourceroomnc.com/wp-json/wp/v2 (${file})
 */
`;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
