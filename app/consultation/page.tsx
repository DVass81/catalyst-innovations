import type { Metadata } from "next";
import { Section, Eyebrow, Heading, Lead } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import ConsultationForm from "@/components/ConsultationForm";

export const metadata: Metadata = {
  title: "Request a Consultation",
  description:
    "Tell us about the process that frustrates you most. A consultation costs nothing and starts with listening.",
};

/** Maps assessment result slugs to prefill text for the form. */
const recTitles: Record<string, string> = {
  custom: "Custom Workflow Application",
  procurement: "Procurement Transformation",
  ai: "AI & Automation Assessment",
  manufacturing: "Manufacturing Operations Platform",
  supplychain: "Supply-Chain Intelligence",
  dashboard: "Executive Dashboard",
  integration: "System Integration",
  roadmap: "Digital Transformation Roadmap",
};
const industryMap: Record<string, string> = {
  manufacturing: "Manufacturing",
  financial: "Financial institution",
  contractor: "Construction",
  professional: "Professional services",
};

export default async function ConsultationPage({
  searchParams,
}: {
  searchParams: Promise<{ rec?: string; ind?: string }>;
}) {
  const { rec, ind } = await searchParams;
  const recTitle = rec ? recTitles[rec] : undefined;
  const industry = ind ? industryMap[ind] : undefined;
  const initial = recTitle
    ? {
        inquiryType: "Request a consultation" as const,
        industry: (industry ?? "Other") as never,
        challenge: `From the starting-point assessment — recommended: ${recTitle}. `,
      }
    : undefined;

  return (
    <>
      <section className="bg-navy-900 pb-14 pt-36 text-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <Eyebrow dark>Request a consultation</Eyebrow>
            <Heading dark as="h1">Let&apos;s talk about your operation.</Heading>
            <Lead dark>
              Four short steps. We&apos;ll review your submission and respond — usually within
              one business day.
            </Lead>
          </Reveal>
        </div>
      </section>
      <Section className="relative overflow-hidden bg-navy-950">
        <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl">
          <ConsultationForm initial={initial} />
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["No obligation", "A conversation, not a sales funnel."],
              ["Founders on the call", "You talk to Daniel and Josh, not an SDR."],
              ["Honest scoping", "If we're not the right fit, we'll say so."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-card border border-white/12 bg-white/5 p-5 text-center">
                <p className="font-display text-sm font-semibold text-white">{t}</p>
                <p className="mt-1 text-xs text-ice-300">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
