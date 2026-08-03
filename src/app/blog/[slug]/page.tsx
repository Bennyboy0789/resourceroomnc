import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/blog/PostCard";
import { FinalCta } from "@/components/home/FinalCta";
import { Icon } from "@/components/icons";
import { Container } from "@/components/ui/Container";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getPost, posts } from "@/content/blog";
import { site } from "@/content/site";
import { categorySlug, formatDate, tagSlug } from "@/lib/blog";
import { seoDescription, seoTitle } from "@/lib/seo";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: seoTitle(post.title),
    description: seoDescription(post.excerpt),
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      /* Falls back to the generated brand card explicitly. Declaring
         `openGraph` at all suppresses the `opengraph-image.tsx` default, and
         `images: undefined` does not bring it back — the one post without a
         featured image was sharing as a bare link. */
      images: [{ url: post.image ?? "/opengraph-image" }],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  /*
   * Relatedness by shared tags first, then shared category, then recency.
   * Tags are the more granular signal — two posts can both sit under
   * "Tutoring Resources" and have nothing to do with each other, whereas
   * sharing "SAT test prep" is a real connection.
   */
  const related = posts
    .filter((other) => other.slug !== post.slug)
    .map((other) => ({
      post: other,
      score:
        other.tags.filter((tag) => post.tags.includes(tag)).length * 2 +
        other.categories.filter((category) => post.categories.includes(category)).length,
    }))
    .sort((a, b) => b.score - a.score || (a.post.date < b.post.date ? 1 : -1))
    .slice(0, 3)
    .map((hit) => hit.post);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: seoDescription(post.excerpt),
    datePublished: post.date,
    /* Freshness. Several posts predate the rebuild by years, and without this
       there is nothing telling a crawler — or an answer engine weighing
       whether to quote a 2021 post about testing policy — how current it is. */
    dateModified: post.modified,
    image: post.image ? `${site.url}${post.image}` : undefined,
    /*
     * A named author outranks a logo for both E-E-A-T and AI citation, and
     * `description` is the part that does the work — it puts the licensure and
     * classroom record inside the Person node rather than leaving a bare name.
     * Set in scripts/import-wordpress.mjs.
     */
    author: {
      "@type": "Person",
      name: post.author.name,
      ...(post.author.jobTitle ? { jobTitle: post.author.jobTitle } : {}),
      ...(post.author.url ? { url: `${site.url}${post.author.url}` } : {}),
      ...(post.author.image ? { image: `${site.url}${post.author.image}` } : {}),
      ...(post.author.description ? { description: post.author.description } : {}),
      worksFor: { "@type": "Organization", name: site.legalName, url: site.url },
    },
    publisher: {
      "@type": "Organization",
      name: site.legalName,
      url: site.url,
      logo: { "@type": "ImageObject", url: `${site.url}/icon` },
    },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
    articleSection: post.categories[0],
    keywords: post.tags.join(", "),
    wordCount: post.plain.split(/\s+/).filter(Boolean).length,
    inLanguage: "en-US",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article>
        <header className="border-b border-navy-900/10 bg-mist">
          <Container size="default" className="py-14 sm:py-20">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-navy-600 transition-colors hover:text-navy-950"
            >
              <Icon name="arrowRight" className="h-4 w-4 rotate-180" />
              All posts
            </Link>

            <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-[0.08em] text-brand-600">
              {post.categories.map((category) => (
                <Link
                  key={category}
                  href={`/blog/category/${categorySlug(category)}`}
                  className="hover:text-navy-950"
                >
                  {category}
                </Link>
              ))}
              <span className="text-navy-500">{formatDate(post.date)}</span>
              {/* Shown only when it differs, so the schema's dateModified is
                  something a reader can see rather than a bare markup claim. */}
              {post.modified !== post.date ? (
                <span className="text-navy-500">Updated {formatDate(post.modified)}</span>
              ) : null}
              <span className="text-navy-500">{post.readingMinutes} min read</span>
            </p>

            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-extrabold tracking-tight text-navy-950 sm:text-5xl">
              {post.title}
            </h1>

            {/* A visible byline, because schema should describe what is on the
                page rather than assert something a reader cannot see. */}
            <p className="mt-6 text-sm text-navy-600">
              By{" "}
              <Link
                href={post.author.url ?? "/about"}
                className="font-bold text-navy-950 underline-offset-4 hover:underline"
              >
                {post.author.name}
              </Link>
              {post.author.jobTitle ? ` · ${post.author.jobTitle}` : null}
            </p>
          </Container>
        </header>

        {post.image ? (
          <Container size="default" className="-mt-0 pt-10">
            <PhotoSlot
              src={post.image}
              alt={post.imageAlt}
              icon="book"
              ratio="16/9"
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="rounded-none"
              priority
            />
          </Container>
        ) : null}

        <Container size="default" className="py-14 sm:py-16">
          {/* Imported from WordPress and stripped to semantic tags by
              scripts/import-wordpress.mjs — no classes or inline styles
              survive, so `article` styles every element itself. */}
          <div className="article max-w-2xl" dangerouslySetInnerHTML={{ __html: post.html }} />
        </Container>
      </article>

      {/* Author box. The credentials in the Person schema should be readable
          on the page too — this is the E-E-A-T signal a parent actually reads
          before deciding whether to trust a post about their child's IEP. */}
      <Container size="default" className="pb-14">
        <div className="max-w-2xl border-t border-navy-900/10 pt-8">
          <p className="eyebrow text-brand-600">Written by</p>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:gap-6">
            {post.author.image ? (
              <Image
                src={post.author.image}
                alt={`${post.author.name}, ${post.author.jobTitle ?? "Resource Room"}`}
                width={112}
                height={112}
                sizes="112px"
                className="h-28 w-28 shrink-0 rounded-full object-cover object-top"
              />
            ) : null}
            <div className="min-w-0">
              <p className="text-lg font-bold tracking-tight text-navy-950">{post.author.name}</p>
              {post.author.jobTitle ? (
                <p className="mt-1 text-sm font-semibold text-brand-600">{post.author.jobTitle}</p>
              ) : null}
              {post.author.description ? (
                <p className="mt-3 leading-relaxed text-navy-600">{post.author.description}</p>
              ) : null}
              <Link
                href={post.author.url ?? "/about"}
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-navy-950 hover:text-brand-700"
              >
                More about Resource Room
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>

      {post.tags.length ? (
        <Container size="default" className="pb-14">
          <div className="max-w-2xl border-t border-navy-900/10 pt-8">
            <h2 className="eyebrow text-brand-600">Tagged</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`/blog/tag/${tagSlug(tag)}`}
                    className="inline-flex min-h-11 items-center border border-navy-900/20 px-3 text-xs font-bold uppercase tracking-[0.06em] text-navy-700 transition-colors hover:border-navy-900/50 hover:text-navy-950"
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      ) : null}

      {related.length ? (
        <Section tone="mist" size="wide">
          <SectionHeading eyebrow="Keep reading" title="More from the" accent="blog." />
          <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-3">
            {related.map((other) => (
              <li key={other.slug}>
                <PostCard post={other} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <FinalCta />
    </>
  );
}
