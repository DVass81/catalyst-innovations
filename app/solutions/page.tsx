import type { Metadata } from "next";
import Link from "next/link";
import VisualStory from "@/components/VisualStory";
import ProblemFinder from "@/components/ProblemFinder";
import { services } from "@/data/services";
import { PageIntro, DiscussCTA } from "@/components/SiteSections";
export const metadata: Metadata = {
  title: "Custom Software, Connected Operations & Automation",
  description:
    "Practical tools for customers, operations and reporting. Find a starting point for your business.",
};
export default function Solutions() {
  return (
    <>
      <PageIntro
        eyebrow="Solutions"
        title="Start with the work you want to make easier."
        text="Manage customers. Keep operations moving. Understand your numbers. We connect the tools around the way your team works."
      />
      <section className="wrap content-section">
        <ProblemFinder />
      </section>
      <section className="wrap content-section">
        <h2>One request. Every step connected.</h2>
        <VisualStory kind="desk" />
      </section>
      <section className="wrap content-section solution-paths">
        <p className="overline">Explore in more detail</p>
        <h2>Three ways to move forward.</h2>
        {[
          {
            title: "Win and manage work",
            text: "Customer records, quotes and follow-up. Often called customer relationship management (CRM).",
          },
          {
            title: "Keep operations moving",
            text: "Jobs, inventory and purchasing. Business operations systems (ERP) and warehouse management systems (WMS), shaped around your team.",
          },
          {
            title: "Understand and connect your numbers",
            text: "Reporting, automation and connected systems that make information easier to use.",
          },
        ].map((g, i) => (
          <details key={g.title} open={i === 0}>
            <summary>{g.title}</summary>
            <p>{g.text}</p>
            <div className="solution-detail-links">
              {services
                .filter((s) =>
                  i === 0
                    ? s.slug === "custom-software"
                    : i === 1
                      ? /procurement|manufacturing/.test(s.slug)
                      : !/custom-software|procurement|manufacturing/.test(
                          s.slug,
                        ),
                )
                .map((s) => (
                  <Link key={s.slug} href={`/solutions/${s.slug}`}>
                    <strong>{s.navLabel} ↗</strong>
                    <span>{s.tagline}</span>
                  </Link>
                ))}
            </div>
          </details>
        ))}
      </section>
      <DiscussCTA />
    </>
  );
}
