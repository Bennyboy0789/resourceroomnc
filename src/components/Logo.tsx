import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Text-and-mark logo lockup.
 *
 * This is a stand-in built from type and an SVG mark. To use the real logo,
 * drop the file in /public and replace the mark + wordmark below with a
 * <Image> — every usage across the site goes through this component.
 */
export function Logo({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Resource Room — home"
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <span
        className={cn(
          "grid h-10 w-10 shrink-0 place-items-center rounded-lg transition-colors",
          tone === "dark" ? "bg-navy-900 group-hover:bg-navy-800" : "bg-white/10 group-hover:bg-white/20",
        )}
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
          <path d="M4 6.2A1.2 1.2 0 0 1 5.2 5h5.6A1.2 1.2 0 0 1 12 6.2V19a1 1 0 0 0-1-1H5.2A1.2 1.2 0 0 1 4 16.8V6.2Z" fill="#c4a44a" />
          <path d="M20 6.2A1.2 1.2 0 0 0 18.8 5h-5.6A1.2 1.2 0 0 0 12 6.2V19a1 1 0 0 1 1-1h5.8a1.2 1.2 0 0 0 1.2-1.2V6.2Z" fill="#5aa5d0" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-lg font-bold tracking-tight",
            tone === "dark" ? "text-navy-900" : "text-white",
          )}
        >
          Resource Room
        </span>
        <span
          className={cn(
            "mt-1 text-[0.625rem] font-semibold uppercase tracking-[0.18em]",
            tone === "dark" ? "text-brand-600" : "text-gold-400",
          )}
        >
          Holly Springs, NC
        </span>
      </span>
    </Link>
  );
}
