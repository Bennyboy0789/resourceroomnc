import type { MetadataRoute } from "next";
import { blogCategories, posts } from "@/content/blog";
import { courses } from "@/content/courses";
import { programs } from "@/content/programs";
import { site } from "@/content/site";
import { categorySlug, POSTS_PER_PAGE } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: {
    path: string;
    priority: number;
    changeFrequency: "daily" | "weekly" | "monthly";
  }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/programs", priority: 0.9, changeFrequency: "monthly" },
    { path: "/courses", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/about/preferred-partners", priority: 0.5, changeFrequency: "monthly" },
    { path: "/join-our-team", priority: 0.5, changeFrequency: "monthly" },
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
    ...courses.map((course) => ({
      url: `${site.url}/courses/${course.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
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
     * Numbered archive pages are listed so posts past the ninth are reachable
     * by crawl, even though the pages themselves are noindex/follow. Tag
     * archives are deliberately left out: they are noindex browse aids and
     * every post they contain is already in the sitemap above.
     */
    ...Array.from(
      { length: Math.max(0, Math.ceil(posts.length / POSTS_PER_PAGE) - 1) },
      (_, i) => ({
        url: `${site.url}/blog/page/${i + 2}`,
        changeFrequency: "weekly" as const,
        priority: 0.3,
      }),
    ),
  ];
}
