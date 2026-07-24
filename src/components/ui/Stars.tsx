import { StarIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

export function Stars({ className, label }: { className?: string; label?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-gold-500", className)}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} className="h-4 w-4" />
      ))}
      <span className="sr-only">{label ?? "Five out of five stars"}</span>
    </span>
  );
}
