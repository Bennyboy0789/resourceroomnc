import { AboutStrip } from "@/components/home/AboutStrip";
import { FinalCta } from "@/components/home/FinalCta";
import { Founders } from "@/components/home/Founders";
import { Hero } from "@/components/home/Hero";
import { PopularPrograms } from "@/components/home/PopularPrograms";
import { ProgramGrid } from "@/components/home/ProgramGrid";
import { QuickLinks } from "@/components/home/QuickLinks";
import { StatsBar } from "@/components/home/StatsBar";
import { Testimonials } from "@/components/home/Testimonials";
import { WhyChoose } from "@/components/home/WhyChoose";

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickLinks />
      <PopularPrograms />
      <WhyChoose />
      <Founders />
      <StatsBar />
      <AboutStrip />
      <ProgramGrid />
      <Testimonials />
      <FinalCta />
    </>
  );
}
