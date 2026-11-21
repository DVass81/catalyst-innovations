/* eslint-disable @typescript-eslint/no-require-imports -- Standalone TypeScript/React harness used by this repository. */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { createHash } = require("node:crypto");

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

const content = load("lib/native-blog-content.ts");
const { NativeBlogBody } = load("components/NativeBlogBody.tsx", { "@/lib/native-blog-content": content });
const render = body => renderToStaticMarkup(React.createElement(NativeBlogBody, { body }));
const fixture = () => ({
  title: "A useful article for business owners",
  slug: "a-useful-article",
  description: "A practical introduction to improving a handoff in your business.",
  category: "Everyday operations",
  body: "Follow a real request from the beginning to the end. Identify the person responsible at each step and the information they need.",
});

test("native input accepts a simple paste and normalizes metadata without changing the article", () => {
  const input = { ...fixture(), title: `  ${fixture().title}  `, body: `\n${fixture().body}\n` };
  const parsed = content.parseNativeBlogInput(input);
  assert.equal(parsed.title, fixture().title);
  assert.equal(parsed.body, input.body);
  for (const change of [
    { title: "too short" }, { title: "x".repeat(121) }, { slug: "editor" }, { slug: "Mixed-Case" },
    { slug: "a/route" }, { slug: "x".repeat(101) }, { slug: "ends-" },
    { description: "too short" }, { description: "x".repeat(241) }, { category: " " }, { category: "x".repeat(81) },
    { body: "x".repeat(99) }, { body: " ".repeat(100) }, { body: "x".repeat(60_001) },
  ]) assert.equal(content.parseNativeBlogInput({ ...fixture(), ...change }), null, JSON.stringify(change).slice(0, 180));
  assert.ok(content.parseNativeBlogInput({ ...fixture(), body: "x".repeat(60_000) }));
});

test("published documents require real calendar dates and publication identity", () => {
  const document = { ...fixture(), publishedAt: "2028-02-29", updatedAt: "2028-03-01", publicationId: "3372a388-8c8f-43f4-b7ba-332915991f31" };
  assert.deepEqual(content.parseNativeBlogDocument(document), document);
  for (const change of [{ publishedAt: "2026-02-29" }, { publishedAt: "2028-02-30" }, { updatedAt: "2028-02-28" }, { publicationId: "invented" }]) {
    assert.equal(content.parseNativeBlogDocument({ ...document, ...change }), null);
  }
});

test("featured images accept only curated immutable identities and meaningful plain-text alternative text", () => {
  const image = content.nativeBlogImages[0];
  const featuredImage = { assetId: image.assetId, alt: `  ${image.alt}  ` };
  const parsed = content.parseNativeBlogInput({ ...fixture(), featuredImage });
  assert.deepEqual(parsed.featuredImage, { assetId: image.assetId, alt: image.alt });
  const document = { ...parsed, publishedAt: "2026-11-20", updatedAt: "2026-11-20", publicationId: "3372a388-8c8f-43f4-b7ba-332915991f31" };
  assert.deepEqual(content.parseNativeBlogDocument(document).featuredImage, parsed.featuredImage);
  for (const invalid of [
    null, "https://attacker.test/image.webp", { assetId: "f".repeat(64), alt: image.alt },
    { assetId: image.src, alt: image.alt }, { assetId: image.assetId, alt: "short" },
    { assetId: image.assetId, alt: "x".repeat(251) }, { assetId: image.assetId, alt: "A <script>bad image</script> description" },
    { assetId: image.assetId, alt: "A descriptive image\u0000 label" },
    { assetId: image.assetId, alt: image.alt, url: "https://attacker.test/image.webp" },
  ]) assert.equal(content.parseNativeBlogInput({ ...fixture(), featuredImage: invalid }), null);
});

test("image absence preserves legacy canonical content and image-only changes alter version identity", () => {
  const legacy = fixture();
  const parsed = content.parseNativeBlogInput(legacy);
  assert.deepEqual(parsed, legacy);
  assert.equal(Object.hasOwn(parsed, "featuredImage"), false);
  const hash = value => createHash("sha256").update(JSON.stringify(value)).digest("hex");
  assert.equal(hash(parsed), hash(legacy));
  const legacyDocument = { ...legacy, publishedAt: "2026-11-20", updatedAt: "2026-11-20", publicationId: "3372a388-8c8f-43f4-b7ba-332915991f31" };
  assert.equal(hash(content.parseNativeBlogDocument(legacyDocument)), hash(legacyDocument));
  const first = content.nativeBlogImages[0];
  const second = content.nativeBlogImages[1];
  const withImage = content.parseNativeBlogInput({ ...legacy, featuredImage: { assetId: first.assetId, alt: first.alt } });
  assert.notEqual(hash(withImage), hash(parsed));
  assert.notEqual(hash(withImage), hash(content.parseNativeBlogInput({ ...legacy, featuredImage: { assetId: second.assetId, alt: second.alt } })));
  assert.notEqual(hash(withImage), hash(content.parseNativeBlogInput({ ...legacy, featuredImage: { assetId: first.assetId, alt: "A carefully described manufacturing work environment." } })));
});

test("the curated image library resolves local covers with recorded rights and immutable matching bytes", () => {
  const studio = load("data/studioMedia.ts").studioPhotos;
  const originals = new Map(Object.values(studio).map(photo => [
    createHash("sha256").update(fs.readFileSync(path.join(__dirname, "..", "public", photo.src))).digest("hex"), photo,
  ]));
  assert.equal(content.nativeBlogImages.length, 8);
  assert.equal(new Set(content.nativeBlogImages.map(image => image.assetId)).size, 8);
  assert.equal(content.nativeBlogImage(undefined), undefined);
  for (const image of content.nativeBlogImages) {
    const original = originals.get(image.assetId);
    assert.ok(original, "Every curated image must retain a known studio source.");
    assert.equal(image.src, `/blog-images/${image.assetId}.webp`);
    const bytes = fs.readFileSync(path.join(__dirname, "..", "public", image.src));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), image.assetId);
    assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
    assert.deepEqual([image.width, image.height, image.alt, image.credit, image.sourceUrl, image.licenseUrl],
      [original.width, original.height, original.alt, original.credit, original.sourceUrl, original.licenseUrl]);
    assert.deepEqual(content.nativeBlogImage({ assetId: image.assetId, alt: "An article-specific plain-language image description." }), {
      url: image.src, alt: "An article-specific plain-language image description.", width: image.width, height: image.height,
      credit: image.credit, sourceUrl: image.sourceUrl, caption: "Representative photography", licenseUrl: image.licenseUrl,
    });
  }
});

test("the body parser preserves all prose in order across paragraphs, lists, quotes and rules", () => {
  const body = "Opening line.\r\nSecond line.\r\n\r\n# First heading\r\n\r\n- First action\r\n  with its detail\r\n- Second action\r\n\r\n3. Third step\r\n4. Fourth step\r\n\r\n> Someone’s quoted words.\r\n> Another quoted line.\r\n\r\n---\r\n\r\nFinal paragraph.";
  const blocks = content.parseBlogBody(body);
  assert.deepEqual(blocks, [
    { type: "paragraph", text: "Opening line.\nSecond line." },
    { type: "heading", level: 2, id: "section-first-heading", text: "First heading" },
    { type: "ul", items: ["First action\nwith its detail", "Second action"] },
    { type: "ol", start: 3, items: ["Third step", "Fourth step"] },
    { type: "blockquote", text: "Someone’s quoted words.\nAnother quoted line." },
    { type: "rule" }, { type: "paragraph", text: "Final paragraph." },
  ]);
  const html = render(body);
  assert.match(html, /Opening line\.<br\/>Second line\./);
  assert.match(html, /<ol start="3">/);
  let cursor = 0;
  for (const text of ["Opening line.", "Second line.", "First heading", "First action", "with its detail", "Second action", "Third step", "Fourth step", "Someone’s quoted words.", "Another quoted line.", "Final paragraph."]) {
    const index = html.indexOf(text, cursor);
    assert.ok(index >= cursor, text);
    cursor = index + text.length;
  }
});

test("headings stay stable, deduplicate actual collisions, and preserve one page H1", () => {
  const body = "# Café & teams\n\n## Café & teams\n\n### Café teams 2\n\n## **Café & teams**\n\n### !!!";
  const headings = content.nativeBlogHeadings(body);
  assert.deepEqual(headings.map(item => item.id), ["section-cafe-teams", "section-cafe-teams-2", "section-cafe-teams-2-2", "section-cafe-teams-3", "section-heading"]);
  assert.deepEqual(headings.map(item => item.level), [2, 2, 3, 2, 3]);
  assert.deepEqual(content.nativeBlogHeadings(body), headings);
  const html = render(body);
  assert.doesNotMatch(html, /<h1\b/);
  for (const heading of headings) assert.ok(html.includes(`id="${heading.id}"`));
});

test("the shared renderer formats safe links and emphasis while escaping active HTML", () => {
  const body = '**Useful idea** and *a careful step*. Read [the primary source](https://www.nist.gov/mep/value-stream-mapping).\n\n<script>alert("private")</script>\n<img src=x onerror=alert(1)>\n\n[Unsafe](javascript:alert(1)) [Data](data:text/html,test) [HTTP](http://example.test/) [Credentials](https://person:secret@example.test/)';
  const html = render(body);
  assert.match(html, /<strong>Useful idea<\/strong>/);
  assert.match(html, /<em>a careful step<\/em>/);
  assert.match(html, /href="https:\/\/www\.nist\.gov\/mep\/value-stream-mapping" target="_blank" rel="noopener noreferrer"/);
  assert.equal((html.match(/<a\b/g) ?? []).length, 1);
  assert.doesNotMatch(html, /<script\b|<img\b|href="(?:javascript|data|http):/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(html, /\[Unsafe\]\(javascript:alert\(1\)\)/);
});

test("reading time counts visible article words and keeps empty previews readable", () => {
  assert.equal(content.nativeReadingMinutes(""), 1);
  assert.equal(content.nativeReadingMinutes(Array(200).fill("word").join(" ")), 1);
  assert.equal(content.nativeReadingMinutes(Array(201).fill("word").join(" ")), 2);
  assert.equal(content.nativeReadingMinutes("[Source](https://example.test/a/very-long-url)"), 1);
});

test("source links retain balanced URL parentheses and long incomplete markup remains ordinary text", () => {
  const body = "Read [source **details**](https://example.test/report_(2026)?view=full#results).";
  const html = render(body);
  assert.match(html, /href="https:\/\/example\.test\/report_\(2026\)\?view=full#results"/);
  assert.match(html, /source <strong>details<\/strong>/);
  const incomplete = "[".repeat(60_000);
  assert.deepEqual(content.parseBlogInline(incomplete), [{ type: "text", text: incomplete }]);
  assert.equal(render(incomplete).replace(/<[^>]*>/g, ""), incomplete);
});
