/** Shared, deterministic content snapshot. No credentials, network calls or identity claims. */
type RecordValue = Record<string, unknown>;
const record = (value: unknown): RecordValue => value && typeof value === "object" && !Array.isArray(value) ? value as RecordValue : {};
const string = (value: unknown) => typeof value === "string" ? value.trim() : "";
const optional = (value: unknown) => string(value) || null;
const list = (value: unknown) => Array.isArray(value) ? value : [];
const strings = (value: unknown) => list(value).map(string);

export function approvalContentPayload(input: unknown): string {
  const doc = record(input);
  const image = record(doc.coverImage ?? doc.cover);
  const imageAsset = record(image.asset);
  const example = record(doc.example);
  return JSON.stringify({
    version: 1,
    title: string(doc.title), slug: string(typeof doc.slug === "string" ? doc.slug : record(doc.slug).current),
    description: string(doc.description), category: string(doc.category),
    publishedAt: string(doc.publishedAt), updatedAt: string(doc.updatedAt) || string(doc.publishedAt),
    introduction: string(doc.introduction), takeaway: string(doc.takeaway),
    sections: list(doc.sections).map(value => {
      const part = record(value);
      return { key: optional(part._key), id: optional(part.id), heading: string(part.heading), paragraphs: strings(part.paragraphs), checklist: strings(part.checklist), sourceKey: optional(part.sourceKey), source: typeof part.source === "number" ? part.source : null };
    }),
    example: { title: string(example.title), text: string(example.text) }, nextStep: string(doc.nextStep),
    tools: strings(doc.tools), solution: optional(doc.solution), industry: optional(doc.industry), demo: optional(doc.demo), related: strings(doc.related),
    sources: list(doc.sources).map(value => {
      const source = record(value);
      return { key: optional(source._key), title: string(source.title), url: string(source.url), reviewedAt: string(source.reviewedAt), publishedAt: optional(source.publishedAt), methodology: optional(source.methodology), context: optional(source.context) };
    }),
    cover: Object.keys(image).length ? { asset: optional(image.assetRef) || optional(imageAsset._ref) || optional(image.url), alt: string(image.alt), caption: optional(image.caption) } : null,
    containsStatistics: doc.containsStatistics === true,
    evidence: list(doc.evidence).map(value => {
      const evidence = record(value);
      return { key: optional(evidence._key), claim: string(evidence.claim), sourceKey: string(evidence.sourceKey), context: string(evidence.context), methodology: string(evidence.methodology), dataDate: string(evidence.dataDate) };
    }),
  });
}

/** Native Web Crypto in the authenticated Studio; the server verifies the same SHA-256. */
export async function contentFingerprint(input: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(approvalContentPayload(input));
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, "0")).join("");
}

export function articleWordCount(input: unknown): number {
  const doc = record(input);
  const example = record(doc.example);
  const body = [doc.introduction, doc.takeaway, example.title, example.text, doc.nextStep,
    ...list(doc.sections).flatMap(value => { const part = record(value); return [part.heading, ...list(part.paragraphs), ...list(part.checklist)]; }),
  ].map(string).join(" ").trim();
  return body ? body.split(/\s+/).length : 0;
}
