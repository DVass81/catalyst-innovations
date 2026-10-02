import type { Metadata } from "next";
import { site } from "@/lib/site";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
};

/** Align page metadata and explicitly retain the existing generated image routes. */
export function pageMetadata({ title, description, path, noIndex = false }: PageMetadataInput): Metadata {
  const fullTitle = title.includes(site.name) ? title : `${title} | ${site.name}`;
  const url = new URL(path, site.url).toString();
  // Metadata objects merge shallowly: child pages need an explicit image reference.
  const solutionImage = /^\/solutions\/[^/]+$/.test(path);
  const image = {
    url: new URL(solutionImage ? `${path}/opengraph-image` : "/opengraph-image", site.url).toString(),
    width: 1200,
    height: 630,
    alt: solutionImage ? fullTitle : "Catalyst Innovations — Custom software. A better-running business.",
  };
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: { title: fullTitle, description, url, siteName: site.name, type: "website", locale: "en_US", images: [image] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
    robots: { index: !noIndex, follow: true },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem", position: index + 1, name: item.name,
      item: new URL(item.path, site.url).toString(),
    })),
  };
}
