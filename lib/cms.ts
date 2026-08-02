import { services as localServices, type Service } from "@/data/services";
import { industries as localIndustries, type Industry } from "@/data/industries";
import { products as localProducts, type Product } from "@/data/products";

/**
 * Optional headless-CMS layer (Sanity). Inactive by default — every
 * function below returns the local data/*.ts arrays with zero network
 * calls until you set:
 *
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
 *   NEXT_PUBLIC_SANITY_DATASET=production
 *
 * Then create matching document types in Sanity Studio (free tier is
 * plenty): "service", "industry", "product" — field names matching the
 * TypeScript types in data/services.ts, data/industries.ts, data/products.ts,
 * with `slug` as a Sanity slug field (`slug.current`).
 *
 * Any fetch failure, timeout, or schema mismatch falls back to local data
 * automatically — a misconfigured CMS can never take the site down.
 */

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const CMS_ENABLED = Boolean(PROJECT_ID);

async function groq<T>(query: string): Promise<T | null> {
  if (!CMS_ENABLED) return null;
  try {
    const url = `https://${PROJECT_ID}.apicdn.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal, next: { revalidate: 60 } });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Sanity responded ${res.status}`);
    const json = await res.json();
    return (json.result as T) ?? null;
  } catch (err) {
    console.warn("[cms] query failed, falling back to local data:", err instanceof Error ? err.message : err);
    return null;
  }
}

export async function getServices(): Promise<Service[]> {
  const result = await groq<Service[]>(
    `*[_type == "service"]{ "slug": slug.current, title, navLabel, tagline, keyMessage, description, capabilities, outcomes, icon }`,
  );
  return result && result.length > 0 ? result : localServices;
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  const list = await getServices();
  return list.find((s) => s.slug === slug);
}

export async function getIndustries(): Promise<Industry[]> {
  const result = await groq<Industry[]>(
    `*[_type == "industry"]{ "slug": slug.current, name, icon, problems, solutions, outcomes, related }`,
  );
  return result && result.length > 0 ? result : localIndustries;
}

export async function getProducts(): Promise<Product[]> {
  const result = await groq<Product[]>(
    `*[_type == "product"]{ "slug": slug.current, name, status, summary, audience, capabilities, icon }`,
  );
  return result && result.length > 0 ? result : localProducts;
}

export const cmsEnabled = CMS_ENABLED;
