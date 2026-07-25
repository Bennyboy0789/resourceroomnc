import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

const tones = {
  white: "bg-white text-navy-900",
  mist: "bg-mist text-navy-900",
  frost: "bg-frost text-navy-900",
  navy: "bg-navy-900 text-white",
} as const;

export function Section({
  children,
  tone = "white",
  className,
  id,
  size = "default",
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
  id?: string;
  size?: "default" | "narrow";
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-20 lg:py-24", tones[tone], className)}>
      <Container size={size}>{children}</Container>
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
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow ? (
        <p className={cn("eyebrow mb-3", tone === "dark" ? "text-brand-600" : "text-sun-400")}>
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "text-balance text-3xl font-bold tracking-tight sm:text-4xl",
          tone === "dark" ? "text-navy-900" : "text-white",
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
            "mt-4 text-lg leading-relaxed",
            tone === "dark" ? "text-navy-600" : "text-white/70",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
