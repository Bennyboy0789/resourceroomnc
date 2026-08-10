"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { GalleryPhoto } from "@/content/programs";

const AUTOPLAY_MS = 4000;

/**
 * Camp photos as polaroids tossed on a table.
 *
 * Three are on screen at once — the neighbours sit behind, smaller and
 * dimmed, so the row reads as a stack you can move through rather than a
 * single framed image.
 *
 * Every polaroid's placement is one composed `transform`. Tailwind's
 * translate/scale utilities and an inline rotate cannot be mixed here: they
 * both write the same CSS property, the inline one wins, and the neighbours
 * would land centred on top of the main photo with nothing to show for it.
 *
 * Autoplay follows the same rules as the review carousel: it never starts
 * under prefers-reduced-motion, it pauses on hover and on focus, and there is
 * an explicit control, which is what WCAG 2.2.2 asks for.
 */
export function PhotoCarousel({ photos }: { photos: GalleryPhoto[] }) {
  const count = photos.length;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  const [reduced, setReduced] = useState(true);

  /* Modulo twice: JavaScript's % keeps the sign, so stepping back from 0
     gives -1 rather than the last photo. */
  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!playing || held || reduced || count < 2) return;
    const id = setInterval(() => go(index + 1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [playing, held, reduced, count, index, go]);

  if (!count) return null;

  const prev = (index - 1 + count) % count;
  const next = (index + 1) % count;

  /* Neighbours are only worth drawing when they are different photos. */
  const slots: { photo: GalleryPhoto; role: "prev" | "main" | "next" }[] =
    count > 2
      ? [
          { photo: photos[prev], role: "prev" },
          { photo: photos[next], role: "next" },
          { photo: photos[index], role: "main" },
        ]
      : [{ photo: photos[index], role: "main" }];

  return (
    <div
      className="relative"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      {/* Clipped on the x axis only: the neighbours are pushed ±92% and ran
          54px past the viewport on a phone. `clip` rather than `hidden` so
          the y axis stays visible — the pin overhangs the top of the main
          polaroid and would otherwise be sliced off. */}
      <div className="relative h-[420px] overflow-x-clip sm:h-[460px]">
        {slots.map(({ photo, role }) => {
          const main = role === "main";
          const shift = role === "prev" ? "-92%" : role === "next" ? "92%" : "0%";
          const scale = main ? 1 : 0.9;

          return (
            <figure
              key={`${role}-${photo.src}`}
              aria-hidden={!main}
              className={cn(
                "absolute left-1/2 top-1/2 bg-white p-3 pb-10 shadow-xl transition-all duration-500 ease-out",
                main
                  ? "z-20 w-[68%] sm:w-[54%] md:w-[42%]"
                  : "z-10 w-[52%] opacity-60 blur-[1px] sm:w-[40%] md:w-[32%]",
              )}
              style={{
                transform: `translate(-50%, -50%) translateX(${shift}) scale(${scale}) rotate(${photo.rotate ?? 0}deg)`,
              }}
            >
              {main ? (
                <Icon
                  name="pin"
                  className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 -rotate-12 text-sun-500 drop-shadow"
                />
              ) : null}
              {/* Square, like the picture area of a real polaroid. It is also
                  the crop that costs the least: the source photos are mostly
                  4:3 landscape, and a portrait frame would have thrown away
                  about 40% of every one of them. */}
              <div className="relative aspect-square w-full overflow-hidden bg-mist">
                <Image
                  src={photo.src}
                  alt={main ? photo.alt : ""}
                  fill
                  sizes="(min-width: 768px) 42vw, 68vw"
                  className="object-cover"
                  draggable={false}
                />
              </div>
              {main ? (
                <figcaption
                  className="absolute bottom-2 left-0 right-0 text-center text-xl leading-none text-navy-800"
                  style={{ fontFamily: "var(--font-caveat)" }}
                >
                  {photo.caption}
                </figcaption>
              ) : null}
            </figure>
          );
        })}

        {count > 1 ? (
          <>
            <Arrow label="Previous photo" onClick={() => go(index - 1)} side="left" />
            <Arrow label="Next photo" onClick={() => go(index + 1)} side="right" />
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-2">
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show photo ${i + 1} of ${count}: ${photo.caption}`}
              aria-current={i === index}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300",
                i === index ? "w-7 bg-sun-500" : "w-2.5 bg-brand-500/30 hover:bg-brand-500/60",
              )}
            />
          ))}

          {/* Hidden under reduced motion, where nothing is moving to stop. */}
          {reduced ? null : (
            <button
              type="button"
              onClick={() => setPlaying((on) => !on)}
              aria-label={playing ? "Pause the photo slideshow" : "Play the photo slideshow"}
              className="ml-3 grid h-8 w-8 place-items-center rounded-full text-brand-500 transition-colors hover:bg-brand-50"
            >
              <Icon name={playing ? "pause" : "play"} className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ) : null}

      <p aria-live="polite" className="sr-only">
        Photo {index + 1} of {count}: {photos[index].caption}
      </p>
    </div>
  );
}

function Arrow({
  label,
  onClick,
  side,
}: {
  label: string;
  onClick: () => void;
  side: "left" | "right";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "absolute top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-brand-500 shadow-md transition-colors hover:bg-brand-500 hover:text-white",
        side === "left" ? "left-0 sm:left-2" : "right-0 sm:right-2",
      )}
    >
      <Icon name={side === "left" ? "arrowLeft" : "arrowRight"} className="h-5 w-5" />
    </button>
  );
}
