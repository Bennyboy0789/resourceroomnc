import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { FinalCta } from "@/components/home/FinalCta";
import { PageHero } from "@/components/PageHero";
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

      <Section tone="white">
        <ul className="grid gap-5 md:grid-cols-2">
          {programs.map((program) => (
            <li key={program.slug}>
              <Link
                href={`/programs/${program.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-navy-900/10 bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-navy-900/5"
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={
                      program.accent === "sun"
                        ? "grid h-12 w-12 place-items-center rounded-xl bg-sun-400 text-navy-900"
                        : "grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600"
                    }
                  >
                    <Icon name={program.icon} className="h-6 w-6" />
                  </span>
                  {program.externalUrl ? (
                    <span className="rounded-full bg-navy-900/5 px-3 py-1 text-xs font-semibold text-navy-700">
                      Separate campus
                    </span>
                  ) : null}
                </div>

                <p className="eyebrow mt-6 text-brand-600">{program.category}</p>
                <h2 className="mt-2 text-xl font-bold tracking-tight text-navy-900">
                  {program.name}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-600">
                  {program.summary}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy-900">
                  Program details
                  <Icon
                    name="arrowRight"
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </li>
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
