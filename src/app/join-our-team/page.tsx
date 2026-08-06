import type { Metadata } from "next";
import { CareersForm } from "@/components/ContactForm";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import {
  careersApply,
  careersHero,
  careersProcess,
  careersQuote,
  careersRoles,
  careersWhy,
} from "@/content/careers";
import { addressLine, site } from "@/content/site";
import { stagger } from "@/lib/stagger";
import { seoDescription, seoTitle } from "@/lib/seo";

export const metadata: Metadata = {
  /* Leads with the job, not the invitation. "Join Our Team" is the nav label;
     nobody searches it. "Tutoring & Teaching Jobs — Holly Springs, NC" is
     what a candidate actually types, and lands on 60 characters exactly. */
  title: seoTitle("Tutoring & Teaching Jobs", "Holly Springs, NC"),
  description: seoDescription(
    "Resource Room hires licensed educators, tutors, camp instructors and support staff in Holly Springs, NC. See open roles and apply online with your resume.",
  ),
  alternates: { canonical: "/join-our-team" },
};

/**
 * Careers page, rebuilt from join-our-team-mockup.html.
 *
 * The page this replaces was a bare form with no context and no roles listed.
 * Structure, section order and copy all come from the mockup; it is rendered
 * with this site's components and type so the page still belongs to the rest of
 * the site rather than reading as a separate microsite.
 */
export default function JoinOurTeamPage() {
  return (
    <>
      {/* ------------------------------------------------------------- hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-brand-500 to-brand-600 text-white">
        {/* The soft gold disc bleeding off the bottom-right corner, as on the
            mockup. Decorative, so it is hidden from assistive tech. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-24 h-[26rem] w-[26rem] rounded-full bg-sun-500/12"
        />
        <Container className="relative py-20 text-center sm:py-24">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-sun-500">
              {careersHero.eyebrow}
            </p>
            <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl">
              {careersHero.titleLead}
              <span className="mt-1 block text-sun-500">{careersHero.titleAccent}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/90">
              {careersHero.body}
            </p>
            <div className="mt-9 flex justify-center">
              <Button href="#apply" size="lg">
                {careersHero.cta}
                <Icon name="arrowRight" className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* -------------------------------------------------- why work here */}
      <Section tone="white">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-500">
            {careersWhy.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
            {careersWhy.title}
          </h2>
          <p className="mt-4 leading-relaxed text-navy-600">{careersWhy.intro}</p>
        </Reveal>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {careersWhy.cards.map((card, index) => (
            <Reveal
              key={card.title}
              as="li"
              delay={stagger(index, 0.08)}
              className="h-full rounded-card border border-navy-900/10 bg-white p-7"
            >
              <p className="text-xs font-bold tracking-[0.1em] text-sun-700">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-base font-bold tracking-tight text-brand-600">
                {card.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-navy-600">{card.body}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* ------------------------------------------------------- open roles */}
      <Section tone="mist">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-500">
            {careersRoles.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
            {careersRoles.title}
          </h2>
          <p className="mt-4 leading-relaxed text-navy-600">{careersRoles.intro}</p>
        </Reveal>

        <ul className="mt-14 grid gap-4 lg:grid-cols-2">
          {careersRoles.items.map((role, index) => (
            <Reveal
              key={role.title}
              as="li"
              delay={stagger(index % 2, 0.08)}
              className="flex h-full items-start gap-4 rounded-card border border-navy-900/10 bg-white p-5"
            >
              <span
                aria-hidden="true"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-chip bg-brand-500 text-lg font-bold text-white"
              >
                {role.initial}
              </span>
              <div>
                <h3 className="text-base font-bold tracking-tight text-navy-950">{role.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-navy-600">{role.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* --------------------------------------------------------- process */}
      <Section tone="white">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-500">
            {careersProcess.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
            {careersProcess.title}
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {careersProcess.steps.map((step, index) => (
            <Reveal
              key={step.title}
              as="li"
              delay={stagger(index, 0.08)}
              className="text-center"
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-500 text-lg font-bold text-white">
                {index + 1}
              </span>
              <h3 className="mt-4 text-base font-bold tracking-tight text-navy-950">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* --------------------------------------------------- founders quote */}
      <section className="bg-gradient-to-br from-brand-500 to-brand-600 text-white">
        <Container className="py-16 text-center sm:py-20">
          <Reveal>
            <blockquote className="mx-auto max-w-3xl text-xl leading-relaxed font-medium sm:text-2xl">
              &ldquo;{careersQuote.quote}&rdquo;
            </blockquote>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.1em] text-sun-500">
              {careersQuote.attribution}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ----------------------------------------------------------- apply */}
      <Section tone="white" size="narrow" id="apply">
        <Reveal className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-500">
            {careersApply.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
            {careersApply.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-navy-600">
            {careersApply.intro}
          </p>
        </Reveal>

        <div className="mt-12 rounded-card border border-navy-900/10 bg-mist p-6 sm:p-9">
          <CareersForm />
        </div>
      </Section>

      {/* -------------------------------------------------- contact strip */}
      <section className="border-t border-navy-900/10 bg-white">
        <Container className="flex flex-wrap justify-center gap-x-16 gap-y-8 py-12 text-center">
          {[
            { label: "Email", value: site.email, href: site.emailHref },
            { label: "Phone", value: site.phone, href: site.phoneHref },
            { label: "Address", value: addressLine, href: null },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand-500">
                {item.label}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  className="mt-1.5 block font-semibold text-navy-950 hover:underline"
                >
                  {item.value}
                </a>
              ) : (
                <p className="mt-1.5 font-semibold text-navy-950">{item.value}</p>
              )}
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
