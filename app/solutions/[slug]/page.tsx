import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";
import { notFound } from "next/navigation";
import { services } from "@/data/services";
import { DiscussCTA } from "@/components/SiteSections";
import StudioPhoto from "@/components/studio/StudioPhoto";
import WorkflowDiagram from "@/components/studio/WorkflowDiagram";
import { solutionVisuals } from "@/data/solutionVisuals";
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
  const visual = solutionVisuals[s.slug];
  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Solutions", path: "/solutions" }, { name: s.title, path: `/solutions/${s.slug}` }])).replace(/</g, "\\u003c") }} />
      <section className={`wrap ${styles.hero}`} aria-labelledby="solution-heading">
        <div className={styles.heroCopy}><Link className={styles.backLink} href="/solutions">Solutions <ArrowRight size={14} aria-hidden="true" /> {s.navLabel}</Link><p className="overline">What we build / {s.navLabel}</p><h1 id="solution-heading">{content.title}</h1><p className={styles.lead}>{content.summary}</p><Link className="button" href="/consultation">Discuss your process <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
        <div className={styles.heroPhoto}><StudioPhoto photoKey={visual.photoKey} priority sizes="(max-width: 760px) 92vw, 43vw" /><p className={styles.photoNote}>{visual.photoNote}</p></div>
      </section>
      <section className={`wrap ${styles.startSection}`}>
        <div className={styles.startCopy}>
          <p className="overline">The work before the software</p>
          <h2>Start with the work.</h2>
          <p>{content.introduction}</p>
          <p>
            Based in Knoxville, we work with businesses across East Tennessee
            and remotely worldwide. We define a useful first version together
            and agree how to evaluate it before expanding.
          </p>
          <Link className="text-link" href="/portfolio">See our actual software demonstrations <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className={styles.capabilities}>
          <p className="overline">What we can build</p>
          <ul>
            {s.capabilities.slice(0, 6).map((c, index) => (
              <li key={c}><span aria-hidden="true">0{index + 1}</span>{c}</li>
            ))}
          </ul>
          <p className={styles.scopeNote}>We scope these capabilities around your requirements and include the agreed work in a custom quote.</p>
          <p className="overline">Explore the work in your industry</p>
          <ul className={styles.industryLinks}>
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
      {content.demoEvidence && <section className={`wrap ${styles.evidence}`} aria-labelledby="software-evidence-heading">
        <p className="overline">Actual software demonstrations</p>
        <h2 id="software-evidence-heading">See custom software in practice.</h2>
        <p className={styles.introduction}>Explore two estimating workflows built by Catalyst. Each recording explains what is demonstrated and where the example stops.</p>
        <div className={styles.examples}>{content.demoEvidence.map(id => {
          const demo = demos.find(item => item.id === id)!;
          const page = getDemoPage(id)!;
          const screen = demo.steps[0];
          return <article key={id} className={styles.example}>
            <div className={styles.screen}>
              <span className={styles.screenLabel}>Actual application / sample information</span>
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
      <section className={`wrap ${styles.workflow}`}>
        <header className={styles.sectionHeader}><div><p className="overline">A clearer workflow</p><h2>What a connected process could look like.</h2></div><p>{content.example}</p></header>
        <WorkflowDiagram title={visual.workflowTitle} steps={visual.workflow} caption={visual.caption} />
      </section>
      <section className={`wrap ${styles.firstSteps}`}>
        <div><p className="overline">A focused first step</p><h2>Define the work before the build.</h2><ol>{content.firstSteps.map((step, index) => <li key={step}><span>0{index + 1}</span><p>{step}</p></li>)}</ol></div>
        <aside className={styles.guide}><BookOpen size={29} strokeWidth={1.3} aria-hidden="true" /><p className="overline">Practical guide / Read and prepare</p><h3>{guide.title}</h3><p>{guide.description}</p><Link className="text-link" href={`/insights/${guide.slug}`}>Read: {guide.title} ↗</Link></aside>
      </section>
      {content.costGuidance && <section className={`wrap ${styles.cost}`} aria-labelledby="software-cost-heading">
        <div><p className="overline">Plan the investment</p><h2 id="software-cost-heading">{content.costGuidance.question}</h2></div>
        <div><p>{content.costGuidance.answer}</p><Link className="text-link" href="/discovery">See discovery call details and the custom quote process <span aria-hidden="true">&rarr;</span></Link></div>
      </section>}
      <section className={`wrap ${styles.tools}`}>
        <p className="overline">Use your own figures</p><h2>Explore the potential value.</h2>
        <div className={styles.toolRows}>{content.tools.map((slug, index) => { const tool = getCalculator(slug)!; return <article key={slug}><span className={styles.index}>0{index + 1} / Savings tool</span><h3>{tool.title}</h3><p>{tool.description}</p><Link className="text-link" href={`/tools/${slug}`}>Try the calculator <ArrowUpRight size={17} aria-hidden="true" /></Link></article>; })}</div>
      </section>
      <section className="wrap content-section faq-section">
        <div><p className="overline">Before we begin</p><h2>Useful questions.</h2></div>
        <div>{content.faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div>
      </section>
      <DiscussCTA />
    </div>
  );
}
