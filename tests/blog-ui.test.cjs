/* eslint-disable @typescript-eslint/no-require-imports -- Standalone SSR checks match this repository's test harness. */
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

const data = load("data/insights.ts");
const link = { default: ({ children, ...props }) => React.createElement("a", props, children) };
const library = load("components/BlogLibrary.tsx", { "next/link": link });
const summaries = data.insights.map(article => ({ slug: article.slug, title: article.title, description: article.description, category: article.category, publishedAt: article.publishedAt, readingMinutes: data.insightReadingMinutes(article) }));

test("blog search combines words and topic without mutating the article list", () => {
  const before = JSON.stringify(summaries);
  assert.equal(library.filterBlogArticles(summaries, "  MANUFACTURING   spreadsheets ", "Manufacturing")[0].slug, "manufacturing-spreadsheets");
  assert.equal(library.filterBlogArticles(summaries, "manufacturing", "Communities").length, 0);
  assert.equal(library.filterBlogArticles(summaries, "unmatched-phrase", "").length, 0);
  assert.equal(library.filterBlogArticles(summaries, "", "").length, summaries.length);
  assert.equal(JSON.stringify(summaries), before);
});

test("the blog library exposes every article and usable labels before JavaScript", () => {
  const html = renderToStaticMarkup(React.createElement(library.default, { articles: summaries }));
  for (const article of summaries) assert.ok(html.includes(`/insights/${article.slug}`), article.slug);
  assert.match(html, /Search articles/);
  assert.match(html, /All topics/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /<time dateTime="2026-10-03">/);
  assert.doesNotMatch(html, /opacity:\s*0|visibility:\s*hidden|display:\s*none/);
});

test("the public blog and homepage highlights include published-source articles with stable URLs", async () => {
  const published = [...data.insights, { ...data.insights[0], slug: "editor-published-example", title: "A newly published guide", publishedAt: "2026-10-30" }];
  const shared = {
    "next/link": link,
    "@/data/insights": data,
    "@/lib/site": { site: { url: "https://mycatalystinnovations.com" } },
    "@/lib/blog": { getPublishedInsights: async () => published },
  };
  const page = load("app/insights/page.tsx", {
    ...shared,
    "@/lib/seo": { pageMetadata: value => value, breadcrumbSchema: () => ({}) },
    "@/components/SiteSections": { DiscussCTA: () => null },
    "@/components/BlogLibrary": { default: library.default },
    "./insights.css": {},
  });
  const pageElement = await page.default();
  const html = renderToStaticMarkup(pageElement);
  assert.match(html, /The Catalyst Blog/);
  assert.match(html, /A newly published guide/);
  assert.match(html, /href="\/insights\/editor-published-example"/);
  assert.equal(page.metadata.path, "/insights");
  const { default: Highlights } = load("components/BlogHighlights.tsx", {
    ...shared,
    "./BlogHighlights.module.css": { default: {} },
  });
  const highlights = renderToStaticMarkup(await Highlights());
  assert.match(highlights, /href="\/insights"/);
  assert.match(highlights, /A newly published guide/);
  assert.equal((highlights.match(/<article/g) ?? []).length, 3);
  assert.match(html, /href="\/feed.xml"/);
});

test("optional homepage reading suggestions do not hide the homepage during a catalog outage", async () => {
  const { default: Highlights } = load("components/BlogHighlights.tsx", {
    "next/link": link,
    "@/data/insights": data,
    "@/lib/blog": { getPublishedInsights: async () => { throw new Error("catalog unavailable"); } },
    "./BlogHighlights.module.css": { default: {} },
  });
  assert.equal(await Highlights(), null);
});
