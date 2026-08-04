import Link from "next/link";
import type { ReactNode } from "react";
import { Pagination } from "@/components/blog/Pagination";
import { PostCard } from "@/components/blog/PostCard";
import { TagCloud } from "@/components/blog/TagCloud";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { blogCategories, type BlogPost } from "@/content/blog";
import { categorySlug, type Page } from "@/lib/blog";
import { stagger } from "@/lib/stagger";
import { cn } from "@/lib/cn";

/*
 * Shared layout classes. The blog index lays itself out inside a client
 * component (search has to drive the right-hand column), so the rail geometry
 * lives here rather than being duplicated in two places.
 *
 * Explicit row/column placement rather than a plain two-column grid, because
 * the two axes want different orders. On desktop the rail sits left with
 * search above the browse controls. Stacked on a phone the same DOM order
 * would put a search box, nine category chips and twenty-seven tags ahead of
 * the first post — so the source order is search, posts, browse, and `lg:`
 * placement pulls the browse block back up beside the posts.
 */
/*
 * `grid-rows-[auto_1fr]` is load-bearing. The posts column spans both rows, and
 * with implicitly sized rows the browser hands the leftover height to row one —
 * which pushed the browse block roughly 950px down the empty rail. Pinning row
 * one to its content and letting row two absorb the slack keeps the browse
 * block directly under the search field.
 */
export const ARCHIVE_GRID =
  "grid gap-x-16 gap-y-12 lg:grid-cols-[19rem_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:items-start";
export const SLOT_SEARCH = "lg:col-start-1 lg:row-start-1";
export const SLOT_MAIN = "min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-2";
export const SLOT_BROWSE = "lg:col-start-1 lg:row-start-2";

const chipBase =
  "inline-flex min-h-11 items-center border px-4 text-xs font-bold uppercase tracking-[0.08em] transition-colors";
const chipOn = "border-navy-900 bg-navy-900 text-white";
const chipOff = "border-navy-900/20 text-navy-700 hover:border-navy-900/50 hover:text-navy-950";

/**
 * Browse controls for the left rail: categories, then the tag cloud.
 *
 * Rendered on the server and handed to the client search shell as a prop —
 * importing the tag data into a client component would pull the whole blog,
 * article bodies and all, into the browser bundle.
 */
export function BlogSidebar({
  activeCategory,
  activeTag,
}: {
  activeCategory?: string;
  activeTag?: string;
}) {
  const allActive = !activeCategory && !activeTag;

  return (
    <>
      <nav aria-label="Blog categories">
        <p className="eyebrow text-brand-500">Topics</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          <li>
            <Link
              href="/blog"
              aria-current={allActive ? "page" : undefined}
              className={cn(chipBase, allActive ? chipOn : chipOff)}
            >
              All posts
            </Link>
          </li>
          {blogCategories.map((category) => {
            const active = category === activeCategory;
            return (
              <li key={category}>
                <Link
                  href={`/blog/category/${categorySlug(category)}`}
                  aria-current={active ? "page" : undefined}
                  className={cn(chipBase, active ? chipOn : chipOff)}
                >
                  {category}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-10 border-t border-navy-900/10 pt-8">
        <p className="eyebrow text-brand-500">Tags</p>
        <div className="mt-4">
          <TagCloud activeTag={activeTag} />
        </div>
      </div>
    </>
  );
}

/**
 * The post grid and its pagination.
 *
 * `lead` promotes the newest post to a full-width card. Only page one of the
 * main index passes it; a category showing three posts looks lopsided with one
 * of them blown up.
 */
export function BlogArchive({
  page,
  href,
  lead = false,
  emptyMessage,
}: {
  page: Page<BlogPost>;
  href: (page: number) => string;
  lead?: boolean;
  emptyMessage?: string;
}) {
  const showLead = lead && page.page === 1 && page.items.length > 1;
  const [first, ...rest] = page.items;
  const grid = showLead ? rest : page.items;

  if (page.items.length === 0) {
    return (
      <p className="rounded-card border border-navy-900/10 bg-mist p-8 leading-relaxed text-navy-600">
        {emptyMessage ?? "No posts here yet."}
      </p>
    );
  }

  return (
    <>
      {showLead ? <PostCard post={first} featured /> : null}

      {/* Two columns, not three: the rail takes 19rem off the width, and a
          third column would squeeze each card below a readable measure. */}
      <ul className={cn("grid gap-x-6 gap-y-14 sm:grid-cols-2", showLead && "mt-14")}>
        {grid.map((post, index) => {
          /*
           * Category and tag archives, and pages 2+ of /blog, show no lead
           * card — so the grid itself holds the LCP element. Both cards in the
           * first row qualify: same size, either can win depending on the
           * image. They need two things the rest of the grid does not.
           *
           * `priority` preloads the thumbnail instead of lazy-loading it.
           * `noFade` is the larger win: Reveal's default `opacity: 0` withheld
           * these cards until hydration ran, so LCP landed at ~850ms on an
           * image that had been decoded since ~120ms.
           */
          const aboveFold = !showLead && index < 2;
          return (
            <Reveal key={post.slug} as="li" delay={stagger(index % 2, 0.08)} noFade={aboveFold}>
              <PostCard post={post} priority={aboveFold} />
            </Reveal>
          );
        })}
      </ul>

      <Pagination page={page.page} totalPages={page.totalPages} href={href} />
    </>
  );
}

/**
 * Archive layout for the pages without search — categories, tags and numbered
 * pages. The rail sticks on desktop so browse controls stay reachable down a
 * long list; below `lg` it collapses above the posts, because a sidebar pinned
 * beside a single-column list on a phone pushes the posts off the first screen.
 */
export function BlogArchiveLayout({
  activeCategory,
  activeTag,
  children,
}: {
  activeCategory?: string;
  activeTag?: string;
  children: ReactNode;
}) {
  return (
    <Section tone="white" size="wide">
      <div className={ARCHIVE_GRID}>
        {/* Posts first in source order so they lead on a phone; `lg:` places
            the browse block back into the left rail on desktop. */}
        <div className={SLOT_MAIN}>{children}</div>
        <aside
          className={cn(SLOT_BROWSE, "border-t border-navy-900/10 pt-10 lg:border-t-0 lg:pt-0")}
        >
          <BlogSidebar activeCategory={activeCategory} activeTag={activeTag} />
        </aside>
      </div>
    </Section>
  );
}
