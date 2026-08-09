import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FinalCta } from "@/components/home/FinalCta";
import { ReviewCarousel } from "@/components/home/ReviewCarousel";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { ProgramBlocks } from "@/components/program/ProgramBlocks";
import { VariantPicker } from "@/components/shop/VariantPicker";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Stars } from "@/components/ui/Stars";
import { getProgram } from "@/content/programs";
import { getProductBySlug, getProductPage, products } from "@/content/products";
import { site } from "@/content/site";
import { reviewsAbout } from "@/content/testimonials";
import { getProduct } from "@/lib/catalog";
import { breadcrumbSchema, faqSchema, jsonLd } from "@/lib/schema";
import { stagger } from "@/lib/stagger";
import { seoDescription, seoTitle } from "@/lib/seo";

/**
 * A single buyable product inside a program.
 *
 * Joe asked for these to be direct purchases, so the buy box is the first thing
 * under the hero — the same VariantPicker the program pages use, but resolved
 * to this one product via its `catalogSlug`. When Stripe has no matching
 * product the box is replaced by the consultation call to action rather than
 * disappearing silently, so the page is never a dead end.
 */
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.programSlug, product: product.slug }));
}

/** Prices come from Stripe, so rebuild hourly like the program pages. */
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps<"/programs/[slug]/[product]">): Promise<Metadata> {
  const { slug, product: productSlug } = await params;
  const product = getProductPage(slug, productSlug);
  if (!product) return {};

  return {
    title: seoTitle(product.name),
    description: seoDescription(product.summary),
    alternates: { canonical: `/programs/${slug}/${productSlug}` },
    openGraph: {
      title: `${product.name} | ${site.name}`,
      description: seoDescription(product.summary),
      url: `/programs/${slug}/${productSlug}`,
      images: [{ url: product.image.src, alt: product.image.alt }],
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/programs/[slug]/[product]">) {
  const { slug, product: productSlug } = await params;
  const product = getProductPage(slug, productSlug);
  if (!product) notFound();

  const program = getProgram(slug);
  const catalogProduct = product.catalogSlug ? await getProduct(product.catalogSlug) : null;
  /* Products and programs share the see-also grid but resolve differently,
     so both are normalised to the few fields the card actually renders. */
  const seeAlso = [
    ...(product.seeAlso ?? [])
      .map((s) => getProductBySlug(s))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .map((p) => ({
        key: p.slug,
        href: `/programs/${p.programSlug}/${p.slug}`,
        name: p.name,
        summary: p.summary,
        meta: p.priceLabel ?? "See details",
      })),
    ...(product.seeAlsoPrograms ?? [])
      .map((s) => getProgram(s))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .map((p) => ({
        key: p.slug,
        href: `/programs/${p.slug}`,
        name: p.name,
        summary: p.summary,
        meta: p.category,
      })),
  ];

  const reviews = product.reviewTopic ? reviewsAbout(product.reviewTopic) : [];

  const faqBlock = product.blocks?.find((block) => block.kind === "faq");
  const faq = faqBlock?.kind === "faq" ? faqSchema(faqBlock.items) : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Programs", path: "/programs" },
              ...(program ? [{ name: program.name, path: `/programs/${slug}` }] : []),
              { name: product.name, path: `/programs/${slug}/${productSlug}` },
            ]),
            faq,
          ),
        }}
      />

      <PageHero
        eyebrow={program?.category ?? "Programs"}
        title={product.name}
        description={product.tagline}
        breadcrumb={{
          label: program?.shortName ?? "All programs",
          href: program ? `/programs/${slug}` : "/programs",
        }}
        image={product.image}
        icon={program?.icon ?? "sparkle"}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="#buy" size="lg">
            {catalogProduct ? "Book now" : "Schedule a Free Consultation"}
            <Icon name="arrowRight" className="h-4 w-4" />
          </Button>
          <Button href={site.phoneHref} variant="outline" size="lg">
            <Icon name="phone" className="h-4 w-4" />
            {site.phone}
          </Button>
        </div>
      </PageHero>

      {product.stats?.length ? (
        <section className="border-b border-navy-900/10 bg-sun-500 text-navy-950">
          <Container size="wide" className="py-10 sm:py-12">
            <dl className="grid gap-8 sm:grid-cols-3 sm:gap-6">
              {product.stats.map((stat, index) => (
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

      {/* ------------------------------------------------------------- buy */}
      <Section tone="frost" id="buy">
        <SectionHeading
          eyebrow="Book"
          title="Reserve your"
          accent="place."
          description={
            catalogProduct
              ? "Choose your options below. Checkout is handled securely by Stripe — we never see your card details."
              : "This one starts with a conversation. Book a free consultation and we will confirm the right plan and price for your student."
          }
        />

        <div className="mt-12">
          {catalogProduct ? (
            <div className="max-w-2xl">
              <VariantPicker product={catalogProduct} />
            </div>
          ) : (
            <div className="flex flex-col gap-4 rounded-card border border-navy-900/10 bg-white p-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {product.priceNote ? (
                  <p className="leading-relaxed text-navy-800">{product.priceNote}</p>
                ) : (
                  <p className="text-lg font-bold text-navy-950">
                    {product.priceLabel ?? "Quoted at your free consultation"}
                  </p>
                )}
                <p className="mt-2 text-sm leading-relaxed text-navy-600">
                  Consultations are always free, and we never recommend a plan that isn&rsquo;t the
                  right fit.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Button href={site.consultationUrl}>Book a consultation</Button>
                <Button href={site.phoneHref} variant="quiet">
                  <Icon name="phone" className="h-4 w-4" />
                  {site.phone}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* ----------------------------------------------------------- copy */}
      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            {product.intro.map((paragraph) => (
              <p key={paragraph} className="mt-5 text-lg leading-relaxed text-navy-800 first:mt-0">
                {paragraph}
              </p>
            ))}

            {product.highlights?.length ? (
              <ul className="mt-10 space-y-6">
                {product.highlights.map((highlight) => (
                  <li key={highlight.title} className="flex gap-5">
                    <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-chip bg-brand-50 text-brand-500">
                      <Icon name="check" className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold tracking-tight text-navy-950">
                        {highlight.title}
                      </h3>
                      <p className="mt-1.5 leading-relaxed text-navy-600">{highlight.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {product.includes?.length ? (
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-card border border-navy-900/10 bg-mist p-7">
                <h2 className="text-base font-bold tracking-tight text-navy-950">
                  What&rsquo;s included
                </h2>
                <ul className="mt-4 space-y-3">
                  {product.includes.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-navy-700">
                      <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          ) : null}
        </div>
      </Section>

      {/* Reviews sit between the copy and the blocks: the stat row above
          claims 100+ five-star reviews, and this is where a reader who wants
          to test that claim looks. Bleeds so the carousel rail can run to the
          screen edge the way it does on the home page. */}
      {reviews.length ? (
        <Section tone="mist" bleed>
          <Container size="wide">
            <SectionHeading
              eyebrow="What families say"
              title="In their own"
              accent="words."
              description={`Reviews from families who came to us for ${product.shortName.toLowerCase()}.`}
            />
          </Container>
          <div className="mt-12">
            <ReviewCarousel reviews={reviews} />
          </div>
        </Section>
      ) : null}

      {product.blocks?.length ? (
        <ProgramBlocks blocks={product.blocks} accent={program?.accent ?? "blue"} />
      ) : null}

      {product.disclaimer ? (
        <Section tone="white" size="narrow" className="!pt-0">
          <p className="border-t border-navy-900/10 pt-8 text-xs leading-relaxed text-navy-500">
            {product.disclaimer}
          </p>
        </Section>
      ) : null}

      {/* -------------------------------------------------------- see also */}
      {seeAlso.length ? (
        <Section tone="mist" size="wide">
          <SectionHeading eyebrow="Also in this program" title="You might also" accent="need." />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {seeAlso.map((other, index) => (
              <Reveal key={other.key} as="li" delay={stagger(index, 0.08)}>
                <Link
                  href={other.href}
                  className="group flex h-full flex-col rounded-card border border-navy-900/10 bg-white p-6 transition-colors hover:border-navy-900/30"
                >
                  <h3 className="text-base font-bold tracking-tight text-navy-950 group-hover:text-brand-500">
                    {other.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-600">
                    {other.summary}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-navy-950">
                    {other.meta}
                    <Icon
                      name="arrowRight"
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Section>
      ) : null}

      <FinalCta />
    </>
  );
}
