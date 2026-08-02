import type { BlogPost } from "@/content/blog";

/** Shared helpers for the imported WordPress blog. */

/** How many posts render per archive page. */
export const POSTS_PER_PAGE = 9;

/** "ACT/SAT Test Prep Resources" -> "act-sat-test-prep-resources" */
export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Tags slug the same way; kept separate so the two can diverge later. */
export const tagSlug = categorySlug;

/** Dates are stored as plain YYYY-MM-DD, so format them without a timezone. */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export type Page<T> = {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
};

export function paginate<T>(items: T[], page: number, perPage = POSTS_PER_PAGE): Page<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  return {
    items: items.slice((current - 1) * perPage, current * perPage),
    page: current,
    totalPages,
    total: items.length,
  };
}

/**
 * The shape search runs against in the browser.
 *
 * Deliberately not the full `BlogPost`: those carry the entire sanitised
 * article HTML, and shipping 32 of them to the client would be a ~320KB
 * payload for a search box. This trims to the fields the results list renders
 * plus a bounded slice of body text.
 */
export type SearchEntry = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  categories: string[];
  tags: string[];
  image: string | null;
  imageAlt: string;
  readingMinutes: number;
  /** Lowercased haystack: title, categories, tags and the opening body text. */
  haystack: string;
};

/** How much body text each entry contributes to the index. */
const BODY_CHARS = 1200;

export function buildSearchIndex(posts: BlogPost[]): SearchEntry[] {
  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    categories: post.categories,
    tags: post.tags,
    image: post.image,
    imageAlt: post.imageAlt,
    readingMinutes: post.readingMinutes,
    haystack: [
      post.title,
      post.excerpt,
      post.categories.join(" "),
      post.tags.join(" "),
      post.plain.slice(0, BODY_CHARS),
    ]
      .join(" ")
      .toLowerCase(),
  }));
}

/**
 * Ranked substring search.
 *
 * Every term must appear somewhere in the entry, so adding words narrows
 * rather than widens — which is what people expect from a search box. Matches
 * in the title outrank matches buried in the body.
 */
export function searchPosts(index: SearchEntry[], query: string): SearchEntry[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  return index
    .map((entry) => {
      const title = entry.title.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (!entry.haystack.includes(term)) return null;
        if (title.includes(term)) score += 10;
        if (entry.tags.some((tag) => tag.toLowerCase().includes(term))) score += 4;
        if (entry.categories.some((category) => category.toLowerCase().includes(term))) score += 3;
        score += 1;
      }
      return { entry, score };
    })
    .filter((hit): hit is { entry: SearchEntry; score: number } => hit !== null)
    .sort((a, b) => b.score - a.score || (a.entry.date < b.entry.date ? 1 : -1))
    .map((hit) => hit.entry);
}
