/* eslint-disable @typescript-eslint/no-require-imports -- Standalone TS/SSR harness matches the existing tests. */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

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
const attribution = load("lib/blog-attribution.ts");
const analytics = load("lib/analytics.ts");
const slug = "software-data-migration";
const route = `/insights/${slug}`;
const canonical = `https://mycatalystinnovations.com${route}`;

test("share links carry only reviewed channel/article labels and never inherit private queries", () => {
  for (const channel of attribution.blogCampaignChannels) {
    const result = new URL(attribution.articleCampaignUrl(`${canonical}?email=private@example.test&utm_term=confidential#private`, slug, channel));
    assert.equal(result.origin, "https://mycatalystinnovations.com");
    assert.equal(result.pathname, route);
    assert.deepEqual([...result.searchParams], [["ci_source", channel], ["ci_article", slug]]);
    assert.equal(result.hash, "");
  }
  for (const url of ["javascript:alert(1)", `https://person:password@example.test${route}`, "https://site.example/private", "not a url"]) {
    assert.equal(attribution.articleCampaignUrl(url, slug, "linkedin"), null);
  }
  for (const article of ["private/person", "person@example.test", "bad%2Fpath", "a".repeat(101)]) {
    assert.equal(attribution.articleCampaignUrl(`https://site.example/insights/${article}`, article, "linkedin"), null);
  }
  assert.equal(attribution.articleCampaignUrl(canonical, slug, "private@example.test"), null);
});

test("campaign parsing requires one published article matching its actual landing path", () => {
  const query = `?ci_source=google_business_profile&ci_article=${slug}&email=private@example.test&utm_source=confidential`;
  assert.deepEqual(attribution.parseBlogCampaign(query, route, [slug]), { article: slug, channel: "google_business_profile" });
  for (const search of [
    `?ci_source=linkedin&ci_article=${slug}&ci_article=${slug}`,
    `?ci_source=linkedin&ci_source=email&ci_article=${slug}`,
    `?ci_source=private@example.test&ci_article=${slug}`,
    "?ci_source=linkedin&ci_article=unpublished",
    `?utm_source=linkedin&ci_article=${slug}`,
    "?ci_source=linkedin&ci_article=person%40example.test",
  ]) assert.equal(attribution.parseBlogCampaign(search, route, [slug]), null);
  assert.equal(attribution.parseBlogCampaign(query, "/consultation", [slug]), null);
  assert.equal(attribution.parseBlogCampaign(query, route, []), null);
});

function storageFixture() {
  const stored = new Map();
  const operations = [];
  const storage = {
    getItem(key) { operations.push(["get", key]); return stored.get(key) ?? null; },
    setItem(key, value) { operations.push(["set", key, value]); stored.set(key, value); },
    removeItem(key) { operations.push(["remove", key]); stored.delete(key); },
  };
  let accessed = 0;
  return { stored, operations, session: attribution.createBlogCampaignSession([slug], () => { accessed++; return storage; }), accessed: () => accessed };
}

test("campaign persistence waits for consent and stores only labels for this browser tab", () => {
  const fixture = storageFixture();
  const query = `?ci_source=linkedin&ci_article=${slug}&email=private@example.test`;
  fixture.session.capture(query, route);
  assert.deepEqual(fixture.session.properties(), {});
  assert.equal(fixture.accessed(), 0);
  fixture.session.activate(query, route);
  assert.deepEqual(fixture.session.properties(), { campaign_article: slug, campaign_channel: "linkedin" });
  assert.deepEqual(JSON.parse(fixture.stored.get(attribution.blogCampaignStorageKey)), { article: slug, channel: "linkedin" });
  assert.doesNotMatch(JSON.stringify(fixture.operations), /private|email|utm/);
  fixture.session.capture("?ci_article=unpublished&ci_source=email", "/insights/unpublished");
  assert.equal(fixture.session.properties().campaign_channel, "linkedin");
  fixture.session.withdraw();
  assert.equal(fixture.stored.size, 0);
  assert.deepEqual(fixture.session.properties(), {});
  const accesses = fixture.accessed();
  fixture.session.capture(query, route);
  assert.equal(fixture.accessed(), accesses);
  fixture.session.activate("", "/consultation");
  assert.deepEqual(fixture.session.properties(), {}, "Withdrawal must prevent stale campaign revival");
});

test("persisted campaigns are revalidated and blocked browser storage degrades to memory", () => {
  const fixture = storageFixture();
  fixture.stored.set(attribution.blogCampaignStorageKey, JSON.stringify({ article: slug, channel: "email", email: "private@example.test" }));
  fixture.session.activate("", "/consultation");
  assert.deepEqual(fixture.session.properties(), { campaign_article: slug, campaign_channel: "email" });
  fixture.stored.set(attribution.blogCampaignStorageKey, JSON.stringify({ article: "private-account", channel: "linkedin" }));
  fixture.session.activate("", "/consultation");
  assert.deepEqual(fixture.session.properties(), {});
  const blocked = attribution.createBlogCampaignSession([slug], () => { throw new Error("blocked"); });
  assert.doesNotThrow(() => blocked.activate(`?ci_source=direct&ci_article=${slug}`, route));
  assert.deepEqual(blocked.properties(), { campaign_article: slug, campaign_channel: "direct" });
  assert.doesNotThrow(() => blocked.withdraw());
  assert.deepEqual(blocked.properties(), {});
});

test("blog campaigns respect basic analytics and cannot grant advertising measurement", () => {
  const fixture = storageFixture();
  const events = [];
  const starts = [];
  const session = analytics.createAnalyticsSession({
    start(path, ads) { starts.push({ path, ads }); fixture.session.activate(`?ci_source=linkedin&ci_article=${slug}`, path); },
    page() {},
    send(payload) { events.push({ ...payload, props: { ...fixture.session.properties(), ...payload.props } }); },
    stop() { fixture.session.withdraw(); },
  }, { articleIds: [slug] });
  session.navigate(route);
  session.track("article_share", { article: slug, channel: "copy" });
  assert.equal(events.length, 0);
  assert.equal(fixture.accessed(), 0);
  session.consent("granted");
  assert.deepEqual(starts, [{ path: route, ads: false }]);
  session.navigate("/consultation");
  session.track("form_complete", { source: "inquiry", email: "private@example.test" });
  assert.deepEqual(events.at(-1).props, { source: "inquiry", article: slug, campaign_article: slug, campaign_channel: "linkedin" });
  assert.doesNotMatch(JSON.stringify(events), /private|email|ci_source/);
  session.consent("denied");
  const count = events.length;
  session.track("form_complete", { source: "inquiry" });
  assert.equal(events.length, count);
  assert.equal(fixture.stored.size, 0);
});

test("sharing exposes copy, LinkedIn and email draft actions without auto-publishing or external media", () => {
  const { default: ArticleShare } = load("components/ArticleShare.tsx", {
    "@/lib/blog-attribution": attribution,
    "@/lib/site": { track: () => assert.fail("Server rendering must not track an interaction") },
    "./ArticleShare.module.css": { default: {} },
  });
  const html = renderToStaticMarkup(React.createElement(ArticleShare, { slug, title: "A useful guide", url: `${canonical}?email=private` }));
  assert.match(html, /<button type="button">/);
  assert.match(html, /Copy link/);
  assert.match(html, /linkedin\.com\/sharing\/share-offsite/);
  assert.match(html, /target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /href="mailto:\?subject=A%20useful%20guide/);
  assert.match(html, /role="status"/);
  assert.doesNotMatch(html, /private|<script|<iframe|<img|<video/);
  assert.equal(renderToStaticMarkup(React.createElement(ArticleShare, { slug: "private/person", title: "Hidden", url: canonical })), "");
});

test("copy records success only after the clipboard works and provides a safe fallback on failure", async t => {
  const navigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  t.after(() => { if (navigatorDescriptor) Object.defineProperty(globalThis, "navigator", navigatorDescriptor); else delete globalThis.navigator; });
  const events = [];
  const states = [];
  const clipboard = [];
  const { default: ArticleShare } = load("components/ArticleShare.tsx", {
    react: { useState: initial => [initial, next => states.push(next)] },
    "@/lib/blog-attribution": attribution,
    "@/lib/site": { track: (event, props) => events.push({ event, props }) },
    "./ArticleShare.module.css": { default: {} },
  });
  function children(element) {
    return element && typeof element === "object" ? [element, ...React.Children.toArray(element.props?.children).flatMap(children)] : [];
  }
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: { clipboard: { writeText: async value => clipboard.push(value) } } });
  const tree = ArticleShare({ slug, title: "A guide", url: canonical });
  const button = children(tree).find(element => element.type === "button");
  assert.equal(events.length, 0);
  assert.equal(clipboard.length, 0);
  await button.props.onClick();
  assert.equal(clipboard[0], attribution.articleCampaignUrl(canonical, slug, "direct"));
  assert.deepEqual(events, [{ event: "article_share", props: { article: slug, channel: "copy" } }]);
  assert.deepEqual(states, [true, false]);
  navigator.clipboard.writeText = async () => { throw new Error("blocked clipboard"); };
  await button.props.onClick();
  assert.equal(events.length, 1, "A failed copy must not be reported as a successful share action");
  assert.deepEqual(states.slice(-2), [false, true]);
});
