import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, FileText, PackageCheck, UsersRound, Wrench } from "lucide-react";
import CatalystEngineHero from "@/components/CatalystEngineHero";
import { LogoLockup } from "@/components/Logo";
import { Projects, DiscussCTA } from "@/components/SiteSections";
import IndustrySelector from "@/components/IndustrySelector";
import FounderIntro from "@/components/FounderIntro";
import SavingsPreview from "@/components/SavingsPreview";
import ChamberMembership from "@/components/ChamberMembership";
import BlogHighlights from "@/components/BlogHighlights";
import { catalystProcess } from "@/data/catalystProcess";
import { studioPhotos } from "@/data/studioMedia";
import styles from "./HomeStudio.module.css";

const connections = [
  { title: "Customer details", text: "Capture the request once.", Icon: UsersRound },
  { title: "Approved quote", text: "Agree the work before it moves.", Icon: Check },
  { title: "Job & materials", text: "Coordinate the people and supplies.", Icon: PackageCheck },
  { title: "Completed work", text: "Record what was actually done.", Icon: Wrench },
  { title: "Invoice preparation", text: "Carry the details into the numbers.", Icon: FileText },
];
const buildAreas = [
  { number: "01", title: "Customers & sales", text: "Customer records, quotes and follow-up that keep the next conversation connected to the last.", detail: "CRM · Customer relationship management", href: "/solutions/custom-software" },
  { number: "02", title: "The everyday operation", text: "Jobs, materials, purchasing and warehouse workflows that give the office and the team the same picture.", detail: "ERP · Business operations / WMS · Warehouse management", href: "/solutions/procurement" },
  { number: "03", title: "Your numbers & next steps", text: "Connected accounting handoffs, reporting and practical automation around the tools you already use.", detail: "Integrations · Reporting · Automation", href: "/solutions/data-intelligence" },
];

export default function HomeStudio() {
  const planning = studioPhotos.planning;
  return <div className={styles.home}>
    <section className={`wrap ${styles.hero}`} aria-labelledby="home-heading">
      <div className={styles.heroCopy}>
        <div className={styles.brand}><LogoLockup variant="light-bg" hero /></div>
        <p className="overline">Custom business software & automation</p>
        <h1 id="home-heading">Custom software.<br />A better-running <span>business.</span></h1>
        <p className={styles.description}>Connect your customers, jobs, inventory, and accounting—with software built around the way you work.</p>
        <div className={styles.actions}>
          <Link className="button" href="/consultation">Discuss my business <ArrowUpRight size={18} aria-hidden="true" /></Link>
          <Link className="text-link" href="/portfolio">See the actual software <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
        <p className={styles.discovery}>{catalystProcess.discoveryInvitation}</p>
      </div>
      <div className={styles.film}><CatalystEngineHero /></div>
    </section>
    <div className={`wrap ${styles.introduction}`}>
      <p><span className={styles.locationDot} aria-hidden="true" />Knoxville, Tennessee <span className={styles.locationDetail}>· Working with businesses everywhere</span></p>
      <a href="#catalyst-process">Meet the way we work <ArrowDown size={15} aria-hidden="true" /></a>
    </div>
    <section className={`wrap ${styles.process}`} id="catalyst-process" aria-labelledby="catalyst-process-heading">
      <header className={styles.sectionHeader}>
        <div><p className="overline">Built alongside your team</p><h2 id="catalyst-process-heading">The Catalyst Process</h2></div>
        <p>{catalystProcess.introduction}</p>
      </header>
      <div className={styles.processBody}>
        <figure className={styles.planningPhoto}>
          <Image src={planning.src} width={planning.width} height={planning.height} alt={planning.alt} sizes="(max-width: 760px) 92vw, 35vw" />
          <figcaption><span>{planning.label}</span><a href={planning.sourceUrl} target="_blank" rel="noopener noreferrer">{planning.credit}<span className="sr-only"> (opens in a new tab)</span> <span aria-hidden="true">↗</span></a></figcaption>
          <p className={styles.photoNote}>The people doing the work<br /><strong>help shape the system.</strong></p>
        </figure>
        <ol className={styles.steps} role="list">
          {catalystProcess.steps.map(step => <li key={step.id}><span className={styles.stepNumber} aria-hidden="true">{step.number}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}
        </ol>
      </div>
      <div className={styles.processFooter}>
        <div className={styles.actions}><Link className="text-link" href="/consultation">Discuss my business <ArrowUpRight size={17} aria-hidden="true" /></Link><Link className="text-link" href="/services">Explore our services <ArrowRight size={17} aria-hidden="true" /></Link></div>
        <p>{catalystProcess.proposalNote}</p>
      </div>
    </section>
    <section className={styles.connection} id="how-it-works" aria-labelledby="connected-heading">
      <div className="wrap">
        <header className={styles.connectionHeading}><div><p className="overline">A practical example</p><h2 id="connected-heading">One request.<br />Every handoff connected.</h2></div><p>Your team should be doing the work, not chasing the same details from one place to the next.</p></header>
        <ol className={styles.connectionSteps} role="list">{connections.map(({ title, text, Icon }, index) => <li key={title}><span className={styles.connectionNode}><Icon size={23} strokeWidth={1.5} aria-hidden="true" /></span><span className={styles.connectionIndex}>0{index + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
        <p className={styles.diagramNote}>Illustrative workflow. The steps, approvals and connections are agreed around your business.</p>
      </div>
    </section>
    <section className={`wrap ${styles.build}`} aria-labelledby="build-heading">
      <div className={styles.buildIntro}><p className="overline">What we build</p><h2 id="build-heading">Software for<br />the work in front of you.</h2><p>Start with one frustrating process or connect the whole operation. We build around what your team actually needs.</p><Link className="text-link" href="/services">See all our services <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
      <div className={styles.buildList}>{buildAreas.map(area => <article key={area.number}><span className={styles.areaNumber} aria-hidden="true">{area.number}</span><div><h3><Link href={area.href}>{area.title}<ArrowUpRight size={21} aria-hidden="true" /></Link></h3><p>{area.text}</p><small>{area.detail}</small></div></article>)}</div>
    </section>
    <section className={styles.proof} aria-labelledby="software-heading"><div className="wrap">
      <header className={styles.sectionHeader}><div><p className="overline">Built by Catalyst</p><h2 id="software-heading">Take a closer look<br />at the actual software.</h2></div><div><p>Follow a resident request, prepare a flooring estimate or explore a painting prototype. Real screens. Clearly labeled sample information.</p><Link className="text-link" href="/services#service-menu">Explore our services <ArrowUpRight size={17} aria-hidden="true" /></Link></div></header>
      <Projects />
    </div></section>
    <section className={`wrap ${styles.industries}`} aria-labelledby="industries-heading"><header className={styles.sectionHeader}><div><p className="overline">Your kind of work</p><h2 id="industries-heading">Different businesses.<br />Familiar challenges.</h2></div><p>Pick your industry to see common problems, practical improvements and a useful starting point.</p></header><IndustrySelector /></section>
    <section className={`wrap ${styles.savings}`} aria-label="Explore potential time savings"><SavingsPreview /></section>
    <div className={styles.founders}><FounderIntro /></div>
    <div className={styles.chamber}><ChamberMembership /></div>
    <BlogHighlights />
    <section className={`wrap ${styles.faq}`} aria-labelledby="home-faq-heading"><div><p className="overline">Before we talk</p><h2 id="home-faq-heading">Good questions.<br />Straight answers.</h2></div><div>{[
      ["Do we need to replace all our software?", "Not necessarily. We can connect useful existing tools, build a missing piece, or develop a more complete system. We start with your needs."],
      ["Can you work with our industry?", "We work across a range of businesses and organizations. If your team has repetitive tasks, scattered information or disconnected tools, there may be a useful place to start."],
      ["How do we get started?", "Tell us about one process you want to improve. A 45-minute discovery call lets us hear from your team, follow a real example and outline practical opportunities before agreeing what to build."],
      ["Are the calculator results guaranteed?", "No. They are estimates based on the numbers and assumptions you enter. Time returned, potential revenue and cash savings are shown separately."],
    ].map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>
    <DiscussCTA />
  </div>;
}
