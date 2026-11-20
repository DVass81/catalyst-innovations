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

test("guide and blog libraries keep their routes and readable labels distinct before JavaScript", () => {
  const html = renderToStaticMarkup(React.createElement(library.default, { articles: summaries, kind: "guide" }));
  for (const article of summaries) assert.ok(html.includes(`/insights/${article.slug}`), article.slug);
  assert.match(html, /Search guides/);
  assert.match(html, /All topics/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /<time dateTime="2026-10-03">/);
  assert.doesNotMatch(html, /opacity:\s*0|visibility:\s*hidden|display:\s*none/);
  const blog = renderToStaticMarkup(React.createElement(library.default, { articles: [{ ...summaries[0], slug: "editorial-fixture" }] }));
  assert.match(blog, /href="\/blog\/editorial-fixture"/);
  assert.match(blog, /Search articles/);
  assert.doesNotMatch(blog, /href="\/insights\//);
});

const blogPosts = [1, 2, 3].map(number => ({ ...data.insights[0], slug: `editorial-fixture-${number}`, title: `Distinct editorial fixture ${number}`, publishedAt: "2026-10-30", evidence: [] }));
const content = load("lib/native-blog-content.ts");
const nativeBody = load("components/NativeBlogBody.tsx", { "@/lib/native-blog-content": content });
const articleReader = load("components/BlogArticle.tsx", {
  "next/link": link,
  "@/components/ArticleShare": { default: ({ url }) => React.createElement("a", { href: url }, "Share this article") },
  "@/components/NativeBlogBody": nativeBody,
  "@/lib/blog": { blogReadingMinutes: () => 4 },
  "@/lib/calculators": { getCalculator: () => ({ title: "Example calculator", description: "A sample calculator" }) },
  "@/lib/site": { site: { url: "https://mycatalystinnovations.com", name: "Catalyst Innovations" } },
});
const pageShared = {
  "@/components/studio/StudioPhoto": { default: () => React.createElement("figure", null, "Representative photography") },
  "next/link": link,
  "@/data/insights": data,
  "@/lib/site": { site: { url: "https://mycatalystinnovations.com" } },
  "@/lib/blog": { getPublishedPosts: async () => blogPosts, blogReadingMinutes: () => 4 },
  "@/lib/seo": { pageMetadata: value => value, breadcrumbSchema: () => ({}) },
  "@/components/SiteSections": { DiscussCTA: () => null },
  "@/components/BlogLibrary": { default: library.default },
  "@/components/BlogArticle": articleReader,
};

test("the public blog and homepage highlights contain only distinct published blog posts", async () => {
  const shared = {
    ...pageShared,
    "../insights/insights.css": {},
    "./blog.css": {},
  };
  const page = load("app/blog/page.tsx", shared);
  const pageElement = await page.default();
  const html = renderToStaticMarkup(pageElement);
  assert.match(html, /The Catalyst Blog/);
  assert.match(html, /Distinct editorial fixture 1/);
  assert.match(html, /href="https:\/\/mycatalystinnovations\.com\/blog\/editorial-fixture-1"/);
  assert.doesNotMatch(html, /\/blog\/manufacturing-spreadsheets/);
  assert.equal(page.metadata.path, "/blog");
  const { default: Highlights } = load("components/BlogHighlights.tsx", {
    ...shared,
    "./BlogHighlights.module.css": { default: {} },
  });
  const highlights = renderToStaticMarkup(await Highlights());
  assert.match(highlights, /href="\/blog"/);
  assert.match(highlights, /Distinct editorial fixture 1/);
  assert.doesNotMatch(highlights, /href="\/insights/);
  assert.equal((highlights.match(/<article/g) ?? []).length, 3);
  assert.match(html, /href="\/feed.xml"/);
});

test("an empty blog explains the editorial intent without republishing guides or inventing a post", async () => {
  const shared = { ...pageShared, "@/lib/blog": { getPublishedPosts: async () => [], blogReadingMinutes: () => 4 } };
  const page = load("app/blog/page.tsx", { ...shared, "../insights/insights.css": {}, "./blog.css": {} });
  const html = renderToStaticMarkup(await page.default());
  assert.match(html, /first Friday edition/);
  assert.match(html, /3–5 minute/);
  assert.doesNotMatch(html, /href="\/blog\/editor"|For the Catalyst team: open the editor/);
  assert.match(html, /href="\/insights"/);
  assert.doesNotMatch(html, /Latest edition|editorial-fixture|\/blog\/manufacturing-spreadsheets/);
  const Highlights = load("components/BlogHighlights.tsx", { ...shared, "./BlogHighlights.module.css": { default: {} } }).default;
  assert.equal(await Highlights(), null);
});

test("the Blog home shows the complete latest article and its formatting without another click", async () => {
  const post = { ...blogPosts[0], nativeBody: "The entire opening is visible immediately, without another page to open.\n\n## A useful section label\n\nKeep the **important label** and a [source](https://example.com).\n\n- First practical step\n- Second practical step\n\nThe final paragraph must also be present on the Blog home." };
  const page = load("app/blog/page.tsx", { ...pageShared, "@/lib/blog": { getPublishedPosts: async () => [post], blogReadingMinutes: () => 4 }, "../insights/insights.css": {}, "./blog.css": {} });
  const html = renderToStaticMarkup(await page.default());
  assert.match(html, /<h1>Distinct editorial fixture 1<\/h1>/);
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
  assert.match(html, /4 min read/);
  assert.match(html, /<time dateTime="2026-10-30">October 30, 2026<\/time>/);
  assert.match(html, /The entire opening is visible immediately/);
  assert.match(html, /<h2 id="section-a-useful-section-label">A useful section label<\/h2>/);
  assert.match(html, /<strong>important label<\/strong>/);
  assert.match(html, /<li>Second practical step<\/li>/);
  assert.match(html, /The final paragraph must also be present/);
  assert.doesNotMatch(html, /Read the latest article|Read the article|Explore the articles|blog-featured-copy/);
  assert.doesNotMatch(html, /For the Catalyst team: open the editor|href="\/blog\/editor"/);
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  assert.equal(scripts.find(schema => schema["@type"] === "BlogPosting").mainEntityOfPage, `https://mycatalystinnovations.com/blog/${post.slug}`);
});

test("Guides remain eight static references even when the separate blog is unavailable", async () => {
  const page = load("app/insights/page.tsx", { ...pageShared, "@/lib/blog": { getPublishedPosts: async () => { throw Error("unavailable"); } }, "./insights.css": {} });
  const html = renderToStaticMarkup(await page.default());
  assert.match(html, /The Catalyst Guides/);
  assert.doesNotMatch(html, /The Catalyst Blog|Latest edition/);
  for (const guide of data.insights) assert.ok(html.includes(`/insights/${guide.slug}`));
  assert.equal(page.metadata.path, "/insights");
});

test("optional homepage blog suggestions do not hide the homepage during a catalog outage", async () => {
  const { default: Highlights } = load("components/BlogHighlights.tsx", {
    "next/link": link,
    "@/data/insights": data,
    "@/lib/blog": { getPublishedPosts: async () => { throw new Error("catalog unavailable"); } },
    "./BlogHighlights.module.css": { default: {} },
  });
  assert.equal(await Highlights(), null);
});
