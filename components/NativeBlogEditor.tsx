"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import NativeBlogBody from "@/components/NativeBlogBody";
import NativeBlogImagePicker from "@/components/NativeBlogImagePicker";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import { nativeBlogSchema, nativeBlogDocumentSchema, parseNativeBlogInput, nativeBlogImage, type NativeBlogDocument, type NativeBlogInput, type NativeBlogFeaturedImage } from "@/lib/native-blog-content";

const emptyPost: NativeBlogInput = { title: "", slug: "", description: "", category: "", body: "" };
type FieldErrors = Partial<Record<keyof NativeBlogInput, string>>;
type Preview = { post: NativeBlogInput; fingerprint: string };
type PublishOperation = Preview & { revision: string; operationId: string };
type SavedArticle = { document: NativeBlogDocument; commitSha: string };
type Delivery = { status: "live" | "saved" | "unknown"; checkedAt: string };
type ArticleDelivery = Record<string, Delivery>;

function deliveryCatalog(value: unknown): ArticleDelivery {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, Delivery] => {
    const status = entry[1];
    return status && typeof status === "object" && ["live", "saved", "unknown"].includes(status.status)
      && typeof status.checkedAt === "string" && Number.isFinite(Date.parse(status.checkedAt));
  }));
}

function displayDate(value: string) {
  return new Date(`${value}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function articleSlug(title: string) {
  return title.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100).replace(/-$/, "");
}

function articleSummary(body: string) {
  return body.replace(/^#{1,6}\s+.+$/gm, "").replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/^[\s>*+-]+/gm, "")
    .replace(/[`*_~]/g, "").replace(/\s+/g, " ").trim().slice(0, 240);
}

async function fingerprint(post: NativeBlogInput) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(post)));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

function catalogDocument(value: unknown): value is NativeBlogDocument {
  return nativeBlogDocumentSchema.safeParse(value).success;
}

export function NativeBlogEditor() {
  const [post, setPost] = useState<NativeBlogInput>(emptyPost);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [posts, setPosts] = useState<NativeBlogDocument[]>([]);
  const [delivery, setDelivery] = useState<ArticleDelivery>({});
  const [historyChanged, setHistoryChanged] = useState(false);
  const [revision, setRevision] = useState<string | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [saved, setSaved] = useState<SavedArticle | null>(null);
  const [retryPublish, setRetryPublish] = useState(false);
  const operation = useRef<PublishOperation | null>(null);
  const editVersion = useRef(0);
  const publicationInProgress = useRef(false);
  const catalogRequest = useRef(0);
  const previewHeading = useRef<HTMLHeadingElement>(null);
  const errorSummary = useRef<HTMLDivElement>(null);
  const requiresFeaturedImage = !selectedSlug || posts.some(article => article.slug === selectedSlug && Boolean(article.featuredImage));

  const loadCatalog = useCallback(async (signal?: AbortSignal, statusRevision?: string) => {
    const requestId = ++catalogRequest.current;
    try {
      const response = await fetch("/api/blog/editor", { credentials: "same-origin", cache: "no-store", signal });
      if (signal?.aborted || requestId !== catalogRequest.current) return;
      if (response.status === 401 || response.status === 403) {
        setDelivery({});
        setSessionExpired(true);
        setCatalogError("Your editor session has expired. Sign in again to continue.");
        return;
      }
      if (!response.ok) throw new Error("catalog");
      const data: unknown = await response.json();
      if (!data || typeof data !== "object" || !("posts" in data) || !Array.isArray(data.posts)
        || !data.posts.every(catalogDocument) || !("revision" in data) || typeof data.revision !== "string" || !data.revision) throw new Error("catalog");
      if (signal?.aborted || requestId !== catalogRequest.current) return;
      if (statusRevision && data.revision !== statusRevision) {
        setHistoryChanged(true);
        setDelivery({});
        return;
      }
      if (!statusRevision) {
        setPosts(data.posts);
        setRevision(data.revision);
        setHistoryChanged(false);
      }
      setDelivery(deliveryCatalog("delivery" in data ? data.delivery : null));
      setCatalogError("");
      setSessionExpired(false);
    } catch {
      if (!signal?.aborted && requestId === catalogRequest.current) {
        setDelivery({});
        setCatalogError("The article list could not be loaded. Your text is still here. Try loading it again before publishing.");
      }
    } finally {
      if (!signal?.aborted && requestId === catalogRequest.current && !statusRevision) setCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      if (!controller.signal.aborted) void loadCatalog(controller.signal);
    });
    return () => controller.abort();
  }, [loadCatalog]);

  const awaitingDelivery = posts.some(article => delivery[article.slug]?.status !== "live");
  useEffect(() => {
    if (!awaitingDelivery || !revision || sessionExpired || historyChanged) return;
    const controller = new AbortController();
    let checking = false;
    const timer = setInterval(() => {
      if (checking || publicationInProgress.current || document.visibilityState !== "visible") return;
      checking = true;
      void loadCatalog(controller.signal, revision).finally(() => { checking = false; });
    }, 20_000);
    return () => { clearInterval(timer); controller.abort(); };
  }, [awaitingDelivery, revision, sessionExpired, historyChanged, loadCatalog]);

  useEffect(() => {
    if (preview) previewHeading.current?.focus();
  }, [preview]);

  function invalidatePreview() {
    editVersion.current += 1;
    operation.current = null;
    setPreview(null);
    setPreviewing(false);
    setRetryPublish(false);
    setSaved(null);
    setError("");
    setErrors({});
  }

  function updatePost(field: Exclude<keyof NativeBlogInput, "featuredImage">, value: string) {
    invalidatePreview();
    if (field === "slug") setSlugEdited(true);
    setPost(current => ({ ...current, [field]: value, ...(field === "title" && !slugEdited && !selectedSlug ? { slug: articleSlug(value) } : {}) }));
  }

  function updateFeaturedImage(value: NativeBlogFeaturedImage | undefined) {
    invalidatePreview();
    setPost(current => {
      const next = { ...current };
      if (value) next.featuredImage = value;
      else delete next.featuredImage;
      return next;
    });
  }

  function selectArticle(slug: string) {
    invalidatePreview();
    setSelectedSlug(slug);
    setSlugEdited(Boolean(slug));
    const existing = posts.find(article => article.slug === slug);
    setPost(existing ? { title: existing.title, slug: existing.slug, description: existing.description, category: existing.category, body: existing.body, ...(existing.featuredImage ? { featuredImage: existing.featuredImage } : {}) } : { ...emptyPost });
  }

  async function previewArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (publicationInProgress.current) return;
    setError("");
    setErrors({});
    setPreview(null);
    operation.current = null;
    setRetryPublish(false);
    const candidate = { ...post, description: post.description.trim() || articleSummary(post.body) };
    const parsed = parseNativeBlogInput(candidate);
    const imageRequired = requiresFeaturedImage && !post.featuredImage;
    if (!parsed || imageRequired) {
      const result = nativeBlogSchema.safeParse(candidate);
      const fieldErrors: FieldErrors = {};
      if (!result.success) for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && (Object.hasOwn(emptyPost, field) || field === "featuredImage")) fieldErrors[field as keyof NativeBlogInput] ??= issue.message;
      }
      if (imageRequired) fieldErrors.featuredImage = selectedSlug ? "Choose a picture to replace this article’s featured image." : "Choose a featured image for your new article.";
      setErrors(fieldErrors);
      setError("Check the fields below, then preview your article again.");
      requestAnimationFrame(() => errorSummary.current?.focus());
      return;
    }
    const version = editVersion.current;
    setPreviewing(true);
    try {
      const previewFingerprint = await fingerprint(parsed);
      if (version === editVersion.current) setPreview({ post: parsed, fingerprint: previewFingerprint });
    } catch {
      setError("The preview could not be prepared. Reload this secure page and try again.");
    } finally {
      if (version === editVersion.current) setPreviewing(false);
    }
  }

  async function publishArticle() {
    if (!preview || !revision || catalogLoading || sessionExpired || publicationInProgress.current) return;
    publicationInProgress.current = true;
    catalogRequest.current += 1;
    setPublishing(true);
    setError("");
    try {
      operation.current ??= { ...preview, revision, operationId: crypto.randomUUID() };
      const pending = operation.current;
      const response = await fetch("/api/blog/editor", {
        method: "POST", credentials: "same-origin", cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post: pending.post, revision: pending.revision, operationId: pending.operationId, previewFingerprint: pending.fingerprint }),
      });
      if (response.status === 401 || response.status === 403) {
        setSessionExpired(true);
        setError("Your editor session has expired. Sign in again to continue.");
        return;
      }
      if (response.status === 409) {
        operation.current = null;
        setPreview(null);
        setRevision(null);
        setRetryPublish(false);
        setError("The article list changed while you were editing. Load the latest list, then preview your article again.");
        return;
      }
      if (response.status === 400 || response.status === 413 || response.status === 422) {
        operation.current = null;
        setPreview(null);
        setRetryPublish(false);
        setError(response.status === 413 ? "The article is too large. Shorten it, then preview again." : "The article could not be accepted. Check its fields and preview it again.");
        return;
      }
      if (!response.ok) throw new Error("publish");
      const data: unknown = await response.json();
      if (!data || typeof data !== "object" || !("document" in data) || !catalogDocument(data.document)
        || !("commitSha" in data) || typeof data.commitSha !== "string" || !("status" in data) || data.status !== "queued") throw new Error("publish");
      const document = data.document;
      setSaved({ document, commitSha: data.commitSha });
      setDelivery(current => ({ ...current, [document.slug]: { status: "saved", checkedAt: new Date().toISOString() } }));
      setSelectedSlug(data.document.slug);
      setSlugEdited(true);
      setPost(pending.post);
      setPreview(null);
      setRetryPublish(false);
      operation.current = null;
      setCatalogLoading(true);
      setCatalogError("");
      setRevision(null);
      await loadCatalog();
    } catch {
      setRetryPublish(true);
      setError("The publish result could not be confirmed. Retry to check the same request. Keep this page open until the save is confirmed.");
    } finally {
      publicationInProgress.current = false;
      setPublishing(false);
    }
  }

  const busy = publishing;
  const savedDelivery = saved && posts.some(article => article.slug === saved.document.slug && article.publicationId === saved.document.publicationId)
    ? delivery[saved.document.slug]?.status : "unknown";
  const errorId = (field: keyof NativeBlogInput) => errors[field] ? `native-blog-${field}-error` : undefined;

  return <section className="native-blog-editor" aria-labelledby="native-blog-editor-title">
    <header className="nbe-header">
      <div><p className="nbe-eyebrow">Catalyst publishing</p><h1 id="native-blog-editor-title">Blog editor</h1><p>Paste your article, review the preview, then publish.</p></div>
      <form action="/api/blog/editor/session" method="post"><input type="hidden" name="action" value="logout" /><button className="nbe-button nbe-button-secondary" type="submit" disabled={busy}>Sign out</button></form>
    </header>

    <div className="nbe-catalog">
      <div className="nbe-history-heading"><h2>Article history</h2><button className="nbe-button nbe-button-secondary" type="button" onClick={() => selectArticle("")} disabled={busy}>New article</button></div>
      <p className="nbe-hint">Saved means the latest version is stored. Live means that exact version is on the website. Open an article below to edit it.</p>
      {!catalogLoading && !catalogError && posts.length === 0 && <p className="nbe-empty-history">No saved articles yet. Your first published article will appear here.</p>}
      {posts.length > 0 && <ul className="nbe-history-list" aria-label="Saved articles">{posts.map(article => {
        const state = delivery[article.slug]?.status ?? "unknown";
        return <li key={article.slug} className="nbe-history-card">
          <div className="nbe-history-copy"><span className={`nbe-delivery nbe-delivery-${state}`}>{state === "live" ? "Live" : state === "saved" ? "Saved · waiting to go live" : "Saved · live status unconfirmed"}</span><h3>{article.title}</h3><p className="nbe-hint">First saved <time dateTime={article.publishedAt}>{displayDate(article.publishedAt)}</time> · Latest save <time dateTime={article.updatedAt}>{displayDate(article.updatedAt)}</time></p></div>
          <div className="nbe-history-actions"><button className="nbe-button nbe-button-secondary" type="button" onClick={() => selectArticle(article.slug)} aria-label={`Open to edit: ${article.title}`} aria-pressed={selectedSlug === article.slug} disabled={busy}>Open to edit</button>{state === "live" && <a className="nbe-text-link" href={`/blog/${article.slug}`} target="_blank" rel="noopener noreferrer">View live article<span className="nbe-sr-only">: {article.title} (opens in a new tab)</span></a>}</div>
        </li>;
      })}</ul>}
      {awaitingDelivery && !historyChanged && !sessionExpired && <p className="nbe-hint" role="status">Live status checks automatically every 20 seconds while this tab is visible. Deployment can take a few minutes; you don’t need to publish again.</p>}
      {historyChanged && <p className="nbe-notice" role="status">The saved history has changed. Copy any unsaved text, then reload articles to see the latest versions.</p>}
      <label htmlFor="native-blog-article">Article</label>
      <div className="nbe-catalog-controls"><select id="native-blog-article" value={selectedSlug} onChange={event => selectArticle(event.target.value)} disabled={busy || catalogLoading}>
        <option value="">New article</option>{posts.map(article => <option value={article.slug} key={article.slug}>{article.title}</option>)}
      </select><button className="nbe-button nbe-button-secondary" type="button" onClick={() => { invalidatePreview(); setCatalogLoading(true); setCatalogError(""); setRevision(null); void loadCatalog(); }} disabled={busy || catalogLoading}>{catalogLoading ? "Loading articles…" : "Reload articles"}</button></div>
      {catalogError && <p className="nbe-notice nbe-notice-error" role="alert">{catalogError}</p>}
      {sessionExpired && <div><Link className="nbe-text-link" href="/blog/editor" target="_blank" rel="noopener noreferrer" prefetch={false}>Sign in again<span className="nbe-sr-only"> (opens in a new tab)</span></Link><p className="nbe-hint">Sign in in the new tab, then reload articles here to continue with your text.</p></div>}
    </div>

    {saved && <div className="nbe-notice nbe-saved" role="status"><strong>{savedDelivery === "live" ? "Live. Your latest save is on the website." : savedDelivery === "saved" ? "Saved. Waiting for deployment." : "Saved. Live status has not been confirmed."}</strong><p>{saved.document.title} has been queued. {savedDelivery === "live" ? "The deployed version matches your saved article." : "Keep this page open to check progress. You don’t need to publish it again."}</p><a href={`/blog/${saved.document.slug}`} target="_blank" rel="noopener noreferrer">Check public article<span className="nbe-sr-only"> (opens in a new tab)</span></a></div>}

    <form className="nbe-compose" onSubmit={previewArticle} noValidate aria-busy={busy}>
      {error && <div className="nbe-notice nbe-notice-error" role="alert" tabIndex={-1} ref={errorSummary}><p>{error}</p></div>}
      <fieldset disabled={busy}>
        <legend className="nbe-sr-only">Article content</legend>
        <div className="nbe-fields">
          <div className="nbe-field nbe-field-wide"><label htmlFor="native-blog-title">Title</label><input id="native-blog-title" value={post.title} onChange={event => updatePost("title", event.target.value)} maxLength={120} required aria-invalid={Boolean(errors.title)} aria-describedby={errorId("title")} />{errors.title && <p className="nbe-field-error" id={errorId("title")}>{errors.title}</p>}</div>
          <div className="nbe-field"><label htmlFor="native-blog-category">Topic</label><input id="native-blog-category" value={post.category} onChange={event => updatePost("category", event.target.value)} maxLength={80} required placeholder="For example, Business operations" aria-invalid={Boolean(errors.category)} aria-describedby={errorId("category")} />{errors.category && <p className="nbe-field-error" id={errorId("category")}>{errors.category}</p>}</div>
          <div className="nbe-field"><label htmlFor="native-blog-slug">Article URL</label><div className="nbe-slug"><span>/blog/</span><input id="native-blog-slug" value={post.slug} onChange={event => updatePost("slug", event.target.value)} readOnly={Boolean(selectedSlug)} maxLength={100} required aria-invalid={Boolean(errors.slug)} aria-describedby={["native-blog-slug-help", errorId("slug")].filter(Boolean).join(" ")} /></div><p className="nbe-hint" id="native-blog-slug-help">{selectedSlug ? "The URL stays fixed when editing this article." : "Created from the title. You can adjust it before publishing."}</p>{errors.slug && <p className="nbe-field-error" id={errorId("slug")}>{errors.slug}</p>}</div>
          <div className="nbe-field nbe-field-wide"><label htmlFor="native-blog-description">Short summary <span>Optional</span></label><textarea id="native-blog-description" value={post.description} onChange={event => updatePost("description", event.target.value)} maxLength={240} rows={2} aria-invalid={Boolean(errors.description)} aria-describedby={["native-blog-description-help", errorId("description")].filter(Boolean).join(" ")} /><p className="nbe-hint" id="native-blog-description-help">Leave blank to use the opening text of your article. The preview shows the summary that will be used.</p>{errors.description && <p className="nbe-field-error" id={errorId("description")}>{errors.description}</p>}</div>
          <div className="nbe-field nbe-field-wide nbe-image-field" role="group" aria-label="Featured picture" aria-describedby={errorId("featuredImage")}><NativeBlogImagePicker value={post.featuredImage} onChange={updateFeaturedImage} disabled={busy} required={requiresFeaturedImage} idPrefix="native-blog" />{errors.featuredImage && <p className="nbe-field-error" id={errorId("featuredImage")}>{errors.featuredImage}</p>}</div>
          <div className="nbe-field nbe-field-wide"><label htmlFor="native-blog-body">Paste article</label><textarea className="nbe-body-input" id="native-blog-body" value={post.body} onChange={event => updatePost("body", event.target.value)} rows={20} required aria-invalid={Boolean(errors.body)} aria-describedby={["native-blog-body-help", errorId("body")].filter(Boolean).join(" ")} /><p className="nbe-hint" id="native-blog-body-help">Separate paragraphs with a blank line. Use ## for headings and - for lists. Articles can contain up to 60,000 characters. Copy your text before leaving this page.</p>{errors.body && <p className="nbe-field-error" id={errorId("body")}>{errors.body}</p>}</div>
        </div>
      </fieldset>
      <div className="nbe-actions"><button className="nbe-button nbe-button-secondary" type="submit" disabled={busy || previewing}>{previewing ? "Preparing preview…" : "Preview article"}</button><button className="nbe-button" type="button" onClick={() => void publishArticle()} disabled={!preview || !revision || catalogLoading || sessionExpired || busy}>{busy ? "Saving article…" : retryPublish ? "Retry publish" : selectedSlug ? "Publish changes" : "Publish article"}</button></div>
      <p className="nbe-hint" role="status">{preview ? "Preview ready. Publishing queues this version for the website." : "Preview your current article to enable publishing."}</p>
    </form>

    {preview && <section className="nbe-preview" aria-labelledby="native-blog-preview-heading">
      <h2 id="native-blog-preview-heading" ref={previewHeading} tabIndex={-1}>Article preview</h2>
      <dl className="nbe-preview-meta"><div><dt>Public URL</dt><dd>/blog/{preview.post.slug}</dd></div><div><dt>Page title</dt><dd>{preview.post.title}</dd></div><div><dt>Topic</dt><dd>{preview.post.category}</dd></div><div><dt>Summary</dt><dd>{preview.post.description}</dd></div></dl>
      <article className="nbe-preview-article"><div className="nbe-preview-image"><BlogFeaturedImage cover={nativeBlogImage(preview.post.featuredImage)} /></div><p className="nbe-eyebrow">{preview.post.category}</p><h3 className="nbe-article-title">{preview.post.title}</h3><NativeBlogBody body={preview.post.body} className="nbe-preview-body" /></article>
    </section>}
  </section>;
}

export default NativeBlogEditor;
