import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/data/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "", "/solutions", "/industries", "/portfolio", "/method",
    "/founders", "/insights", "/insights/why-business-software-fails",
    "/contact", "/consultation", "/roi-estimator", "/demo-lab",
    "/privacy", "/terms", "/accessibility",
  ];
  return [
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
