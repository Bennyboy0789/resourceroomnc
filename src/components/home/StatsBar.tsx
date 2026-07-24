import { Container } from "@/components/ui/Container";
import { Stars } from "@/components/ui/Stars";
import { stats } from "@/content/home";

export function StatsBar() {
  return (
    <section className="bg-navy-900 text-white">
      <Container className="py-12 sm:py-14">
        <dl className="grid gap-8 text-center sm:grid-cols-3 sm:gap-6 sm:text-left">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="sm:border-l sm:border-white/15 sm:pl-6 sm:first:border-l-0 sm:first:pl-0"
            >
              {stat.stars ? <Stars className="mb-2 justify-center text-gold-400 sm:justify-start" /> : null}
              <dt className="text-4xl font-bold tracking-tight text-gold-400 sm:text-5xl">
                {stat.value}
              </dt>
              <dd className="mt-2 text-sm text-white/70">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
