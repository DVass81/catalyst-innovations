"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCheck,
  FileText,
  Mail,
  Pause,
  Play,
  RotateCcw,
  Sheet,
  ShieldCheck,
} from "lucide-react";
import { track } from "@/lib/site";
import { usePurchases } from "@/components/demos/DemoProvider";
const phases = [
  "A request arrives",
  "The details connect",
  "An owner takes over",
  "Ready for your review",
  "Your next move",
];
export default function WorkflowIntro() {
  const scene = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const { purchases, decide, reset } = usePurchases();
  const approved = purchases[0].status === "approved";
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduced(media.matches);
      let seen = false;
      try {
        seen = sessionStorage.getItem("ci-intro-seen") === "1";
      } catch {}
      if (media.matches || seen) {
        elapsed.current = 5000;
        setProgress(1);
      }
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);
  useEffect(() => {
    if (paused || reduced || elapsed.current >= 5000) return;
    let frame = 0,
      previous = 0,
      visible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        previous = 0;
      },
      { threshold: 0.15 },
    );
    if (scene.current) observer.observe(scene.current);
    const tick = (time: number) => {
      if (visible && !document.hidden && previous)
        elapsed.current = Math.min(
          5000,
          elapsed.current + Math.min(time - previous, 80),
        );
      previous = visible && !document.hidden ? time : 0;
      setProgress(elapsed.current / 5000);
      if (elapsed.current < 5000) frame = requestAnimationFrame(tick);
      else {
        try {
          sessionStorage.setItem("ci-intro-seen", "1");
        } catch {}
      }
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [paused, reduced]);
  const phase = Math.min(4, Math.floor(progress * 5));
  const replay = () => {
    elapsed.current = reduced ? 5000 : 0;
    setProgress(reduced ? 1 : 0);
    reset();
    setPaused(true);
    requestAnimationFrame(() => setPaused(false));
  };
  return (
    <div
      ref={scene}
      className={`ci-workflow-scene ci-phase-${phase}`}
      aria-label="Illustrative purchase approval workflow"
    >
      <div className="ci-scene-label">
        <span>
          <i /> THE CATALYST EFFECT
        </span>
        <span>01 — 05</span>
      </div>
      <div className="ci-workbench">
        <div className="ci-inputs" aria-hidden="true">
          <div className="ci-input ci-email">
            <Mail size={18} />
            <span>
              Email thread<small>“Who’s approving this?”</small>
            </span>
          </div>
          <div className="ci-input ci-sheet">
            <Sheet size={18} />
            <span>
              Spreadsheet<small>Three versions. One request.</small>
            </span>
          </div>
        </div>
        <div className="ci-request">
          <div className="ci-request-top">
            <span className="ci-mini-icon">
              <FileText size={19} />
            </span>
            <span>
              Purchase request<small>REQ–024 · ILLUSTRATIVE DEMO</small>
            </span>
            <span className="ci-request-dot" />
          </div>
          <h2>Keep the production line moving.</h2>
          <div className="ci-request-details">
            <span>
              Replacement pump<small>Maintenance · Line 02</small>
            </span>
            <strong>
              $2,400<span>Within demo budget</span>
            </strong>
          </div>
          <div className="ci-process" aria-hidden="true">
            {["Received", "Assigned", "Reviewed"].map((step, i) => (
              <span key={step} className={phase > i ? "is-complete" : ""}>
                <i>{phase > i ? <Check size={11} /> : i + 1}</i>
                {step}
              </span>
            ))}
          </div>
          <div className="ci-approval">
            <div>
              <ShieldCheck size={18} />
              <span>
                {approved
                  ? "Decision recorded"
                  : phase === 4
                    ? "You’re in control"
                    : "A clear path to a decision"}
                <small>
                  {approved
                    ? "The purchasing summary is updated."
                    : "Human approval. Every important step."}
                </small>
              </span>
            </div>
            <button
              className="ci-approve-btn"
              disabled={purchases[0].status !== "pending"}
              onClick={() => {
                elapsed.current = 5000;
                setProgress(1);
                decide("REQ–024", "approved");
                track("demo_interaction", {
                  widget: "hero",
                  action: "approve",
                });
              }}
            >
              {approved ? <CheckCheck size={16} /> : <ArrowRight size={16} />}
              <span>
                {approved
                  ? "Approved"
                  : purchases[0].status === "returned"
                    ? "Returned"
                    : "Try approval"}
              </span>
            </button>
          </div>
        </div>
        <div className="ci-output">
          <span className="ci-output-check">
            <CheckCheck size={21} />
          </span>
          <div>
            {approved ? "Ready for purchasing" : "One connected workflow"}
            <small>
              {approved
                ? "1 decision recorded · $2,400 approved"
                : "The right information. The right person."}
            </small>
          </div>
          <span className="ci-output-line" />
        </div>
      </div>
      <div className="ci-scene-bottom">
        <span aria-live="polite">
          {approved ? "Your decision. Everything connected." : phases[phase]}
        </span>
        <div>
          <button
            className="ci-icon-btn"
            onClick={() => setPaused(!paused)}
            aria-label={
              paused ? "Resume opening animation" : "Pause opening animation"
            }
            disabled={progress >= 1 || reduced}
          >
            {paused ? <Play size={15} /> : <Pause size={15} />}
          </button>
          <button
            className="ci-icon-btn"
            onClick={replay}
            aria-label="Replay opening animation"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
      <div className="ci-scene-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
      <p className="ci-demo-note">
        Fictional demonstration · no real purchase is made
      </p>
      <span className="sr-only" role="status">
        {approved
          ? "Approved. One decision recorded. Total approved: 2,400 dollars."
          : ""}
      </span>
    </div>
  );
}
