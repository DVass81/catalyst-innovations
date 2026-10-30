export type PreviewArticle = {
  _id?: string;
  title?: string;
  slug?: { current?: string };
  description?: string;
  category?: string;
  publishedAt?: string;
  introduction?: string;
  takeaway?: string;
  sections?: Array<{ _key: string; id?: string; heading?: string; paragraphs?: string[]; checklist?: string[]; sourceKey?: string }>;
  example?: { title?: string; text?: string };
  nextStep?: string;
  sources?: Array<{ _key: string; title?: string; url?: string }>;
  promotion?: { social?: string; emailSubject?: string; emailBody?: string };
  approval?: { approvedBy?: string; approvedAt?: string; fingerprint?: string };
};
export type ArticleViewProps = {
  document: { displayed?: PreviewArticle; published?: PreviewArticle | null; draft?: PreviewArticle | null };
};

export function publicArticleUrl(article?: PreviewArticle) {
  const slug = article?.slug?.current;
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return undefined;
  const configured = process.env.SANITY_STUDIO_WEBSITE_URL || "https://mycatalystinnovations.com";
  try {
    const website = new URL(configured);
    if (website.protocol !== "https:" || website.username || website.password) return undefined;
    if (slug === "editor") return undefined;
    return new URL(`/blog/${slug}`, website.origin).toString();
  } catch { return undefined; }
}

export type PromotionChannel = "linkedin" | "google_business_profile" | "email" | "direct";

/** Only two predefined labels leave the editor; no inherited URL queries or private fields. */
export function publicArticleCampaignUrl(article: PreviewArticle | undefined, channel: PromotionChannel) {
  if (!["linkedin", "google_business_profile", "email", "direct"].includes(channel)) return undefined;
  const canonical = publicArticleUrl(article);
  if (!canonical || !article?.slug?.current) return undefined;
  const url = new URL(canonical);
  url.searchParams.set("ci_source", channel);
  url.searchParams.set("ci_post", article.slug.current);
  return url.toString();
}
