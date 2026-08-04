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
      <section className="relative isolate flex items-center overflow-hidden bg-pw-navy lg:min-h-[920px]">
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
        <div className="relative mx-auto w-full max-w-[84rem] px-5 py-20 sm:px-8 lg:py-[90px]">
          <div className="max-w-xl">
            <p className="inline-flex bg-white/15 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
              {pathwaysHero.badge}
            </p>
            <h1 className="mt-7 font-pw-display text-[2.25rem] font-normal leading-[1.1] text-white sm:text-[2.875rem]">
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
            <p className="mt-6 max-w-md text-[0.9375rem] leading-[1.7] text-white/90">
              {pathwaysHero.body}
            </p>
            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href={pathwaysHero.primaryCta.href}
                className="inline-flex min-h-[54px] items-center justify-center bg-pw-gold px-8 text-[0.875rem] font-bold uppercase tracking-[0.08em] text-pw-navy transition-colors hover:bg-pw-gold-light"
              >
                {pathwaysHero.primaryCta.label}
              </Link>
              <a
                href={pathwaysHero.secondaryCta.href}
                className="inline-flex min-h-[54px] items-center justify-center border border-white/60 px-8 text-[0.875rem] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-white/10"
              >
                {pathwaysHero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- ecosystem strip */}
      {/* The strip's own container is narrower than the rest of the page —
          1200px against 1280 — which is how the original has it. */}
      <section className="bg-pw-navy py-12 text-white lg:py-[56px]">
        <div className="mx-auto flex w-full max-w-[79rem] flex-col gap-10 px-5 sm:px-8">
          <div className="flex flex-col items-center gap-7 text-center sm:flex-row sm:justify-center sm:text-left">
            <Image
              src="/images/pathways/the-resource-room.png"
              alt="The Resource Room"
              width={320}
              height={320}
              className="h-40 w-40 shrink-0 rounded-full border-2 border-pw-gold"
            />
            <div>
              <p className="text-[1.25rem] font-bold tracking-[0.02em] text-pw-gold-light">
                {pathwaysEcosystemStrip.title}
              </p>
              <p className="mt-1.5 text-[0.9375rem] text-white/65">
                {pathwaysEcosystemStrip.subtitle}
              </p>
            </div>
            <Image
              src="/images/pathways/raleigh-s-best-2025-bronze-winner.png"
              alt="Raleigh's Best 2025 Bronze Winner — The News &amp; Observer"
              width={184}
              height={150}
              className="h-auto w-[92px] shrink-0"
            />
          </div>

          <ul className="flex flex-wrap justify-center gap-[14px]">
            {pathwaysEcosystemStrip.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex items-center rounded-[4px] border border-pw-gold/45 px-6 py-[14px] text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-white/90 transition-colors hover:border-pw-gold hover:text-pw-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --------------------------------------- who it's for / difference */}
      <section id="about" className="scroll-mt-28 bg-pw-cream py-16 lg:py-[90px]">
        <div className="mx-auto grid w-full max-w-[84rem] gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[0.6875rem] font-bold uppercase leading-[1.6] tracking-[0.2em] text-pw-gold">
              {pathwaysWhoFor.eyebrow}
            </p>
            <h2 className="mt-5 font-pw-display text-[2rem] font-normal leading-[1.12] text-pw-navy sm:text-[3rem]">
              {pathwaysWhoFor.titleLead}{" "}
              <em className="italic">{pathwaysWhoFor.titleEmphasis}</em>
            </h2>
            <p className="mt-6 text-[1.0625rem] leading-[1.75] text-pw-ink">{pathwaysWhoFor.body}</p>
            <CheckList items={pathwaysWhoFor.items} />

            {/* The callout belongs inside this column on the original — it is
                610px wide and sits under the list, not full-bleed beneath both
                columns. */}
            <div className="mt-10 border-2 border-pw-gold bg-pw-navy p-8">
              <p className="text-[0.6875rem] font-bold uppercase leading-[1.6] tracking-[0.2em] text-pw-gold">
                {pathwaysWhoFor.callout.label}
              </p>
              <p className="mt-4 text-[0.9375rem] leading-[1.75] text-white/85">
                {pathwaysWhoFor.callout.body}
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-pw-display text-[2rem] font-normal leading-[1.12] text-pw-navy sm:text-[3rem] lg:mt-[3.4rem]">
              {pathwaysDifference.titleLead}{" "}
              <em className="italic">{pathwaysDifference.titleEmphasis}</em>{" "}
              {pathwaysDifference.titleRest}
            </h2>
            <p className="mt-6 text-[1.0625rem] leading-[1.75] text-pw-ink">{pathwaysDifference.body}</p>
            <CheckList items={pathwaysDifference.items} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ program highlights */}
      <section id="programs" className="scroll-mt-28 bg-white py-16 lg:py-[90px]">
        <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8">
          <p className="text-[0.6875rem] font-bold uppercase leading-[1.6] tracking-[0.2em] text-pw-gold">
            {pathwaysHighlights.eyebrow}
          </p>
          <h2 className="mt-5 max-w-3xl font-pw-display text-[2rem] font-normal leading-[1.12] text-pw-navy sm:text-[3rem]">
            {pathwaysHighlights.title.split("\n").map((line, index) => (
              <span key={line} className={index ? "block" : undefined}>
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-6 max-w-[650px] text-[1.0625rem] leading-[1.75] text-pw-ink">{pathwaysHighlights.body}</p>

          {/* Hairline grid, as on the original: cells divided by rules rather
              than separated into floating cards. */}
          <ul className="mt-14 grid border-l border-t border-pw-navy/10 sm:grid-cols-2 lg:grid-cols-3">
            {pathwaysHighlights.items.map((item) => (
              <li key={item.title} className="border-b border-r border-pw-navy/10 p-8">
                <span className="grid h-12 w-12 place-items-center bg-pw-navy text-pw-gold">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-6 text-[0.8125rem] font-bold uppercase leading-[1.6] tracking-[0.06em] text-pw-navy">
                  {item.title}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-[1.65] text-pw-ink">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------- the ecosystem */}
      <section className="bg-pw-navy py-16 text-white lg:py-[90px]">
        <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8">
          <p className="text-[0.6875rem] font-bold uppercase leading-[1.6] tracking-[0.2em] text-pw-gold">
            {pathwaysEcosystem.eyebrow}
          </p>
          <h2 className="mt-5 max-w-4xl font-pw-display text-[2rem] font-normal leading-[1.12] sm:text-[3rem]">
            {pathwaysEcosystem.titleLead.split("\n").map((line, index) => (
              <span key={line} className={index ? "block" : undefined}>
                {line}
              </span>
            ))}{" "}
            <em className="italic text-pw-gold">{pathwaysEcosystem.titleEmphasis}</em>{" "}
            {pathwaysEcosystem.titleRest}
          </h2>
          <p className="mt-6 max-w-[650px] text-[1.0625rem] leading-[1.75] text-white/70">{pathwaysEcosystem.body}</p>

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
                    className={`text-[0.8125rem] font-bold uppercase leading-[1.6] tracking-[0.06em] text-pw-gold ${
                      card.here ? "mt-4" : ""
                    }`}
                  >
                    {card.title}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] leading-[1.65] text-white/75">{card.body}</p>
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
      <section className="bg-pw-cream py-16 lg:py-[90px]">
        <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8">
          <p className="text-[0.6875rem] font-bold uppercase leading-[1.6] tracking-[0.2em] text-pw-gold">
            {pathwaysJourney.eyebrow}
          </p>
          <h2 className="mt-5 max-w-4xl font-pw-display text-[2rem] font-normal leading-[1.12] text-pw-navy sm:text-[3rem]">
            {pathwaysJourney.titleLead}{" "}
            <em className="italic">{pathwaysJourney.titleEmphasis}</em>{" "}
            {pathwaysJourney.titleRest}
          </h2>
          <p className="mt-6 max-w-[650px] text-[1.0625rem] leading-[1.75] text-pw-ink">{pathwaysJourney.body}</p>

          {/* The connecting rule sits behind the numerals and is hidden on
              small screens, where the steps stack and a line between them
              would run through the copy. */}
          <ol className="relative mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-[58px]">
            <span
              aria-hidden="true"
              className="absolute left-[10%] right-[10%] top-[45px] hidden h-px bg-pw-gold/50 lg:block"
            />
            {pathwaysJourney.steps.map((step, index) => (
              <li key={step.title} className="relative text-center">
                <span className="mx-auto grid h-[90px] w-[90px] place-items-center rounded-full border-2 border-pw-gold bg-pw-navy font-pw-display text-[36px] leading-none text-pw-gold">
                  {index + 1}
                </span>
                <h3 className="mt-6 text-[0.8125rem] font-bold uppercase leading-[1.6] tracking-[0.06em] text-pw-navy">
                  {step.title}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-[1.65] text-pw-ink">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------ tuition & funding */}
      <section id="funding" className="scroll-mt-28 bg-pw-sand py-16 lg:py-[90px]">
        <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8">
          <p className="text-[0.6875rem] font-bold uppercase leading-[1.6] tracking-[0.2em] text-pw-gold">
            {pathwaysFunding.eyebrow}
          </p>
          <h2 className="mt-5 max-w-3xl font-pw-display text-[2rem] font-normal leading-[1.12] text-pw-navy sm:text-[3rem]">
            {pathwaysFunding.titleLead}{" "}
            <em className="italic">{pathwaysFunding.titleEmphasis}</em>{" "}
            {pathwaysFunding.titleRest}
          </h2>
          <p className="mt-6 max-w-[650px] text-[1.0625rem] leading-[1.75] text-pw-ink">{pathwaysFunding.body}</p>

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
      <section className="bg-pw-sand pb-16 lg:pb-[60px]">
        <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8">
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
      <section id="ecosystem" className="scroll-mt-28 bg-pw-cream py-16 lg:py-[100px]">
        <div className="mx-auto w-full max-w-[84rem] px-5 text-center sm:px-8">
          <p className="text-[0.6875rem] font-bold uppercase leading-[1.6] tracking-[0.2em] text-pw-gold">
            {pathwaysCoordinated.eyebrow}
          </p>
          <h2 className="mx-auto mt-5 max-w-4xl font-pw-display text-[2rem] font-normal leading-[1.12] text-pw-navy sm:text-[3rem]">
            {pathwaysCoordinated.titleLead}{" "}
            <em className="italic">{pathwaysCoordinated.titleEmphasis}</em>{" "}
            {pathwaysCoordinated.titleRest}
          </h2>
          <p className="mx-auto mt-6 max-w-[650px] text-[1.0625rem] leading-[1.75] text-pw-ink">
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
                <h3 className="mt-4 text-[0.8125rem] font-bold uppercase leading-[1.6] tracking-[0.06em] text-pw-navy">
                  {point.title}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-[1.65] text-pw-ink">{point.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------ closing CTA */}
      <section className="bg-pw-navy py-16 text-center text-white lg:py-[100px]">
        <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8">
          <p className="text-[0.6875rem] font-bold uppercase leading-[1.6] tracking-[0.2em] text-pw-gold">
            {pathwaysCta.eyebrow}
          </p>
          <h2 className="mx-auto mt-5 max-w-3xl font-pw-display text-[2.1rem] font-normal leading-[1.18] sm:text-[3rem]">
            {pathwaysCta.titleLead}
            <span className="mt-1 block italic text-pw-gold">{pathwaysCta.titleEmphasis}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[650px] text-[1.0625rem] leading-[1.75] text-white/75">
            {pathwaysCta.body}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-h-[54px] w-full items-center justify-center bg-pw-gold px-9 text-[0.875rem] font-bold uppercase tracking-[0.08em] text-pw-navy transition-colors hover:bg-pw-gold-light sm:w-auto"
            >
              Schedule a Consultation
            </Link>
            <a
              href={site.phoneHref}
              className="inline-flex min-h-[54px] w-full items-center justify-center border border-white/60 px-9 text-[0.875rem] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-white/10 sm:w-auto"
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
          <span className="text-base leading-[1.6] text-pw-ink">{item}</span>
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
/* Node centres in the original's own 856×672 artboard, measured off the live
   page. It is not an even ring — the web is stretched horizontally and the
   lower three sit wider apart than the upper two — so the coordinates are
   transcribed rather than generated from an angle. */
const CARE_BOX = { w: 856, h: 672 };
const CARE_CENTRE = { x: 427, y: 373 };
const CARE_POINTS = [
  { x: 427, y: 66 }, // Your Student
  { x: 111, y: 288 }, // Academic Support
  { x: 744, y: 288 }, // Behavioral Support
  { x: 72, y: 576 }, // Clinical Evaluation
  { x: 427, y: 605 }, // Executive Functioning
  { x: 783, y: 576 }, // Speech & Communication
];
/* The outer ring, by index into CARE_POINTS: student→academic→clinical→
   executive→speech→behavioral→student. */
const CARE_RING = [
  [0, 1],
  [1, 3],
  [3, 4],
  [4, 5],
  [5, 2],
  [2, 0],
];

function CareDiagram() {
  return (
    <>
      <div
        className="relative mx-auto mt-16 hidden w-full max-w-[856px] lg:block"
        style={{ aspectRatio: `${CARE_BOX.w} / ${CARE_BOX.h}` }}
      >
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${CARE_BOX.w} ${CARE_BOX.h}`}
          className="absolute inset-0 h-full w-full"
          fill="none"
          stroke="var(--color-pw-gold)"
          strokeWidth="1.5"
          opacity="0.5"
        >
          {/* spokes out from the mark */}
          {CARE_POINTS.map((p, i) => (
            <line key={`spoke-${i}`} x1={CARE_CENTRE.x} y1={CARE_CENTRE.y} x2={p.x} y2={p.y} />
          ))}
          {/* and the ring joining neighbours */}
          {CARE_RING.map(([a, b]) => (
            <line
              key={`ring-${a}-${b}`}
              x1={CARE_POINTS[a].x}
              y1={CARE_POINTS[a].y}
              x2={CARE_POINTS[b].x}
              y2={CARE_POINTS[b].y}
            />
          ))}
        </svg>

        <span
          style={{
            left: `${(CARE_CENTRE.x / CARE_BOX.w) * 100}%`,
            top: `${(CARE_CENTRE.y / CARE_BOX.h) * 100}%`,
          }}
          className="absolute grid h-[188px] w-[188px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-pw-gold bg-pw-navy-soft p-7"
        >
          <Image
            src="/images/pathways/the-resource-room.png"
            alt="The Resource Room"
            width={188}
            height={188}
            className="h-full w-full object-contain"
          />
        </span>

        {/* Keyed on title+strong, not `strong` alone: Academic Support and
            Behavioral Support share a second line. */}
        {pathwaysCoordinated.nodes.map((node, index) => (
          <span
            key={`${node.title} ${node.strong}`}
            style={{
              left: `${(CARE_POINTS[index].x / CARE_BOX.w) * 100}%`,
              top: `${(CARE_POINTS[index].y / CARE_BOX.h) * 100}%`,
            }}
            className="absolute grid h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-pw-gold bg-pw-navy px-3 text-center"
          >
            <span>
              <span className="block text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-pw-gold">
                {node.title}
              </span>
              <span className="block text-[0.8125rem] font-bold uppercase leading-tight tracking-[0.02em] text-white">
                {node.strong}
              </span>
              {node.meta ? (
                <span className="mt-1 block text-[0.625rem] leading-tight text-white/60">
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
