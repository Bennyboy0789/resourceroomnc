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

/** Where Stripe sends people back to after checkout. */
export function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}
