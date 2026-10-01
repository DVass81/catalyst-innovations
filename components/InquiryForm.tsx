"use client";
import { inquiryEmailDraft } from "@/lib/inquiryEmail";
import Link from "next/link";
import { startingPoints } from "@/data/startingPoints";
import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { industryList } from "@/data/redesign";
import { track } from "@/lib/site";
import BookingLink from "./BookingLink";
import { consultationSchema, struggleCategories } from "@/lib/consultation";
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
  problem,
  deliveryConfigured = true,
}: {
  deliveryConfigured?: boolean;
  problem?: string;
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
  const [emailDraft, setEmailDraft] = useState<ReturnType<
    typeof inquiryEmailDraft
  > | null>(null);
  const [copyMessage, setCopyMessage] = useState("");
  const draftHeading = useRef<HTMLHeadingElement>(null);
  const selectedProblem = startingPoints.find((p) => p.id === problem);
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const [receipt, setReceipt] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
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
    if (!deliveryConfigured) {
      const parsed = consultationSchema.safeParse({
        ...data,
        struggleCategories: form.getAll("struggleCategories"),
      });
      if (!parsed.success) {
        setIssues(parsed.error.flatten().fieldErrors);
        setError("Please check the highlighted fields.");
        setPending(false);
        requestAnimationFrame(() => errorRef.current?.focus());
        return;
      }
      setEmailDraft(
        inquiryEmailDraft(parsed.data, {
          tool,
          demo,
          summary: include ? attachment : undefined,
        }),
      );
      setCopyMessage("");
      setPending(false);
      requestAnimationFrame(() => draftHeading.current?.focus());
      return;
    }
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
      setReceipt(
        Object.fromEntries(
          [
            "name",
            "email",
            "company",
            "challenge",
            "industry",
            "phone",
            "currentTools",
            "desiredOutcome",
          ].map((key) => [key, String(form.get(key) ?? "")]),
        ),
      );
      setSuggestions(form.getAll("struggleCategories").map(String));
      setSuccess(true);
      track("form_complete", { source: tool ? "calculator" : "inquiry" });
      if (include) {
        try {
          sessionStorage.removeItem("catalyst-calculation");
        } catch {}
      }
    } catch (err) {
      track("form_error", {
        source: tool ? "calculator" : demo ? "demo" : "inquiry",
      });
      requestAnimationFrame(() => errorRef.current?.focus());
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
        <dl className="submitted-summary">
          {[
            ["Business", receipt.company],
            ["Contact", `${receipt.name} · ${receipt.email}`],
            ["Your main struggle", receipt.challenge],
            ["Industry", receipt.industry],
            ["Current tools", receipt.currentTools],
            ["Desired improvement", receipt.desiredOutcome],
          ]
            .filter(([, v]) => v)
            .map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          {suggestions.length > 0 && (
            <div>
              <dt>Selected challenges</dt>
              <dd>{suggestions.join(", ")}</dd>
            </div>
          )}
          {include && attachment && (
            <div>
              <dt>Attached calculation</dt>
              <dd>{attachment}</dd>
            </div>
          )}
        </dl>
        <h3>While you’re here</h3>
        <p>
          Based on the challenges you selected, these may be useful places to
          explore:
        </p>
        <div className="recommended-tools">
          {(startingPoints.filter((p) => suggestions.includes(p.category))
            .length
            ? startingPoints.filter((p) => suggestions.includes(p.category))
            : [selectedProblem ?? startingPoints[4]]
          )
            .slice(0, 3)
            .map((p) => (
              <Link
                key={p.id}
                href={`/tools/${p.tool}${receipt.industry ? `?industry=${industryList.find((i) => i.name === receipt.industry)?.slug ?? ""}` : ""}`}
              >
                {p.label} calculator ↗
              </Link>
            ))}
        </div>
        <BookingLink />
        <button className="quiet-button" onClick={() => router.push("/tools")}>
          Explore the savings tools
        </button>
      </div>
    );
  return (
    <form
      ref={formRef}
      className="inquiry-form"
      onSubmit={submit}
      onChange={() => {
        if (emailDraft) setEmailDraft(null);
      }}
      onFocusCapture={() => {
        if (!started.current) {
          track("form_start");
          started.current = true;
        }
      }}
    >
      {!deliveryConfigured && (
        <p className="inquiry-context">
          Tell us a little about your business, then send the prepared inquiry
          from your email app. Nothing is sent until you send that email.
        </p>
      )}
      {(industry || selectedProblem) && (
        <p className="inquiry-context">
          Your starting point:{" "}
          {[industry, selectedProblem?.label].filter(Boolean).join(" · ")}. You
          can change the optional details below.
        </p>
      )}
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
      <details className="optional-questions">
        <summary>Tell us a little more (optional)</summary>
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
        <fieldset className="struggle-options">
          <legend>Where does work get stuck? (optional)</legend>
          {struggleCategories.map((label) => (
            <label key={label}>
              <input
                type="checkbox"
                name="struggleCategories"
                value={label}
                defaultChecked={label === selectedProblem?.category}
              />
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
          <textarea
            id="desiredOutcome"
            name="desiredOutcome"
            maxLength={2000}
          />
        </div>
      </details>
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
        <p ref={errorRef} tabIndex={-1} role="alert" className="field-error">
          {error}
        </p>
      )}
      <button className="button" disabled={pending} type="submit">
        {pending
          ? "Sending…"
          : deliveryConfigured
            ? "Discuss my business ↗"
            : "Prepare my email inquiry ↗"}
      </button>
      {emailDraft && (
        <section
          className="submitted-summary"
          aria-labelledby="email-draft-title"
        >
          <h2 id="email-draft-title" ref={draftHeading} tabIndex={-1}>
            Your email draft is ready.
          </h2>
          <p>
            This has not been sent.{" "}
            {emailDraft.copyRequired
              ? "Copy the details below, open your email app, and paste them into the message to Daniel."
              : "Open your email app, review the message and press Send to reach Daniel."}
          </p>
          <label htmlFor="email-draft-copy">Your inquiry details</label>
          <textarea
            id="email-draft-copy"
            readOnly
            value={emailDraft.body}
            rows={8}
          />
          <div className="demo-actions">
            <button
              type="button"
              className="quiet-button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(emailDraft.body);
                  setCopyMessage(
                    "Copied. Paste these details into your email.",
                  );
                } catch {
                  setCopyMessage(
                    "Select and copy the text above, then paste it into your email.",
                  );
                }
              }}
            >
              Copy inquiry
            </button>
            <a
              className="button"
              href={emailDraft.href}
              onClick={() => track("email_click", { source: "inquiry_draft" })}
            >
              Open email app ↗
            </a>
          </div>
          <p role="status">{copyMessage}</p>
          <p>
            If an email app does not open, copy the details and send them to
            daniel@mycatalystinnovations.com.
          </p>
        </section>
      )}
      <p>
        By submitting, you ask Catalyst to contact you about this inquiry.{" "}
        <a href="/privacy" className="quiet-button">
          Privacy policy
        </a>
      </p>
    </form>
  );
}
