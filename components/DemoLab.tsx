"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle, ArrowDownRight, ArrowUpRight, Bell, Check, ShieldAlert, Sparkles, X,
} from "lucide-react";
import { track } from "@/lib/site";

/**
 * Demo Lab — interactive simulated product demonstrations.
 * ALL DATA IS FICTIONAL and generated for demonstration purposes.
 */

/* ---------- Shared bits ---------- */

function WindowFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-card border border-white/12 bg-navy-850 shadow-card-dark">
      <div className="flex items-center gap-2 border-b border-white/10 bg-navy-900 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </span>
        <span className="ml-2 text-xs font-medium text-ice-300">{title}</span>
        <span className="ml-auto rounded bg-warning/20 px-2 py-0.5 text-[0.6rem] font-bold text-warning">
          FICTIONAL DEMO DATA
        </span>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

const t = (widget: string, action: string) => track("demo_interaction", { widget, action });

/* ---------- 1. Procurement executive dashboard ---------- */

const spendData = {
  "This Month": { total: "$412,800", vsBudget: "-4.2%", open: 37, flagged: 3, bars: [62, 48, 71, 55, 80, 44, 66] },
  "This Quarter": { total: "$1.24M", vsBudget: "+1.8%", open: 92, flagged: 7, bars: [55, 70, 63, 78, 52, 69, 74] },
  "Year to Date": { total: "$3.86M", vsBudget: "-2.1%", open: 214, flagged: 11, bars: [68, 59, 75, 66, 81, 58, 72] },
} as const;

export function ProcurementDashboard() {
  const [range, setRange] = useState<keyof typeof spendData>("This Month");
  const d = spendData[range];
  return (
    <WindowFrame title="Catalyst Procurement Intelligence — Executive Dashboard">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Date range">
        {(Object.keys(spendData) as (keyof typeof spendData)[]).map((r) => (
          <button
            key={r}
            role="tab"
            aria-selected={range === r}
            onClick={() => { setRange(r); t("procurement_dashboard", "filter"); }}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              range === r ? "bg-steel-400 text-white" : "bg-white/8 text-ice-300 hover:bg-white/15"
            }`}
          >
            {r}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        {[
          ["Total spend", d.total, d.vsBudget.startsWith("-") ? "under budget" : "over budget", d.vsBudget],
          ["Open POs", String(d.open), "in workflow", ""],
          ["Policy flags", String(d.flagged), "need review", ""],
          ["On-time delivery", "94.2%", "trailing 90 days", "+1.1%"],
        ].map(([label, value, sub, delta]) => (
          <div key={label} className="rounded-xl bg-white/5 p-4">
            <p className="text-[0.65rem] font-semibold tracking-wide text-silver-400 uppercase">{label}</p>
            <p className="mt-1 font-display text-xl font-semibold text-white">{value}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[0.7rem] text-ice-300">
              {delta && (delta.startsWith("-")
                ? <ArrowDownRight size={12} className="text-success" />
                : <ArrowUpRight size={12} className="text-warning" />)}
              {delta} {sub}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <p className="text-[0.65rem] font-semibold tracking-wide text-silver-400 uppercase">Spend by department</p>
        <div className="mt-3 flex h-28 items-end gap-2" aria-hidden="true">
          {d.bars.map((h, i) => (
            <motion.div
              key={`${range}-${i}`}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="flex-1 rounded-t bg-gradient-to-t from-steel-600 to-steel-400"
            />
          ))}
        </div>
        <div className="mt-2 flex gap-2 text-[0.6rem] text-silver-400">
          {["Ops", "Maint", "IT", "Facil", "Prod", "Mktg", "Admin"].map((l) => (
            <span key={l} className="flex-1 text-center">{l}</span>
          ))}
        </div>
      </div>
    </WindowFrame>
  );
}

/* ---------- 2. AI daily briefing + approval-gated recommendation ---------- */

export function AIBriefing() {
  const [decision, setDecision] = useState<"pending" | "approved" | "rejected">("pending");
  return (
    <WindowFrame title="Catalyst AI — Daily Operations Briefing">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-steel-400/20">
          <Sparkles size={17} className="text-steel-300" />
        </span>
        <div className="space-y-3 text-sm leading-relaxed text-ice-100">
          <p><strong className="text-white">Good morning. Three items need attention today:</strong></p>
          <p>
            1. <strong className="text-white">Supplier risk:</strong> Meridian Alloys&apos; average lead time rose
            from 12 to 19 days over six weeks. Two open POs (#8841, #8867) are exposed.
          </p>
          <p>
            2. <strong className="text-white">Duplicate purchase detected:</strong> Requisition R-2210 (safety
            gloves, $1,840) overlaps a PO received Tuesday. Flagged before approval.
          </p>
          <p>
            3. <strong className="text-white">Cash-flow note:</strong> Month-end spend is tracking 4.2% under
            budget, driven by lower maintenance parts usage.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-steel-400/40 bg-steel-400/8 p-4">
        <p className="flex items-center gap-2 text-xs font-bold tracking-wide text-steel-300 uppercase">
          <ShieldAlert size={14} /> Recommendation — requires your approval
        </p>
        <p className="mt-2 text-sm text-ice-100">
          Split PO #8867 and move 40% of the order to backup supplier Karston Metals
          (quoted 9-day lead, +2.1% cost) to protect the Line 3 schedule.
        </p>
        <div className="mt-4 flex gap-3">
          {decision === "pending" ? (
            <>
              <button
                onClick={() => { setDecision("approved"); t("ai_briefing", "approve"); }}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-success px-4 text-xs font-bold text-white"
              >
                <Check size={14} /> Approve
              </button>
              <button
                onClick={() => { setDecision("rejected"); t("ai_briefing", "reject"); }}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-white/20 px-4 text-xs font-bold text-ice-100"
              >
                <X size={14} /> Reject
              </button>
            </>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-sm font-semibold ${decision === "approved" ? "text-success" : "text-ice-300"}`}
              role="status"
            >
              {decision === "approved"
                ? "✓ Approved — action logged to the audit trail, buyer notified."
                : "Rejected — reasoning captured; the AI will not re-suggest this split."}
            </motion.p>
          )}
        </div>
      </div>
    </WindowFrame>
  );
}

/* ---------- 3. Approval workflow ---------- */

type Req = { id: string; desc: string; amount: string; dept: string; status: "pending" | "approved" | "rejected" };
const initialReqs: Req[] = [
  { id: "R-2214", desc: "Hydraulic press seals (qty 24)", amount: "$3,120", dept: "Maintenance", status: "pending" },
  { id: "R-2215", desc: "CNC tooling inserts", amount: "$1,485", dept: "Production", status: "pending" },
  { id: "R-2216", desc: "Conference room AV upgrade", amount: "$7,900", dept: "Admin", status: "pending" },
];

export function ApprovalWorkflow() {
  const [reqs, setReqs] = useState(initialReqs);
  const act = (id: string, status: "approved" | "rejected") => {
    setReqs((p) => p.map((r) => (r.id === id ? { ...r, status } : r)));
    t("approval_workflow", status);
  };
  return (
    <WindowFrame title="Purchase Approvals — Your Queue">
      <ul className="space-y-3">
        {reqs.map((r) => (
          <li key={r.id} className="rounded-xl bg-white/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">
                  {r.id} · {r.desc}
                </p>
                <p className="mt-0.5 text-xs text-silver-400">{r.dept} · {r.amount} · within budget</p>
              </div>
              {r.status === "pending" ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => act(r.id, "approved")}
                    className="inline-flex min-h-[36px] items-center gap-1 rounded-lg bg-success px-3 text-xs font-bold text-white"
                  >
                    <Check size={13} /> Approve
                  </button>
                  <button
                    onClick={() => act(r.id, "rejected")}
                    className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-white/20 px-3 text-xs font-bold text-ice-100"
                  >
                    <X size={13} /> Reject
                  </button>
                </div>
              ) : (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    r.status === "approved" ? "bg-success/20 text-success" : "bg-white/10 text-ice-300"
                  }`}
                >
                  {r.status === "approved" ? "✓ Approved → PO generated" : "Rejected → requester notified"}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </WindowFrame>
  );
}

/* ---------- 4. Manufacturing KPI + disruption alert ---------- */

export function OpsKPIs() {
  const [alertOpen, setAlertOpen] = useState(false);
  return (
    <WindowFrame title="Manufacturing KPI Dashboard — Plant 1">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ["OEE", "78.4%", "+2.3% vs last week", true],
          ["On-time completion", "91.7%", "-1.5% vs last week", false],
          ["First-pass yield", "96.1%", "+0.4% vs last week", true],
          ["Open work orders", "47", "12 due today", true],
        ].map(([label, value, sub, good]) => (
          <div key={label as string} className="rounded-xl bg-white/5 p-4">
            <p className="text-[0.65rem] font-semibold tracking-wide text-silver-400 uppercase">{label}</p>
            <p className="mt-1 font-display text-xl font-semibold text-white">{value}</p>
            <p className={`mt-0.5 text-[0.7rem] ${good ? "text-success" : "text-warning"}`}>{sub}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => { setAlertOpen((v) => !v); t("ops_kpis", "open_alert"); }}
        className="mt-4 flex w-full items-center gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-left transition-colors hover:bg-warning/15"
        aria-expanded={alertOpen}
      >
        <Bell size={18} className="shrink-0 text-warning" />
        <span className="text-sm font-semibold text-white">
          Supply-chain disruption alert: inbound steel shipment delayed 6 days
        </span>
        <AlertTriangle size={16} className="ml-auto shrink-0 text-warning" />
      </button>
      <AnimatePresence>
        {alertOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-xl bg-white/5 p-4 text-sm leading-relaxed text-ice-100">
              <p><strong className="text-white">Impact analysis:</strong> Work orders WO-1180 and WO-1194
              (Line 2) will run short of 4140 bar stock on Thursday.</p>
              <p className="mt-2"><strong className="text-white">Options prepared:</strong> (1) Pull 60% from
              Plant 2 buffer stock — zero cost, 1-day transfer. (2) Spot buy from regional
              distributor at +6.8%. (3) Resequence Line 2 to aluminum jobs until arrival.</p>
              <p className="mt-2 text-xs text-silver-400">Prepared automatically at 6:02 AM · sources: inventory system, PO tracking, production schedule</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </WindowFrame>
  );
}

/* ---------- 5. Natural-language query ---------- */

const cannedQueries = [
  {
    q: "Which suppliers were late most often this quarter?",
    a: "Three suppliers account for 71% of late deliveries this quarter: Meridian Alloys (9 late POs, avg 5.2 days), TriState Fasteners (6 late POs, avg 2.1 days), and Corvex Packaging (4 late POs, avg 8.4 days). Meridian's delays all occurred after their plant consolidation in March.",
  },
  {
    q: "What did we spend on maintenance parts last month vs budget?",
    a: "Maintenance parts spend last month was $38,420 against a $45,000 budget — 14.6% under. The largest driver was lower bearing replacement volume after the Line 1 alignment project.",
  },
  {
    q: "Show me purchase requests waiting more than 3 days",
    a: "There are 4 requisitions waiting over 3 days: R-2198 (5 days, waiting on VP approval), R-2201 (4 days, budget question), R-2204 and R-2207 (both 4 days, approver on PTO — suggested reroute to backup approver).",
  },
];

export function NLQuery() {
  const [active, setActive] = useState<number | null>(null);
  const [thinking, setThinking] = useState(false);
  function ask(i: number) {
    t("nl_query", "ask");
    setThinking(true);
    setActive(null);
    setTimeout(() => { setThinking(false); setActive(i); }, 700);
  }
  return (
    <WindowFrame title="Catalyst AI — Ask Your Business Anything">
      <p className="text-xs text-silver-400">Try one of these questions:</p>
      <div className="mt-3 flex flex-col gap-2">
        {cannedQueries.map((c, i) => (
          <button
            key={c.q}
            onClick={() => ask(i)}
            className="rounded-lg border border-white/12 bg-white/5 px-4 py-3 text-left text-sm text-ice-100 transition-colors hover:border-steel-400/50 hover:bg-white/10"
          >
            &ldquo;{c.q}&rdquo;
          </button>
        ))}
      </div>
      <div className="mt-4 min-h-[90px] rounded-xl bg-navy-900 p-4" aria-live="polite">
        {thinking && (
          <p className="flex items-center gap-2 text-sm text-silver-400">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              Analyzing purchasing, delivery, and budget data…
            </motion.span>
          </p>
        )}
        {active !== null && !thinking && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <p className="flex items-start gap-2 text-sm leading-relaxed text-ice-100">
              <Sparkles size={15} className="mt-1 shrink-0 text-steel-300" />
              {cannedQueries[active].a}
            </p>
          </motion.div>
        )}
        {active === null && !thinking && (
          <p className="text-sm italic text-silver-500">The answer will appear here.</p>
        )}
      </div>
    </WindowFrame>
  );
}
