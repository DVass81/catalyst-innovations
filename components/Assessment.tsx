"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, RefreshCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import { track } from "@/lib/site";

/**
 * "Find Your Best Starting Point" — scores answers against result categories.
 * Categories: custom | procurement | ai | manufacturing | supplychain |
 * dashboard | integration | roadmap
 */

type Cat = "custom" | "procurement" | "ai" | "manufacturing" | "supplychain" | "dashboard" | "integration" | "roadmap";

type Option = { label: string; scores: Partial<Record<Cat, number>> };
type Question = { q: string; options: Option[] };

const questions: Question[] = [
  {
    q: "What type of organization do you operate?",
    options: [
      { label: "Manufacturer or industrial operation", scores: { manufacturing: 3, supplychain: 1 } },
      { label: "Financial institution or credit union", scores: { procurement: 3, dashboard: 1 } },
      { label: "Contractor or field-service business", scores: { custom: 3 } },
      { label: "Professional services / office-based", scores: { custom: 2, ai: 1, dashboard: 1 } },
    ],
  },
  {
    q: "Which department has the greatest challenge?",
    options: [
      { label: "Purchasing / procurement", scores: { procurement: 3, supplychain: 1 } },
      { label: "Production / operations", scores: { manufacturing: 3 } },
      { label: "Administration / back office", scores: { custom: 2, ai: 2 } },
      { label: "Leadership — we lack visibility", scores: { dashboard: 3 } },
    ],
  },
  {
    q: "What is your biggest operational frustration?",
    options: [
      { label: "Manual paperwork and re-typing data", scores: { custom: 2, ai: 2 } },
      { label: "Slow approvals and weak controls", scores: { procurement: 3 } },
      { label: "We can't see what's happening in real time", scores: { dashboard: 3, manufacturing: 1 } },
      { label: "Supplier and delivery surprises", scores: { supplychain: 3 } },
    ],
  },
  {
    q: "How many employees are affected?",
    options: [
      { label: "A handful (1–10)", scores: { custom: 1, ai: 1 } },
      { label: "A department (11–50)", scores: { custom: 2, procurement: 1 } },
      { label: "Most of the company (51–200)", scores: { dashboard: 1, integration: 2 } },
      { label: "Multiple locations / 200+", scores: { integration: 2, dashboard: 2, roadmap: 1 } },
    ],
  },
  {
    q: "How are your processes primarily managed today?",
    options: [
      { label: "Mostly manual and paper", scores: { custom: 2, manufacturing: 1 } },
      { label: "Spreadsheets everywhere", scores: { custom: 2, dashboard: 1 } },
      { label: "Existing software that doesn't fit", scores: { integration: 2, custom: 1 } },
      { label: "Several systems that don't talk to each other", scores: { integration: 3 } },
    ],
  },
  {
    q: "What outcome matters most?",
    options: [
      { label: "Lower costs and less admin labor", scores: { ai: 2, custom: 1 } },
      { label: "Control and audit readiness", scores: { procurement: 3 } },
      { label: "Faster, better decisions", scores: { dashboard: 3 } },
      { label: "A clear long-term technology plan", scores: { roadmap: 3 } },
    ],
  },
  {
    q: "How quickly do you want to begin?",
    options: [
      { label: "As soon as possible", scores: { custom: 1, ai: 1 } },
      { label: "This quarter", scores: {} },
      { label: "We're planning ahead", scores: { roadmap: 2 } },
      { label: "Just exploring", scores: { roadmap: 1 } },
    ],
  },
];

const results: Record<Cat, { title: string; text: string }> = {
  custom: {
    title: "Custom Workflow Application",
    text: "Your biggest opportunity looks like a purpose-built application that replaces the manual and spreadsheet work at the heart of your operation — designed around how your team actually works.",
  },
  procurement: {
    title: "Procurement Transformation",
    text: "Your answers point to purchasing: approvals, controls, supplier management, and spend visibility. A modern, auditable procurement platform is likely your highest-return starting point.",
  },
  ai: {
    title: "AI & Automation Assessment",
    text: "Repetitive document handling, data entry, and follow-up are prime candidates for practical, human-supervised AI and automation. An assessment would identify the highest-value targets.",
  },
  manufacturing: {
    title: "Manufacturing Operations Platform",
    text: "Shop-floor visibility, work orders, quality, and traceability look like your leverage points. A connected operations platform would put the whole picture on one screen.",
  },
  supplychain: {
    title: "Supply-Chain Intelligence",
    text: "Supplier risk, lead times, and delivery surprises are costing you. Systems that watch these signals continuously would turn surprises into early warnings.",
  },
  dashboard: {
    title: "Executive Dashboard",
    text: "Leadership visibility is the gap. Real-time dashboards over your existing data would shorten the distance between what's happening and what you know.",
  },
  integration: {
    title: "System Integration",
    text: "You have systems — they just don't talk. Integrating them would eliminate double entry and give every department the same version of the truth.",
  },
  roadmap: {
    title: "Digital Transformation Roadmap",
    text: "The smartest first step for you is a structured assessment and roadmap: where you are, what's possible, what it's worth, and the order to do it in.",
  },
};

export default function Assessment() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const started = useRef(false);

  const done = answers.length === questions.length;

  function pick(optIdx: number) {
    if (!started.current) {
      started.current = true;
      track("assessment_start");
    }
    const next = [...answers.slice(0, step), optIdx];
    setAnswers(next);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      track("assessment_complete");
    }
  }

  function computeResult(): Cat {
    const totals: Record<Cat, number> = {
      custom: 0, procurement: 0, ai: 0, manufacturing: 0,
      supplychain: 0, dashboard: 0, integration: 0, roadmap: 0,
    };
    answers.forEach((optIdx, qIdx) => {
      const scores = questions[qIdx]?.options[optIdx]?.scores ?? {};
      for (const [k, v] of Object.entries(scores)) totals[k as Cat] += v ?? 0;
    });
    return (Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0] as Cat) ?? "roadmap";
  }

  if (done) {
    const cat = computeResult();
    const r = results[cat];
    const indKeys = ["manufacturing", "financial", "contractor", "professional"] as const;
    const ind = indKeys[answers[0]] ?? "professional";
    const consultHref = `/consultation?rec=${cat}&ind=${ind}`;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-card border border-ice-200 bg-white p-9 text-center shadow-card"
      >
        <Sparkles size={40} className="mx-auto text-steel-500" />
        <p className="mt-4 text-xs font-semibold tracking-[0.25em] text-steel-600 uppercase">
          Your recommended starting point
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">{r.title}</h2>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-navy-700">{r.text}</p>
        <p className="mx-auto mt-3 max-w-xl text-xs text-silver-500">
          This is a conversation starter based on your answers — not a binding professional
          diagnosis. The real diagnosis happens in the Discover stage.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={consultHref}
            onClick={() => track("cta_consultation_click", { location: "assessment_result" })}
            className="inline-flex min-h-[48px] items-center rounded-lg bg-steel-400 px-7 font-semibold text-white transition-colors hover:bg-steel-500"
          >
            Discuss this recommendation
          </Link>
          <button
            type="button"
            onClick={() => { setAnswers([]); setStep(0); }}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-ice-300 px-6 text-sm font-medium text-navy-800"
          >
            <RefreshCcw size={15} /> Start over
          </button>
        </div>
      </motion.div>
    );
  }

  const q = questions[step];
  return (
    <div className="rounded-card border border-ice-200 bg-white p-7 shadow-card sm:p-9">
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-semibold tracking-wide text-steel-600 uppercase">
          Question {step + 1} of {questions.length}
        </p>
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="inline-flex items-center gap-1 text-sm text-silver-500 hover:text-navy-800"
          >
            <ArrowLeft size={14} /> Back
          </button>
        )}
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ice-200" role="progressbar"
        aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={questions.length}>
        <motion.div
          className="h-full rounded-full bg-steel-400"
          animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="mt-6 font-display text-xl font-semibold text-navy-900 sm:text-2xl">{q.q}</h2>
          <div className="mt-6 grid gap-3">
            {q.options.map((o, i) => (
              <button
                key={o.label}
                type="button"
                onClick={() => pick(i)}
                className={`min-h-[56px] rounded-xl border px-5 py-4 text-left text-[0.95rem] font-medium transition-colors ${
                  answers[step] === i
                    ? "border-steel-400 bg-steel-400/10 text-navy-900"
                    : "border-ice-300 text-navy-800 hover:border-steel-400/60 hover:bg-ice-50"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
