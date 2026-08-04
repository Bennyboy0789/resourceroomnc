// Relative rather than aliased: next.config.ts loads this file directly, and
// the `@/` path alias is not resolved in the config's module graph.
import { courses, legacyProductTagPaths } from "./courses";
import { legacyCategoryPaths, legacyTagPaths, posts } from "./blog";
import { categorySlug, tagSlug } from "../lib/blog";

/**
 * Permanent redirects from the WordPress site this replaces.
 *
 * Every URL that was in resourceroomnc.com's sitemap needs to land somewhere
 * on the new site, or the cutover drops the ranking and every inbound link
 * built since 2015. The generated sections below are derived from the imported
 * content, so a re-import keeps them in sync automatically.
 *
 * Blog posts keep their dated WordPress permalinks as redirect sources
 * (/2026/06/09/slug/) but live at /blog/slug going forward.
 */

export type Redirect = { source: string; destination: string; permanent: boolean };

/** Pages and product URLs that map onto a hand-written page. */
const MANUAL: [source: string, destination: string][] = [
  // --- top-level pages -----------------------------------------------------
  ["/about-resource-room-learning-center", "/about"],
  ["/about-resource-room-learning-center/preferred-partners", "/about/preferred-partners"],
  ["/courses", "/courses"],
  ["/course-catalog", "/courses"],
  ["/request-a-consultation-form", "/contact"],
  /* /tutoring and /camps are real pages again — they are two of the four
     category routes — so they must NOT be listed here. A redirect would win
     over the route and the page would be unreachable. /test-prep is the one
     live category URL whose name changed, at Joe's request. */
  ["/test-prep", "/college-prep"],
  ["/stem", "/courses#steam-programs"],
  ["/lego-robotics", "/courses#lego-robotics"],
  ["/gaming-education", "/courses#gaming-education"],
  ["/emerging-learners-courses", "/courses#emerging-learners"],
  ["/tutoring-packages-policies", "/programs/tutoring"],
  ["/event-calendar", "/programs/camps"],
  ["/under-construction", "/"],

  // --- WooCommerce checkout flow -------------------------------------------
  ["/cartflows_step/checkout-page", "/cart"],
  ["/cartflows_step/checkout-page-2", "/cart"],
  ["/cartflows_step/checkout-page-3", "/cart"],
  ["/cartflows_step/thank-you-page", "/enrollment/confirmed"],
  ["/cartflows_step/thank-you-page-2", "/enrollment/confirmed"],
  ["/cartflows_step/thank-you-page-3", "/enrollment/confirmed"],
  ["/cart-2", "/cart"],
  ["/checkout", "/cart"],
  ["/checkout-2", "/cart"],
  ["/checkout-3", "/cart"],
  ["/order-confirmation", "/enrollment/confirmed"],
  ["/order-failed", "/cart"],
  ["/order-failed-2", "/cart"],

  // --- products that became program pages ----------------------------------
  ["/product/private-tutoring-for-all-subjects-in-nc", "/programs/tutoring"],
  ["/product/teacher-workdays", "/programs/camps"],
  ["/product/stem", "/programs/camps"],
  ["/product/sat-prep-in-north-carolina", "/programs/sat-act-prep"],
  ["/product/act-prep-in-north-carolina", "/programs/sat-act-prep"],
  ["/product/pathways-academy", "/programs/pathways-academy"],
  ["/product/homeschool-co-op-holly-springs-nc", "/programs/homeschool-co-op"],
  ["/product/aba-educational-support", "/programs/aba-services"],
  ["/product/college-admissions", "/programs/college-prep"],
  ["/product/iep-advocacy", "/programs/iep-504-advocate"],
  ["/product/executive-functioning-coaching-and-support", "/programs/executive-functioning"],
  ["/product/summer-bridge-programs-in-nc", "/programs/summer-bridge"],

  // --- WooCommerce category archives ---------------------------------------
  ["/product-category/steam-programs", "/courses#steam-programs"],
  ["/product-category/lego-robotics", "/courses#lego-robotics"],
  ["/product-category/gaming-education", "/courses#gaming-education"],
  ["/product-category/emerging-learners-programs", "/courses#emerging-learners"],
  ["/product-category/workshops", "/courses#workshops"],
  ["/product-category/tutoring-programs", "/programs/tutoring"],
  ["/product-category/test-prep-programs", "/programs/sat-act-prep"],
  ["/product-category/structured-daytime-learning", "/programs"],
  ["/product-category/iep-504-advocate", "/programs/iep-504-advocate"],
  ["/product-category/uncategorized", "/courses"],
];

/** Strips WordPress's trailing slash so sources match Next's normalised paths. */
function normalise(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

export function getRedirects(): Redirect[] {
  const seen = new Set<string>();
  const all: Redirect[] = [];

  const add = (source: string, destination: string) => {
    const from = normalise(source);
    if (from === destination || seen.has(from)) return;
    seen.add(from);
    all.push({ source: from, destination, permanent: true });
  };

  for (const [source, destination] of MANUAL) add(source, destination);

  // Every remaining /product/* URL now lives in the course catalog.
  for (const course of courses) add(course.legacyPath, `/courses/${course.slug}`);

  // Dated WordPress permalinks -> /blog/slug.
  for (const post of posts) add(post.legacyPath, `/blog/${post.slug}`);

  // Blog category archives -> our category pages. WordPress's own slug and
  // ours are derived differently, so the mapping goes through the name.
  for (const { from, category } of legacyCategoryPaths) {
    add(from, `/blog/category/${categorySlug(category)}`);
  }
  add("/category/uncategorized", "/blog");

  // Tag archives now exist here, so a WordPress tag lands on its own page
  // where the name survived import; the unusable ones fold into the index.
  for (const { from, tag } of legacyTagPaths) {
    add(from, tag ? `/blog/tag/${tagSlug(tag)}` : "/blog");
  }

  // WooCommerce product tags have no equivalent — thin, near-duplicate pages.
  for (const path of legacyProductTagPaths) add(path, "/courses");

  return all;
}
