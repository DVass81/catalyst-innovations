import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/data/services";
import { calculators } from "@/lib/calculators";
import { industryList } from "@/data/redesign";
import { insights } from "@/data/insights";
import { getPublishedPosts } from "@/lib/blog";
import { demos } from "@/data/demos";
import { calculatorContent } from "@/data/seoContent";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  const staticRoutes = [
    "",
    "/services",
    "/solutions",
    "/industries",
    "/portfolio",
    "/method",
    "/about",
    "/discovery",
    "/contact",
    "/consultation",
    "/tools",
    "/insights",
    "/blog",
    "/privacy",
    "/terms",
    "/accessibility",
  ];
  return [
    ...posts.map(post => ({
      url: new URL(`/blog/${post.slug}`, site.url).toString(),
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...demos.flatMap((demo) => demo.walkthrough ? [{
      url: new URL(`/portfolio/${demo.id}`, site.url).toString(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      videos: [{
        title: `${demo.displayName} software walkthrough`,
        description: demo.purpose,
        thumbnail_loc: new URL(demo.walkthrough.poster, site.url).toString(),
        content_loc: new URL(demo.walkthrough.video, site.url).toString(),
        duration: Math.round(demo.walkthrough.durationSeconds),
      }],
    }] : []),
    ...insights.map((article) => ({
      url: new URL(`/insights/${article.slug}`, site.url).toString(),
      lastModified: article.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...calculators.map((c) => ({
      url: new URL(`/tools/${c.slug}`, site.url).toString(),
      lastModified: calculatorContent[c.slug]?.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...industryList.map((i) => ({
      url: new URL(`/industries/${i.slug}`, site.url).toString(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...staticRoutes.map((r) => ({
      url: new URL(r || "/", site.url).toString(),
      changeFrequency: "monthly" as const,
      priority: r === "" ? 1 : 0.7,
    })),
    ...services.map((s) => ({
      url: new URL(`/solutions/${s.slug}`, site.url).toString(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
