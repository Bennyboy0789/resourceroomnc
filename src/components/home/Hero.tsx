import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Stars } from "@/components/ui/Stars";
import { hero } from "@/content/home";
import { awards, site } from "@/content/site";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 text-white">
      {/* Ambient wash + grid texture behind the hero copy. */}
      <div
        aria-hidden="true"
        className="absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-brand-600/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-56 left-1/4 h-[30rem] w-[30rem] rounded-full bg-gold-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <Container className="relative py-16 sm:py-20 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow flex items-center gap-2 text-gold-400">
              <Stars className="text-gold-400" />
              100+ Five-Star Reviews
            </p>

            <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {hero.headline.before}
              <span className="text-gold-400">{hero.headline.accent}</span>
              {hero.headline.after}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
              {hero.subtext}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href={hero.primaryCta.href} size="lg">
                {hero.primaryCta.label}
              </Button>
              <Button href={site.phoneHref} variant="outline" size="lg">
                <Icon name="phone" className="h-4 w-4" />
                {site.phone}
              </Button>
            </div>
          </div>

          <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {awards.map((award) => (
              <li
                key={award.label}
                className="rounded-2xl border border-white/12 bg-white/[0.06] p-5 backdrop-blur-sm"
              >
                {award.stars ? (
                  <Stars className="mb-2 text-gold-400" />
                ) : (
                  <Icon name="badge" className="mb-2 h-5 w-5 text-gold-400" />
                )}
                <p className="text-sm font-semibold leading-snug text-white">{award.label}</p>
                <p className="mt-1 text-xs text-white/60">{award.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
