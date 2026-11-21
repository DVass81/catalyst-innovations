/* eslint-disable @typescript-eslint/no-require-imports -- Offline route checks never write to GitHub or the public blog. */
const test = require("node:test");
const assert = require("node:assert/strict");
const { scryptSync } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const { NextRequest } = require("next/server");
function load(file, mocks = {}) {
  const filename = path.join(__dirname, "..", file);
  const mod = new Module(filename, module); mod.filename = filename; mod.paths = Module._nodeModulePaths(path.dirname(filename));
  const original = mod.require.bind(mod); mod.require = id => Object.hasOwn(mocks, id) ? mocks[id] : original(id);
  mod._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
  return mod.exports;
}

test("publisher API uses its own session, signed preview and exact delivery status", async t => {
  const keys = ["NODE_ENV", "BLOG_PUBLISHER_ENABLED", "BLOG_PUBLISHER_PASSWORD_HASH", "BLOG_PUBLISHER_SESSION_SECRET", "BLOG_EDITOR_ORIGIN", "BLOG_EDITOR_PASSWORD_HASH", "BLOG_EDITOR_SESSION_SECRET"];
  const before = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  t.after(() => { for (const key of keys) if (before[key] === undefined) delete process.env[key]; else process.env[key] = before[key]; });
  const salt = "ab".repeat(16);
  const verifier = `scrypt:${salt}:${scryptSync("Offline publisher fixture only", Buffer.from(salt, "hex"), 64).toString("hex")}`;
  Object.assign(process.env, { NODE_ENV: "production", BLOG_PUBLISHER_ENABLED: "true", BLOG_PUBLISHER_PASSWORD_HASH: verifier, BLOG_PUBLISHER_SESSION_SECRET: "publisher-offline-fixture-secret-".repeat(2), BLOG_EDITOR_ORIGIN: "https://mycatalystinnovations.com", BLOG_EDITOR_PASSWORD_HASH: verifier, BLOG_EDITOR_SESSION_SECRET: "editor-offline-fixture-secret-".repeat(2) });
  const auth = load("lib/blog-publisher-auth.ts");
  const editor = load("lib/blog-editor-auth.ts");
  const content = load("lib/native-blog-content.ts");
  const fingerprint = post => require("node:crypto").createHash("sha256").update(JSON.stringify(post)).digest("hex");
  const post = { title: "A complete offline fixture", slug: "offline-fixture-never-published", description: "An offline fixture for the publishing route protections.", category: "Workflows", body: "This text stays inside an isolated mock. ".repeat(12), featuredImage: { assetId: content.nativeBlogImages[0].assetId, alt: content.nativeBlogImages[0].alt } };
  let writes = 0; let journal = []; let posts = []; let status = "saved";
  class PublisherStoreError extends Error { constructor(status, message) { super(message); this.status = status; } }
  const route = load("app/api/blog/publisher/route.ts", {
    "@/lib/blog-publisher-auth": auth, "@/lib/blog-editor-auth": editor, "@/lib/native-blog-content": content,
    "@/lib/blog-publisher-store": { PublisherStoreError, inputFingerprint: fingerprint, publisherEdition: () => ({ edition: "2026-11-27", canPublish: true, reason: "Friday publication window." }), readPublisherState: async () => ({ posts, journal, revision: "a".repeat(40) }), createWeeklyPublication: async input => { writes++; const document = { ...input, publishedAt: "2026-11-27", updatedAt: "2026-11-27", publicationId: "50000000-0000-4000-8000-000000000000" }; posts = [document]; const receipt = { edition: "2026-11-27", slug: input.slug, publicationId: document.publicationId, documentFingerprint: fingerprint(document), savedAt: "2026-11-27T13:00:00Z" }; journal = [receipt]; return { receipt, idempotentReplay: false }; } },
    "@/lib/native-blog-delivery": { publicationFingerprint: fingerprint, readArticleDeliveries: async () => ({ [post.slug]: { status, checkedAt: "2026-11-27T13:05:00Z" } }) },
  });
  const origin = "https://mycatalystinnovations.com";
  const cookie = `${auth.publisherCookieName()}=${auth.createPublisherSession()}`;
  const request = (input, extra = {}) => new NextRequest(`${origin}/api/blog/publisher`, { method: "POST", headers: { origin, cookie, "content-type": "application/json", ...extra }, body: JSON.stringify(input) });
  const guest = await route.GET(new NextRequest(`${origin}/api/blog/publisher`)); assert.equal(guest.status, 401);
  const wrongSession = await route.GET(new NextRequest(`${origin}/api/blog/publisher`, { headers: { cookie: `${editor.editorCookieName()}=${editor.createEditorSession()}` } })); assert.equal(wrongSession.status, 401);
  assert.equal(editor.hasEditorSession(auth.createPublisherSession()), false);
  const { featuredImage, ...withoutPicture } = post;
  assert.ok(featuredImage);
  assert.equal((await route.POST(request({ action: "preview", post: withoutPicture }))).status, 422);
  assert.equal((await route.POST(request({ action: "preview", post }, { origin: "https://untrusted.example" }))).status, 403);
  const response = await route.POST(request({ action: "preview", post })); assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store, private");
  const preview = await response.json();
  assert.equal((await route.POST(request({ action: "publish", ...preview, post: { ...post, featuredImage: { ...post.featuredImage, alt: "A different description after the signed image preview." } } }))).status, 409); assert.equal(writes, 0);
  assert.equal((await route.POST(request({ action: "publish", ...preview, post: { ...post, title: "Changed after the signed preview" } }))).status, 409); assert.equal(writes, 0);
  const saved = await route.POST(request({ ...preview, action: "publish" })); assert.equal(saved.status, 200); assert.equal((await saved.json()).status, "SAVED"); assert.equal(writes, 1);
  const read = () => route.GET(new NextRequest(`${origin}/api/blog/publisher`, { headers: { cookie } })).then(response => response.json());
  assert.equal((await read()).status, "SAVED"); status = "live"; assert.equal((await read()).status, "LIVE");
  status = "unknown"; assert.equal((await read()).status, "UNKNOWN");
  posts[0] = { ...posts[0], title: "A manual editor change remains authoritative" }; status = "live"; assert.equal((await read()).status, "SUPERSEDED");
  assert.equal(writes, 1);
  process.env.BLOG_PUBLISHER_ENABLED = "false";
  assert.equal((await route.GET(new NextRequest(`${origin}/api/blog/publisher`, { headers: { cookie } }))).status, 401);
});
