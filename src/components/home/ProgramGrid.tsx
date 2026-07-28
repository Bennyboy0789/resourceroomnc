import { ProgramCard } from "@/components/ui/ProgramCard";
import { Rail, RailItem } from "@/components/ui/Rail";
import { programs } from "@/content/programs";

export function ProgramGrid() {
  return (
    <section className="bg-navy-950 py-20 text-white sm:py-24 lg:py-28">
      <Rail
        eyebrow="Every program"
        title="One learning center,"
        accent="eight ways in."
        description="Students often start in one program and move into another as their needs change."
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
