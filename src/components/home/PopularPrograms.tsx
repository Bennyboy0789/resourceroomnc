import { ProgramCard } from "@/components/ui/ProgramCard";
import { Rail, RailItem } from "@/components/ui/Rail";
import { popularOfferings } from "@/content/programs";

export function PopularPrograms() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <Rail
        eyebrow="Most requested"
        title="What families ask"
        accent="about most."
        description="From daytime structured learning to test prep, these are the programs Triangle families come to us for."
        viewAll={{ label: "All programs", href: "/programs" }}
      >
        {popularOfferings.map((offering, index) => (
          <RailItem key={offering.title} index={index}>
            <ProgramCard
              href={offering.href}
              image={offering.image}
              icon={offering.icon}
              category={offering.category}
              title={offering.title}
              body={offering.body}
              ratio="1/1"
            />
          </RailItem>
        ))}
      </Rail>
    </section>
  );
}
