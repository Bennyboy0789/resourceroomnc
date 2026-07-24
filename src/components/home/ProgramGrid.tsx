import Link from "next/link";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getProgram } from "@/content/programs";

/** The four headline programs, in the order they appear on the home page. */
const gridSlugs = ["tutoring", "camps", "college-prep", "pathways-academy"];

export function ProgramGrid() {
  const items = gridSlugs.map(getProgram).filter((program) => program !== undefined);

  return (
    <Section tone="white">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Our programs"
          title="Four paths through"
          accent="Resource Room."
          description="Each one runs year-round, and students often move between them as their needs change."
        />
        <Button href="/programs" variant="quiet">
          View all programs
        </Button>
      </div>

      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {items.map((program, index) => (
          <li key={program.slug}>
            <Link
              href={`/programs/${program.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-900/10 bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/8"
            >
              <div className="relative">
                <PhotoSlot
                  icon={program.icon}
                  tone={index % 2 === 0 ? "navy" : "brand"}
                  ratio="16/8"
                  className="rounded-none"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-navy-900">
                  {program.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold tracking-tight text-navy-900">{program.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-600">
                  {program.summary}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy-900">
                  Explore {program.shortName}
                  <Icon
                    name="arrowRight"
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
