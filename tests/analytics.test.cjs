/* eslint-disable @typescript-eslint/no-require-imports -- Same dependency-free TS harness as the existing tests. */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const { spawnSync } = require("node:child_process");
const filename = path.join(__dirname, "../lib/analytics.ts");
const compiled = new Module(filename, module);
compiled.filename = filename;
compiled._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, filename);
const analytics = compiled.exports;

test("analytics rejects unknown events, arbitrary field values and personal/calculator data", () => {
  assert.equal(analytics.sanitizeAnalyticsEvent("email@example.test"), null);
  assert.equal(analytics.sanitizeAnalyticsEvent("booking_complete"), null);
  assert.equal(analytics.sanitizeAnalyticsEvent("page_view"), null);
  const dirty = {
    tool: "manual-work", email: "person@example.test", name: "Private Name",
    value: 154321, answer: "Confidential business problem", page: "/contact?email=private",
    referrer: "https://private.test/account", source: "person@example.test",
    action: "https://private.test", percent: 123456, step: 123456,
  };
  assert.deepEqual(analytics.sanitizeAnalyticsEvent("roi_calculator_used", dirty), {
    name: "roi_calculator_used", props: { tool: "manual-work" },
  });
  assert.deepEqual(analytics.sanitizeAnalyticsEvent("form_complete", dirty).props, {});
  assert.deepEqual(analytics.sanitizeAnalyticsEvent("demo_interaction", {
    demo: "hoa", action: "play_walkthrough", industry: "construction", name: "Private",
  }).props, { demo: "hoa", action: "play_walkthrough", industry: "construction" });
  assert.deepEqual(analytics.sanitizeAnalyticsEvent("email_click", {
    context: "contact_page_daniel-vass", email: "person@example.test",
  }).props, { context: "contact_page_daniel-vass" });
  for (const name of analytics.analyticsEvents) {
    const serialized = JSON.stringify(analytics.sanitizeAnalyticsEvent(name, dirty));
    assert.doesNotMatch(serialized, /example\.test|Private|Confidential|154321|123456|private/);
  }
});

test("analytics only permits reviewed public routes and removes queries, fragments and referrers", () => {
  assert.equal(analytics.analyticsPath("/services?email=private#answer"), "/services");
  assert.equal(analytics.analyticsPath("/consultation?email=private#answer"), "/consultation");
  assert.equal(analytics.analyticsPath("/discovery?email=private#answer"), "/discovery");
  assert.equal(analytics.analyticsPath("/tools/manual-work#154321"), "/tools/manual-work");
  for (const id of ["hoa", "flooring", "painting"]) {
    assert.equal(analytics.analyticsPath(`/portfolio/${id}?email=private#answer`), `/portfolio/${id}`);
  }
  assert.equal(analytics.analyticsPath("/portfolio/private-customer"), null);
  assert.equal(analytics.analyticsPath("/pricing"), null);
  for (const input of ["https://private.test/about", "//private.test", "/users/person@example.test", "/services/private", "/insights/private", "/portal", "/founders", "/api/health", "/about/private", null]) {
    assert.equal(analytics.analyticsPath(input), null);
  }
  assert.deepEqual(analytics.analyticsPageFields("https://site.example/?email=private", "/contact?email=private#secret"), {
    page_location: "https://site.example/contact", page_title: "/contact", page_referrer: "",
  });
});

test("ad-result URLs allow only valid Google click and aggregate identifiers, never arbitrary query values", () => {
  const origin = "https://site.example/?email=private";
  assert.deepEqual(analytics.adMeasurementPageFields(origin, "/consultation", "?gclid=EAIaIQobChMI12345678&gbraid=0AAAAAA12345678&wbraid=CjkKC12345678&gad_source=1&gad_campaignid=12345678901&utm_term=private%40example.test&email=private"), {
    page_location: "https://site.example/consultation?gclid=EAIaIQobChMI12345678&gbraid=0AAAAAA12345678&wbraid=CjkKC12345678&gad_source=1&gad_campaignid=12345678901",
    page_title: "/consultation", page_referrer: "",
  });
  for (const search of ["?email=private", "?gclid=short", `?gclid=${"A".repeat(257)}`, "?gclid=private%40example.test", "?gclid=EAIaIQobChMI12345678&gclid=EAIaIQobChMI87654321", "?gbraid=bad%20space", "?wbraid=too", "?gad_source=1%40example.test", "?gad_campaignid=12abc", `?gad_campaignid=${"1".repeat(21)}`, "?gad=1"]) {
    assert.deepEqual(analytics.adMeasurementPageFields(origin, "/consultation", search), analytics.analyticsPageFields(origin, "/consultation"));
  }
  assert.equal(analytics.adMeasurementPageFields(origin, "/consultation", "?gclid=EAIaIQobChMI12345678&gad_source=1&gad_source=2").page_location,
    "https://site.example/consultation?gclid=EAIaIQobChMI12345678");
  assert.deepEqual(analytics.adMeasurementPageFields(origin, "/private/path", "?gclid=EAIaIQobChMI12345678"), analytics.analyticsPageFields(origin, "/private/path"));
});

test("acquisition labels only recognized search hosts and never exposes a referrer or search terms", () => {
  assert.equal(analytics.analyticsEntrySource("https://www.google.com/search?q=private@example.test"), "google");
  assert.equal(analytics.analyticsEntrySource("https://www.bing.com/search?q=private#secret"), "bing");
  assert.equal(analytics.analyticsEntrySource("https://duckduckgo.com/?q=private"), "duckduckgo");
  for (const referrer of ["https://google.com.private.test/search", "https://private.test/account", "javascript:private", "", null]) {
    assert.equal(analytics.analyticsEntrySource(referrer), "direct_or_other");
  }
});

function sessionFixture() {
  const calls = { starts: [], pages: [], sends: [], stops: 0 };
  return {
    calls,
    session: analytics.createAnalyticsSession({
      start: (route) => calls.starts.push(route), page: (route) => calls.pages.push(route),
      send: (event) => calls.sends.push(event), stop: () => calls.stops++,
    }),
  };
}

test("consent transitions drop pre-consent interactions and emit one view per actual route visit", () => {
  const { calls, session } = sessionFixture();
  session.navigate("/");
  session.track("form_complete");
  session.navigate("/about?person=private");
  session.consent("denied");
  session.track("booking_click");
  assert.equal(calls.starts.length, 0);
  assert.equal(calls.sends.length, 0);
  session.consent("granted");
  session.consent("granted");
  session.navigate("/about");
  session.navigate("/about#private");
  assert.deepEqual(calls.sends, [{ name: "page_view", path: "/about", props: {} }]);
  session.navigate("/tools/manual-work");
  session.track("roi_calculator_used", { tool: "manual-work", input: 555 });
  session.navigate("/about");
  assert.equal(calls.sends.filter((e) => e.name === "page_view").length, 3);
  session.consent("denied");
  session.track("form_complete");
  session.navigate("/contact");
  assert.equal(calls.stops, 1);
  assert.equal(calls.sends.length, 4);
  session.consent("granted");
  assert.deepEqual(calls.sends.at(-1), { name: "page_view", path: "/contact", props: {} });
  assert.equal(calls.starts.length, 2);
});

test("ad measurement is distinct from old analytics grants and a mode switch stops before any more events", () => {
  const { calls, session } = sessionFixture();
  assert.equal(analytics.parseAnalyticsConsent("ad_measurement"), "ad_measurement");
  session.navigate("/consultation");
  session.consent("granted");
  assert.deepEqual(calls.starts, ["/consultation"]);
  session.consent("ad_measurement");
  assert.equal(calls.stops, 1);
  session.track("form_complete", { source: "inquiry" });
  session.navigate("/about");
  assert.equal(calls.sends.length, 1);
  assert.equal(calls.starts.length, 1);
});

test("unknown routes neither leak paths nor inherit the previous page context", () => {
  const { calls, session } = sessionFixture();
  session.navigate("/about");
  session.consent("granted");
  session.navigate("/secret/person@example.test");
  session.track("email_click", { context: "footer" });
  assert.equal(calls.sends.length, 1);
  assert.equal(calls.pages.at(-1), null);
  session.navigate("/about");
  assert.equal(calls.sends.length, 2);
});

test("services visits remain consent-controlled and exclude email-link parameters", () => {
  const { calls, session } = sessionFixture();
  session.navigate("/services?recipient=person@example.test#software");
  session.consent("denied");
  assert.equal(calls.sends.length, 0);
  session.consent("granted");
  session.navigate("/services?campaign=private#examples");
  assert.deepEqual(calls.sends, [{ name: "page_view", path: "/services", props: {} }]);
  session.consent("denied");
  session.navigate("/services");
  assert.equal(calls.stops, 1);
  assert.equal(calls.sends.length, 1);
});

test("GA cannot activate until its manual-measurement configuration is confirmed", () => {
  const keys = ["NEXT_PUBLIC_GA_ID", "NEXT_PUBLIC_GA_MANUAL_TRACKING_VERIFIED", "NEXT_PUBLIC_PLAUSIBLE_DOMAIN"];
  const saved = keys.map((key) => process.env[key]);
  try {
    process.env.NEXT_PUBLIC_GA_ID = "G-TEST123";
    delete process.env.NEXT_PUBLIC_GA_MANUAL_TRACKING_VERIFIED;
    delete process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    assert.deepEqual(analytics.configuredAnalytics(), { gaId: "", plausibleDomain: "" });
    process.env.NEXT_PUBLIC_GA_MANUAL_TRACKING_VERIFIED = "true";
    assert.equal(analytics.configuredAnalytics().gaId, "G-TEST123");
    process.env.NEXT_PUBLIC_GA_ID = "G-INVALID?email=private";
    process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN = "example.test/private";
    assert.deepEqual(analytics.configuredAnalytics(), { gaId: "", plausibleDomain: "" });
  } finally {
    keys.forEach((key, i) => { if (saved[i] === undefined) delete process.env[key]; else process.env[key] = saved[i]; });
  }
});

test("launch readiness rejects an unreviewed GA stream and invalid Plausible domain", () => {
  const baseEnv = {
    ...process.env,
    CONSULTATION_WEBHOOK_URL: "https://fixture.example/inquiries",
    RESEND_API_KEY: "", NEXT_PUBLIC_SCHEDULING_URL: "", NEXT_PUBLIC_BOOKING_VERIFIED: "true",
    NEXT_PUBLIC_GA_ID: "G-TEST123", NEXT_PUBLIC_PLAUSIBLE_DOMAIN: "",
  };
  for (const [settings, expected] of [
    [{ NEXT_PUBLIC_GA_MANUAL_TRACKING_VERIFIED: "false" }, 1],
    [{ NEXT_PUBLIC_GA_MANUAL_TRACKING_VERIFIED: "true" }, 0],
    [{ NEXT_PUBLIC_GA_MANUAL_TRACKING_VERIFIED: "false", NEXT_PUBLIC_PLAUSIBLE_DOMAIN: "https://fixture.example/private" }, 1],
    [{ NEXT_PUBLIC_GA_ID: "", NEXT_PUBLIC_PLAUSIBLE_DOMAIN: "fixture.example" }, 0],
  ]) {
    const result = spawnSync(process.execPath, [path.join(__dirname, "../scripts/check-launch-config.mjs")], {
      env: { ...baseEnv, ...settings }, encoding: "utf8",
    });
    assert.equal(result.status, expected, "Launch check must match the app's provider activation gate");
    assert.doesNotMatch(result.stdout, /G-TEST123|fixture\.example/);
  }
});

function browserFixture(t) {
  const saved = Object.fromEntries(["window", "document", "location", "fetch", "CustomEvent"].map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const stored = new Map();
  const cookies = new Map();
  const scripts = [];
  const requests = [];
  let reloads = 0;
  const location = { origin: "https://site.example", protocol: "https:", hostname: "site.example", pathname: "/", search: "", reload: () => reloads++ };
  const window = new EventTarget();
  Object.assign(window, { location, localStorage: {
    getItem: (key) => stored.get(key) ?? null,
    setItem: (key, value) => stored.set(key, value),
  } });
  const document = {
    referrer: "https://www.google.com/search?q=private@example.test",
    createElement: () => { const script = { removed: false, remove() { this.removed = true; } }; return script; },
    head: { appendChild: (script) => scripts.push(script) },
    get cookie() { return [...cookies].map(([key, value]) => `${key}=${value}`).join("; "); },
    set cookie(value) {
      const [pair] = value.split(";");
      const [key, setting] = pair.split("=");
      if (value.includes("Max-Age=0")) cookies.delete(key); else cookies.set(key, setting);
    },
  };
  class CustomEvent extends Event { constructor(type, init) { super(type); this.detail = init.detail; } }
  Object.assign(globalThis, { window, document, location, CustomEvent, fetch: (url, options) => {
    requests.push({ url, options });
    return new Promise((resolve, reject) => options.signal.addEventListener("abort", () => reject(new Error("aborted"))));
  } });
  t.after(() => { for (const [key, descriptor] of Object.entries(saved)) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; } });
  return { window, document, stored, cookies, scripts, requests, reloads: () => reloads };
}

test("browser transport stays silent until consent and sends explicitly sanitized provider payloads", (t) => {
  const fixture = browserFixture(t);
  fixture.window.location.pathname = "/consultation";
  fixture.window.location.search = "?gclid=EAIaIQobChMI12345678&email=private";
  const transport = analytics.createBrowserAnalyticsTransport({ gaId: "G-TEST123", plausibleDomain: "site.example" });
  const session = analytics.createAnalyticsSession(transport);
  session.navigate("/consultation?email=private#secret");
  assert.equal(fixture.scripts.length, 0);
  assert.equal(fixture.requests.length, 0);
  session.consent("granted");
  assert.equal(fixture.scripts.length, 1);
  assert.equal(fixture.scripts[0].referrerPolicy, "no-referrer");
  assert.equal(Object.prototype.toString.call(fixture.window.dataLayer[0]), "[object Arguments]");
  const config = fixture.window.dataLayer.find((entry) => entry[0] === "config")[2];
  assert.equal(config.send_page_view, false);
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.allow_ad_personalization_signals, false);
  assert.equal(config.page_referrer, "");
  assert.equal(config.page_location, "https://site.example/consultation");
  const consent = fixture.window.dataLayer.find((entry) => entry[0] === "consent")[2];
  assert.equal(consent.analytics_storage, "granted");
  assert.equal(consent.ad_storage, "denied");
  assert.equal(consent.ad_user_data, "denied");
  assert.equal(consent.ad_personalization, "denied");
  session.track("inquiry_draft_created", { source: "inquiry", email: "private@example.test" });
  assert.deepEqual(fixture.window.dataLayer.filter((entry) => entry[0] === "event").map((e) => e[1]), ["page_view", "inquiry_draft_created"]);
  for (const request of fixture.requests) {
    assert.equal(request.options.credentials, "omit");
    assert.equal(request.options.referrerPolicy, "no-referrer");
    assert.doesNotMatch(request.options.body, /private|secret|referrer|email/);
    assert.equal(JSON.parse(request.options.body).url, "https://site.example/consultation");
    assert.equal(JSON.parse(request.options.body).props.entry_source, "google");
  }
  assert.equal(analytics.saveAnalyticsConsent("denied"), true);
  session.consent("denied");
});

test("ad-result opt-in grants only ad measurement and sends a validated click ID to Google, not Plausible", (t) => {
  const fixture = browserFixture(t);
  fixture.window.location.pathname = "/consultation";
  fixture.window.location.search = "?gclid=EAIaIQobChMI12345678&gad_source=1&utm_term=private%40example.test&email=private";
  assert.equal(analytics.saveAnalyticsConsent("ad_measurement"), true);
  assert.equal(analytics.getAnalyticsConsent(), "ad_measurement");
  const session = analytics.createAnalyticsSession(analytics.createBrowserAnalyticsTransport({ gaId: "G-TEST123", plausibleDomain: "site.example" }));
  session.navigate("/consultation");
  session.consent(analytics.getAnalyticsConsent());
  const consent = fixture.window.dataLayer.find((entry) => entry[0] === "consent")[2];
  assert.equal(consent.ad_storage, "granted");
  assert.equal(consent.ad_user_data, "granted");
  assert.equal(consent.ad_personalization, "denied");
  const config = fixture.window.dataLayer.find((entry) => entry[0] === "config")[2];
  assert.equal(config.page_location, "https://site.example/consultation?gclid=EAIaIQobChMI12345678&gad_source=1");
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.allow_ad_personalization_signals, false);
  assert.equal(config.ads_data_redaction, false);
  for (const field of ["campaign_id", "campaign_source", "campaign_medium", "campaign_name", "campaign_term", "campaign_content"]) {
    assert.equal(config[field], "", "arbitrary campaign queries must not override safe page fields");
  }
  session.track("form_complete", { source: "inquiry", email: "private@example.test" });
  const googleEvents = fixture.window.dataLayer.filter((entry) => entry[0] === "event");
  assert.ok(googleEvents.every((entry) => !JSON.stringify(entry).includes("private")));
  assert.ok(googleEvents.every((entry) => entry[2].page_location.endsWith("?gclid=EAIaIQobChMI12345678&gad_source=1")));
  assert.equal(JSON.parse(fixture.requests[0].options.body).url, "https://site.example/consultation");
  fixture.cookies.set("_gcl_aw", "click-cookie");
  fixture.cookies.set("_gcl_au", "click-cookie");
  const lateTagCallback = fixture.window.gtag;
  analytics.saveAnalyticsConsent("granted");
  // This isolated test has no event listener; switch the session as the app does.
  session.consent(analytics.getAnalyticsConsent());
  assert.equal(analytics.getAnalyticsConsent(), "granted");
  assert.equal(fixture.cookies.has("_gcl_aw"), false);
  assert.equal(fixture.cookies.has("_gcl_au"), false);
  assert.equal(fixture.reloads(), 1);
  assert.equal(fixture.window.dataLayer.length, 0);
  assert.equal(fixture.scripts[0].removed, true);
  lateTagCallback("event", "form_complete");
  session.track("form_complete");
  assert.equal(fixture.window.dataLayer.length, 0);
  assert.equal(fixture.requests.length, 2);
});

test("ad consent fails closed if only one preference store contains the opt-in", (t) => {
  const fixture = browserFixture(t);
  fixture.stored.set(analytics.consentStorageKey, "granted");
  fixture.cookies.set("catalyst_analytics_consent", "ad_measurement");
  assert.equal(analytics.getAnalyticsConsent(), "granted");
  fixture.stored.set(analytics.consentStorageKey, "ad_measurement");
  fixture.cookies.delete("catalyst_analytics_consent");
  assert.equal(analytics.getAnalyticsConsent(), "pending");
});

test("basic and necessary choices clear old ad cookies even without a loaded tag", (t) => {
  const fixture = browserFixture(t);
  fixture.cookies.set("_gcl_aw", "old-ad-click");
  fixture.cookies.set("_ga", "basic-analytics");
  const session = analytics.createAnalyticsSession(analytics.createBrowserAnalyticsTransport({ gaId: "G-TEST123", plausibleDomain: "" }));
  session.navigate("/consultation");
  session.consent("granted");
  assert.equal(fixture.cookies.has("_gcl_aw"), false);
  assert.equal(fixture.cookies.has("_ga"), true);
  fixture.cookies.set("_gcl_au", "old-ad-cookie");
  analytics.saveAnalyticsConsent("denied");
  assert.equal(fixture.cookies.has("_gcl_au"), false);
  assert.equal(fixture.cookies.has("_ga"), false);
});

test("withdrawal stops loaded and late-loading tags, clears queued events, aborts requests and persists before reload", (t) => {
  const fixture = browserFixture(t);
  analytics.saveAnalyticsConsent("granted");
  const transport = analytics.createBrowserAnalyticsTransport({ gaId: "G-TEST123", plausibleDomain: "site.example" });
  const session = analytics.createAnalyticsSession(transport);
  fixture.window.addEventListener(analytics.consentChangeEvent, (e) => session.consent(e.detail));
  session.navigate("/");
  session.consent("granted");
  const lateTagCallback = fixture.window.gtag;
  fixture.cookies.set("_ga", "identifier");
  fixture.cookies.set("_ga_TEST123", "identifier");
  analytics.saveAnalyticsConsent("denied");
  assert.equal(analytics.getAnalyticsConsent(), "denied");
  assert.equal(fixture.reloads(), 1);
  assert.equal(fixture.window["ga-disable-G-TEST123"], true);
  assert.equal(fixture.window.dataLayer.length, 0);
  assert.equal(fixture.scripts[0].removed, true);
  assert.ok(fixture.requests.every(({ options }) => options.signal.aborted));
  assert.equal(fixture.cookies.has("_ga"), false);
  assert.equal(fixture.cookies.has("_ga_TEST123"), false);
  lateTagCallback("event", "page_view", { page_location: "https://private.test" });
  fixture.window.gtag("event", "form_complete");
  session.track("form_complete");
  session.navigate("/about");
  assert.equal(fixture.window.dataLayer.length, 0);
  assert.equal(fixture.requests.length, 1);
});

test("blocked storage cannot grant consent and a cookie denial overrides an old local acceptance", (t) => {
  const fixture = browserFixture(t);
  fixture.stored.set(analytics.consentStorageKey, "granted");
  fixture.window.localStorage.setItem = () => { throw new Error("blocked"); };
  assert.equal(analytics.saveAnalyticsConsent("denied"), true);
  assert.equal(analytics.getAnalyticsConsent(), "denied");
  fixture.stored.clear();
  fixture.cookies.clear();
  Object.defineProperty(fixture.document, "cookie", { get: () => { throw new Error("blocked"); }, set: () => { throw new Error("blocked"); } });
  assert.equal(analytics.saveAnalyticsConsent("granted"), false);
  assert.equal(analytics.getAnalyticsConsent(), "denied");
});

test("failed ad-to-basic downgrade stops this page without reloading stale ad consent", (t) => {
  const fixture = browserFixture(t);
  analytics.saveAnalyticsConsent("ad_measurement");
  const session = analytics.createAnalyticsSession(analytics.createBrowserAnalyticsTransport({ gaId: "G-TEST123", plausibleDomain: "site.example" }));
  fixture.window.addEventListener(analytics.consentChangeEvent, (event) => session.consent(event.detail));
  session.navigate("/consultation");
  session.consent(analytics.getAnalyticsConsent());
  const lateTagCallback = fixture.window.gtag;
  const tagUpdates = [];
  fixture.window.gtag = (...args) => { tagUpdates.push(args); lateTagCallback(...args); };
  const cookieDescriptor = Object.getOwnPropertyDescriptor(fixture.document, "cookie");
  fixture.window.localStorage.setItem = () => { throw new Error("blocked writes"); };
  Object.defineProperty(fixture.document, "cookie", { get: cookieDescriptor.get, set: () => {} });
  assert.equal(analytics.saveAnalyticsConsent("granted"), false);
  assert.equal(fixture.stored.get(analytics.consentStorageKey), "ad_measurement");
  assert.equal(fixture.cookies.get("catalyst_analytics_consent"), "ad_measurement");
  assert.equal(analytics.getAnalyticsConsent(), "denied");
  assert.equal(fixture.reloads(), 0);
  assert.deepEqual(tagUpdates[0], ["consent", "update", {
    analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
  }]);
  assert.equal(fixture.window["ga-disable-G-TEST123"], true);
  assert.equal(fixture.scripts[0].removed, true);
  assert.ok(fixture.requests.every(({ options }) => options.signal.aborted));
  session.track("form_complete");
  session.navigate("/about");
  lateTagCallback("event", "form_complete");
  assert.equal(fixture.window.dataLayer.length, 0);
  assert.equal(fixture.requests.length, 1);
  // Recovery saves the choice but does not restart a tag in the dirty document.
  fixture.window.localStorage.setItem = (key, value) => fixture.stored.set(key, value);
  Object.defineProperty(fixture.document, "cookie", cookieDescriptor);
  assert.equal(analytics.saveAnalyticsConsent("granted"), true);
  assert.equal(analytics.getAnalyticsConsent(), "granted");
  assert.equal(fixture.reloads(), 1);
  assert.equal(fixture.scripts.length, 1);
  assert.equal(fixture.requests.length, 1);
});

test("loss of ad consent to pending blocks loaded and late tag events", (t) => {
  const fixture = browserFixture(t);
  analytics.saveAnalyticsConsent("ad_measurement");
  const session = analytics.createAnalyticsSession(analytics.createBrowserAnalyticsTransport({ gaId: "G-TEST123", plausibleDomain: "site.example" }));
  session.navigate("/consultation");
  session.consent(analytics.getAnalyticsConsent());
  const lateTagCallback = fixture.window.gtag;
  fixture.stored.clear();
  fixture.cookies.clear();
  session.consent(analytics.getAnalyticsConsent());
  assert.equal(fixture.reloads(), 1);
  session.track("form_complete");
  session.navigate("/about");
  lateTagCallback("event", "form_complete");
  assert.equal(fixture.window.dataLayer.length, 0);
  assert.equal(fixture.requests.length, 1);
  assert.equal(fixture.scripts[0].removed, true);
});

test("withdrawal still refreshes and stops an accepted session when cookie access becomes blocked", (t) => {
  const fixture = browserFixture(t);
  analytics.saveAnalyticsConsent("granted");
  const session = analytics.createAnalyticsSession(analytics.createBrowserAnalyticsTransport({ gaId: "G-TEST123", plausibleDomain: "" }));
  fixture.window.addEventListener(analytics.consentChangeEvent, (event) => session.consent(event.detail));
  session.navigate("/");
  session.consent("granted");
  Object.defineProperty(fixture.document, "cookie", {
    get: () => { throw new Error("Cookie access revoked"); },
    set: () => { throw new Error("Cookie access revoked"); },
  });
  assert.doesNotThrow(() => assert.equal(analytics.saveAnalyticsConsent("denied"), true));
  assert.equal(analytics.getAnalyticsConsent(), "denied");
  assert.equal(fixture.reloads(), 1);
  assert.equal(fixture.window["ga-disable-G-TEST123"], true);
  assert.equal(fixture.window.dataLayer.length, 0);
  assert.equal(fixture.scripts[0].removed, true);
});
