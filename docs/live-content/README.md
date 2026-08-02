# Live site content snapshot — resourceroomnc.com

Pulled **2026-07-31** from the live WordPress site (WordPress 7.0.2 / WooCommerce
10.9.4 / Elementor 4.2.1). Joe reported the site copy had been updated; this is
the current state of record.

Each `.txt` is the visible text of one page, tag-stripped and de-duplicated, with
the source URL in the header. Filenames map to the live path (`__` = `/`).
Nav, footer, cart and newsletter boilerplate repeat on every page — skip past the
`Products search` line to reach page-specific copy.

These files are **reference input for the rebuild**, not shipped content. The
canonical content still lives in `src/content/*.ts`.

## What is here

| File | Live URL | Maps to |
| --- | --- | --- |
| `home.txt` | `/` | `/` |
| `about-resource-room-learning-center.txt` | `/about-resource-room-learning-center/` | `/about` |
| `about-resource-room-learning-center__preferred-partners.txt` | `.../preferred-partners/` | **no page yet** |
| `contact.txt` | `/contact/` | `/contact` |
| `join-our-team.txt` | `/join-our-team/` | `/join-our-team` |
| `product__private-tutoring-for-all-subjects-in-nc.txt` | `/product/private-tutoring-.../` | `/programs/tutoring` |
| `product__teacher-workdays.txt` | `/product/teacher-workdays/` | `/programs/camps` |
| `product__sat-prep-in-north-carolina.txt` | `/product/sat-prep-.../` | `/programs/sat-act-prep` |
| `product__act-prep-in-north-carolina.txt` | `/product/act-prep-.../` | `/programs/sat-act-prep` |
| `product__college-admissions.txt` | `/product/college-admissions/` | `/programs/college-prep` |
| `product__pathways-academy.txt` | `/product/pathways-academy/` | `/programs/pathways-academy` |
| `product__homeschool-co-op-holly-springs-nc.txt` | `/product/homeschool-co-op-.../` | `/programs/homeschool-co-op` |
| `product__aba-educational-support.txt` | `/product/aba-educational-support/` | `/programs/aba-services` |
| `product__iep-advocacy.txt` | `/product/iep-advocacy/` | `/programs/iep-504-advocate` |
| `product__executive-functioning-*.txt` | `/product/executive-functioning-.../` | home popular card → tutoring |
| `product__summer-bridge-programs-in-nc.txt` | `/product/summer-bridge-.../` | home popular card → tutoring |
| `camps.txt`, `tutoring.txt`, `test-prep.txt`, `stem.txt`, `courses.txt`, `course-catalog.txt` | category landing pages | `/programs` |
| remaining `product__*.txt` | individual course products | detail/offering copy |

## Re-pulling

`scripts/` has no fetcher for this. The snapshot was taken with a throwaway
PowerShell script: `Invoke-WebRequest` per URL from `/wp-sitemap-posts-page-1.xml`
and `/wp-sitemap-posts-product-1.xml`, then scripts/styles/SVG/head stripped and
block-level close tags turned into newlines.

## Deliberately not captured

Prices, "Add to cart", variation dropdowns and stock counts are WooCommerce
chrome the rebuild drops per the brief. They are left in the text files because
stripping them would also strip the pricing tables that *are* real content (the
co-op tuition tiers, the SAT package tiers, Pathways tuition and grant amounts).
