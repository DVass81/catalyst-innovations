import { startingPoints } from "@/data/startingPoints";
import BookingLink from "@/components/BookingLink";
import EngagementDetails from "@/components/EngagementDetails";
import type { Metadata } from "next";
import { PageIntro } from "@/components/SiteSections";
import InquiryForm from "@/components/InquiryForm";
import { industryList } from "@/data/redesign";
import { getCalculator } from "@/lib/calculators";
export const metadata: Metadata = {
  alternates: { canonical: '/consultation' },
  title: "Discuss My Business",
  description:
    "Tell Catalyst what slows your business down. Start a conversation about custom software and automation.",
};
export default async function Consultation({
  searchParams,
}: {
  searchParams: Promise<{
    problem?: string;
    demo?: string;
    industry?: string;
    tool?: string;
    attach?: string;
    ind?: string;
    rec?: string;
  }>;
}) {
  const q = await searchParams;
  const industry = industryList.find((i) => i.slug === (q.industry ?? q.ind));
  const tool = q.tool ? getCalculator(q.tool) : undefined;
  return (
    <>
      <PageIntro
        eyebrow="Let’s start with your business"
        title="What’s slowing you down?"
        text="Tell us about the work, the repeated tasks or the idea you want to explore. You don’t need a software specification to start."
      />
      <section className="wrap content-section two-grid">
        <InquiryForm
          deliveryConfigured={Boolean(
            process.env.CONSULTATION_WEBHOOK_URL ||
              (process.env.RESEND_API_KEY && process.env.CONSULTATION_TO_EMAIL),
          )}
          industry={industry?.name ?? ""}
          problem={startingPoints.find((p) => p.id === q.problem)?.id}
          tool={tool?.slug}
          demo={
            q.demo === "hoa" || q.demo === "flooring" || q.demo === "painting"
              ? q.demo
              : undefined
          }
          attach={q.attach === "1"}
        />
        <aside className="inquiry-aside">
          <BookingLink />
          <p className="overline">What happens next</p>
          <h2>
            A conversation.
            <br />A clearer starting point.
          </h2>
          <p>
            We’ll review what you share and contact you to understand the
            problem, the people involved and what a useful next step could look
            like.
          </p>
          <h3>Bring one process you’d like to improve.</h3>
          <p>
            A spreadsheet, a repeated task or a description of your current tools
            is enough to start. We’ll discuss a practical first step and define
            the scope and cost before you decide to proceed.
          </p>
          <p>
            <a
              className="text-link"
              href="mailto:daniel@mycatalystinnovations.com"
            >
              Email Daniel directly ↗
            </a>
          </p>
          <p>No obligation. No need to choose a package before we talk.</p>
        </aside>
      </section>
      <EngagementDetails />
    </>
  );
}
