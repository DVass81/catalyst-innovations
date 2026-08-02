import type { Metadata } from "next";
import { Eyebrow, Heading, Lead } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import IndustryExplorer from "@/components/IndustryExplorer";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Industries — Solutions Designed to Support Real Operations",
  description:
    "Solutions designed to support manufacturing, financial institutions, credit unions, logistics, construction, contractors, professional services, nonprofits, and growing businesses.",
};

export default function IndustriesPage() {
  return (
    <>
      <section className="bg-navy-900 pb-16 pt-36 text-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <Eyebrow dark>Industries</Eyebrow>
            <Heading dark as="h1">Built for real work, real teams, and real results.</Heading>
            <Lead dark>
              Select an industry to see the operational problems we can help solve, the
              solutions we design, and the outcomes they target.
            </Lead>
          </Reveal>
        </div>
      </section>
      <IndustryExplorer />
      <CTABand
        title="Don't see your industry?"
        body="If your organization has processes, paperwork, and people — we can probably help. Tell us what you run."
      />
    </>
  );
}
