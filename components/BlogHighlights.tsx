import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPublishedInsights } from "@/lib/blog";
import { insightReadingMinutes } from "@/data/insights";
import styles from "./BlogHighlights.module.css";

export default async function BlogHighlights() {
  let articles: Awaited<ReturnType<typeof getPublishedInsights>>;
  try {
    articles = [...await getPublishedInsights()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 3);
  } catch {
    // Optional reading suggestions must not take the rest of the homepage offline.
    return null;
  }
  if (!articles.length) return null;
  return <section className={`section ${styles.section}`} aria-labelledby="home-blog-heading"><div className="wrap">
    <div className={`section-heading ${styles.heading}`}><div><p className="overline">From the Catalyst Blog</p><h2 id="home-blog-heading">A useful read.<br /><em>A clearer next step.</em></h2></div><div><p>Practical ideas for the work behind your business—from everyday handoffs to choosing the right software.</p><Link className="text-link" href="/insights">Explore Blog &amp; Guides <ArrowUpRight size={17} aria-hidden="true" /></Link></div></div>
    <div className={styles.grid}>{articles.map((article, index) => <article className={styles.card} key={article.slug}><div className={styles.top}><p className="overline">{article.category}</p><span aria-hidden="true">0{index + 1}</span></div><h3><Link href={`/insights/${article.slug}`}>{article.title}</Link></h3><p>{article.description}</p><div className={styles.bottom}><span>{insightReadingMinutes(article)} min read</span><Link className="text-link" href={`/insights/${article.slug}`}>Read article <ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only">: {article.title}</span></Link></div></article>)}</div>
  </div></section>;
}
