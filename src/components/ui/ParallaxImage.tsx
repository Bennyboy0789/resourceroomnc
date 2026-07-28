"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

/** How far the image drifts, as a share of its own height, in each direction. */
const DRIFT = 8;

/**
 * Fills its parent with a photograph that drifts slower than the page scrolls.
 *
 * The image layer is deliberately taller than the frame by twice the drift
 * distance and offset by that amount, so the edges never travel into view at
 * either end of the scroll. Without that overscan the top of the picture would
 * lift off the top of the section as it exits.
 *
 * Progress is measured across the whole time the section is in the viewport
 * ("start end" to "end start"), which is what keeps the movement linear with
 * the scroll rather than lurching when the section becomes fully visible.
 */
export function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`-${DRIFT}%`, `${DRIFT}%`]);

  if (reduce) {
    return (
      <div className="absolute inset-0">
        <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
      </div>
    );
  }

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div
        style={{ y, top: `-${DRIFT}%`, height: `${100 + DRIFT * 2}%` }}
        className="absolute inset-x-0"
      >
        <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
      </motion.div>
    </div>
  );
}
