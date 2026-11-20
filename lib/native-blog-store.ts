import { Buffer } from "node:buffer";
import {
  parseNativeBlogDocument,
  parseNativeBlogInput,
  type NativeBlogDocument,
  type NativeBlogInput,
} from "./native-blog-content";

const repositoryApi = "https://api.github.com/repos/My-Catalyst-Innovations/catalyst-innovations";
const publicationPath = "data/blog-published.json";
const contentsEndpoint = `${repositoryApi}/contents/${publicationPath}`;
const branch = "main";
const maxCatalogBytes = 900_000;
const maxResponseBytes = 1_400_000;
const revisionPattern = /^[a-f0-9]{40}$/;
const operationPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;

export class NativeBlogStoreError extends Error {
  constructor(public readonly status: 503 | 409 | 422, message: string) {
    super(message);
    this.name = "NativeBlogStoreError";
  }
}

function unavailable() {
  return new NativeBlogStoreError(503, "Blog publishing is temporarily unavailable. Try again with the same publication request.");
}

function conflict() {
  return new NativeBlogStoreError(409, "The published content changed. Refresh it before publishing again.");
}

async function githubJson(url: string, init: RequestInit, fetcher: typeof fetch): Promise<unknown> {
  const token = process.env.BLOG_GITHUB_TOKEN?.trim();
  if (!token) throw unavailable();
  try {
    const response = await fetcher(url, {
      ...init,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
      },
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      await response.body?.cancel();
      if (init.method === "PUT" && response.status === 409) throw conflict();
      if (init.method === "PUT" && response.status === 422) {
        throw new NativeBlogStoreError(422, "GitHub could not accept this publication. Check the publishing configuration before retrying.");
      }
      throw unavailable();
    }
    if (!response.body) throw unavailable();
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    try {
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        bytes += chunk.value.byteLength;
        if (bytes > maxResponseBytes) {
          await reader.cancel();
          throw unavailable();
        }
        chunks.push(chunk.value);
      }
    } finally {
      reader.releaseLock();
    }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks)));
  } catch (error) {
    if (error instanceof NativeBlogStoreError) throw error;
    throw unavailable();
  }
}

export async function readPublicationCatalog(fetcher: typeof fetch = fetch): Promise<{ posts: NativeBlogDocument[]; revision: string }> {
  const response = await githubJson(`${contentsEndpoint}?ref=${branch}`, { method: "GET" }, fetcher);
  try {
    const file = response as { type: unknown; path: unknown; sha: unknown; encoding: unknown; content: unknown; size: unknown };
    if (!file || file.type !== "file" || file.path !== publicationPath || file.encoding !== "base64" ||
      typeof file.sha !== "string" || !revisionPattern.test(file.sha) || typeof file.content !== "string" ||
      typeof file.size !== "number" || !Number.isInteger(file.size) || file.size > maxCatalogBytes || file.size < 2) throw unavailable();
    const encoded = file.content.replace(/[\r\n]/g, "");
    const bytes = Buffer.from(encoded, "base64");
    if (bytes.length !== file.size || bytes.length > maxCatalogBytes || bytes.toString("base64") !== encoded) throw unavailable();
    const raw: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    if (!Array.isArray(raw)) throw unavailable();
    const posts = raw.map(value => parseNativeBlogDocument(value));
    if (posts.some(post => !post)) throw unavailable();
    const documents = posts as NativeBlogDocument[];
    if (new Set(documents.map(post => post.slug)).size !== documents.length ||
      new Set(documents.map(post => post.publicationId)).size !== documents.length) throw unavailable();
    return { posts: documents, revision: file.sha };
  } catch {
    throw unavailable();
  }
}

function sameContent(document: NativeBlogDocument, input: NativeBlogInput) {
  return document.title === input.title && document.slug === input.slug && document.description === input.description &&
    document.category === input.category && document.body === input.body;
}

function publicationMessage(slug: string, operationId: string) {
  return `Publish blog ${slug} (${operationId})`;
}

async function replayPublication(document: NativeBlogDocument, input: NativeBlogInput, operationId: string, fetcher: typeof fetch) {
  if (!sameContent(document, input)) throw conflict();
  const response = await githubJson(`${repositoryApi}/commits?sha=${branch}&path=${encodeURIComponent(publicationPath)}&per_page=100`, { method: "GET" }, fetcher);
  if (!Array.isArray(response)) throw unavailable();
  const commit = response.find(item => item?.commit?.message === publicationMessage(document.slug, operationId));
  if (typeof commit?.sha !== "string" || !revisionPattern.test(commit.sha)) throw unavailable();
  return { document, commitSha: commit.sha, status: "queued" as const, idempotentReplay: true };
}

export async function publishDocument(input: NativeBlogInput, expectedRevision: string, operationId: string, fetcher: typeof fetch = fetch) {
  const normalized = parseNativeBlogInput(input);
  if (!normalized || !revisionPattern.test(expectedRevision) || !operationPattern.test(operationId)) {
    throw new NativeBlogStoreError(422, "Check the article, publication identifier and catalog revision before publishing.");
  }
  const catalog = await readPublicationCatalog(fetcher);
  const repeated = catalog.posts.find(post => post.publicationId === operationId);
  if (repeated) return replayPublication(repeated, normalized, operationId, fetcher);
  if (catalog.revision !== expectedRevision) throw conflict();
  const previous = catalog.posts.find(post => post.slug === normalized.slug);
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const document = parseNativeBlogDocument({ ...normalized, publishedAt: previous?.publishedAt ?? today, updatedAt: today, publicationId: operationId });
  if (!document) throw unavailable();
  const posts = previous ? catalog.posts.map(post => post.slug === document.slug ? document : post) : [document, ...catalog.posts];
  const content = Buffer.from(`${JSON.stringify(posts, null, 2)}\n`, "utf-8");
  if (content.byteLength > maxCatalogBytes) throw new NativeBlogStoreError(422, "The published blog collection has reached its storage limit.");
  let response: unknown;
  try {
    response = await githubJson(contentsEndpoint, {
      method: "PUT",
      body: JSON.stringify({ branch, sha: catalog.revision, message: publicationMessage(document.slug, operationId), content: content.toString("base64") }),
    }, fetcher);
  } catch (error) {
    if (error instanceof NativeBlogStoreError && error.status === 409) {
      const current = await readPublicationCatalog(fetcher);
      const concurrent = current.posts.find(post => post.publicationId === operationId);
      if (concurrent) return replayPublication(concurrent, normalized, operationId, fetcher);
    }
    throw error;
  }
  const result = response as { commit?: { sha?: unknown } };
  if (typeof result?.commit?.sha !== "string" || !revisionPattern.test(result.commit.sha)) throw unavailable();
  return { document, commitSha: result.commit.sha, status: "queued" as const, idempotentReplay: false };
}
