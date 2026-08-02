import { ProgramCard } from "@/components/ui/ProgramCard";
import { Rail, RailItem } from "@/components/ui/Rail";
import { popularOfferings } from "@/content/programs";
import { homeSections } from "@/content/sections";

export function PopularPrograms() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <Rail
        {...homeSections.popularPrograms}
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
