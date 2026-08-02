import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogArchive } from "@/components/blog/BlogArchive";
import { BlogSearch } from "@/components/blog/BlogSearch";
import { FinalCta } from "@/components/home/FinalCta";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/ui/Section";
import { posts } from "@/content/blog";
import { pageHeroes } from "@/content/sections";
import { site } from "@/content/site";
import { buildSearchIndex, paginate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guidance from the educators at Resource Room on tutoring, SAT and ACT prep, college admissions, neurodiverse learning, homeschooling and STEAM — written for Holly Springs and Triangle families.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const page = paginate(posts, 1);
  const index = buildSearchIndex(posts);
  const archiveHref = (n: number) => (n === 1 ? "/blog" : `/blog/page/${n}`);

  return (
    <>
      <PageHero {...pageHeroes.blog} />

      <Section tone="white" size="wide">
        {/* Search wraps the archive: with no query the server-rendered,
            paginated grid below is what renders — so it stays crawlable and
            works without JS. The boundary is required because BlogSearch reads
            ?q= via useSearchParams, which is unavailable at prerender; the
            fallback is the same archive the search wraps. */}
        <Suspense fallback={<BlogArchive page={page} href={archiveHref} lead />}>
          <BlogSearch index={index}>
            <BlogArchive page={page} href={archiveHref} lead />
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
