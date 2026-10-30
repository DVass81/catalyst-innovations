import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleShare from "@/components/ArticleShare";
import { blogReadingMinutes, getPublishedPost, getPublishedPosts } from "@/lib/blog";
import { getCalculator } from "@/lib/calculators";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import "../../insights/insights.css";
import "../blog.css";

export const generateStaticParams = async () => (await getPublishedPosts()).map(post => ({ slug: post.slug }));
export const dynamicParams = true;
export const revalidate = 300;

function displayDate(value: string) {
  return new Date(`${value}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getPublishedPost((await params).slug);
  if (!post) notFound();
  const metadata = pageMetadata({ title: post.title, description: post.description, path: `/blog/${post.slug}` });
  const image = { url: new URL(`/blog/${post.slug}/opengraph-image`, site.url).toString(), width: 1200, height: 630, alt: `${post.title} | ${site.name}` };
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, type: "article", publishedTime: post.publishedAt, modifiedTime: post.updatedAt, images: [image] },
    twitter: { ...metadata.twitter, images: [image] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPublishedPost((await params).slug);
  if (!post) notFound();
  const published = await getPublishedPosts();
  const related = post.related?.length
    ? post.related.flatMap(slug => { const match = published.find(item => item.slug === slug && item.slug !== post.slug); return match ? [match] : []; })
    : published.filter(item => item.slug !== post.slug).slice(0, 2);
  const context = post.industry ? `?industry=${post.industry}` : "";
  const inquiryParams = new URLSearchParams();
  if (post.demo) inquiryParams.set("demo", post.demo);
  if (post.industry) inquiryParams.set("industry", post.industry);
  inquiryParams.set("post", post.slug);
  const canonical = new URL(`/blog/${post.slug}`, site.url).toString();
  const reviewedAt = post.sources.map(source => source.reviewedAt).sort().at(-1);
  const jsonLd = [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }]), {
    "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.description,
    datePublished: post.publishedAt, dateModified: post.updatedAt, inLanguage: "en-US", mainEntityOfPage: canonical, url: canonical,
    isPartOf: { "@type": "Blog", name: "The Catalyst Blog", url: new URL("/blog", site.url).toString() },
    author: { "@type": "Organization", name: site.name, url: site.url }, publisher: { "@type": "Organization", name: site.name, url: site.url },
    image: new URL(`/blog/${post.slug}/opengraph-image`, site.url).toString(),
  }];
  return <div className="insights-page catalyst-blog-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <header className="wrap page-intro insight-header"><Link className="breadcrumb" href="/blog">← The Catalyst Blog</Link><p className="overline">{post.category}</p><h1>{post.title}</h1><p className="intro-copy">{post.description}</p><p className="insight-byline">Published by Catalyst Innovations · <time dateTime={post.publishedAt}>{displayDate(post.publishedAt)}</time> · {blogReadingMinutes(post)} min read</p></header>
    <div className="wrap insight-layout">
      <aside className="insight-toc"><nav aria-label="On this page"><p className="overline">In this edition</p><ol role="list">{post.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.heading.replace(/^\d+\. /, "")}</a></li>)}</ol>{post.evidence.length > 0 && <a href="#facts-in-context">The facts in context ↓</a>}{post.tools.length > 0 && <a href="#try-your-numbers">Try your numbers ↓</a>}</nav></aside>
      <article className="insight-body">
        {post.cover && <figure className="insight-cover">
          {/* The published-content reader validates cover URLs before rendering. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover.url} alt={post.cover.alt} width={1600} height={900} loading="lazy" decoding="async" />
          {post.cover.caption && <figcaption>{post.cover.caption}</figcaption>}
        </figure>}
        <p className="insight-opening">{post.introduction}</p>
        <aside className="insight-takeaway"><p className="overline">The useful idea</p><p>{post.takeaway}</p></aside>
        {post.sections.map(section => <section id={section.id} key={section.id}><h2>{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}{section.checklist && <ul>{section.checklist.map(item => <li key={item}>{item}</li>)}</ul>}{section.source !== undefined && <p className="insight-reference">Source: <a href={post.sources[section.source].url} target="_blank" rel="noopener noreferrer">{post.sources[section.source].title} ↗</a></p>}</section>)}
        {post.evidence.length > 0 && <section className="blog-evidence" id="facts-in-context"><p className="overline">Evidence, with the context it needs</p><h2>The facts behind the idea.</h2>{post.evidence.map((item, index) => <div key={`${item.source}-${index}`}><p className="blog-evidence-claim">{item.claim}</p><p><strong>Context:</strong> {item.context}</p><p><strong>How it was measured:</strong> {item.methodology}</p>{item.dataDate && <p><strong>Data period:</strong> {item.dataDate}</p>}<a href={post.sources[item.source].url} target="_blank" rel="noopener noreferrer">{post.sources[item.source].title} ↗</a></div>)}</section>}
        <aside className="insight-example"><p className="overline">Illustrative example</p><h2>{post.example.title}</h2><p>{post.example.text}</p></aside>
        {post.tools.length > 0 && <section id="try-your-numbers"><h2>Put your own work in perspective.</h2><p>Try your own assumptions. Time, cost and opportunity are different measures; calculator results should not automatically be added together.</p><div className="insight-tools">{post.tools.map(slug => { const tool = getCalculator(slug)!; return <Link href={`/tools/${slug}${context}`} key={slug}><strong>{tool.title}</strong><span>{tool.description}</span><span className="text-link">Try the calculator ↗</span></Link>; })}</div></section>}
        <section className="insight-next"><p className="overline">A question for your business</p><h2>Where would a clearer process help?</h2><p>{post.nextStep}</p><div className="insight-actions"><Link className="button" href={`/consultation?${inquiryParams}`}>Discuss my business ↗</Link><Link className="text-link" href="/discovery">How discovery and a custom quote work ↗</Link>{post.solution && <Link className="text-link" href={`/solutions/${post.solution}`}>Explore the relevant solution ↗</Link>}{post.demo && <Link className="text-link" href={`/portfolio${context}#${post.demo}`}>See the actual demonstration ↗</Link>}</div></section>
        <ArticleShare kind="blog" slug={post.slug} title={post.title} url={canonical} />
        <footer className="insight-sources"><h2>Sources and editorial notes</h2><p>{reviewedAt && <>Latest source review: <time dateTime={reviewedAt}>{displayDate(reviewedAt)}</time>. </>}References support the attributed factual background. The interpretation and illustrative example are Catalyst’s editorial guidance, rather than measured results from a Catalyst customer.</p>{post.sources.length > 0 && <ul>{post.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} ↗</a><div className="blog-source-details">{source.publishedAt && <p>Published: <time dateTime={source.publishedAt}>{displayDate(source.publishedAt)}</time>.</p>}{source.context && <p><strong>Context:</strong> {source.context}</p>}{source.methodology && <p><strong>Methodology:</strong> {source.methodology}</p>}</div></li>)}</ul>}</footer>
      </article>
    </div>
    {related.length > 0 && <section className="wrap content-section insight-related"><p className="overline">Keep the conversation going</p><h2>Another perspective.</h2><div className="insights-grid">{related.map(item => <article key={item.slug} className="insight-card"><p className="overline">{item.category}</p><h3><Link href={`/blog/${item.slug}`}>{item.title}</Link></h3><p>{item.description}</p><Link className="text-link" href={`/blog/${item.slug}`}>Read the article ↗<span className="sr-only">: {item.title}</span></Link></article>)}</div></section>}
  </div>;
}
