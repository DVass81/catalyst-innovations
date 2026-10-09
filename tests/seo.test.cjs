/* eslint-disable @typescript-eslint/no-require-imports -- Matches the existing standalone TypeScript test harness. */
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
  mod.require = (id) => Object.hasOwn(mocks, id) ? mocks[id] : original(id);
  mod._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, filename);
  return mod.exports;
}

const site = { name: "Catalyst Innovations", url: "https://mycatalystinnovations.com" };
const seo = load("lib/seo.ts", { "@/lib/site": { site } });

test("search and social metadata share canonical identity and retain existing generated image routes", () => {
  const metadata = seo.pageMetadata({ title: "Custom Software Pricing", description: "Understand implementation and monthly support costs.", path: "/pricing" });
  assert.equal(metadata.title.absolute, "Custom Software Pricing | Catalyst Innovations");
  assert.equal(metadata.openGraph.title, metadata.title.absolute);
  assert.equal(metadata.twitter.title, metadata.title.absolute);
  assert.equal(metadata.openGraph.description, metadata.description);
  assert.equal(metadata.twitter.description, metadata.description);
  assert.equal(metadata.openGraph.url, "https://mycatalystinnovations.com/pricing");
  assert.equal(metadata.alternates.canonical, metadata.openGraph.url);
  assert.equal(metadata.openGraph.images[0].url, "https://mycatalystinnovations.com/opengraph-image");
  assert.deepEqual(metadata.twitter.images, metadata.openGraph.images);
  assert.equal(metadata.twitter.card, "summary_large_image");
  const home = seo.pageMetadata({ title: "Catalyst Innovations — Custom software.", description: "Custom business software.", path: "/" });
  assert.equal(home.title.absolute, "Catalyst Innovations — Custom software.");
  const solution = seo.pageMetadata({ title: "Custom Software", description: "Software for your business.", path: "/solutions/custom-software" });
  assert.equal(solution.openGraph.images[0].url, "https://mycatalystinnovations.com/solutions/custom-software/opengraph-image");
  assert.deepEqual(solution.twitter.images, solution.openGraph.images);
});

test("the public portal can be crawled to read its noindex directive", () => {
  const robots = load("app/robots.ts", { "@/lib/site": { site } }).default();
  const metadata = seo.pageMetadata({ title: "Client Portal", description: "Coming soon.", path: "/portal", noIndex: true });
  assert.equal(metadata.robots.index, false);
  assert.equal(metadata.robots.follow, true);
  assert.ok(!robots.rules.disallow.some((prefix) => "/portal".startsWith(prefix)));
  assert.ok(robots.rules.disallow.includes("/api/"));
});

test("founder and retired-tool links redirect permanently to the existing public destinations", async () => {
  const config = load("next.config.ts").default;
  const redirects = await config.redirects();
  assert.deepEqual(redirects.find((route) => route.source === "/founders"), {
    source: "/founders", destination: "/about#our-background", permanent: true,
  });
  for (const source of ["/start", "/roi-estimator"]) {
    assert.ok(redirects.some((route) => route.source === source && route.destination === "/tools/project-roi" && route.permanent));
  }
});

test("all standard pricing packages and their costs are visible in server-rendered HTML", () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const pricing = load("data/pricing.ts", { "./buyerFaqs": load("data/buyerFaqs.ts", { "./catalystProcess": load("data/catalystProcess.ts") }) });
  const reveal = load("components/Reveal.tsx");
  const { default: PricingGrid } = load("components/PricingGrid.tsx", {
    "./Reveal": reveal,
    "@/data/pricing": pricing,
    "./ui": { ButtonLink: ({ href, children }) => React.createElement("a", { href }, children) },
  });
  const tiers = pricing.pricingTiers.filter((tier) => tier.id !== "founding-partner");
  const html = renderToStaticMarkup(React.createElement(PricingGrid, { tiers }));
  for (const tier of tiers) {
    assert.ok(html.includes(tier.name));
    assert.ok(html.includes(pricing.formatPriceRange(tier.oneTimeLow, tier.oneTimeHigh)));
    assert.ok(html.includes(pricing.formatPriceRange(tier.monthlyLow, tier.monthlyHigh)));
  }
  assert.doesNotMatch(html, /opacity:\s*0(?:[;"\s])|visibility:\s*hidden|display:\s*none/);
  assert.match(html, /First-year base total/);
});

test("the sitemap includes published guides and playable demo pages without retired or private destinations", () => {
  const insights = load("data/insights.ts");
  const demos = load("data/demos.ts");
  const redesign = load("data/redesign.ts", {
    "./industries": load("data/industries.ts"),
    "./industryNeeds": load("data/industryNeeds.ts"),
  });
  const sitemap = load("app/sitemap.ts", {
    "@/lib/site": { site: { ...site, url: `${site.url}/` } },
    "@/data/insights": insights,
    "@/data/demos": demos,
    "@/data/services": load("data/services.ts"),
    "@/lib/calculators": load("lib/calculators.ts"),
    "@/data/redesign": redesign,
  }).default();
  const urls = sitemap.map((entry) => entry.url);
  assert.equal(new Set(urls).size, urls.length);
  for (const article of insights.insights) {
    const entry = sitemap.find((entry) => entry.url === `${site.url}/insights/${article.slug}`);
    assert.ok(entry, article.slug);
    assert.equal(entry.lastModified, article.updatedAt);
  }
  assert.ok(urls.includes(`${site.url}/insights`));
  assert.ok(urls.includes(`${site.url}/services`));
  for (const demo of demos.demos) {
    const entry = sitemap.find((entry) => entry.url === `${site.url}/portfolio/${demo.id}`);
    assert.ok(entry, demo.id);
    assert.equal(entry.videos.length, 1);
    assert.equal(entry.videos[0].content_loc, `${site.url}${demo.walkthrough.video}`);
    assert.equal(entry.videos[0].thumbnail_loc, `${site.url}${demo.walkthrough.poster}`);
    assert.ok(entry.videos[0].duration >= 60 && entry.videos[0].duration <= 90);
    assert.ok(!entry.url.includes("#"));
  }
  assert.ok(!JSON.stringify(sitemap).includes("ondigitalocean.app"));
  for (const url of urls) {
    const pathname = new URL(url).pathname;
    assert.ok(!pathname.includes("//"));
    assert.ok(!["/founders", "/portal", "/demo-lab", "/start", "/roi-estimator"].includes(pathname));
  }
});

test("industry and tool-library client props omit calculator definitions while preserving initial server content", () => {
  const { renderToStaticMarkup } = require("react-dom/server");
  const calculators = load("lib/calculators.ts");
  const redesign = load("data/redesign.ts", {
    "./industries": load("data/industries.ts"),
    "./industryNeeds": load("data/industryNeeds.ts"),
  });
  const { default: IndustrySelectorClient } = load("components/IndustrySelectorClient.tsx", {
    "@/lib/site": { track() {} },
    "@/data/startingPoints": load("data/startingPoints.ts"),
    "./IndustryProblems": load("components/IndustryProblems.tsx"),
    "@/data/redesign": redesign,
  });
  const { default: IndustrySelector } = load("components/IndustrySelector.tsx", {
    "@/lib/calculators": calculators,
    "@/data/redesign": redesign,
    "@/data/startingPoints": load("data/startingPoints.ts"),
    "./IndustrySelectorClient": { default: IndustrySelectorClient },
  });
  const selector = IndustrySelector();
  const plumbing = redesign.industryList.find((industry) => industry.slug === "plumbing");
  assert.ok(Object.values(selector.props.toolTitles).every((title) => typeof title === "string"));
  assert.deepEqual(selector.props.industries.map(({ slug }) => slug), redesign.industryList.map(({ slug }) => slug));
  for (const industry of selector.props.industries) {
    assert.deepEqual(Object.keys(industry).sort(), ["example", "group", "name", "problems", "slug", "solutions", "tools"]);
    assert.ok(["hoa", "flooring", "painting"].includes(industry.example.id));
  }
  for (const industry of redesign.industryList) {
    for (const slug of industry.tools) assert.equal(selector.props.toolTitles[slug], calculators.getCalculator(slug).title);
  }
  const selectorHtml = renderToStaticMarkup(selector);
  assert.match(selectorHtml, /value="plumbing" selected=""/);
  for (const slug of plumbing.tools) assert.ok(selectorHtml.includes(`/tools/${slug}?industry=plumbing`));

  const { default: ToolLibraryClient } = load("components/ToolLibraryClient.tsx", { "@/data/redesign": redesign });
  const { default: ToolLibrary } = load("components/ToolLibrary.tsx", {
    "@/lib/calculators": calculators,
    "./ToolLibraryClient": { default: ToolLibraryClient },
  });
  const library = ToolLibrary();
  const html = renderToStaticMarkup(library);
  assert.equal(library.props.calculators.length, calculators.calculators.length);
  for (const summary of library.props.calculators) {
    assert.deepEqual(Object.keys(summary).sort(), ["category", "description", "kind", "slug", "title"]);
    assert.ok(html.includes(`/tools/${summary.slug}`));
  }
  assert.match(html, /Find a calculator/);
  assert.match(html, /All problems/);
  assert.match(html, /All industries/);
});
