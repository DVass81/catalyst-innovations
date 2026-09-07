import type { Metadata } from "next";
import ROICalculator from "@/components/ROICalculator";
import Assessment from "@/components/Assessment";
export const metadata: Metadata = {
  title: "Workflow Opportunity & ROI Estimator",
  description:
    "Compare freed capacity, estimated cash savings, project cost, support and implementation timing. Find a practical starting point for your workflow.",
  alternates: { canonical: "/roi-estimator" },
};
export default function ROIEstimatorPage() {
  return (
    <>
      <section className="ci-page-hero">
        <div className="ci-container">
          <p className="ci-eyebrow">THE WORKFLOW OPPORTUNITY</p>
          <h1>
            See the opportunity.
            <br />
            <span>Understand the investment.</span>
          </h1>
          <p>
            Estimate the value of freed time, compare all the costs, and
            separate capacity from cash savings.
          </p>
        </div>
      </section>
      <ROICalculator />
      <section className="ci-section ci-paper" id="assessment">
        <div className="ci-container ci-assessment">
          <p className="ci-eyebrow">FIND YOUR STARTING POINT</p>
          <h2 className="ci-heading">
            Seven questions.
            <br />A practical place to begin.
          </h2>
          <Assessment />
        </div>
      </section>
    </>
  );
}
