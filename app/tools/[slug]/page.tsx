import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { calculators, getCalculator } from "@/lib/calculators";
import CalculatorForm from "@/components/CalculatorForm";
import { industryList } from "@/data/redesign";
import { calculatorContent } from "@/data/seoContent";
import { getInsight } from "@/data/insights";
import { services } from "@/data/services";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
export const generateStaticParams = () =>
  calculators.map((c) => ({ slug: c.slug }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const c = getCalculator((await params).slug);
  if (!c) notFound();
  return pageMetadata({ title: `${c.title} Calculator`, description: `${c.title} calculator. ${c.description} Use your own figures and review the assumptions.`, path: `/tools/${c.slug}` });
}
export default async function Tool({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ industry?: string }>;
}) {
  const c = getCalculator((await params).slug);
  if (!c) notFound();
  const industry = (await searchParams).industry;
  const valid = industryList.some((i) => i.slug === industry)
    ? industry
    : undefined;
  const content = calculatorContent[c.slug];
  const guide = getInsight(content.guide)!;
  const solution = services.find(service => service.slug === content.solution)!;
  const context = valid ? `?industry=${valid}` : "";
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Savings Tools", path: "/tools" }, { name: c.title, path: `/tools/${c.slug}` }])).replace(/</g, "\\u003c") }} />
      <section className="page-intro wrap">
        <Link className="breadcrumb" href="/tools">
          ← All calculators
        </Link>
        <p className="overline">{c.category}</p>
        <h1>{c.title}</h1>
        <p className="intro-copy">{content.introduction}</p>
      </section>
      <section className="wrap content-section">
        <p className="no-print" style={{ maxWidth: 850, marginBottom: 30 }}><strong>Before you enter your figures:</strong> {content.inputs}</p>
        <p className="print-only">
          Catalyst Innovations · Illustrative estimate · {c.title}
        </p>
        <CalculatorForm calculator={c} industry={valid} />
      </section>
      <section className="wrap content-section faq-section no-print"><div><p className="overline">Read the result carefully</p><h2>Useful questions.</h2></div><div><details><summary>{content.faq.question}<span aria-hidden="true">+</span></summary><p>{content.faq.answer}</p></details><details><summary>Does Catalyst receive the figures I enter?<span aria-hidden="true">+</span></summary><p>The calculation runs in your browser. You can choose to attach your figures to an inquiry, and that choice is not selected automatically. You can also print or save your result as a PDF.</p></details><details><summary>Is this a quote or a guaranteed result?<span aria-hidden="true">+</span></summary><p>No. The result follows your inputs and the displayed formula. A project needs its own scope, costs and evidence; the calculator does not promise a specific improvement.</p></details></div></section>
      <section className="wrap content-section two-grid no-print"><article className="content-card"><p className="overline">Put the numbers in context</p><h2>{guide.title}</h2><p>{guide.description}</p><Link className="text-link" href={`/insights/${guide.slug}`}>Read the guide ↗</Link></article><article className="content-card"><p className="overline">Explore the process</p><h2>{solution.title}</h2><p>A clearer workflow starts with the records, decisions and people behind these figures. Explore what Catalyst can help you connect.</p><Link className="text-link" href={`/solutions/${solution.slug}`}>Explore the solution ↗</Link></article></section>
      <section className="wrap content-section no-print"><p className="overline">Related tools</p><h2>Explore another part of the work.</h2><div className="three-grid">{guide.tools.filter(slug => slug !== c.slug).slice(0, 3).map(slug => { const related = getCalculator(slug)!; return <article className="tool-card" key={slug}><h3>{related.title}</h3><p>{related.description}</p><Link className="text-link" href={`/tools/${slug}${context}`}>Try the calculator ↗</Link></article>; })}</div></section>
    </>
  );
}
