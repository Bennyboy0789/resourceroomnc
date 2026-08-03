import { site } from "@/content/site";

/**
 * Title and description length helpers.
 *
 * Google truncates around 60 characters of title and 155–160 of description.
 * Past that the tail is replaced with an ellipsis, which usually eats the call
 * to action — the part that decides whether a parent clicks.
 *
 * These clamp at the source rather than leaving 81 pages to be fixed by hand,
 * and they cut on a word boundary so a truncated string never ends mid-word.
 */

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

const SUFFIX = ` | ${site.name}`;

function truncate(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  // Reserve one character for the ellipsis, then back up to a word boundary.
  return `${clean.slice(0, max - 1).replace(/[\s,;:—–-]+\S*$/, "")}…`;
}

/**
 * Builds a page title that fits.
 *
 * The brand suffix costs 16 characters, which is a quarter of the budget. It
 * is kept when the title has room and dropped when it does not — a truncated
 * headline helps nobody, and Google appends the site name itself when it
 * decides the brand is worth showing.
 *
 * `qualifier` is an optional extra — usually "Holly Springs, NC" — added only
 * when the finished title still fits. Short titles like "Lego Spike" waste
 * two thirds of the SERP line and carry no local signal, but a qualifier is
 * worth nothing if it pushes the real subject past the truncation point, so
 * it is offered rather than forced.
 *
 * For `<title>` tags only. It appends the brand name, so never run visible
 * on-page copy through it.
 */
export function seoTitle(text: string, qualifier?: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (qualifier) {
    const qualified = `${clean} — ${qualifier}`;
    if (qualified.length + SUFFIX.length <= TITLE_MAX) return qualified + SUFFIX;
  }
  if (clean.length + SUFFIX.length <= TITLE_MAX) return clean + SUFFIX;
  return truncate(clean, TITLE_MAX);
}

/** Clamps a description to the SERP limit on a word boundary. */
export function seoDescription(text: string): string {
  return truncate(text, DESCRIPTION_MAX);
}
