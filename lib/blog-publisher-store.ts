import { Buffer } from "node:buffer";
import { createHash, randomUUID } from "node:crypto";
import {
  parseNativeBlogDocument, parseNativeBlogInput,
  type NativeBlogDocument, type NativeBlogInput,
} from "./native-blog-content";
import { publicationFingerprint } from "./native-blog-delivery";

const repositoryApi = "https://api.github.com/repos/My-Catalyst-Innovations/catalyst-innovations";
const branch = "main";
const catalogPath = "data/blog-published.json";
const journalPath = "data/blog-publication-journal.json";
const firstEdition = "2026-11-27";
const maxCatalogBytes = 900_000;
const maxJournalBytes = 200_000;
const maxResponseBytes = 1_400_000;
const shaPattern = /^[a-f0-9]{40}$/;
const fingerprintPattern = /^[a-f0-9]{64}$/;
const uuidPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;

export class PublisherStoreError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "PublisherStoreError";
  }
}

export type PublisherReceipt = {
  edition: string;
  slug: string;
  publicationId: string;
  documentFingerprint: string;
  inputFingerprint: string;
  bodyFingerprint: string;
  savedAt: string;
};

export type PublisherState = { posts: NativeBlogDocument[]; journal: PublisherReceipt[]; revision: string };
type Snapshot = PublisherState & { tree: string };

function unavailable() {
  return new PublisherStoreError(503, "Blog publishing is temporarily unavailable. Check this edition's status before retrying.");
}

function conflict(message = "The saved content changed. Read this edition's status and preview again before publishing.") {
  return new PublisherStoreError(409, message);
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw unavailable();
  return value as Record<string, unknown>;
}

function sha(value: unknown): string {
  if (typeof value !== "string" || !shaPattern.test(value)) throw unavailable();
  return value;
}

function calendarDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function moveDay(date: string, days: number): string {
  const moved = new Date(`${date}T12:00:00Z`);
  moved.setUTCDate(moved.getUTCDate() + days);
  return moved.toISOString().slice(0, 10);
}

function validEdition(value: unknown): value is string {
  return calendarDate(value) && value >= firstEdition && new Date(`${value}T12:00:00Z`).getUTCDay() === 5;
}

function newYorkTime(now: Date): { date: string; weekday: number; hour: number } {
  if (!Number.isFinite(now.getTime())) throw new PublisherStoreError(422, "The publication clock is invalid.");
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23",
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find(item => item.type === type)!.value;
  const date = `${part("year")}-${part("month")}-${part("day")}`;
  return { date, weekday: new Date(`${date}T12:00:00Z`).getUTCDay(), hour: Number(part("hour")) };
}

/** One server-owned edition per Friday; retries can recover its receipt all week. */
export function publisherEdition(now: Date = new Date()): { edition: string; canPublish: boolean; reason: string } {
  const local = newYorkTime(now);
  const latestFriday = moveDay(local.date, -((local.weekday + 2) % 7));
  const edition = latestFriday < firstEdition ? firstEdition : latestFriday;
  const canPublish = latestFriday >= firstEdition &&
    ((local.weekday === 5 && local.hour >= 8) || (local.weekday === 6 && local.hour < 8));
  return {
    edition, canPublish,
    reason: canPublish ? "This Friday edition is open for publication."
      : `New editions publish Friday at 8 a.m. through Saturday before 8 a.m. Eastern, beginning ${firstEdition}. Saved editions can always be checked.`,
  };
}

export function inputFingerprint(input: NativeBlogInput): string {
  const parsed = parseNativeBlogInput(input);
  if (!parsed) throw new PublisherStoreError(422, "Check the article fields before previewing.");
  return createHash("sha256").update(JSON.stringify(parsed)).digest("hex");
}

function bodyFingerprint(body: string): string {
  return createHash("sha256").update(body.normalize("NFKC").replace(/\s+/gu, " ").trim()).digest("hex");
}

async function githubJson(path: string, init: RequestInit, fetcher: typeof fetch): Promise<unknown> {
  const token = process.env.BLOG_GITHUB_TOKEN?.trim();
  if (!token) throw unavailable();
  try {
    const response = await fetcher(`${repositoryApi}${path}`, {
      ...init,
      headers: {
        Accept: "application/vnd.github+json", Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28", ...(init.body ? { "Content-Type": "application/json" } : {}),
      },
      cache: "no-store", redirect: "error", signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      await response.body?.cancel();
      if (init.method === "PATCH" && [409, 422].includes(response.status)) throw conflict();
      if (response.status === 422 && init.method === "POST") {
        throw new PublisherStoreError(422, "GitHub could not accept this publication. Check the publishing configuration before retrying.");
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
        if (bytes > maxResponseBytes) { await reader.cancel(); throw unavailable(); }
        chunks.push(chunk.value);
      }
    } finally { reader.releaseLock(); }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks)));
  } catch (error) {
    if (error instanceof PublisherStoreError) throw error;
    throw unavailable();
  }
}

async function readFile(path: string, revision: string, maxBytes: number, fetcher: typeof fetch): Promise<unknown> {
  const file = record(await githubJson(`/contents/${path}?ref=${revision}`, { method: "GET" }, fetcher));
  if (file.type !== "file" || file.path !== path || file.encoding !== "base64" || typeof file.content !== "string" ||
    typeof file.size !== "number" || !Number.isInteger(file.size) || file.size < 2 || file.size > maxBytes) throw unavailable();
  sha(file.sha);
  const encoded = file.content.replace(/[\r\n]/g, "");
  const bytes = Buffer.from(encoded, "base64");
  if (bytes.length !== file.size || bytes.length > maxBytes || bytes.toString("base64") !== encoded) throw unavailable();
  try { return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
  catch { throw unavailable(); }
}

function parseJournal(raw: unknown): PublisherReceipt[] {
  if (!Array.isArray(raw) || raw.length > 5200) throw unavailable();
  const journal = raw.map(value => {
    const receipt = record(value);
    if (Object.keys(receipt).sort().join(",") !== "bodyFingerprint,documentFingerprint,edition,inputFingerprint,publicationId,savedAt,slug" ||
      !validEdition(receipt.edition) || typeof receipt.slug !== "string" || receipt.slug.length > 100 ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(receipt.slug) || typeof receipt.publicationId !== "string" || !uuidPattern.test(receipt.publicationId) ||
      typeof receipt.documentFingerprint !== "string" || !fingerprintPattern.test(receipt.documentFingerprint) ||
      typeof receipt.inputFingerprint !== "string" || !fingerprintPattern.test(receipt.inputFingerprint) ||
      typeof receipt.bodyFingerprint !== "string" || !fingerprintPattern.test(receipt.bodyFingerprint) ||
      typeof receipt.savedAt !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(receipt.savedAt) ||
      !Number.isFinite(Date.parse(receipt.savedAt))) throw unavailable();
    const savedWindow = publisherEdition(new Date(receipt.savedAt));
    if (!savedWindow.canPublish || savedWindow.edition !== receipt.edition) throw unavailable();
    return receipt as PublisherReceipt;
  });
  for (const field of ["edition", "slug", "publicationId"] as const) {
    if (new Set(journal.map(item => item[field])).size !== journal.length) throw unavailable();
  }
  return journal;
}

async function snapshot(fetcher: typeof fetch): Promise<Snapshot> {
  const ref = record(await githubJson(`/git/ref/heads/${branch}`, { method: "GET" }, fetcher));
  if (ref.ref !== `refs/heads/${branch}`) throw unavailable();
  const object = record(ref.object);
  if (object.type !== "commit") throw unavailable();
  const revision = sha(object.sha);
  const commit = record(await githubJson(`/git/commits/${revision}`, { method: "GET" }, fetcher));
  if (sha(commit.sha) !== revision) throw unavailable();
  const tree = sha(record(commit.tree).sha);
  const [catalog, journal] = await Promise.all([
    readFile(catalogPath, revision, maxCatalogBytes, fetcher), readFile(journalPath, revision, maxJournalBytes, fetcher),
  ]);
  if (!Array.isArray(catalog)) throw unavailable();
  const posts = catalog.map(parseNativeBlogDocument);
  if (posts.some(post => !post)) throw unavailable();
  const documents = posts as NativeBlogDocument[];
  for (const field of ["slug", "publicationId"] as const) {
    if (new Set(documents.map(post => post[field])).size !== documents.length) throw unavailable();
  }
  return { posts: documents, journal: parseJournal(journal), revision, tree };
}

export async function readPublisherState(fetcher: typeof fetch = fetch): Promise<PublisherState> {
  const { posts, journal, revision } = await snapshot(fetcher);
  return { posts, journal, revision };
}

export function currentPublisherReceipt(state: PublisherState, edition: string): PublisherReceipt | undefined {
  return state.journal.find(receipt => receipt.edition === edition);
}

function replay(state: PublisherState, edition: string, fingerprint: string) {
  const receipt = currentPublisherReceipt(state, edition);
  if (!receipt) return null;
  if (receipt.inputFingerprint !== fingerprint) throw conflict("This Friday edition already has a saved article. It cannot be replaced through the Echo publisher.");
  return { receipt, idempotentReplay: true };
}

export async function createWeeklyPublication(
  input: NativeBlogInput, expectedRevision: string, edition: string,
  fetcher: typeof fetch = fetch, now: Date = new Date(),
): Promise<{ receipt: PublisherReceipt; idempotentReplay: boolean }> {
  const normalized = parseNativeBlogInput(input);
  if (!normalized || !shaPattern.test(expectedRevision) || !validEdition(edition)) {
    throw new PublisherStoreError(422, "Check the article, edition and preview before publishing.");
  }
  const fingerprint = inputFingerprint(normalized);
  const state = await snapshot(fetcher);
  const repeated = replay(state, edition, fingerprint);
  if (repeated) return repeated;
  const window = publisherEdition(now);
  if (!window.canPublish || window.edition !== edition) throw new PublisherStoreError(403, window.reason);
  if (state.revision !== expectedRevision) throw conflict();
  if (state.posts.some(post => post.publishedAt >= edition && post.publishedAt < moveDay(edition, 7))) {
    throw conflict("An article was already saved manually for this Friday edition. Ask Josh to review it; Echo will not publish another.");
  }
  const bodyHash = bodyFingerprint(normalized.body);
  if (state.posts.some(post => post.slug === normalized.slug || bodyFingerprint(post.body) === bodyHash) ||
    state.journal.some(receipt => receipt.slug === normalized.slug || receipt.bodyFingerprint === bodyHash)) {
    throw conflict("This article address or article text has already been used. Check the saved publication before proceeding.");
  }
  const document = parseNativeBlogDocument({
    ...normalized, publicationId: randomUUID(), publishedAt: newYorkTime(now).date, updatedAt: newYorkTime(now).date,
  });
  if (!document) throw unavailable();
  const receipt: PublisherReceipt = {
    edition, slug: document.slug, publicationId: document.publicationId,
    documentFingerprint: publicationFingerprint(document), inputFingerprint: fingerprint, bodyFingerprint: bodyHash, savedAt: now.toISOString(),
  };
  const catalogContent = `${JSON.stringify([document, ...state.posts], null, 2)}\n`;
  const journalContent = `${JSON.stringify([...state.journal, receipt], null, 2)}\n`;
  if (Buffer.byteLength(catalogContent) > maxCatalogBytes || Buffer.byteLength(journalContent) > maxJournalBytes) {
    throw new PublisherStoreError(422, "The publication collection has reached its storage limit. Ask Josh to review storage before adding an article.");
  }
  const tree = record(await githubJson("/git/trees", { method: "POST", body: JSON.stringify({
    base_tree: state.tree,
    tree: [
      { path: catalogPath, mode: "100644", type: "blob", content: catalogContent },
      { path: journalPath, mode: "100644", type: "blob", content: journalContent },
    ],
  }) }, fetcher));
  const commit = record(await githubJson("/git/commits", { method: "POST", body: JSON.stringify({
    message: `Publish weekly blog ${edition} (${receipt.publicationId})`, tree: sha(tree.sha), parents: [state.revision],
  }) }, fetcher));
  const nextRevision = sha(commit.sha);
  try {
    const result = record(await githubJson(`/git/refs/heads/${branch}`, { method: "PATCH", body: JSON.stringify({ sha: nextRevision, force: false }) }, fetcher));
    if (result.ref !== `refs/heads/${branch}` || sha(record(result.object).sha) !== nextRevision) throw unavailable();
  } catch (error) {
    // A race or lost acknowledgement can have committed successfully. The durable
    // journal recovers that result even after a later human edit or withdrawal.
    if (error instanceof PublisherStoreError && [409, 503].includes(error.status)) {
      const current = await snapshot(fetcher);
      const recovered = replay(current, edition, fingerprint);
      if (recovered) return recovered;
    }
    throw error;
  }
  return { receipt, idempotentReplay: false };
}
