import VisualStory from "@/components/VisualStory";
import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/data/services";
import {
  PageIntro,
  DiscussCTA,
  SolutionCards,
} from "@/components/SiteSections";
export const metadata: Metadata = {
  title: "Custom Software, Connected Operations & Automation",
  description:
    "CRM, ERP, WMS, inventory, purchasing, accounting and automation systems built around your business.",
};
export default function Solutions() {
  return (
    <>
      <PageIntro
        eyebrow="What we build"
        title="Software that fits the way you work."
        text="A single useful tool or a connected business system. We start with the problem and build a practical way forward."
      />
      <section className="wrap content-section">
        <SolutionCards />
      </section>
      <section className="wrap content-section">
        <h2>See the pieces work together.</h2>
        <VisualStory kind="desk" />
      </section>
      <section className="wrap content-section">
        <h2>Explore a starting point.</h2>
        <div className="three-grid">
          {services.map((s) => (
            <article className="tool-card" key={s.slug}>
              <h3>{s.navLabel}</h3>
              <p>{s.tagline}</p>
              <Link href={`/solutions/${s.slug}`} className="text-link">
                Explore this solution ↗
              </Link>
            </article>
          ))}
        </div>
      </section>
      <DiscussCTA />
    </>
  );
}
