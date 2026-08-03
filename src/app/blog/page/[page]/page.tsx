import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArchive, BlogArchiveLayout } from "@/components/blog/BlogArchive";
import { FinalCta } from "@/components/home/FinalCta";
import { PageHero } from "@/components/PageHero";
import { posts } from "@/content/blog";
import { pageHeroes } from "@/content/sections";
import { paginate, POSTS_PER_PAGE } from "@/lib/blog";
import { seoDescription, seoTitle } from "@/lib/seo";

const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));

export function generateStaticParams() {
  // Page one lives at /blog, so numbered pages start at two.
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/page/[page]">): Promise<Metadata> {
  const { page } = await params;
  const n = Number(page);

  return {
    title: seoTitle(`Blog — page ${n}`),
    description: seoDescription(
      `Page ${n} of guidance from the educators at Resource Room, written for Holly Springs and Triangle families.`,
    ),
    alternates: { canonical: `/blog/page/${n}` },
    /* Deeper archive pages are thin and near-duplicate. Let crawlers follow
       through to the posts without indexing the pages themselves. */
    robots: { index: false, follow: true },
  };
}

export default async function BlogPagedPage({ params }: PageProps<"/blog/page/[page]">) {
  const { page } = await params;
  const n = Number(page);
  if (!Number.isInteger(n) || n < 2 || n > totalPages) notFound();

  const paged = paginate(posts, n);

  return (
    <>
      <PageHero
        {...pageHeroes.blog}
        description={`Page ${n} of ${totalPages}. ${pageHeroes.blog.description}`}
        breadcrumb={{ label: "Latest posts", href: "/blog" }}
      />

      <BlogArchiveLayout>
        <BlogArchive page={paged} href={(p) => (p === 1 ? "/blog" : `/blog/page/${p}`)} />
      </BlogArchiveLayout>

      <FinalCta />
    </>
  );
}
