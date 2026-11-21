/* eslint-disable @typescript-eslint/no-require-imports -- Exercise the server module with an offline Git provider. */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const { createHash } = require("node:crypto");
const ts = require("typescript");

const modules = new Map();
function load(name) {
  if (modules.has(name)) return modules.get(name);
  const filename = path.join(__dirname, "..", "lib", `${name}.ts`);
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  const originalRequire = loaded.require.bind(loaded);
  loaded.require = dependency => dependency.startsWith("./") ? load(dependency.slice(2)) : originalRequire(dependency);
  loaded._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, filename);
  modules.set(name, loaded.exports);
  return loaded.exports;
}
const { createWeeklyPublication, readPublisherState, currentPublisherReceipt, publisherEdition, inputFingerprint, PublisherStoreError } = load("blog-publisher-store");
const { publicationFingerprint } = load("native-blog-delivery");
const repository = "https://api.github.com/repos/My-Catalyst-Innovations/catalyst-innovations";
const catalogPath = "data/blog-published.json";
const journalPath = "data/blog-publication-journal.json";
const edition = "2026-11-27";
const friday = new Date("2026-11-27T13:00:00.000Z");
const article = { title: "A practical way to save time", slug: "save-time", description: "A reviewable way to reduce repeat administrative work.", category: "Operations", body: "A complete original article with safe plain text. Start by reviewing one recurring administrative task with the person who owns the process." };
const oldArticle = { ...article, slug: "earlier-edition", body: `${article.body} An earlier article offers a distinct example.`, publishedAt: "2026-11-20", updatedAt: "2026-11-20", publicationId: "7abf2afe-85b4-4000-8111-5d045837b115" };

function mockGit(posts = [], journal = []) {
  let counter = 0;
  let head;
  let updates = 0;
  let lostAcknowledgement = false;
  let mutateBeforeUpdate = null;
  const commits = new Map();
  const trees = new Map();
  const calls = [];
  const nextSha = () => createHash("sha1").update(String(++counter)).digest("hex");
  function writeHead(files) {
    const tree = nextSha();
    trees.set(tree, new Map(files));
    const commit = nextSha();
    commits.set(commit, { tree, parent: head });
    head = commit;
  }
  writeHead(new Map([[catalogPath, JSON.stringify(posts)], [journalPath, JSON.stringify(journal)], ["unrelated.txt", "Keep this file."]]));
  const files = () => trees.get(commits.get(head).tree);
  const read = file => JSON.parse(files().get(file));
  const mutate = callback => {
    const next = new Map(files());
    callback(next);
    writeHead(next);
  };
  const fetcher = async (url, options) => {
    assert.equal(options.headers.Authorization, "Bearer offline-test-credential");
    assert.equal(options.cache, "no-store");
    assert.equal(options.redirect, "error");
    assert.ok(options.signal instanceof AbortSignal);
    assert.ok(url.startsWith(repository));
    const relative = url.slice(repository.length);
    calls.push({ relative, options });
    if (relative === "/git/ref/heads/main" && options.method === "GET") {
      return Response.json({ ref: "refs/heads/main", object: { type: "commit", sha: head } });
    }
    if (relative.startsWith("/git/commits/") && options.method === "GET") {
      const sha = relative.slice("/git/commits/".length);
      assert.ok(commits.has(sha));
      return Response.json({ sha, tree: { sha: commits.get(sha).tree } });
    }
    if (relative.startsWith("/contents/") && options.method === "GET") {
      const [file, revision] = relative.slice("/contents/".length).split("?ref=");
      assert.ok([catalogPath, journalPath].includes(file));
      assert.ok(commits.has(revision), "Contents must be pinned to the captured commit, never main");
      const content = trees.get(commits.get(revision).tree).get(file);
      if (content === undefined) return Response.json({}, { status: 404 });
      const bytes = Buffer.from(content);
      return Response.json({ type: "file", path: file, encoding: "base64", sha: createHash("sha1").update(content).digest("hex"), size: bytes.length, content: bytes.toString("base64") });
    }
    if (relative === "/git/trees" && options.method === "POST") {
      const value = JSON.parse(options.body);
      assert.ok(trees.has(value.base_tree));
      assert.deepEqual(value.tree.map(row => row.path).sort(), [catalogPath, journalPath].sort());
      const files = new Map(trees.get(value.base_tree));
      for (const item of value.tree) {
        assert.equal(item.mode, "100644");
        assert.equal(item.type, "blob");
        files.set(item.path, item.content);
      }
      const sha = nextSha();
      trees.set(sha, files);
      return Response.json({ sha });
    }
    if (relative === "/git/commits" && options.method === "POST") {
      const value = JSON.parse(options.body);
      assert.equal(value.parents.length, 1);
      assert.ok(commits.has(value.parents[0]));
      assert.ok(trees.has(value.tree));
      const sha = nextSha();
      commits.set(sha, { tree: value.tree, parent: value.parents[0] });
      return Response.json({ sha });
    }
    if (relative === "/git/refs/heads/main" && options.method === "PATCH") {
      if (mutateBeforeUpdate) { const callback = mutateBeforeUpdate; mutateBeforeUpdate = null; mutate(callback); }
      const value = JSON.parse(options.body);
      assert.equal(value.force, false);
      const commit = commits.get(value.sha);
      assert.ok(commit);
      if (commit.parent !== head) return Response.json({ message: "Reference changed" }, { status: 422 });
      head = value.sha;
      updates++;
      if (lostAcknowledgement) { lostAcknowledgement = false; throw new Error("offline-test-credential response lost after update"); }
      return Response.json({ ref: "refs/heads/main", object: { type: "commit", sha: head } });
    }
    assert.fail(`Unexpected provider operation ${options.method} ${relative}`);
  };
  return {
    fetcher, read, mutate, calls,
    head: () => head, updates: () => updates, files,
    loseAcknowledgement: () => { lostAcknowledgement = true; },
    beforeUpdate: callback => { mutateBeforeUpdate = callback; },
  };
}

async function expectStatus(promise, status) {
  await assert.rejects(promise, error => error instanceof PublisherStoreError && error.status === status && !error.message.includes("offline-test-credential"));
}

test.beforeEach(() => { process.env.BLOG_GITHUB_TOKEN = "offline-test-credential"; });
test.afterEach(() => { delete process.env.BLOG_GITHUB_TOKEN; });

test("NY Friday window starts at 8 a.m., ends Saturday at 8 a.m., and begins after the existing edition", () => {
  assert.deepEqual(publisherEdition(friday).canPublish, true);
  assert.equal(publisherEdition(friday).edition, edition);
  assert.equal(publisherEdition(new Date("2026-11-27T12:59:59Z")).canPublish, false);
  assert.equal(publisherEdition(new Date("2026-11-28T12:59:59Z")).canPublish, true);
  assert.equal(publisherEdition(new Date("2026-11-28T13:00:00Z")).canPublish, false);
  assert.equal(publisherEdition(new Date("2026-11-20T13:00:00Z")).canPublish, false);
  assert.equal(publisherEdition(new Date("2026-11-20T13:00:00Z")).edition, edition);
  assert.equal(publisherEdition(new Date("2026-12-03T14:00:00Z")).edition, edition);
  assert.equal(publisherEdition(new Date("2027-03-19T12:00:00Z")).canPublish, true);
  assert.equal(publisherEdition(new Date("2027-03-19T11:59:59Z")).canPublish, false);
});

test("snapshots are pinned; publication atomically preserves existing articles and unrelated files", async () => {
  const git = mockGit([oldArticle]);
  const state = await readPublisherState(git.fetcher);
  assert.deepEqual(state.posts, [oldArticle]);
  assert.deepEqual(state.journal, []);
  assert.equal(state.revision, git.head());
  const result = await createWeeklyPublication(article, state.revision, edition, git.fetcher, friday);
  assert.equal(result.idempotentReplay, false);
  assert.equal(git.updates(), 1);
  assert.equal(git.files().get("unrelated.txt"), "Keep this file.");
  assert.deepEqual(git.read(catalogPath)[1], oldArticle);
  const saved = git.read(catalogPath)[0];
  assert.equal(saved.publishedAt, edition);
  assert.equal(result.receipt.documentFingerprint, publicationFingerprint(saved));
  assert.equal(result.receipt.inputFingerprint, inputFingerprint(article));
  assert.deepEqual(git.read(journalPath), [result.receipt]);
  assert.equal(result.receipt.savedAt, friday.toISOString());
  assert.equal(currentPublisherReceipt(await readPublisherState(git.fetcher), edition).publicationId, saved.publicationId);
});

test("simultaneous identical publications leave one article and one journal entry on main", async () => {
  const git = mockGit();
  const revision = git.head();
  const results = await Promise.all([
    createWeeklyPublication(article, revision, edition, git.fetcher, friday),
    createWeeklyPublication(article, revision, edition, git.fetcher, friday),
  ]);
  assert.equal(git.updates(), 1);
  assert.equal(git.read(catalogPath).length, 1);
  assert.equal(git.read(journalPath).length, 1);
  assert.equal(results.filter(result => result.idempotentReplay).length, 1);
  assert.deepEqual(results[0].receipt, results[1].receipt);
});

test("journal recovers old requests after a human edit or withdrawal and outside the publishing window", async () => {
  const git = mockGit();
  const revision = git.head();
  const first = await createWeeklyPublication(article, revision, edition, git.fetcher, friday);
  git.mutate(files => {
    const [document] = JSON.parse(files.get(catalogPath));
    files.set(catalogPath, JSON.stringify([{ ...document, body: `${document.body} Josh's later change.`, publicationId: "129c654a-f99a-4000-8333-1d90c2749fba" }]));
  });
  const afterEdit = await createWeeklyPublication(article, revision, edition, git.fetcher, new Date("2026-11-29T15:00:00Z"));
  assert.deepEqual(afterEdit, { receipt: first.receipt, idempotentReplay: true });
  assert.ok(git.read(catalogPath)[0].body.endsWith("Josh's later change."));
  git.mutate(files => files.set(catalogPath, "[]"));
  const afterWithdrawal = await createWeeklyPublication(article, revision, edition, git.fetcher, new Date("2026-12-04T13:00:00Z"));
  assert.deepEqual(afterWithdrawal.receipt, first.receipt);
  assert.equal(git.updates(), 1);
  await expectStatus(createWeeklyPublication({ ...article, title: "A different Friday article" }, revision, edition, git.fetcher, friday), 409);
});

test("ambiguous successful ref update recovers from the atomic journal", async () => {
  const git = mockGit();
  const revision = git.head();
  git.loseAcknowledgement();
  const result = await createWeeklyPublication(article, revision, edition, git.fetcher, friday);
  assert.equal(result.idempotentReplay, true);
  assert.equal(git.updates(), 1);
  assert.deepEqual(git.read(journalPath), [result.receipt]);
});

test("manual saves for this edition and concurrent unrelated changes conflict without replacing anything", async () => {
  const manual = mockGit([{ ...oldArticle, publishedAt: edition, updatedAt: edition }]);
  await expectStatus(createWeeklyPublication(article, manual.head(), edition, manual.fetcher, friday), 409);
  assert.equal(manual.updates(), 0);
  const git = mockGit();
  git.beforeUpdate(files => files.set("unrelated.txt", "A newer human change."));
  await expectStatus(createWeeklyPublication(article, git.head(), edition, git.fetcher, friday), 409);
  assert.equal(git.files().get("unrelated.txt"), "A newer human change.");
  assert.deepEqual(git.read(catalogPath), []);
  assert.deepEqual(git.read(journalPath), []);
});

test("stale preview, reserved week, invalid inputs and outside-window new publication never write", async () => {
  const git = mockGit();
  const revision = git.head();
  await expectStatus(createWeeklyPublication(article, "a".repeat(40), edition, git.fetcher, friday), 409);
  await expectStatus(createWeeklyPublication(article, revision, edition, git.fetcher, new Date("2026-11-28T13:00:00Z")), 403);
  await expectStatus(createWeeklyPublication(article, revision, "2026-11-20", git.fetcher, friday), 422);
  await expectStatus(createWeeklyPublication(article, revision, "2026-11-28", git.fetcher, friday), 422);
  await expectStatus(createWeeklyPublication({ ...article, title: "" }, revision, edition, git.fetcher, friday), 422);
  await expectStatus(createWeeklyPublication(article, "not-a-revision", edition, git.fetcher, friday), 422);
  assert.equal(git.calls.some(call => call.options.method !== "GET"), false);
});

test("old catalog or retired journal content cannot be republished under a different slug", async () => {
  const git = mockGit([oldArticle]);
  await expectStatus(createWeeklyPublication({ ...article, body: oldArticle.body.replace(/ /g, "\n") }, git.head(), edition, git.fetcher, friday), 409);
  await expectStatus(createWeeklyPublication({ ...article, slug: oldArticle.slug }, git.head(), edition, git.fetcher, friday), 409);
  const retired = mockGit();
  await createWeeklyPublication(article, retired.head(), edition, retired.fetcher, friday);
  retired.mutate(files => files.set(catalogPath, "[]"));
  await expectStatus(createWeeklyPublication({ ...article, slug: "new-address" }, retired.head(), "2026-12-04", retired.fetcher, new Date("2026-12-04T13:00:00Z")), 409);
  assert.equal(retired.updates(), 1);
});

test("missing credentials, missing journal and corrupt receipts fail closed", async () => {
  delete process.env.BLOG_GITHUB_TOKEN;
  await expectStatus(readPublisherState(async () => assert.fail("No credential must mean no request")), 503);
  process.env.BLOG_GITHUB_TOKEN = "offline-test-credential";
  const git = mockGit();
  git.mutate(files => files.delete(journalPath));
  await expectStatus(readPublisherState(git.fetcher), 503);
  const corrupt = mockGit([], [{ edition, slug: "something", savedAt: "2026-11-27T13:00:00.000Z" }]);
  await expectStatus(readPublisherState(corrupt.fetcher), 503);
});
