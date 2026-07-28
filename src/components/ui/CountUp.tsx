"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/** Splits "95%" into 95 and "%", or "15+" into 15 and "+". */
function parse(value: string) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  return { target: Number(match[1]), suffix: match[2] };
}

/**
 * Counts a stat up from zero the first time it scrolls into view.
 *
 * The server renders the finished value, so the real number is in the HTML for
 * crawlers and for anyone whose JS never runs. The drop to zero happens on the
 * animation's first frame rather than in a separate effect — and the trigger
 * margin below starts that animation while the section is still off screen, so
 * the finished value is never seen snapping backwards.
 *
 * Values with no leading digit ("Five Star") and visitors who prefer reduced
 * motion both fall through to plain text.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const parsed = parse(value);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  // Fires ~250px before the element reaches the viewport, so the count is
  // already running by the time it is on screen.
  const inView = useInView(ref, { once: true, margin: "250px" });
  const [display, setDisplay] = useState(value);

  const target = parsed?.target;
  const suffix = parsed?.suffix ?? "";
  const animatable = parsed !== null && !reduce;

  useEffect(() => {
    if (!animatable || !inView || target === undefined) return;

    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(`${Math.round(latest)}${suffix}`),
    });

    return () => controls.stop();
  }, [animatable, inView, target, suffix]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
