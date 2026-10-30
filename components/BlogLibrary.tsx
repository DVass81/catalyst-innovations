"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";

/** Only public card summaries cross the client boundary, never full article bodies. */
export type BlogSummary = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  readingMinutes: number;
};

export function filterBlogArticles(articles: BlogSummary[], query: string, category: string) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return articles.filter(article => {
    if (category && article.category !== category) return false;
    const text = `${article.title} ${article.description} ${article.category}`.toLocaleLowerCase();
    return words.every(word => text.includes(word));
  });
}

function articleDate(value: string) {
  return new Date(`${value}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export default function BlogLibrary({ articles, kind = "blog" }: { articles: BlogSummary[]; kind?: "blog" | "guide" }) {
  const basePath = kind === "guide" ? "/insights" : "/blog";
  const plural = kind === "guide" ? "guides" : "articles";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const categories = useMemo(() => [...new Set(articles.map(article => article.category))].sort(), [articles]);
  const results = useMemo(() => filterBlogArticles(articles, query, category), [articles, query, category]);

  return <section className="wrap content-section blog-library" aria-labelledby="blog-library-heading" id="all-articles">
    <div className="blog-library-heading"><div><p className="overline">Find a useful starting point</p><h2 id="blog-library-heading">Explore the {plural}.</h2></div><p>Choose the work you want to improve, or search for a question on your mind.</p></div>
    <div className="blog-filter-bar">
      <label className="blog-search"><span>Search {plural}</span><span className="blog-search-field"><Search size={18} aria-hidden="true" /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try estimates, inventory or training" /></span></label>
      <label className="blog-topic"><span>Topic</span><select value={category} onChange={event => setCategory(event.target.value)}><option value="">All topics</option>{categories.map(topic => <option key={topic} value={topic}>{topic}</option>)}</select></label>
    </div>
    <div className="blog-results-bar"><p role="status" aria-live="polite">{results.length} {results.length === 1 ? kind === "guide" ? "guide" : "article" : plural}{category ? ` in ${category}` : " to explore"}</p>{(query || category) && <button type="button" onClick={() => { setQuery(""); setCategory(""); }}>Clear filters</button>}</div>
    {results.length ? <div className="insights-grid">{results.map(article => <article className="insight-card" key={article.slug}>
      <div className="insight-card-top"><span className="overline">{article.category}</span><ArrowUpRight size={20} strokeWidth={1.4} aria-hidden="true" /></div>
      <h3><Link href={`${basePath}/${article.slug}`}>{article.title}</Link></h3>
      <p>{article.description}</p>
      <div className="blog-card-meta"><time dateTime={article.publishedAt}>{articleDate(article.publishedAt)}</time><span aria-hidden="true">·</span><span>{article.readingMinutes} min read</span></div>
      <Link className="text-link blog-read-link" href={`${basePath}/${article.slug}`}>Read the {kind === "guide" ? "guide" : "article"} <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only">: {article.title}</span></Link>
    </article>)}</div> : <div className="blog-empty"><h3>No {plural} match that search.</h3><p>Try a broader phrase or choose another topic.</p><button type="button" className="button" onClick={() => { setQuery(""); setCategory(""); }}>Show all {plural}</button></div>}
    <noscript><p className="blog-noscript">All published {plural} are shown here. Search and topic filtering become available with JavaScript enabled.</p></noscript>
  </section>;
}
