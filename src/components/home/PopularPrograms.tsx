import { ProgramCard } from "@/components/ui/ProgramCard";
import { Rail, RailItem } from "@/components/ui/Rail";
import { popularOfferings } from "@/content/programs";
import { backToSchool, inBackToSchoolSeason } from "@/content/home";
import { homeSections } from "@/content/sections";

export function PopularPrograms() {
  /* In term-start season the rail takes the seasonal heading, so the cards
     below read as the answer to the band above rather than a generic list.
     Falls back automatically on the same dates the band retires. */
  const heading = inBackToSchoolSeason() ? backToSchool.rail : homeSections.popularPrograms;

  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <Rail {...heading} viewAll={{ label: "All programs", href: "/programs" }}>
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
