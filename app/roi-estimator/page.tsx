import type { Metadata } from "next";
import { Section, Eyebrow, Heading, Lead } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import ROICalculator from "@/components/ROICalculator";
import Assessment from "@/components/Assessment";

export const metadata: Metadata = {
  title: "ROI Estimator",
  description:
    "Estimate the return on investment for automation and custom software, then take a two-minute assessment that points you to the most valuable place to begin.",
};

export default function ROIEstimatorPage() {
  return (
    <>
      <section className="bg-navy-900 pb-14 pt-36 text-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <Eyebrow dark>ROI estimator</Eyebrow>
            <Heading dark as="h1">See what inefficiency is costing you.</Heading>
            <Lead dark>
              Estimate the return on investment below, then take the seven-question
              starting-point assessment for a tailored recommendation.
            </Lead>
          </Reveal>
        </div>
      </section>
      <ROICalculator />
      <Section className="bg-ice-50">
        <div className="mx-auto max-w-3xl">
          <Assessment />
        </div>
      </Section>
    </>
  );
}
