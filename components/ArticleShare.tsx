"use client";

import { useState } from "react";
import { Check, Copy, Mail, ArrowUpRight } from "lucide-react";
import { articleCampaignUrl } from "@/lib/blog-attribution";
import { track } from "@/lib/site";
import styles from "./ArticleShare.module.css";

/** Opens visitors' own sharing/draft tools; never publishes or sends for them. */
export default function ArticleShare({ slug, title, url }: { slug: string; title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const [fallback, setFallback] = useState(false);
  const direct = articleCampaignUrl(url, slug, "direct");
  const linkedin = articleCampaignUrl(url, slug, "linkedin");
  const email = articleCampaignUrl(url, slug, "email");
  if (!direct || !linkedin || !email) return null;
  const safeTitle = title.replace(/[\r\n]+/g, " ");
  const share = (channel: "copy" | "linkedin" | "email") => track("article_share", { article: slug, channel });
  async function copy() {
    try {
      await navigator.clipboard.writeText(direct!);
      setCopied(true);
      setFallback(false);
      share("copy");
    } catch { setCopied(false); setFallback(true); }
  }
  return <section className={styles.share} aria-label="Share this article">
    <div><p className="overline">Useful to someone on your team?</p><p className={styles.label}>Share the guide.</p></div>
    <div className={styles.actions}>
      <button type="button" onClick={copy}>{copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}{copied ? "Link copied" : "Copy link"}</button>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(linkedin)}`} target="_blank" rel="noopener noreferrer" onClick={() => share("linkedin")}>LinkedIn <ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
      <a href={`mailto:?subject=${encodeURIComponent(safeTitle)}&body=${encodeURIComponent(`${safeTitle}\n\n${email}`)}`} onClick={() => share("email")}><Mail size={16} aria-hidden="true" />Email</a>
    </div>
    <p className={styles.status} role="status">{copied ? "Article link copied. Ready to share." : fallback ? "Copy isn’t available here. Select the link below to copy it." : ""}</p>
    {fallback && <label className={styles.fallback}>Article link<input readOnly type="url" value={direct} onFocus={(event) => event.currentTarget.select()} /></label>}
  </section>;
}
