import Link from "next/link";
import { insights, insightReadingMinutes } from "@/data/insights";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { DiscussCTA } from "@/components/SiteSections";
import BlogLibrary from "@/components/BlogLibrary";
import { ArrowDown, ArrowUpRight, BookOpen, ArrowRight } from "lucide-react";
import "./insights.css";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Practical Business Software Guides",
  description: "Practical guides from Catalyst Innovations on field workflows, manufacturing, inventory, approvals, HOA requests and choosing business software.",
  path: "/insights",
});

export default async function InsightsPage() {
  const articles = [...insights].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const featured = articles[0];
  return <div className="insights-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Guides", path: "/insights" }])).replace(/</g, "\\u003c") }} />
    <section className="wrap page-intro insights-intro">
      <p className="overline">The Catalyst Guides</p>
      <h1>A practical guide.<br /><em>A clearer next step.</em></h1>
      <div className="blog-intro-bottom"><p className="intro-copy">Reference guides for choosing software, connecting everyday handoffs and preparing your team for change. Work through a process at your own pace, with useful questions, examples and calculators.</p><a className="text-link" href="#all-articles">Explore the guides <ArrowDown size={17} aria-hidden="true" /></a></div>
    </section>
    {featured && <section className="wrap blog-featured" aria-labelledby="featured-article-heading"><div className="blog-featured-copy"><p className="overline">Featured guide / {featured.category}</p><h2 id="featured-article-heading"><Link href={`/insights/${featured.slug}`}>{featured.title}</Link></h2><p>{featured.description}</p><div className="blog-featured-meta"><BookOpen size={17} aria-hidden="true" /><span>{insightReadingMinutes(featured)} min read</span><span>Published by Catalyst Innovations</span></div><Link className="button" href={`/insights/${featured.slug}`}>Read the featured guide <ArrowUpRight size={18} aria-hidden="true" /></Link></div><div className="blog-featured-art" aria-hidden="true"><p>FROM THOUGHT TO ACTION</p><div className="blog-process-word">Understand.<br /><span>Connect.</span><br />Improve.</div><div className="blog-process-line"><span>One process</span><ArrowRight size={18} /><span>A useful next step</span></div><BookOpen className="blog-featured-book" size={110} strokeWidth={0.7} /></div></section>}
    <BlogLibrary kind="guide" articles={articles.map(article => ({ slug: article.slug, title: article.title, description: article.description, category: article.category, publishedAt: article.publishedAt, readingMinutes: insightReadingMinutes(article) }))} />
    <section className="wrap content-section insights-note"><p>These guides explain possible approaches and questions to ask. Illustrative examples are not customer results. Actual software scope depends on your workflow, existing tools and requirements.</p><Link className="text-link blog-rss-link" href="/blog">Looking for our latest thinking? Visit the Catalyst Blog <ArrowUpRight size={15} aria-hidden="true" /></Link></section>
    <DiscussCTA />
  </div>;
}
