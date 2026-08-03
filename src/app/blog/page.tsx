import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogArchive, BlogArchiveLayout, BlogSidebar } from "@/components/blog/BlogArchive";
import { BlogSearch } from "@/components/blog/BlogSearch";
import { FinalCta } from "@/components/home/FinalCta";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/ui/Section";
import { posts } from "@/content/blog";
import { pageHeroes } from "@/content/sections";
import { site } from "@/content/site";
import { buildSearchIndex, paginate } from "@/lib/blog";
import { seoDescription, seoTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: seoTitle("Blog", "Tutoring & College Prep Advice"),
  description: seoDescription(
    "Guidance from the educators at Resource Room on tutoring, SAT and ACT prep, college admissions, neurodiverse learning, homeschooling and STEAM — written for Holly Springs and Triangle families.",
  ),
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const page = paginate(posts, 1);
  const index = buildSearchIndex(posts);
  const archiveHref = (n: number) => (n === 1 ? "/blog" : `/blog/page/${n}`);
  const archive = <BlogArchive page={page} href={archiveHref} lead />;

  return (
    <>
      <PageHero {...pageHeroes.blog} />

      <Section tone="white" size="wide">
        {/* Search owns the two-column layout: the field sits in the left rail
            with the browse controls, and results replace the post grid on the
            right. With no query the server-rendered, paginated grid is what
            renders, so it stays crawlable and works without JS.

            The Suspense boundary is required because BlogSearch reads ?q= via
            useSearchParams, which is unavailable at prerender; the fallback is
            the same layout without the field. */}
        <Suspense fallback={<BlogArchiveLayout>{archive}</BlogArchiveLayout>}>
          <BlogSearch index={index} sidebar={<BlogSidebar />}>
            {archive}
          </BlogSearch>
        </Suspense>
      </Section>

      <FinalCta
        heading="Questions the blog didn't answer?"
        body={`Call ${site.phone} or schedule a consultation. You'll talk to an educator, and consultations are always free.`}
      />
    </>
  );
}
