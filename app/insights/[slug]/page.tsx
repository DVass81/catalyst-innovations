import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getInsight, insights, insightReadingMinutes } from "@/data/insights";
import { getCalculator } from "@/lib/calculators";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import "../insights.css";

export const generateStaticParams = () => insights.map(article => ({ slug: article.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const article = getInsight((await params).slug);
  if (!article) notFound();
  const metadata = pageMetadata({ title: article.title, description: article.description, path: `/insights/${article.slug}` });
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article", publishedTime: article.publishedAt, modifiedTime: article.updatedAt } };
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const article = getInsight((await params).slug);
  if (!article) notFound();
  const context = article.industry ? `?industry=${article.industry}` : "";
  const inquiry = article.demo ? `/consultation?demo=${article.demo}${article.industry ? `&industry=${article.industry}` : ""}` : `/consultation${context}`;
  const articleUrl = new URL(`/insights/${article.slug}`, site.url).toString();
  const jsonLd = [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Insights", path: "/insights" }, { name: article.title, path: `/insights/${article.slug}` }]), {
    "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.description,
    datePublished: article.publishedAt, dateModified: article.updatedAt, inLanguage: "en-US",
    mainEntityOfPage: articleUrl, url: articleUrl,
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  }];
  return <div className="insights-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <header className="wrap page-intro insight-header">
      <Link className="breadcrumb" href="/insights">← All guides</Link>
      <p className="overline">{article.category}</p>
      <h1>{article.title}</h1>
      <p className="intro-copy">{article.description}</p>
      <p className="insight-byline">Published by Catalyst Innovations · <time dateTime={article.publishedAt}>{new Date(`${article.publishedAt}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}</time> · {insightReadingMinutes(article)} min read</p>
    </header>
    <div className="wrap insight-layout">
      <aside className="insight-toc"><nav aria-label="On this page"><p className="overline">In this guide</p><ol>{article.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.heading.replace(/^\d+\. /, "")}</a></li>)}</ol><a href="#try-your-numbers">Try your numbers ↓</a></nav></aside>
      <article className="insight-body">
        <p className="insight-opening">{article.introduction}</p>
        <aside className="insight-takeaway"><p className="overline">A useful starting point</p><p>{article.takeaway}</p></aside>
        {article.sections.map(section => <section id={section.id} key={section.id}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          {section.checklist && <ul>{section.checklist.map(item => <li key={item}>{item}</li>)}</ul>}
          {section.source !== undefined && <p className="insight-reference">Background reference: <a href={article.sources[section.source].url} target="_blank" rel="noopener noreferrer">{article.sources[section.source].title} ↗</a></p>}
        </section>)}
        <aside className="insight-example"><p className="overline">Illustrative example</p><h2>{article.example.title}</h2><p>{article.example.text}</p></aside>
        <section id="try-your-numbers"><h2>Explore the figures behind the work.</h2><p>Use your own assumptions. These tools distinguish time, cost and opportunity; their results should not automatically be added together.</p><div className="insight-tools">{article.tools.map(slug => {
          const tool = getCalculator(slug)!;
          return <Link href={`/tools/${slug}${context}`} key={slug}><strong>{tool.title}</strong><span>{tool.description}</span><span className="text-link">Try the calculator ↗</span></Link>;
        })}</div></section>
        <section className="insight-next"><p className="overline">A practical next step</p><h2>Bring the process you want to improve.</h2><p>{article.nextStep}</p><div className="insight-actions"><Link className="button" href={inquiry}>Discuss my business ↗</Link><Link className="text-link" href={`/solutions/${article.solution}`}>Explore the relevant solution ↗</Link>{article.demo && <Link className="text-link" href={`/portfolio${context}#${article.demo}`}>See the actual demonstration ↗</Link>}</div></section>
        <footer className="insight-sources"><h2>Sources and editorial notes</h2><p>Sources reviewed October 2, 2026. Linked references support the attributed background; the workflow suggestions and fictional examples are Catalyst’s editorial guidance.</p><ul>{article.sources.map(ref => <li key={ref.url}><a href={ref.url} target="_blank" rel="noopener noreferrer">{ref.title} ↗</a></li>)}</ul></footer>
      </article>
    </div>
    <section className="wrap content-section insight-related"><p className="overline">Keep exploring</p><h2>Another part of the process.</h2><div className="insights-grid">{insights.filter(item => item.slug !== article.slug).slice(0, 2).map(item => <article key={item.slug} className="insight-card"><p className="overline">{item.category}</p><h3><Link href={`/insights/${item.slug}`}>{item.title}</Link></h3><p>{item.description}</p><Link className="text-link" href={`/insights/${item.slug}`}>Read the guide ↗<span className="sr-only">: {item.title}</span></Link></article>)}</div></section>
  </div>;
}
