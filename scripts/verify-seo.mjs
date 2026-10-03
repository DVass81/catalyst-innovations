import { readFile, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const base = new URL(process.argv[2] ?? "http://127.0.0.1:3111");
if (!["127.0.0.1", "localhost", "[::1]"].includes(base.hostname)) {
  throw new Error("This verification script only requests a local preview.");
}
const startedAt = new Date().toISOString();
const decode = (text = "") => text.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (_, entity) => {
  if (entity[0] === "#") return String.fromCodePoint(entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10));
  return { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">" }[entity.toLowerCase()];
});
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map((match) => [match[1].toLowerCase(), decode(match[2] ?? match[3])]));
const plain = (html = "") => decode(html.replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
const localUrl = (url) => {
  const path = new URL(url, base);
  return new URL(`${path.pathname}${path.search}`, base);
};
const sameUrl = (left, right) => Boolean(left && right && new URL(left).href === new URL(right).href);
async function get(url, options = {}) {
  const response = await fetch(localUrl(url), { redirect: "manual", signal: AbortSignal.timeout(30000), ...options });
  return { response, text: await response.text() };
}
function inspect(html) {
  const meta = {};
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const item = attrs(match[0]);
    const key = item.name ?? item.property;
    if (key) (meta[key] ??= []).push(item.content ?? "");
  }
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => attrs(match[0]));
  const titles = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map((match) => plain(match[1]));
  const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => plain(match[1]));
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
  const schemas = [];
  const schemaErrors = [];
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (attrs(match[1]).type !== "application/ld+json") continue;
    try {
      const parsed = JSON.parse(match[2]);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      if (!items.length || items.some((item) => !item || typeof item !== "object" || (!item["@type"] && !item["@graph"]))) throw new Error("Missing structured-data type/graph");
      schemas.push(...items.map((item) => item["@type"] ?? "Graph"));
    } catch (error) { schemaErrors.push(error.message); }
  }
  return { meta, links, titles, h1, words: plain(main).split(/\s+/).filter(Boolean).length, schemas, schemaErrors };
}

const { response: sitemapResponse, text: sitemapText } = await get("/sitemap.xml");
if (sitemapResponse.status !== 200) throw new Error(`Sitemap returned ${sitemapResponse.status}`);
const urls = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1]));
if (!urls.length) throw new Error("No sitemap URLs found");
const pages = [];
const images = new Set();
const demoMedia = [];
let next = 0;
await Promise.all(Array.from({ length: 5 }, async () => {
  while (next < urls.length) {
    const canonical = urls[next++];
    const path = new URL(canonical).pathname;
    try {
      const { response, text } = await get(canonical);
      const found = inspect(text);
      const first = (name) => found.meta[name]?.[0];
      const failures = [];
      const check = (passed, message) => { if (!passed) failures.push(message); };
      check(response.status === 200, `HTTP ${response.status}`);
      check(found.titles.length === 1 && found.titles[0].length > 5, "Missing or repeated title");
      check(found.meta.description?.length === 1 && first("description").length > 20, "Missing or repeated description");
      const canonicals = found.links.filter((link) => link.rel === "canonical");
      check(canonicals.length === 1 && sameUrl(canonicals[0].href, canonical), "Canonical differs from sitemap URL");
      check(sameUrl(first("og:url"), canonical), "OpenGraph URL differs from canonical");
      for (const channel of ["og", "twitter"]) {
        check(first(`${channel}:title`) === found.titles[0], `${channel} title differs from page title`);
        check(first(`${channel}:description`) === first("description"), `${channel} description differs from page description`);
        const image = first(`${channel}:image`);
        check(Boolean(image && new URL(image, canonical).origin === new URL(canonical).origin), `Missing or noncanonical ${channel} image`);
        if (image) images.add(image);
      }
      check(first("og:image") === first("twitter:image"), "OpenGraph and Twitter images differ");
      check(found.h1.length === 1 && /[\p{L}\p{N}]/u.test(found.h1[0]), "Missing or repeated meaningful H1");
      check(found.words >= 25, "Insufficient server-rendered main content");
      check(!found.meta.robots?.some((value) => /noindex/i.test(value)), "Sitemap page is noindex");
      check(found.schemas.length > 0 && found.schemaErrors.length === 0, "Missing or invalid JSON-LD");
      if (/^\/portfolio\/(hoa|flooring|painting)$/.test(path)) {
        const video = text.match(/<video\b([^>]*)>([\s\S]*?)<\/video>/i);
        const attributes = attrs(video?.[1] ?? "");
        const source = attrs(video?.[2].match(/<source\b[^>]*>/i)?.[0] ?? "");
        const captions = attrs(video?.[2].match(/<track\b[^>]*>/i)?.[0] ?? "");
        check(Boolean(video && /\bcontrols(?:\s|=|$)/i.test(video[1])), "Native video controls missing from initial HTML");
        check(attributes.preload === "none" && !/\bautoplay(?:\s|=|$)/i.test(video?.[1] ?? ""), "Direct visit preloads or autoplays demo");
        check(Boolean(source.src?.startsWith("/demos/") && source.type === "video/mp4"), "Initial HTML lacks local video source");
        check(captions.kind === "captions" && captions.srclang === "en" && Boolean(captions.src), "English captions missing");
        check(/id="transcript"/.test(text) && /Full video transcript/.test(text), "Visible transcript missing");
        check(found.schemas.includes("BreadcrumbList"), "Demo breadcrumbs missing");
        for (const [kind, asset] of [["video", source.src], ["poster", attributes.poster], ["captions", captions.src]]) {
          if (asset) demoMedia.push({ page: path, kind, asset });
          else check(false, `Missing ${kind} asset`);
        }
      }
      pages.push({ path, status: response.status, title: found.titles[0], description: first("description"), canonical: canonicals[0]?.href, h1: found.h1[0], mainWordCount: found.words, schemaTypes: found.schemas, image: first("og:image"), failures });
    } catch (error) { pages.push({ path, failures: [error.message] }); }
  }
}));
pages.sort((left, right) => left.path.localeCompare(right.path));

const demoMediaChecks = await Promise.all(demoMedia.map(async (item) => {
  try {
    const response = await fetch(localUrl(item.asset), { method: "HEAD", signal: AbortSignal.timeout(30000) });
    const contentType = response.headers.get("content-type") ?? "";
    const validType = item.kind === "video" ? /^video\/mp4/.test(contentType) : item.kind === "poster" ? /^image\//.test(contentType) : /^text\/vtt/.test(contentType);
    return { ...item, status: response.status, contentType, passed: response.status === 200 && validType };
  } catch (error) { return { ...item, passed: false, error: error.message }; }
}));

const imageChecks = [];
for (const url of images) {
  try {
    const response = await fetch(localUrl(url), { signal: AbortSignal.timeout(30000) });
    await response.arrayBuffer();
    imageChecks.push({ path: new URL(url).pathname, status: response.status, contentType: response.headers.get("content-type"), passed: response.status === 200 && /^image\//.test(response.headers.get("content-type") ?? "") });
  } catch (error) { imageChecks.push({ url, passed: false, error: error.message }); }
}
const redirects = [];
for (const [path, destination] of [["/founders", "/about#our-background"], ["/start", "/tools/project-roi"], ["/roi-estimator", "/tools/project-roi"], ["/demo-lab", "/portfolio"]]) {
  const { response } = await get(path);
  const location = response.headers.get("location");
  const target = location ? new URL(location, base) : null;
  const final = target ? (await get(target)).response.status : null;
  redirects.push({ path, status: response.status, location, finalStatus: final, passed: response.status === 308 && target && `${target.pathname}${target.hash}` === destination && final === 200 });
}
const missingPages = [];
for (const path of ["/not-a-real-page", "/solutions/not-a-real-solution", "/industries/not-a-real-industry", "/tools/not-a-real-tool", "/insights/not-a-real-guide", "/portfolio/not-a-real-demo"]) {
  const { response, text } = await get(path);
  const noindex = inspect(text).meta.robots?.some((value) => /noindex/i.test(value)) ?? false;
  missingPages.push({ path, status: response.status, noindex, passed: response.status === 404 && noindex });
}
const { response: portalResponse, text: portalText } = await get("/portal");
const { response: robotsResponse, text: robotsText } = await get("/robots.txt");
const portal = { status: portalResponse.status, noindex: inspect(portalText).meta.robots?.some((value) => /noindex/i.test(value)) ?? false, disallowed: /^Disallow:\s*\/portal\b/im.test(robotsText) };
portal.passed = portal.status === 200 && portal.noindex && !portal.disallowed;
const robots = { status: robotsResponse.status, excludesApi: /^Disallow:\s*\/api\//im.test(robotsText), referencesSitemap: /^Sitemap:\s*https?:\/\/\S+\/sitemap\.xml/im.test(robotsText) };
robots.passed = robots.status === 200 && robots.excludesApi && robots.referencesSitemap;
const duplicates = (key) => Object.entries(Object.groupBy(pages.filter((page) => page[key]), (page) => page[key])).filter(([, group]) => group.length > 1).map(([value, group]) => ({ value, paths: group.map((page) => page.path) }));
const duplicateTitles = duplicates("title");
const duplicateDescriptions = duplicates("description");

const baseline = { "/": 573048, "/tools": 550098 };
let bundles;
try {
  const stats = JSON.parse(await readFile(resolve(".next/diagnostics/route-bundle-stats.json"), "utf8"));
  bundles = await Promise.all(Object.entries(baseline).map(async ([route, previousBytes]) => {
    const entry = stats.find((item) => item.route === route);
    if (!entry) return { route, error: "Route missing from bundle diagnostics" };
    const paths = entry.firstLoadChunkPaths;
    const chunks = await Promise.all(paths.map(async (path) => ({ path, source: await readFile(resolve(path), "utf8"), bytes: (await stat(resolve(path))).size })));
    return { route, baselineUncompressedBytes: previousBytes, currentUncompressedBytes: entry.firstLoadUncompressedJsBytes, deltaBytes: entry.firstLoadUncompressedJsBytes - previousBytes, calculatorDefinitionChunks: chunks.filter((chunk) => chunk.source.includes("Time saved per activity") || chunk.source.includes("Fully loaded hourly labor cost")).map(({ path, bytes }) => ({ path, bytes })) };
  }));
} catch (error) { bundles = { error: error.message }; }
const failedPages = pages.filter((page) => page.failures.length);
const passed = !failedPages.length && !duplicateTitles.length && !duplicateDescriptions.length && imageChecks.every((image) => image.passed) && demoMediaChecks.length === 9 && demoMediaChecks.every((asset) => asset.passed) && redirects.every((redirect) => redirect.passed) && missingPages.every((page) => page.passed) && portal.passed && robots.passed;
const result = { startedAt, completedAt: new Date().toISOString(), baseUrl: base.origin, scope: "Local production build; no browser execution or external requests. Canonical/social URLs checked against the sitemap. Images and demo media checked through the local origin.", passed, totalPages: pages.length, failedPages: failedPages.length, duplicateTitles, duplicateDescriptions, images: imageChecks, demoMedia: demoMediaChecks, redirects, missingPages, portal, robots, bundles, pages };
await writeFile(resolve("docs/seo-crawl-verification.json"), JSON.stringify(result, null, 2) + "\n");
const bundleLines = Array.isArray(bundles) ? bundles.map((entry) => `| ${entry.route} | ${entry.baselineUncompressedBytes ?? "unavailable"} | ${entry.currentUncompressedBytes ?? "unavailable"} | ${entry.deltaBytes ?? "unavailable"} | ${entry.calculatorDefinitionChunks?.length ?? "unavailable"} |`) : ["Bundle diagnostics unavailable."];
const markdown = `# SEO crawl verification\n\nRun: ${result.completedAt} on ${base.origin}.\n\nResult: **${passed ? "PASS" : "FAIL"}**. ${pages.length - failedPages.length}/${pages.length} sitemap pages passed their individual checks.\n\n- Every sitemap page: HTTP 200, matching canonical and OpenGraph URL, matching search/OpenGraph/Twitter titles and descriptions, matching social images, one meaningful H1, at least 25 words in server-rendered main content, and parseable JSON-LD with a type or graph.\n- Unique titles: ${duplicateTitles.length ? "FAIL" : "PASS"}; unique descriptions: ${duplicateDescriptions.length ? "FAIL" : "PASS"}.\n- Social image responses: ${imageChecks.filter((image) => image.passed).length}/${imageChecks.length} passed.\n- Permanent redirects: ${redirects.filter((redirect) => redirect.passed).length}/${redirects.length} passed.\n- Unknown routes: ${missingPages.filter((page) => page.passed).length}/${missingPages.length} returned HTTP 404 with noindex.\n- Public portal: ${portal.passed ? "PASS" : "FAIL"} (HTTP 200, noindex, crawl allowed). Robots/API/sitemap checks: ${robots.passed ? "PASS" : "FAIL"}.\n\n## Initial JavaScript\n\n| Route | Prior build bytes | Current bytes | Difference | Calculator-definition chunks remaining |\n| --- | ---: | ---: | ---: | ---: |\n${bundleLines.join("\n")}\n\nValues are uncompressed initial JavaScript from Next build diagnostics. The prior build predates the combined SEO/analytics/content changes, so the overall difference is not attributable to one change. Absence of calculator field strings checks the intended IndustrySelector/ToolLibrary boundary reduction. This is not a mobile performance score.\n\n## Limits\n\nThis checks raw responses from the local production build; browser interaction, actual indexing, real-user performance and rich-result eligibility are separate checks. Parseable JSON-LD is not a guarantee of search-engine eligibility. No production traffic, forms or analytics events were sent.\n${failedPages.length || duplicateTitles.length || duplicateDescriptions.length ? `\n## Findings\n\n${failedPages.map((page) => `- ${page.path}: ${page.failures.join("; ")}`).join("\n")}\n${duplicateTitles.map((item) => `- Duplicate title: ${item.paths.join(", ")}`).join("\n")}\n${duplicateDescriptions.map((item) => `- Duplicate description: ${item.paths.join(", ")}`).join("\n")}\n` : ""}`;
await writeFile(resolve("docs/seo-crawl-verification.md"), markdown + `\n## Searchable demonstrations\n\nAll three watch pages checked for a native player with preload disabled, no autoplay, local video source, English captions, visible transcript and breadcrumbs in initial HTML. ${demoMediaChecks.filter(asset => asset.passed).length}/${demoMediaChecks.length} video/poster/caption assets returned HTTP 200 with the expected content type.\n`);
console.log(JSON.stringify({ passed, totalPages: pages.length, failedPages: failedPages.map(({ path, failures }) => ({ path, failures })), duplicateTitles, duplicateDescriptions, imageFailures: imageChecks.filter((image) => !image.passed), demoMediaFailures: demoMediaChecks.filter((asset) => !asset.passed), redirectFailures: redirects.filter((redirect) => !redirect.passed), missingPageFailures: missingPages.filter((page) => !page.passed), portal, robots, bundles }, null, 2));
process.exitCode = passed ? 0 : 1;
