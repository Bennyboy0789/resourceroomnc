import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FinalCta } from "@/components/home/FinalCta";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { ProgramBlocks } from "@/components/program/ProgramBlocks";
import { EnrollmentSection } from "@/components/shop/EnrollmentSection";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { ProgramCard } from "@/components/ui/ProgramCard";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Stars } from "@/components/ui/Stars";
import { getProgram, imagePosition, imageRatio, programs } from "@/content/programs";
import { site } from "@/content/site";
import { productsForProgram } from "@/lib/courses";
import { breadcrumbSchema, jsonLd, programSchema } from "@/lib/schema";
import { stagger } from "@/lib/stagger";
import { seoDescription, seoTitle } from "@/lib/seo";

/**
 * Pathways Academy is excluded on purpose: it has its own route at
 * ./pathways-academy/page.tsx, which reproduces the standalone Pathways site
 * design rather than this shared program template. A static segment already
 * wins over a dynamic one in Next's router, but generating the param here too
 * would prerender two pages for one URL.
 */
export function generateStaticParams() {
  return programs
    .filter((program) => program.slug !== "pathways-academy")
    .map((program) => ({ slug: program.slug }));
}

/**
 * Prices live in Stripe, so these pages are rebuilt hourly rather than pinned
 * at deploy time. A price edited in the Stripe dashboard reaches the site
 * without a deploy, and checkout re-resolves the amount from Stripe anyway, so
 * a stale page can never charge the wrong figure.
 */
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps<"/programs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgram(slug);

  if (!program) return {};

  return {
    title: seoTitle(program.name),
    description: seoDescription(program.summary),
    alternates: { canonical: `/programs/${program.slug}` },
    openGraph: {
      title: `${program.name} | ${site.name}`,
      description: seoDescription(program.summary),
      url: `/programs/${program.slug}`,
      /* Declaring `openGraph` without `images` suppresses the generated
         default from `opengraph-image.tsx` entirely, which left every program
         page sharing as a bare link. Each one uses its own artwork instead. */
      images: [{ url: program.image.src, alt: program.image.alt }],
    },
  };
}

export default async function ProgramPage({ params }: PageProps<"/programs/[slug]">) {
  const { slug } = await params;
  const program = getProgram(slug);

  if (!program) notFound();

  const others = programs.filter((item) => item.slug !== program.slug).slice(0, 3);
  const programProducts = productsForProgram(program.slug);
  const { service, faq } = programSchema(program);
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Programs", path: "/programs" },
    { name: program.name, path: `/programs/${program.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(service, faq, breadcrumbs) }}
      />
      <PageHero
        eyebrow={program.category}
        title={program.name}
        description={program.tagline}
        breadcrumb={{ label: "All programs", href: "/programs" }}
        image={program.image}
        icon={program.icon}
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

      {program.stats?.length ? (
        <section className="border-b border-navy-900/10 bg-sun-500 text-navy-950">
          <Container size="wide" className="py-10 sm:py-12">
            <dl className="grid gap-8 sm:grid-cols-3 sm:gap-6">
              {program.stats.map((stat, index) => (
                <Reveal
                  key={stat.label}
                  className="sm:border-l sm:border-navy-950/15 sm:pl-8 sm:first:border-l-0 sm:first:pl-0"
                  delay={stagger(index, 0.1)}
                >
                  <dt className="display text-3xl sm:text-4xl">
                    {stat.stars ? <Stars className="mb-2 flex text-navy-950" /> : null}
                    {stat.value}
                  </dt>
                  <dd className="mt-2 text-sm font-medium leading-relaxed text-navy-950/70">
                    {stat.label}
                  </dd>
                </Reveal>
              ))}
            </dl>
          </Container>
        </section>
      ) : null}

      {/* Products first, prose second — Joe asked on the Aug 3 2026 call for
          people to land on what they can actually book, with the written
          content kept underneath it for search.

          Also the internal-linking fix: course pages were reachable only from
          the catalog, leaving sixteen of them on a single inbound link. */}
      {/* A grid of one is not a choice — it is a card pointing at a page the
          pricing block above already links to. College Prep and Homeschool
          Co-Op each have a single product, so they skip the grid entirely. */}
      {programProducts.length > 1 ? (
        <Section tone="mist" size="wide">
          <SectionHeading
            eyebrow={`${programProducts.length} options`}
            title={program.productsHeading?.title ?? "What runs inside this"}
            accent={program.productsHeading?.accent ?? "program."}
            description="Individual classes and sessions within this program. Anything without a listed rate is quoted at your free consultation."
          />
          <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {programProducts.map((product, index) => (
              <Reveal key={product.href} as="li" delay={stagger(index % 4, 0.06)}>
                <article className="group h-full">
                  <Link
                    href={product.href}
                    aria-hidden="true"
                    tabIndex={-1}
                    className="block overflow-hidden rounded-card"
                  >
                    <PhotoSlot
                      src={product.image ?? undefined}
                      alt={product.imageAlt}
                      icon={product.icon}
                      ratio="1/1"
                      position="top"
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="rounded-none transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </Link>
                  {product.meta ? (
                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.08em] text-brand-500">
                      {product.meta}
                    </p>
                  ) : null}
                  <h3 className="mt-2 text-base font-bold leading-snug tracking-tight text-navy-950">
                    <Link href={product.href} className="hover:text-brand-500">
                      {product.name}
                    </Link>
                  </h3>
                </article>
              </Reveal>
            ))}
          </ul>
        </Section>
      ) : null}


      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <p className="text-xl leading-relaxed text-navy-800">{program.intro}</p>

            <ul className="mt-10 space-y-6">
              {program.highlights.map((highlight) => (
                <li key={highlight.title} className="flex gap-5">
                  <span
                    className={
                      program.accent === "sun"
                        ? "mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-chip bg-sun-500 text-navy-950"
                        : "mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-chip bg-brand-50 text-brand-500"
                    }
                  >
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-navy-950">
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
              src={program.image.src}
              alt={program.image.alt}
              position={imagePosition(program.image)}
              icon={program.icon}
              tone={program.accent === "sun" ? "sun" : "brand"}
              ratio={imageRatio(program.image)}
              sizes="(min-width: 1024px) 40vw, 100vw"
              priority
            />
            <div className="mt-5 rounded-card border border-navy-900/10 bg-mist p-6">
              <p className="eyebrow text-brand-500">Who it&rsquo;s for</p>
              <ul className="mt-4 space-y-3">
                {program.audience.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-navy-700">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="frost">
        <SectionHeading
          eyebrow="Details"
          title={program.includesHeading?.title ?? "What the program"}
          accent={program.includesHeading?.accent ?? "includes."}
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {program.includes.map((item) => (
            <li
              key={item}
              className="flex gap-4 rounded-card border border-navy-900/8 bg-white p-5 text-sm leading-relaxed text-navy-700"
            >
              <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              {item}
            </li>
          ))}
        </ul>

        {program.externalUrl ? (
          <div className="mt-10 rounded-card border border-navy-900/10 bg-navy-900 p-8 text-white sm:flex sm:items-center sm:justify-between sm:gap-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {program.shortName} has its own campus and site.
              </h2>
              <p className="mt-2 text-white/70">
                Admissions, calendar and day-to-day details all live there.
              </p>
            </div>
            <Button href={program.externalUrl} external size="lg" className="mt-6 shrink-0 sm:mt-0">
              Visit {program.shortName}
              <Icon name="arrowUpRight" className="h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </Section>

      {program.blocks?.length ? (
        <ProgramBlocks blocks={program.blocks} accent={program.accent} />
      ) : null}

      <EnrollmentSection programSlug={program.slug} />

      {program.disclaimer ? (
        <Section tone="white" size="narrow" className="!pt-0">
          <p className="border-t border-navy-900/10 pt-8 text-xs leading-relaxed text-navy-500">
            {program.disclaimer}
          </p>
        </Section>
      ) : null}


      <Section tone="mist" size="wide">
        <SectionHeading eyebrow="Keep exploring" title="Other Resource Room" accent="programs." />
        <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-3">
          {others.map((other) => (
            <li key={other.slug}>
              <ProgramCard
                href={other.externalUrl ?? `/programs/${other.slug}`}
                image={other.image}
                icon={other.icon}
                category={other.category}
                title={other.name}
                body={other.tagline}
                ratio="4/3"
                external={Boolean(other.externalUrl)}
              />
            </li>
          ))}
        </ul>
      </Section>

      <FinalCta />
    </>
  );
}
