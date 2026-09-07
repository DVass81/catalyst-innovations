import type { Metadata } from "next";
import { Suspense } from "react";
import IndustryShowcase from "@/components/demos/IndustryShowcase";
import { demoIndustries, type DemoIndustry } from "@/lib/demo";
import {
  ProcurementDashboard,
  AIBriefing,
  ApprovalWorkflow,
  OpsKPIs,
  NLQuery,
} from "@/components/DemoLab";
export const metadata: Metadata = {
  title: "Demo Lab — Try a connected workflow",
  description:
    "Try manufacturing approvals, field service scheduling, and client onboarding with clearly labeled fictional data.",
  alternates: { canonical: "/demo-lab" },
};
export default async function DemoLabPage({
  searchParams,
}: {
  searchParams: Promise<{ industry?: string }>;
}) {
  const { industry } = await searchParams;
  const selected = demoIndustries.includes(industry as DemoIndustry)
    ? (industry as DemoIndustry)
    : "manufacturing";
  return (
    <>
      <section className="ci-page-hero">
        <div className="ci-container">
          <p className="ci-eyebrow">THE DEMO LAB</p>
          <h1>
            See what changes
            <br />
            when everything connects.
          </h1>
          <p>
            Try a workflow. Make a decision. See the next step happen.
            <br />
            Every example uses fictional data and stays inside this
            demonstration.
          </p>
        </div>
      </section>
      <Suspense>
        <IndustryShowcase
          key={selected}
          initialIndustry={selected}
          standalone
        />
      </Suspense>
      <section className="ci-section ci-dark">
        <div className="ci-container">
          <details className="ci-more-demos">
            <summary>
              Explore more manufacturing & procurement examples <span>+</span>
            </summary>
            <p>
              Additional simulated dashboards and prepared AI examples. No live
              business data or AI service is connected.
            </p>
            <div className="ci-legacy-demos">
              <ProcurementDashboard />
              <AIBriefing />
              <ApprovalWorkflow />
              <OpsKPIs />
              <NLQuery />
            </div>
          </details>
        </div>
      </section>
    </>
  );
}
