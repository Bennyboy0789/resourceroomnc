import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Container } from "@/components/ui/Container";
import type { ProgramImage } from "@/content/programs";
import { imagePosition } from "@/content/programs";
import type { IconName } from "@/components/icons";

/**
 * Page masthead. Runs as flat navy by default; pass an `image` to back it with
 * a photograph, which the program pages use so each one opens on its own art.
 */
export function PageHero({
  eyebrow,
  title,
  accent,
  description,
  breadcrumb,
  image,
  icon,
  children,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: string;
  breadcrumb?: { label: string; href: string };
  image?: ProgramImage;
  icon?: IconName;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      {image && icon ? (
        <>
          <div className="absolute inset-0">
            <PhotoSlot
              src={image.src}
              alt=""
              position={imagePosition(image)}
              icon={icon}
              ratio="auto"
              sizes="100vw"
              className="h-full rounded-none"
              priority
            />
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-navy-950/60" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/55 to-navy-950/25"
          />
        </>
      ) : (
        <div
          aria-hidden="true"
          className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-brand-500/25 blur-3xl"
        />
      )}

      <Container size="wide" className="relative py-20 sm:py-24 lg:py-32">
        {breadcrumb ? (
          <Link
            href={breadcrumb.href}
            className="mb-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-white/60 transition-colors hover:text-white"
          >
            <Icon name="arrowRight" className="h-4 w-4 rotate-180" />
            {breadcrumb.label}
          </Link>
        ) : null}

        {eyebrow ? <p className="eyebrow text-sun-500">{eyebrow}</p> : null}

        <h1 className="display mt-5 max-w-4xl text-balance text-5xl sm:text-6xl lg:text-7xl">
          {title}
          {accent ? <span className="text-sun-500"> {accent}</span> : null}
        </h1>

        {description ? (
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/80">{description}</p>
        ) : null}

        {children ? <div className="mt-10">{children}</div> : null}
      </Container>
    </section>
  );
}
