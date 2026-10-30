import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, CalendarDays, Clock3 } from "lucide-react";
import BlogLibrary from "@/components/BlogLibrary";
import { DiscussCTA } from "@/components/SiteSections";
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
  return <div className="insights-page catalyst-blog-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])).replace(/</g, "\\u003c") }} />
    <section className="wrap page-intro insights-intro">
      <p className="overline">The Catalyst Blog</p>
      <h1>Less busywork.<br /><em>A fresh perspective.</em></h1>
      <div className="blog-intro-bottom"><p className="intro-copy">Short Friday reads about manual work, useful automation and the business problems behind better software. A practical perspective, with credible sources and room for your own questions.</p>{featured && <a className="text-link" href="#all-articles">Explore the articles <ArrowDown size={17} aria-hidden="true" /></a>}</div>
      <div className="blog-editorial-rhythm"><span><Clock3 size={16} aria-hidden="true" />3–5 minute reads</span><span><CalendarDays size={16} aria-hidden="true" />Friday editions</span><span>For business owners and their teams</span></div>
    </section>
    {featured ? <>
      <section className="wrap blog-featured" aria-labelledby="featured-blog-heading"><div className="blog-featured-copy"><p className="overline">Latest edition / {featured.category}</p><h2 id="featured-blog-heading"><Link href={`/blog/${featured.slug}`}>{featured.title}</Link></h2><p>{featured.description}</p><div className="blog-featured-meta"><BookOpen size={17} aria-hidden="true" /><span>{blogReadingMinutes(featured)} min read</span><span>Published by Catalyst Innovations</span></div><Link className="button" href={`/blog/${featured.slug}`}>Read the latest article <ArrowUpRight size={18} aria-hidden="true" /></Link></div><div className="blog-featured-art" aria-hidden="true"><p>A QUESTION WORTH ASKING</p><div className="blog-process-word">Find the friction.<br /><span>See the possibility.</span><br />Move forward.</div><div className="blog-process-line"><span>Real work</span><ArrowRight size={18} /><span>A useful perspective</span></div><BookOpen className="blog-featured-book" size={110} strokeWidth={0.7} /></div></section>
      <BlogLibrary articles={posts.map(post => ({ slug: post.slug, title: post.title, description: post.description, category: post.category, publishedAt: post.publishedAt, readingMinutes: blogReadingMinutes(post) }))} />
    </> : <section className="wrap blog-awaiting-edition" aria-labelledby="first-edition-heading"><div className="blog-edition-mark" aria-hidden="true"><BookOpen size={38} strokeWidth={1.3} /></div><div><p className="overline">A new place for the conversation</p><h2 id="first-edition-heading">Our first Friday edition<br /><em>is being prepared.</em></h2><p>We’ll explore where manual processes get in the way, what automation can help with and which questions are worth asking before you change your software.</p><p>Each edition is intended to be a 3–5 minute read, with sources for factual claims and clear distinctions between examples and real results.</p><Link className="text-link" href="/insights">Read our existing practical guides <ArrowUpRight size={17} aria-hidden="true" /></Link></div></section>}
    <section className="wrap content-section insights-note blog-library-footer"><div><p>Prefer a step-by-step reference? Our <Link href="/insights" className="text-link">Guides library</Link> covers workflows, migration, software selection and more.</p><a className="text-link blog-rss-link" href="/feed.xml">Follow the blog with RSS <ArrowUpRight size={15} aria-hidden="true" /></a></div><Link className="blog-editor-entry" href="/blog/editor">For the Catalyst team: open the editor <ArrowUpRight size={14} aria-hidden="true" /></Link></section>
    <DiscussCTA />
  </div>;
}
