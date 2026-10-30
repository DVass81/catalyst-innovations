import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Clock3, Compass, FileCheck2, MessagesSquare } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { discoveryOffer } from "@/data/catalystProcess";
import { discoveryFaqs, discoveryFeeLabel } from "@/data/discovery";
import CatalystProcess from "@/components/CatalystProcess";
import { Reveal } from "@/components/Reveal";
import styles from "./Discovery.module.css";

export const metadata = pageMetadata({
  path: "/discovery",
  title: "Discovery Call & Custom Software Quotes",
  description: `Start with a ${discoveryOffer.durationMinutes}-minute, ${discoveryFeeLabel} discovery call. Get a software quote based on your needs. Choose Catalyst to build it and the discovery fee goes toward implementation.`,
});

const outcomes = [
  { number: "01", Icon: MessagesSquare, title: "Your work, understood.", text: "Walk us through a real task: who handles it, where information lives and what makes it harder than it needs to be." },
  { number: "02", Icon: Compass, title: "A practical direction.", text: "Receive a one-page summary of improvement opportunities. We consider the tools that already work and the gaps a custom system could fill." },
  { number: "03", Icon: FileCheck2, title: "A quote for your business.", text: "We shape a proposal around discovery and your needs, defining the system, implementation, training and ongoing support before you choose to build." },
];

export default function DiscoveryPage() {
  return <div className="studio-page studio-discovery">
    <section className={`wrap ${styles.hero}`} aria-labelledby="discovery-title">
      <div className={styles.intro}>
        <p className="overline">Discovery / Built around your business</p>
        <h1 id="discovery-title">A better system<br />starts with<br /><em>understanding you.</em></h1>
        <p className={styles.lead}>Every business works differently. Your software—and your quote—should reflect that.</p>
        <p>We start by learning how your team works, where things slow down and what you want to improve. Then we agree on a system and a custom quote based on your needs.</p>
        <ol className={styles.path} aria-label="How we start">
          <li>Discover <ArrowRight size={16} aria-hidden="true" /></li>
          <li>Define <ArrowRight size={16} aria-hidden="true" /></li>
          <li>Build together</li>
        </ol>
      </div>
      <aside className={styles.offer} aria-labelledby="discovery-offer-heading">
        <div className={styles.offerTop}><span className={styles.pill}><Clock3 size={15} aria-hidden="true" />{discoveryOffer.durationMinutes} minutes</span><span>With Catalyst</span></div>
        <h2 id="discovery-offer-heading">The discovery call</h2>
        <p className={styles.price}>{discoveryFeeLabel}<span>One-time discovery fee</span></p>
        <p>A focused conversation about the work you want to improve, followed by practical recommendations.</p>
        <div className={styles.credit}>
          <span className={styles.creditIcon}><Check size={18} aria-hidden="true" /></span>
          <div><h3>Applied to your implementation.</h3><p>If you choose Catalyst to build your software, your {discoveryFeeLabel} discovery fee is credited toward implementation fees.</p></div>
        </div>
        <Link className={`button button-light ${styles.offerButton}`} href="/consultation">Set up a discovery <ArrowUpRight size={18} aria-hidden="true" /></Link>
        <p className={styles.offerNote}>Tell us a little about your business so we can arrange your discovery call.</p>
      </aside>
    </section>

    <section className={styles.outcomesSection} aria-labelledby="discovery-outcomes-heading">
      <div className="wrap">
        <div className={styles.sectionHeading}><p className="overline">Clarity before commitment</p><h2 id="discovery-outcomes-heading">Know what to build.<br /><em>Know why it matters.</em></h2><p>Discovery turns “we need better software” into a useful conversation about the right next step.</p></div>
        <div className={styles.outcomes}>{outcomes.map(({ number, Icon, title, text }) => <Reveal key={number} className={styles.outcome}>
          <div className={styles.outcomeTop}><span>{number}</span><Icon size={26} strokeWidth={1.5} aria-hidden="true" /></div><h3>{title}</h3><p>{text}</p>
        </Reveal>)}</div>
        <div className={styles.quoteNote}><FileCheck2 size={22} aria-hidden="true" /><p><strong>A scope you can review. A decision you control.</strong> Implementation and ongoing support are quoted for your project. Your written proposal confirms the included work, costs, responsibilities and delivery arrangements before the build begins.</p></div>
      </div>
    </section>

    <CatalystProcess />

    <section className={`wrap section faq-section ${styles.faq}`} aria-labelledby="discovery-faq-heading">
      <div><p className="overline">Discovery, explained</p><h2 id="discovery-faq-heading">Good questions.<br /><em>Clear answers.</em></h2></div>
      <div>{discoveryFaqs.map(({ question, answer }) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
    </section>

    <section className={styles.closing} aria-labelledby="discovery-next-heading"><div className="wrap"><p className="overline">Bring us the process that needs to work better</p><h2 id="discovery-next-heading">Let’s find your<br /><em>best next step.</em></h2><p>You know your business. We’ll help turn that understanding into software built around it.</p><Link className="button" href="/consultation">Set up a discovery <ArrowUpRight size={18} aria-hidden="true" /></Link><Link className="text-link" href="/services">Explore what we build <ArrowRight size={16} aria-hidden="true" /></Link></div></section>
  </div>;
}
