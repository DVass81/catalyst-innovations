import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { PageIntro, DiscussCTA } from "@/components/SiteSections";
import EngagementDetails from "@/components/EngagementDetails";
import CatalystProcess from "@/components/CatalystProcess";
import { discoveryOffer } from "@/data/catalystProcess";

export const metadata = pageMetadata({
  path: "/method",
  title: "The Catalyst Process — Discovery Call, On-Site Build & Launch",
  description: `Start with a ${discoveryOffer.durationMinutes}-minute discovery call. Agree a 4–6-week on-site build, test with your team, then train and launch.`,
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
