import type { Metadata } from "next";
import { FinalCta } from "@/components/home/FinalCta";
import { PageHero } from "@/components/PageHero";
import { ProgramCard } from "@/components/ui/ProgramCard";
import { Reveal } from "@/components/ui/Reveal";
import { stagger } from "@/lib/stagger";
import { Section } from "@/components/ui/Section";
import { programs } from "@/content/programs";
import { pageHeroes } from "@/content/sections";
import { breadcrumbSchema, jsonLd, programCatalogSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "All Programs",
  description:
    "Tutoring, camps, SAT and ACT prep, college advisement, executive functioning coaching, summer bridge, homeschool co-op, ABA support, IEP and 504 advocacy, and Pathways Academy — every Resource Room program in one place.",
  alternates: { canonical: "/programs" },
};

export default function ProgramsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            programCatalogSchema(programs),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Programs", path: "/programs" },
            ]),
          ),
        }}
      />

      <PageHero {...pageHeroes.programs} />

      <Section tone="white" size="wide">
        <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((program, index) => (
            <Reveal key={program.slug} as="li" delay={stagger(index)}>
              <ProgramCard
                href={program.externalUrl ?? `/programs/${program.slug}`}
                image={program.image}
                icon={program.icon}
                category={program.category}
                title={program.name}
                body={program.summary}
                ratio="3/4"
                external={Boolean(program.externalUrl)}
                /* This grid follows the h1 with no section heading between. */
                headingLevel={2}
              />
            </Reveal>
          ))}
        </ul>
      </Section>

      <FinalCta
        heading="Not sure what your child needs? That's what the consultation is for."
        body="We talk through your child's previous school year, current skills, strengths, frustrations, and goals. Then we recommend a plan that fits. Consultations are always free, and we will never recommend a program that isn't the right fit."
      />
    </>
  );
}
