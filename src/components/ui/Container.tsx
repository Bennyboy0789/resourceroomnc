import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const sizes = {
  /** Long-form reading measure — legal copy, forms, single-column prose. */
  narrow: "max-w-3xl",
  /** Standard page width. */
  default: "max-w-7xl",
  /** Near-full width, for rails and edge-to-edge grids. */
  wide: "max-w-[110rem]",
} as const;

export function Container({
  children,
  className,
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: keyof typeof sizes;
}) {
  return (
    <div className={cn("mx-auto w-full px-5 sm:px-8", sizes[size], className)}>{children}</div>
  );
}
