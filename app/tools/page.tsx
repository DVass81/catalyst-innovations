import VisualStory from "@/components/VisualStory";
import { pageMetadata } from "@/lib/seo";
import { PageIntro, DiscussCTA } from "@/components/SiteSections";
import ToolLibrary from "@/components/ToolLibrary";
export const metadata = pageMetadata({
  path: "/tools",
  title: "24 Free Business Calculators & Savings Tools",
  description:
    "Explore time, costs, margins and automation opportunities with transparent calculators for your business. No email required.",
});
export default function Tools() {
  return (
    <>
      <PageIntro
        eyebrow="Savings tools / 24 practical calculators"
        title="Your numbers. A clearer picture."
        text="Find out where the time and money go. Explore a task, a business process or a project—with your own figures and the math explained."
      />
      <section className="wrap content-section">
        <ToolLibrary />
      </section>
      <section className="wrap content-section">
        <h2>What could a clearer process change?</h2>
        <VisualStory kind="comparison" autoplay={false} />
      </section>
      <DiscussCTA />
    </>
  );
}
