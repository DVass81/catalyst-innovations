"use client";
import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { industryList } from "@/data/redesign";
import { track } from "@/lib/site";
import BookingLink from "./BookingLink";
import { struggleCategories } from "@/lib/consultation";
const subscribe = () => () => {};
const serverSnapshot = () => null;
const readSnapshot = () => {
  try {
    return sessionStorage.getItem("catalyst-calculation");
  } catch {
    return null;
  }
};
export default function InquiryForm({
  industry = "",
  tool,
  attach = false,
  demo,
}: {
  industry?: string;
  tool?: string;
  attach?: boolean;
  demo?: "hoa" | "flooring" | "painting";
}) {
  const savedRaw = useSyncExternalStore(
    subscribe,
    readSnapshot,
    serverSnapshot,
  );
  let attachment = "";
  try {
    const saved = savedRaw ? JSON.parse(savedRaw) : null;
    if (
      attach &&
      saved?.tool === tool &&
      typeof saved?.summary === "string" &&
      saved.summary.length <= 5000
    )
      attachment = saved.summary;
  } catch {}
  const [include, setInclude] = useState(attach);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [issues, setIssues] = useState<Record<string, string[]>>({});
  const router = useRouter();
  const started = useRef(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    setIssues({});
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form);
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          inquiryType: "Request a consultation",
          sourceTool: tool,
          sourceDemo: demo,
          struggleCategories: form.getAll("struggleCategories"),
          calculatorSummary: include ? attachment : undefined,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setIssues(result.issues ?? {});
        throw new Error(
          result.error ?? "Your request could not be sent. Please try again.",
        );
      }
      setSuccess(true);
      track("form_complete", { source: tool ? "calculator" : "inquiry" });
      if (include) {
        try {
          sessionStorage.removeItem("catalyst-calculation");
        } catch {}
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Your request could not be sent. Please try again.",
      );
    } finally {
      setPending(false);
    }
  }
  if (success)
    return (
      <div className="success-panel" role="status">
        <p className="overline">Request received</p>
        <h2>Thanks for telling us about your business.</h2>
        <p style={{ marginTop: 20 }}>
          We’ll review your request and contact you about the next step.
        </p>
        <BookingLink />
        <button className="quiet-button" onClick={() => router.push("/tools")}>
          Explore the savings tools
        </button>
      </div>
    );
  return (
    <form
      className="inquiry-form"
      onSubmit={submit}
      onFocusCapture={() => {
        if (!started.current) {
          track("form_start");
          started.current = true;
        }
      }}
    >
      <div className="form-grid">
        {[
          {
            name: "name",
            label: "Your name",
            type: "text",
            max: 100,
            auto: "name",
          },
          {
            name: "email",
            label: "Email address",
            type: "email",
            max: 200,
            auto: "email",
          },
        ].map((f) => (
          <div className="form-field" key={f.name}>
            <label htmlFor={f.name}>{f.label} *</label>
            <input
              id={f.name}
              name={f.name}
              type={f.type}
              required
              maxLength={f.max}
              autoComplete={f.auto}
              aria-invalid={!!issues[f.name]}
              aria-describedby={issues[f.name] ? `${f.name}-error` : undefined}
            />
            {issues[f.name] && (
              <span id={`${f.name}-error`} className="field-error">
                {issues[f.name].join(" ")}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="form-field">
        <label htmlFor="company">Business or organization *</label>
        <input
          id="company"
          name="company"
          required
          maxLength={150}
          autoComplete="organization"
          aria-invalid={!!issues.company}
          aria-describedby={issues.company ? "company-error" : undefined}
        />
        {issues.company && (
          <span id="company-error" className="field-error">
            {issues.company.join(" ")}
          </span>
        )}
      </div>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="industry">Industry (optional)</label>
          <select id="industry" name="industry" defaultValue={industry}>
            <option value="">Choose an industry</option>
            {industryList.map((i) => (
              <option key={i.slug} value={i.name}>
                {i.name}
              </option>
            ))}
            <option>Other</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="phone">Phone (optional)</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
          />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="challenge">What would you like to make easier? *</label>
        <textarea
          id="challenge"
          name="challenge"
          required
          minLength={10}
          maxLength={3000}
          placeholder="Tell us about the process, problem or idea…"
          aria-invalid={!!issues.challenge}
          aria-describedby={
            issues.challenge
              ? "challenge-hint challenge-error"
              : "challenge-hint"
          }
        />
        <small id="challenge-hint">
          A few sentences are plenty. Please don’t include passwords or
          confidential customer records.
        </small>
        {issues.challenge && (
          <span id="challenge-error" className="field-error">
            {issues.challenge.join(" ")}
          </span>
        )}
      </div>
      <fieldset className="struggle-options">
        <legend>Where does work get stuck? (optional)</legend>
        {struggleCategories.map((label) => (
          <label key={label}>
            <input type="checkbox" name="struggleCategories" value={label} />
            {label}
          </label>
        ))}
      </fieldset>
      <div className="form-field">
        <label htmlFor="currentTools">
          What tools do you use now? (optional)
        </label>
        <input
          id="currentTools"
          name="currentTools"
          maxLength={1000}
          placeholder="Spreadsheets, accounting software, paper…"
        />
      </div>
      <div className="form-field">
        <label htmlFor="desiredOutcome">
          What would a better day look like? (optional)
        </label>
        <textarea id="desiredOutcome" name="desiredOutcome" maxLength={2000} />
      </div>
      {demo && (
        <p>
          You’re asking about the {demo === "hoa" ? "community" : demo}{" "}
          demonstration.
        </p>
      )}
      <div
        style={{ position: "absolute", left: "-10000px" }}
        aria-hidden="true"
      >
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {attachment && (
        <div className="attachment">
          <label className="benefit-toggle">
            <input
              type="checkbox"
              checked={include}
              onChange={(e) => setInclude(e.target.checked)}
            />
            Include my calculator inputs and results
          </label>
          <details>
            <summary>Review the information being attached</summary>
            <p>{attachment}</p>
          </details>
        </div>
      )}
      {attach && !attachment && (
        <p>
          Your calculation could not be loaded. You can still send your inquiry
          without it.
        </p>
      )}
      {tool && <p>Inquiry context: {tool.replaceAll("-", " ")} calculator.</p>}
      {error && (
        <p role="alert" className="field-error">
          {error}
        </p>
      )}
      <button className="button" disabled={pending} type="submit">
        {pending ? "Sending…" : "Discuss my business ↗"}
      </button>
      <p>
        By submitting, you ask Catalyst to contact you about this inquiry.{" "}
        <a href="/privacy" className="quiet-button">
          Privacy policy
        </a>
      </p>
    </form>
  );
}
