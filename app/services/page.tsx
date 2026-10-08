import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Blocks, ChartNoAxesCombined,
  Factory, GitBranch, Globe2, HeartHandshake, PackageCheck,
  PlugZap, Sparkles, Truck, UsersRound,
} from "lucide-react";
import { serviceMenu, serviceDemoLabels } from "@/data/serviceMenu";
import { demos, type Demo } from "@/data/demos";
import { DiscussCTA } from "@/components/SiteSections";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import styles from "./services.module.css";

export const metadata = pageMetadata({
  path: "/services",
  title: "Website Design, Fundraising & Custom Software Services",
  description: "Explore Catalyst Innovations services: website design, Elevate fundraising, custom business software, automation, inventory, reporting, and integrations. Based in Knoxville, Tennessee.",
});

const capabilityIcons = {
  "ai-automation": Sparkles,
  procurement: PackageCheck,
  "manufacturing-operations": Factory,
  "supply-chain": Truck,
  "process-automation": GitBranch,
  "data-intelligence": ChartNoAxesCombined,
  "integrations-consulting": PlugZap,
};

/** Local preview URLs are never included in a production build or public definitions. */
function demoDestination(demo: Demo) {
  if (demo.publicUrl) return { href: demo.publicUrl, external: true, live: true };
  if (process.env.NODE_ENV === "development") {
    const preview = demo.id === "flooring"
      ? process.env.CATALYST_FLOORING_DEMO_PREVIEW_URL
      : demo.id === "painting" ? process.env.CATALYST_PAINTING_DEMO_PREVIEW_URL : undefined;
    if (preview) {
      try {
        const url = new URL(preview);
        if (url.protocol === "http:" && ["127.0.0.1", "localhost"].includes(url.hostname)) {
          return { href: url.toString(), external: true, live: true };
        }
      } catch { /* An invalid preview must not create a broken link. */ }
    }
  }
  return { href: `/portfolio/${demo.id}`, external: false, live: false };
}

export default function ServicesPage() {
  const website = serviceMenu.find((service) => service.id === "website-design")!;
  const fundraising = serviceMenu.find((service) => service.id === "fundraising")!;
  const custom = serviceMenu.find((service) => service.id === "custom-software")!;
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]),
    ).replace(/</g, "\\u003c") }} />
    <section className={`wrap ${styles.intro}`} aria-labelledby="services-heading">
      <p className="overline">The Catalyst service menu</p>
      <h1 id="services-heading">Services built around<br className={styles.desktopBreak} />{" "}<em>your business.</em></h1>
      <div className={styles.introBottom}>
        <p>From your first impression online to the systems behind your work. Explore websites, fundraising, and custom software from Catalyst Innovations in Knoxville, Tennessee.</p>
        <a href="#service-menu" className={styles.browseLink}>Find your next step <ArrowDown size={17} aria-hidden="true" /></a>
      </div>
    </section>

    <section id="service-menu" className={`wrap ${styles.featureGrid}`} aria-label="Featured services">
      <article className={`${styles.feature} ${styles.website}`}>
        <div className={styles.featureTop}><span>01 / Your presence</span><Globe2 size={24} strokeWidth={1.3} aria-hidden="true" /></div>
        <div className={styles.featureCopy}>
          <p className={styles.featureKicker}>Make a stronger first impression.</p>
          <h2><a href={website.href} target="_blank" rel="noopener noreferrer">{website.title}<ArrowUpRight size={23} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></h2>
          <p>{website.description}</p>
          <div className={styles.tags}><span>New websites</span><span>Redesigns</span><span>Ongoing care</span></div>
        </div>
        <div className={styles.websiteArt} aria-hidden="true"><div /><div /><div /><span /></div>
      </article>
      <article className={`${styles.feature} ${styles.fundraising}`}>
        <div className={styles.featureTop}><span>02 / Your purpose</span><HeartHandshake size={24} strokeWidth={1.3} aria-hidden="true" /></div>
        <div className={styles.featureCopy}>
          <p className={styles.featureKicker}>Bring people behind your purpose.</p>
          <h2><a href={fundraising.href} target="_blank" rel="noopener noreferrer">{fundraising.title}<ArrowUpRight size={23} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></h2>
          <p>{fundraising.description}</p>
          <div className={styles.tags}><span>Campaign pages</span><span>Share your story</span><span>Track progress</span></div>
        </div>
        <div className={styles.fundraisingArt} aria-hidden="true"><span /><span /><span /><HeartHandshake size={62} strokeWidth={1.1} /></div>
      </article>
    </section>

    <section id="custom-software" className={`wrap ${styles.customSection}`} aria-labelledby="custom-heading">
      <div className={styles.customIntro}>
        <div><p className="overline">03 / Your operations</p><h2 id="custom-heading"><Link href={custom.href}>{custom.title} <ArrowUpRight size={29} aria-hidden="true" /></Link></h2></div>
        <div><p>{custom.description}</p><p className={styles.customDetail}>Customer management (CRM). Connected operations (ERP). Warehouse tools (WMS). Or one focused application that makes everyday work easier.</p></div>
      </div>
      <div className={styles.connection} aria-label="Connected business workflows">
        <span><UsersRound size={19} aria-hidden="true" />Customers</span><ArrowRight size={17} aria-hidden="true" /><span><Blocks size={19} aria-hidden="true" />Jobs & work</span><ArrowRight size={17} aria-hidden="true" /><span><PackageCheck size={19} aria-hidden="true" />Inventory & purchasing</span><ArrowRight size={17} aria-hidden="true" /><span><ChartNoAxesCombined size={19} aria-hidden="true" />Accounting & reporting</span>
      </div>
      <div className={`${styles.examplesHeading} section-heading`}><div><p className="overline">Examples we’ve built</p><h3>Explore the actual applications.</h3></div><p>Fictional sample information.<br />Real software you can explore.</p></div>
      <div className={styles.demoGrid}>
        {demos.map((demo) => {
          const label = serviceDemoLabels[demo.id];
          const destination = demoDestination(demo);
          const image = demo.steps[0];
          return <article key={demo.id} className={styles.demoCard}>
            <div className={styles.demoImage}><Image src={image.image} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 760px) 90vw, (max-width: 1100px) 44vw, 350px" /></div>
            <div className={styles.demoCopy}>
              <p className={styles.demoStatus}>{demo.id === "painting" ? "Demonstration prototype" : destination.live ? "Interactive public sample" : "Public sample in preparation"}</p>
              <h4>{destination.external ? <a href={destination.href} target="_blank" rel="noopener noreferrer">{label.title}<ArrowUpRight size={19} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a> : <Link href={destination.href}>{label.title}<ArrowRight size={19} aria-hidden="true" /></Link>}</h4>
              <p>{label.description}</p>
              <p className={styles.demoAction}>{destination.live ? "Select the name to explore the demo." : "The actual walkthrough is available while we prepare the public sample."}</p>
              <Link className={styles.inquiry} href={`/consultation?demo=${demo.id}&industry=${demo.industry}`}>Discuss a system like this <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
          </article>;
        })}
      </div>
      <p className={styles.exampleNote}>These applications demonstrate capabilities, not customer results. Oxendine Painting is a prototype for a planned system. Sending, payments, and external connections are disabled or explicitly simulated in public samples.</p>
    </section>

    <section className={`wrap ${styles.capabilitiesSection}`} aria-labelledby="capabilities-heading">
      <div className={`${styles.capabilitiesHeading} section-heading`}><div><p className="overline">More ways we can help</p><h2 id="capabilities-heading">Make the work<br />{" "}<em>flow better.</em></h2></div><p>Start with one process. Keep the tools that work. Build the connections and capabilities your business needs next.</p></div>
      <div className={styles.capabilityGrid}>{serviceMenu.filter((service) => !service.featured).map((service) => {
        const Icon = capabilityIcons[service.id as keyof typeof capabilityIcons];
        return <article className={styles.capability} key={service.id}><span className={styles.capabilityIcon}>{Icon && <Icon size={24} strokeWidth={1.4} aria-hidden="true" />}</span><div><h3><Link href={service.href}>{service.title}<ArrowUpRight size={18} aria-hidden="true" /></Link></h3><p>{service.description}</p></div></article>;
      })}</div>
    </section>
    <DiscussCTA />
  </>;
}
