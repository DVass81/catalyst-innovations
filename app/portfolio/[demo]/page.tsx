import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import DemoWatchPlayer from "@/components/DemoWatchPlayer";
import { demos } from "@/data/demos";
import { demoPages, demoDuration, getDemoPage } from "@/data/demoPages";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import styles from "./watch.module.css";

type Props = { params: Promise<{ demo: string }> };

export const generateStaticParams = () => demoPages.map(page => ({ demo: page.id }));
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getDemoPage((await params).demo);
  if (!page) notFound();
  return pageMetadata({ title: page.title, description: page.description, path: `/portfolio/${page.id}` });
}

export default async function DemoWatchPage({ params }: Props) {
  const id = (await params).demo;
  const demo = demos.find(item => item.id === id);
  const page = getDemoPage(id);
  if (!page || !demo?.walkthrough) notFound();
  const inquiry = `/consultation?demo=${demo.id}&industry=${demo.industry}`;
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Software demonstrations", path: "/portfolio" },
    { name: demo.displayName, path: `/portfolio/${demo.id}` },
  ]);

  return <div className={styles.page}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }} />
    <header className={`wrap ${styles.header}`}>
      <nav aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true"> / </span><Link href="/portfolio">Software demos</Link><span aria-hidden="true"> / </span><span aria-current="page">{demo.displayName}</span></nav>
      <p className="overline">Actual software / {demo.displayName}</p>
      <h1>{page.heading}</h1>
      <p className={styles.description}>{page.description}</p>
    </header>

    <section className={`wrap ${styles.watch}`} aria-label={`${demo.displayName} video and capabilities`}>
      <div className={styles.player}>
        <DemoWatchPlayer key={demo.id} demoId={demo.id} displayName={demo.displayName} walkthrough={demo.walkthrough} className={styles.video} />
        <p className={styles.recordingNote}>{demoDuration(demo.walkthrough.durationSeconds)} · Actual application with sample information · Synthetic narration</p>
      </div>
      <aside className={styles.overview} aria-labelledby="demo-capabilities-heading">
        <p className={styles.status}>{demo.id === "painting" ? "Planned system · Demonstration prototype" : demo.status}</p>
        <h2 id="demo-capabilities-heading">What you’ll see</h2>
        <ul>{demo.capabilities.map(capability => <li key={capability}>{capability}</li>)}</ul>
        <Link className="button" href={inquiry}>Discuss a system like this ↗</Link>
        {demo.availability === "public-sample" && demo.publicUrl && <a className="text-link" href={demo.publicUrl} target="_blank" rel="noopener noreferrer">Explore the public sample ↗</a>}
      </aside>
    </section>

    <section className={`wrap ${styles.context}`} aria-labelledby="who-this-helps">
      <div><p className="overline">A practical starting point</p><h2 id="who-this-helps">A closer look at the workflow.</h2><p>{page.audience}</p></div>
      <aside className={styles.boundary}><h3>About this demonstration</h3><p>{page.boundary}</p></aside>
    </section>

    <section className={`wrap ${styles.workflow}`} aria-labelledby="workflow-heading">
      <h2 id="workflow-heading">Follow the steps at your own pace.</h2>
      <div className={styles.steps}>{demo.steps.map((step, index) => <article key={step.title}>
        <div className={styles.stepHeading}><span aria-hidden="true">0{index + 1}</span><h3>{step.title}</h3></div>
        <p>{step.text}</p>
        <a className={styles.screen} href={step.image} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size screen: ${step.title}`}>
          <Image src={step.image} width={step.width} height={step.height} alt={step.alt} sizes="(max-width: 700px) 88vw, (max-width: 1000px) 43vw, 350px" />
        </a>
        <a className="text-link" href={step.image} target="_blank" rel="noopener noreferrer">Open full-size screen ↗<span className="sr-only">: {step.title}</span></a>
      </article>)}</div>
    </section>

    <div className={`wrap ${styles.reading}`}>
      <section id="transcript" className={styles.transcript} aria-labelledby="transcript-heading">
        <p className="overline">Read the walkthrough</p><h2 id="transcript-heading">Full video transcript</h2>
        {demo.walkthrough.transcript.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </section>
      <section className={styles.questions} aria-labelledby="questions-heading"><h2 id="questions-heading">Useful questions</h2>{page.questions.map(item => <div key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}</section>
    </div>

    <section className={`wrap ${styles.related}`} aria-labelledby="related-heading">
      <p className="overline">Understand the process</p><h2 id="related-heading">Connect this example to your business.</h2>
      <div className={styles.links}>{page.related.map(link => <Link key={link.href} href={link.href}><h3>{link.label}</h3><p>{link.description}</p><span aria-hidden="true">Explore ↗</span></Link>)}</div>
      <div className={styles.tools}><div><h3>Work through your own assumptions.</h3><p>These calculators use your inputs. Their estimates are not results achieved by the demonstration.</p></div><ul>{page.tools.map(tool => <li key={tool.href}><Link className="text-link" href={tool.href}>{tool.label} ↗</Link><p>{tool.description}</p></li>)}</ul></div>
    </section>

    <section className={`wrap ${styles.next}`} aria-labelledby="next-heading"><div><p className="overline">Built around the way you work</p><h2 id="next-heading">What would a clearer process look like for your team?</h2><p>{page.nextStep}</p></div><Link className="button button-light" href={inquiry}>Discuss my business ↗</Link></section>

    <nav className={`wrap ${styles.more}`} aria-label="Other software demonstrations"><Link className="text-link" href="/portfolio">← All demonstrations</Link><div>{demos.filter(item => item.id !== demo.id && item.walkthrough).map(item => <Link className="text-link" key={item.id} href={`/portfolio/${item.id}`}>{item.displayName} ↗</Link>)}</div></nav>
  </div>;
}
