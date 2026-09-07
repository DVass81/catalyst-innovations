"use client";
import { useId, useState, type CSSProperties } from "react";
import { useMotionValue } from "framer-motion";
import { ArrowDown, ArrowLeftRight, Check } from "lucide-react";
import { type DemoIndustry } from "@/lib/demo";
import { useMorphTarget } from "./StoryMotion";
import PaperWorld from "./PaperWorld";
const order: DemoIndustry[] = [
  "manufacturing",
  "field-service",
  "professional-services",
];
const copy = {
  manufacturing: {
    before: [
      "Requests in different places",
      "Chasing the next decision",
      "Separate purchasing records",
    ],
    after: [
      "One approval queue",
      "A named decision-maker",
      "A shared purchasing summary",
    ],
  },
  "field-service": {
    before: [
      "Jobs in separate messages",
      "Unclear technician availability",
      "Updates arriving late",
    ],
    after: [
      "One shared schedule",
      "Assignment conflicts visible",
      "A checklist with the job",
    ],
  },
  "professional-services": {
    before: [
      "Client details scattered",
      "Unclear handoff ownership",
      "Missing information discovered late",
    ],
    after: [
      "One onboarding workspace",
      "A clear owner at each step",
      "Readiness visible before handoff",
    ],
  },
};
export default function ConnectedWorld({
  industry,
}: {
  industry: DemoIndustry;
}) {
  const [amount, setAmount] = useState(100);
  const id = useId();
  const connected = useMotionValue(1),
    opening = useMotionValue(1);
  const { ref, progress } = useMorphTarget(order.indexOf(industry), 1.65);
  const update = (value: number) => {
    setAmount(value);
    connected.set(value / 100);
  };
  const active = amount >= 50 ? "after" : "before";
  return (
    <div className="connected-world" ref={ref} data-industry={industry}>
      <div className="connected-world-heading">
        <div>
          <span className="story-kicker">
            THE SAME WORK. A BETTER WAY THROUGH.
          </span>
          <h3>
            What changes when
            <br />
            the work connects?
          </h3>
        </div>
        <p>
          Move between the two views.
          <br />
          Then try a decision for yourself.
        </p>
      </div>
      <div className="connected-world-stage">
        <PaperWorld
          opening={opening}
          connected={connected}
          industryProgress={progress}
          industry={industry}
        />
        <div className="connected-world-caption">
          <span>
            {amount === 0
              ? "BEFORE"
              : amount === 100
                ? "CONNECTED"
                : "THE TRANSFORMATION"}
          </span>
          <strong>
            {active === "after"
              ? "The work finds its rhythm."
              : "Good people. Disconnected tools."}
          </strong>
          <p>{copy[industry][active][0]}</p>
        </div>
        <span className="connected-world-index">
          {String(order.indexOf(industry) + 1).padStart(2, "0")} / CATALYST
          INNOVATIONS
        </span>
      </div>
      <div className="connected-world-controls">
        <div className="connected-world-endpoints">
          <button
            type="button"
            onClick={() => update(0)}
            aria-pressed={amount === 0}
          >
            Before<span>Scattered work</span>
          </button>
          <label htmlFor={id}>
            <ArrowLeftRight size={18} />
            <span>Drag to transform</span>
          </label>
          <button
            type="button"
            onClick={() => update(100)}
            aria-pressed={amount === 100}
          >
            Connected<span>A shared way forward</span>
          </button>
        </div>
        <input
          id={id}
          type="range"
          min="0"
          max="100"
          step="1"
          value={amount}
          onChange={(e) => update(Number(e.target.value))}
          aria-label="Before to connected transformation"
          aria-valuetext={`${amount}% connected. ${copy[industry][active][0]}`}
          style={{ "--world-progress": `${amount}%` } as CSSProperties}
        />
        <div
          className="connected-world-outcomes"
          aria-live="polite"
          aria-atomic="true"
        >
          {copy[industry][active].map((line) => (
            <span key={line}>
              <Check size={15} />
              {line}
            </span>
          ))}
        </div>
        <div className="connected-world-foot">
          <p>
            Illustrative transformation. This control does not change your demo
            decisions.
          </p>
          <a href="#industry-demo-panel">
            Now, make a decision <ArrowDown size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
