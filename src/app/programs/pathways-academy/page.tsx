import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import {
  pathwaysCoordinated,
  pathwaysCta,
  pathwaysDifference,
  pathwaysDiploma,
  pathwaysEcosystem,
  pathwaysEcosystemStrip,
  pathwaysFunding,
  pathwaysHero,
  pathwaysHighlights,
  pathwaysJourney,
  pathwaysWhoFor,
} from "@/content/pathways";
import { getProgram } from "@/content/programs";
import { addressLine, site } from "@/content/site";
import { breadcrumbSchema, jsonLd } from "@/lib/schema";
import { seoDescription, seoTitle } from "@/lib/seo";

/**
 * Pathways Academy.
 *
 * This page deliberately does NOT use the shared program template. Pathways ran
 * as its own site with its own brand — Playfair Display over DM Sans, a softer
 * navy, an antique gold, warm cream sections — and Joe asked on the Aug 3 2026
 * call for it to look exactly as it did once folded in here. So the layout
 * below reproduces pathways.resourceroom.com section for section, using the
 * `pw-*` tokens in globals.css.
 *
 * The site header and footer still wrap it. The whole point of the merge was
 * that the old subdomain bounced families out to resourceroomnc.com and back
 * again; giving this page its own chrome would rebuild that dead end inside a
 * single domain.
 */

export const metadata: Metadata = {
  title: seoTitle("Pathways Academy", "Holly Springs, NC"),
  description: seoDescription(
    "A private diploma-granting high school in Holly Springs for neurodiverse teens in grades 9–12. Small cohorts, licensed educators, daily executive functioning support, and help navigating ESA+ and Opportunity Scholarship funding.",
  ),
  alternates: { canonical: "/programs/pathways-academy" },
};

const GOLD_RULE = "h-px w-full bg-pw-gold/30";

export default function PathwaysAcademyPage() {
  const program = getProgram("pathways-academy");

  return (
    <div className="font-pw-body text-pw-ink [font-feature-settings:'liga']">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            {
              "@context": "https://schema.org",
              "@type": "HighSchool",
              name: "Pathways Academy",
              description: program?.summary,
              url: `${site.url}/programs/pathways-academy`,
              parentOrganization: { "@type": "EducationalOrganization", name: site.legalName },
              address: {
                "@type": "PostalAddress",
                streetAddress: site.address.street,
                addressLocality: site.address.city,
                addressRegion: site.address.state,
                postalCode: site.address.zip,
              },
              telephone: site.phone,
              email: site.email,
            },
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Programs", path: "/programs" },
              { name: "Pathways Academy", path: "/programs/pathways-academy" },
            ]),
          ),
        }}
      />

      {/* ---------------------------------------------------------------- hero */}
      <section className="relative isolate overflow-hidden bg-pw-navy">
        <Image
          src="/images/pathways/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Left-weighted scrim: the artwork carries the Pathways wordmark in the
            middle, so the copy side darkens and the centre stays legible. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-pw-navy/85 via-pw-navy/45 to-pw-navy/10"
        />
        <div className="relative mx-auto w-full max-w-[76rem] px-5 py-24 sm:px-8 sm:py-28 lg:py-36">
          <div className="max-w-xl">
            <p className="inline-flex bg-white/15 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
              {pathwaysHero.badge}
            </p>
            <h1 className="mt-7 font-pw-display text-[2.6rem] font-normal leading-[1.12] text-white sm:text-5xl lg:text-[3.4rem]">
              {pathwaysHero.titleLead}{" "}
              <em className="italic underline decoration-pw-gold decoration-[3px] underline-offset-[6px]">
                {pathwaysHero.titleEmphasis}
              </em>{" "}
              {pathwaysHero.titleRest.split("\n").map((line, index) => (
                <span key={line} className={index ? "block" : undefined}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-5 font-pw-display text-xl text-white/90">{pathwaysHero.subtitle}</p>
            <p className="mt-6 max-w-md text-[0.975rem] leading-relaxed text-white/80">
              {pathwaysHero.body}
            </p>
            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href={pathwaysHero.primaryCta.href}
                className="inline-flex min-h-12 items-center justify-center bg-pw-gold px-8 text-xs font-bold uppercase tracking-[0.12em] text-pw-navy transition-colors hover:bg-pw-gold-light"
              >
                {pathwaysHero.primaryCta.label}
              </Link>
              <a
                href={pathwaysHero.secondaryCta.href}
                className="inline-flex min-h-12 items-center justify-center border border-white/60 px-8 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/10"
              >
                {pathwaysHero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- ecosystem strip */}
      <section className="bg-pw-navy py-14 text-white">
        <div className="mx-auto w-full max-w-[76rem] px-5 sm:px-8">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-center sm:text-left">
            <Image
              src="/images/pathways/the-resource-room.png"
              alt="The Resource Room"
              width={96}
              height={96}
              className="h-20 w-20 shrink-0 rounded-full ring-2 ring-pw-gold/70"
            />
            <div>
              <p className="font-pw-display text-2xl">{pathwaysEcosystemStrip.title}</p>
              <p className="mt-1.5 text-sm text-white/70">{pathwaysEcosystemStrip.subtitle}</p>
            </div>
            <Image
              src="/images/pathways/raleigh-s-best-2025-bronze-winner.png"
              alt="Raleigh's Best 2025 Bronze Winner — The News &amp; Observer"
              width={110}
              height={90}
              className="h-auto w-24 shrink-0"
            />
          </div>

          <ul className="mt-10 flex flex-wrap justify-center gap-3">
            {pathwaysEcosystemStrip.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center border border-white/25 px-5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:border-pw-gold hover:text-pw-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --------------------------------------- who it's for / difference */}
      <section id="about" className="scroll-mt-28 bg-pw-cream py-20 sm:py-24">
        <div className="mx-auto grid w-full max-w-[76rem] gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-pw-gold">
              {pathwaysWhoFor.eyebrow}
            </p>
            <h2 className="mt-5 font-pw-display text-[2.1rem] font-normal leading-[1.16] text-pw-navy sm:text-[2.6rem]">
              {pathwaysWhoFor.titleLead}{" "}
              <em className="italic">{pathwaysWhoFor.titleEmphasis}</em>
            </h2>
            <p className="mt-6 leading-[1.85] text-pw-ink">{pathwaysWhoFor.body}</p>
            <CheckList items={pathwaysWhoFor.items} />
          </div>

          <div>
            <h2 className="font-pw-display text-[2.1rem] font-normal leading-[1.16] text-pw-navy sm:text-[2.6rem] lg:mt-[3.4rem]">
              {pathwaysDifference.titleLead}{" "}
              <em className="italic">{pathwaysDifference.titleEmphasis}</em>{" "}
              {pathwaysDifference.titleRest}
            </h2>
            <p className="mt-6 leading-[1.85] text-pw-ink">{pathwaysDifference.body}</p>
            <CheckList items={pathwaysDifference.items} />
          </div>
        </div>

        <div className="mx-auto mt-14 w-full max-w-[76rem] px-5 sm:px-8">
          <div className="border-2 border-pw-gold bg-pw-navy p-8 sm:p-10">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-pw-gold">
              {pathwaysWhoFor.callout.label}
            </p>
            <p className="mt-4 max-w-4xl leading-[1.85] text-white/85">
              {pathwaysWhoFor.callout.body}
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ program highlights */}
      <section id="programs" className="scroll-mt-28 bg-white py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[76rem] px-5 sm:px-8">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-pw-gold">
            {pathwaysHighlights.eyebrow}
          </p>
          <h2 className="mt-5 max-w-3xl font-pw-display text-[2.1rem] font-normal leading-[1.16] text-pw-navy sm:text-[2.7rem]">
            {pathwaysHighlights.title.split("\n").map((line, index) => (
              <span key={line} className={index ? "block" : undefined}>
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-6 max-w-2xl leading-[1.85] text-pw-ink">{pathwaysHighlights.body}</p>

          {/* Hairline grid, as on the original: cells divided by rules rather
              than separated into floating cards. */}
          <ul className="mt-14 grid border-l border-t border-pw-navy/10 sm:grid-cols-2 lg:grid-cols-3">
            {pathwaysHighlights.items.map((item) => (
              <li key={item.title} className="border-b border-r border-pw-navy/10 p-8">
                <span className="grid h-12 w-12 place-items-center bg-pw-navy text-pw-gold">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-6 text-[0.8rem] font-bold uppercase tracking-[0.1em] text-pw-navy">
                  {item.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-[1.75] text-pw-ink">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------- the ecosystem */}
      <section className="bg-pw-navy py-20 text-white sm:py-24">
        <div className="mx-auto w-full max-w-[76rem] px-5 sm:px-8">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-pw-gold">
            {pathwaysEcosystem.eyebrow}
          </p>
          <h2 className="mt-5 max-w-4xl font-pw-display text-[2.1rem] font-normal leading-[1.16] sm:text-[2.7rem]">
            {pathwaysEcosystem.titleLead.split("\n").map((line, index) => (
              <span key={line} className={index ? "block" : undefined}>
                {line}
              </span>
            ))}{" "}
            <em className="italic text-pw-gold">{pathwaysEcosystem.titleEmphasis}</em>{" "}
            {pathwaysEcosystem.titleRest}
          </h2>
          <p className="mt-6 max-w-2xl leading-[1.85] text-white/70">{pathwaysEcosystem.body}</p>

          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pathwaysEcosystem.cards.map((card) => {
              const inner = (
                <>
                  {/* `self-start` on the pill because the card is a flex
                      column, which would otherwise stretch it to full width. */}
                  {card.here ? (
                    <span className="inline-flex self-start bg-pw-gold px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-pw-navy">
                      You are here
                    </span>
                  ) : null}
                  <h3
                    className={`text-[0.8rem] font-bold uppercase tracking-[0.1em] text-pw-gold ${
                      card.here ? "mt-4" : ""
                    }`}
                  >
                    {card.title}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-[1.75] text-white/75">{card.body}</p>
                </>
              );

              return (
                <li key={card.title}>
                  {card.href ? (
                    <Link
                      href={card.href}
                      className="flex h-full flex-col border border-white/12 bg-white/[0.04] p-7 transition-colors hover:border-pw-gold/60 hover:bg-white/[0.07]"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className="flex h-full flex-col border-2 border-pw-gold bg-white/[0.06] p-7">
                      {inner}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* --------------------------------------------------- family journey */}
      <section className="bg-pw-cream py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[76rem] px-5 sm:px-8">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-pw-gold">
            {pathwaysJourney.eyebrow}
          </p>
          <h2 className="mt-5 max-w-4xl font-pw-display text-[2.1rem] font-normal leading-[1.16] text-pw-navy sm:text-[2.7rem]">
            {pathwaysJourney.titleLead}{" "}
            <em className="italic">{pathwaysJourney.titleEmphasis}</em>{" "}
            {pathwaysJourney.titleRest}
          </h2>
          <p className="mt-6 max-w-2xl leading-[1.85] text-pw-ink">{pathwaysJourney.body}</p>

          {/* The connecting rule sits behind the numerals and is hidden on
              small screens, where the steps stack and a line between them
              would run through the copy. */}
          <ol className="relative mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            <span
              aria-hidden="true"
              className="absolute left-[10%] right-[10%] top-9 hidden h-px bg-pw-gold/50 lg:block"
            />
            {pathwaysJourney.steps.map((step, index) => (
              <li key={step.title} className="relative text-center">
                <span className="mx-auto grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full border-2 border-pw-gold bg-pw-navy font-pw-display text-2xl text-pw-gold">
                  {index + 1}
                </span>
                <h3 className="mt-6 text-[0.8rem] font-bold uppercase tracking-[0.1em] text-pw-navy">
                  {step.title}
                </h3>
                <p className="mt-3 text-[0.925rem] leading-[1.75] text-pw-ink">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------ tuition & funding */}
      <section id="funding" className="scroll-mt-28 bg-pw-sand py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[76rem] px-5 sm:px-8">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-pw-gold">
            {pathwaysFunding.eyebrow}
          </p>
          <h2 className="mt-5 max-w-3xl font-pw-display text-[2.1rem] font-normal leading-[1.16] text-pw-navy sm:text-[2.7rem]">
            {pathwaysFunding.titleLead}{" "}
            <em className="italic">{pathwaysFunding.titleEmphasis}</em>{" "}
            {pathwaysFunding.titleRest}
          </h2>
          <p className="mt-6 max-w-2xl leading-[1.85] text-pw-ink">{pathwaysFunding.body}</p>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {pathwaysFunding.grants.map((grant) => (
              <div
                key={grant.amount}
                className={
                  grant.dark
                    ? "bg-pw-navy p-8 sm:p-10"
                    : "border-l-4 border-pw-gold bg-white p-8 sm:p-10"
                }
              >
                <p
                  className={`font-pw-display text-[2.6rem] leading-none ${
                    grant.dark ? "text-pw-gold" : "text-pw-navy"
                  }`}
                >
                  {grant.amount}
                </p>
                <p
                  className={`mt-4 text-[0.7rem] font-bold uppercase tracking-[0.14em] ${
                    grant.dark ? "text-white/60" : "text-pw-ink/70"
                  }`}
                >
                  {grant.label}
                </p>
                <h3
                  className={`mt-3 text-lg font-bold ${
                    grant.dark ? "text-pw-gold" : "text-pw-navy"
                  }`}
                >
                  {grant.title}
                </h3>
                <p
                  className={`mt-4 text-[0.95rem] leading-[1.8] ${
                    grant.dark ? "text-white/75" : "text-pw-ink"
                  }`}
                >
                  {grant.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-5 bg-pw-navy p-8 sm:p-10">
            <span aria-hidden="true" className="text-2xl leading-none">
              💡
            </span>
            <div>
              <h3 className="text-lg font-bold text-pw-gold">{pathwaysFunding.callout.title}</h3>
              <p className="mt-3 leading-[1.8] text-white/80">{pathwaysFunding.callout.body}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- diploma */}
      <section className="bg-pw-sand pb-20 sm:pb-24">
        <div className="mx-auto w-full max-w-[76rem] px-5 sm:px-8">
          <div className={GOLD_RULE} />
          <div className="mt-16 flex flex-col gap-7 sm:flex-row">
            <span aria-hidden="true" className="text-3xl leading-none">
              🎓
            </span>
            <div className="max-w-3xl">
              <h2 className="font-pw-display text-[1.9rem] font-normal leading-tight text-pw-navy">
                {pathwaysDiploma.title}
              </h2>
              {pathwaysDiploma.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-5 leading-[1.85] text-pw-ink">
                  <Emphasised text={paragraph} />
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- coordinated care */}
      <section id="ecosystem" className="scroll-mt-28 bg-pw-cream py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[76rem] px-5 text-center sm:px-8">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-pw-gold">
            {pathwaysCoordinated.eyebrow}
          </p>
          <h2 className="mx-auto mt-5 max-w-4xl font-pw-display text-[2.1rem] font-normal leading-[1.16] text-pw-navy sm:text-[2.7rem]">
            {pathwaysCoordinated.titleLead}{" "}
            <em className="italic">{pathwaysCoordinated.titleEmphasis}</em>{" "}
            {pathwaysCoordinated.titleRest}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl leading-[1.85] text-pw-ink">
            {pathwaysCoordinated.body}
          </p>

          <CareDiagram />

          <p className="mx-auto mt-14 max-w-3xl font-pw-display text-xl italic text-pw-navy">
            &ldquo;{pathwaysCoordinated.quote}&rdquo;
          </p>

          <ul className="mt-14 grid gap-6 text-left lg:grid-cols-3">
            {pathwaysCoordinated.points.map((point, index) => (
              <li key={point.title} className="border border-pw-navy/10 bg-white p-8">
                <p className="font-pw-display text-2xl text-pw-gold">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-[0.8rem] font-bold uppercase tracking-[0.1em] text-pw-navy">
                  {point.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-[1.75] text-pw-ink">{point.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------ closing CTA */}
      <section className="bg-pw-navy py-20 text-center text-white sm:py-24">
        <div className="mx-auto w-full max-w-[76rem] px-5 sm:px-8">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-pw-gold">
            {pathwaysCta.eyebrow}
          </p>
          <h2 className="mx-auto mt-5 max-w-3xl font-pw-display text-[2.1rem] font-normal leading-[1.18] sm:text-[2.7rem]">
            {pathwaysCta.titleLead}
            <span className="mt-1 block italic text-pw-gold">{pathwaysCta.titleEmphasis}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl leading-[1.85] text-white/75">
            {pathwaysCta.body}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-h-12 w-full items-center justify-center bg-pw-gold px-9 text-xs font-bold uppercase tracking-[0.12em] text-pw-navy transition-colors hover:bg-pw-gold-light sm:w-auto"
            >
              Schedule a Consultation
            </Link>
            <a
              href={site.phoneHref}
              className="inline-flex min-h-12 w-full items-center justify-center border border-white/60 px-9 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              Call {site.phone}
            </a>
          </div>

          <p className="mt-8 text-sm text-white/60">
            Email:{" "}
            <a href={site.emailHref} className="text-pw-gold hover:underline">
              {site.email}
            </a>{" "}
            &nbsp;·&nbsp; {addressLine}
          </p>
        </div>
      </section>
    </div>
  );
}

/** Gold tick beside each line — the list style used throughout the original. */
function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="mt-9 space-y-4">
      {items.map((item) => (
        <li key={item} className="flex gap-3.5">
          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-pw-gold text-white">
            <Icon name="check" className="h-3 w-3" strokeWidth={3} />
          </span>
          <span className="text-[0.975rem] leading-[1.6] text-pw-ink">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Renders the **bold** spans the diploma copy carries on the original. */
function Emphasised({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={index} className="font-semibold text-pw-navy">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

/**
 * The coordinated-care diagram: the student and five services orbiting the
 * Resource Room mark.
 *
 * Laid out as a ring on desktop and a plain stacked list below `lg`, where six
 * absolutely positioned circles would overlap into an unreadable knot. The
 * connecting lines are one SVG behind the nodes so they scale with the box.
 */
function CareDiagram() {
  const [student, ...services] = pathwaysCoordinated.nodes;
  /* Even sixths of the circle, starting at the top. */
  const positions = [0, 60, 120, 180, 240, 300].map((deg) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: 50 + 38 * Math.cos(rad), y: 50 + 38 * Math.sin(rad) };
  });

  return (
    <>
      <div className="relative mx-auto mt-16 hidden aspect-square w-full max-w-2xl lg:block">
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          fill="none"
        >
          {positions.map((p, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={p.x}
              y2={p.y}
              stroke="var(--color-pw-gold)"
              strokeWidth="0.3"
              opacity="0.45"
            />
          ))}
        </svg>

        <span className="absolute left-1/2 top-1/2 grid h-36 w-36 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-pw-gold bg-pw-navy-soft p-6">
          <Image
            src="/images/pathways/the-resource-room.png"
            alt="The Resource Room"
            width={112}
            height={112}
            className="h-full w-full object-contain"
          />
        </span>

        {/* Keyed on title+strong, not `strong` alone: Academic Support and
            Behavioral Support share a second line. */}
        {[student, ...services].map((node, index) => (
          <span
            key={`${node.title} ${node.strong}`}
            style={{ left: `${positions[index].x}%`, top: `${positions[index].y}%` }}
            className="absolute grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-pw-gold bg-pw-navy px-3 text-center"
          >
            <span>
              <span className="block text-[0.58rem] font-bold uppercase tracking-[0.08em] text-pw-gold">
                {node.title}
              </span>
              <span className="block text-[0.66rem] font-bold uppercase leading-tight tracking-[0.01em] text-white">
                {node.strong}
              </span>
              {node.meta ? (
                <span className="mt-1 block text-[0.53rem] leading-tight text-white/60">
                  {node.meta}
                </span>
              ) : null}
            </span>
          </span>
        ))}
      </div>

      <ul className="mt-12 grid gap-4 text-left sm:grid-cols-2 lg:hidden">
        {pathwaysCoordinated.nodes.map((node) => (
          <li
            key={`${node.title} ${node.strong}`}
            className="flex items-center gap-4 border border-pw-navy/10 bg-white p-5"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-pw-gold bg-pw-navy text-[0.6rem] font-bold uppercase text-pw-gold">
              {node.strong.slice(0, 2)}
            </span>
            <span>
              <span className="block text-[0.8rem] font-bold uppercase tracking-[0.08em] text-pw-navy">
                {node.title} {node.strong}
              </span>
              {node.meta ? (
                <span className="mt-0.5 block text-[0.8rem] text-pw-ink">{node.meta}</span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
