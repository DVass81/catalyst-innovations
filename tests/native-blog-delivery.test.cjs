/* eslint-disable @typescript-eslint/no-require-imports -- Exercise delivery checks offline without credentials or publication writes. */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

function load(file, mocks = {}) {
  const filename = path.join(__dirname, "..", file);
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  const original = mod.require.bind(mod);
  mod.require = id => Object.hasOwn(mocks, id) ? mocks[id] : original(id);
  mod._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText, filename);
  return mod.exports;
}
const content = load("lib/native-blog-content.ts");
const delivery = load("lib/native-blog-delivery.ts", { "./native-blog-content": content });
const document = {
  title: "A practical way to save time", slug: "save-time", category: "Operations",
  description: "A reviewable way to reduce repeat administrative work.",
  body: "A complete approved article with safe plain text. Start by reviewing one recurring administrative task with the person who owns the process.",
  publicationId: "7abf2afe-85b4-4000-8111-5d045837b115", publishedAt: "2026-11-20", updatedAt: "2026-11-20",
};
const otherId = "129c654a-f99a-4000-8333-1d90c2749fba";
const origin = "https://mycatalystinnovations.com";
const manifest = posts => Response.json({ posts: delivery.publicPublicationVersions(posts) });

function environment(t, overrides = {}) {
  const values = { BLOG_EDITOR_ORIGIN: origin, NODE_ENV: "production", BLOG_GITHUB_TOKEN: "offline-secret-never-transmitted", ...overrides };
  const before = Object.fromEntries(Object.keys(values).map(key => [key, process.env[key]]));
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
  t.after(() => {
    for (const [key, value] of Object.entries(before)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  });
}

test("live requires the exact saved version, including edits made on the same day", async t => {
  environment(t);
  const revised = { ...document, body: `${document.body} This is the approved revision.`, publicationId: otherId };
  const saved = await delivery.readArticleDeliveries([revised], async () => manifest([document]));
  assert.equal(saved[document.slug].status, "saved");
  assert.match(saved[document.slug].checkedAt, /^\d{4}-\d{2}-\d{2}T/);
  const live = await delivery.readArticleDeliveries([revised], async () => manifest([revised]));
  assert.equal(live[document.slug].status, "live");
  const missing = await delivery.readArticleDeliveries([document], async () => manifest([]));
  assert.equal(missing[document.slug].status, "saved");
  assert.notEqual(delivery.publicationFingerprint(document), delivery.publicationFingerprint({ ...document, publicationId: otherId }));
  assert.equal(delivery.publicationFingerprint(document), delivery.publicationFingerprint({ ...document, unexpected: "ignored by schema" }));
});

test("an image or its alternative text changes the exact version without changing article text", async t => {
  environment(t);
  const image = content.nativeBlogImages[0];
  const illustrated = { ...document, featuredImage: { assetId: image.assetId, alt: image.alt } };
  const described = { ...illustrated, featuredImage: { ...illustrated.featuredImage, alt: "Workers coordinate a metal component in a manufacturing workplace." } };
  assert.notEqual(delivery.publicationFingerprint(illustrated), delivery.publicationFingerprint(document));
  assert.notEqual(delivery.publicationFingerprint(illustrated), delivery.publicationFingerprint(described));
  assert.equal((await delivery.readArticleDeliveries([illustrated], async () => manifest([document])))[document.slug].status, "saved");
  assert.equal((await delivery.readArticleDeliveries([described], async () => manifest([illustrated])))[document.slug].status, "saved");
  assert.equal((await delivery.readArticleDeliveries([illustrated], async () => manifest([illustrated])))[document.slug].status, "live");
});

test("public verification only requests the fixed endpoint and sends no credentials", async t => {
  environment(t);
  const result = await delivery.readArticleDeliveries([document], async (url, init) => {
    assert.equal(url, `${origin}/api/blog/publication-status`);
    assert.equal(init.method, "GET");
    assert.equal(init.cache, "no-store");
    assert.equal(init.redirect, "error");
    assert.equal(init.credentials, "omit");
    assert.deepEqual(init.headers, { Accept: "application/json", "Cache-Control": "no-cache" });
    assert.ok(init.signal instanceof AbortSignal);
    assert.equal(JSON.stringify(init).includes("offline-secret"), false);
    return manifest([document]);
  });
  assert.equal(result[document.slug].status, "live");
});

test("unavailable, malformed and duplicate public data remain unknown rather than claiming saved or live", async t => {
  environment(t);
  const fingerprint = delivery.publicationFingerprint(document);
  const invalid = [
    async () => { throw new Error("offline provider failure"); },
    async () => new Response("missing endpoint on the prior deployment", { status: 404 }),
    async () => new Response("unavailable", { status: 503 }),
    async () => new Response("not JSON"),
    async () => Response.json({}),
    async () => Response.json({ posts: [{ slug: document.slug, fingerprint: "invalid" }] }),
    async () => Response.json({ posts: [{ slug: "../other", fingerprint }] }),
    async () => Response.json({ posts: [{ slug: document.slug, fingerprint }, { slug: document.slug, fingerprint }] }),
  ];
  for (const fetcher of invalid) {
    const result = await delivery.readArticleDeliveries([document], fetcher);
    assert.equal(result[document.slug].status, "unknown");
    assert.equal(JSON.stringify(result).includes("offline"), false);
  }
});

test("unbounded response streams are canceled and remain unknown", async t => {
  environment(t);
  let canceled = false;
  const response = new Response(new ReadableStream({
    start(controller) { controller.enqueue(new Uint8Array(1_000_001)); },
    cancel() { canceled = true; },
  }));
  const result = await delivery.readArticleDeliveries([document], async () => response);
  assert.equal(canceled, true);
  assert.equal(result[document.slug].status, "unknown");
});

test("origin cannot redirect checks to arbitrary hosts, credentials, paths or production loopback", async t => {
  environment(t);
  for (const invalid of [undefined, "invalid", "https://attacker.test", "http://mycatalystinnovations.com", "https://mycatalystinnovations.com.attacker.test", "https://user:secret@mycatalystinnovations.com", `${origin}/private`, `${origin}?token=secret`, "http://localhost:3000", "https://127.0.0.1"]) {
    if (invalid === undefined) delete process.env.BLOG_EDITOR_ORIGIN; else process.env.BLOG_EDITOR_ORIGIN = invalid;
    const result = await delivery.readArticleDeliveries([document], async () => { throw new Error("must not fetch"); });
    assert.equal(result[document.slug].status, "unknown");
  }
  process.env.NODE_ENV = "development";
  process.env.BLOG_EDITOR_ORIGIN = "http://localhost:3000";
  const local = await delivery.readArticleDeliveries([document], async url => {
    assert.equal(url, "http://localhost:3000/api/blog/publication-status");
    return manifest([document]);
  });
  assert.equal(local[document.slug].status, "live");
});

test("public manifest returns only deployed slug and fingerprint, without article text, dates or credentials", async () => {
  const route = load("app/api/blog/publication-status/route.ts", {
    "@/data/blog-published.json": [document], "@/lib/native-blog-delivery": delivery,
    "@/lib/blog": { async getPublishedPosts() { return [document]; } },
  });
  const response = await route.GET();
  assert.equal(route.dynamic, "force-dynamic");
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store, max-age=0");
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
  assert.deepEqual(await response.json(), { posts: [{ slug: document.slug, fingerprint: delivery.publicationFingerprint(document) }] });
  assert.deepEqual(await delivery.readArticleDeliveries([], async () => { throw new Error("must not fetch"); }), {});
});

test("invalid deployed catalog fails visibly without exposing its data", async () => {
  const route = load("app/api/blog/publication-status/route.ts", {
    "@/data/blog-published.json": [{ ...document, body: "invalid" }], "@/lib/native-blog-delivery": delivery,
    "@/lib/blog": { async getPublishedPosts() { throw new Error("Reader rejected the deployed catalog."); } },
  });
  const response = await route.GET();
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: "Public publication status is unavailable." });
});
