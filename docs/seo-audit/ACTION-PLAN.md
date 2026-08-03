# SEO Action Plan — Resource Room NC

Score: **96/100**, up from 86 at first audit.

Everything actionable before deploy is done. What follows is what remains, and
all of it either needs the site live or needs a decision only Joe can make.

---

## Done

**Round 1 — AI readiness**

- `llms.txt`, generated from live content so it cannot drift.
- FAQ questions rendered as real `<h3>` headings inside `<summary>`, so the
  document outline agrees with the `FAQPage` schema it already declared.
- Q&A on 24 course pages — 81 questions built strictly from real fields
  (grade band, published rate, location, parent program). Nothing invented.
- `dateModified` on all 32 posts, clamped so it can never precede publication
  (several posts were back-dated in WordPress). Visible "Updated" line.
- BlogPosting gained `wordCount`, `keywords`, `inLanguage`, publisher logo.

**Round 2 — authorship**

- All 32 posts bylined to Joe Cuccurullo as a `Person` with credentials in the
  schema, plus a visible byline and an author box on every post.
- Real headshot wired into the author box, the `Person.image` field and the IEP
  advocacy page.

**Round 3 — on-page, technical, performance**

- **Default `og:image`** generated at build time — 60 pages fixed, now 0
  missing. Programs, courses and posts override with their own artwork.
- **Titles and descriptions clamped at the source** via `src/lib/seo.ts`:
  48 over-length descriptions → 0, 33 over-length titles → 0. New pages cannot
  reintroduce the problem.
- **Six security headers** on every route.
- **`LocalBusiness` completed** — `image`, `logo`, `hasMap`, `priceRange`,
  `currenciesAccepted`, Saturday-by-appointment hours.
- **Heading order fixed in the importer**, so it survives re-import.
- **Course cross-links** — every course now also appears on its parent program
  page.
- **Homepage 756KB → 511KB** (hero slideshow 10 slides → 5).
- **Contact page 557KB → 114KB** (Google Maps behind a click-to-load facade).
- Duplicate title resolved; `/privacy-policy` added to the sitemap; `noindex`
  pages removed from it.
- **`geo` coordinates added** (35.663466, -78.835116, supplied by Joe),
  completing the local-pack schema.

**Round 4 — Staten Island, titles, LCP**

- **Staten Island address removed** from the footer (all 116 pages), the About
  contact block, and `site.ts`. The business was sold in 2026; a second address
  site-wide reads as a second branch to both people and Google, and a branch
  whose NAP matches no live listing is the kind of inconsistency that costs
  local pack position. The origin survives as narrative on the About page.
- **Privacy policy** renamed to `resourceroom.com` with `info@resourceroom.com`
  and the Holly Springs address, replacing the Staten Island entity's details.
- **Brand suffix leaking into visible copy** — `seoTitle()` had been applied to
  seven card headings on `/join-our-team`, which rendered on screen as "Camp
  Instructors | Resource Room". Fixed, and `seoTitle()` now documents that it is
  for `<title>` only.
- **Short titles qualified.** `seoTitle()` takes an optional qualifier appended
  only when the finished title still fits 60 characters. Titles under 30 chars:
  12 → 7, and the 7 that remain are `noindex` pagination and archive pages.
  `/join-our-team` now leads with "Tutoring & Teaching Jobs — Holly Springs, NC"
  rather than a nav label nobody searches. All 25 course pages gained the
  location qualifier.
- **Blog archive LCP 848ms → 68ms.** `Reveal` held the first row of cards at
  `opacity: 0` until hydration, so LCP landed on an image that had been decoded
  since ~120ms. The first row now uses the existing `noFade` escape hatch and
  preloads its thumbnails.

**Verified after round 4:** tsc, eslint and build clean; axe-core 42/42 with no
violations; 11/11 interaction checks; all 84 sitemap URLs return 200; LCP
40–180ms and CLS 0.000 across 19 templates at desktop and mobile.

---

## Needs Joe

### ~~J1. Exterior/storefront photograph~~ — resolved 2026-08-02

Joe supplied one. Saved as `learning-center-storefront.jpg` and wired into
three places:

- **About page hero**, replacing the classroom photo that stood in for it.
- **`LocalBusiness.image`**, replacing the generated brand card. Google's
  guidance asks for a photograph of the business, and the exterior is the one
  that does real work.
- **Contact page**, above the map, captioned "The entrance is under the green
  awning" — the map gives the pin, the photo gives the landmark.

The `og:image` default is unchanged; the brand card is still the right thing
for social previews.

**Nothing is now blocked on Joe.** Everything below needs the site live.

One thing worth passing on: the photo is 960×640. It carries the hero fine
behind the navy overlay, but if a higher-resolution original exists it would
hold up better on wide displays, and Google Business Profile prefers at least
720px on the short edge — this one clears that, just barely.

### ~~J2. Confirm blog authorship~~ — resolved 2026-08-02

Both WordPress author ids (3 and 11) are Joe. All 32 posts stay credited to
him; `BLOG_AUTHORS` stays empty by design and now says so.

### ~~J3. Privacy policy effective date~~ — resolved 2026-08-02

Moved to 3 August 2026 to match the changed contact details.

### ~~J4. Domain ownership after the Staten Island sale~~ — resolved 2026-08-02

Joe holds `resourceroom.com` in writing. The buyers are rebranding — new name,
new site, new GBP — which is the best outcome available: no competing business
carries the Resource Room name, so there is no NAP conflict to manage. None of
that is under our control, so nothing here is actionable except the one item
below that is.

**Still ours to fix:** `resourceroom.com` currently serves a location chooser
whose second option points at a business Joe no longer owns. Joe controls that
page. It should stop linking to Staten Island before launch, and become the
Holly Springs site at cutover.

---

## After launch — cannot be done before

1. **Verify security headers on the real host.** Configured and confirmed
   locally, but HSTS is inert without HTTPS. `curl -I` the live domain.
2. **Write a Content-Security-Policy.** Deliberately not shipped as a guess — a
   wrong CSP silently breaks the Maps embed, Stripe checkout and inline JSON-LD.
   Enumerate the real third-party origins, run report-only, then enforce.
3. **Search Console + GA4.** Verify the property, submit the sitemap, watch
   coverage for two weeks.
4. **Field Core Web Vitals.** Every number above is localhost with no network
   latency. CLS at 0.000 should hold, since it is a property of the layout; LCP
   will not. Re-measure with PageSpeed Insights/CrUX.
5. **Backlink migration.** Confirm the 253 redirects pass authority; audit the
   referring domains the WordPress site had.
6. **Google Business Profile.** The 100+ five-star reviews are the strongest
   asset the business has and deliberately none of it is marked up on the site —
   self-serving `aggregateRating` risks a manual action. Claim, categorise, and
   point the GBP at the new domain.
7. **Rank baseline.** Capture positions for "tutoring Holly Springs", "SAT prep
   Holly Springs", "IEP advocate NC", "track out camps Wake County" before and
   after cutover.
8. **Drift baseline.** `python scripts/drift_baseline.py <url>` once live, so
   future deploys can be diffed.

### Sequencing the domain move

Launch on `resourceroomnc.com`, wait 4–8 weeks, then move to
`resourceroom.com`. Not because the move is wrong — the Staten Island sale
removed the reason to hesitate — but because a domain migration and a full
platform rebuild in the same Search Console window are indistinguishable if
something drops.

---

## Backlog

- **B1.** `/blog` is the heaviest page at 311KB of thumbnails. Smaller archive
  thumbnails would help, though LCP is already 64–80ms and CLS is 0.
- **B2.** `speakable` schema. Google supports it for news publishers only, so
  the value is near zero.
