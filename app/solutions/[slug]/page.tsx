import VisualStory from "@/components/VisualStory";
import { solutionStories } from "@/data/motionStories";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/data/services";
import { PageIntro, DiscussCTA } from "@/components/SiteSections";
import { solutionContent } from "@/data/seoContent";
import { getInsight } from "@/data/insights";
import { getCalculator } from "@/lib/calculators";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
export const generateStaticParams = () =>
  services.map((s) => ({ slug: s.slug }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();
  return pageMetadata({ title: s.title, description: solutionContent[s.slug].summary, path: `/solutions/${s.slug}` });
}
export default async function Solution({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();
  const content = solutionContent[s.slug];
  const guide = getInsight(content.guide)!;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Solutions", path: "/solutions" }, { name: s.title, path: `/solutions/${s.slug}` }])).replace(/</g, "\\u003c") }} />
      <PageIntro eyebrow="What we build" title={s.title} text={content.summary} />
      <section className="wrap content-section two-grid">
        <div>
          <h2>Start with the work.</h2>
          <p>{content.introduction}</p>
          <p style={{ marginTop: 20 }}>
            Based in Knoxville, Tennessee, we work with you to define a useful
            first version and the evidence needed to evaluate it.
          </p>
          <Link className="text-link" href="/consultation">
            Discuss your process ↗
          </Link>
          <p style={{ marginTop: 20 }}><Link className="text-link" href="/portfolio">See our actual software demonstrations ↗</Link></p>
        </div>
        <div className="content-card">
          <p className="overline">What we can build</p>
          <ul className="check-list">
            {s.capabilities.slice(0, 6).map((c) => (
              <li key={c}>— {c}</li>
            ))}
          </ul>
          <p style={{ marginTop: 20 }}>These are capabilities we can scope around your requirements, not a claim that every feature is included in one package.</p>
        </div>
      </section>
      <section className="wrap content-section">
        <p className="overline">A clearer workflow</p>
        <h2>What a connected process could look like.</h2>
        <p style={{ marginBottom: 28 }}>{content.example}</p>
        <VisualStory
          kind="desk"
          context={s.navLabel}
          workflow={solutionStories[s.slug].steps.map((step) => step.label)}
        />
      </section>
      <section className="wrap content-section two-grid">
        <div><p className="overline">A focused first step</p><h2>Define the work before the build.</h2><ol className="check-list">{content.firstSteps.map((step, index) => <li key={step}>{index + 1}. {step}</li>)}</ol></div>
        <aside className="content-card"><p className="overline">Practical guide</p><h2>{guide.title}</h2><p>{guide.description}</p><Link className="text-link" href={`/insights/${guide.slug}`}>Read the guide ↗</Link></aside>
      </section>
      <section className="wrap content-section">
        <p className="overline">Use your own figures</p><h2>Explore the potential value.</h2>
        <div className="three-grid">{content.tools.map(slug => { const tool = getCalculator(slug)!; return <article className="tool-card" key={slug}><h3>{tool.title}</h3><p>{tool.description}</p><Link className="text-link" href={`/tools/${slug}`}>Try the calculator ↗</Link></article>; })}</div>
      </section>
      <section className="wrap content-section faq-section">
        <div><p className="overline">Before we begin</p><h2>Useful questions.</h2></div>
        <div>{content.faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div>
      </section>
      <DiscussCTA />
    </>
  );
}
