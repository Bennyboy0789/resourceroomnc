import { Accolades } from "@/components/home/Accolades";
import { AboutStrip } from "@/components/home/AboutStrip";
import { BlogTeaser } from "@/components/home/BlogTeaser";
import { Counters } from "@/components/home/Counters";
import { FinalCta } from "@/components/home/FinalCta";
import { Founders } from "@/components/home/Founders";
import { Hero } from "@/components/home/Hero";
import { LearningCenterPitch } from "@/components/home/LearningCenterPitch";
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
      <Accolades />
      <WhyChoose />
      <Founders />
      <LearningCenterPitch />
      <StatsBar />
      <AboutStrip />
      <ProgramGrid />
      <Counters />
      <Testimonials />
      <BlogTeaser />
      <FinalCta />
    </>
  );
}
