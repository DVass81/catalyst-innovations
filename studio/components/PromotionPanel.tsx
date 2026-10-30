import { useState } from "react";
import { publicArticleUrl, publicArticleCampaignUrl, type ArticleViewProps } from "./types";

export function PromotionPanel({ document }: ArticleViewProps) {
  const [message, setMessage] = useState("");
  const article = document.displayed;
  const publishedUrl = publicArticleUrl(document.published || undefined);
  const directUrl = publicArticleCampaignUrl(document.published || undefined, "direct");
  const linkedInUrl = publicArticleCampaignUrl(document.published || undefined, "linkedin");
  const googleUrl = publicArticleCampaignUrl(document.published || undefined, "google_business_profile");
  const emailUrl = publicArticleCampaignUrl(document.published || undefined, "email");
  const promotion = article?.promotion;
  const social = promotion?.social || `${article?.title || "A practical business software guide"}\n\n${article?.description || ""}`;
  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); setMessage("Copied. Review the text and destination before posting or sending."); }
    catch { setMessage("Clipboard access is unavailable. Select and copy the draft text below."); }
  };
  const button = { padding: "10px 16px", borderRadius: 20, background: "#0a1628", color: "white", border: 0, cursor: "pointer" };
  return <section style={{ padding: 28, color: "#0a1628", background: "#faf7f1", minHeight: "100%", fontFamily: "system-ui, sans-serif", lineHeight: 1.6 }}>
    <h2>Help the right readers find this article.</h2>
    <p>Publish the article, check the public page, then copy a draft for your business social account or an individually chosen recipient. Nothing is posted or sent automatically.</p>
    {!publishedUrl && <p role="status"><strong>This article has not been published.</strong> Sharing actions unlock after it has a published address.</p>}
    {publishedUrl && <p><a href={publishedUrl} target="_blank" rel="noopener noreferrer">Check the published article ↗</a></p>}
    <h3>Public article link</h3>
    <p style={{ overflowWrap: "anywhere" }}>{publishedUrl || "Publish a valid article address first."}</p>
    <button type="button" style={{ ...button, opacity: directUrl ? 1 : .5 }} disabled={!directUrl} onClick={() => directUrl && void copy(directUrl)}>Copy public link</button>
    <h3>Social post draft</h3>
    <p style={{ whiteSpace: "pre-wrap", border: "1px solid #c8d5e3", padding: 16, borderRadius: 12 }}>{social}{publishedUrl ? `\n\n${publishedUrl}` : ""}</p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      <button type="button" style={{ ...button, opacity: linkedInUrl ? 1 : .5 }} disabled={!linkedInUrl} onClick={() => linkedInUrl && void copy(`${social}\n\n${linkedInUrl}`)}>Copy LinkedIn draft and link</button>
      <button type="button" style={{ ...button, opacity: googleUrl ? 1 : .5 }} disabled={!googleUrl} onClick={() => googleUrl && void copy(`${social}\n\n${googleUrl}`)}>Copy Google Business draft and link</button>
    </div>
    <h3>Email introduction draft</h3>
    <p><strong>Subject:</strong> {promotion?.emailSubject || article?.title || "A practical software guide"}</p>
    <p style={{ whiteSpace: "pre-wrap", border: "1px solid #c8d5e3", padding: 16, borderRadius: 12 }}>{promotion?.emailBody || "Add an email introduction in the Promotion drafts fields. Choose a relevant recipient and review it before sending."}</p>
    <button type="button" style={{ ...button, opacity: emailUrl ? 1 : .5 }} disabled={!emailUrl} onClick={() => emailUrl && void copy(`Subject: ${promotion?.emailSubject || article?.title || "A practical software guide"}\n\n${promotion?.emailBody || article?.description || ""}\n\n${emailUrl}`)}>Copy email draft and link</button>
    <p role="status" aria-live="polite">{message}</p>
    <p style={{ fontSize: 13 }}>Copied links include only the published article slug and a fixed channel label for consent-based measurement. These labels identify the intended channel, not proof of a verified referral. Edit the prepared copy under Write → Promotion drafts. A saved draft can differ from the published article; check the public page before sharing. Never include personal information or invented results.</p>
  </section>;
}
