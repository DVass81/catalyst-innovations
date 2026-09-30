/* eslint-disable @typescript-eslint/no-require-imports -- Standalone TS test harness, without new runtime dependencies. */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
function load(file, mocks = {}) {
  const filename = path.join(__dirname, "..", file);
  const m = new Module(filename, module);
  m.filename = filename;
  m.paths = Module._nodeModulePaths(path.dirname(filename));
  const original = m.require.bind(m);
  m.require = (id) => (Object.hasOwn(mocks, id) ? mocks[id] : original(id));
  m._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
      },
    }).outputText,
    filename,
  );
  return m.exports;
}
const { createStoryPlayer, createPlaybackCoordinator, stepAt } = load(
  "lib/storyPlayback.ts",
);
const isolated = (auto = true) =>
  createStoryPlayer(15000, auto, createPlaybackCoordinator());
test("autoplay starts only when visible, advances 5 story beats and stops once", () => {
  const p = isolated();
  p.tick(5000);
  assert.equal(p.getSnapshot().elapsed, 0);
  p.setVisible(true);
  assert.equal(p.getSnapshot().playing, true);
  for (let n = 1; n <= 4; n++) {
    p.tick(3000);
    assert.equal(stepAt(p.getSnapshot().elapsed, 5, 15000), n);
  }
  p.tick(3000);
  assert.equal(p.getSnapshot().playing, false);
  p.setVisible(false);
  p.setVisible(true);
  assert.equal(p.getSnapshot().playing, false);
  p.replay();
  assert.equal(p.getSnapshot().elapsed, 0);
  assert.equal(p.getSnapshot().playing, true);
  p.dispose();
});
test("offscreen and hidden-document pauses preserve the playhead and resume intent", () => {
  const p = isolated();
  p.setVisible(true);
  p.tick(1500);
  p.setVisible(false);
  p.tick(5000);
  assert.equal(p.getSnapshot().elapsed, 1500);
  assert.equal(p.getSnapshot().playing, false);
  p.setVisible(true);
  assert.equal(p.getSnapshot().playing, true);
  p.setDocumentVisible(false);
  p.setVisible(false);
  p.setVisible(true);
  assert.equal(p.getSnapshot().playing, false);
  p.setDocumentVisible(true);
  assert.equal(p.getSnapshot().playing, true);
  p.dispose();
});
test("manual pause and step selection do not restart on visibility changes", () => {
  const p = isolated();
  p.setVisible(true);
  p.seek(8400);
  assert.equal(stepAt(p.getSnapshot().elapsed, 5, 15000), 2);
  assert.equal(p.getSnapshot().playing, false);
  p.setVisible(false);
  p.setVisible(true);
  assert.equal(p.getSnapshot().playing, false);
  p.play();
  p.pause();
  p.setDocumentVisible(false);
  p.setDocumentVisible(true);
  assert.equal(p.getSnapshot().playing, false);
  p.seek(-10);
  assert.equal(p.getSnapshot().elapsed, 0);
  p.seek(99999);
  assert.equal(p.getSnapshot().elapsed, 15000);
  p.dispose();
});
test("reduced motion remains static but steps are selectable; cards require user play", () => {
  const p = isolated();
  p.setReduced(true);
  p.setVisible(true);
  p.play();
  p.replay();
  assert.equal(p.getSnapshot().playing, false);
  p.seek(5400);
  assert.equal(stepAt(p.getSnapshot().elapsed, 5, 15000), 1);
  p.setReduced(false);
  assert.equal(p.getSnapshot().playing, false);
  p.dispose();
  const card = isolated(false);
  card.setVisible(true);
  assert.equal(card.getSnapshot().playing, false);
  card.play();
  assert.equal(card.getSnapshot().playing, true);
  card.dispose();
});
test("one coordinator allows only one playing illustration and releases safely", () => {
  const c = createPlaybackCoordinator();
  const a = createStoryPlayer(15000, true, c);
  const b = createStoryPlayer(15000, true, c);
  a.setVisible(true);
  b.setVisible(true);
  assert.equal(a.getSnapshot().playing, false);
  assert.equal(b.getSnapshot().playing, true);
  a.play();
  assert.equal(b.getSnapshot().playing, false);
  assert.equal(a.getSnapshot().playing, true);
  b.dispose();
  assert.equal(a.getSnapshot().playing, true);
  a.dispose();
});
const { industries } = load("data/industries.ts");
const { industryList } = load("data/redesign.ts", {
  "./industries": { industries },
});
const stories = load("data/motionStories.ts");
test("all industry and solution stories have complete ordered steps and stable records", () => {
  assert.equal(Object.keys(stories.solutionStories).length, 8);
  for (const i of industryList) {
    const s = stories.industryStory(i);
    assert.deepEqual(
      s.steps.map((x) => x.label),
      i.workflow,
    );
    assert.equal(s.duration, 15000);
    assert.ok(s.record);
    for (const step of s.steps) {
      assert.ok(
        step.title && step.caption && step.kind && step.note && step.status,
      );
      assert.ok(step.fields.length >= 3);
    }
  }
  const homepage = stories.connectedStory;
  assert.equal(homepage.steps[1].transition.status, "Approved by customer");
  assert.equal(homepage.steps[3].status, "Completion recorded");
  assert.ok(homepage.steps[3].fields.some((x) => x[1] === "Ready for review"));
  assert.equal(stories.signatureFilm.status, "pending");
  assert.equal(stories.signatureFilm.src, undefined);
});
test("illustrations render meaningful content with no running JavaScript", () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const player = load("lib/storyPlayback.ts");
  const { default: SoftwareStory } = load("components/SoftwareStory.tsx", {
    "@/lib/storyPlayback": player,
  });
  const html = renderToStaticMarkup(
    React.createElement(SoftwareStory, { story: stories.connectedStory }),
  );
  assert.match(html, /Capture the details once/);
  assert.match(html, /JOB 104/);
  assert.match(html, /Equipment service/);
  assert.match(html, /Illustrative workflow/);
  assert.doesNotMatch(html, /opacity:0[;\"]/);
});

test("film stays hidden until reviewed and never preloads before visitor selection", () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  for (const signatureFilm of [
    { status: "pending" },
    { status: "reviewed", src: "/reviewed-example.mp4" },
  ]) {
    const { default: StoryFilm } = load("components/StoryFilm.tsx", {
      "@/data/motionStories": { signatureFilm },
      "@/lib/storyPlayback": load("lib/storyPlayback.ts"),
    });
    const html = renderToStaticMarkup(React.createElement(StoryFilm));
    if (signatureFilm.status === "pending") assert.equal(html, "");
    else assert.match(html, /Watch the story/);
    assert.doesNotMatch(html, /<video|<source|reviewed-example\.mp4/);
  }
});
