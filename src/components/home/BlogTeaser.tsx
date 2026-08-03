import { PostCard } from "@/components/blog/PostCard";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/icons";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { posts } from "@/content/blog";
import { homeSections } from "@/content/sections";
import { stagger } from "@/lib/stagger";

/**
 * Three most recent posts on the home page.
 *
 * Beyond the obvious, this keeps the blog one click from the root so new posts
 * get crawled quickly instead of waiting to be found through the archive.
 */
export function BlogTeaser() {
  const recent = posts.slice(0, 3);
  if (!recent.length) return null;

  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <Container size="wide">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading {...homeSections.blogTeaser} />
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-navy-950 hover:text-brand-500"
          >
            All posts
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>

        <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-3">
          {recent.map((post, index) => (
            <Reveal key={post.slug} as="li" delay={stagger(index, 0.08)}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
