import { StarIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

export function Stars({ className, label }: { className?: string; label?: string }) {
  return (
    // Defaults to the deepened yellow so stars stay legible on white; dark
    // sections pass `text-sun-500` to get the true brand yellow.
    <span className={cn("inline-flex items-center gap-0.5 text-sun-600", className)}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} className="h-4 w-4" />
      ))}
      <span className="sr-only">{label ?? "Five out of five stars"}</span>
    </span>
  );
}
