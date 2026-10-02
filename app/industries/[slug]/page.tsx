import { recommendedDemo } from "@/data/startingPoints";
import IndustryProblems from "@/components/IndustryProblems";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { industryList } from "@/data/redesign";
import { getCalculator } from "@/lib/calculators";
import { PageIntro } from "@/components/SiteSections";
import { industryContent } from "@/data/seoContent";
import { getInsight } from "@/data/insights";
import { services } from "@/data/services";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
export const generateStaticParams = () =>
  industryList.map((i) => ({ slug: i.slug }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const i = industryList.find((x) => x.slug === slug);
  if (!i) notFound();
  return pageMetadata({ title: `Custom Software for ${i.name}`, description: `${i.problems[0]} Explore custom workflows for ${i.name.toLowerCase()}, practical starting points and relevant calculators.`, path: `/industries/${i.slug}` });
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
  const content = industryContent[i.slug];
  const guide = getInsight(content.guide)!;
  const solution = services.find(service => service.slug === content.solution)!;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }, { name: i.name, path: `/industries/${i.slug}` }])).replace(/</g, "\\u003c") }} />
      <PageIntro
        eyebrow={i.group}
        title={i.name}
        text={content.introduction}
      />
      <section className="wrap content-section">
        <IndustryProblems industry={i} />
      </section>
      <section className="wrap content-section two-grid">
        <div><p className="overline">A practical starting point</p><h2>Start with one complete process.</h2><p>{content.firstStep}</p><p style={{ marginTop: 20 }}>We begin with your current tools, the people responsible for each decision and the exceptions they handle. The scope is agreed around your operation.</p><Link className="text-link" href={`/solutions/${solution.slug}`}>Explore {solution.navLabel.toLowerCase()} ↗</Link></div>
        <aside className="content-card"><p className="overline">Information worth connecting</p><ul className="check-list">{content.records.map(record => <li key={record}>— {record}</li>)}</ul><p style={{ marginTop: 20 }}>These are suggested records to discuss, not a claim that every capability is already present in the demonstration.</p></aside>
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
      <section className="wrap content-section two-grid">
        <div><p className="overline">Practical guide</p><h2>{guide.title}</h2><p>{guide.description}</p><Link className="text-link" href={`/insights/${guide.slug}`}>Read the guide ↗</Link></div>
        <div className="content-card"><p className="overline">A question we should address</p><h2>{content.faq.question}</h2><p>{content.faq.answer}</p></div>
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
