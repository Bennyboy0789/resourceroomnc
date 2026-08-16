import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { CareWeb } from "@/components/ui/CareWeb";
import type { PathwaysHighlight } from "@/content/pathways";
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

/**
 * The six program-highlight icons, traced from the original page.
 *
 * Pathways uses Feather rather than the icon set the rest of this site draws
 * from, and the shapes are visibly different — an open book, a ticked square, a
 * globe, a briefcase. Rather than approximate them with the nearest Resource
 * Room icon, the paths are copied verbatim so the row matches exactly.
 */
const PATHWAYS_ICONS: Record<PathwaysHighlight["icon"], ReactNode> = {
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  bookOpen: (
    <>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </>
  ),
  checkSquare: (
    <>
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
    </>
  ),
  star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  briefcase: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </>
  ),
};

function PathwaysIcon({ name }: { name: PathwaysHighlight["icon"] }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHWAYS_ICONS[name]}
    </svg>
  );
}

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
            <p className="inline-flex rounded-[3px] border border-pw-gold-light/70 bg-pw-navy/70 px-5 py-[9px] text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
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
            <div className="mt-9 flex flex-col items-start gap-4">
              <Link
                href={pathwaysHero.primaryCta.href}
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-pw-gold px-[34px] text-[0.875rem] font-bold uppercase tracking-[0.08em] text-pw-navy transition-colors hover:bg-pw-gold-light"
              >
                {pathwaysHero.primaryCta.label}
              </Link>
              <a
                href={pathwaysHero.secondaryCta.href}
                className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/50 px-[34px] text-[0.875rem] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-white/10"
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
                  className="inline-flex items-center rounded-[4px] border border-pw-gold/45 bg-white/[0.07] px-6 py-[14px] text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-white/90 transition-colors hover:border-pw-gold hover:text-pw-gold"
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
                <span className="grid h-12 w-12 place-items-center rounded-[10px] bg-pw-navy text-pw-gold">
                  <PathwaysIcon name={item.icon} />
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
          {/* A <br /> rather than a block span: a block element here would push
              the emphasis and the words after it onto a third line, where the
              original breaks only once. */}
          <h2 className="mt-5 max-w-4xl font-pw-display text-[2rem] font-normal leading-[1.12] sm:text-[3rem]">
            {pathwaysEcosystem.titleLead.split("\n").map((line, index) => (
              <Fragment key={line}>
                {index > 0 ? <br /> : null}
                {line}
              </Fragment>
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
                    <span className="inline-flex self-start rounded-[3px] bg-pw-gold px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-pw-navy">
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
                      className="flex h-full flex-col rounded-[8px] border border-pw-gold/20 bg-white/[0.06] px-7 py-8 transition-colors hover:border-pw-gold/60 hover:bg-white/[0.1]"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className="flex h-full flex-col rounded-[8px] border border-pw-gold bg-pw-gold/12 px-7 py-8">
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

          <CareWeb
            nodes={pathwaysCoordinated.nodes}
            tone="pathways"
            logo={{ src: "/images/pathways/the-resource-room.png", alt: "The Resource Room" }}
          />

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

