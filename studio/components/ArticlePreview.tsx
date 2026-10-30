import { useState, type CSSProperties } from "react";
import { type ArticleViewProps } from "./types";

const bodyStyle: CSSProperties = { background: "#faf7f1", color: "#0a1628", minHeight: "100%", padding: "28px 20px", fontFamily: "system-ui, sans-serif", lineHeight: 1.75 };
const eyebrowStyle: CSSProperties = { color: "#2f5d8f", textTransform: "uppercase", letterSpacing: ".12em", fontSize: 12, fontWeight: 750 };

/** Local draft preview only. It never publishes or exposes a preview/read token. */
export function ArticlePreview({ document }: ArticleViewProps) {
  const article = document.displayed;
  const [narrow, setNarrow] = useState(false);
  if (!article) return <p style={{ padding: 24 }}>Start writing to see a preview.</p>;
  return <div style={bodyStyle}>
    <div style={{ maxWidth: 780, margin: "0 auto 28px", borderBottom: "1px solid #ccd7e3", paddingBottom: 18 }}>
      <strong>Draft preview</strong>
      <p style={{ margin: "6px 0 12px", fontSize: 14 }}>This preview shows unpublished text inside your authenticated editor. It is not a public preview link.</p>
      <button type="button" aria-pressed={narrow} onClick={() => setNarrow(!narrow)} style={{ padding: "8px 14px", border: "1px solid #2f5d8f", borderRadius: 20, background: "white", color: "#0a1628", cursor: "pointer" }}>{narrow ? "Show wider reading layout" : "Check narrow reading layout"}</button>
    </div>
    <article style={{ maxWidth: narrow ? 360 : 780, margin: "0 auto", overflowWrap: "anywhere" }}>
      <p style={eyebrowStyle}>{article.category || "Article topic"}</p>
      <h1 style={{ fontSize: narrow ? 32 : 42, lineHeight: 1.14, letterSpacing: "-.04em" }}>{article.title || "Your article title"}</h1>
      <p style={{ fontSize: 20 }}>{article.description || "Add a short summary for readers and search previews."}</p>
      <p style={{ fontSize: 13, color: "#42516a" }}>Catalyst Innovations · {article.publishedAt || "Publication date"}</p>
      <p>{article.introduction}</p>
      {article.takeaway && <aside style={{ padding: "16px 22px", background: "#e8eff8", borderLeft: "3px solid #4a8fd4", margin: "28px 0" }}><p style={eyebrowStyle}>A useful starting point</p><p>{article.takeaway}</p></aside>}
      {(article.sections || []).map((section) => {
        const source = article.sources?.find((item) => item._key === section.sourceKey);
        return <section key={section._key} style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 26, lineHeight: 1.25 }}>{section.heading || "Section heading"}</h2>
          {(section.paragraphs || []).map((text, index) => <p key={index}>{text}</p>)}
          {!!section.checklist?.length && <ul>{section.checklist.map((text, index) => <li key={index}>{text}</li>)}</ul>}
          {source && <p style={{ fontSize: 13 }}>Background reference: {source.title}</p>}
        </section>;
      })}
      {article.example && <aside style={{ padding: 24, background: "white", border: "1px solid #d3ddea", borderRadius: 16, margin: "32px 0" }}><p style={eyebrowStyle}>Illustrative example</p><h2>{article.example.title}</h2><p>{article.example.text}</p></aside>}
      <section style={{ background: "#0a1628", color: "white", borderRadius: 18, padding: 24, margin: "32px 0" }}>
        <p style={{ ...eyebrowStyle, color: "#9ccafa" }}>A practical next step</p><h2>Bring the process you want to improve.</h2><p>{article.nextStep}</p>
        <span style={{ display: "inline-block", padding: "10px 18px", background: "#b8d8f8", color: "#0a1628", borderRadius: 24 }}>Discuss my business ↗</span>
      </section>
      {!!article.sources?.length && <footer><h2>Sources and editorial notes</h2><ul>{article.sources.map((source) => <li key={source._key}>{source.title}</li>)}</ul></footer>}
      <p style={{ fontSize: 12, color: "#42516a" }}>Reading preview. The public website adds navigation, related calculators, safe links and its responsive layout.</p>
    </article>
  </div>;
}
