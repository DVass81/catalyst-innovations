import { pageMetadata } from "@/lib/seo";
import DemoShowcase from "@/components/DemoShowcase";
import ProjectStories from "@/components/ProjectStories";
import { industryList } from "@/data/redesign";
import { startingPoints } from "@/data/startingPoints";
import { PageIntro, DiscussCTA } from "@/components/SiteSections";
export const metadata = pageMetadata({
  path: "/portfolio",
  title: "See What We Build",
  description:
    "Watch narrated walkthroughs of Oxendine Painting, Knoxville Flooring and the HOA platform built by Catalyst Innovations.",
});
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
        title="See the software do the work."
        text="Oxendine Painting. Knoxville Flooring. Our HOA platform. Three actual applications, with short narrated walkthroughs showing how the work moves forward."
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
          Actual applications, demonstrated with sample information. Figures are
          illustrative, not measured business results. Oxendine Painting is a
          demonstration prototype for a planned system.
        </p>
      </section>
      <ProjectStories />
      <DiscussCTA />
    </>
  );
}
