import { ReviewCarousel } from "@/components/home/ReviewCarousel";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Section";
import { homeSections } from "@/content/sections";
import { testimonials } from "@/content/testimonials";

export function Testimonials() {
  return (
    <section className="bg-mist py-20 sm:py-24 lg:py-28">
      <Container size="wide">
        <SectionHeading {...homeSections.testimonials} />
      </Container>
      <ReviewCarousel reviews={testimonials} />
    </section>
  );
}
