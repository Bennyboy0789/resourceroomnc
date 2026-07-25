# resourceroomnc.com

Marketing site for Resource Room, a learning center in Holly Springs, NC. Next.js 16 (App Router)
+ TypeScript + Tailwind CSS v4. Every route is statically generated.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Editing content

All copy lives in `src/content/` — no need to touch components for routine changes.

| File | What it controls |
| --- | --- |
| `site.ts` | Phone, email, address, navigation, footer columns, award badges, social links, blog URL |
| `programs.ts` | Every program: name, summary, highlights, what's included, who it's for. Adding an entry creates its page at `/programs/<slug>` automatically |
| `home.ts` | Hero copy, why-choose-us, founders, stats, final CTA |
| `testimonials.ts` | Review quotes |

Program pages are generated from `programs.ts` via `generateStaticParams`, and both
`sitemap.xml` and the nav dropdown read from the same list.

## Brand colors

Sampled from the live logo and site CSS, defined in `src/app/globals.css` under `@theme`:

| Token | Value | Source |
| --- | --- | --- |
| `brand-500` | `#3d60a9` | logo blue |
| `brand-700` | `#064ea4` | site link blue |
| `sun-500` | `#fff100` | logo yellow |
| `navy-900` | `#102449` | dark sections, derived from the logo blue |

One rule follows from this palette: **the brand yellow is a fill, not ink.** On navy it works as
text and icons; on white it needs dark ink on top of it (`bg-sun-400 text-navy-900`), and blue
takes over as the accent — `SectionHeading` switches accent color by `tone` for exactly this
reason. `sun-600` is a deepened yellow used only where small marks (rating stars) sit on white.

## Assets

Real logos are in `public/`, pulled from the live site:
`logo-circle.png` (blue circle mark, for light backgrounds) and `logo-white.png` (white knockout
lockup, for navy). Both are used through `src/components/Logo.tsx`.

Still to supply:

- **Photos** — `src/components/ui/PhotoSlot.tsx` renders branded gradient panels wherever a photo
  belongs (founders, program pages, program cards). Replace its body with a filled `next/image`.
- **Award badges** — currently rendered as text pills in `src/components/home/Hero.tsx`.
- **Favicon** — `src/app/icon.tsx` generates a brand-colored mark at build time. Delete it and add
  `src/app/favicon.ico` once a real icon file exists.
- **OG image** — add `src/app/opengraph-image.png` (1200×630) for social sharing previews.

## Before launch

- Confirm `blogUrl` in `src/content/site.ts` points at the right blog.
- Add real Facebook/Instagram URLs in `socials` (same file).
- The contact form composes an email via `mailto:` so it works on a static deploy. To route
  submissions to a CRM or inbox instead, replace `handleSubmit` in
  `src/components/ContactForm.tsx` with a Server Action or form-provider POST.
