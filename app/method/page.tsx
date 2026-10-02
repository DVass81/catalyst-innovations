import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { PageIntro, DiscussCTA } from "@/components/SiteSections";
import EngagementDetails from "@/components/EngagementDetails";

export const metadata = pageMetadata({
  path: "/method",
  title: "How We Work — From One Process to Useful Software",
  description: "Understand the process, agree the scope, build with your feedback, then launch and improve. How Catalyst works with your team.",
});
export default function MethodPage() {
  return <>
    <PageIntro eyebrow="How we work" title="Start with one process. Build from there."
      text="You bring the business knowledge. We bring operations and software experience. Together, we turn a frustrating process into a practical system." />
    <section className="wrap content-section">
      <ol className="engagement-grid">
        {[
          ["Understand the work", "Walk us through a real task: who starts it, what information changes hands, and where it gets stuck. We look at the tools you already use."],
          ["Agree on the first version", "Define the workflow, scope, cost and how you’ll decide it is ready. Your first project can focus on one process."],
          ["Build with your feedback", "Review the screens and workflows as they take shape. Check the system against the work your team actually does."],
          ["Launch and improve", "Prepare the agreed data, train the team and check the workflow before launch. Ongoing support and further work follow your agreed scope."],
        ].map(([title, text], index) => <li className="content-card" key={title}><p className="overline">0{index + 1}</p><h2>{title}</h2><p>{text}</p></li>)}
      </ol>
      <Link className="text-link" href="/portfolio">See examples of the software we build ↗</Link>
    </section>
    <EngagementDetails />
    <DiscussCTA />
  </>;
}
