import { pageMetadata } from "@/lib/seo";
import { activeFounders } from "@/data/content";
import Link from "next/link";
import { buyerFaqs } from "@/data/buyerFaqs";
import { site } from "@/lib/site";
import FounderIntro from "@/components/FounderIntro";
import StudioPhoto from "@/components/studio/StudioPhoto";
import { PageIntro, DiscussCTA } from "@/components/SiteSections";
export const metadata = pageMetadata({
  path: "/about",
  title: "Josh, Daniel & the Story Behind Catalyst",
  description:
    "Meet Daniel Vass and Josh Ogle: operations experience and technology expertise, brought together at Catalyst Innovations in Knoxville, Tennessee.",
});
const founderSchema = activeFounders.map((founder) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": new URL(`/about#${founder.slug}`, site.url).toString(),
  name: founder.name,
  jobTitle: "Co-Founder",
  worksFor: { "@id": new URL("/#organization", site.url).toString() },
  url: new URL("/about#our-background", site.url).toString(),
}));
export default function About() {
  return (
    <div className="studio-page studio-about">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(founderSchema).replace(/</g, "\\u003c") }} />
      <PageIntro
        eyebrow="About Catalyst / Knoxville, Tennessee"
        title="Meet Josh and Daniel."
        text="Based in Knoxville, Tennessee, we bring experience from production floors, purchasing decisions and technology systems to the same question: how can this business work better?"
      />
      <div id="our-background">
        <FounderIntro full />
      </div>
      <section className="wrap studio-editorial-split studio-about-intro" aria-labelledby="about-working-heading"><div><p className="overline">Operations experience meets software expertise</p><h2 id="about-working-heading">We build alongside<br />your team.</h2><p>Daniel brings the operations perspective. Josh brings the technology perspective. We start by listening to the people closest to the work, then build around the records, decisions and handoffs they depend on.</p><p>From our Knoxville roots, we work with businesses in East Tennessee and teams worldwide. On-site arrangements are agreed for each project.</p><Link className="text-link" href="/method">See the Catalyst Process ↗</Link></div><StudioPhoto photoKey="planning" /></section>
      <section className="wrap content-section faq-section" aria-labelledby="working-together-questions">
        <div><p className="overline">Working together</p><h2 id="working-together-questions">Know what to expect.</h2></div>
        <div>
          {[buyerFaqs.security, buyerFaqs.ownership, buyerFaqs.training].map(faq => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}
          <p style={{ marginTop: 24 }}><Link className="text-link" href="/insights/software-rollout-small-team">Read our guide to introducing software to your team ↗</Link></p>
        </div>
      </section>
      <DiscussCTA />
    </div>
  );
}
