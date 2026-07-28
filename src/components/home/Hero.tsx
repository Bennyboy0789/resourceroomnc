import { HeroSlideshow } from "@/components/home/HeroSlideshow";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { RevealOnLoad } from "@/components/ui/Reveal";
import { stagger } from "@/lib/stagger";
import { Stars } from "@/components/ui/Stars";
import { hero } from "@/content/home";
import { awards, site } from "@/content/site";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[86vh] flex-col overflow-hidden bg-navy-950 text-white">
      <HeroSlideshow />

      {/* Scrim over the photography, in two parts: a flat floor that guarantees
          contrast at every breakpoint, plus a gradient weighted to the bottom
          left where the headline sits. Together they stay light enough that the
          slideshow still reads as photography. */}
      <div aria-hidden="true" className="absolute inset-0 bg-navy-950/50" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-tr from-navy-950/90 via-navy-950/45 to-navy-950/15"
      />

      <Container size="wide" className="relative flex flex-1 items-end pb-14 pt-32 sm:pb-16">
        <div className="max-w-4xl">
          <RevealOnLoad>
            <p className="eyebrow flex items-center gap-2.5 text-sun-400">
              <Stars className="text-sun-500" />
              100+ Five-Star Reviews
            </p>
          </RevealOnLoad>

          {/* `noFade` on the headline only. It is the largest text on the page
              and a candidate for the LCP element — starting it at opacity 0
              would withhold first paint and push the metric out by the length
              of the animation. Sliding it into place costs nothing, because a
              translated element still counts as painted. */}
          <RevealOnLoad noFade delay={0.05}>
            <h1 className="display mt-6 text-balance text-5xl sm:text-6xl lg:text-7xl">
              {hero.headline.before}
              <span className="text-sun-500">{hero.headline.accent}</span>
              {hero.headline.after}
            </h1>
          </RevealOnLoad>

          <RevealOnLoad delay={0.14}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/80">{hero.subtext}</p>
          </RevealOnLoad>

          <RevealOnLoad delay={0.22}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button href={hero.primaryCta.href} size="lg">
                {hero.primaryCta.label}
              </Button>
              <Button href={site.phoneHref} variant="outline" size="lg">
                <Icon name="phone" className="h-4 w-4" />
                {site.phone}
              </Button>
            </div>
          </RevealOnLoad>
        </div>
      </Container>

      {/* Awards run as a strip along the base of the hero rather than a side
          column, so the headline gets the full width of the frame. */}
      <div className="relative border-t border-white/15 bg-navy-950/35 backdrop-blur-sm">
        <Container size="wide">
          <ul className="grid sm:grid-cols-3">
            {awards.map((award, index) => (
              <RevealOnLoad
                key={award.label}
                as="li"
                className="flex items-center gap-3 py-5 sm:border-l sm:border-white/12 sm:px-6 sm:first:border-l-0 sm:first:pl-0"
                delay={0.3 + stagger(index, 0.08)}
                y={12}
              >
                {award.stars ? (
                  <Stars className="shrink-0 text-sun-500" />
                ) : (
                  <Icon name="badge" className="h-5 w-5 shrink-0 text-sun-400" />
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase leading-tight tracking-[0.06em] text-white">
                    {award.label}
                  </p>
                  <p className="mt-1 text-xs text-white/60">{award.detail}</p>
                </div>
              </RevealOnLoad>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  );
}
