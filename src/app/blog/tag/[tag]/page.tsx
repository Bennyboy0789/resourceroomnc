import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArchive, BlogArchiveLayout } from "@/components/blog/BlogArchive";
import { FinalCta } from "@/components/home/FinalCta";
import { PageHero } from "@/components/PageHero";
import { blogTags, posts } from "@/content/blog";
import { paginate, tagSlug } from "@/lib/blog";
import { seoDescription, seoTitle } from "@/lib/seo";

export function generateStaticParams() {
  return blogTags.map((tag) => ({ tag: tagSlug(tag.name) }));
}

function resolve(slug: string) {
  return blogTags.find((tag) => tagSlug(tag.name) === slug)?.name;
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/tag/[tag]">): Promise<Metadata> {
  const { tag } = await params;
  const name = resolve(tag);
  if (!name) return {};

  const count = posts.filter((post) => post.tags.includes(name)).length;

  return {
    /* "Posts tagged X", not "X — Blog": the category archive of the same name
       already uses the latter, and two pages sharing a title is a duplicate
       signal even when one of them is noindex. */
    title: seoTitle(`Posts tagged ${name}`),
    description: seoDescription(
      `${count} ${count === 1 ? "post" : "posts"} tagged “${name}” from the educators at Resource Room Learning Center in Holly Springs, NC.`,
    ),
    alternates: { canonical: `/blog/tag/${tag}` },
    /*
     * Tag archives are a browse aid, not a destination. Several overlap almost
     * completely ("tutor" / "tutoring" / "private tutoring" are near-identical
     * sets inherited from WordPress), so indexing them all would put a pile of
     * near-duplicate pages in front of the posts themselves.
     */
    robots: { index: false, follow: true },
  };
}

export default async function BlogTagPage({ params }: PageProps<"/blog/tag/[tag]">) {
  const { tag } = await params;
  const name = resolve(tag);
  if (!name) notFound();

  const matching = posts.filter((post) => post.tags.includes(name));
  const page = paginate(matching, 1, 24);

  return (
    <>
      <PageHero
        eyebrow="Tagged"
        title={name}
        description={`${matching.length} ${matching.length === 1 ? "post" : "posts"} tagged “${name}”.`}
        breadcrumb={{ label: "All posts", href: "/blog" }}
      />

      <BlogArchiveLayout activeTag={name}>
        <BlogArchive
          page={page}
          href={() => `/blog/tag/${tag}`}
          emptyMessage="Nothing is tagged this way yet."
        />
      </BlogArchiveLayout>

      <FinalCta />
    </>
  );
}
