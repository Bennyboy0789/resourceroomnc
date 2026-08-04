import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "navy" | "quiet";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  /** Gold fill — the main call to action anywhere on the site. Hover deepens to
      sun-600, which exists purely as the pressed state: the brand gold is the
      rest state, so the hover has to move away from it to register at all. */
  primary:
    "bg-sun-500 text-navy-950 hover:bg-sun-600 focus-visible:outline-navy-900 shadow-sm",
  /** Outlined — pairs with `primary` on dark sections. */
  outline:
    "border border-white/35 text-white hover:bg-white/10 hover:border-white/60 focus-visible:outline-white",
  /** Navy fill — the main call to action on white sections. */
  navy: "bg-navy-900 text-white hover:bg-navy-800 focus-visible:outline-navy-700 shadow-sm",
  /** Outlined navy — secondary action on white sections. */
  quiet:
    "border border-navy-900/20 text-navy-900 hover:border-navy-900/50 hover:bg-navy-900/5 focus-visible:outline-navy-700",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-xs",
  lg: "h-14 px-9 text-sm",
};

/* Squared off, uppercase and tracked out — the buttons read as part of the
   typographic system rather than as pills sitting on top of it. */
const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold uppercase tracking-[0.08em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
}) {
  const classes = cn(base, variants[variant], sizes[size], className);

  // tel:, mailto: and off-site links skip the client-side router.
  const isPlainAnchor =
    external || href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http");

  if (isPlainAnchor) {
    return (
      <a
        href={href}
        className={classes}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
