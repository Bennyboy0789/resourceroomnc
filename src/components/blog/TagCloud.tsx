import Link from "next/link";
import { blogTags } from "@/content/blog";
import { tagSlug } from "@/lib/blog";
import { cn } from "@/lib/cn";

/**
 * Tag cloud, weighted by post count.
 *
 * Four steps rather than a continuous scale: a linear font-size ramp across 66
 * tags produces sizes nobody can tell apart, and the smallest end drops below
 * a readable size. Weight and colour carry most of the signal; size is a nudge.
 */
const STEPS = [
  { min: 8, className: "text-xl text-navy-950" },
  { min: 5, className: "text-lg text-navy-900" },
  { min: 2, className: "text-base text-navy-800" },
  { min: 0, className: "text-sm text-navy-600" },
];

export function TagCloud({
  limit,
  activeTag,
}: {
  /** Show only the most-used N. Omit for every tag. */
  limit?: number;
  activeTag?: string;
}) {
  const tags = limit ? blogTags.slice(0, limit) : blogTags;
  if (!tags.length) return null;

  return (
    <ul className="flex flex-wrap items-baseline gap-x-4 gap-y-3">
      {tags.map((tag) => {
        const step = STEPS.find((s) => tag.count >= s.min) ?? STEPS[STEPS.length - 1];
        const active = tag.name === activeTag;

        return (
          <li key={tag.name}>
            <Link
              href={`/blog/tag/${tagSlug(tag.name)}`}
              aria-current={active ? "page" : undefined}
              /* py-1.5 keeps the hit area comfortable even on the smallest
                 step, where the text alone would be a ~20px target. */
              className={cn(
                "inline-flex items-baseline gap-1.5 py-1.5 font-bold tracking-tight transition-colors hover:text-brand-500",
                step.className,
                active && "text-brand-500 underline underline-offset-4",
              )}
            >
              {tag.name}
              <span className="text-xs font-semibold text-navy-500">{tag.count}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
