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

## Design tokens

Colors, fonts and custom utilities are defined in `src/app/globals.css` under `@theme`.
Changing `--color-navy-900` or `--color-gold-500` there updates the whole site.

## Assets still needed

The site ships without photography. These are the swap-in points:

- **Logo** — `src/components/Logo.tsx` renders a type-and-mark lockup. Drop the real logo in
  `public/` and replace the mark + wordmark with `next/image`; every usage flows through this file.
- **Photos** — `src/components/ui/PhotoSlot.tsx` renders branded gradient panels wherever a photo
  belongs (founders, program pages, program cards). Replace its body with a filled `next/image`.
- **Award badges** — currently rendered as text pills in `src/components/home/Hero.tsx`.
- **Favicon** — `src/app/icon.tsx` generates a placeholder mark at build time. Delete it and add
  `src/app/favicon.ico` once the real icon exists.
- **OG image** — add `src/app/opengraph-image.png` (1200×630) for social sharing previews.

## Before launch

- Confirm `blogUrl` in `src/content/site.ts` points at the right blog.
- Add real Facebook/Instagram URLs in `socials` (same file).
- The contact form composes an email via `mailto:` so it works on a static deploy. To route
  submissions to a CRM or inbox instead, replace `handleSubmit` in
  `src/components/ContactForm.tsx` with a Server Action or form-provider POST.
