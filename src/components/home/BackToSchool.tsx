import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { backToSchool, inBackToSchoolSeason, isTermStarted } from "@/content/home";

/**
 * Seasonal band under the hero, for the weeks around the start of term.
 *
 * Renders nothing outside its own date window, so nobody has to remember to
 * take it down — the page simply closes back up around it. Because the home
 * page revalidates hourly, it appears and retires within an hour of its dates
 * without a deploy.
 *
 * The headline swaps on the first day of term: before it, the pitch is to get
 * ahead of the year; after, it is that the first weeks are when problems
 * surface. Same band, two seasons, one build.
 */
export function BackToSchool() {
  if (!inBackToSchoolSeason()) return null;

  const copy = isTermStarted() ? backToSchool.after : backToSchool.before;

  return (
    <section className="bg-navy-950 py-16 sm:py-20">
      <Container>
        <Reveal className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
          <div>
            <p className="eyebrow mb-4 flex items-center gap-2 text-sun-500">
              <Icon name="sparkle" className="h-4 w-4" />
              {backToSchool.eyebrow}
            </p>
            <h2 className="display text-balance text-4xl sm:text-5xl">
              {copy.heading} <span className="text-sun-500">{copy.accent}</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">{copy.body}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Button href={backToSchool.primary.href} size="lg">
              {backToSchool.primary.label}
            </Button>
            <Button href={backToSchool.returning.href} variant="outline" size="lg">
              {backToSchool.returning.label}
            </Button>
            <p className="mt-1 text-sm leading-relaxed text-white/60">
              {backToSchool.returning.note}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
