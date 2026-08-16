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

  /*
   * `text-white` sits on the section, not on the heading alone.
   *
   * This band is hand-rolled rather than built on `Section`, whose tones pair
   * every background with its ink automatically. Without that pairing the
   * heading inherited navy-900 body copy onto a dark ground and measured
   * 1.18:1 — legible as a faint ghost of itself, which is exactly how it was
   * reported. Setting the ink beside the ground keeps the two together.
   */
  return (
    <section className="bg-gradient-to-br from-ember-700 to-ember-600 py-16 text-white sm:py-20">
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
            {/* Opacities are set by the ground, not by taste: on the ember
                gradient white/75 body measures 4.6:1 and white/60 on the note
                below falls to 3.61:1. Both are raised until they clear AA at
                the light end of the gradient, which is the worse case. */}
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">{copy.body}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Button href={backToSchool.primary.href} size="lg">
              {backToSchool.primary.label}
            </Button>
            {/* The shared outline border is white/35, which clears 1.4.11's 3:1
                on navy at 3.18:1 but only reaches 2.18:1 on this warmer, lighter
                ground. Lifted here rather than in Button, where every other dark
                section still measures fine. */}
            <Button
              href={backToSchool.returning.href}
              variant="outline"
              size="lg"
              className="border-white/60"
            >
              {backToSchool.returning.label}
            </Button>
            <p className="mt-1 text-sm leading-relaxed text-white/80">
              {backToSchool.returning.note}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
