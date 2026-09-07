"use client";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCheck, LoaderCircle } from "lucide-react";
import {
  consultationSchema,
  industryOptions,
  timelines,
  companySizes,
  type ConsultationData,
} from "@/lib/consultation";
import { site, track } from "@/lib/site";
export default function ConsultationForm({
  initial,
}: {
  initial?: Partial<ConsultationData>;
}) {
  const [values, setValues] = useState<Record<string, string>>({
    name: "",
    email: "",
    company: "",
    challenge: "",
    ...Object.fromEntries(
      Object.entries(initial ?? {}).filter(([, v]) => typeof v === "string"),
    ),
  });
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>(
      {},
    ),
    [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
      "idle",
    ),
    [message, setMessage] = useState("");
  const form = useRef<HTMLFormElement>(null),
    started = useRef(false),
    busy = useRef(false);
  const update = (key: string, value: string) => {
    if (!started.current) {
      track("form_start");
      started.current = true;
    }
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };
  const focusError = (fieldErrors: Record<string, string[] | undefined>) => {
    requestAnimationFrame(() => {
      const el = form.current?.elements.namedItem(Object.keys(fieldErrors)[0]);
      if (el instanceof HTMLElement) el.focus();
    });
  };
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy.current) return;
    const payload = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== ""),
    );
    const parsed = consultationSchema.safeParse(payload);
    if (!parsed.success) {
      const issue = parsed.error.flatten().fieldErrors;
      setErrors(issue);
      setMessage("Please check the highlighted fields.");
      setStatus("error");
      focusError(issue);
      return;
    }
    busy.current = true;
    setStatus("sending");
    setMessage("");
    setErrors({});
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        signal: AbortSignal.timeout(25000),
      });
      const data = await res.json().catch(() => ({
        ok: false,
        error:
          "Online inquiries are temporarily unavailable. Please email the team or use the booking calendar.",
      }));
      if (!res.ok || !data?.ok) {
        if (data?.issues) {
          setErrors(data.issues);
          focusError(data.issues);
        }
        throw new Error(
          data?.error || "Your request could not be sent. Please try again.",
        );
      }
      setStatus("success");
      track("form_complete", { source: values.demoContext || "direct" });
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error &&
          err.name !== "TimeoutError" &&
          err.name !== "TypeError"
          ? err.message
          : "We could not reach the inquiry service. Please try again or email us directly.",
      );
      track("form_error", { kind: "delivery" });
    } finally {
      busy.current = false;
    }
  }
  const field = (
    name: string,
    label: string,
    type = "text",
    required = false,
  ) => (
    <div className="ci-field">
      <label htmlFor={name}>
        {label}
        {!required && <span>Optional</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={values[name] || ""}
        onChange={(e) => update(name, e.target.value)}
        autoComplete={
          name === "name"
            ? "name"
            : name === "email"
              ? "email"
              : name === "company"
                ? "organization"
                : name === "phone"
                  ? "tel"
                  : undefined
        }
        maxLength={
          name === "email"
            ? 200
            : name === "company"
              ? 150
              : name === "phone"
                ? 30
                : name === "currentTools"
                  ? 1000
                  : 100
        }
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
      />
      {errors[name] && (
        <p id={`${name}-error`} className="ci-field-error">
          {errors[name]?.[0]}
        </p>
      )}
    </div>
  );
  const select = (name: string, label: string, options: readonly string[]) => (
    <div className="ci-field">
      <label htmlFor={name}>
        {label}
        <span>Optional</span>
      </label>
      <select
        id={name}
        name={name}
        value={values[name] || ""}
        onChange={(e) => update(name, e.target.value)}
      >
        <option value="">Select if useful</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
  if (status === "success")
    return (
      <div className="ci-form-success" role="status">
        <CheckCheck size={38} />
        <h2>Your request is on its way.</h2>
        <p>Thank you. We’ll review what you shared and follow up by email.</p>
        {site.schedulingUrl && (
          <a
            href={site.schedulingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ci-btn"
            onClick={() =>
              track("scheduling_click", { location: "confirmation" })
            }
          >
            Choose a time to talk <ArrowUpRight size={18} />
          </a>
        )}
        <Link href="/demo-lab" className="ci-text-link">
          Continue exploring the demos <ArrowUpRight size={16} />
        </Link>
      </div>
    );
  return (
    <form
      ref={form}
      className="ci-consultation-form"
      onSubmit={submit}
      noValidate
    >
      {(values.demoContext || values.scope) && (
        <p className="ci-context-note">
          Starting point:{" "}
          <strong>
            {(values.demoContext || values.scope).replaceAll("-", " ")}
          </strong>
          . Tell us how it relates to your business.
        </p>
      )}
      <div className="ci-field-grid">
        {field("name", "Your name", "text", true)}
        {field("email", "Email address", "email", true)}
        {field("company", "Company", "text", true)}
        {field("phone", "Phone", "tel")}
      </div>
      <div className="ci-field">
        <label htmlFor="challenge">What would you like to work better?</label>
        <textarea
          id="challenge"
          name="challenge"
          rows={5}
          minLength={10}
          maxLength={3000}
          required
          value={values.challenge}
          onChange={(e) => update("challenge", e.target.value)}
          placeholder="Tell us about the process, the problem, or the idea."
          aria-invalid={!!errors.challenge}
          aria-describedby={
            errors.challenge ? "challenge-error" : "challenge-hint"
          }
        />
        <small id="challenge-hint">
          Please leave out passwords, confidential records, and sensitive
          personal information.
        </small>
        {errors.challenge && (
          <p id="challenge-error" className="ci-field-error">
            {errors.challenge[0]}
          </p>
        )}
      </div>
      <details className="ci-form-details">
        <summary>
          Add a little more context <span>Optional +</span>
        </summary>
        <div className="ci-field-grid">
          {select("industry", "Industry", industryOptions)}
          {select("companySize", "Team size", companySizes)}
          {select("timeline", "Timeline", timelines)}
          {select("budget", "Project budget", [
            "Prefer not to say",
            "Under $5k",
            "$5k–$10k",
            "$12k–$30k",
            "$30k–$75k",
            "$75k+",
          ])}
        </div>
        {field("currentTools", "Tools you use today")}
      </details>
      <div className="ci-honeypot" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website || ""}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>
      <p className="ci-form-privacy">
        We use these details to respond to your inquiry.{" "}
        <Link href="/privacy">Read our privacy notice.</Link>
      </p>
      {message && (
        <p className="ci-form-error" role="alert">
          {message}{" "}
          {status === "error" && !Object.keys(errors).length && (
            <a href={`mailto:${site.contactEmail}`}>Email the team instead.</a>
          )}
        </p>
      )}
      <button type="submit" className="ci-btn" disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            <LoaderCircle size={18} className="ci-spinner" /> Sending your
            request…
          </>
        ) : (
          <>
            Send your request <ArrowUpRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
