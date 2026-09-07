"use client";
import { ArrowUpRight, CheckCheck, Pause, Play, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import DecisionCascade from "@/components/story/DecisionCascade";
import PaperWorld from "@/components/story/PaperWorld";
import { useStoryTimeline } from "@/components/story/StoryMotion";
import { usePurchases } from "@/components/demos/DemoProvider";
import { track } from "@/lib/site";
const captions = [
  {
    title: "A pump is needed on Line 02.",
    body: "Maintenance raises a $2,400 purchase request. Someone needs to review it.",
  },
  {
    title: "There’s a factory behind this request.",
    body: "People, equipment, and materials depend on timely decisions between teams.",
  },
  {
    title: "Connect maintenance to purchasing.",
    body: "The request, its owner, and the budget come together in one shared workflow.",
  },
  {
    title: "The next step becomes clear.",
    body: "The right person can see what is needed and make the decision.",
  },
  {
    title: "Your turn. Move the work forward.",
    body: "Approve the pump request below. The purchasing summary and decision history update together.",
  },
];
export default function WorkflowIntro() {
  const [sceneReady, setSceneReady] = useState(false);
  const ready = useCallback(() => setSceneReady(true), []);
  const connected = useMotionValue(1),
    industry = useMotionValue(0);
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
  } = useStoryTimeline(8, "ci-factory-story-seen", sceneReady);
  const { purchases, decide } = usePurchases();
  const request = purchases[0],
    approved = request.status === "approved";
  return (
    <div
      ref={sceneRef}
      className={`ci-workflow-scene story-opening ci-phase-${phase}`}
      data-phase={phase}
      aria-label="A paper request unfolds into a connected business"
    >
      <div className="story-scene-heading">
        <span>
          <i /> THE CATALYST EFFECT
        </span>
        <span>MANUFACTURING / A PURCHASE REQUEST</span>
      </div>
      <div className="story-scene-content">
        <div className="story-caption">
          <span className="factory-story-label">
            ONE REQUEST. EVERY HANDOFF CONNECTED.
          </span>
          <h2>
            {approved
              ? "Approved. Clear for purchasing."
              : request.status === "returned"
                ? "A clear reason. A clear next step."
                : captions[phase].title}
          </h2>
          <p>
            {approved
              ? "$2,400 approved. Purchasing has the request, and the team can see the decision."
              : request.status === "returned"
                ? "The requester can see what needs to change before this purchase can proceed."
                : captions[phase].body}
          </p>
          <ol
            className="factory-story-steps"
            aria-label="The request’s journey"
          >
            {["Request", "Factory", "Workflow", "Decision"].map((step, i) => (
              <li
                key={step}
                aria-current={Math.min(phase, 3) === i ? "step" : undefined}
              >
                <span>0{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <div className="factory-story-controls">
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
            <span>
              {reduced
                ? "Motion reduced"
                : complete
                  ? "Replay the story"
                  : paused
                    ? "Story paused"
                    : "Follow the request"}
            </span>
          </div>
        </div>
        <PaperWorld
          opening={progress}
          connected={connected}
          industryProgress={industry}
          approved={approved}
          onReady={ready}
          intro
        />
      </div>
      <div className="story-decision-row">
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
      </div>
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
