import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArchiveSection } from "@/components/blog/BlogArchive";
import { FinalCta } from "@/components/home/FinalCta";
import { PageHero } from "@/components/PageHero";
import { blogCategories, posts } from "@/content/blog";
import { categorySlug, paginate } from "@/lib/blog";

export function generateStaticParams() {
  return blogCategories.map((category) => ({ category: categorySlug(category) }));
}

function resolve(slug: string) {
  return blogCategories.find((category) => categorySlug(category) === slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/category/[category]">): Promise<Metadata> {
  const { category } = await params;
  const name = resolve(category);
  if (!name) return {};

  return {
    title: `${name} — Blog`,
    description: `Posts from the Resource Room educators on ${name.toLowerCase()}, written for Holly Springs and Triangle families.`,
    alternates: { canonical: `/blog/category/${category}` },
  };
}

export default async function BlogCategoryPage({ params }: PageProps<"/blog/category/[category]">) {
  const { category } = await params;
  const name = resolve(category);
  if (!name) notFound();

  const matching = posts.filter((post) => post.categories.includes(name));
  const page = paginate(matching, 1);

  return (
    <>
      <PageHero
        eyebrow="Blog category"
        title={name}
        description={`${matching.length} ${matching.length === 1 ? "post" : "posts"} from the educators who run our programs.`}
        breadcrumb={{ label: "All posts", href: "/blog" }}
      />

      <BlogArchiveSection
        page={page}
        href={() => `/blog/category/${category}`}
        activeCategory={name}
        emptyMessage="No posts in this category yet."
      />

      <FinalCta />
    </>
  );
}
