import StudioPhoto from "@/components/studio/StudioPhoto";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import BlogArticle, { BlogArticleSchema } from "@/components/BlogArticle";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import { blogReadingMinutes, getPublishedPosts } from "@/lib/blog";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import "../insights/insights.css";
import "./blog.css";

export const revalidate = 300;

const blogMetadata = pageMetadata({
  title: "The Catalyst Blog: Manual Work & Automation",
  description: "Short Friday reads from Catalyst Innovations about manual work, practical automation and the business problems behind better software.",
  path: "/blog",
});
export const metadata = {
  ...blogMetadata,
  alternates: { ...blogMetadata.alternates, types: { "application/rss+xml": new URL("/feed.xml", site.url).toString() } },
};

export default async function BlogPage() {
  const posts = [...await getPublishedPosts()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const featured = posts[0];
  const earlier = posts.slice(1);
  return <div className="insights-page catalyst-blog-page blog-reading-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])).replace(/</g, "\\u003c") }} />
    {featured ? <>
      <BlogArticleSchema post={featured} />
      <BlogArticle post={featured} atBlogHome />
      {earlier.length > 0 && <section className="wrap blog-archive" aria-labelledby="blog-archive-heading"><p className="overline">From the archive</p><h2 id="blog-archive-heading">Previous editions</h2><ol>{earlier.map(article => <li key={article.slug}><div><BlogFeaturedImage cover={article.cover} thumbnail /><p className="overline">{article.category}</p><h3><Link href={`/blog/${article.slug}`}>{article.title}</Link></h3></div><p><time dateTime={article.publishedAt}>{new Date(`${article.publishedAt}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}</time><span>{blogReadingMinutes(article)} min read</span></p></li>)}</ol></section>}
    </> : <>
    <section className="wrap page-intro insights-intro">
      <p className="overline">The Catalyst Blog</p>
      <h1>Less busywork.<br /><em>A fresh perspective.</em></h1>
      <p className="intro-copy">Short Friday reads about manual work, useful automation and the business problems behind better software.</p>
    </section>
    <section className="wrap blog-awaiting-edition" aria-labelledby="first-edition-heading"><div className="blog-edition-photo"><StudioPhoto photoKey="planning" /></div><div><p className="overline">A new place for the conversation</p><h2 id="first-edition-heading">Our first Friday edition<br /><em>is being prepared.</em></h2><p>We’ll explore where manual processes get in the way, what automation can help with and which questions are worth asking before you change your software.</p><p>Each edition is intended to be a 3–5 minute read, with sources for factual claims and clear distinctions between examples and real results.</p><Link className="text-link" href="/insights">Read our existing practical guides <ArrowUpRight size={17} aria-hidden="true" /></Link></div></section></>}
    <section className="wrap content-section insights-note blog-library-footer"><div><p>Prefer a step-by-step reference? Our <Link href="/insights" className="text-link">Guides library</Link> covers workflows, migration, software selection and more.</p><a className="text-link blog-rss-link" href="/feed.xml">Follow the blog with RSS <ArrowUpRight size={15} aria-hidden="true" /></a></div></section>
  </div>;
}
