import type { MetadataRoute } from "next";
import { programs } from "@/content/programs";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/programs", priority: 0.9, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
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
  ];
}
