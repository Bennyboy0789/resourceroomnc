import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { stagger } from "@/lib/stagger";
import { cn } from "@/lib/cn";

/**
 * A horizontally scrolling row of cards under a heading.
 *
 * The rail runs to the screen edge while its first card still lines up with the
 * page gutter, so the row reads as continuing past the viewport rather than
 * stopping at a container boundary. Gutter padding is applied inside the
 * scroller (not on a wrapper) so the last card can scroll fully into view.
 *
 * Scrolling is native — no JS, no autoplay, no hidden content. Everything in a
 * rail is reachable by keyboard tabbing, which moves the scroller for free.
 */
export function Rail({
  eyebrow,
  title,
  accent,
  description,
  viewAll,
  tone = "dark",
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: string;
  viewAll?: { label: string; href: string };
  tone?: "dark" | "light";
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Container size="wide">
        <Reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="max-w-2xl">
            {eyebrow ? (
              <p
                className={cn(
                  "eyebrow mb-3",
                  tone === "dark" ? "text-brand-600" : "text-sun-400",
                )}
              >
                {eyebrow}
              </p>
            ) : null}
            <h2
              className={cn(
                "display text-balance text-3xl sm:text-4xl lg:text-5xl",
                tone === "dark" ? "text-navy-950" : "text-white",
              )}
            >
              {title}
              {accent ? (
                <span className={tone === "dark" ? "text-brand-500" : "text-sun-500"}>
                  {" "}
                  {accent}
                </span>
              ) : null}
            </h2>
            {description ? (
              <p
                className={cn(
                  "mt-4 text-base leading-relaxed",
                  tone === "dark" ? "text-navy-600" : "text-white/70",
                )}
              >
                {description}
              </p>
            ) : null}
          </div>

          {viewAll ? (
            <Link
              href={viewAll.href}
              className={cn(
                "group inline-flex items-center gap-2 border-b-2 pb-1 text-xs font-bold uppercase tracking-[0.08em] transition-colors",
                tone === "dark"
                  ? "border-navy-950/25 text-navy-950 hover:border-navy-950"
                  : "border-white/30 text-white hover:border-white",
              )}
            >
              {viewAll.label}
              <Icon
                name="arrowRight"
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
              />
            </Link>
          ) : null}
        </Reveal>
      </Container>

      {/* The scroller spans the viewport; its own padding recreates the gutter
          so card edges align with the heading above them. */}
      <div className="rail mt-10 gap-4 px-5 sm:gap-5 sm:px-8 lg:mt-12 [scroll-padding-left:1.25rem] sm:[scroll-padding-left:2rem]">
        {children}
      </div>
    </div>
  );
}

/**
 * Fixed-width slide sized so a partial card peeks in at every breakpoint —
 * the cue that tells people the row scrolls.
 *
 * Pass `index` to stagger the reveal across the row.
 */
export function RailItem({ children, index = 0 }: { children: ReactNode; index?: number }) {
  return (
    <Reveal
      className="w-[78vw] max-w-[22rem] sm:w-[20rem] lg:w-[22rem]"
      delay={stagger(index)}
    >
      {children}
    </Reveal>
  );
}
