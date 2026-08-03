import Link from "next/link";
import { Icon } from "@/components/icons";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import type { BlogPost } from "@/content/blog";
import { formatDate } from "@/lib/blog";
import { cn } from "@/lib/cn";

/**
 * Blog teaser. `featured` lays the lead post out side-by-side; every other
 * card stacks image over copy inside the grid.
 */
export function PostCard({
  post,
  featured = false,
  priority = featured,
}: {
  post: BlogPost;
  featured?: boolean;
  /**
   * Preloads the thumbnail. Defaults to the featured lead, but archives
   * without a lead need the first grid card to opt in — otherwise nothing on
   * the page preloads and that card is the LCP, lazily.
   */
  priority?: boolean;
}) {
  const meta = (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-[0.08em] text-brand-600">
      {post.categories[0] ? <span>{post.categories[0]}</span> : null}
      <span className="text-navy-500">{formatDate(post.date)}</span>
      <span className="text-navy-500">{post.readingMinutes} min read</span>
    </p>
  );

  return (
    <article className={cn("group", featured && "grid gap-8 lg:grid-cols-2 lg:items-center")}>
      {/* The image repeats the link on the heading below. Hidden from assistive
          tech and taken out of the tab order so it is not announced as a second,
          nameless link to the same place — a post with no featured image has
          only a decorative panel here and no text to name it with. */}
      <Link
        href={`/blog/${post.slug}`}
        aria-hidden="true"
        tabIndex={-1}
        className="block overflow-hidden"
      >
        <PhotoSlot
          src={post.image ?? undefined}
          alt={post.imageAlt}
          icon="book"
          ratio={featured ? "16/9" : "4/3"}
          sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 640px) 33vw, 100vw"}
          className="rounded-none transition-transform duration-500 group-hover:scale-[1.03]"
          priority={priority}
        />
      </Link>

      <div className={cn(featured ? "" : "mt-5")}>
        {meta}
        <h2
          className={cn(
            "mt-3 text-balance font-bold tracking-tight text-navy-950",
            featured ? "text-3xl sm:text-4xl" : "text-xl",
          )}
        >
          <Link href={`/blog/${post.slug}`} className="hover:text-brand-700">
            {post.title}
          </Link>
        </h2>
        <p
          className={cn(
            "mt-3 leading-relaxed text-navy-600",
            featured ? "text-lg" : "line-clamp-3 text-sm",
          )}
        >
          {post.excerpt}
        </p>
        <Link
          href={`/blog/${post.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-navy-950"
        >
          Read the post
          <Icon
            name="arrowRight"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </article>
  );
}
