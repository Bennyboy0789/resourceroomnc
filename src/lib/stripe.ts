import "server-only";
import Stripe from "stripe";

/**
 * Server-side Stripe client.
 *
 * Returns null when `STRIPE_SECRET_KEY` is unset rather than throwing, so the
 * site still builds and renders in environments without Stripe credentials —
 * CI, previews, and local work on non-commerce pages. Callers treat a null
 * client as "no catalog", and the program pages fall back to their consultation
 * call to action instead of showing a broken enrollment form.
 */
let cached: Stripe | null | undefined;

export function getStripe(): Stripe | null {
  if (cached !== undefined) return cached;

  const key = process.env.STRIPE_SECRET_KEY;
  cached = key ? new Stripe(key) : null;

  if (!cached && process.env.NODE_ENV !== "production") {
    console.warn("[stripe] STRIPE_SECRET_KEY is not set — enrollment is disabled.");
  }

  return cached;
}

/**
 * Where Stripe sends people back to after checkout.
 *
 * Order matters, and the middle entry is the one that was missing. `VERCEL_URL`
 * is the per-deployment hostname — `project-hash-scope.vercel.app` — never the
 * custom domain, and deployment hostnames sit behind Vercel Authentication. A
 * live customer who paid was bounced to a Vercel login page instead of the
 * confirmation page, because `NEXT_PUBLIC_SITE_URL` was unset and this fell
 * straight through to that hostname.
 *
 * `VERCEL_PROJECT_PRODUCTION_URL` is the project's real production domain and
 * is injected automatically, so production now lands correctly even if nobody
 * sets `NEXT_PUBLIC_SITE_URL`. That variable still wins when present, which is
 * what pins the apex-versus-www choice.
 */
export function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    /* A preview. Fine for a preview, but worth saying out loud if it ever
       happens on something customer-facing. */
    console.warn(
      "[stripe] NEXT_PUBLIC_SITE_URL unset; returning customers to the deployment URL,",
      "which may be behind Vercel Authentication.",
    );
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
