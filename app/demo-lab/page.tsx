import type { Metadata } from "next";
import { Section, Eyebrow, Heading, Lead } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import {
  ProcurementDashboard, AIBriefing, ApprovalWorkflow, OpsKPIs, NLQuery,
} from "@/components/DemoLab";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Demo Lab — Interactive Product Demonstrations",
  description:
    "Click through simulated demonstrations: procurement dashboards, AI operations briefings, approval workflows, manufacturing KPIs, and natural-language business queries. All demo data is fictional.",
};

export default function DemoLabPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy-950 pb-16 pt-36 text-white">
        <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <Eyebrow dark>Demo Lab</Eyebrow>
            <Heading dark as="h1">Don&apos;t take our word for it. Click around.</Heading>
            <Lead dark>
              Interactive, simulated demonstrations of the kinds of systems we build.
              Approve a purchase, open an alert, ask the AI a question.
            </Lead>
            <p className="mt-6 inline-block rounded-lg border border-warning/40 bg-warning/10 px-4 py-2.5 text-sm font-medium text-warning">
              All names, numbers, and companies in these demos are fictional and generated
              for demonstration purposes only.
            </p>
          </Reveal>
        </div>
      </section>

      <Section className="bg-navy-900" dark>
        <div className="space-y-10">
          <Reveal><ProcurementDashboard /></Reveal>
          <Reveal><AIBriefing /></Reveal>
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal><ApprovalWorkflow /></Reveal>
            <Reveal delay={0.1}><NLQuery /></Reveal>
          </div>
          <Reveal><OpsKPIs /></Reveal>
        </div>
      </Section>
      <CTABand
        title="Imagine these screens with your data on them."
        body="A focused prototype with your real workflow is stage four of the Catalyst Method — and it usually takes weeks, not quarters."
      />
    </>
  );
}
