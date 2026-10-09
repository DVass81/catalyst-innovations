/* eslint-disable @typescript-eslint/no-require-imports -- Standalone content and server-rendering checks. */
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
const insights = load("data/insights.ts");
const analytics = load("lib/analytics.ts");
const buyerContent = load("data/buyerFaqs.ts", { "./catalystProcess": load("data/catalystProcess.ts") });
const content = load("data/seoContent.ts", { "./buyerFaqs": buyerContent });
const calculators = load("lib/calculators.ts");
const services = load("data/services.ts");
const redesign = load("data/redesign.ts", { "./industries": load("data/industries.ts"), "./industryNeeds": load("data/industryNeeds.ts") });
const site = { name: "Catalyst Innovations", url: "https://mycatalystinnovations.com" };
const seo = load("lib/seo.ts", { "@/lib/site": { site } });
const common = {
  "next/link": { default: ({ children, ...props }) => React.createElement("a", props, children) },
  "next/navigation": { notFound() { throw new Error("NOT_FOUND"); } },
  "@/data/insights": insights, "@/data/seoContent": content, "@/lib/calculators": calculators,
  "@/data/services": services, "@/data/redesign": redesign, "@/lib/seo": seo, "@/lib/site": { site },
};

test("eight practical guides have complete sections, primary references and valid contextual links", () => {
  assert.equal(insights.insights.length, 8);
  assert.equal(new Set(insights.insights.map(a => a.slug)).size, 8);
  assert.deepEqual([...analytics.analyticsArticleIds].sort(), insights.insights.map(a => a.slug).sort());
  const domains = ["nist.gov", "ascm.org", "microsoft.com", "caionline.org", "sba.gov", "aiacontracts.com", "gov.uk"];
  for (const article of insights.insights) {
    assert.ok(article.sections.length >= 4);
    assert.equal(new Set(article.sections.map(s => s.id)).size, article.sections.length);
    const words = [article.introduction, article.example.text, article.nextStep, ...article.sections.flatMap(s => s.paragraphs)].join(" ").split(/\s+/);
    assert.ok(words.length >= 350, `${article.slug} needs a full practical guide`);
    assert.ok(article.example.text.match(/fictional|illustration|possible process/i));
    assert.ok(article.sources.length > 0);
    for (const source of article.sources) {
      const url = new URL(source.url);
      assert.equal(url.protocol, "https:");
      assert.ok(domains.some(domain => url.hostname === domain || url.hostname.endsWith(`.${domain}`)));
      assert.match(source.reviewedAt, /^\d{4}-\d{2}-\d{2}$/);
    }
    for (const section of article.sections) if (section.source !== undefined) assert.ok(article.sources[section.source]);
    assert.equal(article.tools.length, 3);
    for (const tool of article.tools) assert.ok(calculators.getCalculator(tool), `${article.slug}: missing calculator ${tool}`);
    assert.ok(services.services.some(s => s.slug === article.solution));
    if (article.industry) assert.ok(redesign.industryList.some(i => i.slug === article.industry));
    if (article.related) {
      assert.equal(new Set(article.related).size, article.related.length);
      for (const slug of article.related) {
        assert.notEqual(slug, article.slug);
        assert.ok(insights.getInsight(slug), `${article.slug}: missing related guide ${slug}`);
      }
    }
    assert.equal(analytics.analyticsPath(`/insights/${article.slug}?email=private`), `/insights/${article.slug}`);
  }
});

test("every existing industry, solution and calculator has distinct useful context and valid guide references", () => {
  for (const [records, pages] of [[content.industryContent, redesign.industryList], [content.solutionContent, services.services], [content.calculatorContent, calculators.calculators]]) {
    assert.deepEqual(Object.keys(records).sort(), pages.map(page => page.slug).sort());
    assert.equal(new Set(Object.values(records).map(record => record.introduction)).size, pages.length);
    for (const page of pages) {
      const record = records[page.slug];
      assert.ok(record.introduction.length > 100);
      assert.ok(insights.getInsight(record.guide));
      if (record.solution) assert.ok(services.services.some(s => s.slug === record.solution));
      if (record.tools) for (const slug of record.tools) assert.ok(calculators.getCalculator(slug));
    }
  }
});

test("custom-software evidence and cost guidance are readable without JavaScript and use reviewed records", async () => {
  const demos = load("data/demos.ts");
  const demoPages = load("data/demoPages.ts");
  const { buyerFaqs } = buyerContent;
  const custom = content.solutionContent["custom-software"];
  assert.deepEqual(custom.demoEvidence, ["flooring", "painting"]);
  assert.deepEqual(custom.costGuidance, buyerFaqs.cost);
  const pageMocks = {
    ...common,
    "@/data/demos": demos,
    "@/data/demoPages": demoPages,
    "@/data/motionStories": load("data/motionStories.ts"),
    "@/components/VisualStory": { default: () => React.createElement("div") },
    "@/components/SiteSections": {
      PageIntro: ({ title, text }) => React.createElement("header", null, React.createElement("h1", null, title), React.createElement("p", null, text)),
      DiscussCTA: () => React.createElement("aside"),
    },
    "./solution.module.css": { default: {} },
  };
  const page = load("app/solutions/[slug]/page.tsx", pageMocks);
  const html = renderToStaticMarkup(await page.default({ params: Promise.resolve({ slug: "custom-software" }) }));
  const evidence = html.match(/<section\b[^>]*aria-labelledby="software-evidence-heading"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(evidence, "actual examples have their own named section");
  for (const id of custom.demoEvidence) {
    const demo = demos.demos.find(item => item.id === id);
    const context = demoPages.getDemoPage(id);
    assert.ok(demo?.walkthrough && context, `${id}: playable watch page and reviewed context exist`);
    assert.ok(evidence.includes(`href="/portfolio/${id}"`));
    assert.ok(evidence.includes(renderToStaticMarkup(React.createElement("p", null, context.boundary))), `${id}: full sample/prototype boundary remains visible`);
    assert.ok(evidence.includes(`alt="${demo.steps[0].alt}"`));
    assert.ok(fs.existsSync(path.join(__dirname, "..", "public", demo.steps[0].image)));
  }
  assert.equal((evidence.match(/loading="lazy"/g) || []).length, 2);
  assert.match(evidence, /Demonstration prototype/);
  assert.doesNotMatch(evidence, /<video\b|<iframe\b|<details\b|ondigitalocean\.app/);
  const publicPrototypePage = load("app/solutions/[slug]/page.tsx", {
    ...pageMocks,
    "@/data/demos": { demos: demos.demos.map(demo => demo.id === "painting" ? { ...demo, availability: "public-sample", status: "Public sample", publicUrl: "https://painting-sample.example/" } : demo) },
  });
  const publicPrototypeHtml = renderToStaticMarkup(await publicPrototypePage.default({ params: Promise.resolve({ slug: "custom-software" }) }));
  const publicEvidence = publicPrototypeHtml.match(/<section\b[^>]*aria-labelledby="software-evidence-heading"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.match(publicEvidence, /Demonstration prototype/, "making the public sample available must not imply a completed painting deployment");
  const cost = html.match(/<section\b[^>]*aria-labelledby="software-cost-heading"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(cost.includes(renderToStaticMarkup(React.createElement("p", null, buyerFaqs.cost.answer))));
  assert.match(cost, /href="\/pricing">View custom software implementation and monthly pricing/);
  for (const service of services.services.filter(item => item.slug !== "custom-software")) {
    const otherHtml = renderToStaticMarkup(await page.default({ params: Promise.resolve({ slug: service.slug }) }));
    assert.doesNotMatch(otherHtml, /software-evidence-heading|software-cost-heading/, `${service.slug}: optional sections do not alter other solution pages`);
  }
});

test("guide pages expose complete readable content, organization attribution and matching metadata without JavaScript", async () => {
  const page = load("app/insights/[slug]/page.tsx", { ...common, "../insights.css": {} });
  for (const article of insights.insights) {
    const params = Promise.resolve({ slug: article.slug });
    const html = renderToStaticMarkup(await page.default({ params }));
    assert.match(html, /Published by Catalyst Innovations/);
    assert.match(html, /Illustrative example/);
    assert.match(html, /Read the guide/);
    for (const section of article.sections) assert.ok(html.includes(`id="${section.id}"`));
    for (const tool of article.tools) assert.ok(html.includes(`/tools/${tool}`));
    for (const slug of article.related ?? []) assert.ok(html.includes(`/insights/${slug}`));
    const reviewedAt = article.sources.map(source => source.reviewedAt).sort().at(-1);
    assert.ok(html.includes(`Latest source review: <time dateTime="${reviewedAt}"`), `${article.slug}: source review date must come from its references`);
    const script = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1];
    const schemas = JSON.parse(script);
    const schema = schemas.find(item => item["@type"] === "Article");
    assert.equal(schema.author["@type"], "Organization");
    assert.equal(schema.author.name, "Catalyst Innovations");
    const metadata = await page.generateMetadata({ params });
    assert.equal(metadata.alternates.canonical, schema.url);
    assert.equal(metadata.openGraph.type, "article");
    assert.equal(metadata.openGraph.title, metadata.title.absolute);
  }
  await assert.rejects(page.default({ params: Promise.resolve({ slug: "does-not-exist" }) }), /NOT_FOUND/);
});

test("industry pages retain the first three problem pairs and relevant inquiry/calculator context", async () => {
  const page = load("app/industries/[slug]/page.tsx", { ...common,
    "@/data/startingPoints": load("data/startingPoints.ts"),
    "@/components/IndustryProblems": load("components/IndustryProblems.tsx"),
    "@/components/SiteSections": { PageIntro: ({ title, text }) => React.createElement("header", null, React.createElement("h1", null, title), React.createElement("p", null, text)) },
  });
  for (const industry of redesign.industryList) {
    const html = renderToStaticMarkup(await page.default({ params: Promise.resolve({ slug: industry.slug }) }));
    assert.equal((html.match(/Common problem/g) || []).length, 3);
    assert.ok(html.indexOf("Common problem") < html.indexOf("A practical starting point"));
    assert.ok(html.includes(`/consultation?industry=${industry.slug}`));
    for (const tool of industry.tools) assert.ok(html.includes(`/tools/${tool}?industry=${industry.slug}`));
    assert.ok(html.includes(`/insights/${content.industryContent[industry.slug].guide}`));
  }
});

test("calculator additions retain the original calculator definitions and validated industry context", async () => {
  const received = [];
  const descriptions = [];
  const page = load("app/tools/[slug]/page.tsx", { ...common,
    "@/components/CalculatorForm": { default: ({ calculator, industry }) => { received.push({ calculator, industry }); return React.createElement("div", null, calculator.formula, calculator.caveat); } },
  });
  for (const calculator of calculators.calculators) {
    const metadata = await page.generateMetadata({ params: Promise.resolve({ slug: calculator.slug }) });
    descriptions.push(metadata.description);
    assert.ok(metadata.description.includes(calculator.title));
    const html = renderToStaticMarkup(await page.default({ params: Promise.resolve({ slug: calculator.slug }), searchParams: Promise.resolve({ industry: "painting" }) }));
    assert.strictEqual(received.at(-1).calculator, calculator);
    assert.equal(received.at(-1).industry, "painting");
    assert.match(html, /Read the result carefully/);
    assert.ok(html.includes(`/insights/${content.calculatorContent[calculator.slug].guide}`));
  }
  assert.equal(new Set(descriptions).size, calculators.calculators.length, "each tool has a distinct search description, including opportunity tools");
  renderToStaticMarkup(await page.default({ params: Promise.resolve({ slug: "manual-work" }), searchParams: Promise.resolve({ industry: "unknown" }) }));
  assert.equal(received.at(-1).industry, undefined);
});
