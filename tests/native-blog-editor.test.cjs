/* eslint-disable @typescript-eslint/no-require-imports -- Exercise the real client handlers with the repository's hook harness; no article is published. */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const { createHash, webcrypto } = require("node:crypto");
const ts = require("typescript");
const React = require("react");

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
const image = content.nativeBlogImages.find(item => item.label === "Office and paperwork");
const featuredImage = { assetId: image.assetId, alt: image.alt };
function TestNextImage() { return null; }
const FeaturedImage = load("components/BlogFeaturedImage.tsx", { "next/image": { default: TestNextImage } }).default;
const ImagePicker = load("components/NativeBlogImagePicker.tsx", {
  "@/components/BlogFeaturedImage": { default: FeaturedImage },
  "@/lib/native-blog-content": content,
}).default;
const article = {
  title: "A clear handoff for every customer request",
  slug: "a-clear-handoff-for-every-customer-request",
  description: "A practical guide to making customer handoffs easier to follow.",
  category: "Everyday operations",
  body: "Follow one real customer request from the beginning to the end. Identify who is responsible at every step and which information they need.\n\n## Make the next step clear\n\nWrite down the next action so the person receiving the request can continue confidently.",
  featuredImage,
};
const publicationId = "3372a388-8c8f-43f4-b7ba-332915991f31";
const documentFor = post => ({ ...post, publishedAt: "2026-11-20", updatedAt: "2026-11-20", publicationId });
const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json" } });
const catalog = (posts = [], revision = "catalog-revision-a", delivery = Object.fromEntries(posts.map(post => [post.slug, { status: "saved", checkedAt: "2026-11-20T22:30:00Z" }]))) => json({ posts, revision, delivery });
const queued = post => json({ document: documentFor(post), commitSha: "a".repeat(40), status: "queued" });

function find(element, predicate) {
  if (!React.isValidElement(element)) return undefined;
  if (predicate(element)) return element;
  for (const child of React.Children.toArray(element.props.children)) {
    const match = find(child, predicate);
    if (match) return match;
  }
}
function text(element) {
  if (element === null || element === undefined || typeof element === "boolean") return "";
  if (Array.isArray(element)) return element.map(text).join("");
  return React.isValidElement(element) ? text(element.props.children) : String(element);
}
const sameDeps = (left, right) => left && right && left.length === right.length && left.every((value, index) => Object.is(value, right[index]));

function mount(t, delivery = async () => catalog()) {
  let cursor = 0;
  const hooks = [];
  const effects = [];
  const requests = [];
  const timers = new Map();
  let timerId = 0;
  const savedGlobals = Object.fromEntries(["fetch", "crypto", "requestAnimationFrame", "document", "setInterval", "clearInterval"].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  global.document = { visibilityState: "visible" };
  global.setInterval = callback => { const id = ++timerId; timers.set(id, callback); return id; };
  global.clearInterval = id => timers.delete(id);
  Object.defineProperty(globalThis, "crypto", { configurable: true, value: webcrypto });
  global.requestAnimationFrame = callback => { callback(0); return 1; };
  global.fetch = (url, options = {}) => {
    requests.push({ url, options });
    return delivery(url, options);
  };
  const component = load("components/NativeBlogEditor.tsx", {
    react: {
      ...React,
      useState(initial) {
        const index = cursor++;
        hooks[index] ??= { value: typeof initial === "function" ? initial() : initial };
        return [hooks[index].value, next => { hooks[index].value = typeof next === "function" ? next(hooks[index].value) : next; }];
      },
      useRef(initial) { return hooks[cursor++] ??= { current: initial }; },
      useCallback(callback, deps) {
        const index = cursor++;
        if (!sameDeps(hooks[index]?.deps, deps)) hooks[index] = { value: callback, deps };
        return hooks[index].value;
      },
      useEffect(effect, deps) {
        const index = cursor++;
        if (!sameDeps(hooks[index]?.deps, deps)) {
          const previous = hooks[index];
          hooks[index] = { deps };
          effects.push(() => { previous?.cleanup?.(); hooks[index].cleanup = effect(); });
        }
      },
    },
    "next/link": { default: function TestLink() { return null; } },
    "@/components/NativeBlogBody": { default: function TestBody() { return null; } },
    "@/components/NativeBlogImagePicker": { default: ImagePicker },
    "@/components/BlogFeaturedImage": { default: FeaturedImage },
    "@/lib/native-blog-content": content,
  }).default;
  t.after(() => {
    for (const hook of hooks) hook?.cleanup?.();
    for (const [key, descriptor] of Object.entries(savedGlobals)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  const fixture = {
    requests,
    deliver(fn) { delivery = fn; },
    render() {
      cursor = 0;
      const tree = component();
      while (effects.length) effects.shift()();
      return tree;
    },
    field(name) { return find(fixture.render(), element => element.props.id === `native-blog-${name}`); },
    change(name, value) { fixture.field(name).props.onChange({ target: { value } }); },
    imagePicker() { return find(fixture.render(), element => element.type === ImagePicker); },
    imageControl(suffix) { return find(ImagePicker(fixture.imagePicker().props), element => element.props.id === `native-blog-${suffix}`); },
    selectImage(value) { fixture.imagePicker().props.onChange(value); },
    fill(post = article) { for (const [name, value] of Object.entries(post)) { if (name === "featuredImage") fixture.selectImage(value); else fixture.change(name, value); } },
    publishButton() { return find(fixture.render(), element => element.type === "button" && /^(Publish|Retry publish|Saving article)/.test(text(element))); },
    reloadButton() { return find(fixture.render(), element => element.type === "button" && /^(Reload articles|Loading articles)/.test(text(element))); },
    async preview() {
      await find(fixture.render(), element => element.props.className === "nbe-compose").props.onSubmit({ preventDefault() {} });
      return fixture.render();
    },
    async settle() {
      // Client onClick intentionally returns void; drain its fetch/json continuations without a wall-clock delay.
      for (let index = 0; index < 6; index++) await new Promise(resolve => setImmediate(resolve));
      return fixture.render();
    },
    posts() { return requests.filter(request => request.options.method === "POST"); },
    async tick() { for (const callback of [...timers.values()]) callback(); return fixture.settle(); },
    timerCount() { return timers.size; },
  };
  fixture.render();
  return fixture;
}

test("publishing requires both a loaded catalog and a preview of the current valid article", async t => {
  let finishCatalog;
  const fixture = mount(t, () => new Promise(resolve => { finishCatalog = resolve; }));
  assert.equal(fixture.publishButton().props.disabled, true);
  await fixture.settle();
  fixture.fill({ ...article, description: "" });
  const tree = await fixture.preview();
  assert.ok(find(tree, element => element.props.className === "nbe-preview"));
  const summary = find(tree, element => element.props.className === "nbe-preview-meta");
  assert.match(text(summary), /Follow one real customer request/);
  assert.doesNotMatch(text(summary), /##/);
  assert.equal(fixture.publishButton().props.disabled, true, "preview cannot replace the catalog/revision requirement");
  finishCatalog(catalog());
  await fixture.settle();
  assert.equal(fixture.publishButton().props.disabled, false);
  assert.equal(fixture.posts().length, 0, "preview itself makes no publication request");
  fixture.change("body", `${article.body}\n\nA new final paragraph.`);
  assert.equal(fixture.publishButton().props.disabled, true);
  assert.equal(find(fixture.render(), element => element.props.className === "nbe-preview"), undefined);
  fixture.change("title", "Short");
  await fixture.preview();
  assert.equal(fixture.publishButton().props.disabled, true);
  assert.match(text(fixture.render()), /Check the fields below/);
  assert.equal(fixture.field("title").props["aria-invalid"], true);
});

test("publish sends the preview fingerprint, UUID and catalog revision once and reports queued without clearing the article", async t => {
  const fixture = mount(t);
  await fixture.settle();
  fixture.fill({ ...article, title: `  ${article.title}  `, body: `\n${article.body}\n` });
  await fixture.preview();
  const parsed = content.parseNativeBlogInput({ ...article, title: `  ${article.title}  `, body: `\n${article.body}\n` });
  let finish;
  fixture.deliver(async (_url, options) => options.method === "POST" ? new Promise(resolve => { finish = resolve; }) : catalog([documentFor(parsed)], "catalog-revision-b"));
  const button = fixture.publishButton();
  button.props.onClick();
  button.props.onClick();
  assert.equal(fixture.posts().length, 1, "rapid stale clicks share the in-progress guard");
  const request = fixture.posts()[0];
  assert.equal(request.url, "/api/blog/editor");
  assert.equal(request.options.credentials, "same-origin");
  assert.equal(request.options.cache, "no-store");
  assert.equal(request.options.headers["Content-Type"], "application/json");
  const payload = JSON.parse(request.options.body);
  assert.deepEqual(payload.post, parsed);
  assert.equal(payload.revision, "catalog-revision-a");
  assert.match(payload.operationId, /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/);
  assert.equal(payload.previewFingerprint, createHash("sha256").update(JSON.stringify(parsed)).digest("hex"));
  assert.equal(fixture.publishButton().props.disabled, true);
  assert.doesNotMatch(text(fixture.render()), /Saved\. Waiting for deployment/);
  finish(queued(parsed));
  const tree = await fixture.settle();
  assert.match(text(tree), /Saved\. Waiting for deployment\./);
  assert.match(text(tree), /has been queued/);
  assert.doesNotMatch(text(tree), /is now live|published successfully/i);
  assert.equal(fixture.field("body").props.value, parsed.body);
  assert.equal(fixture.field("title").props.value, parsed.title);
  assert.equal(fixture.field("slug").props.readOnly, true);
  const publicLink = find(tree, element => element.type === "a" && text(element).startsWith("Check public article"));
  assert.equal(publicLink.props.href, `/blog/${parsed.slug}`);
  assert.equal(publicLink.props.target, "_blank");
  assert.equal(fixture.publishButton().props.disabled, true, "the saved version needs a new preview before publishing again");
});

test("an uncertain network result retries the exact operation instead of creating a second publication", async t => {
  const fixture = mount(t);
  await fixture.settle();
  fixture.fill();
  await fixture.preview();
  fixture.deliver(async (_url, options) => {
    if (options.method !== "POST") return catalog([documentFor(article)], "catalog-revision-b");
    if (fixture.posts().length < 3) throw new TypeError("Fictional interrupted connection");
    return queued(article);
  });
  for (let attempt = 0; attempt < 2; attempt++) {
    fixture.publishButton().props.onClick();
    await fixture.settle();
    assert.equal(text(fixture.publishButton()), "Retry publish");
    assert.match(text(fixture.render()), /could not be confirmed/);
    assert.doesNotMatch(text(fixture.render()), /Saved\. Waiting for deployment/);
    assert.equal(fixture.field("body").props.value, article.body);
  }
  fixture.publishButton().props.onClick();
  await fixture.settle();
  assert.equal(fixture.posts().length, 3);
  assert.equal(new Set(fixture.posts().map(request => request.options.body)).size, 1, "revision, UUID, fingerprint and article are identical on every retry");
  assert.match(text(fixture.render()), /Saved\. Waiting for deployment/);
});

test("expired sessions use a separate sign-in tab and reload the catalog without discarding the draft", async t => {
  const fixture = mount(t, async () => json({ error: "Expired" }, 401));
  await fixture.settle();
  fixture.fill();
  await fixture.preview();
  const signin = find(fixture.render(), element => element.props.href === "/blog/editor");
  assert.equal(signin.props.target, "_blank");
  assert.equal(signin.props.rel, "noopener noreferrer");
  assert.equal(signin.props.onClick, undefined, "sign-in is a normal new-tab link, not a reload of this draft");
  assert.equal(fixture.publishButton().props.disabled, true);
  assert.match(text(fixture.render()), /session has expired/);
  fixture.deliver(async () => catalog());
  fixture.reloadButton().props.onClick();
  await fixture.settle();
  assert.equal(fixture.field("body").props.value, article.body);
  assert.doesNotMatch(text(fixture.render()), /session has expired/);
  assert.equal(fixture.publishButton().props.disabled, true, "reload requires another preview");
  await fixture.preview();
  assert.equal(fixture.publishButton().props.disabled, false);
  fixture.deliver(async () => json({ error: "Expired" }, 401));
  fixture.publishButton().props.onClick();
  await fixture.settle();
  assert.equal(fixture.field("body").props.value, article.body);
  assert.equal(fixture.publishButton().props.disabled, true);
  assert.equal(find(fixture.render(), element => element.props.href === "/blog/editor").props.target, "_blank");
});

test("a catalog conflict preserves text and requires a fresh revision and preview", async t => {
  const fixture = mount(t);
  await fixture.settle();
  fixture.fill();
  await fixture.preview();
  fixture.deliver(async () => json({ error: "Conflict" }, 409));
  fixture.publishButton().props.onClick();
  await fixture.settle();
  const oldOperation = JSON.parse(fixture.posts()[0].options.body);
  assert.match(text(fixture.render()), /article list changed/);
  assert.equal(fixture.field("body").props.value, article.body);
  assert.equal(fixture.publishButton().props.disabled, true);
  fixture.deliver(async (_url, options) => options.method === "POST" ? queued(article) : catalog([], "catalog-revision-b"));
  fixture.reloadButton().props.onClick();
  await fixture.settle();
  await fixture.preview();
  fixture.publishButton().props.onClick();
  await fixture.settle();
  const newOperation = JSON.parse(fixture.posts()[1].options.body);
  assert.equal(newOperation.revision, "catalog-revision-b");
  assert.notEqual(newOperation.operationId, oldOperation.operationId);
});

test("an unrecognized success payload never claims the article is saved or live", async t => {
  const fixture = mount(t);
  await fixture.settle();
  fixture.fill();
  await fixture.preview();
  fixture.deliver(async () => json({ document: documentFor(article), commitSha: "a".repeat(40), status: "live" }));
  fixture.publishButton().props.onClick();
  await fixture.settle();
  assert.match(text(fixture.render()), /could not be confirmed/);
  assert.doesNotMatch(text(fixture.render()), /Saved\. Waiting for deployment/);
  assert.equal(fixture.field("body").props.value, article.body);
  assert.equal(text(fixture.publishButton()), "Retry publish");
});

test("history lists saved and live versions and opens an existing post without publishing", async t => {
  const document = documentFor(article);
  const fixture = mount(t, async () => catalog([document], "catalog-revision-a", { [article.slug]: { status: "live", checkedAt: "2026-11-20T22:30:00Z" } }));
  await fixture.settle();
  const tree = fixture.render();
  assert.match(text(tree), /Article history/);
  assert.match(text(tree), /First saved Nov 20, 2026/);
  assert.ok(find(tree, element => element.props.className === "nbe-delivery nbe-delivery-live"));
  assert.equal(fixture.timerCount(), 0, "confirmed live articles need no background polling");
  find(tree, element => element.props["aria-label"] === `Open to edit: ${article.title}`).props.onClick();
  assert.equal(fixture.field("body").props.value, article.body);
  assert.equal(fixture.field("title").props.value, article.title);
  assert.equal(fixture.field("slug").props.readOnly, true);
  assert.equal(text(fixture.publishButton()), "Publish changes");
  assert.equal(fixture.posts().length, 0);
});

test("pending history checks change Saved to Live without clearing text or publishing again", async t => {
  const fixture = mount(t, async () => catalog([documentFor(article)]));
  await fixture.settle();
  fixture.fill({ ...article, title: "An unsaved article still being written" });
  await fixture.preview();
  assert.match(text(fixture.render()), /Saved · waiting to go live/);
  assert.equal(fixture.timerCount(), 1);
  fixture.deliver(async () => catalog([documentFor(article)], "catalog-revision-a", { [article.slug]: { status: "live", checkedAt: "2026-11-20T22:31:00Z" } }));
  global.document.visibilityState = "hidden";
  const before = fixture.requests.length;
  await fixture.tick();
  assert.equal(fixture.requests.length, before);
  global.document.visibilityState = "visible";
  await fixture.tick();
  assert.ok(find(fixture.render(), element => element.props.className === "nbe-delivery nbe-delivery-live"));
  assert.equal(fixture.field("title").props.value, "An unsaved article still being written");
  assert.ok(find(fixture.render(), element => element.props.className === "nbe-preview"));
  assert.equal(fixture.timerCount(), 0);
  assert.equal(fixture.posts().length, 0);
});

test("a background check cannot advance the edit revision when another save changes history", async t => {
  const fixture = mount(t, async () => catalog([documentFor(article)]));
  await fixture.settle();
  fixture.fill();
  await fixture.preview();
  fixture.deliver(async (_url, options) => options.method === "POST" ? json({ error: "Conflict" }, 409) : catalog([documentFor({ ...article, title: "A newer saved version from another editor" })], "catalog-revision-b"));
  await fixture.tick();
  assert.match(text(fixture.render()), /saved history has changed/);
  assert.equal(fixture.field("title").props.value, article.title);
  assert.equal(fixture.timerCount(), 0);
  fixture.publishButton().props.onClick();
  await fixture.settle();
  assert.equal(JSON.parse(fixture.posts()[0].options.body).revision, "catalog-revision-a");
  assert.match(text(fixture.render()), /article list changed/);
});

test("failed delivery verification retains history and never labels a saved article Live", async t => {
  const fixture = mount(t, async () => catalog([documentFor(article)], "catalog-revision-a", { [article.slug]: { status: "unknown", checkedAt: "2026-11-20T22:30:00Z" } }));
  await fixture.settle();
  assert.match(text(fixture.render()), /Saved · live status unconfirmed/);
  assert.ok(find(fixture.render(), element => element.props["aria-label"] === `Open to edit: ${article.title}`));
  assert.equal(find(fixture.render(), element => element.props.className === "nbe-delivery nbe-delivery-live"), undefined);
});

test("editing a Live post never labels its new save Live while the catalog reload is pending", async t => {
  const previous = { ...documentFor(article), publicationId: "178688b0-6369-4bba-8c9f-2665ae072e0c" };
  const fixture = mount(t, async () => catalog([previous], "catalog-revision-a", { [article.slug]: { status: "live", checkedAt: "2026-11-20T22:30:00Z" } }));
  await fixture.settle();
  find(fixture.render(), element => element.props["aria-label"] === `Open to edit: ${article.title}`).props.onClick();
  fixture.change("body", `${article.body}\n\nThis is the new approved revision.`);
  await fixture.preview();
  let finishCatalog;
  fixture.deliver(async (_url, options) => options.method === "POST" ? queued({ ...article, body: fixture.field("body").props.value }) : new Promise(resolve => { finishCatalog = resolve; }));
  fixture.publishButton().props.onClick();
  await fixture.settle();
  assert.doesNotMatch(text(fixture.render()), /Live\. Your latest save is on the website/);
  assert.match(text(fixture.render()), /Saved\. Live status has not been confirmed/);
  assert.equal(find(fixture.render(), element => element.props.className === "nbe-delivery nbe-delivery-live"), undefined);
  const newer = { ...documentFor(article), publicationId: "907c3844-4618-45cb-8102-e788c00e6e24" };
  finishCatalog(catalog([newer], "catalog-revision-c", { [article.slug]: { status: "live", checkedAt: "2026-11-20T22:32:00Z" } }));
  await fixture.settle();
  assert.doesNotMatch(text(fixture.render()), /Live\. Your latest save is on the website/, "a different writer's live version cannot verify this save");
});

test("new articles require an image before preview, while image-free legacy edits can still save", async t => {
  const legacy = { ...article };
  delete legacy.featuredImage;
  const fixture = mount(t, async (_url, options) => options.method === "POST" ? queued(legacy) : catalog([documentFor(legacy)]));
  await fixture.settle();
  fixture.fill(legacy);
  assert.equal(fixture.imagePicker().props.required, true);
  await fixture.preview();
  assert.match(text(fixture.render()), /Choose a featured image for your new article/);
  assert.equal(find(fixture.render(), element => element.props.className === "nbe-preview"), undefined);
  assert.equal(fixture.publishButton().props.disabled, true);
  fixture.imageControl("image").props.onChange({ target: { value: image.assetId } });
  await fixture.preview();
  assert.deepEqual(fixture.imagePicker().props.value, featuredImage);
  assert.equal(fixture.publishButton().props.disabled, false);

  find(fixture.render(), element => element.props["aria-label"] === `Open to edit: ${legacy.title}`).props.onClick();
  assert.equal(fixture.imagePicker().props.required, false);
  assert.equal(fixture.imagePicker().props.value, undefined);
  await fixture.preview();
  assert.equal(fixture.publishButton().props.disabled, false);
  fixture.publishButton().props.onClick();
  await fixture.settle();
  const payload = JSON.parse(fixture.posts()[0].options.body);
  assert.equal(Object.hasOwn(payload.post, "featuredImage"), false);
  assert.equal(payload.revision, "catalog-revision-a");
  assert.match(text(fixture.render()), /Saved\. Waiting for deployment/);
});

test("opening a saved article preserves its image and resetting starts with no inherited selection", async t => {
  const fixture = mount(t, async () => catalog([documentFor(article)]));
  await fixture.settle();
  find(fixture.render(), element => element.props["aria-label"] === `Open to edit: ${article.title}`).props.onClick();
  assert.deepEqual(fixture.imagePicker().props.value, featuredImage);
  await fixture.preview();
  const previewArticle = find(fixture.render(), element => element.props.className === "nbe-preview-article");
  const firstChild = React.Children.toArray(previewArticle.props.children)[0];
  assert.equal(firstChild.props.className, "nbe-preview-image", "the picture precedes the article's topic and title");
  const picture = find(previewArticle, element => element.type === FeaturedImage);
  assert.deepEqual(picture.props.cover, content.nativeBlogImage(featuredImage));
  assert.equal(picture.props.cover.credit, image.credit);
  const renderedPicture = FeaturedImage(picture.props);
  assert.equal(find(renderedPicture, element => element.type === TestNextImage).props.src, image.src);
  assert.equal(find(renderedPicture, element => element.type === "a").props.href, image.sourceUrl);
  assert.equal(text(renderedPicture).split(image.credit).length - 1, 1, "the shared visual supplies the credit exactly once");

  find(fixture.render(), element => element.type === "button" && text(element) === "New article").props.onClick();
  assert.equal(fixture.imagePicker().props.value, undefined);
  assert.equal(fixture.imagePicker().props.required, true);
  assert.equal(fixture.field("title").props.value, "");
  assert.equal(fixture.field("slug").props.readOnly, false);
  assert.equal(fixture.publishButton().props.disabled, true);
});

test("image or alt edits invalidate the preview and save only the new exact image with the locked revision", async t => {
  const fixture = mount(t, async () => catalog([documentFor(article)]));
  await fixture.settle();
  find(fixture.render(), element => element.props["aria-label"] === `Open to edit: ${article.title}`).props.onClick();
  await fixture.preview();
  const nextImage = { ...featuredImage, alt: "Hands compare a blank paper form with notes beside a calculator." };
  fixture.imageControl("image-alt").props.onChange({ target: { value: nextImage.alt } });
  assert.equal(fixture.publishButton().props.disabled, true);
  assert.equal(find(fixture.render(), element => element.props.className === "nbe-preview"), undefined);
  await fixture.preview();
  const expected = content.parseNativeBlogInput({ ...article, featuredImage: nextImage });
  let finish;
  fixture.deliver(async (_url, options) => options.method === "POST" ? new Promise(resolve => { finish = resolve; }) : catalog([documentFor(expected)], "catalog-revision-b"));
  fixture.publishButton().props.onClick();
  assert.equal(fixture.imagePicker().props.disabled, true, "the image is locked during publication like other content");
  const payload = JSON.parse(fixture.posts()[0].options.body);
  assert.deepEqual(payload.post.featuredImage, nextImage);
  assert.equal(payload.revision, "catalog-revision-a");
  assert.equal(payload.previewFingerprint, createHash("sha256").update(JSON.stringify(expected)).digest("hex"));
  finish(queued(expected));
  await fixture.settle();
  assert.deepEqual(fixture.imagePicker().props.value, nextImage);
});

test("an image change cannot revive an asynchronous preview of the previous selection", async t => {
  const fixture = mount(t);
  await fixture.settle();
  fixture.fill();
  let finishDigest;
  Object.defineProperty(globalThis, "crypto", { configurable: true, value: {
    randomUUID: () => webcrypto.randomUUID(),
    subtle: { digest: () => new Promise(resolve => { finishDigest = resolve; }) },
  } });
  const preparing = fixture.preview();
  fixture.selectImage(undefined);
  finishDigest(new Uint8Array(32).buffer);
  await preparing;
  assert.equal(find(fixture.render(), element => element.props.className === "nbe-preview"), undefined);
  assert.equal(fixture.publishButton().props.disabled, true);
  assert.equal(fixture.imagePicker().props.value, undefined);
});

test("an existing featured image cannot be accidentally removed, while a replacement can be previewed", async t => {
  const fixture = mount(t, async () => catalog([documentFor(article)]));
  await fixture.settle();
  find(fixture.render(), element => element.props["aria-label"] === `Open to edit: ${article.title}`).props.onClick();
  assert.equal(fixture.imagePicker().props.required, true);
  await fixture.preview();
  fixture.imageControl("image").props.onChange({ target: { value: "" } });
  await fixture.preview();
  assert.match(text(fixture.render()), /Choose a picture to replace this article’s featured image/);
  assert.equal(find(fixture.render(), element => element.props.className === "nbe-preview"), undefined);
  assert.equal(fixture.publishButton().props.disabled, true);
  assert.equal(fixture.field("body").props.value, article.body);
  assert.equal(fixture.field("slug").props.readOnly, true);
  assert.equal(fixture.posts().length, 0);

  const replacement = content.nativeBlogImages.find(item => item.assetId !== featuredImage.assetId);
  fixture.imageControl("image").props.onChange({ target: { value: replacement.assetId } });
  await fixture.preview();
  assert.deepEqual(fixture.imagePicker().props.value, { assetId: replacement.assetId, alt: replacement.alt });
  assert.equal(fixture.publishButton().props.disabled, false);
});
