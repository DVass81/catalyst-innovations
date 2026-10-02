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
test("nine-second visual stories change at three-second boundaries and stop once", () => {
  const p = createStoryPlayer(9000, true, createPlaybackCoordinator());
  p.setVisible(true);
  p.tick(2999);
  assert.equal(stepAt(p.getSnapshot().elapsed, 3, 9000), 0);
  p.tick(1);
  assert.equal(stepAt(p.getSnapshot().elapsed, 3, 9000), 1);
  p.tick(3000);
  assert.equal(stepAt(p.getSnapshot().elapsed, 3, 9000), 2);
  p.tick(3000);
  assert.equal(p.getSnapshot().playing, false);
  p.seek(3000);
  assert.equal(p.getSnapshot().playing, false);
  p.replay();
  assert.equal(p.getSnapshot().elapsed, 0);
  p.setReduced(true);
  p.seek(6000);
  assert.equal(stepAt(p.getSnapshot().elapsed, 3, 9000), 2);
  assert.equal(p.getSnapshot().playing, false);
  p.dispose();
});
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
  "./industryNeeds": load("data/industryNeeds.ts"),
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

test("all three visual concepts expose readable initial stories and contextual workflow without JavaScript", () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const definitions = load("data/visualStories.ts");
  const { default: VisualStory } = load("components/VisualStory.tsx", {
    "@/data/visualStories": definitions,
    "@/lib/storyPlayback": load("lib/storyPlayback.ts"),
    "next/image": { default: ({ src, alt }) => React.createElement("img", { src, alt }) },
  });
  for (const [kind, story] of Object.entries(definitions.visualStories)) {
    const html = renderToStaticMarkup(
      React.createElement(VisualStory, {
        kind,
        context: "HOAs",
        workflow: ["Request", "Assign", "Complete"],
      }),
    );
    assert.ok(html.includes(story.scenes[0].title));
    assert.match(html, /Illustrative service business/);
    assert.match(html, /A workflow for hoas/);
    assert.match(html, /Request/);
    assert.match(html, /aria-pressed="true"/);
    assert.match(html, /data-playing="false"/);
    assert.ok(fs.existsSync(path.join(__dirname, "../public", story.image)));
  }
});

test("video gallery preserves actual demo assets and only the public HOA can link out", () => {
  const { demos } = load("data/demos.ts");
  assert.equal(demos.length, 3);
  for (const demo of demos) {
    assert.equal(demo.capabilities.length, 3);
    assert.equal(demo.steps.length, 3);
    for (const step of demo.steps) {
      assert.ok(fs.existsSync(path.join(__dirname, "../public", step.image)));
      assert.ok(step.alt && step.text && step.width > 0 && step.height > 0);
    }
    if (demo.id !== "hoa") assert.equal(demo.publicUrl, undefined);
    if (demo.walkthrough) {
      assert.ok(demo.walkthrough.durationSeconds >= 60 && demo.walkthrough.durationSeconds <= 90);
      assert.ok(demo.walkthrough.transcript.trim().length > 100);
      for (const asset of [demo.walkthrough.video, demo.walkthrough.poster, demo.walkthrough.captions]) {
        assert.ok(asset.startsWith("/demos/"));
        assert.ok(fs.existsSync(path.join(__dirname, "../public", asset)), `Missing walkthrough asset: ${asset}`);
      }
    }
  }
  assert.equal(demos.find(d => d.id === "painting").availability, "archived-guided");
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const { default: DemoShowcase } = load("components/DemoShowcase.tsx", {
    "@/data/demos": { demos: demos.map(d => ({ ...d, walkthrough: undefined })) },
    "@/lib/site": { track: () => {} },
    "next/image": { default: ({ src, alt }) => React.createElement("img", { src, alt }) },
    "next/link": { default: ({ children, ...props }) => React.createElement("a", props, children) },
  });
  const html = renderToStaticMarkup(React.createElement(DemoShowcase, { detailed: true }));
  assert.equal((html.match(/Explore the public sample/g) || []).length, 1);
  assert.match(html, /demo=flooring&amp;industry=construction/);
  assert.match(html, /Planned system/);
  assert.match(html, /Oxendine Painting/);
  assert.match(html, /Knoxville Flooring/);
  assert.match(html, /HOA platform/);
  assert.doesNotMatch(html, /<video|<source|Watch walkthrough/);
  assert.equal((html.match(/Narrated walkthrough in production/g) || []).length, 3);
  assert.doesNotMatch(html, /commonplace-private|knox-flooring|oxendine-operations/);
});

test("ready walkthroughs offer viewing without preloading media and preserve inquiry context", () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const { demos } = load("data/demos.ts");
  const ready = demos.map(d => ({ ...d, walkthrough: { video: `/test/${d.id}.mp4`, poster: d.steps[0].image, captions: `/test/${d.id}.vtt`, transcript: "Test transcript.", durationSeconds: 75 } }));
  const { default: Gallery } = load("components/DemoShowcase.tsx", {
    "@/data/demos": { demos: ready }, "@/lib/site": { track: () => {} },
    "next/image": { default: ({ src, alt }) => React.createElement("img", { src, alt }) },
    "next/link": { default: ({ children, ...props }) => React.createElement("a", props, children) },
  });
  const html = renderToStaticMarkup(React.createElement(Gallery, { detailed: true, context: "industry=hvac&demo=hoa&problem=quoting" }));
  assert.equal((html.match(/aria-haspopup="dialog"/g) || []).length, 3);
  assert.match(html, /1:15/);
  assert.match(html, /industry=hvac&amp;demo=flooring&amp;problem=quoting/);
  assert.doesNotMatch(html, /<video|<source|\.mp4|\.vtt|in production/);
});

test("booking enables the reviewed Calendly event, rejects unreviewed overrides, and supports disabling", () => {
  const booking = require("../data/booking.json");
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const before = process.env.NEXT_PUBLIC_BOOKING_VERIFIED;
  try {
    for (const verified of [undefined, "false", "true"]) for (const url of ["", booking.publicUrl, "https://calendly.com/example/unreviewed"]) {
      if (verified === undefined) delete process.env.NEXT_PUBLIC_BOOKING_VERIFIED;
      else process.env.NEXT_PUBLIC_BOOKING_VERIFIED = verified;
      const { default: BookingLink } = load("components/BookingLink.tsx", {
        "@/lib/site": { site: { schedulingUrl: url }, track: () => {} },
        "@/data/booking.json": { default: booking },
      });
      const html = renderToStaticMarkup(React.createElement(BookingLink));
      assert.equal(html.includes("Book a conversation"), verified !== "false" && !!url && (url === booking.publicUrl || verified === "true"));
    }
  } finally {
    if (before === undefined) delete process.env.NEXT_PUBLIC_BOOKING_VERIFIED;
    else process.env.NEXT_PUBLIC_BOOKING_VERIFIED = before;
  }
});

const workarounds = load("lib/workaroundsStory.ts");
function workaroundsHarness({ deferred = false, coordinator = createPlaybackCoordinator(), options = {} } = {}) {
  const listeners = new Map();
  const attempts = [];
  const video = {
    paused: true, ended: false, currentTime: 0, src: "", preload: "none", plays: 0,
    getAttribute() { return this.src; },
    emit(event) { listeners.get(event)?.(); },
    play() {
      this.plays++;
      this.paused = false;
      this.ended = false;
      if (deferred) return new Promise((resolve, reject) => attempts.push({ resolve, reject }));
      this.emit("playing");
      return Promise.resolve();
    },
    pause() { this.paused = true; this.emit("pause"); },
    addEventListener(event, listener) { listeners.set(event, listener); },
    removeEventListener(event) { listeners.delete(event); },
  };
  const p = workarounds.createWorkaroundsPlayer(video, coordinator, () => {}, options);
  return { p, video, attempts, ready() { p.setNearby(true); p.setVisible(true); p.setReady(true); } };
}
const flushMedia = async () => { await Promise.resolve(); await Promise.resolve(); };

test("workarounds labels change at the approved film boundaries", () => {
  for (const [time, stage] of [[-1, 0], [0, 0], [4.99, 0], [5, 1], [7.99, 1], [8, 2], [10.99, 2], [11, 3], [13.99, 3], [14, 4], [20, 4], [200, 4], [NaN, 0]]) {
    assert.equal(workarounds.workaroundsStageAt(time), stage);
  }
  assert.deepEqual(workarounds.workaroundsStory.map(s => s.label), [
    "Manual work and disconnected tools",
    "Customer information—entered once",
    "Approved jobs, schedules, and materials—connected",
    "Completed work—ready for invoicing",
    "Your business. Working together.",
  ]);
});

test("workarounds media waits for page/poster readiness and proximity, then plays only when visible", async () => {
  const { p, video } = workaroundsHarness();
  p.setNearby(true);
  p.setVisible(true);
  assert.equal(video.src, "");
  p.setVisible(false);
  p.setNearby(false);
  p.setReady(true);
  assert.equal(video.src, "", "below-page film is not requested");
  p.setNearby(true);
  assert.equal(video.src, "/brand/catalyst-workarounds-v1.mp4");
  assert.equal(video.preload, "metadata");
  assert.equal(video.plays, 0);
  p.setVisible(true);
  await flushMedia();
  assert.equal(video.plays, 1);
  assert.equal(p.getSnapshot().showFilm, true);
  for (const [time, event, stage] of [[5.5, "timeupdate", 1], [9, "seeking", 2], [12, "seeked", 3]]) {
    video.currentTime = time;
    video.emit(event);
    assert.equal(p.getSnapshot().stage, stage);
  }
  video.paused = true; video.ended = true; video.emit("ended");
  assert.equal(p.getSnapshot().stage, 4);
  p.setVisible(false); p.setVisible(true);
  assert.equal(video.plays, 1, "finished film does not loop");
  p.replay();
  assert.equal(video.currentTime, 0);
  assert.equal(p.getSnapshot().stage, 0);
  assert.equal(video.plays, 2);
  p.dispose();
});

test("workarounds preserves resume intent across combined visibility pauses, but respects manual pause", async () => {
  const { p, video, ready } = workaroundsHarness();
  ready(); await flushMedia();
  video.currentTime = 6;
  p.setVisible(false);
  p.setDocumentVisible(false);
  p.setVisible(true);
  assert.equal(video.paused, true);
  p.setDocumentVisible(true);
  await flushMedia();
  assert.equal(video.plays, 2);
  assert.equal(video.currentTime, 6);
  p.toggle();
  p.setVisible(false); p.setDocumentVisible(false); p.setVisible(true); p.setDocumentVisible(true);
  assert.equal(video.plays, 2, "manual pause survives sensor changes");
  assert.equal(p.getSnapshot().playing, false);
  p.toggle();
  assert.equal(video.plays, 3);
  p.dispose();
});

test("workarounds reduced motion and media errors keep a static alternative without automatic retries", async () => {
  const { p, video, ready } = workaroundsHarness();
  p.setReduced(true); ready();
  assert.equal(video.src, "");
  p.toggle(); p.replay();
  assert.equal(video.plays, 0);
  assert.equal(p.getSnapshot().available, false);
  p.setReduced(false);
  assert.equal(video.plays, 0, "changing preference does not trigger a surprise animation");
  p.toggle(); await flushMedia();
  assert.equal(p.getSnapshot().showFilm, true);
  p.setReduced(true);
  assert.equal(video.paused, true);
  assert.equal(p.getSnapshot().showFilm, false);
  p.setReduced(false); p.toggle(); await flushMedia();
  video.emit("error");
  assert.equal(video.paused, true);
  assert.equal(p.getSnapshot().showFilm, false);
  assert.equal(p.getSnapshot().available, false);
  const plays = video.plays;
  p.toggle(); p.replay(); p.setVisible(false); p.setVisible(true);
  assert.equal(video.plays, plays);
  p.dispose();
});

test("Play and Replay queue intent while mobile controls bring the artwork back into view", async () => {
  const { p, video, ready } = workaroundsHarness();
  ready(); await flushMedia();
  p.toggle();
  video.currentTime = 12;
  p.setVisible(false);
  p.toggle();
  assert.equal(video.paused, true, "offscreen play waits for the artwork to become visible");
  p.setVisible(true); await flushMedia();
  assert.equal(video.plays, 2);
  assert.equal(video.currentTime, 12);
  p.toggle(); p.setVisible(false);
  p.replay();
  assert.equal(video.currentTime, 0);
  assert.equal(p.getSnapshot().stage, 0);
  assert.equal(video.paused, true);
  p.setVisible(true);
  assert.equal(video.plays, 3);
  p.dispose();
});

test("late play events cannot undo a pause, and stale rejections cannot stop a newer attempt", async () => {
  const { p, video, attempts, ready } = workaroundsHarness({ deferred: true });
  ready();
  assert.equal(p.getSnapshot().playing, true, "loading media can be paused immediately");
  p.toggle();
  video.paused = false;
  video.emit("playing");
  attempts[0].resolve(); await flushMedia();
  assert.equal(video.paused, true);
  assert.equal(p.getSnapshot().showFilm, false);
  p.toggle();
  p.setVisible(false); p.setVisible(true);
  assert.equal(video.plays, 3);
  attempts[1].reject(new Error("Previous play interrupted")); await flushMedia();
  assert.equal(p.getSnapshot().playing, true, "stale rejection does not overwrite a new play request");
  video.emit("playing"); attempts[2].resolve(); await flushMedia();
  assert.equal(p.getSnapshot().showFilm, true);
  p.dispose();
});

test("an autoplay rejection offers manual play and the hero shares playback ownership with other stories", async () => {
  const c = createPlaybackCoordinator();
  const { p, video, attempts, ready } = workaroundsHarness({ deferred: true, coordinator: c });
  ready();
  video.paused = true;
  attempts[0].reject(new Error("Autoplay blocked")); await flushMedia();
  assert.equal(p.getSnapshot().playing, false);
  assert.equal(p.getSnapshot().available, true);
  p.setVisible(false); p.setVisible(true);
  assert.equal(video.plays, 1);
  p.toggle(); video.emit("playing"); attempts[1].resolve(); await flushMedia();
  const other = createStoryPlayer(9000, true, c);
  other.setVisible(true);
  assert.equal(video.paused, true);
  p.setVisible(false); p.setVisible(true);
  assert.equal(video.plays, 2, "the hero does not reclaim playback after another story starts");
  p.toggle(); video.emit("playing"); attempts[2].resolve(); await flushMedia();
  assert.equal(other.getSnapshot().playing, false);
  p.dispose(); other.dispose();
});

test("the server-rendered workarounds hero includes its full readable story and no video request", () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const { default: Hero } = load("components/CatalystEngineHero.tsx", {
    "@/lib/storyPlayback": { storyCoordinator: createPlaybackCoordinator() },
    "@/lib/workaroundsStory": workarounds,
    "next/image": { default: ({ src, alt, width, height }) => React.createElement("img", { src, alt, width, height }) },
  });
  const html = renderToStaticMarkup(React.createElement(Hero));
  assert.match(html, /catalyst-workarounds-poster-v1.webp/);
  assert.match(html, /width="1920" height="1080"/);
  assert.match(html, /preload="none"/);
  assert.match(html, /Read the story/);
  assert.match(html, /Custom software connects your customer information/);
  for (const stage of workarounds.workaroundsStory) assert.ok(html.includes(stage.label));
  assert.doesNotMatch(html, /\.mp4|catalyst-engine-concept|catalyst-engine-v1/);
});

test("slow or data-saving connections load the selected mobile film only after explicit Play", async () => {
  const { p, video, ready } = workaroundsHarness({ options: {
    manualOnly: true, source: "/brand/catalyst-workarounds-mobile-v1.mp4",
  } });
  ready(); await flushMedia();
  assert.equal(p.getSnapshot().available, true);
  assert.ok(!video.getAttribute("src"));
  assert.equal(video.plays, 0);
  p.setVisible(false); p.setVisible(true); await flushMedia();
  assert.equal(video.plays, 0);
  p.toggle(); await flushMedia();
  assert.equal(video.src, "/brand/catalyst-workarounds-mobile-v1.mp4");
  assert.equal(video.plays, 1);
  p.setVisible(false); assert.equal(video.paused, true);
  p.setVisible(true); await flushMedia();
  assert.equal(video.plays, 2, "visibility respects a visitor's explicit playback request");
  p.dispose();
});

test("network hints are conservative without blocking browsers that do not expose them", () => {
  assert.equal(workarounds.prefersManualStory(), false);
  assert.equal(workarounds.prefersManualStory({ effectiveType: "4g", downlink: 10, rtt: 40 }), false);
  for (const connection of [{saveData: true}, {effectiveType: "3g"}, {effectiveType: "slow-2g"}, {downlink: 1}, {rtt: 600}]) {
    assert.equal(workarounds.prefersManualStory(connection), true);
  }
});
