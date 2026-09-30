import SoftwareStory from "@/components/SoftwareStory";
import { industryStory } from "@/data/motionStories";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { industryList } from "@/data/redesign";
import { getCalculator } from "@/lib/calculators";
import { PageIntro } from "@/components/SiteSections";
export const generateStaticParams = () =>
  industryList.map((i) => ({ slug: i.slug }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const i = industryList.find((x) => x.slug === slug);
  return {
    title: i ? `Custom Software for ${i.name}` : "Industry not found",
    description: i
      ? `Connected workflows and practical automation for ${i.name.toLowerCase()}. Explore solutions and relevant savings calculators.`
      : undefined,
  };
}
export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const i = industryList.find((x) => x.slug === slug);
  if (!i) notFound();
  return (
    <>
      <PageIntro
        eyebrow={i.group}
        title={`A better way to run ${i.name.toLowerCase()}.`}
        text={`Practical software for ${i.name.toLowerCase()}, shaped around the way your people work. Start with one problem and connect the right pieces.`}
      />
      <section className="wrap content-section two-grid">
        <div className="content-card">
          <p className="overline">Sound familiar?</p>
          <ul className="check-list">
            {i.problems.map((p) => (
              <li key={p}>— {p}</li>
            ))}
          </ul>
        </div>
        <div className="content-card">
          <p className="overline">What we can build</p>
          <ul className="check-list">
            {i.solutions.map((p) => (
              <li key={p}>— {p}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="wrap content-section">
        <h2>Connect the steps.</h2>
        <SoftwareStory story={industryStory(i)} />
        <p style={{ marginTop: 20 }}>
          An example workflow. We adapt the steps to your operation.
        </p>
      </section>
      <section className="wrap content-section">
        <p className="overline">Explore your numbers</p>
        <h2>Useful tools for your business.</h2>
        <div className="three-grid">
          {i.tools.map((slug) => {
            const c = getCalculator(slug)!;
            return (
              <article className="tool-card" key={slug}>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <Link
                  className="text-link"
                  href={`/tools/${slug}?industry=${i.slug}`}
                >
                  Try the calculator ↗
                </Link>
              </article>
            );
          })}
        </div>
      </section>
      <section className="contact-band">
        <div className="wrap">
          <div>
            <h2>Let’s talk about your work.</h2>
            <p>Start with the process you most want to improve.</p>
          </div>
          <Link
            className="button button-light"
            href={`/consultation?industry=${i.slug}`}
          >
            Discuss my business ↗
          </Link>
        </div>
      </section>
    </>
  );
}
