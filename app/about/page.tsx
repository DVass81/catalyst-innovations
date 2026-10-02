import type { Metadata } from "next";
import FounderIntro from "@/components/FounderIntro";
import { PageIntro, DiscussCTA } from "@/components/SiteSections";
export const metadata: Metadata = {
  alternates: { canonical: '/about' },
  title: "Josh, Daniel & the Story Behind Catalyst",
  description:
    "Meet Daniel Vass and Josh Ogle: operations experience and technology expertise, brought together at Catalyst Innovations in Knoxville, Tennessee.",
};
export default function About() {
  return (
    <>
      <PageIntro
        eyebrow="About Catalyst / Knoxville, Tennessee"
        title="Good software starts with understanding the work."
        text="Production floors. Purchasing decisions. Technology systems. Our backgrounds bring two complementary perspectives to the same question: how can this business work better?"
      />
      <div id="our-background">
        <FounderIntro full />
      </div>
      <DiscussCTA />
    </>
  );
}
