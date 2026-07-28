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
import { Marquee } from "@/components/ui/Marquee";
import { credentials } from "@/content/home";

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickLinks />
      <Marquee items={credentials} />
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
