import type { Metadata } from "next";
import { FinalCta } from "@/components/home/FinalCta";
import { PageHero } from "@/components/PageHero";
import { ProgramCard } from "@/components/ui/ProgramCard";
import { Reveal } from "@/components/ui/Reveal";
import { stagger } from "@/lib/stagger";
import { Section } from "@/components/ui/Section";
import { programs } from "@/content/programs";

export const metadata: Metadata = {
  title: "All Programs",
  description:
    "Tutoring, camps, SAT and ACT prep, college advisement, homeschool co-op, ABA support, IEP and 504 advocacy, and Pathways Academy — every Resource Room program in one place.",
  alternates: { canonical: "/programs" },
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="All programs"
        title="Every program, one"
        accent="learning center."
        description="Students often start in one program and move into another as their needs change. Here is everything we run."
      />

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
              />
            </Reveal>
          ))}
        </ul>
      </Section>

      <FinalCta
        heading="Not sure which program fits?"
        body="That is exactly what the free consultation is for. Tell us about your student and we will point you to the right program — even if it is not one of ours."
      />
    </>
  );
}
