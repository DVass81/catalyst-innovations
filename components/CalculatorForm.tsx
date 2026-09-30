"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { calculate, formatResult, type Calculator } from "@/lib/calculators";
import { track } from "@/lib/site";
export default function CalculatorForm({
  calculator: c,
  industry = "",
}: {
  calculator: Calculator;
  industry?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState(["cash"]);
  const [example, setExample] = useState(false);
  const [attach, setAttach] = useState(false);
  const [storageError, setStorageError] = useState("");
  const tracked = useRef(false);
  const router = useRouter();
  const calculation = calculate(c, values, selected);
  const change = (key: string, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (!tracked.current) {
      track("roi_calculator_used", { tool: c.slug });
      tracked.current = true;
    }
  };
  const summary = () =>
    `${c.title}\n${example ? "Based on an illustrative example, edited or accepted by the visitor.\n" : ""}${c.fields.map((f) => `${f.label}: ${values[f.key]?.trim() || "Not entered"} ${f.unit}`).join("\n")}${c.kind === "roi" ? `\nSelected benefit types: ${selected.join(", ") || "None"}` : ""}\n${calculation.results.map((r) => `${r.label}: ${formatResult(r)}`).join("\n")}\n${c.caveat}`;
  const inquiry = () => {
    const includeResults = attach && calculation.complete;
    if (includeResults) {
      try {
        sessionStorage.setItem(
          "catalyst-calculation",
          JSON.stringify({ tool: c.slug, summary: summary() }),
        );
      } catch {
        setStorageError(
          "Your browser could not attach these results. Uncheck the attachment option to continue without them.",
        );
        return;
      }
    }
    router.push(
      `/consultation?tool=${c.slug}${industry ? `&industry=${encodeURIComponent(industry)}` : ""}${includeResults ? "&attach=1" : ""}`,
    );
  };
  return (
    <div className="calculator-layout">
      <div>
        <div className="field-heading">
          <h2>Your numbers</h2>
          <div className="no-print">
            <button
              className="quiet-button"
              onClick={() => {
                setValues(
                  Object.fromEntries(
                    c.fields.map((f) => [f.key, String(f.example)]),
                  ),
                );
                setExample(true);
                setSelected(["cash"]);
              }}
            >
              Try an example
            </button>
            <span> · </span>
            <button
              className="quiet-button"
              onClick={() => {
                setValues({});
                setExample(false);
                setSelected(["cash"]);
              }}
            >
              Reset
            </button>
          </div>
        </div>
        {example && (
          <p className="calculation-warning" style={{ marginBottom: 24 }}>
            Illustrative example loaded. These figures are not industry
            benchmarks or a Catalyst quote.
          </p>
        )}
        <div className="calculator-fields">
          {c.fields.map((f) => (
            <div className="form-field" key={f.key}>
              <label className="field-label" htmlFor={f.key}>
                <span>{f.label}</span>
                <small>{f.unit}</small>
              </label>
              <input
                id={f.key}
                type="number"
                inputMode="decimal"
                min="0"
                max={f.max ?? 1e9}
                step="any"
                value={values[f.key] ?? ""}
                placeholder="Enter your figure"
                onChange={(e) => change(f.key, e.target.value)}
                aria-invalid={!!calculation.errors[f.key]}
                aria-describedby={
                  calculation.errors[f.key] ? `${f.key}-error` : undefined
                }
              />
              {calculation.errors[f.key] && (
                <span className="field-error" id={`${f.key}-error`}>
                  {calculation.errors[f.key]}
                </span>
              )}
              {c.kind === "roi" &&
                ["cash", "capacity", "contribution"].includes(f.key) && (
                  <label className="benefit-toggle">
                    <input
                      type="checkbox"
                      checked={selected.includes(f.key)}
                      onChange={(e) =>
                        setSelected((s) =>
                          e.target.checked
                            ? [...s, f.key]
                            : s.filter((k) => k !== f.key),
                        )
                      }
                    />
                    Include {f.label.toLowerCase()} in the estimate
                    {f.key === "capacity" ? " (not cash savings)" : ""}
                  </label>
                )}
            </div>
          ))}
        </div>
        <div className="calculator-explanation">
          <h2>How the math works</h2>
          <p>{c.formula}</p>
          <h2>Keep in mind</h2>
          <p>{c.caveat}</p>
          <p>
            All figures use USD. Your inputs stay in this browser unless you
            choose to attach them to an inquiry. Related tools may measure
            overlapping benefits; do not simply add their totals.
          </p>
        </div>
      </div>
      <aside className="results-card">
        <p className="overline">An estimate. A better starting point.</p>
        <h2>Your results</h2>
        <div aria-live="polite" aria-atomic="true">
          {calculation.complete ? (
            <dl
              className="results-update"
              key={JSON.stringify(calculation.results)}
            >
              {calculation.results.map((r) => (
                <div key={r.label}>
                  <dt>{r.label}</dt>
                  <dd>{formatResult(r)}</dd>
                  {r.note && <small>{r.note}</small>}
                </div>
              ))}
            </dl>
          ) : (
            <p className="empty-results">
              Enter all required figures to see your estimate. Zero is a valid
              input. Optional fields can be left blank.
            </p>
          )}
        </div>
        <div className="result-actions no-print">
          {calculation.complete && (
            <>
              <button
                className="button button-outline"
                onClick={() => {
                  track("roi_pdf_download", { tool: c.slug });
                  window.print();
                }}
              >
                Print / save as PDF
              </button>
              <label className="benefit-toggle" style={{ color: "#d5e0e9" }}>
                <input
                  type="checkbox"
                  checked={attach}
                  onChange={(e) => setAttach(e.target.checked)}
                />
                Attach these inputs and results to my inquiry
              </label>
            </>
          )}
          <button className="button button-light" onClick={inquiry}>
            Discuss my business ↗
          </button>
          {storageError && <p role="alert">{storageError}</p>}
          <Link
            className="quiet-button"
            style={{ color: "#c7dff4" }}
            href="/tools"
          >
            Explore other calculators
          </Link>
        </div>
        <small>
          Estimates are based on your assumptions and are not guaranteed
          outcomes.
        </small>
      </aside>
    </div>
  );
}
