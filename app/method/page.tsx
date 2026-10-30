import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { PageIntro, DiscussCTA } from "@/components/SiteSections";
import EngagementDetails from "@/components/EngagementDetails";
import CatalystProcess from "@/components/CatalystProcess";
import StudioPhoto from "@/components/studio/StudioPhoto";
import { discoveryOffer } from "@/data/catalystProcess";

export const metadata = pageMetadata({
  path: "/method",
  title: "The Catalyst Process — Discovery Call, On-Site Build & Launch",
  description: `Start with a ${discoveryOffer.durationMinutes}-minute discovery call. Agree a 4–6-week on-site build, test with your team, then train and launch.`,
});
export default function MethodPage() {
  return <div className="studio-page studio-method">
    <PageIntro eyebrow="The Catalyst Process" title="We learn your business. We build around it."
      text="You bring the business knowledge. We bring operations and software experience. Together, we turn a frustrating process into a practical system." />
    <section className="wrap studio-editorial-split studio-method-intro" aria-labelledby="method-working-heading"><StudioPhoto photoKey="planning" /><div><p className="overline">Understand. Agree. Build together.</p><h2 id="method-working-heading">The work informs<br />the software.</h2><p>We follow a real process with your team, agree the scope and keep testing the handoffs as the system takes shape. Continued observation helps us catch the details a specification alone can miss.</p><p>Your written proposal confirms the on-site arrangements, responsibilities and schedule before the build starts.</p></div></section>
    <CatalystProcess headingLevel={2} />
    <section className="wrap content-section">
      <Link className="text-link" href="/portfolio">See examples of the software we build ↗</Link>
    </section>
    <EngagementDetails />
    <DiscussCTA />
  </div>;
}
