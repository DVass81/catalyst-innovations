/** Reviewed campaign labels, not a claim that a platform verified the referral. */
export const blogCampaignChannels = ["linkedin", "google_business_profile", "email", "direct"] as const;
export type BlogCampaignChannel = (typeof blogCampaignChannels)[number];
export type BlogCampaign = { article: string; channel: BlogCampaignChannel };
export const blogCampaignStorageKey = "catalyst-blog-campaign-v1";

function validArticleId(input: unknown): input is string {
  return typeof input === "string" && input.length <= 100 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input);
}
function campaign(input: unknown, articleIds: readonly string[]): BlogCampaign | null {
  if (!input || typeof input !== "object") return null;
  const { article, channel } = input as Record<string, unknown>;
  return validArticleId(article) && articleIds.includes(article)
    && typeof channel === "string" && (blogCampaignChannels as readonly string[]).includes(channel)
    ? { article, channel: channel as BlogCampaignChannel } : null;
}

/** A campaign can only enter through its actual published article URL. */
export function parseBlogCampaign(search: string, path: string | null, articleIds: readonly string[]): BlogCampaign | null {
  const params = new URLSearchParams(search);
  const articles = params.getAll("ci_article");
  const channels = params.getAll("ci_source");
  if (articles.length !== 1 || channels.length !== 1) return null;
  const clean = campaign({ article: articles[0], channel: channels[0] }, articleIds);
  return clean && path === `/insights/${clean.article}` ? clean : null;
}

/** Canonical article URLs only; never propagate an existing query or fragment. */
export function articleCampaignUrl(articleUrl: string, article: string, channel: BlogCampaignChannel): string | null {
  if (!validArticleId(article) || !(blogCampaignChannels as readonly string[]).includes(channel)) return null;
  try {
    const url = new URL(articleUrl);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.pathname !== `/insights/${article}`) return null;
    url.search = "";
    url.hash = "";
    url.searchParams.set("ci_source", channel);
    url.searchParams.set("ci_article", article);
    return url.toString();
  } catch { return null; }
}

type CampaignStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/** No campaign storage is read or written until analytics consent is active.
 * Storage is per browser tab, contains two reviewed labels, and is cleared on
 * withdrawal or a measurement-mode change. Blocked storage stays in memory. */
export function createBlogCampaignSession(articleIds: readonly string[], getStorage: () => CampaignStorage | undefined) {
  const published = [...articleIds];
  let active = false;
  let current: BlogCampaign | null = null;
  const capture = (search: string, path: string | null) => {
    if (!active) return;
    const next = parseBlogCampaign(search, path, published);
    if (!next) return;
    current = next;
    try { getStorage()?.setItem(blogCampaignStorageKey, JSON.stringify(next)); } catch {}
  };
  return {
    activate(search: string, path: string | null) {
      active = true;
      try {
        const raw = getStorage()?.getItem(blogCampaignStorageKey);
        current = raw ? campaign(JSON.parse(raw), published) : null;
      } catch { current = null; }
      capture(search, path);
    },
    capture,
    properties(): Record<string, string> {
      return active && current ? { campaign_article: current.article, campaign_channel: current.channel } : {};
    },
    withdraw() {
      active = false;
      current = null;
      try { getStorage()?.removeItem(blogCampaignStorageKey); } catch {}
    },
  };
}
