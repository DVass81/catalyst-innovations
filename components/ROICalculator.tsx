"use client";

import { useMemo, useRef, useState } from "react";
import { Section, Eyebrow, Heading, Lead, ButtonLink } from "./ui";
import { Reveal } from "./Reveal";
import { track } from "@/lib/site";

type Inputs = {
  employees: number;
  hourlyCost: number;
  weeklyHours: number;
  errorCosts: number;   // monthly
  softwareCosts: number; // monthly, current
  timeSavedPct: number;
  revenueOpportunity: number; // optional monthly
};

const defaults: Inputs = {
  employees: 5,
  hourlyCost: 28,
  weeklyHours: 10,
  errorCosts: 1500,
  softwareCosts: 500,
  timeSavedPct: 50,
  revenueOpportunity: 0,
};

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

type Results = {
  monthlySavings: number; annualSavings: number; reworkReduction: number;
  monthlyTotal: number; annualTotal: number; hoursReturned: number; paybackMonths: number;
};

/** Branded, print-ready one-pager — opens the browser's print/save-PDF dialog. */
function printSummary(v: Inputs, r: Results) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:10px 0;color:#4a5a72;border-bottom:1px solid #e8eef5">${label}</td>
     <td style="padding:10px 0;text-align:right;font-weight:600;color:#0a1628;border-bottom:1px solid #e8eef5">${value}</td></tr>`;
  const html = `<!doctype html><html><head><title>Catalyst Innovations — ROI Estimate</title></head>
  <body style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:40px auto;color:#0a1628">
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #4a8fd4;padding-bottom:16px">
      <div>
        <div style="font-size:20px;font-weight:700;letter-spacing:3px">CATALYST INNOVATIONS</div>
        <div style="font-size:11px;letter-spacing:2px;color:#74869d;margin-top:2px">MAKE MORE · SAVE TIME · WORK SMARTER</div>
      </div>
      <div style="font-size:12px;color:#74869d">${new Date().toLocaleDateString("en-US")}</div>
    </div>
    <h1 style="font-size:22px;margin:28px 0 4px">Process Automation ROI Estimate</h1>
    <p style="color:#4a5a72;font-size:13px;margin:0 0 24px">Based on the figures you entered at our ROI estimator.</p>
    <h2 style="font-size:14px;color:#2f5d8f;letter-spacing:1px;text-transform:uppercase">Your inputs</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${row("Employees involved in the process", String(v.employees))}
      ${row("Average hourly labor cost", fmt(v.hourlyCost))}
      ${row("Hours weekly on manual work (per employee)", String(v.weeklyHours))}
      ${row("Estimated monthly error / rework costs", fmt(v.errorCosts))}
      ${row("Expected time saved", v.timeSavedPct + "%")}
    </table>
    <h2 style="font-size:14px;color:#2f5d8f;letter-spacing:1px;text-transform:uppercase;margin-top:28px">Estimated opportunity</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${row("Monthly labor savings", fmt(r.monthlySavings))}
      ${row("Annual labor savings", fmt(r.annualSavings))}
      ${row("Monthly rework reduction", fmt(r.reworkReduction))}
      ${row("Hours returned to the organization / year", Math.round(r.hoursReturned).toLocaleString() + " hrs")}
      ${row("Annual financial opportunity", fmt(r.annualTotal))}
      ${row("Illustrative payback period", Number.isFinite(r.paybackMonths) ? Math.max(1, Math.round(r.paybackMonths)) + " months" : "—")}
    </table>
    <p style="font-size:11px;color:#74869d;line-height:1.6;margin-top:28px">These figures are illustrative estimates based on your
    inputs and simplified assumptions (including a 50% rework reduction and an illustrative mid-range implementation investment).
    They are not guaranteed financial outcomes. Request a consultation for a scoped analysis of your operation.</p>
    <script>window.onload = () => window.print();</script>
  </body></html>`;
  const w = window.open("", "_blank", "width=760,height=900");
  if (w) {
    w.document.write(html);
    w.document.close();
  }
}

function Field({
  label, value, onChange, min, max, step = 1, prefix, suffix,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step?: number; prefix?: string; suffix?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-navy-800">{label}</label>
        <span className="font-mono text-sm font-semibold text-steel-600">
          {prefix}{value.toLocaleString()}{suffix}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-steel-500"
      />
    </div>
  );
}

export default function ROICalculator() {
  const [v, setV] = useState<Inputs>(defaults);
  const tracked = useRef(false);
  const set = (k: keyof Inputs) => (val: number) => {
    if (!tracked.current) {
      tracked.current = true;
      track("roi_calculator_used");
    }
    setV((p) => ({ ...p, [k]: val }));
  };

  const r = useMemo(() => {
    const weeklyLabor = v.employees * v.hourlyCost * v.weeklyHours;
    const monthlyLabor = weeklyLabor * 4.33;
    const monthlySavings = monthlyLabor * (v.timeSavedPct / 100);
    const reworkReduction = v.errorCosts * 0.5; // illustrative 50% reduction
    const monthlyTotal = monthlySavings + reworkReduction + v.revenueOpportunity;
    const annualTotal = monthlyTotal * 12;
    const hoursReturned = v.employees * v.weeklyHours * (v.timeSavedPct / 100) * 52;
    // Illustrative payback vs. a mid-range implementation placeholder
    const illustrativeInvestment = 25000;
    const paybackMonths = monthlyTotal > 0 ? illustrativeInvestment / monthlyTotal : Infinity;
    return { monthlySavings, annualSavings: monthlySavings * 12, reworkReduction, monthlyTotal, annualTotal, hoursReturned, paybackMonths };
  }, [v]);

  return (
    <Section id="roi" className="bg-white">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <Eyebrow>ROI estimator</Eyebrow>
          <Heading>What is manual work costing you?</Heading>
          <Lead>
            Adjust the sliders to your situation. Results update instantly.
          </Lead>
          <div className="mt-8 space-y-6">
            <Field label="Employees involved in the process" value={v.employees} onChange={set("employees")} min={1} max={200} />
            <Field label="Average hourly labor cost" value={v.hourlyCost} onChange={set("hourlyCost")} min={15} max={150} prefix="$" />
            <Field label="Hours spent weekly on manual work (per employee)" value={v.weeklyHours} onChange={set("weeklyHours")} min={1} max={40} />
            <Field label="Estimated monthly error / rework costs" value={v.errorCosts} onChange={set("errorCosts")} min={0} max={50000} step={250} prefix="$" />
            <Field label="Current monthly software costs" value={v.softwareCosts} onChange={set("softwareCosts")} min={0} max={20000} step={100} prefix="$" />
            <Field label="Expected time saved" value={v.timeSavedPct} onChange={set("timeSavedPct")} min={10} max={90} suffix="%" />
            <Field label="Optional monthly revenue opportunity" value={v.revenueOpportunity} onChange={set("revenueOpportunity")} min={0} max={100000} step={500} prefix="$" />
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="rounded-card border border-ice-200 bg-navy-900 p-8 text-white shadow-card-dark lg:sticky lg:top-24" aria-live="polite">
            <h3 className="font-display text-lg font-semibold">Your estimated opportunity</h3>
            <dl className="mt-6 space-y-5">
              <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-4">
                <dt className="text-sm text-ice-300">Estimated monthly labor savings</dt>
                <dd className="font-display text-xl font-semibold text-steel-300">{fmt(r.monthlySavings)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-4">
                <dt className="text-sm text-ice-300">Estimated annual labor savings</dt>
                <dd className="font-display text-xl font-semibold text-steel-300">{fmt(r.annualSavings)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-4">
                <dt className="text-sm text-ice-300">Estimated monthly rework reduction</dt>
                <dd className="font-display text-xl font-semibold text-steel-300">{fmt(r.reworkReduction)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-4">
                <dt className="text-sm text-ice-300">Hours returned to the organization / year</dt>
                <dd className="font-display text-xl font-semibold text-steel-300">
                  {Math.round(r.hoursReturned).toLocaleString()} hrs
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-4">
                <dt className="text-sm text-ice-300">Estimated annual financial opportunity</dt>
                <dd className="font-display text-2xl font-semibold text-white">{fmt(r.annualTotal)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-ice-300">Illustrative payback period</dt>
                <dd className="font-display text-xl font-semibold text-steel-300">
                  {Number.isFinite(r.paybackMonths) ? `${Math.max(1, Math.round(r.paybackMonths))} months` : "—"}
                </dd>
              </div>
            </dl>
            <p className="mt-6 text-xs leading-relaxed text-silver-400">
              These figures are illustrative estimates based on your inputs and simplified
              assumptions (including a 50% rework reduction and an illustrative mid-range
              implementation investment). They are not guaranteed financial outcomes.
            </p>
            <ButtonLink
              href="/consultation"
              className="mt-6 w-full"
              onClick={() => track("cta_consultation_click", { location: "roi_calculator" })}
            >
              Discuss these numbers with us
            </ButtonLink>
            <button
              type="button"
              onClick={() => {
                track("roi_pdf_download");
                printSummary(v, r);
              }}
              className="mt-3 w-full rounded-lg border border-white/25 px-6 py-3 text-sm font-medium text-ice-100 transition-colors hover:bg-white/10"
            >
              Download PDF summary
            </button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
