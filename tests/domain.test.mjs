import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateROI,
  roiDefaults,
  normalizeROI,
  roiReportHTML,
} from "../lib/roi.ts";
import {
  initialPurchases,
  decidePurchase,
  hasScheduleConflict,
} from "../lib/demo.ts";
import { consultationSchema } from "../lib/consultation.ts";
test("default ROI separates capacity from cash and includes costs and timing", () => {
  const r = calculateROI(roiDefaults);
  assert.equal(r.annualHours, 1300);
  assert.equal(r.activeMonths, 10);
  assert.equal(r.firstYearCost, 19500);
  assert.equal(r.firstYearNetCash, -19500);
  assert.ok(Math.abs(r.firstYearNetValue - 10833.333333) < 0.01);
  assert.equal(r.cashPayback, null);
  assert.ok(Math.abs(r.economicPayback - 7.80645) < 0.001);
});
test("100 percent cash realization does not double count capacity", () => {
  const r = calculateROI({
    ...roiDefaults,
    cashRealizationPct: 100,
    monthlyReworkSavings: 700,
    retiredSoftwareSavings: 100,
    monthlyAddedContribution: 200,
  });
  assert.ok(Math.abs(r.firstYearNetValue - r.firstYearNetCash) < 0.01);
  assert.ok(Math.abs(r.cashPayback - r.economicPayback) < 0.001);
  assert.equal(r.monthlyOther, 1000);
});
test("launch after year one has no first-year benefits or running costs", () => {
  const r = calculateROI({ ...roiDefaults, implementationMonths: 18 });
  assert.equal(r.activeMonths, 0);
  assert.equal(r.firstYearCost, 15000);
  assert.equal(r.firstYearNetValue, -15000);
});
test("no benefit does not invent payback", () => {
  const r = calculateROI({ ...roiDefaults, timeSavedPct: 0 });
  assert.equal(r.cashPayback, null);
  assert.equal(r.economicPayback, null);
  assert.equal(r.firstYearNetValue, -19500);
});
test("invalid or out-of-range numeric inputs normalize safely", () => {
  const v = normalizeROI({
    ...roiDefaults,
    projectCost: Infinity,
    employees: -5,
    timeSavedPct: 300,
  });
  assert.equal(v.projectCost, 15000);
  assert.equal(v.employees, 1);
  assert.equal(v.timeSavedPct, 100);
  assert.ok(Number.isFinite(calculateROI(v).firstYearNetValue));
});
test("print report includes every input, costs and caveats", () => {
  const html = roiReportHTML({ ...roiDefaults, monthlyThirdParty: 271 });
  assert.match(html, /271/);
  assert.match(html, /Net estimated cash benefit/);
  assert.match(html, /not automatically reduced payroll/);
  assert.match(html, /Months before go-live/);
  assert.match(html, /hosting, software/);
});
test("return requires a reason and decisions cannot be overwritten", () => {
  assert.equal(
    decidePurchase(initialPurchases, initialPurchases[0].id, "returned", ""),
    initialPurchases,
  );
  const returned = decidePurchase(
    initialPurchases,
    initialPurchases[0].id,
    "returned",
    "Confirm quantity",
  );
  assert.equal(returned[0].reason, "Confirm quantity");
  assert.equal(initialPurchases[0].status, "pending");
  assert.equal(
    decidePurchase(returned, returned[0].id, "approved")[0].status,
    "returned",
  );
});
test("approval updates only the selected purchase", () => {
  const result = decidePurchase(
    initialPurchases,
    initialPurchases[0].id,
    "approved",
  );
  assert.equal(result[0].status, "approved");
  assert.equal(result[1].status, "pending");
  assert.equal(
    result
      .filter((p) => p.status === "approved")
      .reduce((n, p) => n + p.amount, 0),
    2400,
  );
});
test("scheduling detects overlaps while permitting back-to-back jobs", () => {
  assert.equal(hasScheduleConflict(570, 90, [{ start: 540, end: 660 }]), true);
  assert.equal(hasScheduleConflict(660, 90, [{ start: 540, end: 660 }]), false);
  assert.equal(hasScheduleConflict(450, 90, [{ start: 540, end: 660 }]), false);
  assert.equal(hasScheduleConflict(570, 90, []), false);
});
const short = {
  name: "Test User",
  email: "test@example.com",
  company: "Test Company",
  challenge: "A controlled test of our workflow.",
};
test("short consultation accepts four required fields", () => {
  const value = consultationSchema.parse(short);
  assert.equal(value.inquiryType, "Request a consultation");
  assert.equal(value.contactMethod, "Email");
});
test("existing detailed form payload remains compatible", () => {
  assert.equal(
    consultationSchema.safeParse({
      ...short,
      inquiryType: "General inquiry",
      industry: "Manufacturing",
      companySize: "11–50",
      timeline: "1–3 months",
      budget: "$10k–$50k",
      contactMethod: "Phone",
      phone: "555-0100",
      desiredOutcome: "Improve approvals",
      details: "More context",
    }).success,
    true,
  );
});
test("invalid email, context and honeypot are rejected", () => {
  for (const field of [
    { email: "bad" },
    { demoContext: "arbitrary" },
    { website: "spam" },
  ])
    assert.equal(
      consultationSchema.safeParse({ ...short, ...field }).success,
      false,
    );
});
