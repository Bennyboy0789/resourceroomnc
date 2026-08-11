import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Stars } from "@/components/ui/Stars";
import {
  academicYear,
  bonusIncentives,
  gradeTiers,
  hourlyPackages,
  packagesFaqs,
  packagesMeta,
  policies,
  readingIntervention,
  registrationFee,
  subscription,
  type PricedPlan,
  type TermPlan,
} from "@/content/tutoring-packages";
import { site } from "@/content/site";
import { stagger } from "@/lib/stagger";
import { seoTitle } from "@/lib/seo";

/**
 * The tutoring rate card — unlisted on purpose.
 *
 * `noindex` and absent from the nav and the sitemap, so it is reachable only by
 * the direct link Joe shares with a family. That is the same treatment as
 * /courses. It is a real route rather than a redirect, so the entry that used
 * to send this URL to /programs/tutoring has been removed — a redirect would
 * shadow the page.
 */
export const metadata: Metadata = {
  title: seoTitle("Tutoring Packages & Policies"),
  description:
    "Resource Room tutoring packages, subscription plans, and the policies that apply to each.",
  alternates: { canonical: "/tutoring-packages-policies" },
  robots: { index: false, follow: false },
};

export default function TutoringPackagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Rates"
        title="Tutoring packages &"
        accent="policies."
        description={packagesMeta.tagline}
        breadcrumb={{ label: "Tutoring", href: "/programs/tutoring" }}
      >
        <Button href={site.consultationUrl} size="lg">
          Book a Free Consultation
          <Icon name="arrowRight" className="h-4 w-4" />
        </Button>
      </PageHero>

      {/* ------------------------------------------------- intro + reg fee */}
      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
          <div>
            <p className="text-lg leading-relaxed text-navy-800">{packagesMeta.intro}</p>
            <p className="mt-6 text-sm font-semibold text-brand-500">
              {packagesMeta.pricesEffective}
            </p>
          </div>

          <aside className="rounded-card border border-navy-900/10 bg-mist p-7">
            <h2 className="text-base font-bold tracking-tight text-navy-950">
              {registrationFee.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-navy-600">{registrationFee.body}</p>
            <h3 className="mt-5 text-xs font-bold uppercase tracking-[0.08em] text-brand-500">
              {registrationFee.waivedTitle}
            </h3>
            <ul className="mt-3 space-y-2.5">
              {registrationFee.waivedFor.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-navy-700">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-navy-900/10 pt-4 text-sm leading-relaxed text-navy-600">
              {registrationFee.upgradeNote}
            </p>
          </aside>
        </div>

        <p className="mt-10 rounded-card border-l-4 border-sun-500 bg-sun-50 p-6 leading-relaxed text-navy-800">
          {registrationFee.note}
        </p>
      </Section>

      {/* ------------------------------------------------ hourly packages */}
      <Section tone="mist" size="wide">
        <SectionHeading
          eyebrow="Pay as you go"
          title="Standard hourly"
          accent="packages."
          description={hourlyPackages.description}
        />
        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {hourlyPackages.plans.map((plan, index) => (
            <Reveal key={plan.name} as="li" delay={stagger(index, 0.08)} className="h-full">
              <PlanCard plan={plan} bestFor={plan.bestFor} />
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* -------------------------------------------- reading intervention */}
      <Section tone="white" size="wide">
        <SectionHeading
          eyebrow="Reading"
          title="Emerging reader"
          accent="intervention."
          description={readingIntervention.description}
        />

        <div className="mt-12 rounded-card border-l-4 border-brand-500 bg-mist p-7 sm:p-8">
          <h3 className="text-base font-bold tracking-tight text-navy-950">
            {readingIntervention.rationaleTitle}
          </h3>
          <p className="mt-3 leading-relaxed text-navy-600">{readingIntervention.rationale}</p>

          <h3 className="mt-8 text-base font-bold tracking-tight text-navy-950">
            {readingIntervention.includesTitle}
          </h3>
          <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {readingIntervention.includes.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-navy-700">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-sun-700" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <ul className="mx-auto mt-8 grid max-w-4xl gap-6 sm:grid-cols-2">
          {readingIntervention.plans.map((plan, index) => (
            <Reveal key={plan.name} as="li" delay={stagger(index, 0.08)} className="h-full">
              <TermCard plan={plan} />
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* -------------------------------------------------- subscription */}
      <Section tone="mist" size="wide">
        <SectionHeading
          eyebrow="Monthly"
          title="Scholar's"
          accent="subscription."
          description={subscription.description}
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {subscription.plans.map((plan, index) => (
            <Reveal key={plan.name} as="li" delay={stagger(index, 0.08)} className="h-full">
              <PlanCard plan={plan} />
            </Reveal>
          ))}
        </ul>
        <BestFor text={subscription.bestFor} />
      </Section>

      {/* ------------------------------------------------- academic year */}
      <Section tone="white" size="wide">
        <SectionHeading
          eyebrow="Returning clients"
          title="Full academic year"
          accent="plan."
          description={academicYear.description}
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {academicYear.plans.map((plan, index) => (
            <Reveal
              key={`${plan.name} ${plan.meta}`}
              as="li"
              delay={stagger(index % 4, 0.07)}
              className="h-full"
            >
              <PlanCard plan={plan} />
            </Reveal>
          ))}
        </ul>
        <p className="mt-8 text-sm font-semibold text-brand-500">{academicYear.oneTimeNote}</p>
        <BestFor text={academicYear.bestFor} />
      </Section>

      {/* ----------------------------------------------------- incentives */}
      <Section tone="mist">
        <SectionHeading eyebrow="Extras" title="Bonus" accent="incentives." align="center" />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {bonusIncentives.items.map((item, index) => (
            <Reveal
              key={item.title}
              as="li"
              delay={stagger(index, 0.08)}
              className="h-full rounded-card border border-navy-900/10 bg-white p-6 text-center"
            >
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-sun-500 text-navy-950">
                <Icon name="badge" className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-sm font-bold tracking-tight text-navy-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">{item.body}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* ------------------------------------------------------- policies */}
      <Section tone="white">
        <SectionHeading
          eyebrow="The fine print"
          title="Policies &"
          accent="procedures."
          description="Every package is covered by the terms below. Open a section to read the detail that applies to your plan."
        />
        <div className="mt-12 space-y-4">
          {policies.sections.map((section) => (
            <details
              key={section.title}
              className="group rounded-card border border-navy-900/10 bg-white"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-6 text-left [&::-webkit-details-marker]:hidden">
                <h3 className="text-base font-bold tracking-tight text-navy-950">
                  {section.title}
                </h3>
                <Icon
                  name="chevronDown"
                  className="h-4 w-4 shrink-0 text-brand-500 transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="grid gap-6 border-t border-navy-900/10 p-6 sm:grid-cols-2">
                {section.groups.map((group, index) => (
                  <div key={group.title || index}>
                    {group.title ? (
                      <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-brand-500">
                        {group.title}
                      </h4>
                    ) : null}
                    <ul className={group.title ? "mt-3 space-y-2" : "space-y-2"}>
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-sm leading-relaxed text-navy-700"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-500"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------------ faq */}
      <Section tone="mist">
        <SectionHeading eyebrow="Questions" title="Frequently asked" accent="questions." />
        <div className="mt-10 max-w-3xl divide-y divide-navy-900/10 border-y border-navy-900/10">
          {packagesFaqs.map((item) => (
            <details key={item.q} className="group" open>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
                <h3 className="text-base font-bold tracking-tight text-navy-950">{item.q}</h3>
                <Icon
                  name="chevronDown"
                  className="mt-1 h-4 w-4 shrink-0 text-brand-500 transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="pb-6 leading-relaxed text-navy-600">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------------ cta */}
      <section className="bg-brand-500 text-white">
        <div className="mx-auto w-full max-w-5xl px-5 py-16 text-center sm:px-8 sm:py-20">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-bold uppercase tracking-[0.08em] text-white/70">
            <span className="flex items-center gap-2">
              <Stars className="flex text-sun-500" />
              100+ Five-Star Reviews
            </span>
            <span>Holly Springs Business of the Year 2022</span>
            <span>Voted 2025 Raleigh&rsquo;s Best</span>
          </div>
          <h2 className="display mt-8 text-3xl sm:text-4xl">
            Need help choosing the <span className="text-sun-500">right plan?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-white/75">
            Book your free 30-minute consultation today. We will help match your child with the
            plan that fits their learning goals and your family&rsquo;s schedule.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={site.consultationUrl} size="lg">
              Book a Free Consultation
            </Button>
            <Button href={site.phoneHref} variant="outline" size="lg">
              <Icon name="phone" className="h-4 w-4" />
              {site.phone}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

/**
 * One package, priced across the four grade bands.
 *
 * The bands are a <dl> rather than a <table>: each card is a standalone
 * name/value list, and four two-cell rows read better to a screen reader as
 * definitions than as a table with a single data column.
 */
function PlanCard({ plan, bestFor }: { plan: PricedPlan; bestFor?: string }) {
  return (
    <div
      className={`flex h-full flex-col rounded-card border bg-white p-7 ${
        plan.featured ? "border-sun-500 ring-1 ring-sun-500" : "border-navy-900/10"
      }`}
    >
      {plan.badge ? (
        <span className="mb-4 inline-flex self-start rounded-full bg-sun-500 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-navy-950">
          {plan.badge}
        </span>
      ) : null}

      <h3 className="text-lg font-bold tracking-tight text-navy-950">{plan.name}</h3>
      <p className="mt-1.5 text-sm text-navy-600">{plan.meta}</p>

      <dl className="mt-6 divide-y divide-navy-900/8 border-y border-navy-900/8">
        {gradeTiers.map((tier, index) => (
          <div key={tier} className="flex items-center justify-between gap-4 py-2.5">
            <dt className="text-sm text-navy-600">{tier}</dt>
            <dd className="text-sm font-bold tabular-nums text-navy-950">{plan.prices[index]}</dd>
          </div>
        ))}
      </dl>

      {plan.note ? (
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.06em] text-brand-500">
          {plan.note}
        </p>
      ) : null}

      {bestFor ? (
        <p className="mt-auto pt-5 text-sm leading-relaxed text-navy-600">
          <span className="font-bold text-navy-950">Best for: </span>
          {bestFor}
        </p>
      ) : null}
    </div>
  );
}

/**
 * One reading-intervention term.
 *
 * Reading is priced per session at one rate for everyone, so this card leads
 * on the per-session figure and carries a single total, rather than the four
 * grade bands a `PlanCard` shows.
 */
function TermCard({ plan }: { plan: TermPlan }) {
  return (
    <div
      className={`flex h-full flex-col rounded-card border bg-white p-7 ${
        plan.featured ? "border-sun-500 ring-1 ring-sun-500" : "border-navy-900/10"
      }`}
    >
      {plan.badge ? (
        <span className="mb-4 inline-flex self-start rounded-full bg-sun-500 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-navy-950">
          {plan.badge}
        </span>
      ) : null}

      <h3 className="text-lg font-bold tracking-tight text-navy-950">{plan.name}</h3>
      <p className="mt-1.5 text-sm text-navy-600">{plan.meta}</p>
      <p className="mt-3 inline-flex self-start rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.06em] text-brand-500">
        {plan.perSession}
      </p>

      <dl className="mt-6 border-y border-navy-900/8">
        <div className="flex items-center justify-between gap-4 py-2.5">
          <dt className="text-sm text-navy-600">{plan.priceLabel}</dt>
          <dd className="text-sm font-bold tabular-nums text-navy-950">{plan.price}</dd>
        </div>
      </dl>

      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.06em] text-navy-500">
        {plan.completeWithin}
      </p>

      <p className="mt-auto pt-5 text-sm leading-relaxed text-navy-600">
        <span className="font-bold text-navy-950">Best for: </span>
        {plan.bestFor}
      </p>
    </div>
  );
}

function BestFor({ text }: { text: string }) {
  return (
    <p className="mt-8 max-w-3xl leading-relaxed text-navy-600">
      <span className="font-bold text-navy-950">Best for: </span>
      {text}
    </p>
  );
}
