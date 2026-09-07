"use client";
import { useId } from "react";
import { useTransform, motion } from "framer-motion";
import { MorphPath } from "./MorphPaths";
import { useMorphTarget } from "./StoryMotion";
export default function DecisionCascade({
  state,
  labels = ["Purchasing", "Decision history", "Team summary"],
  compact = false,
}: {
  state: "waiting" | "approved" | "returned" | "conflict";
  labels?: string[];
  compact?: boolean;
}) {
  const id = useId().replaceAll(":", "");
  const target = state === "waiting" ? 0 : state === "approved" ? 1 : 2;
  const { ref, progress } = useMorphTarget(target, 1.1);
  const color = useTransform(
    progress,
    [0, 1, 2],
    ["#7896b3", "#1455d9", "#9c5719"],
  );
  const draw = useTransform(progress, [0, 1, 2], [0.12, 1, 1]);
  const caption =
    state === "approved"
      ? "Your decision moves the work forward."
      : state === "returned"
        ? "A clear reason. A route back to the requester."
        : state === "conflict"
          ? "A conflict is caught before the work is assigned."
          : "The system is ready. You make the decision.";
  return (
    <div
      ref={ref}
      className={`story-cascade ${compact ? "story-cascade-compact" : ""}`}
      data-state={state}
    >
      <svg viewBox="0 0 600 98" aria-hidden="true">
        <defs>
          <linearGradient id={`decision-${id}`}>
            <stop stopColor="#75b6ff" />
            <stop offset="1" stopColor="#1455d9" />
          </linearGradient>
        </defs>
        <path d="M20 49H114" stroke="#aec4d7" strokeWidth="1.5" />
        <circle cx="24" cy="49" r="5" fill="#78a5cd" />
        <MorphPath
          data-morph="decision-gate"
          progress={progress}
          stops={[0, 1, 2]}
          shapes={[
            "M 121 71 C 121 55 121 40 121 24 C 138 24 154 24 169 24 C 169 40 169 55 169 71",
            "M 119 49 C 128 58 134 63 143 72 C 158 54 171 38 188 19 C 188 19 188 19 188 19",
            "M 166 26 C 135 26 121 40 121 55 C 121 70 150 78 174 64 C 155 73 132 82 116 65",
          ]}
          fill="none"
          style={{ stroke: color }}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <MorphPath
          progress={progress}
          stops={[0, 1, 2]}
          shapes={[
            "M 198 49 C 249 49 295 49 335 49 C 371 49 390 49 445 49 C 473 49 494 49 522 49",
            "M 198 49 C 258 49 258 17 331 17 C 393 17 392 49 445 49 C 484 49 470 80 522 80",
            "M 198 49 C 280 49 259 11 328 11 C 365 11 365 87 297 87 C 226 87 223 49 198 49",
          ]}
          fill="none"
          style={{ stroke: color, pathLength: draw }}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <motion.g style={{ stroke: color }} fill="none" strokeWidth="1.5">
          <rect x="328" y="8" width="28" height="20" rx="5" />
          <rect x="436" y="39" width="28" height="20" rx="5" />
          <rect x="522" y="70" width="28" height="20" rx="5" />
        </motion.g>
      </svg>
      <div className="story-cascade-labels">
        <strong>{caption}</strong>
        <span>
          {state === "returned" || state === "conflict"
            ? "Review → resolve → move forward"
            : labels.join(" · ")}
        </span>
      </div>
    </div>
  );
}
