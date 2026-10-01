import type { Metadata } from "next";
import DemoShowcase from "@/components/DemoShowcase";
import { industryList } from "@/data/redesign";
import { startingPoints } from "@/data/startingPoints";
import { PageIntro, DiscussCTA } from "@/components/SiteSections";
export const metadata: Metadata = {
  title: "See What We Build",
  description:
    "Explore actual community, flooring and painting software screens in three guided previews from Catalyst Innovations.",
};
export default async function Work({
  searchParams,
}: {
  searchParams: Promise<{ industry?: string; problem?: string }>;
}) {
  const q = await searchParams;
  const context = new URLSearchParams();
  const industry = industryList.find((i) => i.slug === q.industry);
  const problem = startingPoints.find((p) => p.id === q.problem);
  if (industry) context.set("industry", industry.slug);
  if (problem) context.set("problem", problem.id);
  return (
    <>
      <PageIntro
        eyebrow="See what we build"
        title="Real software. A clearer picture of what’s possible."
        text="Explore three short walkthroughs of actual application screens. See how a request, a room measurement or a painting scope becomes a useful next step."
      />
      <section className="wrap content-section">
        {(industry || problem) && (
          <p className="context-banner">
            Your starting point: {industry?.name ?? problem?.label}. We’ll carry
            this into your inquiry.
          </p>
        )}
        <DemoShowcase detailed context={context.toString()} />
        <p className="muted" style={{ fontSize: 12, marginTop: 25 }}>
          Screens are cropped from actual applications. Client branding and
          account details are excluded. Figures are sample inputs, not verified
          business results. Painting is a recovered local prototype for a
          planned system.
        </p>
      </section>
      <DiscussCTA />
    </>
  );
}
