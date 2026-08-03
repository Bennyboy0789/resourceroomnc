# SEO Audit — Resource Room NC (pre-launch build)

**Audited:** 2026-08-02
**Target:** the Next.js rebuild, served from a production build on localhost
**Pages crawled:** 114 (0 errors, 0 non-200 responses)
**Business type:** Local service — brick-and-mortar educational services, Holly Springs NC
**Industry signals:** learning center, private high school, tutoring, camps, IEP advocacy

---

## SEO Health Score: 96 / 100

Audited at 86, then fixed across three rounds. Every number below was
re-measured against a rebuilt site, not estimated.

| Category | Weight | Score | Weighted | Change |
| --- | ---: | ---: | ---: | --- |
| Technical SEO | 22% | 98 | 21.6 | ▲ from 88 |
| Content Quality | 23% | 96 | 22.1 | ▲ from 92 |
| On-Page SEO | 20% | 96 | 19.2 | ▲ from 78 |
| Schema / Structured Data | 10% | 99 | 9.9 | ▲ from 90 |
| Performance (CWV) | 10% | 90 | 9.0 | ▲ from 82 |
| AI Search Readiness | 10% | 94 | 9.4 | ▲ from 78 |
| Images | 5% | 96 | 4.8 | ▲ from 95 |
| **Total** | | | **96.0** | ▲ from 85.9 |

### Measured before and after

| Check | Before | After |
| --- | ---: | ---: |
| Pages missing `og:image` | 60 | **0** |
| Meta descriptions > 160 chars | 48 | **0** |
| Titles > 60 chars | 33 | **0** ¹ |
| Duplicate titles | 1 | **0** |
| Heading-level skips | 5 | **0** |
| Pages with question headings | 21 | **49** (130 questions) |
| `FAQPage` schema | 4 pages | **28 pages** |
| Security headers sent | 0 | **6** |
| Homepage transfer | 756KB | **511KB** |
| Contact page transfer | 557KB | **114KB** |
| CLS (every page) | 0.000 | 0.000 |
| Missing `alt` attributes | 0 of 890 | **0 of 908** |
| Schema parse errors | 0 | 0 |
| Orphan pages | 0 | 0 |

¹ Three titles measure 61 characters in raw HTML but 57 once `&amp;` decodes to
`&`, which is what a SERP renders. Nothing truncates.

---

## What this audit could not measure

Several of these matter, and none of them are things the code can fix.

| Not measured | Why | Consequence |
| --- | --- | --- |
| Field Core Web Vitals (CrUX) | No Google API key; site not deployed | The LCP figures are **localhost lab numbers with no network latency** and are not predictive. Only CLS is trustworthy. |
| Indexation, impressions, CTR | No Search Console access | Cannot confirm what Google actually indexes |
| Backlinks, Domain Authority | No Moz/Bing key; no public URL | No authority picture |
| Live SERP positions | No DataForSEO | No ranking baseline |
| Real security-header delivery | Headers are configured but only observable on the host | Configured and verified locally; **re-check after deploy** |
| Google Business Profile, citations, reviews | Requires the live listing | Local pack readiness assessed from on-page signals only |

---

## Technical SEO — 98

- `robots.txt` present, `Allow: /`, sitemap declared. No AI crawler blocked —
  GPTBot, ClaudeBot, PerplexityBot, CCBot and Google-Extended all have access.
- **0** crawl errors, **0** non-200s, **0** redirect chains across 114 pages.
- **114/114** pages carry a canonical, `lang="en"` and a viewport.
- **253** permanent (308) redirects from WordPress; all 244 legacy URLs resolve.
- Sitemap declares **84 URLs against 84 indexable pages** — no `noindex` URL is
  listed, and nothing indexable is missing.
- **Six security headers** now sent on every route: `X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`,
  `Strict-Transport-Security`, `X-DNS-Prefetch-Control`.

**Remaining**

| Severity | Finding |
| --- | --- |
| Medium | **No Content-Security-Policy.** Deliberately omitted: a wrong CSP silently breaks the Maps embed, Stripe checkout and inline JSON-LD. Needs writing against the real third-party origins and running in report-only mode first. |
| Note | HSTS is inert on localhost and only takes effect over HTTPS. Verify with `curl -I` against the live domain after cutover. |

30 pages are deliberately `noindex, follow`: 27 tag archives and 3 paginated
blog pages, all near-duplicate browse aids.

---

## Content Quality — 96

The strongest area of the site.

- **0 thin pages.** Median length **776 words**; the shortest clears 300.
- **0 heading-level skips** (was 5). Fixed in the importer, so it survives
  re-import rather than being patched in WordPress.
- E-E-A-T is unusually strong for a local service site: named practitioners
  with stated credentials (Joe Cuccurullo — licensed special ed teacher, NYC and
  WCPSS; Hunter Weber, M.A. BCBA LBA; Dr. Shannon Erklin, Ph.D.; Jolyn Welsh,
  M.S. CCC-SLP), a dated founding history, three named awards, 12 attributed
  reviews, and every blog post bylined to a named person with credentials.
- Average **10.7 headings per page**.
- **0** duplicate titles, **0** duplicate descriptions.

---

## On-Page SEO — 96

- **0** missing or over-length titles and descriptions. **0** missing H1s, **0**
  pages with multiple H1s, **0** orphan pages.
- Lengths are clamped at the source by `seoTitle()` / `seoDescription()` in
  `src/lib/seo.ts`, so new pages cannot reintroduce the problem. The brand
  suffix is dropped automatically when a title has no room for it.
- **0 pages missing `og:image`** (was 60). A brand card is generated at build
  time from `opengraph-image.tsx`; posts, courses and programs override it with
  their own artwork.

**Remaining**

| Severity | Finding | Count |
| --- | --- | ---: |
| Low | Pages with ≤ 2 inbound internal links | 14 |
| Low | Titles under 30 characters (under-using the space) | ~19 |

Every course now also appears on its parent program page, so the practical
internal linking is better than the raw inbound count suggests.

---

## Schema & Structured Data — 99

- **114/114 pages** carry structured data. **0** parse errors.

| Type | Pages |
| --- | ---: |
| EducationalOrganization + LocalBusiness | 114 |
| BlogPosting | 32 |
| FAQPage | 28 |
| Course | 24 |
| BreadcrumbList | 11 |
| Service | 10 |
| OfferCatalog | 1 |

`LocalBusiness` now carries `geo` (35.663466, -78.835116), `image`, `logo`,
`hasMap`, `priceRange`, `currenciesAccepted` and Saturday-by-appointment hours —
the full local-pack set.

**Remaining**

| Severity | Finding |
| --- | --- |
| — | `aggregateRating` is deliberately absent. Self-serving review markup violates Google's guidelines and risks a manual action; ratings belong on the GBP. Not a defect. |

---

## Performance (CWV) — 90

Localhost lab numbers, so treat LCP as unusable. CLS is real.

| Page | CLS | Transfer | Images | Requests |
| --- | ---: | ---: | ---: | ---: |
| `/` | 0.000 | 511KB ▼ from 756KB | 463KB | 73 |
| `/contact` | 0.000 | **114KB ▼ from 557KB** | 66KB | 42 |
| `/courses` | 0.000 | 251KB | 204KB | 60 |
| `/blog` | 0.000 | 361KB | 313KB | 80 |

- **CLS is 0.000 on every page.** No layout shift anywhere, including the
  image-heavy grids.
- Hero slideshow cut from 10 images to 5 — roughly a third off the homepage.
- The Google Maps iframe is now behind a click-to-load facade, which is the
  whole of the 80% saving on `/contact`. The address and a directions link are
  visible before anything loads.
- All imagery is WebP with correct responsive `srcset`; 34 of 37 homepage
  images lazy-load.

**Remaining:** `/blog` at 361KB is now the heaviest page — 32 post thumbnails.
Real Core Web Vitals still need measuring on the live host.

---

## Images — 96

- **908 images, 0 missing an `alt` attribute.** 281 intentionally empty
  (decorative).
- All WebP, all responsive.
- Explicit `width`/`height` absent on most, but they use `next/image` fill mode
  inside ratio-locked containers — which is why CLS is 0. Not a defect.

---

## AI Search Readiness (GEO) — 94

- **`/llms.txt`** — generated from live content, so it cannot drift. Carries the
  business summary, every program, all published rates, the credentialed staff,
  the full course catalog and recent posts.
- **`FAQPage` on 28 pages**; **49 pages carry 130 question-form headings**,
  marked up as real `<h3>` elements inside `<summary>` so the document outline
  agrees with the schema.
- **All 32 posts bylined to Joe Cuccurullo** as a `Person` with `jobTitle`,
  `worksFor` and a `description` carrying his licensure — matched by a visible
  byline and author box on every post.
- `dateModified` on all 32 posts, with a visible "Updated" line where it differs.
- Published prices in `Offer` schema: an assistant asked "how much is SAT
  tutoring in Holly Springs" can answer **$2,099**, not "contact for pricing".
- Organization carries `knowsAbout`, `areaServed`, `award`, `founder`, `sameAs`.

**Remaining**

| Severity | Finding |
| --- | --- |
| Low | No `speakable` schema. Google supports it for news publishers only, so the value here is near zero. |
| Note | Two WordPress author ids are in use — 3 (24 posts) and 11 (8 posts). All credited to Joe per instruction. If some are Sam's, add an override to `BLOG_AUTHORS` in `scripts/import-wordpress.mjs`. |

---

## Local SEO

- **NAP on 114/114 pages** — phone and street address sitewide, perfectly
  consistent.
- `LocalBusiness` with weekday hours, Saturday by appointment, six `areaServed`
  places, `hasMap`, `logo`, `image` and `priceRange`.
- Click-to-load Google Maps on `/contact`.

**Gaps:** Google Business Profile signals —
reviews, posts, categories, photos — could not be assessed without the live
listing, and the 100+ five-star reviews are the strongest asset the business
has.
