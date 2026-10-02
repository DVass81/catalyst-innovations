import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/data/services";
import { calculators } from "@/lib/calculators";
import { industryList } from "@/data/redesign";
import { insights } from "@/data/insights";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/solutions",
    "/industries",
    "/portfolio",
    "/method",
    "/about",
    "/pricing",
    "/contact",
    "/consultation",
    "/tools",
    "/insights",
    "/privacy",
    "/terms",
    "/accessibility",
  ];
  return [
    ...insights.map((article) => ({
      url: new URL(`/insights/${article.slug}`, site.url).toString(),
      lastModified: article.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...calculators.map((c) => ({
      url: new URL(`/tools/${c.slug}`, site.url).toString(),
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
