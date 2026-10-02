import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/data/services";
import { calculators } from "@/lib/calculators";
import { industryList } from "@/data/redesign";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/solutions",
    "/industries",
    "/portfolio",
    "/method",
    "/about",
    "/founders",
    "/pricing",
    "/contact",
    "/consultation",
    "/tools",
    "/privacy",
    "/terms",
    "/accessibility",
  ];
  return [
    ...calculators.map((c) => ({
      url: `${site.url}/tools/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...industryList.map((i) => ({
      url: `${site.url}/industries/${i.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...staticRoutes.map((r) => ({
      url: `${site.url}${r}`,
      changeFrequency: "monthly" as const,
      priority: r === "" ? 1 : 0.7,
    })),
    ...services.map((s) => ({
      url: `${site.url}/solutions/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
