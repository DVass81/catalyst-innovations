/** Reviewed campaign labels, not a claim that a platform verified the referral. */
export const blogCampaignChannels = ["linkedin", "google_business_profile", "email", "direct"] as const;
export type BlogCampaignChannel = (typeof blogCampaignChannels)[number];
export type ContentKind = "guide" | "blog";
export type BlogCampaign = ({ article: string; post?: never } | { post: string; article?: never }) & { channel: BlogCampaignChannel };
export const blogCampaignStorageKey = "catalyst-blog-campaign-v1";

function validArticleId(input: unknown): input is string {
  return typeof input === "string" && input.length <= 100 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input);
}
function campaign(input: unknown, articleIds: readonly string[], blogPostIds: readonly string[]): BlogCampaign | null {
  if (!input || typeof input !== "object") return null;
  const data = input as Record<string, unknown>;
  const { article, post, channel } = data;
  if (typeof channel !== "string" || !(blogCampaignChannels as readonly string[]).includes(channel) || ("article" in data && "post" in data)) return null;
  if (validArticleId(article) && articleIds.includes(article)) return { article, channel: channel as BlogCampaignChannel };
  if (validArticleId(post) && blogPostIds.includes(post)) return { post, channel: channel as BlogCampaignChannel };
  return null;
}

/** A campaign can only enter through its actual published article URL. */
export function parseBlogCampaign(search: string, path: string | null, articleIds: readonly string[], blogPostIds: readonly string[] = []): BlogCampaign | null {
  const params = new URLSearchParams(search);
  const articles = params.getAll("ci_article");
  const posts = params.getAll("ci_post");
  const channels = params.getAll("ci_source");
  if (channels.length !== 1 || (articles.length !== 1 && posts.length !== 1) || (articles.length && posts.length)) return null;
  const clean = campaign(articles.length ? { article: articles[0], channel: channels[0] } : { post: posts[0], channel: channels[0] }, articleIds, blogPostIds);
  const expected = clean && (clean.article ? `/insights/${clean.article}` : `/blog/${clean.post}`);
  return clean && path === expected ? clean : null;
}

/** Canonical article URLs only; never propagate an existing query or fragment. */
export function articleCampaignUrl(articleUrl: string, article: string, channel: BlogCampaignChannel, kind: ContentKind = "guide"): string | null {
  if (!validArticleId(article) || !(blogCampaignChannels as readonly string[]).includes(channel) || !["guide", "blog"].includes(kind)) return null;
  try {
    const url = new URL(articleUrl);
    const expected = kind === "blog" ? `/blog/${article}` : `/insights/${article}`;
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.pathname !== expected) return null;
    url.search = "";
    url.hash = "";
    url.searchParams.set("ci_source", channel);
    url.searchParams.set(kind === "blog" ? "ci_post" : "ci_article", article);
    return url.toString();
  } catch { return null; }
}

type CampaignStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/** No campaign storage is read or written until analytics consent is active.
 * Storage is per browser tab, contains two reviewed labels, and is cleared on
 * withdrawal or a measurement-mode change. Blocked storage stays in memory. */
export function createBlogCampaignSession(articleIds: readonly string[], getStorage: () => CampaignStorage | undefined, blogPostIds: readonly string[] = []) {
  const published = [...articleIds];
  const posts = [...blogPostIds];
  let active = false;
  let current: BlogCampaign | null = null;
  const capture = (search: string, path: string | null) => {
    if (!active) return;
    const next = parseBlogCampaign(search, path, published, posts);
    if (!next) return;
    current = next;
    try { getStorage()?.setItem(blogCampaignStorageKey, JSON.stringify(next)); } catch {}
  };
  return {
    activate(search: string, path: string | null) {
      active = true;
      try {
        const raw = getStorage()?.getItem(blogCampaignStorageKey);
        current = raw ? campaign(JSON.parse(raw), published, posts) : null;
      } catch { current = null; }
      capture(search, path);
    },
    capture,
    properties(): Record<string, string> {
      if (!active || !current) return {};
      return current.article ? { campaign_article: current.article, campaign_channel: current.channel } : { campaign_post: current.post!, campaign_channel: current.channel };
    },
    withdraw() {
      active = false;
      current = null;
      try { getStorage()?.removeItem(blogCampaignStorageKey); } catch {}
    },
  };
}
