/* eslint-disable @typescript-eslint/no-require-imports -- Same standalone TS test harness as the existing suite. */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

const root = path.join(__dirname, "..");
function load(file, mocks = {}) {
  const filename = path.join(root, file);
  const compiled = new Module(filename, module);
  compiled.filename = filename;
  compiled.paths = Module._nodeModulePaths(path.dirname(filename));
  const original = compiled.require.bind(compiled);
  compiled.require = (id) => Object.hasOwn(mocks, id) ? mocks[id] : original(id);
  compiled._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, filename);
  return compiled.exports;
}

const site = { name: "Catalyst Innovations", url: "https://mycatalystinnovations.com" };
const demos = load("data/demos.ts");
const pages = load("data/demoPages.ts");
const seo = load("lib/seo.ts", { "@/lib/site": { site } });
const player = load("components/DemoWatchPlayer.tsx", {
  "@/lib/site": { track() {} },
  "@/lib/storyPlayback": load("lib/storyPlayback.ts"),
});
const watch = load("app/portfolio/[demo]/page.tsx", {
  "@/components/DemoWatchPlayer": player,
  "@/data/demos": demos,
  "@/data/demoPages": pages,
  "@/lib/seo": seo,
  "./watch.module.css": { default: {} },
});

const htmlText = (text) => renderToStaticMarkup(React.createElement("p", null, text));
const props = (id) => ({ params: Promise.resolve({ demo: id }) });
function findElement(element, type) {
  if (!React.isValidElement(element)) return undefined;
  if (element.type === type) return element;
  for (const child of React.Children.toArray(element.props.children)) {
    const found = findElement(child, type);
    if (found) return found;
  }
}

test("moving between demo routes gives each native player its own playback state", async () => {
  const keys = [];
  for (const demo of demos.demos) {
    const element = findElement(await watch.default(props(demo.id)), player.default);
    assert.ok(element, `${demo.id}: native player is present`);
    assert.ok(element.key?.endsWith(`$${demo.id}`), `${demo.id}: keyed remount on navigation resets source and progress`);
    assert.equal(element.props.walkthrough.video, demo.walkthrough.video);
    keys.push(element.key);
  }
  assert.equal(new Set(keys).size, 3);
});

test("all three watch pages expose real playable media and the full transcript in initial HTML", async () => {
  assert.deepEqual(watch.generateStaticParams().map(({ demo }) => demo).sort(), ["flooring", "hoa", "painting"]);
  for (const demo of demos.demos) {
    const html = renderToStaticMarkup(await watch.default(props(demo.id)));
    const openingVideo = html.match(/<video\b[^>]*>/g);
    assert.equal(openingVideo.length, 1, `${demo.id}: one primary video`);
    assert.match(openingVideo[0], /\bcontrols=""/);
    assert.match(openingVideo[0], /\bpreload="none"/);
    assert.match(openingVideo[0], /\bwidth="1920"/);
    assert.match(openingVideo[0], /\bheight="1080"/);
    assert.ok(openingVideo[0].includes(`poster="${demo.walkthrough.poster}"`));
    assert.doesNotMatch(openingVideo[0], /autoplay|muted|loop/i, "direct navigation stays silent until play");
    assert.ok(html.includes(`<source src="${demo.walkthrough.video}" type="video/mp4"`));
    assert.ok(html.includes(`<track kind="captions" src="${demo.walkthrough.captions}" srcLang="en" label="English" default=""`));
    const transcript = html.match(/<section\b[^>]*id="transcript"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    assert.ok(transcript, `${demo.id}: accessible transcript section`);
    assert.doesNotMatch(transcript, /<details|\bhidden=|display:\s*none/);
    for (const paragraph of demo.walkthrough.transcript.split(/\n\s*\n/)) {
      assert.ok(transcript.includes(htmlText(paragraph)), `${demo.id}: every narration paragraph is visible`);
    }
    for (const file of [demo.walkthrough.video, demo.walkthrough.poster, demo.walkthrough.captions, ...demo.steps.map(step => step.image)]) {
      assert.ok(file.startsWith("/demos/"), "only reviewed local demo assets");
      assert.ok(fs.statSync(path.join(root, "public", file)).size > 0, `${demo.id}: ${file} exists`);
    }
    assert.match(fs.readFileSync(path.join(root, "public", demo.walkthrough.captions), "utf8"), /^WEBVTT/);
    assert.ok(html.includes(`/consultation?demo=${demo.id}&amp;industry=${demo.industry}`));
  }
});

test("watch pages preserve sample/prototype boundaries and publish only the HOA public environment", async () => {
  for (const demo of demos.demos) {
    const html = renderToStaticMarkup(await watch.default(props(demo.id)));
    const page = pages.getDemoPage(demo.id);
    assert.ok(html.includes(htmlText(page.boundary)), `${demo.id}: limitation text visible`);
    assert.match(html, /sample information/i);
    assert.match(html, /Synthetic narration/);
    for (const capability of demo.capabilities) assert.ok(html.includes(capability));
    const externalLinks = [...html.matchAll(/href="(https?:\/\/[^\"]+)"/g)].map(match => match[1]);
    assert.deepEqual(externalLinks, demo.id === "hoa" ? [demo.publicUrl] : [], "private/archived environments have no live entry link");
    if (demo.id === "painting") {
      assert.match(html, /Planned system · Demonstration prototype/);
      assert.match(html, /Approval and sending are simulated/);
      assert.match(html, /not verified outcomes of a completed deployment/);
    }
    if (demo.id === "flooring") assert.match(html, /stops before creating or sending a proposal/);
    if (demo.id === "hoa") assert.match(html, /stops before submission/);
  }
});

test("watch-page metadata and breadcrumbs use distinct canonical pages without invented video dates", async () => {
  const titles = new Set();
  for (const page of pages.demoPages) {
    const metadata = await watch.generateMetadata(props(page.id));
    const canonical = `${site.url}/portfolio/${page.id}`;
    assert.equal(metadata.alternates.canonical, canonical);
    assert.equal(metadata.openGraph.url, canonical);
    assert.equal(metadata.description, page.description);
    assert.equal(metadata.openGraph.description, metadata.description);
    assert.equal(metadata.twitter.description, metadata.description);
    assert.equal(metadata.openGraph.title, metadata.title.absolute);
    assert.equal(metadata.twitter.title, metadata.title.absolute);
    assert.equal(metadata.robots.index, true);
    assert.deepEqual(metadata.twitter.images, metadata.openGraph.images);
    titles.add(metadata.title.absolute);
    const html = renderToStaticMarkup(await watch.default(props(page.id)));
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    assert.equal(schema["@type"], "BreadcrumbList");
    assert.equal(schema.itemListElement.at(-1).item, canonical);
    assert.doesNotMatch(html, /"uploadDate"|"@type":"VideoObject"/);
  }
  assert.equal(titles.size, 3);
  assert.equal(watch.dynamicParams, false);
  for (const id of ["unknown-demo", "", "constructor"]) {
    await assert.rejects(() => watch.default(props(id)), /NEXT_HTTP_ERROR_FALLBACK;404/);
    await assert.rejects(() => watch.generateMetadata(props(id)), /NEXT_HTTP_ERROR_FALLBACK;404/);
  }
});

test("related services, industries, articles and calculators resolve to existing definitions", () => {
  const services = load("data/services.ts").services;
  const industries = load("data/redesign.ts", {
    "./industries": load("data/industries.ts"),
    "./industryNeeds": load("data/industryNeeds.ts"),
  }).industryList;
  const insights = load("data/insights.ts").insights;
  const calculators = load("lib/calculators.ts").calculators;
  const known = new Set([
    ...services.map(({ slug }) => `/solutions/${slug}`),
    ...industries.map(({ slug }) => `/industries/${slug}`),
    ...insights.map(({ slug }) => `/insights/${slug}`),
    ...calculators.map(({ slug }) => `/tools/${slug}`),
  ]);
  for (const page of pages.demoPages) {
    assert.ok(demos.demos.some(({ id }) => id === page.id));
    const links = [...page.related, ...page.tools];
    assert.equal(new Set(links.map(link => link.href)).size, links.length);
    for (const link of links) {
      const url = new URL(link.href, site.url);
      assert.equal(url.origin, site.url);
      assert.ok(known.has(url.pathname), `${page.id}: ${link.href} resolves`);
      if (url.searchParams.has("industry")) {
        assert.ok(industries.some(({ slug }) => slug === url.searchParams.get("industry")));
      }
    }
  }
});

test("demo cards expose watch-page links while retaining existing anchor and modal entry points", () => {
  const { default: DemoShowcase } = load("components/DemoShowcase.tsx", {
    "@/data/demos": demos,
    "@/lib/site": { track() {} },
  });
  const html = renderToStaticMarkup(React.createElement(DemoShowcase, { detailed: true, context: "industry=plumbing&problem=quoting" }));
  assert.doesNotMatch(html, /<video\b/, "home/library cards still defer media until selected");
  for (const demo of demos.demos) {
    const card = html.match(new RegExp(`<article id="${demo.id}">([\\s\\S]*?)<\\/article>`))?.[1];
    assert.ok(card, `${demo.id}: retained hash anchor`);
    assert.ok(card.includes(`href="/portfolio/${demo.id}"`));
    assert.match(card, /aria-haspopup="dialog"/);
    assert.match(card, /Watch walkthrough/);
    assert.ok(card.includes(`/consultation?industry=plumbing&amp;problem=quoting&amp;demo=${demo.id}`));
  }
});
