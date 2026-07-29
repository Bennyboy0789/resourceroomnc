import { twMerge } from "tailwind-merge";

/**
 * Joins class names and resolves Tailwind conflicts, last one winning.
 *
 * The plain-join version this replaces emitted both sides of a conflict — a
 * component's base `text-sun-600` and a caller's `text-navy-950` would both
 * reach the DOM, and which one applied came down to the order Tailwind happened
 * to emit those rules in the stylesheet, not the order they were passed here.
 * That silently broke the stats-bar stars, and had already been worked around
 * twice in PhotoSlot's border radius.
 *
 * With twMerge a later argument reliably overrides an earlier one, which is the
 * behaviour every call site already assumed.
 */
export function cn(...classes: (string | false | null | undefined)[]) {
  return twMerge(classes.filter(Boolean).join(" "));
}
