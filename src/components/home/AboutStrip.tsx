import { Icon } from "@/components/icons";
import { Section, SectionHeading } from "@/components/ui/Section";
import { aboutHighlights, aboutIntro } from "@/content/home";

export function AboutStrip() {
  return (
    <Section tone="frost">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <SectionHeading
          eyebrow="About Resource Room"
          title="Services for learners of"
          accent="all ages."
          description={aboutIntro}
        />

        <ul className="space-y-4">
          {aboutHighlights.map((item) => (
            <li
              key={item.title}
              className="flex gap-5 rounded-2xl border border-navy-900/8 bg-white p-6"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-900 text-sun-400">
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-bold tracking-tight text-navy-900">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-navy-600">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
