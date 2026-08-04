import type { Metadata } from "next";
import { FinalCta } from "@/components/home/FinalCta";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { coreValues, partners, partnersIntro } from "@/content/about";
import { pageHeroes } from "@/content/sections";
import { stagger } from "@/lib/stagger";
import { seoDescription, seoTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: seoTitle("Preferred Partners"),
  description: seoDescription(
    "The clinicians and specialists Resource Room works alongside — psychoeducational evaluation, ABA, and speech-language therapy for families across Holly Springs and the Triangle.",
  ),
  alternates: { canonical: "/about/preferred-partners" },
};

export default function PreferredPartnersPage() {
  return (
    <>
      <PageHero
        {...pageHeroes.preferredPartners}
        description={partnersIntro}
        breadcrumb={{ label: "About us", href: "/about" }}
      />

      <Section tone="white">
        <ul className="space-y-6">
          {partners.map((partner, index) => (
            <Reveal key={partner.name} as="li" delay={stagger(index, 0.08)}>
              <article className="rounded-card border border-navy-900/10 bg-white p-8 sm:p-10">
                <h2 className="text-2xl font-bold tracking-tight text-navy-950">{partner.name}</h2>
                <p className="mt-1.5 text-sm font-semibold text-brand-500">{partner.credentials}</p>

                <div className="mt-6 max-w-3xl space-y-4">
                  {partner.body.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed text-navy-700">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {partner.links?.length ? (
                  <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-navy-900/8 pt-6">
                    {partner.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          className="inline-flex items-center gap-2 text-sm font-bold text-navy-950 underline-offset-4 hover:underline"
                          {...(link.href.startsWith("http")
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {link.label}
                          <Icon name="arrowUpRight" className="h-3.5 w-3.5 text-brand-500" />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section tone="mist">
        <SectionHeading eyebrow="What we stand for" title="Resource Room" accent="values." />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          {coreValues.map((value, index) => (
            <Reveal key={value.title} as="li" delay={stagger(index, 0.06)}>
              <div className="h-full rounded-card border border-navy-900/8 bg-white p-7">
                <span className="grid h-12 w-12 place-items-center bg-navy-900 text-sun-500">
                  <Icon name={value.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-navy-950">
                  {value.title}
                </h3>
                <p className="mt-2.5 leading-relaxed text-navy-600">{value.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <FinalCta />
    </>
  );
}
