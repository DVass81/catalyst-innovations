import VisualStory from "@/components/VisualStory";
import { solutionStories } from "@/data/motionStories";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/data/services";
import { PageIntro, DiscussCTA } from "@/components/SiteSections";
export const generateStaticParams = () =>
  services.map((s) => ({ slug: s.slug }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  return { title: s?.title ?? "Solution not found", description: s?.tagline };
}
export default async function Solution({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();
  return (
    <>
      <PageIntro eyebrow="What we build" title={s.title} text={s.tagline} />
      <section className="wrap content-section two-grid">
        <div>
          <h2>Start with the work.</h2>
          <p>{s.description}</p>
          <p style={{ marginTop: 20 }}>
            We map the steps with your team, agree on a useful starting point,
            and build around the information and decisions that matter.
          </p>
          <Link className="text-link" href="/consultation">
            Discuss your process ↗
          </Link>
        </div>
        <div className="content-card">
          <p className="overline">What we can build</p>
          <ul className="check-list">
            {s.capabilities.slice(0, 6).map((c) => (
              <li key={c}>— {c}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="wrap content-section">
        <p className="overline">A clearer workflow</p>
        <VisualStory
          kind="desk"
          context={s.navLabel}
          workflow={solutionStories[s.slug].steps.map((step) => step.label)}
        />
        <p style={{ marginTop: 25 }}>
          Explore the potential value with your own figures.
        </p>
        <Link className="text-link" href="/tools/manual-work">
          Estimate manual-work savings ↗
        </Link>
      </section>
      <DiscussCTA />
    </>
  );
}
