import { Rail, RailItem } from "@/components/ui/Rail";
import { Stars } from "@/components/ui/Stars";
import { testimonials } from "@/content/testimonials";

export function Testimonials() {
  return (
    <section className="bg-mist py-20 sm:py-24 lg:py-28">
      <Rail
        eyebrow="From our families"
        title="100+ five-star reviews,"
        accent="and counting."
      >
        {testimonials.map((testimonial, index) => (
          <RailItem key={testimonial.name} index={index}>
            <figure className="flex h-full flex-col border-t-2 border-navy-950 bg-white p-7">
              <Stars />
              <blockquote className="mt-5 flex-1 text-base leading-relaxed text-navy-700">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-navy-950/10 pt-5">
                <span className="block text-xs font-bold uppercase tracking-[0.08em] text-navy-950">
                  {testimonial.name}
                </span>
                <span className="mt-1 block text-xs text-navy-600">{testimonial.role}</span>
              </figcaption>
            </figure>
          </RailItem>
        ))}
      </Rail>
    </section>
  );
}
