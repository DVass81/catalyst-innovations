import Image from "next/image";
import Link from "next/link";
import type { Industry } from "@/data/redesign";
import type { IndustryContent } from "@/data/seoContent";
import { studioPhotos } from "@/data/studioMedia";
import { getInsight } from "@/data/insights";
import { getCalculator } from "@/lib/calculators";
import { breadcrumbSchema } from "@/lib/seo";
import styles from "./IndustryPilot.module.css";

const productionFlow = [
  { title: "Order", detail: "Agree on the work and its requirements.", record: "Work order" },
  { title: "Materials", detail: "Check what is available before work starts.", record: "Stock + requirements" },
  { title: "Production", detail: "Record the operation and quantities completed.", record: "Shop-floor update" },
  { title: "Quality review", detail: "Keep required checks and release decisions visible.", record: "Review record" },
  { title: "Completion", detail: "Confirm release and prepare the dispatch handoff.", record: "Completion record" },
] as const;

/** A server-rendered manufacturing pilot. Other industries retain their existing pages. */
export default function IndustryPilot({ industry, content }: { industry: Industry; content: IndustryContent }) {
  const photo = studioPhotos.manufacturing;
  const guide = getInsight(content.guide)!;
  const inquiry = `/consultation?industry=${industry.slug}`;
  return <div className={styles.page}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }, { name: industry.name, path: `/industries/${industry.slug}` }])).replace(/</g, "\\u003c") }} />
    <header className={`wrap ${styles.introduction}`}>
      <Link className={styles.back} href="/industries">← All industries</Link>
      <div className={styles.titleRow}><div><p className={styles.eyebrow}>Custom software for the work behind your product</p><h1>{industry.name}{" "}<span>A clearer view of the floor.</span></h1></div><div className={styles.introAside}><p>{content.introduction}</p><Link className="text-link" href={inquiry}>Talk about your operation ↗</Link></div></div>
    </header>

    <section className={`wrap ${styles.workplace}`} aria-labelledby="manufacturing-friction-heading">
      <div className={styles.problems}><p className={styles.eyebrow}>When the plan meets the floor</p><h2 id="manufacturing-friction-heading">Less chasing.<br />{" "}A more useful update.</h2><ul role="list">{industry.problems.map((problem, index) => <li key={problem}><span className={styles.problemNumber} aria-hidden="true">0{index + 1}</span><div><p className={styles.problemLabel}>Common problem</p><h3>{problem}</h3><p className={styles.helpLabel}>How Catalyst can help</p><p>{industry.solutions[index]}</p></div></li>)}</ul></div>
      <div className={styles.photoColumn}><figure className={styles.photography}><div className={styles.photoFrame}><Image src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} sizes="(max-width: 900px) calc(100vw - 40px), (min-width: 1280px) 550px, 44vw" loading="eager" fetchPriority="high" /></div><figcaption><span>Representative industry photography</span><span><a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer">{photo.credit} <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a><a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer">License <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></span></figcaption></figure><div className={styles.workshopNote}><span className={styles.noteMark} aria-hidden="true">↳</span><p>Good software starts here:<br /><strong>with the people doing the work.</strong></p><span className={styles.noteRule} aria-hidden="true" /></div></div>
    </section>

    <section className={styles.processSection} aria-labelledby="manufacturing-workflow-heading"><div className="wrap"><div className={styles.processHeading}><div><p className={styles.eyebrow}>One work order. A shared thread.</p><h2 id="manufacturing-workflow-heading">Give every handoff<br />a clear next step.</h2></div><p>An order should keep its requirements, material checks, updates and review decisions together. The exceptions need a place in the process, too.</p></div>
      <figure className={styles.flowFigure} aria-labelledby="manufacturing-flow-caption"><ol className={styles.flow} role="list">{productionFlow.map((step, index) => <li className={styles.flowStep} key={step.title}><div className={styles.flowStepHeader}><span aria-hidden="true">0{index + 1}</span><h3>{step.title}</h3>{index < productionFlow.length - 1 && <span className={styles.nextArrow} aria-hidden="true">→</span>}</div><p>{step.detail}</p><span className={styles.record}>{step.record}</span>{index === 1 && <div className={styles.holdBranch}><span className={styles.branchConnector} aria-hidden="true" /><p className={styles.branchLabel}>If material is short</p><h4>Hold the work. Name the owner.</h4><p>Keep the shortage against the order. The responsible person confirms the receipt before materials are checked again.</p><span className={styles.returnLabel}><span aria-hidden="true">↰ </span>Recheck availability before production</span></div>}</li>)}</ol><figcaption id="manufacturing-flow-caption"><strong>Illustrative workflow.</strong> Production follows the material check; completion follows the required quality review. This diagram describes a possible system, not a delivered Catalyst manufacturing product.</figcaption></figure>
      <div className={styles.diagramSource}><span>Process reference</span><a href="https://www.nist.gov/mep/value-stream-mapping" target="_blank" rel="noopener noreferrer">NIST MEP · Value stream mapping <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></div>
    </div></section>

    <section className={`wrap ${styles.startSection}`} aria-labelledby="manufacturing-start-heading"><div className={styles.startCopy}><p className={styles.eyebrow}>A practical starting point</p><h2 id="manufacturing-start-heading">Start on the floor,<br />with one real order.</h2><p>{content.firstStep}</p><p>We begin with the people making the decisions, the tools already in use and the exceptions they handle. Together, we define what the system needs to make clearer.</p><Link className="text-link" href={`/solutions/${content.solution}`}>Explore manufacturing operations software ↗</Link></div><div className={styles.records}><p className={styles.eyebrow}>Information worth connecting</p><ul role="list">{content.records.map(record => <li key={record}><span aria-hidden="true">↗</span>{record}</li>)}</ul><p>These are records to discuss during discovery. The scope and supported integrations are agreed around your operation.</p><div className={styles.existingTools}><h3>{content.faq.question}</h3><p>{content.faq.answer}</p></div></div></section>

    <section className={`wrap ${styles.resources}`} aria-labelledby="manufacturing-tools-heading"><div className={styles.resourceHeading}><p className={styles.eyebrow}>Put your own experience into numbers</p><h2 id="manufacturing-tools-heading">Measure the work<br />you want to improve.</h2><p>Use your own assumptions. These tools estimate the entered time or cost; they do not predict what software will save.</p></div><div className={styles.toolList}>{industry.tools.map((slug, index) => { const tool = getCalculator(slug)!; return <Link key={slug} href={`/tools/${slug}?industry=${industry.slug}`}><span className={styles.toolNumber}>0{index + 1}</span><div><h3>{tool.title}</h3><p>{tool.description}</p></div><span className={styles.toolArrow} aria-hidden="true">↗</span></Link>; })}</div></section>

    <section className={`wrap ${styles.reading}`} aria-labelledby="manufacturing-guide-heading"><div><p className={styles.eyebrow}>Take the conversation a little further</p><h2 id="manufacturing-guide-heading">{guide.title}</h2><p>{guide.description}</p><Link className="text-link" href={`/insights/${guide.slug}`}>Read the practical guide ↗</Link></div><aside><p className={styles.eyebrow}>See an actual application</p><p>Our flooring estimator shows quantities feeding cost decisions. It illustrates a transferable pattern, rather than a manufacturing product.</p><Link className="text-link" href={`/portfolio?industry=${industry.slug}#flooring`}>Explore the estimating demonstration ↗</Link></aside></section>

    <section className={styles.invitation}><div className="wrap"><p className={styles.eyebrow}>Your floor. Your people. Your process.</p><h2>Bring us the work<br />that is hard to see.</h2><p>Start with the handoff your team keeps chasing. We’ll talk through what happens now and what a better system needs to support.</p><Link className="button" href={inquiry}>Discuss manufacturing workflows ↗</Link></div></section>
  </div>;
}
