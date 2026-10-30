import { getPublishedPosts } from "@/lib/blog";
import { site } from "@/lib/site";

export const revalidate = 300;

function xml(value: string) {
  return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]!);
}

export async function GET() {
  let articles: Awaited<ReturnType<typeof getPublishedPosts>>;
  try {
    articles = [...await getPublishedPosts()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  } catch {
    return new Response("The feed is temporarily unavailable. Please try again shortly.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "Retry-After": "300" } });
  }
  const updatedAt = articles.map(article => article.updatedAt).sort().at(-1);
  const date = (value: string) => new Date(`${value}T12:00:00Z`).toUTCString();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
<title>${xml(site.name)} — The Catalyst Blog</title>
<link>${xml(new URL("/blog", site.url).toString())}</link>
<description>Short Friday reads on manual work, practical automation and the questions behind better software.</description>
<language>en-US</language>
<atom:link href="${xml(new URL("/feed.xml", site.url).toString())}" rel="self" type="application/rss+xml"/>
${updatedAt ? `<lastBuildDate>${date(updatedAt)}</lastBuildDate>` : ""}
${articles.map(article => {
    const url = xml(new URL(`/blog/${article.slug}`, site.url).toString());
    return `<item>
<title>${xml(article.title)}</title>
<link>${url}</link>
<guid isPermaLink="true">${url}</guid>
<description>${xml(article.description)}</description>
<category>${xml(article.category)}</category>
<dc:creator>${xml(site.name)}</dc:creator>
<pubDate>${date(article.publishedAt)}</pubDate>
</item>`;
  }).join("\n")}
</channel>
</rss>`;
  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600", "X-Content-Type-Options": "nosniff" } });
}
