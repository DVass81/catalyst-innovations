/* eslint-disable @typescript-eslint/no-require-imports -- Standalone TypeScript harness exercises real crypto and Next requests offline. */
const test = require("node:test");
const assert = require("node:assert/strict");
const { createHash, scryptSync } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const { NextRequest } = require("next/server");

function load(file, mocks = {}) {
  const filename = path.join(__dirname, "..", file);
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  const original = mod.require.bind(mod);
  mod.require = id => Object.hasOwn(mocks, id) ? mocks[id] : original(id);
  mod._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, filename);
  return mod.exports;
}

const password = "An offline fixture password 2026!";
const salt = "a3".repeat(16);
const passwordHash = `scrypt:${salt}:${scryptSync(password, Buffer.from(salt, "hex"), 64).toString("hex")}`;
const sessionSecret = "offline-fixture-signing-secret-".repeat(2);
const origin = "https://mycatalystinnovations.com";
const auth = load("lib/blog-editor-auth.ts");
const content = load("lib/native-blog-content.ts");
const environmentKeys = ["BLOG_EDITOR_PASSWORD_HASH", "BLOG_EDITOR_SESSION_SECRET", "BLOG_EDITOR_ORIGIN", "NEXT_PUBLIC_SITE_URL", "NODE_ENV"];

function environment(t, overrides = {}) {
  const before = new Map(environmentKeys.map(key => [key, process.env[key]]));
  const values = { BLOG_EDITOR_PASSWORD_HASH: passwordHash, BLOG_EDITOR_SESSION_SECRET: sessionSecret,
    BLOG_EDITOR_ORIGIN: origin, NEXT_PUBLIC_SITE_URL: origin, NODE_ENV: "production", ...overrides };
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  t.after(() => {
    for (const [key, value] of before) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
}

function privateResponse(response) {
  assert.equal(response.headers.get("cache-control"), "no-store, private");
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
}

const article = () => ({
  title: "The delay between familiar business steps",
  slug: "delay-between-steps",
  description: "A practical way to follow information between people and identify one useful improvement.",
  category: "Operations",
  body: "Follow a familiar request with the people who handle it. Write down what each person needs before the next step can begin, and ask who is responsible when information is missing.",
});
const fingerprint = post => createHash("sha256").update(JSON.stringify(content.parseNativeBlogInput(post))).digest("hex");
const publication = () => ({ post: article(), revision: "a".repeat(40), operationId: "45db6a41-2156-49e0-a2a0-c756044aa32c", previewFingerprint: fingerprint(article()) });

function routeHarness(overrides = {}) {
  const calls = { read: 0, publish: [] };
  class NativeBlogStoreError extends Error {
    constructor(status, message) { super(message); this.status = status; }
  }
  const store = {
    NativeBlogStoreError,
    async readPublicationCatalog() { calls.read++; return { posts: [], revision: "a".repeat(40) }; },
    async publishDocument(...args) { calls.publish.push(args); return { status: "queued", commitSha: "b".repeat(40) }; },
    ...overrides.store,
  };
  const route = load("app/api/blog/editor/route.ts", {
    "@/lib/blog-editor-auth": { ...auth, ...overrides.auth },
    "@/lib/native-blog-content": content,
    "@/lib/native-blog-store": store,
  });
  return { ...route, calls, NativeBlogStoreError };
}

function editorRequest(method = "POST", options = {}) {
  const headers = { Origin: origin, "Content-Type": "application/json" };
  if (options.authorized !== false) headers.Cookie = `${auth.editorCookieName()}=${auth.createEditorSession()}`;
  Object.assign(headers, options.headers);
  const init = { method, headers };
  if (method === "POST") init.body = options.rawBody ?? JSON.stringify(options.input ?? publication());
  return new NextRequest(`${origin}/api/blog/editor`, init);
}

function sessionRoute(overrides = {}) {
  return load("app/api/blog/editor/session/route.ts", { "@/lib/blog-editor-auth": { ...auth, ...overrides } });
}

function sessionRequest(body, headers = {}) {
  return new NextRequest(`${origin}/api/blog/editor/session`, {
    method: "POST", headers: { Origin: origin, "Content-Type": "application/x-www-form-urlencoded", ...headers }, body,
  });
}

test("missing or malformed editor configuration fails closed before password or session acceptance", async t => {
  environment(t);
  const session = auth.createEditorSession();
  for (const [key, invalid] of [
    ["BLOG_EDITOR_PASSWORD_HASH", undefined], ["BLOG_EDITOR_PASSWORD_HASH", "scrypt:not-a-hash"],
    ["BLOG_EDITOR_SESSION_SECRET", undefined], ["BLOG_EDITOR_SESSION_SECRET", "short"],
  ]) {
    const previous = process.env[key];
    if (invalid === undefined) delete process.env[key]; else process.env[key] = invalid;
    assert.equal(auth.editorConfigured(), false);
    assert.equal(await auth.checkEditorPassword(password), false);
    assert.equal(auth.hasEditorSession(session), false);
    assert.throws(() => auth.createEditorSession(), /not configured/);
    process.env[key] = previous;
  }
});

test("the password verifier uses the configured scrypt salt/hash and rejects wrong or unbounded inputs", async t => {
  environment(t);
  assert.equal(await auth.checkEditorPassword(password), true);
  for (const invalid of ["A different long password", null, 123, "short", "x".repeat(257)]) {
    assert.equal(await auth.checkEditorPassword(invalid), false);
  }
});

test("signed sessions enforce the eight-hour boundary, detect tampering and rotate with either credential", t => {
  environment(t);
  const now = Date.parse("2026-11-20T15:00:00Z");
  const session = auth.createEditorSession(now);
  assert.equal(auth.hasEditorSession(session, now), true);
  assert.equal(auth.hasEditorSession(session, now + 8 * 60 * 60 * 1000 - 1), true);
  assert.equal(auth.hasEditorSession(session, now + 8 * 60 * 60 * 1000), false);
  assert.equal(auth.hasEditorSession(session, now - 1000), false);
  assert.notEqual(auth.createEditorSession(now), session);
  const [expires, nonce, signature] = session.split(".");
  for (const invalid of [undefined, "", "x".repeat(201), `${Number(expires) + 1}.${nonce}.${signature}`,
    `${expires}.${nonce.replace(/^./, nonce[0] === "A" ? "B" : "A")}.${signature}`,
    `${expires}.${nonce}.${signature.replace(/^./, signature[0] === "A" ? "B" : "A")}`]) {
    assert.equal(auth.hasEditorSession(invalid, now), false);
  }
  process.env.BLOG_EDITOR_SESSION_SECRET = "rotated-fixture-session-secret-".repeat(2);
  assert.equal(auth.hasEditorSession(session, now), false);
  process.env.BLOG_EDITOR_SESSION_SECRET = sessionSecret;
  process.env.BLOG_EDITOR_PASSWORD_HASH = `scrypt:${salt}:${"c".repeat(128)}`;
  assert.equal(auth.hasEditorSession(session, now), false);
});

test("production cookies use the Secure Host prefix and strict host-only browser scope", t => {
  environment(t);
  assert.equal(auth.editorCookieName(), "__Host-catalyst-blog");
  assert.deepEqual(auth.editorCookieOptions(), { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 28_800 });
  assert.equal(Object.hasOwn(auth.editorCookieOptions(), "domain"), false);
  process.env.NODE_ENV = "development";
  assert.equal(auth.editorCookieName(), "catalyst-blog-local");
  assert.equal(auth.editorCookieOptions().secure, false);
});

test("editor mutations require the exact configured Origin, including protocol and port", t => {
  environment(t);
  assert.equal(auth.sameEditorOrigin(new Request(origin, { headers: { Origin: origin } })), true);
  for (const invalid of [undefined, "null", "http://mycatalystinnovations.com", "https://mycatalystinnovations.com:8443", "https://mycatalystinnovations.com.attacker.test"]) {
    assert.equal(auth.sameEditorOrigin(new Request(origin, { headers: invalid ? { Origin: invalid } : {} })), false);
  }
  process.env.BLOG_EDITOR_ORIGIN = "http://localhost:3000";
  assert.equal(auth.sameEditorOrigin(new Request(origin, { headers: { Origin: "http://localhost:3000" } })), false);
  process.env.BLOG_EDITOR_ORIGIN = "not a URL";
  assert.equal(auth.sameEditorOrigin(new Request(origin, { headers: { Origin: origin } })), false);
  delete process.env.BLOG_EDITOR_ORIGIN;
  assert.equal(auth.sameEditorOrigin(new Request(origin, { headers: { Origin: origin } })), true);
  delete process.env.NEXT_PUBLIC_SITE_URL;
  assert.equal(auth.sameEditorOrigin(new Request(origin, { headers: { Origin: origin } })), false);
});

test("the request reader bounds actual UTF-8 bytes and cancels an oversized stream", async () => {
  assert.equal(await auth.readEditorBody(new Request(origin), 8), "");
  assert.equal(await auth.readEditorBody(new Request(origin, { method: "POST", body: "é".repeat(4) }), 8), "é".repeat(4));
  let cancelled = false;
  const body = new ReadableStream({
    start(controller) { controller.enqueue(new TextEncoder().encode("é".repeat(5))); },
    cancel() { cancelled = true; },
  });
  const request = new Request(origin, { method: "POST", headers: { "Content-Length": "1" }, body, duplex: "half" });
  await assert.rejects(auth.readEditorBody(request, 8), /too large/);
  assert.equal(cancelled, true);
});

test("login throttling blocks repeated and distributed attempts then resets at the window boundary", () => {
  const local = load("lib/blog-editor-auth.ts");
  const distributed = load("lib/blog-editor-auth.ts");
  const now = Date.now();
  for (let attempt = 0; attempt < 5; attempt++) assert.equal(local.limitEditorLogin("one-client", now), true);
  assert.equal(local.limitEditorLogin("one-client", now), false);
  assert.equal(local.limitEditorLogin("another-client", now), true);
  for (let attempt = 0; attempt < 30; attempt++) assert.equal(distributed.limitEditorLogin(`client-${attempt}`, now), true);
  assert.equal(distributed.limitEditorLogin("client-31", now), false);
  assert.equal(local.limitEditorLogin("one-client", now + 15 * 60 * 1000), true);
  assert.equal(distributed.limitEditorLogin("client-31", now + 15 * 60 * 1000), true);
});

test("unauthenticated catalog and publish requests never reach storage or consume the submitted body", async t => {
  environment(t);
  const route = routeHarness({ auth: { readEditorBody() { throw new Error("Must not read unauthorized body"); } } });
  for (const method of ["GET", "POST"]) {
    const response = await route[method](editorRequest(method, { authorized: false }));
    assert.equal(response.status, 401);
    privateResponse(response);
  }
  assert.deepEqual(route.calls, { read: 0, publish: [] });
});

test("authenticated catalog reads use private responses and expose the storage revision", async t => {
  environment(t);
  const route = routeHarness();
  const response = await route.GET(editorRequest("GET"));
  assert.equal(response.status, 200);
  privateResponse(response);
  assert.deepEqual(await response.json(), { posts: [], revision: "a".repeat(40) });
  assert.deepEqual(route.calls, { read: 1, publish: [] });
});

test("publish requests reject foreign origins, unsupported bodies and malformed fields before storage", async t => {
  environment(t);
  const route = routeHarness();
  const requests = [
    [editorRequest("POST", { headers: { Origin: "https://attacker.test" } }), 403],
    [editorRequest("POST", { headers: { "Content-Type": "text/plain" } }), 415],
    [editorRequest("POST", { rawBody: "{" }), 400],
    [editorRequest("POST", { rawBody: "x".repeat(90_001) }), 413],
    [editorRequest("POST", { input: { ...publication(), post: { ...article(), slug: "editor" } } }), 422],
    [editorRequest("POST", { input: { ...publication(), revision: "not-a-revision" } }), 422],
    [editorRequest("POST", { input: { ...publication(), operationId: "not-an-operation" } }), 422],
  ];
  for (const [request, status] of requests) {
    const response = await route.POST(request);
    assert.equal(response.status, status);
    privateResponse(response);
  }
  assert.deepEqual(route.calls.publish, []);
});

test("editing after preview invalidates the fingerprint and cannot publish", async t => {
  environment(t);
  const route = routeHarness();
  const changed = publication();
  changed.post.body += " This sentence was added after preview.";
  const response = await route.POST(editorRequest("POST", { input: changed }));
  assert.equal(response.status, 409);
  assert.match((await response.json()).error, /Preview the current article/);
  assert.deepEqual(route.calls.publish, []);
});

test("a valid exact preview publishes normalized content with its revision and operation identity", async t => {
  environment(t);
  const route = routeHarness();
  const input = publication();
  input.post.title = ` ${input.post.title} `;
  const response = await route.POST(editorRequest("POST", { input }));
  assert.equal(response.status, 200);
  privateResponse(response);
  assert.deepEqual(route.calls.publish, [[article(), input.revision, input.operationId]]);
  assert.deepEqual(await response.json(), { status: "queued", commitSha: "b".repeat(40) });
});

test("storage failures retain safe status and never leak provider credentials", async t => {
  environment(t);
  const route = routeHarness({ store: { async publishDocument() { throw new Error("provider secret fixture-value"); } } });
  const response = await route.POST(editorRequest());
  assert.equal(response.status, 503);
  assert.doesNotMatch(JSON.stringify(await response.json()), /secret|fixture-value/);
  const conflict = routeHarness();
  const routeWithConflict = routeHarness({ store: {
    NativeBlogStoreError: conflict.NativeBlogStoreError,
    async publishDocument() { throw new conflict.NativeBlogStoreError(409, "Refresh the published revision."); },
  } });
  assert.equal((await routeWithConflict.POST(editorRequest())).status, 409);
});

test("session login enforces origin/config/password and issues the actual production cookie", async t => {
  environment(t);
  const route = sessionRoute({ limitEditorLogin: () => true });
  const form = new URLSearchParams({ password }).toString();
  const foreign = await route.POST(sessionRequest(form, { Origin: "https://attacker.test" }));
  assert.equal(foreign.status, 403);
  assert.equal(foreign.headers.get("set-cookie"), null);
  const wrong = await route.POST(sessionRequest(new URLSearchParams({ password: "A different password fixture" }).toString()));
  assert.equal(wrong.status, 303);
  assert.equal(new URL(wrong.headers.get("location")).searchParams.get("error"), "signin");
  assert.equal(wrong.headers.get("set-cookie"), null);
  const accepted = await route.POST(sessionRequest(form));
  assert.equal(accepted.status, 303);
  assert.equal(accepted.headers.get("location"), `${origin}/blog/editor`);
  privateResponse(accepted);
  const cookie = accepted.cookies.get(auth.editorCookieName());
  assert.equal(auth.hasEditorSession(cookie.value), true);
  const header = accepted.headers.get("set-cookie");
  assert.match(header, /^__Host-catalyst-blog=/);
  assert.match(header, /Path=\//);
  assert.match(header, /HttpOnly/);
  assert.match(header, /Secure/);
  assert.match(header, /SameSite=strict/i);
  assert.doesNotMatch(header, /Domain=/i);
  delete process.env.BLOG_EDITOR_SESSION_SECRET;
  assert.equal((await route.POST(sessionRequest(form))).status, 503);
});

test("session route bounds forms, respects throttling and clears the scoped cookie on logout", async t => {
  environment(t);
  let checked = 0;
  const route = sessionRoute({ limitEditorLogin: () => false, checkEditorPassword: async () => { checked++; return true; } });
  assert.equal((await route.POST(sessionRequest("x".repeat(2049)))).status, 413);
  assert.equal((await route.POST(sessionRequest("password=irrelevant", { "Content-Type": "application/json" }))).status, 415);
  const limited = await route.POST(sessionRequest("password=irrelevant"));
  assert.equal(limited.status, 303);
  assert.equal(new URL(limited.headers.get("location")).searchParams.get("error"), "wait");
  assert.equal(limited.headers.get("set-cookie"), null);
  assert.equal(checked, 0);
  const logout = await route.POST(sessionRequest("action=logout"));
  assert.equal(logout.status, 303);
  assert.match(logout.headers.get("set-cookie"), /__Host-catalyst-blog=;/);
  assert.match(logout.headers.get("set-cookie"), /Max-Age=0/);
  privateResponse(logout);
});
