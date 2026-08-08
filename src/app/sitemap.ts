import type { MetadataRoute } from "next";
import { blogCategories, posts } from "@/content/blog";
import { products } from "@/content/products";
import { programs } from "@/content/programs";
import { site } from "@/content/site";
import { categorySlug } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: {
    path: string;
    priority: number;
    changeFrequency: "daily" | "weekly" | "monthly";
  }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/programs", priority: 0.9, changeFrequency: "monthly" },
    /* /courses and its 24 detail pages are deliberately absent: the catalog is
       unlisted (noindex) while it still advertises classes that are not
       running. See src/app/courses/page.tsx. */
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/about/preferred-partners", priority: 0.5, changeFrequency: "monthly" },
    { path: "/join-our-team", priority: 0.5, changeFrequency: "monthly" },
    { path: "/privacy-policy", priority: 0.2, changeFrequency: "monthly" },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${site.url}${route.path}`,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...programs.map((program) => ({
      url: `${site.url}/programs/${program.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    /*
     * The buyable pages inside each program. These were missing entirely, which
     * mattered little while they were three pages reachable from a program
     * grid, and matters now that six of them sit in the primary navigation.
     */
    ...products.map((product) => ({
      url: `${site.url}/programs/${product.programSlug}/${product.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...blogCategories.map((category) => ({
      url: `${site.url}/blog/category/${categorySlug(category)}`,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
    /*
     * Numbered archive pages and tag archives are deliberately absent. Both
     * are noindex/follow, and listing a noindex URL in the sitemap sends a
     * crawler two contradictory instructions — submit this for indexing, and
     * do not index it. Every post they contain is already listed above, and
     * the pagination links keep them reachable by crawl regardless.
     */
  ];
}
