import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { stagger } from "@/lib/stagger";
import { Stars } from "@/components/ui/Stars";
import { stats } from "@/content/home";

export function StatsBar() {
  return (
    <section className="bg-sun-500 text-navy-950">
      <Container size="wide" className="py-14 sm:py-16">
        <dl className="grid gap-10 sm:grid-cols-3 sm:gap-6">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.label}
              className="sm:border-l sm:border-navy-950/15 sm:pl-8 sm:first:border-l-0 sm:first:pl-0"
              delay={stagger(index, 0.1)}
            >
              {/* Inside the <dt>, not beside it: a <dl> may only hold dt/dd
                  pairs (optionally wrapped in a div), and a loose <span>
                  breaks the list semantics for screen readers. */}
              <dt className="display text-5xl sm:text-6xl">
                {stat.stars ? <Stars className="mb-3 flex text-navy-950" /> : null}
                <CountUp value={stat.value} />
              </dt>
              <dd className="mt-3 text-sm font-medium leading-relaxed text-navy-950/70">
                {stat.label}
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
