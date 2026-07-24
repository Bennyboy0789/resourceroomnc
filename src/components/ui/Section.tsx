import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

const tones = {
  white: "bg-white text-navy-900",
  mist: "bg-mist text-navy-900",
  cream: "bg-cream text-navy-900",
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
        <p className={cn("eyebrow mb-3", tone === "dark" ? "text-brand-600" : "text-gold-400")}>
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
        {accent ? <span className="text-gold-500"> {accent}</span> : null}
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
