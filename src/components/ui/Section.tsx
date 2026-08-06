import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "./Container";

const tones = {
  white: "bg-white text-navy-900",
  mist: "bg-mist text-navy-900",
  frost: "bg-frost text-navy-900",
  navy: "bg-brand-500 text-white",
} as const;

export function Section({
  children,
  tone = "white",
  className,
  id,
  size = "default",
  /** Drops the container so children can run to the screen edge. */
  bleed = false,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
  id?: string;
  size?: "narrow" | "default" | "wide";
  bleed?: boolean;
}) {
  return (
    <section id={id} className={cn("py-20 sm:py-24 lg:py-28", tones[tone], className)}>
      {bleed ? children : <Container size={size}>{children}</Container>}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = "left",
  tone = "dark",
}: {
  eyebrow?: string;
  title: string;
  /** Appended to the title and rendered in the accent color. */
  accent?: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className={cn("eyebrow mb-4", tone === "dark" ? "text-brand-500" : "text-sun-500")}>
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "display text-balance text-4xl sm:text-5xl lg:text-[3.5rem]",
          tone === "dark" ? "text-navy-950" : "text-white",
        )}
      >
        {title}
        {/* Yellow is unreadable on white, so the accent word is blue on light
            sections and the brand yellow on dark ones. */}
        {accent ? (
          <span className={tone === "dark" ? "text-brand-500" : "text-sun-500"}> {accent}</span>
        ) : null}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 text-lg leading-relaxed",
            tone === "dark" ? "text-navy-600" : "text-white/70",
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
