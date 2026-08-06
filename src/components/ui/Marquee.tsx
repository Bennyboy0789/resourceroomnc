"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";

/**
 * Continuously scrolling strip of credentials.
 *
 * The list is rendered twice: the first copy is the real content, the second is
 * `aria-hidden` so screen readers and search engines see each credential once
 * while the animation still has a duplicate to loop against.
 *
 * WCAG 2.2.2 (Pause, Stop, Hide) applies — this moves automatically and runs
 * for longer than five seconds. Pausing on hover is not enough on its own,
 * because hover is unreachable by keyboard and touch, so there is a real
 * control. The animation is disabled outright under `prefers-reduced-motion`.
 */
export function Marquee({ items }: { items: string[] }) {
  const [paused, setPaused] = useState(false);

  return (
    <div className="marquee-viewport relative border-y border-white/12 bg-brand-500 py-5 text-white">
      <div
        className="marquee-track"
        style={paused ? { animationPlayState: "paused" } : undefined}
      >
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 ? "true" : undefined}
            className="flex shrink-0 items-center"
          >
            {items.map((item) => (
              <li key={item} className="flex shrink-0 items-center gap-6 px-6">
                <Icon name="badge" className="h-4 w-4 shrink-0 text-sun-500" />
                <span className="whitespace-nowrap text-sm font-bold uppercase tracking-[0.12em]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>

      {/* Text scrolled out from behind a translucent button, which read as a
          rendering fault. This fades the strip into the page colour first, then
          sits the button on solid navy on top of the fade. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-brand-500 via-navy-950/90 to-transparent"
      />

      {/* 44px target, meeting the AAA target size and comfortably clearing the
          24px AA minimum. */}
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-pressed={paused}
        className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center bg-navy-950 text-white ring-1 ring-white/20 transition-colors hover:bg-navy-900"
      >
        <Icon name={paused ? "play" : "pause"} className="h-4 w-4" />
        <span className="sr-only">
          {paused ? "Resume scrolling credentials" : "Pause scrolling credentials"}
        </span>
      </button>
    </div>
  );
}
