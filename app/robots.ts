import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_PREVIEW === "true")
    return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/portal", "/api/"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
