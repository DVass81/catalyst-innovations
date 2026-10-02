/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS harness compiles TS and injects delivery mocks without a new test dependency. */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const root = path.join(__dirname, "..");
function load(file, mocks = {}) {
  const filename = path.join(root, file);
  const m = new Module(filename, module);
  m.filename = filename;
  m.paths = Module._nodeModulePaths(path.dirname(filename));
  const original = m.require.bind(m);
  m.require = (id) => (Object.hasOwn(mocks, id) ? mocks[id] : original(id));
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  });
  m._compile(outputText, filename);
  return m.exports;
}
const { calculators, calculate, getCalculator } = load("lib/calculators.ts");
const example = (c) =>
  Object.fromEntries(c.fields.map((f) => [f.key, String(f.example)]));
const expected = {
  "manual-work": [200, 6000],
  "duplicate-entry": [200, 6000],
  "software-consolidation": [3600],
  "project-roi": [-6600, (-6600 / 18600) * 100, 15000 / 700, 18600],
  "missed-inquiries": [5000, 1500],
  "sales-follow-up": [5000, 1500],
  "quoting-time": [200, 6000],
  "invoice-preparation": [200, 6000],
  "dispatch-admin": [200, 6000],
  "crew-travel": [200, 6000],
  "job-margin": [4000, 40],
  "change-orders": [4800],
  "inventory-carrying": [20000],
  "reorder-point": [190],
  "warehouse-picking": [200, 6000],
  "purchase-orders": [200, 6000],
  "downtime-cost": [9600],
  "scrap-rework": [10800],
  "hoa-administration": [200, 6000],
  "maintenance-coordination": [200, 6000],
  "campaign-proceeds": [18000],
  "donor-follow-up": [5000, 1500],
  "reporting-time": [200, 6000],
  "customer-onboarding": [200, 6000],
};
test("24 unique calculators match independently calculated examples", () => {
  assert.equal(calculators.length, 24);
  assert.equal(new Set(calculators.map((c) => c.slug)).size, 24);
  assert.deepEqual(
    new Set(calculators.map((c) => c.slug)),
    new Set(Object.keys(expected)),
  );
  for (const c of calculators) {
    const result = calculate(c, example(c));
    assert.equal(result.complete, true, c.slug);
    result.results.forEach((r, i) =>
      assert.ok(
        Math.abs(r.value - expected[c.slug][i]) < 0.00001,
        `${c.slug}: ${r.label}`,
      ),
    );
  }
});
test("all tools handle blank, zero, invalid and extreme inputs", () => {
  for (const c of calculators) {
    assert.equal(calculate(c, {}).complete, false, c.slug);
    const zero = Object.fromEntries(c.fields.map((f) => [f.key, "0"]));
    assert.equal(calculate(c, zero).complete, true, c.slug);
    for (const r of calculate(c, zero).results)
      assert.ok(r.value === null || Number.isFinite(r.value), c.slug);
    for (const value of ["-1", "Infinity", "NaN", "1e100"])
      assert.equal(
        calculate(c, { ...example(c), [c.fields[0].key]: value }).complete,
        false,
        c.slug,
      );
    const max = Object.fromEntries(c.fields.map((f) => [f.key, String(f.max)]));
    assert.ok(
      calculate(c, max).results.every(
        (r) => r.value === null || Number.isFinite(r.value),
      ),
      c.slug,
    );
  }
});
test("ROI distinguishes capacity and contribution and refuses undefined payback", () => {
  const c = getCalculator("project-roi");
  const v = example(c);
  assert.equal(
    calculate(c, v, ["cash", "capacity", "contribution"]).results[0].value,
    1800,
  );
  assert.equal(calculate(c, { ...v, cash: "300" }).results[2].value, null);
  assert.equal(calculate(c, { ...v, cash: "0" }).results[2].value, null);
  assert.equal(calculate(c, { ...v, upfront: "" }).complete, false);
  assert.equal(
    calculate(c, { ...v, upfront: "0", recurring: "0" }).results[1].value,
    null,
  );
  assert.equal(calculate(c, { ...v, upfront: "0" }).results[2].value, 0);
  assert.equal(calculate(c, v, []).results[0].value, -18600);
});
test("margin, proceeds, rounding and optional contributions remain honest", () => {
  assert.equal(
    calculate(getCalculator("job-margin"), {
      revenue: "0",
      labor: "5",
      materials: "0",
      other: "0",
    }).results[1].value,
    null,
  );
  assert.equal(
    calculate(getCalculator("campaign-proceeds"), {
      receipts: "100",
      fees: "50",
      expenses: "100",
    }).results[0].value,
    -50,
  );
  assert.equal(
    calculate(getCalculator("reorder-point"), {
      demand: "1.5",
      lead: "3",
      safety: "0",
    }).results[0].value,
    5,
  );
  const c = getCalculator("sales-follow-up");
  assert.equal(calculate(c, { ...example(c), margin: "" }).results.length, 1);
  assert.equal(
    calculate(c, { ...example(c), margin: "0" }).results[1].value,
    0,
  );
});
const { industryList } = load("data/redesign.ts", {
  "./industries": load("data/industries.ts"),
  "./industryNeeds": load("data/industryNeeds.ts"),
});
test("every industry has three valid recommendations and concrete content", () => {
  assert.equal(industryList.length, 19);
  assert.equal(new Set(industryList.flatMap((i) => i.problems)).size, 57);
  for (const i of industryList) {
    assert.equal(i.tools.length, 3);
    assert.ok(i.tools.every((slug) => getCalculator(slug)));
    assert.equal(i.problems.length, 3);
    assert.equal(i.solutions.length, 3);
    assert.equal(i.workflow.length, 5);
  }
  for (const slug of ["plumbing", "hvac", "painting", "hoa"])
    assert.ok(industryList.some((i) => i.slug === slug));
});

test("questionnaire additions preserve optionality and reject unknown demo/category values", () => {
  const extended = {
    ...valid,
    sourceDemo: "flooring",
    struggleCategories: ["Inventory and purchasing", "Disconnected software"],
    currentTools: "Spreadsheets",
    desiredOutcome: "Less copying",
  };
  assert.ok(schema.consultationSchema.safeParse(extended).success);
  assert.ok(
    schema.consultationSchema.safeParse({ ...valid, struggleCategories: [] })
      .success,
  );
  assert.equal(
    schema.consultationSchema.safeParse({
      ...extended,
      sourceDemo: "private-owner",
    }).success,
    false,
  );
  assert.equal(
    schema.consultationSchema.safeParse({
      ...extended,
      struggleCategories: ["unknown"],
    }).success,
    false,
  );
  assert.equal(
    schema.consultationSchema.safeParse({
      ...extended,
      currentTools: "x".repeat(1001),
    }).success,
    false,
  );
});
const schema = load("lib/consultation.ts");
const lead = load("lib/leadScoring.ts");
const valid = {
  name: "Test Person",
  email: "test@example.com",
  company: "Example",
  challenge: "Improve our quoting process.",
};
test("short inquiry and older detailed submissions validate", () => {
  const result = schema.consultationSchema.safeParse(valid);
  assert.ok(result.success);
  assert.equal(lead.scoreLead(result.data).score, 2);
  assert.ok(
    schema.consultationSchema.safeParse({
      ...valid,
      inquiryType: "Request a consultation",
      companySize: "11–50",
      industry: "Construction",
      timeline: "1–3 months",
      contactMethod: "Email",
    }).success,
  );
  assert.equal(
    schema.consultationSchema.safeParse({ ...valid, email: "broken" }).success,
    false,
  );
  assert.equal(
    schema.consultationSchema.safeParse({
      ...valid,
      calculatorSummary: "x".repeat(5001),
    }).success,
    false,
  );
});
const { POST } = load("app/api/consultation/route.ts", {
  "@/lib/consultation": schema,
  "@/lib/leadScoring": lead,
  "@/lib/rateLimit": { isRateLimited: async () => false },
});
test("delivery is truthful and provider requests can be mocked without sending", async () => {
  const keys = [
    "NODE_ENV",
    "CONSULTATION_WEBHOOK_URL",
    "RESEND_API_KEY",
    "CONSULTATION_TO_EMAIL",
  ];
  const before = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
  const fetchBefore = global.fetch;
  const request = (body = valid) =>
    new Request("http://localhost/api/consultation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  try {
    process.env.NODE_ENV = "production";
    for (const k of keys.slice(1)) delete process.env[k];
    assert.equal((await POST(request())).status, 502);
    assert.equal(
      (await POST(request({ ...valid, email: "invalid" }))).status,
      400,
    );
    let calls = 0;
    process.env.CONSULTATION_WEBHOOK_URL = "https://example.invalid/webhook";
    let deliveredBody;
    global.fetch = async (_url, options) => {
      calls++;
      deliveredBody = JSON.parse(options.body);
      return new Response("{}", { status: 200 });
    };
    assert.equal(
      (await POST(request({ ...valid, website: "bot" }))).status,
      200,
    );
    assert.equal(calls, 0);
    assert.equal((await POST(request())).status, 200);
    assert.equal(calls, 1);
    assert.equal(
      (
        await POST(
          request({
            ...valid,
            sourceDemo: "hoa",
            struggleCategories: ["Disconnected software"],
            currentTools: "Spreadsheets",
          }),
        )
      ).status,
      200,
    );
    assert.equal(deliveredBody.sourceDemo, "hoa");
    assert.deepEqual(deliveredBody.struggleCategories, [
      "Disconnected software",
    ]);
    assert.equal(deliveredBody.currentTools, "Spreadsheets");
    global.fetch = async () => new Response("{}", { status: 500 });
    assert.equal((await POST(request())).status, 502);
    process.env.RESEND_API_KEY = "test-only";
    process.env.CONSULTATION_TO_EMAIL = "test@example.com";
    global.fetch = async (url) =>
      new Response("{}", {
        status: String(url).includes("api.resend.com") ? 200 : 500,
      });
    assert.equal((await POST(request())).status, 200);
    delete process.env.CONSULTATION_WEBHOOK_URL;
    let sentEmail;
    global.fetch = async (url, options) => {
      assert.equal(url, "https://api.resend.com/emails");
      assert.ok(options.signal instanceof AbortSignal);
      sentEmail = JSON.parse(options.body);
      return new Response("{}", { status: 200 });
    };
    assert.equal((await POST(request())).status, 200);
    assert.equal(sentEmail.reply_to, valid.email);
    assert.deepEqual(sentEmail.to, ["test@example.com"]);
    global.fetch = async () => { throw new DOMException("Provider timed out", "TimeoutError"); };
    assert.equal((await POST(request())).status, 502);
  } finally {
    global.fetch = fetchBefore;
    for (const k of keys) {
      if (before[k] === undefined) delete process.env[k];
      else process.env[k] = before[k];
    }
  }
});

const { startingPoints, recommendedDemo } = load("data/startingPoints.ts");
const { demos } = load("data/demos.ts");
test("problem finder recommendations resolve to actual calculators and verified demos", () => {
  assert.equal(new Set(startingPoints.map((p) => p.id)).size, 5);
  for (const p of startingPoints) {
    assert.ok(getCalculator(p.tool), p.tool);
    assert.ok(
      demos.some((d) => d.id === p.demo),
      p.demo,
    );
    assert.ok(p.before.length > 20 && p.after.length > 20);
  }
});
test("every industry group gets an honest demo recommendation", () => {
  for (const group of [
    "Trades & construction",
    "Manufacturing & fabrication",
    "Distribution & warehousing",
    "Financial & professional services",
    "Communities & nonprofits",
    "Growing businesses",
  ]) {
    const d = recommendedDemo(group, "test");
    assert.ok(demos.some((x) => x.id === d.id));
    assert.ok(d.reason.length > 30);
  }
  assert.equal(
    recommendedDemo("Trades & construction", "painting").id,
    "painting",
  );
  assert.match(
    recommendedDemo("Manufacturing & fabrication", "manufacturing").reason,
    /not a warehouse or manufacturing product/,
  );
});

const { inquiryEmailDraft } = load("lib/inquiryEmail.ts");
test("email draft fallback preserves context and excludes calculation figures without consent", () => {
  const data = {
    name: "Example",
    email: "example@example.com",
    company: "Example & Co",
    challenge: "Quotes take too long.",
    struggleCategories: ["Quotes and follow-up"],
  };
  const draft = inquiryEmailDraft(data, {
    demo: "flooring",
    tool: "quoting-time",
  });
  assert.equal(draft.copyRequired, false);
  assert.match(draft.href, /^mailto:daniel@mycatalystinnovations.com/);
  assert.match(decodeURIComponent(draft.href), /Example & Co/);
  assert.match(draft.body, /Demo: flooring/);
  assert.doesNotMatch(draft.body, /Calculation shared/);
  const long = inquiryEmailDraft(
    { ...data, challenge: "x".repeat(3000) },
    { summary: "Optional calculation" },
  );
  assert.equal(long.copyRequired, true);
  assert.equal(long.href.includes("&body="), false);
  assert.ok(long.body.includes("x".repeat(3000)));
  assert.match(long.body, /Optional calculation/);
});
