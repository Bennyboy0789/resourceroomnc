"use client";

import { motion, useReducedMotion } from "motion/react";
import { Icon, type IconName } from "@/components/icons";
import { cn } from "@/lib/cn";

export type JourneyStep = {
  title: string;
  body: string;
  icon: IconName;
  /** Small pill over the node — reserved for the step being sold hardest. */
  badge?: string;
  highlight?: boolean;
};

/** Matches Reveal's easing so the page animates as one system. */
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * A process drawn as a path: numbered nodes joined by a line that draws
 * itself as the section scrolls into view, nodes popping in along it.
 *
 * Two layouts from one markup. On large screens the five nodes sit in a row
 * and the line runs horizontally behind their centers; below that the nodes
 * stack and the line runs down the left rail. The draw is two elements — one
 * scaleX, one scaleY — each shown only at its own breakpoint, because a
 * single element cannot animate a different axis per media query.
 *
 * Under prefers-reduced-motion everything renders complete and still, exactly
 * as Reveal behaves elsewhere on the site.
 */
export function JourneyPath({ steps }: { steps: JourneyStep[] }) {
  const reduce = useReducedMotion();

  const viewport = { once: true, margin: "0px 0px -15% 0px" } as const;

  return (
    <div className="relative">
      {/* Desktop connector: behind the node circles, between the first and
          last node centers (each column is 100/n wide, node centered). */}
      <div
        aria-hidden="true"
        className="absolute left-[10%] right-[10%] top-7 hidden h-0.5 overflow-hidden lg:block"
      >
        {reduce ? (
          <div className="h-full w-full bg-brand-500/25" />
        ) : (
          <motion.div
            className="h-full w-full origin-left bg-brand-500/25"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewport}
            transition={{ duration: 1.4, ease: EASE }}
          />
        )}
      </div>

      {/* Mobile connector: down the left rail, stopping at the last node. */}
      <div
        aria-hidden="true"
        className="absolute bottom-16 left-7 top-7 w-0.5 overflow-hidden lg:hidden"
      >
        {reduce ? (
          <div className="h-full w-full bg-brand-500/25" />
        ) : (
          <motion.div
            className="h-full w-full origin-top bg-brand-500/25"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={viewport}
            transition={{ duration: 1.4, ease: EASE }}
          />
        )}
      </div>

      <ol className="relative grid gap-10 lg:grid-cols-5 lg:gap-6">
        {steps.map((step, index) => {
          const node = (
            <>
              <span
                className={cn(
                  "relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full border-2",
                  step.highlight
                    ? "border-sun-500 bg-sun-500 text-navy-950 shadow-lg shadow-sun-500/30"
                    : "border-brand-500/30 bg-white text-brand-500",
                )}
              >
                <Icon name={step.icon} className="h-6 w-6" />
              </span>

              <div className="min-w-0 lg:mt-5">
                {step.badge ? (
                  <span className="mb-2 inline-flex rounded-full bg-sun-500 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-navy-950">
                    {step.badge}
                  </span>
                ) : null}
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brand-500">
                  Step {index + 1}
                </p>
                <h3 className="mt-1 text-base font-bold tracking-tight text-navy-950">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-navy-600">{step.body}</p>
              </div>
            </>
          );

          const className = "relative flex gap-5 lg:flex-col lg:items-center lg:gap-0 lg:text-center";

          if (reduce) {
            return (
              <li key={step.title} className={className}>
                {node}
              </li>
            );
          }

          return (
            <motion.li
              key={step.title}
              className={className}
              initial={{ opacity: 0, scale: 0.85, y: 12 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={viewport}
              /* Nodes land as the line reaches them — the line takes 1.4s to
                 cross, so each node waits for roughly its share of the draw. */
              transition={{ duration: 0.5, ease: EASE, delay: 0.15 + index * 0.24 }}
            >
              {node}
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
