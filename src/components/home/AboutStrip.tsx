import { Icon } from "@/components/icons";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { stagger } from "@/lib/stagger";
import { SectionHeading } from "@/components/ui/Section";
import { aboutHighlights, aboutIntro } from "@/content/home";

export function AboutStrip() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <SectionHeading
            eyebrow="About Resource Room"
            title="Services for learners of"
            accent="all ages."
            description={aboutIntro}
          />

          {/* Numbered rules rather than boxes — the list reads as an index. */}
          <ul className="border-t border-navy-950/12">
            {aboutHighlights.map((item, index) => (
              <Reveal
                key={item.title}
                as="li"
                className="flex gap-6 border-b border-navy-950/12 py-7 sm:gap-8"
                delay={stagger(index, 0.09)}
              >
                <span className="shrink-0 text-xs font-bold tabular-nums text-brand-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <h3 className="text-xl font-extrabold uppercase tracking-tight text-navy-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-600">{item.body}</p>
                </div>
                <Icon name={item.icon} className="hidden h-6 w-6 shrink-0 text-navy-950/25 sm:block" />
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
