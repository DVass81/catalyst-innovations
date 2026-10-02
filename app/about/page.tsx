import { pageMetadata } from "@/lib/seo";
import { activeFounders } from "@/data/content";
import { site } from "@/lib/site";
import FounderIntro from "@/components/FounderIntro";
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(founderSchema).replace(/</g, "\\u003c") }} />
      <PageIntro
        eyebrow="About Catalyst / Knoxville, Tennessee"
        title="Good software starts with understanding the work."
        text="Based in Knoxville, Tennessee, we bring experience from production floors, purchasing decisions and technology systems to the same question: how can this business work better?"
      />
      <div id="our-background">
        <FounderIntro full />
      </div>
      <DiscussCTA />
    </>
  );
}
