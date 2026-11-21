"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import NativeBlogBody from "@/components/NativeBlogBody";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import NativeBlogImagePicker from "@/components/NativeBlogImagePicker";
import { parseNativeBlogInput, nativeReadingMinutes, nativeBlogImage, type NativeBlogInput, type NativeBlogFeaturedImage } from "@/lib/native-blog-content";

type Receipt = { edition: string; slug: string; publicationId: string; documentFingerprint: string; savedAt: string };
type State = { edition: string; canPublish: boolean; reason: string; status: string; receipt: Receipt | null; checkedAt: string };
type Preview = { post: NativeBlogInput; edition: string; revision: string; previewToken: string };
const empty: NativeBlogInput = { title: "", slug: "", description: "", category: "Business workflows", body: "" };

export default function NativeBlogPublisher() {
  const [post, setPost] = useState(empty);
  const [state, setState] = useState<State | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const requestVersion = useRef(0);
  const checkingRef = useRef(false);

  const check = useCallback(async () => {
    if (checkingRef.current) return;
    checkingRef.current = true;
    setChecking(true);
    try {
      const response = await fetch("/api/blog/publisher", { credentials: "same-origin", cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not check the publication receipt.");
      setState(data);
      setError("");
    } catch (error) {
      // Never retain an old LIVE claim when the current check fails.
      setState(previous => previous ? { ...previous, status: "UNKNOWN" } : null);
      setError(error instanceof Error ? error.message : "Could not check the publication receipt.");
    } finally { checkingRef.current = false; setChecking(false); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => void check(), 0);
    return () => clearTimeout(timer);
  }, [check]);
  useEffect(() => {
    if (!state?.receipt || !["SAVED", "UNKNOWN"].includes(state.status)) return;
    const timer = setInterval(() => { if (document.visibilityState === "visible") void check(); }, 20_000);
    return () => clearInterval(timer);
  }, [state?.receipt, state?.status, check]);

  function change(field: keyof NativeBlogInput, value: string) {
    requestVersion.current++;
    setPost(previous => ({ ...previous, [field]: value }));
    setPreview(null);
    setError("");
  }

  function changeImage(value: NativeBlogFeaturedImage | undefined) {
    requestVersion.current++;
    setPost(previous => { const next = { ...previous }; if (value) next.featuredImage = value; else delete next.featuredImage; return next; });
    setPreview(null);
    setError("");
  }

  async function prepare(event: FormEvent) {
    event.preventDefault();
    const normalized = parseNativeBlogInput(post);
    if (!normalized || !normalized.featuredImage) { setError("Complete every field and choose a featured picture. Use 10–120 characters for the title, 30–240 for the summary, and at least 100 for the article."); return; }
    const version = requestVersion.current;
    setBusy(true); setError(""); setPreview(null);
    try {
      const response = await fetch("/api/blog/publisher", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "preview", post: normalized }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The preview could not be prepared.");
      if (version === requestVersion.current) {
        setPreview(data);
        setState(previous => previous ? { ...previous, edition: data.edition, canPublish: data.canPublish, reason: data.reason } : previous);
      }
    } catch (error) { setError(error instanceof Error ? error.message : "The preview could not be prepared."); }
    finally { setBusy(false); }
  }

  async function publish() {
    if (!preview || busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/blog/publisher", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "publish", ...preview }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The save could not be confirmed. Check this edition’s receipt before retrying.");
      setState(previous => ({ ...previous, edition: preview.edition, canPublish: false, reason: "This edition has been saved.", receipt: data.receipt, status: "SAVED", checkedAt: data.checkedAt }));
      setPreview(null);
      await check();
    } catch (error) { setError(error instanceof Error ? error.message : "The save could not be confirmed. Check the receipt before retrying."); }
    finally { setBusy(false); }
  }

  const complete = Boolean(state?.receipt);
  return <section className="native-blog-editor native-blog-publisher">
    <header className="nbe-header"><div><p className="nbe-eyebrow">Catalyst • Weekly publishing</p><h1>Blog publisher</h1><p>Preview the Friday article, publish once, and confirm it is live.</p></div>
      <form action="/api/blog/publisher/session" method="post"><input type="hidden" name="action" value="logout" /><button className="nbe-button nbe-button-secondary">Sign out</button></form></header>
    <section className="nbe-catalog" aria-labelledby="edition-title">
      <div className="nbe-history-heading"><h2 id="edition-title">Friday edition{state ? ` · ${state.edition}` : ""}</h2><button className="nbe-button nbe-button-secondary" disabled={checking || busy} onClick={() => void check()}>{checking ? "Checking…" : "Check live status"}</button></div>
      <div role="status" aria-live="polite" className="publisher-status">
        <p><strong>{state?.status === "NOT_SAVED" ? "No saved article for this edition" : state?.status ?? "Checking the saved edition…"}</strong></p>
        {state?.status === "SAVED" && <p>The article is saved. The website is deploying; wait for LIVE before sharing.</p>}
        {state?.status === "LIVE" && <p>The exact saved version is live and ready to share.</p>}
        {state?.status === "SUPERSEDED" && <p>The saved article was changed or removed in the normal editor. Ask Josh to review it; do not publish a replacement.</p>}
        {state?.status === "UNKNOWN" && <p>The live version could not be confirmed. Check again before sharing.</p>}
        {!complete && state && <p>{state.reason}</p>}
        {state?.receipt && <dl className="publisher-receipt"><div><dt>Article</dt><dd><a href={`/blog/${state.receipt.slug}`}>/blog/{state.receipt.slug}</a></dd></div><div><dt>Saved</dt><dd>{state.receipt.savedAt}</dd></div><div><dt>Exact version</dt><dd><code>{state.receipt.documentFingerprint}</code></dd></div><div><dt>Checked</dt><dd>{state.checkedAt}</dd></div></dl>}
      </div>
    </section>
    {error && <div className="nbe-error" role="alert">{error}</div>}
    {!complete && <form className="nbe-compose" onSubmit={prepare}>
      <fieldset disabled={busy || !state}><legend className="nbe-sr-only">Friday article</legend><div className="nbe-fields">
        <div><label htmlFor="publisher-title">Title</label><input id="publisher-title" value={post.title} minLength={10} maxLength={120} required onChange={e => change("title", e.target.value)} /></div>
        <div><label htmlFor="publisher-slug">Article address <span>lowercase-words-with-hyphens</span></label><input id="publisher-slug" value={post.slug} maxLength={100} pattern="[a-z0-9]+(-[a-z0-9]+)*" required onChange={e => change("slug", e.target.value)} /></div>
        <div className="nbe-field-full"><label htmlFor="publisher-summary">Summary <span>30–240 characters</span></label><textarea id="publisher-summary" value={post.description} minLength={30} maxLength={240} required rows={3} onChange={e => change("description", e.target.value)} /></div>
        <div><label htmlFor="publisher-category">Category</label><input id="publisher-category" value={post.category} maxLength={80} required onChange={e => change("category", e.target.value)} /></div>
        <NativeBlogImagePicker idPrefix="publisher" value={post.featuredImage} onChange={changeImage} required />
        <div className="nbe-field-full"><label htmlFor="publisher-body">Article <span>Headings, lists, emphasis and HTTPS links are supported.</span></label><textarea className="nbe-body-input" id="publisher-body" value={post.body} minLength={100} maxLength={60_000} required rows={18} onChange={e => change("body", e.target.value)} /></div>
      </div><div className="nbe-actions"><button className="nbe-button" type="submit">{busy ? "Preparing…" : "Preview article"}</button></div></fieldset>
    </form>}
    {preview && !complete && <article className="nbe-preview" aria-labelledby="publisher-preview-title"><p className="nbe-eyebrow">Publication preview · {preview.edition}</p><BlogFeaturedImage cover={nativeBlogImage(preview.post.featuredImage)} /><h2 id="publisher-preview-title">{preview.post.title}</h2><p>{preview.post.category} · {nativeReadingMinutes(preview.post.body)} min read</p><p>{preview.post.description}</p><div className="nbe-preview-body"><NativeBlogBody body={preview.post.body} /></div><div className="nbe-actions"><button className="nbe-button" disabled={busy || !state?.canPublish} onClick={() => void publish()}>{busy ? "Saving…" : "Publish Friday article"}</button></div>{!state?.canPublish && <p>{state?.reason}</p>}</article>}
  </section>;
}
