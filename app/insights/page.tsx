import Link from "next/link";
import { insightReadingMinutes } from "@/data/insights";
import { getPublishedInsights } from "@/lib/blog";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { DiscussCTA } from "@/components/SiteSections";
import BlogLibrary from "@/components/BlogLibrary";
import { ArrowDown, ArrowUpRight, BookOpen, ArrowRight } from "lucide-react";
import "./insights.css";

export const revalidate = 300;

const libraryMetadata = pageMetadata({
  title: "Business Software Blog & Practical Guides",
  description: "Practical guides from Catalyst Innovations on field workflows, manufacturing, inventory, approvals, HOA requests and choosing business software.",
  path: "/insights",
});
export const metadata = {
  ...libraryMetadata,
  alternates: { ...libraryMetadata.alternates, types: { "application/rss+xml": new URL("/feed.xml", site.url).toString() } },
};

export default async function InsightsPage() {
  const articles = [...await getPublishedInsights()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const featured = articles[0];
  return <div className="insights-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog & Guides", path: "/insights" }])).replace(/</g, "\\u003c") }} />
    <section className="wrap page-intro insights-intro">
      <p className="overline">The Catalyst Blog &amp; Guides</p>
      <h1>Ideas for a<br /><em>better-running business.</em></h1>
      <div className="blog-intro-bottom"><p className="intro-copy">Plain-language ideas for connecting your work, choosing software and helping your team move forward. From our team in Knoxville, Tennessee, for business owners ready for a clearer process.</p><a className="text-link" href="#all-articles">Explore the articles <ArrowDown size={17} aria-hidden="true" /></a></div>
    </section>
    {featured && <section className="wrap blog-featured" aria-labelledby="featured-article-heading"><div className="blog-featured-copy"><p className="overline">Featured guide / {featured.category}</p><h2 id="featured-article-heading"><Link href={`/insights/${featured.slug}`}>{featured.title}</Link></h2><p>{featured.description}</p><div className="blog-featured-meta"><BookOpen size={17} aria-hidden="true" /><span>{insightReadingMinutes(featured)} min read</span><span>Published by Catalyst Innovations</span></div><Link className="button" href={`/insights/${featured.slug}`}>Read the featured guide <ArrowUpRight size={18} aria-hidden="true" /></Link></div><div className="blog-featured-art" aria-hidden="true"><p>FROM THOUGHT TO ACTION</p><div className="blog-process-word">Understand.<br /><span>Connect.</span><br />Improve.</div><div className="blog-process-line"><span>One process</span><ArrowRight size={18} /><span>A useful next step</span></div><BookOpen className="blog-featured-book" size={110} strokeWidth={0.7} /></div></section>}
    <BlogLibrary articles={articles.map(article => ({ slug: article.slug, title: article.title, description: article.description, category: article.category, publishedAt: article.publishedAt, readingMinutes: insightReadingMinutes(article) }))} />
    <section className="wrap content-section insights-note"><p>These guides explain possible approaches and questions to ask. Illustrative examples are not customer results. Actual software scope depends on your workflow, existing tools and requirements.</p><a className="text-link blog-rss-link" href="/feed.xml">Follow new articles with RSS <ArrowUpRight size={15} aria-hidden="true" /></a></section>
    <DiscussCTA />
  </div>;
}
