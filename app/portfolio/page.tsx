import type { Metadata } from "next";
import { PageIntro, Projects, DiscussCTA } from "@/components/SiteSections";
export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Practical software projects for fundraising, community operations and business workflows.",
};
export default function Work() {
  return (
    <>
      <PageIntro
        eyebrow="Our work"
        title="Useful ideas. Built for real work."
        text="A look at the kinds of projects Catalyst creates. Each begins with a specific organization, a practical need and a better way to get things done."
      />
      <section className="wrap content-section">
        <Projects />
        <p className="muted" style={{ fontSize: 12, marginTop: 25 }}>
          Built describes work created, not a claim of measured customer
          outcomes. Planned work is clearly identified. Illustrations show
          concepts, not client software screenshots.
        </p>
      </section>
      <DiscussCTA />
    </>
  );
}
