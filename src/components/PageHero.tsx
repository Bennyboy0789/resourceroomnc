import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import { Container } from "@/components/ui/Container";

export function PageHero({
  eyebrow,
  title,
  accent,
  description,
  breadcrumb,
  children,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: string;
  breadcrumb?: { label: string; href: string };
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 text-white">
      <div
        aria-hidden="true"
        className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-brand-600/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <Container className="relative py-14 sm:py-20 lg:py-24">
        {breadcrumb ? (
          <Link
            href={breadcrumb.href}
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            <Icon name="arrowRight" className="h-4 w-4 rotate-180" />
            {breadcrumb.label}
          </Link>
        ) : null}

        {eyebrow ? <p className="eyebrow text-sun-400">{eyebrow}</p> : null}

        <h1 className="mt-3 max-w-3xl text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
          {title}
          {accent ? <span className="text-sun-500"> {accent}</span> : null}
        </h1>

        {description ? (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">{description}</p>
        ) : null}

        {children ? <div className="mt-9">{children}</div> : null}
      </Container>
    </section>
  );
}
