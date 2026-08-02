import { StarIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

export function Stars({ className, label }: { className?: string; label?: string }) {
  return (
    // Defaults to the deepened yellow so stars stay legible on white; dark
    // sections pass `text-sun-500` to get the true brand yellow.
    /*
     * `relative` matters: the sr-only label below is position:absolute, and
     * without a positioned ancestor it resolves against the initial containing
     * block. Inside the horizontally scrolled review rail that put it ~2900px
     * to the right of the viewport, escaping the rail's clipping and giving
     * every page a horizontal scrollbar at narrow widths (WCAG 1.4.10).
     */
    <span className={cn("relative inline-flex items-center gap-0.5 text-sun-600", className)}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} className="h-4 w-4" />
      ))}
      <span className="sr-only">{label ?? "Five out of five stars"}</span>
    </span>
  );
}
