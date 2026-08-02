import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/ui/Stars";
import { counters } from "@/content/home";
import { stagger } from "@/lib/stagger";

/**
 * The four-up counter band from the live home page. Figures are the animated
 * counter targets read out of the live markup, not estimates.
 */
export function Counters() {
  return (
    <section className="bg-navy-950 text-white">
      <Container size="wide" className="py-16 sm:py-20">
        <dl className="grid gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {counters.map((counter, index) => (
            <Reveal key={counter.label} delay={stagger(index, 0.08)}>
              <dt className="display text-5xl text-sun-400 sm:text-6xl">
                {counter.stars ? <Stars className="mb-3 flex text-sun-400" /> : null}
                <CountUp value={`${counter.value}${counter.suffix ?? ""}`} />
              </dt>
              <dd className="mt-3 text-sm font-medium leading-relaxed text-white/70">
                {counter.label}
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
