"use client";
import { useEffect, useRef, useState } from "react";
import {
  MessageSquareText,
  FileText,
  CalendarDays,
  PackageCheck,
  ReceiptText,
  Pause,
  Play,
  RotateCcw,
  Check,
} from "lucide-react";
const steps = [
  {
    name: "Inquiry",
    text: "Customer details, captured once.",
    icon: MessageSquareText,
  },
  {
    name: "Quote",
    text: "The right information, ready to price.",
    icon: FileText,
  },
  { name: "Schedule", text: "People and work, in sync.", icon: CalendarDays },
  { name: "Materials", text: "Know what the job needs.", icon: PackageCheck },
  { name: "Invoice", text: "Finished work, ready to bill.", icon: ReceiptText },
];
export default function WorkflowStory() {
  const ref = useRef<HTMLDivElement>(null);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const started = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduced(mq.matches);
      if (mq.matches) setPlaying(false);
    };
    update();
    mq.addEventListener("change", update);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          if (!mq.matches) setPlaying(true);
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);
  useEffect(() => {
    if (!playing || reduced) return;
    let id = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const delta = now - last;
      last = now;
      setElapsed((e) => Math.min(12000, e + delta));
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [playing, reduced]);
  useEffect(() => {
    if (elapsed >= 12000) {
      const id = requestAnimationFrame(() => setPlaying(false));
      return () => cancelAnimationFrame(id);
    }
  }, [elapsed]);
  const t = reduced ? 12000 : elapsed;
  const connected = t >= 9000;
  const active = t < 3000 ? -1 : Math.min(4, Math.floor((t - 3000) / 1200));
  return (
    <div
      ref={ref}
      className={`workflow-panel ${t < 3000 ? "scattered" : ""} ${connected ? "connected" : ""}`}
    >
      <div className="workflow-heading">
        <div>
          <span className="live-dot" />{" "}
          <span>
            {t < 3000
              ? "Too many places to keep up."
              : connected
                ? "One connected way to work."
                : "The next step happens together."}
          </span>
        </div>
        <span className="workflow-note">
          An example, shaped around your business
        </span>
      </div>
      <ol className="workflow-track">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <li
              key={s.name}
              className={i <= active ? "step-active" : ""}
              style={{ "--step": i } as React.CSSProperties}
            >
              <div className="workflow-icon">
                <Icon size={27} strokeWidth={1.4} />
                {i <= active && <Check className="step-check" size={13} />}
              </div>
              <span className="step-number">0{i + 1}</span>
              <h3>{s.name}</h3>
              <p>{s.text}</p>
              {i < 4 && <span className="step-connector" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
      <div className="workflow-bottom">
        <p>No retyping. Fewer handoffs. Everyone on the same page.</p>
        <div className="motion-controls">
          {!reduced && (
            <>
              <button
                onClick={() => {
                  if (elapsed >= 12000) setElapsed(0);
                  setPlaying(!playing);
                }}
                aria-label={playing ? "Pause animation" : "Play animation"}
              >
                {playing ? <Pause size={15} /> : <Play size={15} />}
              </button>
              <button
                onClick={() => {
                  setElapsed(0);
                  setPlaying(true);
                }}
                aria-label="Replay animation"
              >
                <RotateCcw size={15} />
              </button>
            </>
          )}
          <span>
            {reduced
              ? "Static view"
              : `${Math.floor(t / 1000)
                  .toString()
                  .padStart(2, "0")} / 12s`}
          </span>
        </div>
      </div>
      <div
        className="workflow-progress"
        style={{ transform: `scaleX(${t / 12000})` }}
      />
    </div>
  );
}
