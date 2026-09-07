"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Download, RotateCcw, Info } from "lucide-react";
import {
  calculateROI,
  roiDefaults,
  roiBounds,
  roiLabels,
  formatMoney,
  roiReportHTML,
  roiAssumptions,
  type ROIInputs,
} from "@/lib/roi";
import { track } from "@/lib/site";
export default function ROICalculator() {
  const [v, setV] = useState<ROIInputs>(roiDefaults),
    [notice, setNotice] = useState("");
  const used = useRef(false);
  const r = calculateROI(v);
  const update = (k: keyof ROIInputs, n: number) => {
    if (!used.current) {
      track("roi_calculator_used");
      used.current = true;
    }
    const [min, max] = roiBounds[k];
    setV((p) => ({
      ...p,
      [k]: Math.min(max, Math.max(min, Number.isFinite(n) ? n : min)),
    }));
  };
  const field = (k: keyof ROIInputs, help?: string) => (
    <div className="ci-field" key={k}>
      <label htmlFor={`roi-${k}`}>{roiLabels[k]}</label>
      <input
        type="number"
        id={`roi-${k}`}
        min={roiBounds[k][0]}
        max={roiBounds[k][1]}
        step={k === "hourlyCost" ? 0.5 : 1}
        value={v[k]}
        onChange={(e) => update(k, e.target.valueAsNumber)}
        aria-describedby={help ? `help-${k}` : undefined}
      />
      {help && <small id={`help-${k}`}>{help}</small>}
    </div>
  );
  const print = () => {
    const w = window.open("", "_blank", "width=850,height=950");
    if (!w) {
      setNotice(
        "Your browser blocked the report window. Allow pop-ups for this site and try again.",
      );
      return;
    }
    w.opener = null;
    w.document.write(roiReportHTML(v));
    w.document.close();
    track("roi_pdf_download");
    setNotice("Your report is open. Choose Print / save as PDF in the report.");
  };
  return (
    <section className="ci-section ci-paper" id="roi">
      <div className="ci-container ci-roi-layout">
        <div>
          <p className="ci-eyebrow">YOUR ASSUMPTIONS</p>
          <h2 className="ci-heading">
            Make the numbers
            <br />
            specific to your work.
          </h2>
          <p className="ci-body-copy">
            Start with a single process. Change the assumptions to see how the
            opportunity compares with the investment.
          </p>
          <div className="ci-roi-fields">
            <h3>The work today</h3>
            <div className="ci-field-grid">
              {field("employees")}
              {field("hourlyCost")}
              {field("weeklyHours")}
              {field("timeSavedPct")}
            </div>
            <h3>The investment</h3>
            <div className="ci-field-grid">
              {field(
                "projectCost",
                "Include your full implementation quote; do not add a credited Blueprint twice.",
              )}
              {field("implementationMonths")}
              {field("monthlySupport")}
              {field("monthlyThirdParty")}
            </div>
            <details className="ci-form-details">
              <summary>
                Cash savings & other benefits <span>Optional +</span>
              </summary>
              {field(
                "cashRealizationPct",
                "Leave at 0% unless freed time actually reduces paid costs. Capacity is still shown separately.",
              )}
              {field("monthlyReworkSavings")}
              {field(
                "retiredSoftwareSavings",
                "Only costs you will actually stop paying.",
              )}
              {field(
                "monthlyAddedContribution",
                "Use contribution profit after delivery costs, not gross sales.",
              )}
            </details>
            <button
              className="ci-text-link"
              onClick={() => {
                setV(roiDefaults);
                setNotice("Assumptions reset.");
              }}
            >
              <RotateCcw size={15} /> Reset assumptions
            </button>
          </div>
        </div>
        <div className="ci-roi-results">
          <p className="ci-eyebrow">ESTIMATED YEAR ONE</p>
          <h3>What could change?</h3>
          <div className="ci-roi-primary">
            <span>Net estimated benefit</span>
            <strong>{formatMoney(r.firstYearNetValue)}</strong>
            <p>
              Includes the value of freed capacity.
              <br />
              This is not automatically cash savings.
            </p>
          </div>
          <dl>
            <div>
              <dt>Capacity value</dt>
              <dd>{formatMoney(r.firstYearCapacityValue)}</dd>
            </div>
            <div>
              <dt>Project + recurring costs</dt>
              <dd>{formatMoney(r.firstYearCost)}</dd>
            </div>
            <div>
              <dt>Net estimated cash benefit</dt>
              <dd>{formatMoney(r.firstYearNetCash)}</dd>
            </div>
            <div>
              <dt>Months live in year one</dt>
              <dd>{r.activeMonths}</dd>
            </div>
            <div>
              <dt>Hours freed in a full operating year</dt>
              <dd>{Math.round(r.annualHours).toLocaleString()} hrs</dd>
            </div>
            <div>
              <dt>Economic payback from kickoff</dt>
              <dd>
                {r.economicPayback === null
                  ? "Not reached"
                  : `${r.economicPayback.toFixed(1)} months`}
              </dd>
            </div>
            <div>
              <dt>Cash payback from kickoff</dt>
              <dd>
                {r.cashPayback === null
                  ? "Not reached"
                  : `${r.cashPayback.toFixed(1)} months`}
              </dd>
            </div>
          </dl>
          <div className="ci-roi-explanation">
            <Info size={18} />
            <p>
              These are illustrative estimates based on your inputs. Actual
              adoption, costs, and results will vary.
            </p>
          </div>
          <button className="ci-btn" onClick={print}>
            <Download size={17} /> Print / save estimate as PDF
          </button>
          <Link href="/consultation" className="ci-text-link">
            Discuss these assumptions <ArrowUpRight size={16} />
          </Link>
          <p className="ci-roi-notice" role="status">
            {notice}
          </p>
        </div>
        <details className="ci-roi-assumptions">
          <summary>How this estimate is calculated</summary>
          <p>{roiAssumptions}</p>
          <p>
            Annual freed hours = people × manual hours per week × 52 × time
            reduction. First-year net estimated benefit = (monthly capacity
            value + other monthly benefits − monthly recurring costs) × months
            live in year one − project cost. Cash benefit replaces capacity
            value with the selected realized cash share. Payback requires a
            positive monthly net benefit.
          </p>
        </details>
      </div>
    </section>
  );
}
