import Link from "next/link";
import { Icon } from "@/components/icons";
import { Section, SectionHeading } from "@/components/ui/Section";
import { popularOfferings } from "@/content/programs";

export function PopularPrograms() {
  return (
    <Section tone="white" className="pt-14 sm:pt-16">
      <SectionHeading
        eyebrow="Most requested"
        title="Popular"
        accent="Programs"
        description="The programs Triangle families ask about most, from daytime structured learning to test prep."
      />

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {popularOfferings.map((offering) => (
          <li key={offering.title}>
            <Link
              href={offering.href}
              className="group flex h-full flex-col rounded-2xl border border-navy-900/10 bg-white p-6 transition-all hover:-translate-y-1 hover:border-navy-900/20 hover:shadow-lg hover:shadow-navy-900/5"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-sun-500 group-hover:text-navy-950">
                <Icon name={offering.icon} className="h-5 w-5" />
              </span>
              <p className="eyebrow mt-5 text-brand-600">{offering.category}</p>
              <h3 className="mt-2 text-lg font-bold leading-snug tracking-tight text-navy-900">
                {offering.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-navy-600">{offering.body}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy-900">
                Learn more
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
  );
}
