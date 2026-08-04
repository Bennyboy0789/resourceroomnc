import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FinalCta } from "@/components/home/FinalCta";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/Button";
import { ProgramCard } from "@/components/ui/ProgramCard";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { categories, getCategory, resolveItems } from "@/content/categories";
import { site } from "@/content/site";
import { breadcrumbSchema, jsonLd } from "@/lib/schema";
import { seoDescription, seoTitle } from "@/lib/seo";
import { stagger } from "@/lib/stagger";

/**
 * A program category — /tutoring, /college-prep, /camps, /specialized-support.
 *
 * This route is a catch-all at the ROOT of the site, so it has to be the last
 * thing that matches: `generateStaticParams` enumerates exactly the four
 * category slugs and anything else falls through to `notFound`. Next resolves
 * static segments (/about, /contact, /programs, …) ahead of a dynamic one, so
 * those pages are never shadowed by this file.
 */
export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};

  return {
    title: seoTitle(`${category.label} in Holly Springs, NC`),
    description: seoDescription(category.description),
    alternates: { canonical: `/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps<"/[category]">) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const items = resolveItems(category);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: category.label, path: `/${category.slug}` },
            ]),
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: `${category.label} — ${site.legalName}`,
              description: category.description,
              url: `${site.url}/${category.slug}`,
              hasPart: items.map((item) => ({
                "@type": "Course",
                name: item.title,
                description: item.summary,
                url: `${site.url}${item.href}`,
                provider: {
                  "@type": "EducationalOrganization",
                  name: site.legalName,
                  url: site.url,
                },
              })),
            },
          ),
        }}
      />

      <PageHero
        eyebrow={category.eyebrow}
        title={category.title}
        accent={category.accent}
        description={category.description}
        image={category.image}
        icon={category.icon}
        breadcrumb={{ label: "All programs", href: "/programs" }}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={site.consultationUrl} size="lg">
            Schedule a Free Consultation
          </Button>
          <Button href={site.phoneHref} variant="outline" size="lg">
            <Icon name="phone" className="h-4 w-4" />
            {site.phone}
          </Button>
        </div>
      </PageHero>

      <Section tone="white" size="wide">
        {/* Every card links straight to the product page — the whole point of
            this layer is that nothing is more than three clicks from home. */}
        <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.href} as="li" delay={stagger(index)}>
              <ProgramCard
                href={item.href}
                image={item.image}
                icon={item.icon}
                category={item.category}
                title={item.title}
                body={item.summary}
                ratio="4/3"
                /* The grid follows the h1 with no section heading between. */
                headingLevel={2}
              />
            </Reveal>
          ))}
        </ul>
      </Section>

      <FinalCta
        heading="Not sure which one fits? That's what the consultation is for."
        body="We talk through your child's previous school year, current skills, strengths, frustrations and goals, then recommend a plan that fits. Consultations are always free, and we will never recommend a program that isn't the right fit."
      />
    </>
  );
}
