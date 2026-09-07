export type ROIInputs = {
  employees: number;
  hourlyCost: number;
  weeklyHours: number;
  timeSavedPct: number;
  cashRealizationPct: number;
  monthlyReworkSavings: number;
  retiredSoftwareSavings: number;
  monthlyAddedContribution: number;
  projectCost: number;
  monthlySupport: number;
  monthlyThirdParty: number;
  implementationMonths: number;
};
export const roiDefaults: ROIInputs = {
  employees: 5,
  hourlyCost: 28,
  weeklyHours: 10,
  timeSavedPct: 50,
  cashRealizationPct: 0,
  monthlyReworkSavings: 0,
  retiredSoftwareSavings: 0,
  monthlyAddedContribution: 0,
  projectCost: 15000,
  monthlySupport: 350,
  monthlyThirdParty: 100,
  implementationMonths: 2,
};
export const roiBounds: Record<keyof ROIInputs, [number, number]> = {
  employees: [1, 1000],
  hourlyCost: [0, 500],
  weeklyHours: [0, 80],
  timeSavedPct: [0, 100],
  cashRealizationPct: [0, 100],
  monthlyReworkSavings: [0, 1000000],
  retiredSoftwareSavings: [0, 100000],
  monthlyAddedContribution: [0, 1000000],
  projectCost: [0, 10000000],
  monthlySupport: [0, 100000],
  monthlyThirdParty: [0, 100000],
  implementationMonths: [0, 24],
};
export function normalizeROI(input: ROIInputs): ROIInputs {
  return Object.fromEntries(
    Object.entries(roiBounds).map(([k, [min, max]]) => {
      const key = k as keyof ROIInputs;
      const v = input[key];
      return [
        k,
        Math.min(max, Math.max(min, Number.isFinite(v) ? v : roiDefaults[key])),
      ];
    }),
  ) as ROIInputs;
}
export function calculateROI(input: ROIInputs) {
  const v = normalizeROI(input),
    annualHours = (v.employees * v.weeklyHours * 52 * v.timeSavedPct) / 100;
  const monthlyCapacityValue = (annualHours * v.hourlyCost) / 12,
    monthlyCashLabor = (monthlyCapacityValue * v.cashRealizationPct) / 100;
  const monthlyOther =
    v.monthlyReworkSavings +
    v.retiredSoftwareSavings +
    v.monthlyAddedContribution;
  const monthlyRecurring = v.monthlySupport + v.monthlyThirdParty,
    activeMonths = Math.max(0, 12 - v.implementationMonths);
  const monthlyNetValue =
      monthlyCapacityValue + monthlyOther - monthlyRecurring,
    monthlyNetCash = monthlyCashLabor + monthlyOther - monthlyRecurring;
  return {
    annualHours,
    monthlyCapacityValue,
    monthlyCashLabor,
    monthlyRecurring,
    monthlyOther,
    activeMonths,
    firstYearCost: v.projectCost + monthlyRecurring * activeMonths,
    firstYearCapacityValue: monthlyCapacityValue * activeMonths,
    firstYearNetValue: monthlyNetValue * activeMonths - v.projectCost,
    firstYearNetCash: monthlyNetCash * activeMonths - v.projectCost,
    economicPayback:
      monthlyNetValue > 0
        ? v.projectCost === 0
          ? 0
          : v.implementationMonths + v.projectCost / monthlyNetValue
        : null,
    cashPayback:
      monthlyNetCash > 0
        ? v.projectCost === 0
          ? 0
          : v.implementationMonths + v.projectCost / monthlyNetCash
        : null,
  };
}
export const roiLabels: Record<keyof ROIInputs, string> = {
  employees: "People involved",
  hourlyCost: "Hourly labor cost ($)",
  weeklyHours: "Manual hours per person / week",
  timeSavedPct: "Expected time reduction (%)",
  cashRealizationPct: "Time savings becoming cash savings (%)",
  monthlyReworkSavings: "Monthly rework costs avoided ($)",
  retiredSoftwareSavings: "Monthly software costs removed ($)",
  monthlyAddedContribution: "Additional monthly contribution profit ($)",
  projectCost: "One-time project cost ($)",
  monthlySupport: "Monthly support ($)",
  monthlyThirdParty: "Monthly hosting, software & AI costs ($)",
  implementationMonths: "Months before go-live",
};
export const formatMoney = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
export const roiAssumptions =
  "52 working weeks per year. Benefits and recurring costs begin at go-live and remain constant afterward. The full project cost is counted in year one. Capacity value is the value of freed time, not automatically reduced payroll or cash savings. Only the selected cash-realization percentage is counted as labor cash savings. Additional contribution profit should exclude its delivery costs. Avoid entering overlapping savings. No tax, financing, inflation, or discount-rate effects are modeled.";
export function roiReportHTML(input: ROIInputs) {
  const v = normalizeROI(input),
    r = calculateROI(v);
  const row = (k: string, val: string) =>
    `<tr><th>${k}</th><td>${val}</td></tr>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Catalyst Innovations — Opportunity Estimate</title><style>body{font:15px/1.6 Arial,sans-serif;color:#10243b;max-width:760px;margin:40px auto;padding:0 20px}h1,h2{line-height:1.2}h1{font-size:30px}h2{font-size:20px;margin-top:32px}table{width:100%;border-collapse:collapse}th,td{padding:9px 0;border-bottom:1px solid #d5dfeb;text-align:left}th{font-weight:400}td{text-align:right;font-weight:600}small{display:block;margin:25px 0;color:#425d79}button{padding:12px 20px;background:#1455d9;color:white;border:0;font:inherit}@media print{body{margin:0}button{display:none}tr{break-inside:avoid}}</style></head><body><p>CATALYST INNOVATIONS</p><h1>Your workflow opportunity estimate</h1><p>Illustrative planning model · USD · ${new Date().toLocaleDateString("en-US")}</p><button onclick="window.print()">Print / save as PDF</button><h2>Your assumptions</h2><table>${Object.entries(
    v,
  )
    .map(([key, value]) =>
      row(roiLabels[key as keyof ROIInputs], value.toLocaleString("en-US")),
    )
    .join(
      "",
    )}</table><h2>Estimated first-year results</h2><table>${row("Months live in year one", String(r.activeMonths))}${row("Capacity value in year one", formatMoney(r.firstYearCapacityValue))}${row("Project and recurring cost in year one", formatMoney(r.firstYearCost))}${row("Net estimated benefit, including capacity value", formatMoney(r.firstYearNetValue))}${row("Net estimated cash benefit", formatMoney(r.firstYearNetCash))}${row("Economic payback from kickoff", r.economicPayback === null ? "Not reached under these assumptions" : r.economicPayback.toFixed(1) + " months")}${row("Cash payback from kickoff", r.cashPayback === null ? "Not reached under these assumptions" : r.cashPayback.toFixed(1) + " months")}</table><small>${roiAssumptions} These estimates are not measured customer results or a guarantee.</small><p>Discuss a scoped project at mycatalystinnovations.com/consultation.</p></body></html>`;
}
