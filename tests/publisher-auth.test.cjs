/* eslint-disable @typescript-eslint/no-require-imports -- Offline harness exercises the real authentication code and Next requests. */
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

const password = "Offline dedicated publisher fixture 2026!";
const salt = "d4".repeat(16);
const passwordHash = `scrypt:${salt}:${scryptSync(password, Buffer.from(salt, "hex"), 64).toString("hex")}`;
const sessionSecret = "offline-publisher-fixture-signing-secret-".repeat(2);
const editorPassword = "A separate editor fixture password 2026!";
const editorSalt = "e5".repeat(16);
const editorHash = `scrypt:${editorSalt}:${scryptSync(editorPassword, Buffer.from(editorSalt, "hex"), 64).toString("hex")}`;
const origin = "https://mycatalystinnovations.com";
const now = Date.parse("2026-11-20T15:00:00Z");
const day = 24 * 60 * 60 * 1000;
const auth = load("lib/blog-publisher-auth.ts");
const editor = load("lib/blog-editor-auth.ts");
const environmentKeys = ["BLOG_PUBLISHER_ENABLED", "BLOG_PUBLISHER_PASSWORD_HASH", "BLOG_PUBLISHER_SESSION_SECRET",
  "BLOG_EDITOR_PASSWORD_HASH", "BLOG_EDITOR_SESSION_SECRET", "BLOG_EDITOR_ORIGIN", "NEXT_PUBLIC_SITE_URL", "NODE_ENV"];

function environment(t, overrides = {}) {
  const before = new Map(environmentKeys.map(key => [key, process.env[key]]));
  const values = { BLOG_PUBLISHER_ENABLED: "true", BLOG_PUBLISHER_PASSWORD_HASH: passwordHash,
    BLOG_PUBLISHER_SESSION_SECRET: sessionSecret, BLOG_EDITOR_PASSWORD_HASH: editorHash,
    BLOG_EDITOR_SESSION_SECRET: "offline-editor-fixture-secret-".repeat(2), BLOG_EDITOR_ORIGIN: origin,
    NEXT_PUBLIC_SITE_URL: origin, NODE_ENV: "production", ...overrides };
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
  t.after(() => {
    for (const [key, value] of before) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  });
}

function privateResponse(response) {
  assert.equal(response.headers.get("cache-control"), "no-store, private");
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
}

const preview = (overrides = {}) => JSON.stringify({ edition: "2026-11-27", revision: "a".repeat(40), fingerprint: "b".repeat(64), ...overrides });
function sessionRoute(overrides = {}) {
  return load("app/api/blog/publisher/session/route.ts", {
    "@/lib/blog-publisher-auth": { ...auth, ...overrides },
    "@/lib/blog-editor-auth": editor,
  });
}
function sessionRequest(body, headers = {}) {
  return new NextRequest(`${origin}/api/blog/publisher/session`, {
    method: "POST", headers: { Origin: origin, "Content-Type": "application/x-www-form-urlencoded", ...headers }, body,
  });
}

test("publisher configuration requires explicit activation and independent valid settings", async t => {
  environment(t);
  const session = auth.createPublisherSession(now);
  for (const [key, invalid] of [
    ["BLOG_PUBLISHER_ENABLED", undefined], ["BLOG_PUBLISHER_ENABLED", "TRUE"], ["BLOG_PUBLISHER_ENABLED", "false"],
    ["BLOG_PUBLISHER_PASSWORD_HASH", undefined], ["BLOG_PUBLISHER_PASSWORD_HASH", "scrypt:not-a-hash"],
    ["BLOG_PUBLISHER_SESSION_SECRET", undefined], ["BLOG_PUBLISHER_SESSION_SECRET", "short"],
    ["BLOG_EDITOR_ORIGIN", undefined], ["BLOG_EDITOR_ORIGIN", "http://mycatalystinnovations.com"],
  ]) {
    const previous = process.env[key];
    if (invalid === undefined) delete process.env[key]; else process.env[key] = invalid;
    assert.equal(auth.publisherConfigured(), false);
    assert.equal(auth.readPublisherSession(session, now), null);
    assert.equal(auth.refreshPublisherSession(session, now), null);
    assert.equal(await auth.checkPublisherPassword(password), false);
    assert.throws(() => auth.createPublisherSession(now), /not configured/);
    assert.throws(() => auth.signPublisherPreview(preview(), now), /not configured/);
    process.env[key] = previous;
  }
});

test("publisher passwords and sessions never authorize the regular eight-hour editor", async t => {
  environment(t);
  const publisherSession = auth.createPublisherSession(now);
  const editorSession = editor.createEditorSession(now);
  assert.equal(await auth.checkPublisherPassword(password), true);
  assert.equal(await editor.checkEditorPassword(password), false);
  assert.equal(await auth.checkPublisherPassword(editorPassword), false);
  assert.equal(editor.hasEditorSession(publisherSession, now), false);
  assert.equal(auth.readPublisherSession(editorSession, now), null);
  assert.notEqual(auth.publisherCookieName(), editor.editorCookieName());
  assert.equal(editor.hasEditorSession(editorSession, now + 8 * 60 * 60 * 1000 - 1), true);
  assert.equal(editor.hasEditorSession(editorSession, now + 8 * 60 * 60 * 1000), false);
  assert.notEqual(auth.readPublisherSession(publisherSession, now + 8 * 60 * 60 * 1000), null);
});

test("publisher session idle expiry is exactly ninety days and reads do not extend it", t => {
  environment(t);
  const session = auth.createPublisherSession(now);
  assert.deepEqual(auth.readPublisherSession(session, now), { issuedAt: now, refreshedAt: now });
  assert.deepEqual(auth.readPublisherSession(session, now + 90 * day - 1), { issuedAt: now, refreshedAt: now });
  assert.equal(auth.readPublisherSession(session, now + 90 * day), null);
  assert.equal(auth.refreshPublisherSession(session, now + 90 * day), null);
  assert.notEqual(auth.createPublisherSession(now), session);
});

test("rolling renewal preserves first issuance and cannot pass the one-year absolute deadline", t => {
  environment(t);
  let session = auth.createPublisherSession(now);
  for (const age of [89, 178, 267, 356, 364]) {
    const previous = session;
    session = auth.refreshPublisherSession(session, now + age * day);
    assert.equal(typeof session, "string");
    assert.notEqual(session, previous);
    assert.deepEqual(auth.readPublisherSession(session, now + age * day), { issuedAt: now, refreshedAt: now + age * day });
  }
  assert.notEqual(auth.readPublisherSession(session, now + 365 * day - 1), null);
  assert.equal(auth.readPublisherSession(session, now + 365 * day), null);
  assert.equal(auth.refreshPublisherSession(session, now + 365 * day), null);
});

test("sessions reject tampering, impossible clocks, malformed inputs and credential rotations", t => {
  environment(t);
  const session = auth.createPublisherSession(now);
  const [version, issued, refreshed, nonce, signature] = session.split(".");
  for (const invalid of [undefined, "", "x".repeat(221), session + ".extra",
    [version, Number(issued) + 1, refreshed, nonce, signature].join("."),
    [version, issued, Number(refreshed) + 1, nonce, signature].join("."),
    [version, issued, refreshed, nonce.replace(/^./, nonce[0] === "A" ? "B" : "A"), signature].join("."),
    session.slice(0, -1) + (session.endsWith("A") ? "B" : "A")]) {
    assert.equal(auth.readPublisherSession(invalid, now), null);
  }
  assert.equal(auth.readPublisherSession(session, now - 1), null);
  assert.equal(auth.readPublisherSession(session, NaN), null);
  assert.throws(() => auth.createPublisherSession(NaN), /Invalid/);
  process.env.BLOG_PUBLISHER_SESSION_SECRET = "rotated-offline-publisher-secret-".repeat(2);
  assert.equal(auth.readPublisherSession(session, now), null);
  process.env.BLOG_PUBLISHER_SESSION_SECRET = sessionSecret;
  process.env.BLOG_PUBLISHER_PASSWORD_HASH = `scrypt:${salt}:${"c".repeat(128)}`;
  assert.equal(auth.readPublisherSession(session, now), null);
});

test("publisher password verification rejects wrong, short, overlong and non-string input", async t => {
  environment(t);
  for (const invalid of ["A different long fixture password", "short", "x".repeat(257), null, 123, {}]) {
    assert.equal(await auth.checkPublisherPassword(invalid), false);
  }
});

test("publisher cookies are host-only, HttpOnly, Secure and Strict with bounded lifetime", t => {
  environment(t);
  assert.equal(auth.publisherCookieName(), "__Host-catalyst-blog-publisher");
  assert.deepEqual(auth.publisherCookieOptions(), { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 90 * 86400 });
  assert.equal(Object.hasOwn(auth.publisherCookieOptions(), "domain"), false);
  assert.equal(auth.publisherCookieOptions(0).maxAge, 0);
  assert.equal(auth.publisherCookieOptions(-1).maxAge, 0);
  assert.equal(auth.publisherCookieOptions(366 * 86400).maxAge, 90 * 86400);
  process.env.NODE_ENV = "development";
  assert.equal(auth.publisherCookieName(), "catalyst-blog-publisher-local");
  assert.equal(auth.publisherCookieOptions().secure, false);
});

test("publisher origin checks use only fixed BLOG_EDITOR_ORIGIN and reject host-header confusion", t => {
  environment(t);
  const request = value => new Request(origin, { headers: value ? { Origin: value, Host: "attacker.test" } : {} });
  assert.equal(auth.samePublisherOrigin(request(origin)), true);
  for (const invalid of [undefined, "null", "http://mycatalystinnovations.com", `${origin}:8443`, "https://mycatalystinnovations.com.attacker.test"]) {
    assert.equal(auth.samePublisherOrigin(request(invalid)), false);
  }
  for (const invalid of [undefined, "not-a-url", `${origin}/editor`, `https://user:pass@mycatalystinnovations.com`, `${origin}?x=1`, `${origin}#fragment`]) {
    if (invalid === undefined) delete process.env.BLOG_EDITOR_ORIGIN; else process.env.BLOG_EDITOR_ORIGIN = invalid;
    assert.equal(auth.samePublisherOrigin(request(origin)), false);
  }
  process.env.NODE_ENV = "development";
  process.env.BLOG_EDITOR_ORIGIN = "http://localhost:3041";
  assert.equal(auth.samePublisherOrigin(request("http://localhost:3041")), true);
});

test("signed previews bind edition, revision and content hash and expire at ten minutes", t => {
  environment(t);
  const payload = preview();
  const token = auth.signPublisherPreview(payload, now);
  assert.equal(auth.verifyPublisherPreview(token, payload, now), true);
  assert.equal(auth.verifyPublisherPreview(token, payload, now + 600_000 - 1), true);
  assert.equal(auth.verifyPublisherPreview(token, payload, now + 600_000), false);
  assert.equal(auth.verifyPublisherPreview(token, payload, now - 1), false);
  assert.equal(auth.verifyPublisherPreview(token, preview({ edition: "2026-12-04" }), now), false);
  assert.equal(auth.verifyPublisherPreview(token, preview({ revision: "c".repeat(40) }), now), false);
  assert.equal(auth.verifyPublisherPreview(token, preview({ fingerprint: "c".repeat(64) }), now), false);
  assert.notEqual(auth.signPublisherPreview(payload, now), token);
});

test("preview signatures are distinct from sessions and revoked by activation or credential changes", t => {
  environment(t);
  const payload = preview();
  const token = auth.signPublisherPreview(payload, now);
  assert.equal(auth.readPublisherSession(token, now), null);
  assert.equal(auth.verifyPublisherPreview(auth.createPublisherSession(now), payload, now), false);
  for (const invalid of [undefined, "", "x".repeat(201), token + ".extra", token.slice(0, -1) + (token.endsWith("A") ? "B" : "A")]) {
    assert.equal(auth.verifyPublisherPreview(invalid, payload, now), false);
  }
  assert.equal(auth.verifyPublisherPreview(token, null, now), false);
  assert.throws(() => auth.signPublisherPreview("x".repeat(2049), now), /Invalid/);
  process.env.BLOG_PUBLISHER_ENABLED = "false";
  assert.equal(auth.verifyPublisherPreview(token, payload, now), false);
  process.env.BLOG_PUBLISHER_ENABLED = "true";
  process.env.BLOG_PUBLISHER_SESSION_SECRET = "rotated-offline-publisher-secret-".repeat(2);
  assert.equal(auth.verifyPublisherPreview(token, payload, now), false);
  process.env.BLOG_PUBLISHER_SESSION_SECRET = sessionSecret;
  process.env.BLOG_PUBLISHER_PASSWORD_HASH = `scrypt:${salt}:${"c".repeat(128)}`;
  assert.equal(auth.verifyPublisherPreview(token, payload, now), false);
});

test("publisher login throttles repeated and distributed attempts then resets", () => {
  const local = load("lib/blog-publisher-auth.ts");
  const distributed = load("lib/blog-publisher-auth.ts");
  for (let index = 0; index < 5; index++) assert.equal(local.limitPublisherLogin("client", now), true);
  assert.equal(local.limitPublisherLogin("client", now), false);
  for (let index = 0; index < 30; index++) assert.equal(distributed.limitPublisherLogin(`client-${index}`, now), true);
  assert.equal(distributed.limitPublisherLogin("another-client", now), false);
  assert.equal(local.limitPublisherLogin("client", now + 15 * 60 * 1000), true);
  assert.equal(distributed.limitPublisherLogin("another-client", now + 15 * 60 * 1000), true);
});

test("login issues only the dedicated cookie and redirects only to the configured publisher", async t => {
  environment(t);
  const route = sessionRoute({ limitPublisherLogin: () => true });
  const form = new URLSearchParams({ password, returnTo: "https://attacker.test" }).toString();
  const response = await route.POST(sessionRequest(form));
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), `${origin}/blog/publisher`);
  privateResponse(response);
  const cookie = response.cookies.get(auth.publisherCookieName());
  assert.notEqual(auth.readPublisherSession(cookie.value), null);
  assert.equal(response.cookies.get(editor.editorCookieName()), undefined);
  const header = response.headers.get("set-cookie");
  assert.match(header, /^__Host-catalyst-blog-publisher=/);
  assert.match(header, /Path=\//);
  assert.match(header, /HttpOnly/);
  assert.match(header, /Secure/);
  assert.match(header, /SameSite=strict/i);
  assert.doesNotMatch(header, /Domain=/i);
});

test("login rejects foreign origins, unsupported bodies and unactivated configuration", async t => {
  environment(t);
  let checks = 0;
  const route = sessionRoute({ checkPublisherPassword: async () => { checks++; return true; } });
  for (const [request, status] of [
    [sessionRequest("password=fixture", { Origin: "https://attacker.test" }), 403],
    [sessionRequest("password=fixture", { "Content-Type": "application/json" }), 415],
    [sessionRequest("x".repeat(2049)), 413],
    [sessionRequest("action=unexpected"), 400],
  ]) {
    const response = await route.POST(request);
    assert.equal(response.status, status);
    privateResponse(response);
    assert.equal(response.headers.get("set-cookie"), null);
  }
  assert.equal(checks, 0);
  process.env.BLOG_PUBLISHER_ENABLED = "false";
  const disabled = await route.POST(sessionRequest("password=fixture"));
  assert.equal(disabled.status, 503);
  assert.equal(checks, 0);
});

test("wrong passwords and throttled attempts issue no cookie and logout clears no editor cookie", async t => {
  environment(t);
  const route = sessionRoute({ limitPublisherLogin: () => true });
  const wrong = await route.POST(sessionRequest("password=A+different+long+password+fixture"));
  assert.equal(wrong.status, 303);
  assert.equal(new URL(wrong.headers.get("location")).searchParams.get("error"), "signin");
  assert.equal(wrong.headers.get("set-cookie"), null);
  const limited = await sessionRoute({ limitPublisherLogin: () => false, checkPublisherPassword: async () => { throw new Error("must not check"); } }).POST(sessionRequest("password=fixture"));
  assert.equal(new URL(limited.headers.get("location")).searchParams.get("error"), "wait");
  assert.equal(limited.headers.get("set-cookie"), null);
  process.env.BLOG_PUBLISHER_ENABLED = "false";
  const logout = await route.POST(sessionRequest("action=logout"));
  assert.equal(logout.status, 303);
  assert.match(logout.headers.get("set-cookie"), /^__Host-catalyst-blog-publisher=;/);
  assert.match(logout.headers.get("set-cookie"), /Max-Age=0/);
  assert.equal(logout.cookies.get(editor.editorCookieName()), undefined);
  privateResponse(logout);
});
