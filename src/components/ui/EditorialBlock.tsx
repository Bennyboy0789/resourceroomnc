import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

/**
 * Edge-to-edge photograph with copy set over it — the pause between rails.
 *
 * The scrim is a gradient anchored to whichever side the text sits on, so the
 * copy always has a dark field under it while the far side of the photograph
 * stays open. Text sits at `align`; on small screens it drops to the bottom and
 * the scrim goes vertical, because a horizontal gradient leaves nothing behind
 * copy once the layout is one column wide.
 */
export function EditorialBlock({
  image,
  alt,
  align = "left",
  height = "tall",
  children,
}: {
  image: string;
  alt: string;
  align?: "left" | "right";
  height?: "tall" | "short";
  children: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      <ParallaxImage src={image} alt={alt} />

      {/* Vertical scrim for the stacked mobile layout. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-brand-500/95 via-brand-500/70 to-brand-550/25 lg:hidden"
      />
      {/* Horizontal scrim once the copy moves to one side. */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 hidden lg:block",
          align === "left"
            ? "bg-gradient-to-r from-navy-950/92 via-navy-950/60 to-transparent"
            : "bg-gradient-to-l from-navy-950/92 via-navy-950/60 to-transparent",
        )}
      />

      <Container
        size="wide"
        className={cn(
          "relative flex items-end lg:items-center",
          height === "tall" ? "min-h-[34rem] lg:min-h-[42rem]" : "min-h-[24rem] lg:min-h-[30rem]",
          "py-16 sm:py-20",
        )}
      >
        <Reveal className={cn("max-w-xl", align === "right" && "lg:ml-auto")}>{children}</Reveal>
      </Container>
    </section>
  );
}
