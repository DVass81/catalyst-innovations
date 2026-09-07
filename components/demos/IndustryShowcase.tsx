"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  ChevronRight,
  Circle,
  Factory,
  FileCheck2,
  RotateCcw,
  ShieldCheck,
  Truck,
  Users,
  AlertCircle,
} from "lucide-react";
import {
  demoDetails,
  demoIndustries,
  hasScheduleConflict,
  type DemoIndustry,
} from "@/lib/demo";
import { usePurchases } from "./DemoProvider";
import { track } from "@/lib/site";
const money = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="ci-demo-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function ManufacturingDemo() {
  const { purchases, decide, reset } = usePurchases();
  const [returnId, setReturnId] = useState<string | null>(null),
    [reason, setReason] = useState(""),
    [message, setMessage] = useState("");
  const approved = purchases.filter((p) => p.status === "approved"),
    pending = purchases.filter((p) => p.status === "pending");
  const act = (id: string, status: "approved" | "returned") => {
    if (status === "returned" && reason.trim().length < 3) {
      setMessage("Add a reason of at least 3 characters.");
      return;
    }
    decide(id, status, reason);
    setReturnId(null);
    setReason("");
    setMessage(
      status === "approved"
        ? "Request approved. The purchasing summary and decision history are updated."
        : "Request returned with your reason. The demo requester can see the next step.",
    );
    track("demo_complete", { industry: "manufacturing", action: status });
  };
  return (
    <div>
      <div className="ci-demo-window-title">
        <span>
          <Factory size={18} /> Purchasing workspace
        </span>
        <button
          onClick={() => {
            reset();
            setReturnId(null);
            setReason("");
            setMessage("Manufacturing demo reset.");
          }}
          className="ci-reset"
        >
          <RotateCcw size={14} /> Reset demo
        </button>
      </div>
      <div className="ci-demo-stats">
        <Stat label="Awaiting decision" value={pending.length} />
        <Stat
          label="Approved spend"
          value={money(approved.reduce((n, p) => n + p.amount, 0))}
        />
        <Stat
          label="Decisions recorded"
          value={purchases.length - pending.length}
        />
      </div>
      <div className="ci-demo-section-title">
        <h3>Your approval queue</h3>
        <span>Demo budget: $5,000</span>
      </div>
      <div className="ci-purchase-list">
        {purchases.map((p) => (
          <div key={p.id} className="ci-purchase-row">
            <span className="ci-row-icon">
              <FileCheck2 size={20} />
            </span>
            <div className="ci-purchase-description">
              <strong>{p.item}</strong>
              <small>
                {p.id} · {p.department}
              </small>
              {p.reason && (
                <small className="ci-return-reason">Reason: {p.reason}</small>
              )}
            </div>
            <strong className="ci-purchase-amount">{money(p.amount)}</strong>
            {p.status === "pending" ? (
              <div className="ci-row-actions">
                <button
                  className="ci-action-primary"
                  onClick={() => act(p.id, "approved")}
                  aria-label={`Approve ${p.item}`}
                >
                  <Check size={14} /> Approve
                </button>
                <button
                  className="ci-action-quiet"
                  onClick={() => {
                    setReturnId(p.id);
                    setMessage("");
                  }}
                  aria-label={`Return ${p.item}`}
                >
                  Return
                </button>
              </div>
            ) : (
              <span
                className={`ci-status ${p.status === "approved" ? "ci-status-good" : "ci-status-warn"}`}
              >
                {p.status === "approved" ? (
                  <CheckCheck size={13} />
                ) : (
                  <ArrowRight size={13} />
                )}{" "}
                {p.status === "approved" ? "Approved" : "Returned"}
              </span>
            )}
            {returnId === p.id && (
              <form
                className="ci-return-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  act(p.id, "returned");
                }}
              >
                <label htmlFor="return-reason">What needs to change?</label>
                <input
                  id="return-reason"
                  autoFocus
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  minLength={3}
                  maxLength={160}
                  required
                  placeholder="For example: confirm the quantity"
                />
                <div>
                  <button className="ci-action-primary" type="submit">
                    Return with reason
                  </button>
                  <button
                    type="button"
                    className="ci-action-quiet"
                    onClick={() => setReturnId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>
      <div className="ci-demo-trail">
        <ShieldCheck size={16} />
        <p>
          {approved.length
            ? `${approved.length} approved request${approved.length === 1 ? "" : "s"} ready for purchasing. Every decision stays with the request.`
            : "You make the decision. The connected workflow handles the handoff."}
        </p>
      </div>
      <p role="status" className="ci-demo-message">
        {message}
      </p>
    </div>
  );
}
function FieldDemo() {
  const [tech, setTech] = useState("Alex"),
    [assigned, setAssigned] = useState(""),
    [checks, setChecks] = useState<boolean[]>([false, false, false]),
    [complete, setComplete] = useState(false),
    [message, setMessage] = useState("");
  const assign = () => {
    if (
      hasScheduleConflict(
        570,
        90,
        tech === "Alex" ? [{ start: 540, end: 660 }] : [],
      )
    ) {
      setMessage(
        "Schedule conflict: Alex is already booked from 9:00–11:00. Choose Morgan, who is available.",
      );
      return;
    }
    setAssigned(tech);
    setMessage(
      `Job assigned to ${tech}, 9:30–11:00. Complete the checklist to finish the job.`,
    );
    track("demo_interaction", { widget: "field-service", action: "assign" });
  };
  return (
    <div>
      <div className="ci-demo-window-title">
        <span>
          <Truck size={18} /> Field service workspace
        </span>
        <button
          className="ci-reset"
          onClick={() => {
            setTech("Alex");
            setAssigned("");
            setChecks([false, false, false]);
            setComplete(false);
            setMessage("Field service demo reset.");
          }}
        >
          <RotateCcw size={14} /> Reset demo
        </button>
      </div>
      <div className="ci-demo-stats">
        <Stat
          label="Job status"
          value={complete ? "Complete" : assigned ? "Scheduled" : "Unassigned"}
        />
        <Stat label="Assigned to" value={assigned || "Choose below"} />
        <Stat
          label="Checklist"
          value={`${checks.filter(Boolean).length} / 3`}
        />
      </div>
      <div className="ci-demo-job">
        <div>
          <span className="ci-status">JOB–108 · ILLUSTRATIVE</span>
          <h3>Quarterly equipment service</h3>
          <p>Tuesday · 9:30–11:00 · Site A</p>
        </div>
        <div className="ci-assignment">
          <label htmlFor="technician">Technician</label>
          <select
            id="technician"
            value={tech}
            disabled={!!assigned}
            onChange={(e) => setTech(e.target.value)}
          >
            <option value="Alex">Alex — booked 9:00–11:00</option>
            <option value="Morgan">Morgan — available</option>
          </select>
          <button
            className="ci-action-primary"
            disabled={!!assigned}
            onClick={assign}
          >
            {assigned ? (
              <>
                <Check size={14} /> Assigned
              </>
            ) : (
              "Assign job"
            )}
          </button>
        </div>
      </div>
      <fieldset className="ci-demo-checklist" disabled={!assigned || complete}>
        <legend>Job completion checklist</legend>
        {[
          "Equipment inspected",
          "Service completed",
          "Completion notes recorded",
        ].map((l, i) => (
          <label key={l}>
            <input
              type="checkbox"
              checked={checks[i]}
              onChange={(e) =>
                setChecks((c) =>
                  c.map((v, j) => (i === j ? e.target.checked : v)),
                )
              }
            />
            <span>{l}</span>
          </label>
        ))}
      </fieldset>
      <div className="ci-demo-final-action">
        <span>
          {complete
            ? "The office and field team now see the same completed job."
            : !assigned
              ? "Assign an available technician to start the checklist."
              : "Complete all three items before closing the job."}
        </span>
        <button
          className="ci-action-primary"
          disabled={!assigned || !checks.every(Boolean) || complete}
          onClick={() => {
            setComplete(true);
            setMessage(
              "Job complete. Schedule, status, and completion record updated.",
            );
            track("demo_complete", {
              industry: "field-service",
              action: "complete",
            });
          }}
        >
          {complete ? (
            <>
              <CheckCheck size={14} /> Complete
            </>
          ) : (
            "Complete job"
          )}
        </button>
      </div>
      <p role="status" className="ci-demo-message">
        {message}
      </p>
    </div>
  );
}
function ProfessionalDemo() {
  const [checks, setChecks] = useState([true, false, true]),
    [approved, setApproved] = useState(false),
    [message, setMessage] = useState("");
  return (
    <div>
      <div className="ci-demo-window-title">
        <span>
          <Users size={18} /> Client delivery workspace
        </span>
        <button
          className="ci-reset"
          onClick={() => {
            setChecks([true, false, true]);
            setApproved(false);
            setMessage("Professional services demo reset.");
          }}
        >
          <RotateCcw size={14} /> Reset demo
        </button>
      </div>
      <div className="ci-demo-stats">
        <Stat
          label="Onboarding"
          value={
            approved
              ? "Handed over"
              : checks.every(Boolean)
                ? "Ready"
                : "Needs attention"
          }
        />
        <Stat
          label="Items received"
          value={`${checks.filter(Boolean).length} / 3`}
        />
        <Stat label="Project owner" value="Taylor" />
      </div>
      <div className="ci-demo-job">
        <div>
          <span className="ci-status">CLIENT–016 · ILLUSTRATIVE</span>
          <h3>A clear start to the engagement</h3>
          <p>Operational review · New client onboarding</p>
        </div>
        <span
          className={`ci-status ${checks.every(Boolean) ? "ci-status-good" : "ci-status-warn"}`}
        >
          {checks.every(Boolean) ? (
            <Check size={14} />
          ) : (
            <AlertCircle size={14} />
          )}{" "}
          {checks.every(Boolean)
            ? "Ready for handoff"
            : "Access details missing"}
        </span>
      </div>
      <fieldset className="ci-demo-checklist" disabled={approved}>
        <legend>Required before handoff</legend>
        {[
          "Project brief received",
          "Access details confirmed",
          "Main contact identified",
        ].map((l, i) => (
          <label key={l}>
            <input
              type="checkbox"
              checked={checks[i]}
              onChange={(e) =>
                setChecks((c) =>
                  c.map((v, j) => (i === j ? e.target.checked : v)),
                )
              }
            />
            <span>{l}</span>
            {!checks[i] && <small>Missing</small>}
          </label>
        ))}
      </fieldset>
      <div className="ci-demo-final-action">
        <span>
          {approved
            ? "Taylor has the brief, access details, and contact information in one place."
            : "Check the missing item to see the project become ready."}
        </span>
        <button
          className="ci-action-primary"
          disabled={!checks.every(Boolean) || approved}
          onClick={() => {
            setApproved(true);
            setMessage(
              "Handoff approved. Taylor is the owner and the client summary is complete.",
            );
            track("demo_complete", {
              industry: "professional-services",
              action: "handoff",
            });
          }}
        >
          {approved ? (
            <>
              <CheckCheck size={14} /> Approved
            </>
          ) : (
            "Approve handoff"
          )}
        </button>
      </div>
      <p role="status" className="ci-demo-message">
        {message}
      </p>
    </div>
  );
}
export default function IndustryShowcase({
  initialIndustry = "manufacturing",
  standalone = false,
}: {
  initialIndustry?: DemoIndustry;
  standalone?: boolean;
}) {
  const [industry, setIndustry] = useState<DemoIndustry>(initialIndustry);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const d = demoDetails[industry];
  const select = (v: DemoIndustry) => {
    setIndustry(v);
    track("demo_select", { industry: v });
  };
  const key = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let n = i;
    if (e.key === "ArrowRight") n = (i + 1) % 3;
    else if (e.key === "ArrowLeft") n = (i + 2) % 3;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = 2;
    else return;
    e.preventDefault();
    select(demoIndustries[n]);
    tabs.current[n]?.focus();
  };
  return (
    <section
      className={`ci-section ci-showcase ${standalone ? "ci-showcase-standalone" : ""}`}
      id="demos"
    >
      <div className="ci-container">
        {!standalone && (
          <div className="ci-section-intro">
            <div>
              <p className="ci-eyebrow">01 / YOUR WORLD, CONNECTED</p>
              <h2 className="ci-heading">
                Your work.
                <br />A better way to do it.
              </h2>
            </div>
            <p>
              See what a connected workflow could look like in your business.
              Choose an industry. Try it for yourself.
            </p>
          </div>
        )}
        <div
          role="tablist"
          aria-label="Choose an industry demo"
          className="ci-industry-tabs"
        >
          {demoIndustries.map((id, i) => (
            <button
              key={id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`industry-tab-${id}`}
              role="tab"
              aria-selected={industry === id}
              aria-controls="industry-demo-panel"
              tabIndex={industry === id ? 0 : -1}
              onKeyDown={(e) => key(e, i)}
              onClick={() => select(id)}
            >
              <span>0{i + 1}</span>
              {demoDetails[id].name}
              <ArrowUpRight size={18} />
            </button>
          ))}
        </div>
        <div
          role="tabpanel"
          id="industry-demo-panel"
          aria-labelledby={`industry-tab-${industry}`}
          tabIndex={0}
          className="ci-industry-panel"
        >
          <div className="ci-industry-story">
            <div className="ci-industry-photo">
              <Image
                src={`/industries/${d.image}`}
                alt={
                  industry === "manufacturing"
                    ? "Precision machinery in a manufacturing workshop"
                    : industry === "field-service"
                      ? "Service tools and safety glasses on a workbench"
                      : "A team planning a project around a shared table"
                }
                fill
                sizes="(max-width: 760px) 90vw, 350px"
              />
              <span>{d.label}</span>
            </div>
            <h2>{d.headline}</h2>
            <p>{d.description}</p>
            <ol>
              {d.steps.map((step, i) => (
                <li key={step}>
                  <span>0{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <Link href={`/solutions/${d.solution}`} className="ci-text-link">
              Explore this solution <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="ci-demo-workspace" key={industry}>
            <div className="ci-demo-chrome">
              <span>
                <i />
                <i />
                <i />
              </span>
              <span>CATALYST / {d.name.toUpperCase()}</span>
              <span className="ci-fictional">
                <Circle size={6} fill="currentColor" /> FICTIONAL DATA
              </span>
            </div>
            {industry === "manufacturing" ? (
              <ManufacturingDemo />
            ) : industry === "field-service" ? (
              <FieldDemo />
            ) : (
              <ProfessionalDemo />
            )}
          </div>
        </div>
        <div className="ci-demo-context">
          <p>
            <strong>Built to fit your business.</strong> {d.range} Final pricing
            depends on scope.
          </p>
          <Link
            href={`/consultation?industry=${industry}&demo=${industry}`}
            className="ci-btn ci-btn-small"
            onClick={() =>
              track("cta_consultation_click", { location: "demo", industry })
            }
          >
            Discuss a workflow like this <ArrowUpRight size={17} />
          </Link>
        </div>
        <p className="ci-demo-disclosure">
          These are illustrative examples, not customer results. Actions affect
          this demo only; no purchases, messages, or bookings are made.
        </p>
        {!standalone && (
          <Link
            href={`/demo-lab?industry=${industry}`}
            className="ci-text-link"
          >
            More to explore in the Demo Lab <ChevronRight size={15} />
          </Link>
        )}
      </div>
    </section>
  );
}
