import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FinalCta } from "@/components/home/FinalCta";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/Button";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { courses, coursesInGroup, getCourse } from "@/content/courses";
import { getProgram } from "@/content/programs";
import { site } from "@/content/site";
import { formatPrice, groupIcon, programForGroup } from "@/lib/courses";
import { stagger } from "@/lib/stagger";

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/courses/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};

  return {
    title: course.name,
    description: course.summary || course.body[0],
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: {
      title: `${course.name} | ${site.name}`,
      description: course.summary || course.body[0],
      url: `/courses/${course.slug}`,
      images: course.image ? [{ url: course.image }] : undefined,
    },
  };
}

export default async function CoursePage({ params }: PageProps<"/courses/[slug]">) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const program = getProgram(programForGroup(course.group));
  const price = formatPrice(course.price);
  const siblings = coursesInGroup(course.group)
    .filter((other) => other.slug !== course.slug)
    .slice(0, 4);

  /* Course schema helps this land in AI answers about "STEM camps Holly
     Springs" and similar — the catalog is where the long-tail intent lives. */
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.summary || course.body[0],
    url: `${site.url}/courses/${course.slug}`,
    image: course.image ? `${site.url}${course.image}` : undefined,
    provider: {
      "@type": "EducationalOrganization",
      name: site.legalName,
      url: site.url,
    },
    ...(course.grades ? { educationalLevel: course.grades } : {}),
    ...(course.price
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            ...(course.price.low === course.price.high
              ? { price: course.price.low }
              : { lowPrice: course.price.low, highPrice: course.price.high }),
            availability: "https://schema.org/InStock",
            url: `${site.url}/courses/${course.slug}`,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <PageHero
        eyebrow={course.group}
        title={course.name}
        description={course.summary || undefined}
        breadcrumb={{ label: "Course catalog", href: "/courses" }}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/contact" size="lg">
            Schedule a Free Consultation
          </Button>
          <Button href={site.phoneHref} variant="outline" size="lg">
            <Icon name="phone" className="h-4 w-4" />
            {site.phone}
          </Button>
        </div>
      </PageHero>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="article max-w-none">
            {course.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <PhotoSlot
              src={course.image ?? undefined}
              alt={course.imageAlt}
              icon={groupIcon(course.group)}
              ratio="1/1"
              position="top"
              sizes="(min-width: 1024px) 40vw, 100vw"
              priority
            />

            <dl className="mt-5 border border-navy-900/10 bg-mist p-6 text-sm">
              <div className="flex justify-between gap-4 border-b border-navy-900/10 pb-3">
                <dt className="font-bold uppercase tracking-[0.06em] text-navy-500">Group</dt>
                <dd className="text-right text-navy-800">{course.group}</dd>
              </div>
              {course.grades ? (
                <div className="flex justify-between gap-4 border-b border-navy-900/10 py-3">
                  <dt className="font-bold uppercase tracking-[0.06em] text-navy-500">Grades</dt>
                  <dd className="text-right text-navy-800">{course.grades}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4 py-3">
                <dt className="font-bold uppercase tracking-[0.06em] text-navy-500">Rate</dt>
                <dd className="text-right font-bold text-navy-950">
                  {price ?? "Quoted at consultation"}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-navy-900/10 pt-3">
                <dt className="font-bold uppercase tracking-[0.06em] text-navy-500">Location</dt>
                <dd className="text-right text-navy-800">Holly Springs, NC</dd>
              </div>
            </dl>

            {program ? (
              <Link
                href={`/programs/${program.slug}`}
                className="mt-4 flex items-center justify-between gap-4 border border-navy-900/10 bg-white p-5 transition-colors hover:border-navy-900/30"
              >
                <span>
                  <span className="eyebrow block text-brand-600">Part of</span>
                  <span className="mt-1 block font-bold text-navy-950">{program.name}</span>
                </span>
                <Icon name="arrowRight" className="h-5 w-5 shrink-0 text-navy-600" />
              </Link>
            ) : null}
          </aside>
        </div>
      </Section>

      {siblings.length ? (
        <Section tone="mist" size="wide">
          <SectionHeading eyebrow="Same group" title={`More ${course.group}`} />
          <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {siblings.map((other, index) => (
              <Reveal key={other.slug} as="li" delay={stagger(index, 0.07)}>
                <article className="group">
                  <Link
                    href={`/courses/${other.slug}`}
                    aria-hidden="true"
                    tabIndex={-1}
                    className="block overflow-hidden"
                  >
                    <PhotoSlot
                      src={other.image ?? undefined}
                      alt={other.imageAlt}
                      icon={groupIcon(other.group)}
                      ratio="1/1"
                      position="top"
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="rounded-none transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </Link>
                  <h3 className="mt-4 text-base font-bold leading-snug tracking-tight text-navy-950">
                    <Link href={`/courses/${other.slug}`} className="hover:text-brand-700">
                      {other.name}
                    </Link>
                  </h3>
                </article>
              </Reveal>
            ))}
          </ul>
        </Section>
      ) : null}

      <FinalCta />
    </>
  );
}
