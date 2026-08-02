import Link from "next/link";
import { Pagination } from "@/components/blog/Pagination";
import { PostCard } from "@/components/blog/PostCard";
import { TagCloud } from "@/components/blog/TagCloud";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { blogCategories, type BlogPost } from "@/content/blog";
import { categorySlug, type Page } from "@/lib/blog";
import { stagger } from "@/lib/stagger";
import { cn } from "@/lib/cn";

/**
 * The grid, pagination and browse controls shared by every blog archive —
 * the index, its numbered pages, category archives and tag archives.
 *
 * `lead` promotes the newest post to a full-width card. Only page one of the
 * main index passes it; a category showing three posts looks lopsided with one
 * of them blown up.
 */
export function BlogArchive({
  page,
  href,
  lead = false,
  activeCategory,
  activeTag,
  emptyMessage,
}: {
  page: Page<BlogPost>;
  href: (page: number) => string;
  lead?: boolean;
  activeCategory?: string;
  activeTag?: string;
  emptyMessage?: string;
}) {
  const showLead = lead && page.page === 1 && page.items.length > 1;
  const [first, ...rest] = page.items;
  const grid = showLead ? rest : page.items;

  return (
    <>
      {page.items.length === 0 ? (
        <p className="mt-12 border border-navy-900/10 bg-mist p-8 leading-relaxed text-navy-600">
          {emptyMessage ?? "No posts here yet."}
        </p>
      ) : (
        <>
          {showLead ? (
            <div className="mt-12">
              <PostCard post={first} featured />
            </div>
          ) : null}

          <ul
            className={cn(
              "grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3",
              showLead ? "mt-14" : "mt-12",
            )}
          >
            {grid.map((post, index) => (
              <Reveal key={post.slug} as="li" delay={stagger(index % 3, 0.08)}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </ul>

          <Pagination page={page.page} totalPages={page.totalPages} href={href} />
        </>
      )}

      <div className="mt-20 border-t border-navy-900/10 pt-14">
        <SectionHeading eyebrow="Browse" title="By" accent="topic." />
        <nav aria-label="Blog categories" className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/blog"
            aria-current={!activeCategory && !activeTag ? "page" : undefined}
            className={
              !activeCategory && !activeTag
                ? "inline-flex min-h-11 items-center border border-navy-900 bg-navy-900 px-4 text-xs font-bold uppercase tracking-[0.08em] text-white"
                : "inline-flex min-h-11 items-center border border-navy-900/20 px-4 text-xs font-bold uppercase tracking-[0.08em] text-navy-700 transition-colors hover:border-navy-900/50 hover:text-navy-950"
            }
          >
            All posts
          </Link>
          {blogCategories.map((category) => {
            const active = category === activeCategory;
            return (
              <Link
                key={category}
                href={`/blog/category/${categorySlug(category)}`}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "inline-flex min-h-11 items-center border border-navy-900 bg-navy-900 px-4 text-xs font-bold uppercase tracking-[0.08em] text-white"
                    : "inline-flex min-h-11 items-center border border-navy-900/20 px-4 text-xs font-bold uppercase tracking-[0.08em] text-navy-700 transition-colors hover:border-navy-900/50 hover:text-navy-950"
                }
              >
                {category}
              </Link>
            );
          })}
        </nav>

        <div className="mt-12">
          <p className="eyebrow text-brand-600">Tags</p>
          <div className="mt-5">
            <TagCloud activeTag={activeTag} />
          </div>
        </div>
      </div>
    </>
  );
}

/** Wraps the archive in the standard page section. */
export function BlogArchiveSection(props: Parameters<typeof BlogArchive>[0]) {
  return (
    <Section tone="white" size="wide">
      <BlogArchive {...props} />
    </Section>
  );
}
