import Link from "next/link";
import { insights, insightReadingMinutes } from "@/data/insights";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { DiscussCTA } from "@/components/SiteSections";
import "./insights.css";

export const metadata = pageMetadata({
  title: "Practical Guides to Better Business Software",
  description: "Practical guides from Catalyst Innovations on field workflows, manufacturing, inventory, approvals, HOA requests and choosing business software.",
  path: "/insights",
});

export default function InsightsPage() {
  return <div className="insights-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Insights", path: "/insights" }])).replace(/</g, "\\u003c") }} />
    <section className="wrap page-intro insights-intro">
      <p className="overline">The work behind better software</p>
      <h1>Start with a clearer process.</h1>
      <p className="intro-copy">Practical ideas for connecting the people, information and decisions in your business. From our team in Knoxville, Tennessee, for businesses ready to improve the way work gets done.</p>
    </section>
    <section className="wrap content-section insights-grid" aria-label="Practical guides">
      {insights.map((article, index) => <article className="insight-card" key={article.slug}>
        <div className="insight-card-top"><span className="overline">{article.category}</span><span aria-hidden="true">0{index + 1}</span></div>
        <h2><Link href={`/insights/${article.slug}`}>{article.title}</Link></h2>
        <p>{article.description}</p>
        <div className="insight-card-bottom"><span>{insightReadingMinutes(article)} min read</span><Link className="text-link" href={`/insights/${article.slug}`}>Read the guide ↗<span className="sr-only">: {article.title}</span></Link></div>
      </article>)}
    </section>
    <section className="wrap content-section insights-note"><p>These guides explain possible approaches and questions to ask. Illustrative examples are not customer results. Actual software scope depends on your workflow, existing tools and requirements.</p></section>
    <DiscussCTA />
  </div>;
}
