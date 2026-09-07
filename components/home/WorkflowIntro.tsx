"use client";
import { ArrowUpRight, CheckCheck, Pause, Play, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import DecisionCascade from "@/components/story/DecisionCascade";
import ChaosMorph from "@/components/story/ChaosMorph";
import { useStoryTimeline } from "@/components/story/StoryMotion";
import { usePurchases } from "@/components/demos/DemoProvider";
import { track } from "@/lib/site";
const captions = [
  "Good work. Scattered everywhere.",
  "The pieces begin to connect.",
  "The same work. A clearer shape.",
  "One request. One connected system.",
  "Now, you move the work forward.",
];
export default function WorkflowIntro() {
  const {
    ref: sceneRef,
    progress,
    phase,
    complete,
    paused,
    reduced,
    replay,
    toggle,
    finish,
  } = useStoryTimeline(5, "ci-story-intro-seen");
  const { purchases, decide } = usePurchases();
  const request = purchases[0],
    approved = request.status === "approved";
  return (
    <div
      ref={sceneRef}
      className={`ci-workflow-scene story-opening ci-phase-${phase}`}
      data-phase={phase}
      aria-label="From scattered work to a connected purchasing workflow"
    >
      <div className="story-scene-heading">
        <span>
          <i /> THE CATALYST EFFECT
        </span>
        <span>01 — POSSIBILITY</span>
      </div>
      <ChaosMorph progress={progress} approved={approved} />
      <div className="story-caption">
        <p>{captions[phase]}</p>
        <div>
          <button
            type="button"
            className="ci-icon-btn"
            aria-label={
              paused ? "Resume opening animation" : "Pause opening animation"
            }
            disabled={reduced || complete}
            onClick={toggle}
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button
            type="button"
            className="ci-icon-btn"
            aria-label="Replay opening animation"
            disabled={reduced}
            onClick={replay}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
      <div className="story-live-request">
        <div>
          <span>YOUR TURN · REQ–024</span>
          <strong>
            Replacement pump <b>$2,400</b>
          </strong>
        </div>
        <button
          className="story-approval"
          disabled={request.status !== "pending"}
          onClick={() => {
            finish();
            decide(request.id, "approved");
            track("demo_interaction", { widget: "hero", action: "approve" });
          }}
        >
          {approved ? <CheckCheck size={18} /> : <ArrowUpRight size={18} />}
          <span>
            {approved
              ? "Approved"
              : request.status === "returned"
                ? "Returned"
                : "Try approval"}
          </span>
        </button>
      </div>
      <DecisionCascade
        compact
        state={
          approved
            ? "approved"
            : request.status === "returned"
              ? "returned"
              : "waiting"
        }
      />
      <p className="story-demo-note" role="status">
        {approved
          ? "Decision recorded. $2,400 approved and ready for purchasing."
          : "Fictional workflow · Your actions stay inside the demonstration."}
      </p>
      <div className="ci-scene-progress">
        <motion.span style={{ scaleX: progress }} />
      </div>
    </div>
  );
}
