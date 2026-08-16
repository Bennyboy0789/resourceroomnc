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

/** Seconds the connector takes to draw itself in, once, on scroll. */
const DRAW = 1.4;
/** Seconds the travelling light takes to cross the drawn connector. */
const TRAVEL = 2.8;
/** Full loop: the light crosses, then the path rests before the next pass. */
const CYCLE = 3.7;
/** Seconds a node stays lit as the light passes through it. */
const LIT = 0.7;

/**
 * The light is a band 20% of the track long, swept from just before the start
 * to just past the end — so its center covers -10%..110% of the track. Solving
 * for when that center sits over node `index` gives the moment to light it.
 */
function litAt(index: number, total: number) {
  const position = index / Math.max(total - 1, 1);
  return DRAW + (TRAVEL * (position + 0.1)) / 1.2;
}

/**
 * A process drawn as a path: numbered nodes joined by a line that draws
 * itself as the section scrolls into view, nodes popping in along it.
 *
 * Once drawn, the path stays alive — a light runs the length of it on a loop
 * and each node pulses as the light reaches it, so the eye is walked 1→5
 * rather than left on a static diagram. Node timings are derived from the
 * light's position (see litAt) so the two never drift apart.
 *
 * Two layouts from one markup. On large screens the five nodes sit in a row
 * and the line runs horizontally behind their centers; below that the nodes
 * stack and the line runs down the left rail. The draw is two elements — one
 * scaleX, one scaleY — each shown only at its own breakpoint, because a
 * single element cannot animate a different axis per media query.
 *
 * Under prefers-reduced-motion everything renders complete and still, with no
 * looping motion at all, exactly as Reveal behaves elsewhere on the site.
 */
/*
 * The highlighted node has to be the odd one out among the five, which means
 * it cannot reuse the page's own accent: on a sun-accented program every chip
 * is already sun-500, so a sun node reads as matching the furniture and the
 * four plain nodes become the unusual ones. Gold pops on a blue page, navy
 * pops on a gold one.
 */
function highlightTone(accent: "sun" | "blue") {
  return accent === "sun"
    ? {
        node: "border-navy-950 bg-navy-950 text-sun-500 shadow-lg shadow-navy-950/25",
        ring: "border-navy-950",
        badge: "bg-navy-950 text-sun-500",
      }
    : {
        node: "border-sun-500 bg-sun-500 text-navy-950 shadow-lg shadow-sun-500/30",
        ring: "border-sun-500",
        badge: "bg-sun-500 text-navy-950",
      };
}

export function JourneyPath({
  steps,
  accent,
}: {
  steps: JourneyStep[];
  accent: "sun" | "blue";
}) {
  const reduce = useReducedMotion();
  const tone = highlightTone(accent);

  const viewport = { once: true, margin: "0px 0px -15% 0px" } as const;

  /** The looping sweep, shared by both connectors — only the axis differs. */
  const sweep = {
    duration: TRAVEL,
    ease: "linear",
    repeat: Infinity,
    repeatDelay: CYCLE - TRAVEL,
    delay: DRAW,
  } as const;

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
          <>
            <motion.div
              className="h-full w-full origin-left bg-brand-500/25"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={viewport}
              transition={{ duration: DRAW, ease: EASE }}
            />
            <motion.div
              className="absolute inset-y-0 left-0 w-[20%] bg-gradient-to-r from-transparent via-brand-500 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "500%" }}
              transition={sweep}
            />
          </>
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
          <>
            <motion.div
              className="h-full w-full origin-top bg-brand-500/25"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={viewport}
              transition={{ duration: DRAW, ease: EASE }}
            />
            <motion.div
              className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-transparent via-brand-500 to-transparent"
              initial={{ y: "-100%" }}
              animate={{ y: "500%" }}
              transition={sweep}
            />
          </>
        )}
      </div>

      <ol className="relative grid gap-10 lg:grid-cols-5 lg:gap-6">
        {steps.map((step, index) => {
          const circleClass = cn(
            "relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full border-2",
            step.highlight ? tone.node : "border-brand-500/30 bg-white text-brand-500",
          );

          /* Both the swell and the ring fire on the beat the light arrives. */
          const lit = {
            duration: LIT,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: CYCLE - LIT,
            delay: litAt(index, steps.length),
          } as const;

          const circle = reduce ? (
            <span className={circleClass}>
              <Icon name={step.icon} className="h-6 w-6" />
            </span>
          ) : (
            <motion.span
              className={circleClass}
              animate={{ scale: [1, 1.12, 1] }}
              transition={lit}
            >
              {/* -inset-0.5 lands this exactly on top of the circle's own 2px
                  border (inset-0 would resolve to the padding box, 2px in), so
                  it reads as the node's outline lighting up and radiating. */}
              <motion.span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute -inset-0.5 rounded-full border-2",
                  step.highlight ? tone.ring : "border-brand-500",
                )}
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: [0, 0.7, 0], scale: [1, 1.4, 1.8] }}
                transition={lit}
              />
              <Icon name={step.icon} className="h-6 w-6" />
            </motion.span>
          );

          const node = (
            <>
              {circle}

              <div className="min-w-0 lg:mt-5">
                {step.badge ? (
                  <span
                    className={cn(
                      "mb-2 inline-flex rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.1em]",
                      tone.badge,
                    )}
                  >
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
