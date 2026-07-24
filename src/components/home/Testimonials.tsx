import { SectionHeading } from "@/components/ui/Section";
import { Stars } from "@/components/ui/Stars";
import { Container } from "@/components/ui/Container";
import { testimonials } from "@/content/testimonials";

export function Testimonials() {
  return (
    <section className="bg-mist py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="From our families"
          title="100+ five-star reviews, and"
          accent="counting."
          align="center"
        />
      </Container>

      {/* Native snap-scroll rail — no carousel JS, no autoplay. */}
      <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:px-8 lg:justify-center lg:px-8">
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial.name}
            className="flex w-[19rem] shrink-0 snap-start flex-col rounded-2xl border border-navy-900/8 bg-white p-6 sm:w-[21rem]"
          >
            <Stars />
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-navy-700">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-5 border-t border-navy-900/8 pt-4">
              <span className="block text-sm font-bold text-navy-900">{testimonial.name}</span>
              <span className="block text-xs text-navy-600">{testimonial.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
