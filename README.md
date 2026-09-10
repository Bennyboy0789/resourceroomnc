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
- The consultation and careers forms post to the Server Action in
  `src/app/actions/contact.ts`, which delivers through SMTP2Go to `SMTP2GO_TO`.

## Form spam

Both forms are scored by `src/lib/spam.ts` before anything is sent. There is no captcha: a
submission reaches a Server Action only from a browser that rendered the page and ran React, so
"can this client run JS" filters almost nothing, and what actually separates a bot from a parent is
what it writes. Signals are weighted — links and where they point, marketing vocabulary, script,
risky and disposable email domains, fill time, repeats from one address — and the total decides:

| Score | What happens |
| --- | --- |
| 0–2 | Delivered normally. |
| 3–5 | Delivered with `[possible spam]` in the subject and the reasons appended to the body. |
| 6+ | Dropped, and logged with its reasons via `console.warn` (visible in the Vercel logs). |

No single signal can block on its own. Blocking a real family is the expensive mistake here, so
tune with the regression suite rather than by eye:

```sh
npm run spam:check
```

It asserts that known spam is blocked and that awkward-but-real messages are not — a pasted link,
all capitals, a name in another script, JS disabled, a college-prep question mentioning student
loans. When spam gets through, paste it into `SPAM` in `scripts/spam-check.mjs` and raise weights
until the suite passes. When a family says a message never arrived, their wording goes in `REAL`.

If spam ever outgrows this, the next step is Cloudflare Turnstile in front of the action — free,
invisible to visitors, but it needs a Cloudflare account and two env vars.
