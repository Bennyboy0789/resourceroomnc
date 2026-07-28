"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { heroSlideshow, heroSlides } from "@/content/home";

const { slideDuration, fadeDuration, zoomScale } = heroSlideshow;

/**
 * Cross-fading background slideshow for the hero, with a slow Ken Burns zoom.
 *
 * Every slide stays mounted so the browser keeps them decoded and the fade has
 * something to fade to; only opacity and transform change.
 *
 * The transform transition on an outgoing slide is delayed by the length of the
 * fade. Without that delay the slide would snap back from its zoomed scale
 * while still partly visible, which reads as a jolt at every transition.
 *
 * Honors prefers-reduced-motion by holding on the first slide and dropping both
 * the zoom and the timer.
 */
export function HeroSlideshow() {
  const [index, setIndex] = useState(0);
  const [motion, setMotion] = useState(false);

  // Start still, then opt in to motion — a reduced-motion visitor never sees a
  // frame of movement, and SSR output stays deterministic.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotion(!query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!motion || heroSlides.length < 2) return;
    const id = setInterval(
      () => setIndex((current) => (current + 1) % heroSlides.length),
      slideDuration,
    );
    return () => clearInterval(id);
  }, [motion]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {heroSlides.map((src, position) => {
        const active = position === index;

        return (
          <div
            key={src}
            className="absolute inset-0"
            style={{
              opacity: active ? 1 : 0,
              transform: active && motion ? `scale(${zoomScale})` : "scale(1)",
              transition: active
                ? `opacity ${fadeDuration}ms linear, transform ${slideDuration + fadeDuration}ms ease-out`
                : `opacity ${fadeDuration}ms linear, transform 0ms linear ${fadeDuration}ms`,
            }}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="100vw"
              priority={position === 0}
              className="object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}
