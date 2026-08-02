"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import {
  consultationSchema, inquiryTypes, industryOptions, companySizes, timelines,
  budgets, contactMethods, type ConsultationData,
} from "@/lib/consultation";
import { site, track } from "@/lib/site";

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

const inputCls =
  "w-full rounded-lg border border-ice-300 bg-white px-4 py-3 text-[0.95rem] text-navy-900 placeholder:text-silver-400 focus:border-steel-400 min-h-[48px]";
const labelCls = "block text-sm font-medium text-navy-800 mb-1.5";
const errCls = "mt-1.5 text-sm text-danger";

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
  const started = useRef(false);
  const liveRef = useRef<HTMLParagraphElement>(null);

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
      <div className="rounded-card border border-ice-200 bg-white p-10 text-center shadow-card" role="status">
        <CheckCircle2 size={52} className="mx-auto text-success" />
        <h2 className="mt-5 font-display text-2xl font-semibold text-navy-900">Request received.</h2>
        <p className="mx-auto mt-3 max-w-md text-navy-700">
          Thank you, {data.name.split(" ")[0]}. We&apos;ll review your submission and reach out
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
      className="rounded-card border border-ice-200 bg-white p-6 shadow-card sm:p-9"
    >
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-baseline justify-between">
          <p className="font-display text-sm font-semibold text-navy-900">
            Step {step + 1} of {stepFields.length} — {stepTitles[step]}
          </p>
          <p className="text-xs text-silver-500">{Math.round(progress)}%</p>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ice-200" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <motion.div
            className="h-full rounded-full bg-steel-400"
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

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
          className="space-y-5"
        >
          {step === 0 && (
            <fieldset>
              <legend className="sr-only">Type of inquiry</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {inquiryTypes.map((t) => (
                  <label
                    key={t}
                    className={`flex min-h-[56px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                      data.inquiryType === t
                        ? "border-steel-400 bg-steel-400/10 text-navy-900"
                        : "border-ice-300 text-navy-800 hover:border-steel-400/50"
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
                    {industryOptions.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="f-size" className={labelCls}>Company size *</label>
                  <select id="f-size" className={inputCls} value={data.companySize}
                    onChange={(e) => set("companySize", e.target.value as ConsultationData["companySize"])}>
                    {companySizes.map((o) => <option key={o}>{o} employees</option>)}
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
                    {timelines.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="f-budget" className={labelCls}>Budget range (optional)</label>
                  <select id="f-budget" className={inputCls} value={data.budget}
                    onChange={(e) => set("budget", e.target.value as NonNullable<ConsultationData["budget"]>)}>
                    {budgets.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="f-contact" className={labelCls}>Preferred contact *</label>
                  <select id="f-contact" className={inputCls} value={data.contactMethod}
                    onChange={(e) => set("contactMethod", e.target.value as ConsultationData["contactMethod"])}>
                    {contactMethods.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="f-details" className={labelCls}>Additional details</label>
                <textarea id="f-details" rows={3} className={inputCls} value={data.details ?? ""}
                  onChange={(e) => set("details", e.target.value)} />
              </div>
              <p className="text-xs leading-relaxed text-silver-500">
                By submitting, you agree we may contact you about your inquiry. We don&apos;t
                sell your information. See our <a href="/privacy" className="underline">privacy policy</a>.
              </p>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {status === "error" && (
        <p ref={liveRef} role="alert" className="mt-5 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
          {serverError}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || status === "submitting"}
          className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-ice-300 px-5 text-sm font-medium text-navy-800 disabled:opacity-40"
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
            <>Submit request <CheckCircle2 size={16} /></>
          ) : (
            <>Continue <ArrowRight size={16} /></>
          )}
        </button>
      </div>
    </form>
  );
}
