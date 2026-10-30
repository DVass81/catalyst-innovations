/* eslint-disable @typescript-eslint/no-require-imports -- Existing standalone TypeScript harness; all CMS requests are mocked. */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const { pathToFileURL } = require("node:url");

function load(file, mocks = {}) {
  const filename = path.join(__dirname, "..", file);
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  const original = mod.require.bind(mod);
  mod.require = id => Object.hasOwn(mocks, id) ? mocks[id] : original(id);
  mod._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, filename);
  return mod.exports;
}

const articles = load("data/insights.ts").insights;
const blog = load("lib/blog.ts", {
  "@/data/insights": { insights: articles },
  "@/lib/calculators": load("lib/calculators.ts"),
  "@/data/services": load("data/services.ts"),
  "@/data/industryNeeds": load("data/industryNeeds.ts"),
});
const today = "2026-10-30";
const clone = value => structuredClone(value);
const fixture = () => ({ ...clone(articles[0]), _id: `blog-${articles[0].slug}` });
const reader = fetcher => blog.readPublishedBlog({ projectId: "abc12345", dataset: "production", today, fetcher });
const response = result => new Response(JSON.stringify({ result }), { status: 200, headers: { "Content-Type": "application/json" } });

test("normalizer preserves all eight existing Insight article shapes", () => {
  for (const article of articles) assert.deepEqual(blog.normalizeBlogArticle(article, today), article);
});

test("Studio draft-import output becomes the same public content only after explicit publication", async () => {
  const script = pathToFileURL(path.join(__dirname, "..", "studio/scripts/prepare-import.mjs")).href;
  const { prepareImport } = await import(script);
  const drafts = prepareImport(articles);
  assert.equal(drafts.length, 8);
  assert.deepEqual(drafts, prepareImport(articles), "stable draft and reference IDs");
  drafts.forEach((draft, index) => {
    assert.equal(blog.normalizeBlogArticle(draft, today), null, "drafts stay private");
    assert.ok(Object.values(draft.editorialReview).filter(value => typeof value === "boolean").every(value => value === false));
    assert.deepEqual(blog.normalizeBlogArticle({ ...draft, _id: draft._id.replace(/^drafts\./, "") }, today), articles[index]);
  });
  assert.throws(() => prepareImport([articles[0], articles[0]]), /unique/);
});

test("source keys survive reordering, legacy anchors remain stable, and new sections use their keys", () => {
  const article = fixture();
  article.sources = [
    { ...article.sources[0], _key: "source-a" },
    { title: "Second reference", url: "https://www.nist.gov/", reviewedAt: today, _key: "source-b" },
  ];
  article.sections[0] = { ...article.sections[0], _key: "section-one", sourceKey: "source-a" };
  article.sections[1] = { ...article.sections[1], _key: "section_two", source: null, sourceKey: "source-b", id: null };
  article.sources.reverse();
  const actual = blog.normalizeBlogArticle(article, today);
  assert.ok(actual);
  assert.equal(actual.sections[0].id, articles[0].sections[0].id);
  assert.equal(actual.sections[0].source, 1);
  assert.equal(actual.sections[1].id, "section_two");
  assert.equal(actual.sections[1].source, 0);
  assert.equal(actual.sources[0].title, "Second reference");
  assert.equal(actual.sources[0]._key, undefined, "only public Insight fields leave the adapter");
});

test("GROQ null optional fields and projected coverImage produce safe Insight values", () => {
  const article = fixture();
  article.industry = null; article.demo = null; article.related = null; article.updatedAt = null;
  article.sections = article.sections.map(section => ({ ...section, _key: null, sourceKey: null, source: section.source ?? null, checklist: section.checklist ?? null }));
  article.coverImage = { url: "https://cdn.sanity.io/images/abc12345/production/asset-1200x630.jpg", alt: "Connected work represented by blue layers", caption: null };
  const actual = blog.normalizeBlogArticle(article, today);
  assert.ok(actual);
  assert.equal(actual.updatedAt, article.publishedAt);
  assert.equal(actual.industry, undefined);
  assert.equal(actual.cover.url, article.coverImage.url);
  assert.equal(actual.cover.caption, undefined);
  assert.equal(actual.sections[1].source, articles[0].sections[1].source);
});

test("normalizer fails closed on private IDs, future/invalid dates, stale references and unknown destinations", () => {
  const invalid = [
    article => { article._id = "drafts.blog-example"; },
    article => { article._id = "versions.release.blog-example"; },
    article => { article._id = "other.private.namespace"; },
    article => { article.publishedAt = "2026-10-31"; },
    article => { article.updatedAt = "2026-10-31"; },
    article => { article.updatedAt = "2026-01-01"; },
    article => { article.publishedAt = "2026-02-30"; },
    article => { article.sources[0].reviewedAt = "2026-10-31"; },
    article => { article.solution = "invented-service"; },
    article => { article.industry = "invented-industry"; },
    article => { article.tools = ["unknown-tool"]; },
    article => { article.tools = ["manual-work", "manual-work"]; },
    article => { article.related = ["same-article", "same-article"]; },
    article => { article.sections[0].source = 25; },
    article => { article.sections[0].sourceKey = "deleted-source"; },
    article => { article.sections[1].id = article.sections[0].id; },
    article => { article.sections[0]._key = "same-key"; article.sections[1]._key = "same-key"; },
    article => { article.sources.push({ ...article.sources[0], _key: "duplicate" }); article.sources[0]._key = "duplicate"; },
    article => { article.sections[0].sourceKey = "source-a"; article.sources.push({ ...article.sources[0], _key: "source-a" }); article.sections[0].source = 0; },
    article => { article.title = "<script>alert(1)</script>"; },
    article => { article.sources[0].url = "not a URL"; },
    article => { article.sources[0].url = "http://www.nist.gov/"; },
    article => { article.sources[0].url = "https://person:password@example.test/"; },
    article => { article.sources[0].url = "https://example.test/?email=private@example.test"; },
    article => { article.coverImage = { url: "https://example.test/image.jpg", alt: "Example" }; },
    article => { article.coverImage = { url: "https://cdn.sanity.io/files/project/dataset/private.pdf", alt: "Example" }; },
    article => { article.coverImage = { url: "https://cdn.sanity.io/images/project/dataset/image.jpg", alt: "" }; },
  ];
  for (const change of invalid) {
    const article = fixture(); change(article);
    assert.equal(blog.normalizeBlogArticle(article, today), null, change.toString());
  }
  for (const input of [null, undefined, 1, "text", {}, []]) assert.equal(blog.normalizeBlogArticle(input, today), null);
  assert.equal(blog.normalizeBlogArticle(fixture(), "not a date"), null);
});

test("public field bounds agree with the Studio publishing schema", () => {
  const article = fixture();
  article.title = "t".repeat(120); article.description = "d".repeat(240);
  article.introduction = "i".repeat(5000); article.takeaway = "t".repeat(1000);
  article.nextStep = "n".repeat(3000); article.sections[0].paragraphs = ["p".repeat(5000)];
  article.sources[0].title = "s".repeat(300);
  assert.ok(blog.normalizeBlogArticle(article, today));
  for (const [field, max] of [["title", 120], ["description", 240], ["introduction", 5000], ["takeaway", 1000], ["nextStep", 3000]]) {
    assert.equal(blog.normalizeBlogArticle({ ...article, [field]: "x".repeat(max + 1) }, today), null, field);
  }
});

test("without CMS setup the eight static articles load without any account or network", async () => {
  const result = await blog.readPublishedBlog({ fetcher() { throw new Error("must not fetch"); }, today });
  assert.equal(result.length, 8);
  assert.deepEqual(result.map(article => article.slug), [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).map(article => article.slug));
});

test("configured empty CMS stays empty instead of resurrecting static articles", async () => {
  assert.deepEqual(await reader(async () => response([])), []);
});

test("reader uses blogArticle schema, published perspective and no authenticated browser token", async () => {
  let request;
  const actual = await reader(async (input, options) => { request = { url: new URL(input), options }; return response([fixture()]); });
  assert.equal(actual[0].slug, articles[0].slug);
  assert.equal(request.url.origin, "https://abc12345.api.sanity.io");
  assert.equal(request.url.searchParams.get("perspective"), "published");
  assert.equal(request.url.searchParams.get("$today"), JSON.stringify(today));
  const query = request.url.searchParams.get("query");
  assert.match(query, /_type == "blogArticle"/);
  assert.match(query, /drafts\.\*\*/); assert.match(query, /versions\.\*\*/);
  assert.match(query, /sourceKey/); assert.match(query, /sources\[\]\{_key/);
  assert.match(query, /coverImage\.asset->url/);
  assert.doesNotMatch(query, /editorialReview|promotion|token|password/);
  assert.equal(request.options.headers, undefined);
  assert.equal(request.options.next.revalidate, 300);
  assert.ok(request.options.signal instanceof AbortSignal);
});

test("configured reader rejects failed, malformed, duplicate or private catalogs without a static fallback", async () => {
  const privateArticle = { ...fixture(), _id: "drafts.blog-private" };
  const futureArticle = { ...fixture(), publishedAt: "2026-10-31" };
  const missingId = fixture(); delete missingId._id;
  for (const fetcher of [
    async () => new Response("provider unavailable", { status: 500 }),
    async () => new Response("not JSON"),
    async () => new Response(JSON.stringify({ result: {} })),
    async () => new Response("x".repeat(2_000_001)),
    async () => response([fixture(), fixture()]),
    async () => response([privateArticle]),
    async () => response([futureArticle]),
    async () => response([missingId]),
    async () => { throw new Error("network failed"); },
  ]) await assert.rejects(reader(fetcher), error => error instanceof blog.BlogUnavailableError);
  let calls = 0;
  for (const options of [{ projectId: "../private" }, { projectId: "abc12345", dataset: "bad/dataset" }, { projectId: "abc12345", today: "bad date" }]) {
    await assert.rejects(blog.readPublishedBlog({ ...options, fetcher() { calls++; throw new Error("must not fetch"); } }), blog.BlogUnavailableError);
  }
  assert.equal(calls, 0);
});

test("future editor share copies contain only reviewed article and channel identifiers", () => {
  const editor = load("studio/components/types.ts");
  const article = { slug: { current: articles[0].slug } };
  for (const channel of ["linkedin", "google_business_profile", "email", "direct"]) {
    const url = new URL(editor.publicArticleCampaignUrl(article, channel));
    assert.equal(url.pathname, `/insights/${articles[0].slug}`);
    assert.deepEqual([...url.searchParams], [["ci_source", channel], ["ci_article", articles[0].slug]]);
  }
  assert.equal(editor.publicArticleCampaignUrl(article, "person@example.test"), undefined);
  assert.equal(editor.publicArticleCampaignUrl({ slug: { current: "private/person" } }, "email"), undefined);
});
