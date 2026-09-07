import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import ConsultationForm from "@/components/ConsultationForm";
import BookingEmbed from "@/components/BookingEmbed";
import { site } from "@/lib/site";
import { consultationSchema, type ConsultationData } from "@/lib/consultation";
export const metadata: Metadata = {
  title: "Talk about your project",
  description:
    "Start with a free 30-minute conversation about the workflow, software, or automation you want to improve.",
  alternates: { canonical: "/consultation" },
};
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
const industries: Record<string, ConsultationData["industry"]> = {
  manufacturing: "Manufacturing",
  "field-service": "Field service",
  "professional-services": "Professional services",
  financial: "Financial institution",
  contractor: "Construction",
  professional: "Professional services",
};
export default async function ConsultationPage({
  searchParams,
}: {
  searchParams: Promise<{
    rec?: string;
    ind?: string;
    industry?: string;
    demo?: string;
    scope?: string;
  }>;
}) {
  const q = await searchParams;
  const initial: Partial<ConsultationData> = {};
  const industry = industries[q.industry || q.ind || ""];
  if (industry) initial.industry = industry;
  const demo = consultationSchema.shape.demoContext.safeParse(q.demo);
  if (demo.success) initial.demoContext = demo.data;
  const scope = consultationSchema.shape.scope.safeParse(q.scope);
  if (scope.success) initial.scope = scope.data;
  if (q.rec && recTitles[q.rec])
    initial.challenge = `From the starting-point assessment — recommended: ${recTitles[q.rec]}. `;
  return (
    <>
      <section className="ci-page-hero">
        <div className="ci-container">
          <p className="ci-eyebrow">LET’S FIND YOUR BETTER WAY</p>
          <h1>
            Tell us what
            <br />
            <span>could work better.</span>
          </h1>
          <p>
            A free 30-minute conversation starts with understanding your
            business.
          </p>
        </div>
      </section>
      <section className="ci-section ci-paper">
        <div className="ci-container ci-consultation-layout">
          <aside>
            <h2 className="ci-heading">
              A conversation.
              <br />A practical next step.
            </h2>
            <p>
              Daniel brings operations experience. Josh brings technical
              capability. You’ll work directly with the founders throughout your
              project.
            </p>
            <ul>
              <li>
                <Check size={17} /> No obligation to start a project
              </li>
              <li>
                <Check size={17} /> Clear scope before implementation
              </li>
              <li>
                <Check size={17} /> Your questions are welcome
              </li>
            </ul>
            {site.schedulingUrl && (
              <div className="ci-book-direct">
                <h3>Prefer to choose a time?</h3>
                <p>
                  {site.schedulingHost
                    ? `Book with ${site.schedulingHost}. `
                    : ""}
                  The calendar identifies your host and shows available times.
                </p>
                <BookingEmbed />
              </div>
            )}
            <Link href="/pricing" className="ci-text-link">
              See project pricing <ArrowUpRight size={16} />
            </Link>
          </aside>
          <ConsultationForm initial={initial} />
        </div>
      </section>
    </>
  );
}
