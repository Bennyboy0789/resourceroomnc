"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const elements = {
  div: motion.div,
  li: motion.li,
  section: motion.section,
} as const;

/** Slow-out easing — quick to start, long settle. Reads as weight, not bounce. */
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Fades and lifts its children the first time they scroll into view.
 *
 * Wraps rather than decorates so server components can stay server components:
 * the animated element is the client boundary and the content passed through
 * `children` is still rendered on the server.
 *
 * Under `prefers-reduced-motion` it renders a plain element with no animation
 * and no transform, so nothing moves and nothing is left mid-transition.
 */
export function Reveal({
  children,
  className,
  as = "div",
  delay = 0,
  y = 24,
  /** Set on the LCP element: skips the fade so first paint is not withheld. */
  noFade = false,
}: {
  children: ReactNode;
  className?: string;
  as?: keyof typeof elements;
  delay?: number;
  y?: number;
  noFade?: boolean;
}) {
  const reduce = useReducedMotion();
  const Element = elements[as];

  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Element
      className={className}
      initial={noFade ? { y } : { opacity: 0, y }}
      whileInView={noFade ? { y: 0 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.65, ease: EASE, delay }}
    >
      {children}
    </Element>
  );
}

/**
 * Same treatment, but played on mount instead of on scroll — for content that
 * is already in frame when the page loads.
 */
export function RevealOnLoad({
  children,
  className,
  as = "div",
  delay = 0,
  y = 24,
  noFade = false,
}: {
  children: ReactNode;
  className?: string;
  as?: keyof typeof elements;
  delay?: number;
  y?: number;
  noFade?: boolean;
}) {
  const reduce = useReducedMotion();
  const Element = elements[as];

  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Element
      className={className}
      initial={noFade ? { y } : { opacity: 0, y }}
      animate={noFade ? { y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </Element>
  );
}
