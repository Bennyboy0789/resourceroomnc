import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FinalCta } from "@/components/home/FinalCta";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/Button";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getProgram, programs } from "@/content/programs";
import { site } from "@/content/site";

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/programs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgram(slug);

  if (!program) return {};

  return {
    title: program.name,
    description: program.summary,
    alternates: { canonical: `/programs/${program.slug}` },
    openGraph: {
      title: `${program.name} | ${site.name}`,
      description: program.summary,
      url: `/programs/${program.slug}`,
    },
  };
}

export default async function ProgramPage({ params }: PageProps<"/programs/[slug]">) {
  const { slug } = await params;
  const program = getProgram(slug);

  if (!program) notFound();

  const others = programs.filter((item) => item.slug !== program.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={program.category}
        title={program.name}
        description={program.tagline}
        breadcrumb={{ label: "All programs", href: "/programs" }}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/contact" size="lg">
            Schedule a Free Consultation
          </Button>
          {program.externalUrl ? (
            <Button href={program.externalUrl} variant="outline" size="lg" external>
              Visit the {program.shortName} site
              <Icon name="arrowUpRight" className="h-4 w-4" />
            </Button>
          ) : (
            <Button href={site.phoneHref} variant="outline" size="lg">
              <Icon name="phone" className="h-4 w-4" />
              {site.phone}
            </Button>
          )}
        </div>
      </PageHero>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <p className="text-xl leading-relaxed text-navy-800">{program.intro}</p>

            <ul className="mt-10 space-y-6">
              {program.highlights.map((highlight) => (
                <li key={highlight.title} className="flex gap-5">
                  <span
                    className={
                      program.accent === "gold"
                        ? "mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold-50 text-gold-600"
                        : "mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600"
                    }
                  >
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-navy-900">
                      {highlight.title}
                    </h2>
                    <p className="mt-1.5 leading-relaxed text-navy-600">{highlight.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <PhotoSlot
              icon={program.icon}
              tone={program.accent === "gold" ? "gold" : "brand"}
              ratio="4/3"
            />
            <div className="mt-5 rounded-2xl border border-navy-900/10 bg-mist p-6">
              <p className="eyebrow text-brand-600">Who it&rsquo;s for</p>
              <ul className="mt-4 space-y-3">
                {program.audience.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-navy-700">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeading eyebrow="Details" title="What the program" accent="includes." />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {program.includes.map((item) => (
            <li
              key={item}
              className="flex gap-4 rounded-xl border border-navy-900/8 bg-white p-5 text-sm leading-relaxed text-navy-700"
            >
              <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
              {item}
            </li>
          ))}
        </ul>

        {program.externalUrl ? (
          <div className="mt-10 rounded-2xl border border-navy-900/10 bg-navy-900 p-8 text-white sm:flex sm:items-center sm:justify-between sm:gap-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {program.shortName} has its own campus and site.
              </h2>
              <p className="mt-2 text-white/70">
                Admissions, calendar and day-to-day details all live there.
              </p>
            </div>
            <Button
              href={program.externalUrl}
              external
              size="lg"
              className="mt-6 shrink-0 sm:mt-0"
            >
              Visit {program.shortName}
              <Icon name="arrowUpRight" className="h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </Section>

      <Section tone="white">
        <SectionHeading eyebrow="Keep exploring" title="Other Resource Room" accent="programs." />
        <ul className="mt-10 grid gap-5 sm:grid-cols-3">
          {others.map((other) => (
            <li key={other.slug}>
              <Link
                href={`/programs/${other.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-navy-900/10 p-6 transition-colors hover:border-navy-900/25 hover:bg-mist"
              >
                <Icon name={other.icon} className="h-6 w-6 text-brand-600" />
                <h3 className="mt-4 font-bold tracking-tight text-navy-900">{other.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-600">{other.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy-900">
                  Learn more
                  <Icon
                    name="arrowRight"
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <FinalCta />
    </>
  );
}
