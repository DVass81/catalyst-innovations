import { recommendedDemo } from "@/data/startingPoints";
import IndustryProblems from "@/components/IndustryProblems";
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
    alternates: i ? { canonical: `/industries/${i.slug}` } : undefined,
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
  const demo = recommendedDemo(i.group, i.slug);
  return (
    <>
      <PageIntro
        eyebrow={i.group}
        title={i.name}
        text={`Practical software for ${i.name.toLowerCase()}, shaped around the way your people work. Start with one problem and connect the right pieces.`}
      />
      <section className="wrap content-section">
        <IndustryProblems industry={i} />
      </section>
      <section className="wrap content-section">
        <h2>A connected workflow.</h2>
        <ol className="workflow-strip">
          {i.workflow.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p>We adapt these steps to your team and existing tools.</p>
        <aside className="related-demo">
          <p className="overline">See a practical example</p>
          <p>{demo.reason}</p>
          <Link
            className="text-link"
            href={`/portfolio?industry=${i.slug}#${demo.id}`}
          >
            Explore the guided demo ↗
          </Link>
        </aside>
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
            Discuss {i.name.toLowerCase()} workflows ↗
          </Link>
        </div>
      </section>
    </>
  );
}
