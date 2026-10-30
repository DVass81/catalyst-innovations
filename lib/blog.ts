import { cache } from "react";
import { z } from "zod";
import { insights as existingArticles, type Insight } from "@/data/insights";
import { getCalculator } from "@/lib/calculators";
import { services } from "@/data/services";
import { industryNeeds } from "@/data/industryNeeds";

/** Published content only. Editor drafts and credentials never enter this reader. */
const slug = z.string().max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const parsed = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
});
const text = z.string().trim().min(1).refine(value => !/<\/?[a-z][^>]*>/i.test(value), "Plain text only");
const arrayKey = z.string().max(128).regex(/^[A-Za-z0-9_-]+$/);
const httpsUrl = z.string().url().refine(value => {
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; }
  catch { return false; }
});
const sourceUrl = httpsUrl.max(2000).refine(value => {
  try { const url = new URL(value); return !url.search && !url.hash && !/^(localhost|127\.|0\.|10\.|192\.168\.|169\.254\.|\[?::1\]?$)/i.test(url.hostname); }
  catch { return false; }
});
const source = z.object({ _key: arrayKey.nullish().transform(value => value ?? undefined), title: text.max(300), url: sourceUrl, reviewedAt: date });
const section = z.object({
  id: slug.nullish().transform(value => value ?? undefined), _key: arrayKey.nullish().transform(value => value ?? undefined), heading: text.max(200),
  paragraphs: z.array(text.max(5000)).min(1).max(20),
  checklist: z.array(text.max(1000)).max(20).nullish().transform(value => value ?? undefined),
  source: z.number().int().min(0).max(29).nullish().transform(value => value ?? undefined),
  sourceKey: arrayKey.nullish().transform(value => value ?? undefined),
});
const cover = z.object({ url: httpsUrl.max(2000), alt: text.max(250), caption: text.max(300).nullish().transform(value => value ?? undefined) });
const schema = z.object({
  _id: z.string().min(1).max(200).optional(),
  slug: z.union([slug, z.object({ current: slug })]),
  title: text.min(10).max(120), description: text.min(30).max(240), category: text.max(80),
  publishedAt: date, updatedAt: date.nullish().transform(value => value ?? undefined), introduction: text.min(40).max(5000), takeaway: text.max(1000),
  sections: z.array(section).min(1).max(30),
  example: z.object({ title: text.max(200), text: text.max(6000) }),
  nextStep: text.max(3000), tools: z.array(slug).max(4).nullish().transform(value => value ?? []),
  solution: slug, industry: slug.nullish().transform(value => value ?? undefined), demo: z.enum(["hoa", "flooring", "painting"]).nullish().transform(value => value ?? undefined),
  related: z.array(slug).max(4).nullish().transform(value => value ?? undefined), sources: z.array(source).max(30).nullish().transform(value => value ?? []),
  // `cover` preserves Insight compatibility; coverImage is the projected Studio field.
  cover: cover.nullable().optional(), coverImage: cover.nullable().optional(),
});

function todayEastern() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export function normalizeBlogArticle(input: unknown, today = todayEastern()): Insight | null {
  if (!date.safeParse(today).success) return null;
  const result = schema.safeParse(input);
  if (!result.success) return null;
  const article = result.data;
  // Dot-separated IDs include drafts/releases and are not anonymous public documents.
  if ((article._id && !/^[A-Za-z0-9_-]+$/.test(article._id)) || article.publishedAt > today || (article.updatedAt && (article.updatedAt > today || article.updatedAt < article.publishedAt))) return null;
  if (!services.some(service => service.slug === article.solution)) return null;
  if (article.industry && !Object.hasOwn(industryNeeds, article.industry)) return null;
  if (article.tools.some(id => !getCalculator(id)) || new Set(article.tools).size !== article.tools.length) return null;
  if (article.related && new Set(article.related).size !== article.related.length) return null;
  if (article.sources.some(item => item.reviewedAt > today)) return null;
  const image = article.coverImage ?? article.cover;
  if (image) {
    const url = new URL(image.url);
    if (url.hostname !== "cdn.sanity.io" || url.port || !url.pathname.startsWith("/images/")) return null;
  }
  const sourceKeys = article.sources.flatMap(item => item._key ? [item._key] : []);
  if (new Set(sourceKeys).size !== sourceKeys.length) return null;
  const sectionKeys = article.sections.flatMap(item => item._key ? [item._key] : []);
  if (new Set(sectionKeys).size !== sectionKeys.length) return null;
  const ids = new Set<string>();
  const sections: Insight["sections"] = [];
  for (const [i, part] of article.sections.entries()) {
    const id = part.id ?? part._key ?? `section-${i + 1}`;
    if (ids.has(id)) return null;
    ids.add(id);
    const keyedSource = part.sourceKey === undefined ? undefined : article.sources.findIndex(item => item._key === part.sourceKey);
    if (keyedSource === -1 || (part.source !== undefined && !article.sources[part.source]) || (keyedSource !== undefined && part.source !== undefined && keyedSource !== part.source)) return null;
    const sourceIndex = keyedSource ?? part.source;
    sections.push({ id, heading: part.heading, paragraphs: part.paragraphs, ...(part.checklist ? { checklist: part.checklist } : {}), ...(sourceIndex !== undefined ? { source: sourceIndex } : {}) });
  }
  return {
    slug: typeof article.slug === "string" ? article.slug : article.slug.current,
    title: article.title, description: article.description, category: article.category,
    publishedAt: article.publishedAt, updatedAt: article.updatedAt ?? article.publishedAt,
    introduction: article.introduction, takeaway: article.takeaway, sections,
    example: article.example, nextStep: article.nextStep,
    tools: article.tools, solution: article.solution,
    ...(article.industry ? { industry: article.industry } : {}), ...(article.demo ? { demo: article.demo } : {}),
    ...(article.related ? { related: article.related } : {}), sources: article.sources.map(({ title, url, reviewedAt }) => ({ title, url, reviewedAt })),
    ...(image ? { cover: image } : {}),
  };
}

export class BlogUnavailableError extends Error {
  constructor() { super("Published articles are temporarily unavailable."); this.name = "BlogUnavailableError"; }
}

type BlogReaderOptions = { projectId?: string; dataset?: string; fetcher?: typeof fetch; today?: string };
export async function readPublishedBlog({ projectId, dataset = "production", fetcher = fetch, today = todayEastern() }: BlogReaderOptions = {}): Promise<Insight[]> {
  if (!projectId) return [...existingArticles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  if (!/^[a-z0-9]{3,32}$/.test(projectId) || !/^[a-z0-9_-]{1,64}$/.test(dataset) || !date.safeParse(today).success) throw new BlogUnavailableError();
  const query = `*[_type == "blogArticle" && !(_id in path("drafts.**")) && !(_id in path("versions.**")) && publishedAt <= $today] | order(publishedAt desc) {
    _id, title, slug, description, category, publishedAt, updatedAt, introduction, takeaway,
    sections[]{_key,id,heading,paragraphs,checklist,source,sourceKey}, example, nextStep, tools, solution, industry, demo, related,
    sources[]{_key,title,url,reviewedAt}, "coverImage": select(defined(coverImage.asset) => {"url":coverImage.asset->url,"alt":coverImage.alt,"caption":coverImage.caption})
  }`;
  const url = new URL(`https://${projectId}.api.sanity.io/v2026-10-30/data/query/${dataset}`);
  url.searchParams.set("query", query);
  url.searchParams.set("$today", JSON.stringify(today));
  url.searchParams.set("perspective", "published");
  try {
    const response = await fetcher(url.toString(), { signal: AbortSignal.timeout(4000), next: { revalidate: 300, tags: ["published-blog"] } });
    if (!response.ok) throw new BlogUnavailableError();
    const raw = await response.text();
    if (raw.length > 2_000_000) throw new BlogUnavailableError();
    const value = JSON.parse(raw);
    if (!Array.isArray(value.result)) throw new BlogUnavailableError();
    if (value.result.some((item: unknown) => !item || typeof item !== "object" || typeof (item as { _id?: unknown })._id !== "string")) throw new BlogUnavailableError();
    const published = value.result.map((item: unknown) => normalizeBlogArticle(item, today)).filter((item: Insight | null): item is Insight => item !== null);
    // Reject an invalid catalog instead of silently inventing or resurrecting articles.
    if (published.length !== value.result.length || new Set(published.map((item: Insight) => item.slug)).size !== published.length) throw new BlogUnavailableError();
    return published.sort((a: Insight, b: Insight) => b.publishedAt.localeCompare(a.publishedAt));
  } catch { throw new BlogUnavailableError(); }
}

/** CMS becomes authoritative only after setup/import; an empty catalog stays empty. */
export const getPublishedInsights = cache(() => readPublishedBlog({
  projectId: process.env.NEXT_PUBLIC_BLOG_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_BLOG_SANITY_DATASET || "production",
}));

export async function getPublishedInsight(articleSlug: string) {
  if (!slug.safeParse(articleSlug).success) return undefined;
  return (await getPublishedInsights()).find(article => article.slug === articleSlug);
}

export function getBlogEditorUrl() {
  const value = process.env.BLOG_STUDIO_URL;
  if (!value) return null;
  try { const url = new URL(value); return url.protocol === "https:" && /^[a-z0-9][a-z0-9-]*\.sanity\.studio$/.test(url.hostname) && !url.port && !url.username && !url.password && !url.search && !url.hash ? url.toString() : null; }
  catch { return null; }
}
