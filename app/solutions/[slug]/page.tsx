import VisualStory from "@/components/VisualStory";
import { solutionStories } from "@/data/motionStories";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/data/services";
import { PageIntro, DiscussCTA } from "@/components/SiteSections";
import { solutionContent } from "@/data/seoContent";
import { demos } from "@/data/demos";
import { getDemoPage } from "@/data/demoPages";
import { getInsight } from "@/data/insights";
import { getCalculator } from "@/lib/calculators";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import styles from "./solution.module.css";
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
  const content = solutionContent[s.slug];
  return pageMetadata({ title: content.title, description: content.summary, path: `/solutions/${s.slug}` });
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
      <PageIntro eyebrow="What we build" title={content.title} text={content.summary} />
      <section className="wrap content-section two-grid">
        <div>
          <h2>Start with the work.</h2>
          <p>{content.introduction}</p>
          <p style={{ marginTop: 20 }}>
            Based in Knoxville, we work with businesses across East Tennessee
            and remotely worldwide. We define a useful first version together
            and agree how to evaluate it before expanding.
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
          <p className="overline" style={{ marginTop: 28 }}>Explore the work in your industry</p>
          <ul className="check-list">
            {content.industryLinks.map((industry) => (
              <li key={industry.slug}>
                <Link className="text-link" href={`/industries/${industry.slug}`}>
                  {industry.label} ↗
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      {content.demoEvidence && <section className="wrap content-section" aria-labelledby="software-evidence-heading">
        <p className="overline">Actual software demonstrations</p>
        <h2 id="software-evidence-heading">See custom software in practice.</h2>
        <p className={styles.introduction}>Explore two estimating workflows built by Catalyst. Each recording explains what is demonstrated and where the example stops.</p>
        <div className={styles.examples}>{content.demoEvidence.map(id => {
          const demo = demos.find(item => item.id === id)!;
          const page = getDemoPage(id)!;
          const screen = demo.steps[0];
          return <article key={id} className={styles.example}>
            <div className={styles.screen}>
              <Image src={screen.image} width={screen.width} height={screen.height} alt={screen.alt} sizes="(max-width: 700px) 88vw, (max-width: 1100px) 43vw, 520px" />
            </div>
            <div className={styles.copy}>
              <p className="overline">{demo.id === "painting" ? "Demonstration prototype" : demo.status}</p>
              <h3>{demo.displayName}</h3>
              <p>{demo.purpose}</p>
              <p className={styles.boundary}>{page.boundary}</p>
              <Link className="text-link" href={`/portfolio/${id}`}>Watch the {id} estimating software demo <span aria-hidden="true">&rarr;</span></Link>
            </div>
          </article>;
        })}</div>
      </section>}
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
        <aside className="content-card"><p className="overline">Practical guide</p><h2>{guide.title}</h2><p>{guide.description}</p><Link className="text-link" href={`/insights/${guide.slug}`}>Read: {guide.title} ↗</Link></aside>
      </section>
      {content.costGuidance && <section className={`wrap content-section two-grid ${styles.cost}`} aria-labelledby="software-cost-heading">
        <div><p className="overline">Plan the investment</p><h2 id="software-cost-heading">{content.costGuidance.question}</h2></div>
        <div><p>{content.costGuidance.answer}</p><Link className="text-link" href="/pricing">View custom software implementation and monthly pricing <span aria-hidden="true">&rarr;</span></Link></div>
      </section>}
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
