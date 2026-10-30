import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import ProblemFinder from "@/components/ProblemFinder";
import { services } from "@/data/services";
import { solutionContent } from "@/data/seoContent";
import { DiscussCTA } from "@/components/SiteSections";
import StudioPhoto from "@/components/studio/StudioPhoto";
import WorkflowDiagram from "@/components/studio/WorkflowDiagram";
import { solutionVisuals } from "@/data/solutionVisuals";
import styles from "./[slug]/solution.module.css";
export const metadata = pageMetadata({
  path: "/solutions",
  title: "Custom Software, Connected Operations & Automation",
  description:
    "Custom software and workflow automation from Knoxville, Tennessee. Connect customer records, jobs, inventory, purchasing and reporting around your business.",
});
export default function Solutions() {
  const areas = [
    { title: "Win and manage work", text: "Customer records, quotes and follow-up. Often called customer relationship management (CRM).", slugs: ["custom-software"] },
    { title: "Keep operations moving", text: "Jobs, inventory and purchasing. Business operations systems (ERP) and warehouse management systems (WMS), shaped around your team.", slugs: ["procurement", "manufacturing-operations", "supply-chain"] },
    { title: "Understand and connect your numbers", text: "Reporting, automation and connected systems that make information easier to use.", slugs: ["ai-automation", "process-automation", "data-intelligence", "integrations-consulting"] },
  ];
  return (
    <div className={styles.page}>
      <section className={`wrap ${styles.hero}`} aria-labelledby="solutions-heading">
        <div className={styles.heroCopy}><p className="overline">Solutions / A useful starting point</p><h1 id="solutions-heading">Start with the work you want to make <span>easier.</span></h1><p className={styles.lead}>Manage customers. Keep operations moving. Understand your numbers. From Knoxville, Tennessee, we build software around the way your team works.</p><a className="text-link" href="#find-your-start">Find your starting point <ArrowDown size={17} aria-hidden="true" /></a></div>
        <div className={styles.heroPhoto}><StudioPhoto photoKey="planning" priority sizes="(max-width: 760px) 92vw, 43vw" /><p className={styles.photoNote}>The process comes first.<br /><strong>The software follows.</strong></p></div>
      </section>
      <section id="find-your-start" className={`wrap ${styles.finder}`}>
        <ProblemFinder />
      </section>
      <section className={`wrap ${styles.directory}`} aria-labelledby="solution-areas-heading">
        <header className={styles.sectionHeader}><div><p className="overline">Explore in more detail</p><h2 id="solution-areas-heading">Three ways to move forward.</h2></div><p>Choose the part of your business that needs a clearer process. We can connect the pieces around the tools you already use.</p></header>
        {areas.map((area, index) => <section className={styles.directoryArea} key={area.title} aria-labelledby={`solution-area-${index}`}>
          <div className={styles.areaIntro}><span className={styles.index}>0{index + 1}</span><h3 id={`solution-area-${index}`}>{area.title}</h3><p>{area.text}</p></div>
          <div className={styles.directoryLinks}>{area.slugs.map(slug => {
            const service = services.find(item => item.slug === slug)!;
            return <Link href={`/solutions/${service.slug}`} key={service.slug}><div><h4>{solutionContent[service.slug].title}</h4><p>{solutionContent[service.slug].summary}</p></div><ArrowUpRight size={22} aria-hidden="true" /></Link>;
          })}</div>
        </section>)}
      </section>
      <section className={`wrap ${styles.workflow}`}>
        <header className={styles.sectionHeader}><div><p className="overline">One request. Every step connected.</p><h2>The next person gets the details they need.</h2></div><p>Useful software connects responsibilities as well as records. Define the approval, the handoff and the exception before adding another screen.</p></header>
        <WorkflowDiagram title={solutionVisuals["custom-software"].workflowTitle} steps={solutionVisuals["custom-software"].workflow} caption={solutionVisuals["custom-software"].caption} />
      </section>
      <DiscussCTA />
    </div>
  );
}
