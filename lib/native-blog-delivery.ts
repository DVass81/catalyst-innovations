import { createHash } from "node:crypto";
import { parseNativeBlogDocument, type NativeBlogDocument } from "./native-blog-content";

export type ArticleDelivery = { status: "live" | "saved" | "unknown"; checkedAt: string };
export type ArticleDeliveries = Record<string, ArticleDelivery>;
type PublicVersion = { slug: string; fingerprint: string };
const maxManifestBytes = 1_000_000;

/** Hash the parsed document, including its publication ID, rather than its date alone. */
export function publicationFingerprint(document: NativeBlogDocument): string {
  const parsed = parseNativeBlogDocument(document);
  if (!parsed) throw new Error("Invalid publication document.");
  return createHash("sha256").update(JSON.stringify(parsed)).digest("hex");
}

/** Only versions already bundled into this deployment enter the public manifest. */
export function publicPublicationVersions(catalog: unknown): PublicVersion[] {
  if (!Array.isArray(catalog)) throw new Error("Invalid deployed publication catalog.");
  const posts = catalog.map(parseNativeBlogDocument);
  if (posts.some(post => !post)) throw new Error("Invalid deployed publication catalog.");
  return (posts as NativeBlogDocument[]).map(post => ({ slug: post.slug, fingerprint: publicationFingerprint(post) }));
}

function publicStatusUrl(): string | null {
  try {
    const origin = new URL(process.env.BLOG_EDITOR_ORIGIN ?? "");
    if (origin.username || origin.password || origin.pathname !== "/" || origin.search || origin.hash) return null;
    const production = origin.origin === "https://mycatalystinnovations.com";
    const local = process.env.NODE_ENV !== "production" && origin.protocol === "http:"
      && ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname);
    if (!production && !local) return null;
    return new URL("/api/blog/publication-status", origin).toString();
  } catch { return null; }
}

async function readPublicVersions(response: Response): Promise<Map<string, string>> {
  if (!response.ok || !response.body) throw new Error("Public version check unavailable.");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > maxManifestBytes) {
        await reader.cancel();
        throw new Error("Public version check exceeded its limit.");
      }
      chunks.push(chunk.value);
    }
  } finally { reader.releaseLock(); }
  const value: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks)));
  if (!value || typeof value !== "object" || !("posts" in value) || !Array.isArray(value.posts)) throw new Error("Invalid public versions.");
  const versions = new Map<string, string>();
  for (const row of value.posts) {
    if (!row || typeof row !== "object" || typeof row.slug !== "string" || row.slug.length > 100
      || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.slug) || versions.has(row.slug)
      || typeof row.fingerprint !== "string" || !/^[a-f0-9]{64}$/.test(row.fingerprint)) throw new Error("Invalid public versions.");
    versions.set(row.slug, row.fingerprint);
  }
  return versions;
}

/** Check the actual public deployment; never send the editor session or GitHub token. */
export async function readArticleDeliveries(posts: NativeBlogDocument[], fetcher: typeof fetch = fetch): Promise<ArticleDeliveries> {
  const checkedAt = new Date().toISOString();
  const unknown = Object.fromEntries(posts.map(post => [post.slug, { status: "unknown" as const, checkedAt }]));
  if (!posts.length) return unknown;
  const url = publicStatusUrl();
  if (!url) return unknown;
  try {
    const response = await fetcher(url, {
      method: "GET", cache: "no-store", redirect: "error", credentials: "omit",
      headers: { Accept: "application/json", "Cache-Control": "no-cache" }, signal: AbortSignal.timeout(5_000),
    });
    const versions = await readPublicVersions(response);
    return Object.fromEntries(posts.map(post => [post.slug, {
      status: versions.get(post.slug) === publicationFingerprint(post) ? "live" as const : "saved" as const,
      checkedAt,
    }]));
  } catch { return unknown; }
}
