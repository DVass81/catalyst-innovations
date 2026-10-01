import { startingPoints } from "@/data/startingPoints";
import BookingLink from "@/components/BookingLink";
import type { Metadata } from "next";
import { PageIntro } from "@/components/SiteSections";
import InquiryForm from "@/components/InquiryForm";
import { industryList } from "@/data/redesign";
import { getCalculator } from "@/lib/calculators";
export const metadata: Metadata = {
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
          <h3>You bring the business.</h3>
          <p>
            We help connect the processes, information and software around it.
          </p>
          <p>No obligation. No need to choose a package before we talk.</p>
        </aside>
      </section>
    </>
  );
}
