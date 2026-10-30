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
  const metadata = seo.pageMetadata({ title: "Discovery Call & Custom Software Quotes", description: "Understand discovery and a quote based on your needs.", path: "/discovery" });
  assert.equal(metadata.title.absolute, "Discovery Call & Custom Software Quotes | Catalyst Innovations");
  assert.equal(metadata.openGraph.title, metadata.title.absolute);
  assert.equal(metadata.twitter.title, metadata.title.absolute);
  assert.equal(metadata.openGraph.description, metadata.description);
  assert.equal(metadata.twitter.description, metadata.description);
  assert.equal(metadata.openGraph.url, "https://mycatalystinnovations.com/discovery");
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

test("retired pricing, founder and tool links redirect permanently to their public replacements", async () => {
  const config = load("next.config.ts").default;
  const redirects = await config.redirects();
  assert.deepEqual(redirects.find((route) => route.source === "/founders"), {
    source: "/founders", destination: "/about#our-background", permanent: true,
  });
  assert.deepEqual(redirects.find((route) => route.source === "/pricing"), {
    source: "/pricing", destination: "/discovery", permanent: true,
  });
  for (const source of ["/start", "/roi-estimator"]) {
    assert.ok(redirects.some((route) => route.source === source && route.destination === "/tools/project-roi" && route.permanent));
  }
});

test("CSP permits the linked tag's collect paths without allowing entire Google or DoubleClick hosts", async () => {
  const config = load("next.config.ts").default;
  const headers = (await config.headers())[0].headers;
  const policy = headers.find((header) => header.key === "Content-Security-Policy").value;
  const directives = Object.fromEntries(policy.split(";").map((part) => {
    const [name, ...sources] = part.trim().split(/\s+/);
    return [name, sources];
  }));
  assert.deepEqual(directives["connect-src"], [
    "'self'", "https://plausible.io", "https://*.google-analytics.com",
    "https://analytics.google.com/g/collect", "https://www.google.com/g/collect",
    "https://stats.g.doubleclick.net/g/collect",
  ]);
  assert.ok(!directives["script-src"].some((source) => /doubleclick|analytics\.google\.com|www\.google\.com/.test(source)));
  assert.deepEqual(directives["img-src"], ["'self'", "data:", "blob:"]);
  assert.deepEqual(directives["frame-ancestors"], ["'none'"]);
});

test("discovery fee, conditional credit and arrangement action are readable without JavaScript", () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const process = load("data/catalystProcess.ts");
  const discovery = load("data/discovery.ts", {
    "./buyerFaqs": load("data/buyerFaqs.ts", { "./catalystProcess": process }),
    "./catalystProcess": process,
  });
  const link = { default: ({ href, children, ...props }) => React.createElement("a", { href, ...props }, children) };
  const reveal = load("components/Reveal.tsx");
  const { default: CatalystProcess } = load("components/CatalystProcess.tsx", {
    "next/link": link,
    "@/data/catalystProcess": process,
  });
  const page = load("app/discovery/page.tsx", {
    "next/link": link,
    "@/lib/seo": seo,
    "@/data/catalystProcess": process,
    "@/data/discovery": discovery,
    "@/components/CatalystProcess": { default: CatalystProcess },
    "@/components/Reveal": reveal,
    "./Discovery.module.css": { default: new Proxy({}, { get: (_, key) => key }) },
  });
  const html = renderToStaticMarkup(React.createElement(page.default));
  assert.match(html, /\$250/);
  assert.match(html, /45 minutes/);
  assert.match(html, /If you choose Catalyst to build your software/);
  assert.match(html, /credited toward implementation fees/);
  assert.match(html, /<a[^>]+href="\/consultation"[^>]*>Set up a discovery/);
  assert.match(html, /<details><summary>/);
  assert.match(html, /quoted for your project/);
  assert.doesNotMatch(html, /First-year base total|Standard packages|Annual billing|Founding Partner|\$10,000|\$15,000|\$70,000/);
  assert.doesNotMatch(html, /href="https:\/\/calendly\.com/);
  assert.doesNotMatch(html, /opacity:\s*0(?:[;"\s])|visibility:\s*hidden|display:\s*none/);
  assert.equal(page.metadata.alternates.canonical, `${site.url}/discovery`);
});

test("shared process keeps the homepage price-free and explains the credit only when requested", () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const process = load("data/catalystProcess.ts");
  const { default: CatalystProcess } = load("components/CatalystProcess.tsx", {
    "next/link": { default: ({ href, children }) => React.createElement("a", { href }, children) },
    "@/data/catalystProcess": process,
  });
  const neutral = renderToStaticMarkup(React.createElement(CatalystProcess));
  const paid = renderToStaticMarkup(React.createElement(CatalystProcess, { showDiscoveryPricing: true }));
  assert.match(neutral, /45-minute discovery call/);
  assert.match(neutral, /custom implementation plan and quote/);
  assert.doesNotMatch(neutral, /\$250|complimentary/i);
  assert.match(paid, /\$250/);
  assert.match(paid, /If you choose Catalyst to build the system/);
  assert.match(paid, /credited toward implementation/);
  assert.equal(process.discoveryOffer.fee, 250);
  assert.equal(process.discoveryOffer.durationMinutes, 45);
  assert.doesNotMatch(JSON.stringify(process), /complimentary/i);
});

test("the sitemap includes published guides and playable demo pages without retired or private destinations", () => {
  const insights = load("data/insights.ts");
  const content = load("data/seoContent.ts", {
    "./buyerFaqs": load("data/buyerFaqs.ts", { "./catalystProcess": load("data/catalystProcess.ts") }),
  });
  const demos = load("data/demos.ts");
  const redesign = load("data/redesign.ts", {
    "./industries": load("data/industries.ts"),
    "./industryNeeds": load("data/industryNeeds.ts"),
  });
  const sitemap = load("app/sitemap.ts", {
    "@/lib/site": { site: { ...site, url: `${site.url}/` } },
    "@/data/insights": insights,
    "@/data/seoContent": content,
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
  assert.ok(urls.includes(`${site.url}/discovery`));
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
    assert.ok(!["/pricing", "/founders", "/portal", "/demo-lab", "/start", "/roi-estimator"].includes(pathname));
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
