/* eslint-disable @typescript-eslint/no-require-imports -- Exercise the server module with an offline provider. */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

const contentFilename = path.join(__dirname, "..", "lib", "native-blog-content.ts");
const contentModule = new Module(contentFilename, module);
contentModule.filename = contentFilename;
contentModule.paths = Module._nodeModulePaths(path.dirname(contentFilename));
contentModule._compile(ts.transpileModule(fs.readFileSync(contentFilename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, contentFilename);
const filename = path.join(__dirname, "..", "lib", "native-blog-store.ts");
const loaded = new Module(filename, module);
loaded.filename = filename;
loaded.paths = Module._nodeModulePaths(path.dirname(filename));
const originalRequire = loaded.require.bind(loaded);
loaded.require = name => name === "./native-blog-content" ? contentModule.exports : originalRequire(name);
loaded._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, filename);
const { readPublicationCatalog, publishDocument, NativeBlogStoreError } = loaded.exports;

const repository = "https://api.github.com/repos/DVass81/catalyst-innovations";
const endpoint = `${repository}/contents/data/blog-published.json`;
const revision = "a".repeat(40);
const nextRevision = "b".repeat(40);
const commitSha = "c".repeat(40);
const operation = "7abf2afe-85b4-4000-8111-5d045837b115";
const otherOperation = "129c654a-f99a-4000-8333-1d90c2749fba";
const article = { title: "A practical way to save time", slug: "save-time", description: "A reviewable way to reduce repeat administrative work.", category: "Operations", body: "A complete approved article with safe plain text. Start by reviewing one recurring administrative task with the person who owns the process." };
const published = { ...article, publicationId: operation, publishedAt: "2026-10-01", updatedAt: "2026-10-01" };

function catalogResponse(posts = [], sha = revision) {
  const bytes = Buffer.from(`${JSON.stringify(posts)}\n`);
  return Response.json({ type: "file", path: "data/blog-published.json", encoding: "base64", sha, size: bytes.length, content: bytes.toString("base64") });
}
async function expectStatus(promise, status) {
  await assert.rejects(promise, error => error instanceof NativeBlogStoreError && error.status === status && !error.message.includes("server-secret"));
}
test.beforeEach(() => { process.env.BLOG_GITHUB_TOKEN = "server-secret"; });
test.afterEach(() => { delete process.env.BLOG_GITHUB_TOKEN; });

test("catalog reads use the fixed main file and a bounded, uncacheable server request", async () => {
  const result = await readPublicationCatalog(async (url, options) => {
    assert.equal(url, `${endpoint}?ref=main`);
    assert.equal(options.method, "GET");
    assert.equal(options.headers.Authorization, "Bearer server-secret");
    assert.equal(options.redirect, "error");
    assert.equal(options.cache, "no-store");
    assert.ok(options.signal instanceof AbortSignal);
    return catalogResponse([published]);
  });
  assert.deepEqual(result, { posts: [published], revision });
});

test("missing credentials, missing file, bad credentials and unavailable provider fail closed", async () => {
  delete process.env.BLOG_GITHUB_TOKEN;
  await expectStatus(readPublicationCatalog(async () => { throw new Error("must not fetch"); }), 503);
  process.env.BLOG_GITHUB_TOKEN = "server-secret";
  for (const status of [404, 401, 403, 429, 500]) await expectStatus(readPublicationCatalog(async () => new Response("server-secret provider error", { status })), 503);
  await expectStatus(readPublicationCatalog(async () => { throw new Error("server-secret timeout"); }), 503);
});

test("malformed or unbounded catalog responses never become an empty publication", async () => {
  const bytes = Buffer.from("{}");
  const malformed = [
    { type: "dir", path: "data/blog-published.json", encoding: "base64", sha: revision, size: 2, content: bytes.toString("base64") },
    { type: "file", path: "other.json", encoding: "base64", sha: revision, size: 2, content: bytes.toString("base64") },
    { type: "file", path: "data/blog-published.json", encoding: "none", sha: revision, size: 2, content: "" },
    { type: "file", path: "data/blog-published.json", encoding: "base64", sha: revision, size: 900001, content: "" },
    { type: "file", path: "data/blog-published.json", encoding: "base64", sha: revision, size: 2, content: "{}" },
    { type: "file", path: "data/blog-published.json", encoding: "base64", sha: revision, size: 2, content: bytes.toString("base64") },
  ];
  for (const value of malformed) await expectStatus(readPublicationCatalog(async () => Response.json(value)), 503);
  await expectStatus(readPublicationCatalog(async () => new Response("x".repeat(1400001))), 503);
  await expectStatus(readPublicationCatalog(async () => catalogResponse([{ ...published, updatedAt: "bad-date" }])), 503);
  await expectStatus(readPublicationCatalog(async () => catalogResponse([published, { ...published, publicationId: otherOperation }])), 503);
  await expectStatus(readPublicationCatalog(async () => catalogResponse([published, { ...published, slug: "another" }])), 503);
});

test("publish sends only the normalized approved article with the latest SHA and returns queued", async () => {
  let writes = 0;
  const result = await publishDocument({ ...article, title: ` ${article.title} ` }, revision, operation, async (url, options) => {
    if (options.method === "GET") return catalogResponse();
    assert.equal(url, endpoint);
    writes++;
    const body = JSON.parse(options.body);
    assert.equal(body.branch, "main");
    assert.equal(body.sha, revision);
    assert.equal(body.message, `Publish blog ${article.slug} (${operation})`);
    const [document] = JSON.parse(Buffer.from(body.content, "base64").toString("utf8"));
    assert.equal(document.title, article.title);
    assert.equal(document.publicationId, operation);
    assert.match(document.publishedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(document.updatedAt, document.publishedAt);
    return Response.json({ commit: { sha: commitSha } });
  });
  assert.equal(writes, 1);
  assert.equal(result.status, "queued");
  assert.equal(result.commitSha, commitSha);
  assert.equal(result.idempotentReplay, false);
});

test("same-slug edit preserves its first publication day and every other post", async () => {
  const other = { ...published, slug: "retained-post", publicationId: otherOperation };
  const updatedBody = `${article.body}\n\nAn explicitly approved updated edition.`;
  const result = await publishDocument({ ...article, body: updatedBody }, revision, otherOperation, async (_url, options) => {
    if (options.method === "GET") return catalogResponse([published, { ...other, publicationId: "323783c5-160d-4000-8333-111111111111" }]);
    const posts = JSON.parse(Buffer.from(JSON.parse(options.body).content, "base64").toString());
    assert.equal(posts.length, 2);
    assert.equal(posts[0].publishedAt, published.publishedAt);
    assert.equal(posts[0].body, updatedBody);
    assert.deepEqual(posts[1], { ...other, publicationId: "323783c5-160d-4000-8333-111111111111" });
    return Response.json({ commit: { sha: commitSha } });
  });
  assert.equal(result.document.slug, published.slug);
});

test("invalid inputs and stale revisions cannot write", async () => {
  await expectStatus(publishDocument({ ...article, title: "" }, revision, operation, async () => { throw new Error("must not fetch"); }), 422);
  await expectStatus(publishDocument(article, "bad-sha", operation, async () => { throw new Error("must not fetch"); }), 422);
  await expectStatus(publishDocument(article, revision, "bad-operation", async () => { throw new Error("must not fetch"); }), 422);
  await expectStatus(publishDocument(article, revision, operation, async (_url, options) => {
    assert.equal(options.method, "GET");
    return catalogResponse([], nextRevision);
  }), 409);
});

test("identical retry recovers the actual commit even with a stale catalog SHA", async () => {
  const result = await publishDocument(article, nextRevision, operation, async (url, options) => {
    assert.equal(options.method, "GET");
    if (url === `${endpoint}?ref=main`) return catalogResponse([published]);
    assert.equal(url, `${repository}/commits?sha=main&path=data%2Fblog-published.json&per_page=100`);
    return Response.json([{ sha: "d".repeat(40), commit: { message: "Another approved publication" } }, { sha: commitSha, commit: { message: `Publish blog ${article.slug} (${operation})` } }]);
  });
  assert.equal(result.idempotentReplay, true);
  assert.equal(result.commitSha, commitSha);
  assert.deepEqual(result.document, published);
});

test("reused operation with changed content or missing commit proof cannot replay", async () => {
  await expectStatus(publishDocument({ ...article, title: "Different title" }, revision, operation, async (_url, options) => {
    assert.equal(options.method, "GET");
    return catalogResponse([published]);
  }), 409);
  await expectStatus(publishDocument(article, revision, operation, async url => url === `${endpoint}?ref=main` ? catalogResponse([published]) : Response.json([])), 503);
});

test("two concurrent identical requests produce one durable write and a verified replay", async () => {
  let current = [];
  let catalogReads = 0;
  let bothRead;
  const ready = new Promise(resolve => { bothRead = resolve; });
  let successfulWrites = 0;
  const provider = async (url, options) => {
    if (url.startsWith(`${repository}/commits?`)) return Response.json([{ sha: commitSha, commit: { message: `Publish blog ${article.slug} (${operation})` } }]);
    if (options.method === "GET") {
      catalogReads++;
      if (catalogReads <= 2) {
        if (catalogReads === 2) bothRead();
        await ready;
        return catalogResponse();
      }
      return catalogResponse(current, nextRevision);
    }
    if (successfulWrites) return Response.json({ message: "SHA does not match" }, { status: 409 });
    successfulWrites++;
    current = JSON.parse(Buffer.from(JSON.parse(options.body).content, "base64").toString());
    return Response.json({ commit: { sha: commitSha } });
  };
  const results = await Promise.all([publishDocument(article, revision, operation, provider), publishDocument(article, revision, operation, provider)]);
  assert.equal(successfulWrites, 1);
  assert.equal(current.length, 1);
  assert.equal(results.filter(result => result.idempotentReplay).length, 1);
});

test("another writer conflict, provider validation error and malformed acknowledgement remain failures", async () => {
  for (const [status, expected] of [[409, 409], [422, 422], [403, 503], [500, 503]]) {
    await expectStatus(publishDocument(article, revision, operation, async (_url, options) => options.method === "GET" ? catalogResponse() : Response.json({ message: "server-secret" }, { status })), expected);
  }
  await expectStatus(publishDocument(article, revision, operation, async (_url, options) => options.method === "GET" ? catalogResponse() : Response.json({ commit: { sha: "invalid" } })), 503);
});

test("an ambiguous network failure can be retried without publishing a second commit", async () => {
  let current = [];
  let writes = 0;
  const provider = async (url, options) => {
    if (url.startsWith(`${repository}/commits?`)) return Response.json([{ sha: commitSha, commit: { message: `Publish blog ${article.slug} (${operation})` } }]);
    if (options.method === "GET") return catalogResponse(current, writes ? nextRevision : revision);
    writes++;
    current = JSON.parse(Buffer.from(JSON.parse(options.body).content, "base64").toString());
    throw new Error("server-secret response lost after commit");
  };
  await expectStatus(publishDocument(article, revision, operation, provider), 503);
  const result = await publishDocument(article, revision, operation, provider);
  assert.equal(writes, 1);
  assert.equal(result.idempotentReplay, true);
});

test("catalog growth past its limit rejects before any write", async () => {
  const largeCatalog = Array.from({ length: 15 }, (_, index) => ({ ...published, slug: `existing-${index}`, body: "x".repeat(58000), publicationId: `323783c5-160d-4000-8333-${String(index).padStart(12, "0")}` }));
  await expectStatus(publishDocument({ ...article, body: "x".repeat(59000) }, revision, otherOperation, async (_url, options) => {
    assert.equal(options.method, "GET");
    return catalogResponse(largeCatalog);
  }), 422);
});
