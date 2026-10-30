import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { blogReadingMinutes, getPublishedPosts } from "@/lib/blog";
import styles from "./BlogHighlights.module.css";

export default async function BlogHighlights() {
  let articles: Awaited<ReturnType<typeof getPublishedPosts>>;
  try {
    articles = [...await getPublishedPosts()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 3);
  } catch {
    // Optional reading suggestions must not take the rest of the homepage offline.
    return null;
  }
  if (!articles.length) return null;
  return <section className={`section ${styles.section}`} aria-labelledby="home-blog-heading"><div className="wrap">
    <div className={`section-heading ${styles.heading}`}><div><p className="overline">From the Catalyst Blog</p><h2 id="home-blog-heading">A useful read.<br /><em>A fresh perspective.</em></h2></div><div><p>Short reads on manual work, practical automation and the questions behind a better-running business.</p><Link className="text-link" href="/blog">Explore the blog <ArrowUpRight size={17} aria-hidden="true" /></Link></div></div>
    <div className={styles.grid}>{articles.map((article, index) => <article className={styles.card} key={article.slug}><div className={styles.top}><p className="overline">{article.category}</p><span aria-hidden="true">0{index + 1}</span></div><h3><Link href={`/blog/${article.slug}`}>{article.title}</Link></h3><p>{article.description}</p><div className={styles.bottom}><span>{blogReadingMinutes(article)} min read</span><Link className="text-link" href={`/blog/${article.slug}`}>Read article <ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only">: {article.title}</span></Link></div></article>)}</div>
  </div></section>;
}
