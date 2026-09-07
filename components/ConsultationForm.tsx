"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import {
  consultationSchema, inquiryTypes, industryOptions, companySizes, timelines,
  budgets, contactMethods, type ConsultationData,
} from "@/lib/consultation";
import { site, track } from "@/lib/site";
import { CatalystMark } from "./Logo";

type Errors = Partial<Record<keyof ConsultationData, string>>;

const empty: ConsultationData = {
  inquiryType: "Request a consultation",
  name: "", company: "", jobTitle: "", email: "", phone: "",
  industry: "Manufacturing", companySize: "11–50",
  challenge: "", currentTools: "", desiredOutcome: "",
  timeline: "Exploring options", budget: "Prefer not to say",
  contactMethod: "Email", details: "", website: "",
};

const stepFields: (keyof ConsultationData)[][] = [
  ["inquiryType"],
  ["name", "company", "jobTitle", "email", "phone"],
  ["industry", "companySize", "challenge", "currentTools"],
  ["desiredOutcome", "timeline", "budget", "contactMethod", "details"],
];

const stepTitles = ["What brings you here?", "About you", "About your operation", "Goals & logistics"];

const DRAFT_KEY = "ci-consultation-draft";

// Dark/glow theme — continues the portal's "step through the door" moment
// into the highest-value conversion point on the site instead of dropping
// into generic light UI.
const inputCls =
  "w-full rounded-lg border border-white/15 bg-navy-950/50 px-4 py-3 text-[0.95rem] text-white placeholder:text-silver-500 focus:border-steel-400 min-h-[48px]";
const labelCls = "block text-sm font-medium text-ice-200 mb-1.5";
const errCls = "mt-1.5 text-sm text-[#ff8a8a]";

export default function ConsultationForm({
  initial,
}: {
  /** Prefill (e.g. carried over from the starting-point assessment). */
  initial?: Partial<ConsultationData>;
}) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ConsultationData>({ ...empty, ...initial });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [restored, setRestored] = useState(false);
  const started = useRef(false);
  const liveRef = useRef<HTMLParagraphElement>(null);

  // Autosave: recover an in-progress draft if the tab closed accidentally.
  // Only runs once on mount, and only when no explicit prefill was passed in
  // (an assessment-driven prefill always wins over an older saved draft).
  useEffect(() => {
    if (initial) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as { data: ConsultationData; step: number };
      if (draft?.data?.name || draft?.data?.challenge) {
        // One-time hydration-safe recovery from localStorage — a genuine
        // external-system read that can only happen client-side post-mount.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData(draft.data);
        setStep(Math.min(draft.step ?? 0, stepFields.length - 1));
        setRestored(true);
      }
    } catch {
      /* corrupt/old draft — ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === "done") {
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {}
      return;
    }
    const hasContent = data.name || data.company || data.challenge;
    if (!hasContent) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ data, step }));
    } catch {
      /* storage full/unavailable — autosave just won't persist */
    }
  }, [data, step, status]);

  const set = <K extends keyof ConsultationData>(k: K, v: ConsultationData[K]) => {
    if (!started.current) {
      started.current = true;
      track("form_start");
    }
    setData((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const progress = useMemo(() => ((step + 1) / stepFields.length) * 100, [step]);

  function validateStep(): boolean {
    const fields = stepFields[step];
    const result = consultationSchema.safeParse(data);
    if (result.success) return true;
    const flat = result.error.flatten().fieldErrors;
    const relevant: Errors = {};
    for (const f of fields) {
      const msg = (flat as Record<string, string[] | undefined>)[f]?.[0];
      if (msg) relevant[f] = msg;
    }
    setErrors(relevant);
    return Object.keys(relevant).length === 0;
  }

  function next() {
    if (!validateStep()) return;
    track("form_step", { step: step + 2 });
    setStep((s) => Math.min(s + 1, stepFields.length - 1));
  }

  async function submit() {
    if (!validateStep()) return;
    setStatus("submitting");
    setServerError("");
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Submission failed.");
      setStatus("done");
      track("form_complete");
    } catch (e) {
      setStatus("error");
      setServerError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div
        className="relative overflow-hidden rounded-card border border-steel-400/30 bg-navy-900 p-10 text-center shadow-card-dark"
        role="status"
      >
        <div className="bg-grid-dark absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative">
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
            <span aria-hidden="true" className="gate-breathe absolute inset-0 rounded-full bg-steel-400/30 blur-xl" />
            <CatalystMark size={48} />
          </div>
          <h2 className="mt-6 font-grotesk text-2xl font-semibold text-white">You&apos;re through.</h2>
          <p className="mx-auto mt-3 max-w-md text-ice-300">
            Thank you, {data.name.split(" ")[0]}. We&apos;ll review your request and reach out
            by {data.contactMethod.toLowerCase()} — usually within one business day.
          </p>
          {site.schedulingUrl && (
            <a
              href={site.schedulingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-[48px] items-center rounded-lg bg-steel-400 px-7 font-semibold text-white transition-colors hover:bg-steel-500"
            >
              Skip the wait — book a time now
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (step === stepFields.length - 1) submit();
        else next();
      }}
      className="relative overflow-hidden rounded-card border border-white/12 bg-navy-900 p-6 shadow-card-dark sm:p-9"
    >
      <div className="bg-grid-dark absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative">
        {restored && (
          <p className="mb-5 rounded-lg border border-steel-400/30 bg-steel-400/10 px-4 py-2.5 text-xs text-ice-200">
            Picked up where you left off — your progress is saved automatically.
          </p>
        )}

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-baseline justify-between">
            <p className="font-display text-sm font-semibold text-white">
              Step {step + 1} of {stepFields.length} — {stepTitles[step]}
            </p>
            <p className="text-xs text-silver-400">{Math.round(progress)}%</p>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-steel-500 to-[#7dd3fc]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35 }}
            />
          </div>
        </div>

        {/* Honeypot — hidden from real users and screen readers */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="hp-website">Website</label>
          <input
            id="hp-website" type="text" tabIndex={-1} autoComplete="off"
            value={data.website ?? ""} onChange={(e) => set("website", e.target.value)}
          />
        </div>

        {/*
          NOTE: framer-motion's <AnimatePresence mode="wait"> here reproducibly
          desynced the progress header from the actual step content in manual
          browser testing (confirmed pre-existing, not introduced by later
          edits — reproduced against the original committed version too, and
          persisted through a full dev-server + cache restart, ruling out
          HMR staleness). Swapped for a plain CSS fade-in — correctness over
          a slide transition on the site's primary conversion form.
        */}
        <div key={step} className="animate-[fadeIn_0.25s_ease-out] space-y-5">
            {step === 0 && (
              <fieldset>
                <legend className="sr-only">Type of inquiry</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {inquiryTypes.map((t) => (
                    <label
                      key={t}
                      className={`flex min-h-[56px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                        data.inquiryType === t
                          ? "border-steel-400 bg-steel-400/15 text-white"
                          : "border-white/15 text-ice-200 hover:border-steel-400/50"
                      }`}
                    >
                      <input
                        type="radio" name="inquiryType" value={t}
                        checked={data.inquiryType === t}
                        onChange={() => set("inquiryType", t)}
                        className="accent-steel-500"
                      />
                      {t}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="f-name" className={labelCls}>Name *</label>
                    <input id="f-name" className={inputCls} autoComplete="name" value={data.name}
                      onChange={(e) => set("name", e.target.value)}
                      aria-invalid={!!errors.name} aria-describedby={errors.name ? "e-name" : undefined} />
                    {errors.name && <p id="e-name" className={errCls}>{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="f-company" className={labelCls}>Company *</label>
                    <input id="f-company" className={inputCls} autoComplete="organization" value={data.company}
                      onChange={(e) => set("company", e.target.value)}
                      aria-invalid={!!errors.company} aria-describedby={errors.company ? "e-company" : undefined} />
                    {errors.company && <p id="e-company" className={errCls}>{errors.company}</p>}
                  </div>
                  <div>
                    <label htmlFor="f-title" className={labelCls}>Job title</label>
                    <input id="f-title" className={inputCls} autoComplete="organization-title" value={data.jobTitle ?? ""}
                      onChange={(e) => set("jobTitle", e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="f-email" className={labelCls}>Email *</label>
                    <input id="f-email" type="email" className={inputCls} autoComplete="email" value={data.email}
                      onChange={(e) => set("email", e.target.value)}
                      aria-invalid={!!errors.email} aria-describedby={errors.email ? "e-email" : undefined} />
                    {errors.email && <p id="e-email" className={errCls}>{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="f-phone" className={labelCls}>Phone</label>
                    <input id="f-phone" type="tel" className={inputCls} autoComplete="tel" value={data.phone ?? ""}
                      onChange={(e) => set("phone", e.target.value)} />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="f-industry" className={labelCls}>Industry *</label>
                    <select id="f-industry" className={inputCls} value={data.industry}
                      onChange={(e) => set("industry", e.target.value as ConsultationData["industry"])}>
                      {industryOptions.map((o) => <option key={o} className="bg-navy-900">{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="f-size" className={labelCls}>Company size *</label>
                    <select id="f-size" className={inputCls} value={data.companySize}
                      onChange={(e) => set("companySize", e.target.value as ConsultationData["companySize"])}>
                      {companySizes.map((o) => <option key={o} className="bg-navy-900">{o} employees</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="f-challenge" className={labelCls}>Primary challenge *</label>
                  <textarea id="f-challenge" rows={4} className={inputCls} value={data.challenge}
                    placeholder="What process, department, or problem is costing you the most time or money?"
                    onChange={(e) => set("challenge", e.target.value)}
                    aria-invalid={!!errors.challenge} aria-describedby={errors.challenge ? "e-challenge" : undefined} />
                  {errors.challenge && <p id="e-challenge" className={errCls}>{errors.challenge}</p>}
                </div>
                <div>
                  <label htmlFor="f-tools" className={labelCls}>Current tools or systems</label>
                  <input id="f-tools" className={inputCls} value={data.currentTools ?? ""}
                    placeholder="e.g. spreadsheets, QuickBooks, a legacy ERP…"
                    onChange={(e) => set("currentTools", e.target.value)} />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <label htmlFor="f-outcome" className={labelCls}>Desired outcome</label>
                  <textarea id="f-outcome" rows={3} className={inputCls} value={data.desiredOutcome ?? ""}
                    placeholder="What would success look like six months from now?"
                    onChange={(e) => set("desiredOutcome", e.target.value)} />
                </div>
                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label htmlFor="f-timeline" className={labelCls}>Estimated timeline *</label>
                    <select id="f-timeline" className={inputCls} value={data.timeline}
                      onChange={(e) => set("timeline", e.target.value as ConsultationData["timeline"])}>
                      {timelines.map((o) => <option key={o} className="bg-navy-900">{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="f-budget" className={labelCls}>Budget range (optional)</label>
                    <select id="f-budget" className={inputCls} value={data.budget}
                      onChange={(e) => set("budget", e.target.value as NonNullable<ConsultationData["budget"]>)}>
                      {budgets.map((o) => <option key={o} className="bg-navy-900">{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="f-contact" className={labelCls}>Preferred contact *</label>
                    <select id="f-contact" className={inputCls} value={data.contactMethod}
                      onChange={(e) => set("contactMethod", e.target.value as ConsultationData["contactMethod"])}>
                      {contactMethods.map((o) => <option key={o} className="bg-navy-900">{o}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="f-details" className={labelCls}>Additional details</label>
                  <textarea id="f-details" rows={3} className={inputCls} value={data.details ?? ""}
                    onChange={(e) => set("details", e.target.value)} />
                </div>
                <p className="text-xs leading-relaxed text-silver-400">
                  By submitting, you agree we may contact you about your inquiry. We don&apos;t
                  sell your information. See our <a href="/privacy" className="text-steel-300 underline">privacy policy</a>.
                </p>
              </>
            )}
        </div>

        {status === "error" && (
          <p ref={liveRef} role="alert" className="mt-5 rounded-lg bg-[#cc4b4b]/15 px-4 py-3 text-sm text-[#ff8a8a]">
            {serverError}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || status === "submitting"}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-white/15 px-5 text-sm font-medium text-ice-200 disabled:opacity-40"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-steel-400 px-7 text-sm font-semibold text-white transition-colors hover:bg-steel-500 disabled:opacity-60"
          >
            {status === "submitting" ? (
              <><Loader2 size={16} className="animate-spin" /> Submitting…</>
            ) : step === stepFields.length - 1 ? (
              <>Step through <CheckCircle2 size={16} /></>
            ) : (
              <>Continue <ArrowRight size={16} /></>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
