import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";

const key = (value) => createHash("sha256").update(value).digest("hex").slice(0, 18);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Convert reviewed website article objects to stable Sanity drafts; no network or credentials. */
export function prepareImport(articles) {
  if (!Array.isArray(articles)) throw new Error("Input must be a JSON array or NDJSON article objects.");
  const seen = new Set();
  return articles.map((article) => {
    const slug = typeof article.slug === "string" ? article.slug : article.slug?.current;
    if (!slug || !slugPattern.test(slug) || seen.has(slug)) throw new Error("Every article needs a unique lowercase hyphenated slug.");
    seen.add(slug);
    if (!article.title || !article.description || !article.introduction || !article.nextStep || !Array.isArray(article.sections) || !article.sections.length) throw new Error(`Missing required content: ${slug}`);
    const sources = (article.sources || []).map((source, index) => ({
      _type: "articleSource", _key: key(`${slug}:source:${source.url}:${index}`),
      title: source.title, url: source.url, reviewedAt: source.reviewedAt,
    }));
    const sections = article.sections.map((section, index) => ({
      _type: "articleSection", _key: key(`${slug}:section:${section.id || index}`),
      ...(section.id ? { id: section.id } : {}),
      heading: section.heading, paragraphs: section.paragraphs,
      ...(section.checklist?.length ? { checklist: section.checklist } : {}),
      ...(typeof section.source === "number" && sources[section.source] ? { sourceKey: sources[section.source]._key } : {}),
    }));
    return {
      // Published IDs must not contain dots. Only Sanity's draft prefix contains a dot.
      _id: `drafts.blog-${slug}`, _type: "blogArticle",
      slug: { _type: "slug", current: slug }, title: article.title, description: article.description,
      category: article.category, publishedAt: article.publishedAt, updatedAt: article.updatedAt,
      introduction: article.introduction, takeaway: article.takeaway, sections,
      example: { _type: "object", title: article.example?.title, text: article.example?.text },
      nextStep: article.nextStep, tools: article.tools || [], solution: article.solution,
      ...(article.industry ? { industry: article.industry } : {}),
      ...(article.demo ? { demo: article.demo } : {}),
      ...(article.related ? { related: article.related } : {}),
      sources,
      // Import never certifies editorial review or publishes on the user's behalf.
      editorialReview: { _type: "object", accurate: false, privateData: false, sources: false, preview: false },
    };
  });
}

export async function main(args = process.argv.slice(2)) {
  const [input, output] = args;
  if (!input || !output || args.length !== 2) throw new Error("Usage: npm run prepare-import -- path/to/articles.json path/to/drafts.ndjson");
  const raw = (await readFile(input, "utf8")).replace(/^\uFEFF/, "").trim();
  const articles = raw.startsWith("[") ? JSON.parse(raw) : raw.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
  const documents = prepareImport(articles);
  // Exclusive creation prevents accidentally overwriting an existing export.
  await writeFile(output, documents.map((item) => JSON.stringify(item)).join("\n") + "\n", { encoding: "utf8", flag: "wx" });
  process.stdout.write(`Prepared ${documents.length} draft article(s). No data was uploaded or published.\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
}
