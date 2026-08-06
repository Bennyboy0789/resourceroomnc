import { ProgramCard } from "@/components/ui/ProgramCard";
import { Rail, RailItem } from "@/components/ui/Rail";
import { programs } from "@/content/programs";
import { homeSections } from "@/content/sections";

export function ProgramGrid() {
  return (
    <section className="bg-brand-500 py-20 text-white sm:py-24 lg:py-28">
      <Rail
        {...homeSections.programGrid}
        viewAll={{ label: "Compare all", href: "/programs" }}
        tone="light"
      >
        {programs.map((program, index) => (
          <RailItem key={program.slug} index={index}>
            <ProgramCard
              href={program.externalUrl ?? `/programs/${program.slug}`}
              image={program.image}
              icon={program.icon}
              category={program.category}
              title={program.name}
              body={program.tagline}
              ratio="3/4"
              tone="light"
              external={Boolean(program.externalUrl)}
            />
          </RailItem>
        ))}
      </Rail>
    </section>
  );
}
