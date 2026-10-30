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
    <div className="studio-page studio-tools">
      <PageIntro
        eyebrow="Savings tools / 24 practical calculators"
        title="Your numbers. A clearer picture."
        text="Find out where the time and money go. Explore a task, a business process or a project—with your own figures and the math explained."
      />
      <section className="wrap content-section">
        <ToolLibrary />
      </section>
      <section className="wrap studio-tools-note">
        <div><p className="overline">Keep the measures clear</p><h2>Put your own work<br />into perspective.</h2></div><p>Use your figures to explore one part of the business. Time returned, cash savings and additional revenue describe different things. Each calculator shows its formula and assumptions; its result is an estimate, rather than a promised improvement.</p>
      </section>
      <DiscussCTA />
    </div>
  );
}
