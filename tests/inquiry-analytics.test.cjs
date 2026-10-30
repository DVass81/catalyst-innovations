/* eslint-disable @typescript-eslint/no-require-imports -- Exercise the real React submit handler with mocked delivery; no inquiries leave the test. */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");

function load(file, mocks = {}) {
  const filename = path.join(__dirname, "..", file);
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  const original = mod.require.bind(mod);
  mod.require = (id) => Object.hasOwn(mocks, id) ? mocks[id] : original(id);
  mod._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, filename);
  return mod.exports;
}
function find(element, predicate) {
  if (!React.isValidElement(element)) return undefined;
  if (predicate(element)) return element;
  for (const child of React.Children.toArray(element.props.children)) {
    const match = find(child, predicate);
    if (match) return match;
  }
}
function mount(t, props = {}, website = "") {
  let cursor = 0;
  const hooks = [];
  const events = [];
  const requests = [];
  const saved = Object.fromEntries(["FormData", "fetch", "requestAnimationFrame"].map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  global.FormData = class {
    constructor(form) { this.values = form.values; }
    get(key) { return this.values.find(([name]) => name === key)?.[1] ?? null; }
    getAll(key) { return this.values.filter(([name]) => name === key).map(([, value]) => value); }
    [Symbol.iterator]() { return this.values[Symbol.iterator](); }
  };
  global.requestAnimationFrame = () => {};
  let deliver = async () => new Response('{"ok":true}', { status: 200 });
  global.fetch = (url, options) => { requests.push({ url, options }); return deliver(); };
  t.after(() => { for (const [key, descriptor] of Object.entries(saved)) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; } });
  const component = load("components/InquiryForm.tsx", {
    react: {
      ...React,
      useState(initial) {
        const index = cursor++;
        if (!hooks[index]) hooks[index] = { value: initial };
        return [hooks[index].value, (value) => { hooks[index].value = value; }];
      },
      useRef(initial) { const index = cursor++; return hooks[index] ??= { current: initial }; },
      useSyncExternalStore() { cursor++; return null; },
    },
    "next/link": { default: () => null },
    "next/navigation": { useRouter: () => ({ push() {} }) },
    "@/data/startingPoints": load("data/startingPoints.ts"),
    "@/data/redesign": { industryList: [] },
    "@/lib/site": { track: (name, context) => events.push({ name, context }) },
    "@/lib/inquiryEmail": { inquiryEmailDraft: () => ({ subject: "Fixture", body: "Fixture" }) },
    "./BookingLink": { default: () => null },
    "@/lib/consultation": load("lib/consultation.ts"),
  }).default;
  const form = { values: [
    ["name", "QA Example"], ["email", "qa@example.test"], ["company", "Fictional QA"],
    ["challenge", "A labeled fictional test inquiry."], ["website", website],
  ] };
  return {
    events, requests, form,
    deliver(fn) { deliver = fn; },
    render() { cursor = 0; return component(props); },
    submit(tree) { return find(tree, (element) => element.type === "form").props.onSubmit({ preventDefault() {}, currentTarget: form }); },
  };
}

test("one accepted direct inquiry emits one completion despite rapid or stale duplicate submits", async (t) => {
  const fixture = mount(t);
  let finish;
  fixture.deliver(() => new Promise((resolve) => { finish = resolve; }));
  const tree = fixture.render();
  const first = fixture.submit(tree);
  await fixture.submit(tree);
  assert.equal(fixture.requests.length, 1);
  assert.equal(fixture.events.filter((event) => event.name === "form_complete").length, 0);
  finish(new Response('{"ok":true}', { status: 200 }));
  await first;
  await fixture.submit(tree);
  assert.equal(fixture.requests.length, 1);
  assert.deepEqual(fixture.events, [{ name: "form_complete", context: { source: "inquiry" } }]);
  assert.equal(find(fixture.render(), (element) => element.type === "form"), undefined);
});

test("failed and rejected deliveries do not complete; retry can complete once", async (t) => {
  const fixture = mount(t);
  for (const response of [new Response('{"ok":false}', { status: 400 }), new Response('{"ok":false}', { status: 502 }), new Response('{"ok":false}', { status: 200 })]) {
    fixture.deliver(async () => response);
    await fixture.submit(fixture.render());
    assert.equal(fixture.events.filter((event) => event.name === "form_complete").length, 0);
    assert.ok(find(fixture.render(), (element) => element.type === "form"));
  }
  fixture.deliver(async () => { throw new TypeError("Fixture network failure"); });
  await fixture.submit(fixture.render());
  assert.equal(fixture.events.filter((event) => event.name === "form_complete").length, 0);
  fixture.deliver(async () => new Response('{"ok":true}', { status: 200 }));
  await fixture.submit(fixture.render());
  assert.equal(fixture.events.filter((event) => event.name === "form_complete").length, 1);
});

for (const website of ["bot.example", " ", "\t"]) {
  test(`discarded honeypot ${JSON.stringify(website)} never becomes a completed inquiry`, async (t) => {
    const fixture = mount(t, {}, website);
    await fixture.submit(fixture.render());
    assert.equal(fixture.requests.length, 1);
    assert.equal(fixture.events.filter((event) => event.name === "form_complete").length, 0);
  });
}

test("validation failure and email draft preparation never complete an inquiry", async (t) => {
  const fixture = mount(t, { deliveryConfigured: false });
  fixture.form.values.find(([key]) => key === "challenge")[1] = "";
  await fixture.submit(fixture.render());
  assert.equal(fixture.events.length, 0);
  fixture.form.values.find(([key]) => key === "challenge")[1] = "A fictional workflow question.";
  await fixture.submit(fixture.render());
  assert.deepEqual(fixture.events.map((event) => event.name), ["inquiry_draft_created"]);
  assert.equal(fixture.requests.length, 0);
});

test("a published guide stays attached to the inquiry request and one accepted lead event", async t => {
  const article = "a-new-published-guide";
  const fixture = mount(t, { article, articleTitle: "A useful business guide" });
  const tree = fixture.render();
  const form = find(tree, element => element.type === "form");
  form.props.onFocusCapture();
  form.props.onFocusCapture();
  await fixture.submit(tree);
  await fixture.submit(tree);
  assert.equal(fixture.requests.length, 1);
  const request = JSON.parse(fixture.requests[0].options.body);
  assert.equal(fixture.requests[0].url, "/api/consultation");
  assert.equal(request.sourceArticle, article);
  assert.equal(request.name, "QA Example");
  assert.equal(request.company, "Fictional QA");
  assert.equal(Object.hasOwn(request, "articleTitle"), false);
  assert.deepEqual(fixture.events, [
    { name: "form_start", context: { article } },
    { name: "form_complete", context: { source: "inquiry", article } },
  ]);
  assert.doesNotMatch(JSON.stringify(fixture.events), /QA Example|qa@example|Fictional QA|useful business guide/);
});

test("a failed guide inquiry retains context for retry and does not create a lead", async t => {
  const article = "a-new-published-guide";
  const fixture = mount(t, { article, articleTitle: "A useful business guide" });
  fixture.deliver(async () => new Response('{"ok":false,"error":"Provider unavailable"}', { status: 502 }));
  await fixture.submit(fixture.render());
  assert.ok(find(fixture.render(), element => element.type === "form"));
  assert.deepEqual(fixture.events, [{ name: "form_error", context: { source: "inquiry", article } }]);
  assert.equal(JSON.parse(fixture.requests[0].options.body).sourceArticle, article);
  fixture.deliver(async () => new Response('{"ok":true}', { status: 200 }));
  await fixture.submit(fixture.render());
  assert.equal(JSON.parse(fixture.requests[1].options.body).sourceArticle, article);
  assert.equal(fixture.events.filter(event => event.name === "form_complete").length, 1);
  assert.deepEqual(fixture.events.at(-1), { name: "form_complete", context: { source: "inquiry", article } });
});

test("guide context on an email draft remains a draft action rather than a delivered lead", async t => {
  const article = "a-new-published-guide";
  const fixture = mount(t, { article, deliveryConfigured: false });
  await fixture.submit(fixture.render());
  assert.equal(fixture.requests.length, 0);
  assert.deepEqual(fixture.events, [{ name: "inquiry_draft_created", context: { source: "inquiry", article } }]);
});

test("an editorial Blog inquiry sends sourcePost and records one post-specific lead without private fields", async t => {
  const post = "an-approved-editorial-post";
  const fixture = mount(t, { post, postTitle: "An editorial title that stays out of analytics" });
  const tree = fixture.render();
  const form = find(tree, element => element.type === "form");
  form.props.onFocusCapture();
  form.props.onFocusCapture();
  await fixture.submit(tree);
  await fixture.submit(tree);
  assert.equal(fixture.requests.length, 1);
  const payload = JSON.parse(fixture.requests[0].options.body);
  assert.equal(payload.sourcePost, post);
  assert.equal(Object.hasOwn(payload, "sourceArticle"), false);
  assert.equal(Object.hasOwn(payload, "postTitle"), false);
  assert.deepEqual(fixture.events, [
    { name: "form_start", context: { post } },
    { name: "form_complete", context: { source: "inquiry", post } },
  ]);
  assert.doesNotMatch(JSON.stringify(fixture.events), /qa@example|QA Example|Fictional QA|editorial title/);
});

test("Blog delivery failures do not count leads, and retry preserves post context", async t => {
  const post = "an-approved-editorial-post";
  const fixture = mount(t, { post });
  for (const response of [new Response('{"ok":false}', { status: 502 }), new Response('{"ok":false}', { status: 200 })]) {
    fixture.deliver(async () => response);
    await fixture.submit(fixture.render());
    assert.ok(find(fixture.render(), element => element.type === "form"));
    assert.equal(fixture.events.filter(event => event.name === "form_complete").length, 0);
    assert.deepEqual(fixture.events.at(-1), { name: "form_error", context: { source: "inquiry", post } });
  }
  fixture.deliver(async () => { throw new TypeError("Fixture delivery failure"); });
  await fixture.submit(fixture.render());
  assert.equal(fixture.events.filter(event => event.name === "form_complete").length, 0);
  fixture.deliver(async () => new Response('{"ok":true}', { status: 200 }));
  await fixture.submit(fixture.render());
  for (const request of fixture.requests) assert.equal(JSON.parse(request.options.body).sourcePost, post);
  assert.deepEqual(fixture.events.at(-1), { name: "form_complete", context: { source: "inquiry", post } });
  assert.equal(fixture.events.filter(event => event.name === "form_complete").length, 1);
});

test("Blog context takes precedence over a legacy Guide context in form events", async t => {
  const post = "an-approved-editorial-post";
  const fixture = mount(t, { post, article: "software-data-migration" });
  find(fixture.render(), element => element.type === "form").props.onFocusCapture();
  await fixture.submit(fixture.render());
  assert.deepEqual(fixture.events, [
    { name: "form_start", context: { post } },
    { name: "form_complete", context: { source: "inquiry", post } },
  ]);
});

test("an editorial Blog email draft is a separate non-lead action", async t => {
  const post = "an-approved-editorial-post";
  const fixture = mount(t, { post, deliveryConfigured: false });
  await fixture.submit(fixture.render());
  assert.equal(fixture.requests.length, 0);
  assert.deepEqual(fixture.events, [{ name: "inquiry_draft_created", context: { source: "inquiry", post } }]);
});
