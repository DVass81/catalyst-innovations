import type { Metadata } from "next";
import {activeFounders} from "@/data/content";
import FounderIntro from "@/components/FounderIntro";
import { PageIntro, DiscussCTA } from "@/components/SiteSections";
export const metadata: Metadata = {
  alternates: { canonical: '/founders' },
  title: "Founders — Josh Ogle and Daniel Vass",
  description:
    "The operations and technology backgrounds behind Catalyst Innovations.",
};
export default function Founders() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(activeFounders.map(f=>({"@context":"https://schema.org","@type":"Person",name:f.name,jobTitle:"Co-Founder",worksFor:{"@type":"Organization",name:"Catalyst Innovations"}})))}}/>
      <PageIntro
        eyebrow="Meet the founders"
        title="Josh Ogle and Daniel Vass."
        text="Two complementary backgrounds. One practical focus: helping your business work better."
      />
      <FounderIntro full />
      <DiscussCTA />
    </>
  );
}
