import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { PageIntro, DiscussCTA } from "@/components/SiteSections";
import EngagementDetails from "@/components/EngagementDetails";
import CatalystProcess from "@/components/CatalystProcess";

export const metadata = pageMetadata({
  path: "/method",
  title: "The Catalyst Process — On-Site Discovery, Build & Launch",
  description: "Start with a complimentary 45-minute discovery. Agree a 4–6-week on-site system build, keep learning your workflow, then train, launch and improve.",
});
export default function MethodPage() {
  return <>
    <PageIntro eyebrow="The Catalyst Process" title="We learn your business. We build around it."
      text="You bring the business knowledge. We bring operations and software experience. Together, we turn a frustrating process into a practical system." />
    <CatalystProcess headingLevel={2} />
    <section className="wrap content-section">
      <Link className="text-link" href="/portfolio">See examples of the software we build ↗</Link>
    </section>
    <EngagementDetails />
    <DiscussCTA />
  </>;
}
