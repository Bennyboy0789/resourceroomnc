"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Stars } from "@/components/ui/Stars";
import type { Review } from "@/content/testimonials";
import { cn } from "@/lib/cn";

const INTERVAL = 6000;

/**
 * Auto-rotating review carousel.
 *
 * Built on the native scroller rather than a transform track, so manual
 * swiping, keyboard scrolling and scroll-snap all keep working exactly as they
 * did — auto-advance just nudges `scrollLeft` on a timer.
 *
 * Auto-rotation is content that moves without the visitor asking, which WCAG
 * 2.2.2 requires a way to stop. There is an explicit pause control, and
 * rotation also pauses while a pointer is over the rail, while focus is inside
 * it, and while the tab is hidden. Under prefers-reduced-motion it never starts
 * and the control is hidden, leaving an ordinary scrollable row.
 */
export function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  /**
   * Advances to a specific slide rather than by a distance.
   *
   * `scrollBy` fights `scroll-snap-type: mandatory`: if the requested distance
   * lands past the last reachable snap point the browser springs back and
   * nothing moves at all. Scrolling to a child's own offset always lands on a
   * snap point, and clamping to `maxScroll` means the last slides still work
   * when the remaining travel is shorter than one card.
   */
  const step = useCallback((direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const slides = Array.from(scroller.children) as HTMLElement[];
    if (slides.length < 2) return;

    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    if (maxScroll <= 1) return;

    const current = slides.reduce(
      (best, slide, index) =>
        Math.abs(slide.offsetLeft - scroller.scrollLeft) <
        Math.abs(slides[best].offsetLeft - scroller.scrollLeft)
          ? index
          : best,
      0,
    );

    let next = current + direction;
    // Wrap when the next slide is past the end, or cannot be scrolled to
    // because everything after it already fits on screen.
    if (next >= slides.length || slides[next].offsetLeft > maxScroll + 1) next = 0;
    if (next < 0) next = slides.length - 1;

    scroller.scrollTo({
      left: Math.min(slides[next].offsetLeft, maxScroll),
      behavior: "smooth",
    });
  }, []);

  const running = playing && !held && !reduced;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") step(1);
    }, INTERVAL);
    return () => clearInterval(id);
  }, [running, step]);

  return (
    <div
      // Tells assistive tech this region rotates, so the pause control and the
      // changing content are explicable rather than surprising.
      aria-roledescription="carousel"
      aria-label="Reviews from families"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      <ul
        ref={scrollerRef}
        className="rail mt-10 gap-4 px-5 pb-2 sm:gap-5 sm:px-8 lg:mt-12"
        tabIndex={0}
        aria-label="Reviews"
      >
        {reviews.map((review, index) => (
          <li
            key={`${review.name}-${index}`}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${reviews.length}`}
            className="w-[78vw] max-w-[22rem] sm:w-[20rem] lg:w-[22rem]"
          >
            <figure className="flex h-full flex-col border-t-2 border-navy-950 bg-white p-7">
              <Stars />
              <blockquote className="mt-5 flex-1 text-base leading-relaxed text-navy-700">
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-navy-950/10 pt-5">
                <span className="block text-xs font-bold uppercase tracking-[0.08em] text-navy-950">
                  {review.name}
                </span>
                <span className="mt-1 block text-xs text-navy-600">{review.role}</span>
                {review.source ? (
                  <span className="mt-2 block text-xs text-navy-600">via {review.source}</span>
                ) : null}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center gap-3 px-5 sm:px-8">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous review"
          className="grid h-11 w-11 place-items-center border border-navy-950/20 text-navy-950 transition-colors hover:border-navy-950"
        >
          <Icon name="arrowLeft" className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next review"
          className="grid h-11 w-11 place-items-center border border-navy-950/20 text-navy-950 transition-colors hover:border-navy-950"
        >
          <Icon name="arrowRight" className="h-4 w-4" />
        </button>

        {/* Required escape hatch for auto-rotation; pointless when rotation
            never starts, so it is hidden under reduced motion. */}
        {reduced ? null : (
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            aria-pressed={!playing}
            className={cn(
              "ml-2 inline-flex h-11 items-center gap-2 border px-4 text-xs font-bold uppercase tracking-[0.06em] transition-colors",
              "border-navy-950/20 text-navy-950 hover:border-navy-950",
            )}
          >
            <Icon name={playing ? "pause" : "play"} className="h-4 w-4" />
            {playing ? "Pause" : "Play"}
          </button>
        )}
      </div>
    </div>
  );
}
