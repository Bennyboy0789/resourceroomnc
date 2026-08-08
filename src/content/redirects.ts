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
  ["/tutoring", "/programs/tutoring"],
  ["/test-prep", "/programs/sat-act-prep"],
  ["/camps", "/programs/camps"],
  ["/stem", "/courses#steam-programs"],
  ["/lego-robotics", "/courses#lego-robotics"],
  ["/gaming-education", "/courses#gaming-education"],
  ["/emerging-learners-courses", "/courses#emerging-learners"],
  /* NOT redirected: /tutoring-packages-policies is a real page again — the
     unlisted rate card. A redirect here would win over the route and make the
     page unreachable, which is what happened to /tutoring and /camps. */
  /* Both were linked from imported blog posts but had no entry here, so they
     404'd once those links were made site-relative. */
  ["/aba", "/programs/aba-services"],
  ["/college-admissions", "/programs/college-prep"],
  /* Two imported posts carry a "Related Reading" link to this 2021 post, which
     the WordPress import did not bring across. Rather than leave a dead link in
     published copy, it goes to the page that answers the same question. */
  ["/2021/10/01/what-should-i-take-the-sat-the-act-or-both", "/programs/sat-act-prep"],
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
  ["/product/private-tutoring-for-all-subjects-in-nc", "/programs/tutoring/private-tutoring"],
  ["/product/teacher-workdays", "/programs/camps/track-out-teacher-workday"],
  ["/product/stem", "/programs/camps/summer-camp"],
  ["/product/sat-prep-in-north-carolina", "/programs/sat-act-prep/sat-prep"],
  ["/product/act-prep-in-north-carolina", "/programs/sat-act-prep/act-prep"],
  ["/product/pathways-academy", "/programs/pathways-academy"],
  ["/product/homeschool-co-op-holly-springs-nc", "/programs/homeschool-co-op/homeschool-co-op"],
  ["/product/aba-educational-support", "/programs/aba-services"],
  ["/product/college-admissions", "/programs/college-prep/college-admissions"],
  ["/product/iep-advocacy", "/programs/iep-504-advocate"],
  ["/product/executive-functioning-coaching-and-support", "/programs/executive-functioning"],
  /* Executive Functioning briefly had a product page under Tutoring. It was
     removed at Joe's request and now lives only on its own program page, so
     the old path is caught rather than left to 404. */
  ["/programs/tutoring/executive-functioning", "/programs/executive-functioning"],
  ["/product/summer-bridge-programs-in-nc", "/programs/tutoring/summer-bridge"],

  /* Four catalog courses promoted to product pages so they could go in the
     Tutoring menu — a page in the primary nav should not be noindex. They are
     no longer in content/courses.ts, so both the WordPress path and the
     /courses path they briefly held are caught here rather than generated.
     Virtual Tutoring also drops the "zoom" slug it inherited from Woo. */
  ["/product/end-of-course-end-of-grade-exams", "/programs/tutoring/end-of-course-end-of-grade-exams"],
  ["/courses/end-of-course-end-of-grade-exams", "/programs/tutoring/end-of-course-end-of-grade-exams"],
  ["/product/homework-help", "/programs/tutoring/homework-help"],
  ["/courses/homework-help", "/programs/tutoring/homework-help"],
  ["/product/students-with-ieps", "/programs/tutoring/students-with-ieps"],
  ["/courses/students-with-ieps", "/programs/tutoring/students-with-ieps"],
  ["/product/zoom-tutoring", "/programs/tutoring/virtual-tutoring"],
  ["/courses/zoom-tutoring", "/programs/tutoring/virtual-tutoring"],

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
