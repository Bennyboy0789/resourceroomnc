import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "navy" | "quiet";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  /** Gold fill — the main call to action anywhere on the site. */
  primary:
    "bg-gold-500 text-navy-950 hover:bg-gold-400 focus-visible:outline-gold-400 shadow-sm",
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
  md: "h-11 px-5 text-sm",
  lg: "h-[3.25rem] px-7 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

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
