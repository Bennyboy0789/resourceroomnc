"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ARCHIVE_GRID, SLOT_BROWSE, SLOT_MAIN, SLOT_SEARCH } from "@/components/blog/BlogArchive";
import { Icon } from "@/components/icons";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { formatDate, searchPosts, tagSlug, type SearchEntry } from "@/lib/blog";
import { cn } from "@/lib/cn";

/**
 * Search over the blog, layered on top of the server-rendered archive.
 *
 * With an empty query this renders `children` untouched — so the paginated,
 * crawlable grid the server produced is what search engines and no-JS visitors
 * get. Typing swaps in client-side results over a prebuilt index; the index is
 * ~40KB of trimmed metadata rather than the full post bodies.
 *
 * The query is mirrored into `?q=` with `replaceState` so a result set can be
 * shared or reloaded without pushing an entry onto the back stack per keypress.
 */
export function BlogSearch({
  index,
  sidebar,
  children,
}: {
  index: SearchEntry[];
  /** Browse controls, rendered on the server and placed in the left rail. */
  sidebar: ReactNode;
  children: ReactNode;
}) {
  /*
   * Seeded from ?q= so a shared search URL opens on its results. Read through
   * `useSearchParams` rather than an effect: this page is statically
   * generated, so the params are only known on the client, and setting state
   * from an effect would cascade an extra render on every visit.
   *
   * That makes this component suspend during prerender — the caller wraps it
   * in a Suspense boundary.
   */
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  /*
   * Mirror the query back into the URL. `replaceState` rather than a router
   * push: typing eight characters should not put eight entries on the back
   * stack, and this deliberately does not re-run the router.
   */
  useEffect(() => {
    const url = new URL(window.location.href);
    if (query) url.searchParams.set("q", query);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
  }, [query]);

  const results = useMemo(
    () => (query.trim() ? searchPosts(index, query.trim()) : []),
    [index, query],
  );

  const searching = query.trim().length > 0;

  return (
    <div className={ARCHIVE_GRID}>
      <div className={SLOT_SEARCH}>
        <form role="search" onSubmit={(event) => event.preventDefault()} className="relative">
          <label htmlFor="blog-search" className="sr-only">
            Search the blog
          </label>
          <Icon
            name="target"
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-500"
          />
          <input
            id="blog-search"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            /* Short: the rail is 19rem, and a longer hint truncates mid-word. */
            placeholder="Search posts…"
            /* text-base on mobile: iOS zooms the viewport on any focused control
             under 16px and never zooms back out. */
            className="w-full min-w-0 rounded-chip border border-navy-900/40 bg-white py-3 pl-11 pr-11 text-base text-navy-950 placeholder:text-navy-500 focus:border-brand-500 sm:text-sm"
          />
          {searching ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center text-navy-500 hover:text-navy-950"
            >
              <Icon name="close" className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </button>
          ) : null}
        </form>
      </div>

      <div className={SLOT_MAIN}>
        <p aria-live="polite" className="sr-only">
          {searching
            ? `${results.length} ${results.length === 1 ? "post" : "posts"} matching ${query}.`
            : ""}
        </p>

        {searching ? (
          <section aria-label="Search results">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand-500">
              {results.length} {results.length === 1 ? "result" : "results"} for “{query}”
            </p>

            {results.length ? (
              <ul className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2">
                {results.map((post) => (
                  <li key={post.slug}>
                    <ResultCard post={post} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-8 rounded-card border border-navy-900/10 bg-mist p-8">
                <p className="text-lg font-bold text-navy-950">Nothing matched “{query}”.</p>
                <p className="mt-2 leading-relaxed text-navy-600">
                  Try a broader word, or browse by topic in the sidebar. If you are looking for
                  something specific about your student, calling us is faster than searching —
                  consultations are always free.
                </p>
              </div>
            )}
          </section>
        ) : (
          children
        )}
      </div>

      <aside className={cn(SLOT_BROWSE, "border-t border-navy-900/10 pt-10 lg:border-t-0 lg:pt-0")}>
        {sidebar}
      </aside>
    </div>
  );
}

/** Mirrors PostCard, but built from the trimmed search entry. */
function ResultCard({ post }: { post: SearchEntry }) {
  return (
    <article className="group">
      <Link
        href={`/blog/${post.slug}`}
        aria-hidden="true"
        tabIndex={-1}
        className="block overflow-hidden rounded-card"
      >
        <PhotoSlot
          src={post.image ?? undefined}
          alt={post.imageAlt}
          icon="book"
          ratio="4/3"
          sizes="(min-width: 640px) 33vw, 100vw"
          className="rounded-none transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>

      <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-[0.08em] text-brand-500">
        {post.categories[0] ? <span>{post.categories[0]}</span> : null}
        <span className="text-navy-500">{formatDate(post.date)}</span>
        <span className="text-navy-500">{post.readingMinutes} min read</span>
      </p>

      <h3 className="mt-3 text-xl font-bold tracking-tight text-balance text-navy-950">
        <Link href={`/blog/${post.slug}`} className="hover:text-brand-500">
          {post.title}
        </Link>
      </h3>

      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-navy-600">{post.excerpt}</p>

      {post.tags.length ? (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <li key={tag}>
              <Link
                href={`/blog/tag/${tagSlug(tag)}`}
                className="inline-flex rounded-full border border-navy-900/15 px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.06em] text-navy-600 hover:border-navy-900/40 hover:text-navy-950"
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
