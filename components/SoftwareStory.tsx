"use client";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { m, LazyMotion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronRight,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Package,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Users,
  Workflow,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";
import { createStoryPlayer, stepAt } from "@/lib/storyPlayback";
import type { MotionStory, SceneKind, StoryStep } from "@/data/motionStories";

const icons = {
  request: MessageSquare,
  quote: FileText,
  schedule: CalendarDays,
  inventory: Package,
  invoice: FileText,
  overview: LayoutDashboard,
  review: ShieldCheck,
  report: LayoutDashboard,
  sync: Workflow,
  campaign: Users,
};
const loadMotionFeatures = () => import("./storyMotionFeatures").then((module) => module.default);
function SceneDetail({
  kind,
  approved,
}: {
  kind: SceneKind;
  approved: boolean;
}) {
  if (kind === "schedule")
    return (
      <div className="demo-calendar" aria-hidden="true">
        <div className="demo-days">
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
        </div>
        <div className="demo-week">
          <i />
          <i />
          <i />
          <i />
          <i />
          <div className="demo-job">
            <span className="demo-job-dot" />
            Scheduled work<span>Details + materials attached</span>
          </div>
        </div>
      </div>
    );
  if (kind === "inventory")
    return (
      <div className="demo-stock" aria-hidden="true">
        {["Item details", "Availability", "Purchase / receipt"].map((x, i) => (
          <div key={x}>
            <Package size={16} />
            <span>{x}</span>
            <span
              className="demo-stock-line"
              style={{ width: `${80 - i * 15}px` }}
            />
          </div>
        ))}
      </div>
    );
  if (kind === "review")
    return (
      <div className="demo-approval">
        <ShieldCheck size={27} />
        <div>
          <strong>People stay in control.</strong>
          <span>Review → decision → next action</span>
        </div>
      </div>
    );
  if (kind === "overview" || kind === "sync" || kind === "report")
    return (
      <div className="demo-connections">
        {["People", "Work", "Records"].map((x, i) => (
          <div key={x}>
            <span>
              {i === 0 ? (
                <Users size={20} />
              ) : i === 1 ? (
                <Workflow size={20} />
              ) : (
                <FileText size={20} />
              )}
            </span>
            <strong>{x}</strong>
            <small>Connected</small>
            {i < 2 && <i aria-hidden="true" />}
          </div>
        ))}
      </div>
    );
  if (kind === "campaign")
    return (
      <div className="demo-campaign">
        <span>One shared purpose.</span>
        <strong>
          A clearer way
          <br />
          to support a cause.
        </strong>
        <span className="demo-faux-button">
          Explore the campaign <ArrowUpRight size={14} />
        </span>
      </div>
    );
  return (
    <div className="demo-document">
      <div className="demo-document-line" />
      <div className="demo-document-line short" />
      <div className="demo-document-bottom">
        <span>
          {kind === "invoice"
            ? "Ready for billing review"
            : kind === "quote"
              ? approved
                ? "Approval recorded"
                : "Customer review"
              : "Details captured once"}
        </span>
        {kind === "quote" && !approved ? (
          <ShieldCheck size={20} />
        ) : (
          <Check size={20} />
        )}
      </div>
    </div>
  );
}
function RecordScreen({
  story,
  step,
  approved,
  stepIndex,
}: {
  story: MotionStory;
  step: StoryStep;
  approved: boolean;
  stepIndex: number;
}) {
  const Icon = icons[step.kind];
  const status =
    approved && step.transition ? step.transition.status : step.status;
  return (
    <div className={`demo-screen scene-${step.kind}`}>
      <div className="demo-window-bar">
        <span className="demo-window-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>catalyst / connected workspace</span>
        <span className="demo-window-lock">
          <ShieldCheck size={12} /> EXAMPLE
        </span>
      </div>
      <div className="demo-app">
        <aside className="demo-app-rail" aria-hidden="true">
          <span className="demo-brand-glyph">C</span>
          {[LayoutDashboard, Users, CalendarDays, Package, FileText].map(
            (I, n) => (
              <span className={n === stepIndex ? "is-active" : ""} key={n}>
                <I size={17} />
              </span>
            ),
          )}
          <span className="demo-rail-avatar">C</span>
        </aside>
        <div className="demo-app-main">
          <div className="demo-breadcrumb">
            Workspace <ChevronRight size={12} />
            <span>{step.label}</span>
          </div>
          <div className="demo-record-heading">
            <span className="demo-record-icon">
              <Icon size={23} strokeWidth={1.5} />
            </span>
            <div>
              <span className="demo-record-id">{story.record}</span>
              <p className="demo-record-title">{story.subject}</p>
            </div>
            <span className="demo-record-menu" aria-hidden="true">
              ···
            </span>
          </div>
          <div className={`demo-state ${approved ? "is-approved" : ""}`}>
            <span />
            {status}
          </div>
          <dl className="demo-record-fields">
            {step.fields.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>
                  {k === "Approval" && approved ? "Approved by customer" : v}
                </dd>
              </div>
            ))}
          </dl>
          <SceneDetail kind={step.kind} approved={approved} />
          <div className="demo-record-footer">
            <span className="demo-linked-dot" />
            <span>{story.record} · information stays connected</span>
            <Workflow size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SoftwareStory({
  story,
  variant = "full",
  autoplay = true,
}: {
  story: MotionStory;
  variant?: "full" | "compact" | "card";
  autoplay?: boolean;
}) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const [player] = useState(() => createStoryPlayer(story.duration, autoplay));
  const state = useSyncExternalStore(
    player.subscribe,
    player.getSnapshot,
    player.getSnapshot,
  );
  const active = stepAt(state.elapsed, story.steps.length, story.duration);
  const current = story.steps[active];
  const fraction =
    (state.elapsed % (story.duration / story.steps.length)) /
    (story.duration / story.steps.length);
  const approved =
    !!current.transition &&
    (fraction >= current.transition.at || state.elapsed === story.duration);
  const note =
    approved && current.transition ? current.transition.note : current.note;
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => player.setReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    const visibility = () =>
      player.setDocumentVisible(document.visibilityState === "visible");
    visibility();
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(
      ([entry]) =>
        player.setVisible(
          entry.isIntersecting && entry.intersectionRatio >= 0.35,
        ),
      { threshold: [0, 0.35] },
    );
    if (root.current) observer.observe(root.current);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
      player.dispose();
    };
  }, [player]);
  useEffect(() => {
    if (!state.playing) return;
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      player.tick(now - previous);
      previous = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [player, state.playing]);
  return (
    <div
      ref={root}
      className={`software-story story-${variant} ${state.reduced ? "story-static" : ""}`}
      role="group"
      aria-label={`${story.title} Interactive illustration`}
      data-story={story.id}
      data-playing={state.playing}
      data-step={active}
    >
      <div className="story-topline">
        <span>
          <span className="live-dot" />
          {variant === "card"
            ? "Illustrative concept"
            : "Illustrative workflow"}
        </span>
        <span>
          {variant === "card"
            ? "Explore the idea"
            : "BUILT AROUND YOUR BUSINESS"}
        </span>
      </div>
      <div className="story-body">
        <div className="story-narrative">
          <p className="story-chapter">
            {String(active + 1).padStart(2, "0")}{" "}
            <span>/ {String(story.steps.length).padStart(2, "0")}</span>
          </p>
          <h3>{current.title}</h3>
          <p className="story-caption">{current.caption}</p>
          <div className="story-record-tag">
            <span />
            <span>{story.record}</span>
            <ArrowRight size={13} />
            <span>Same record. Next step.</span>
          </div>
        </div>
        <div className="story-stage">
          <div className="story-stage-grid" aria-hidden="true" />
          <div className="story-backplate backplate-one" aria-hidden="true" />
          <div className="story-backplate backplate-two" aria-hidden="true" />
          <LazyMotion features={loadMotionFeatures} strict>
          <AnimatePresence initial={false} mode="popLayout">
            <m.div
              className="story-screen-position"
              key={`${story.id}-${active}`}
              initial={
                state.reduced ? false : { opacity: 0, x: 24, y: 8, rotateY: -3 }
              }
              animate={{ opacity: 1, x: 0, y: 0, rotateY: 0 }}
              exit={
                state.reduced ? { opacity: 0 } : { opacity: 0, x: -16, y: -4 }
              }
              transition={{
                duration: state.reduced ? 0 : 0.45,
                ease: [0.2, 0.7, 0.25, 1],
              }}
            >
              <RecordScreen
                story={story}
                step={current}
                approved={approved}
                stepIndex={active}
              />
            </m.div>
          </AnimatePresence>
          </LazyMotion>
          <div className="story-handoff">
            <span>
              <Check size={14} />
            </span>
            <p>{note}</p>
          </div>
        </div>
      </div>
      <div className="story-step-list" aria-label="Choose a story step">
        {story.steps.map((s, n) => (
          <button
            type="button"
            key={`${s.label}-${n}`}
            aria-pressed={n === active}
            aria-controls={`${id}-explanation`}
            onClick={() =>
              player.seek(((n + 0.8) * story.duration) / story.steps.length)
            }
          >
            <span className="story-step-number">
              {n < active ? (
                <Check size={12} />
              ) : (
                String(n + 1).padStart(2, "0")
              )}
            </span>
            <span>{s.label}</span>
            {n < story.steps.length - 1 && (
              <span className="story-step-line" aria-hidden="true" />
            )}
          </button>
        ))}
      </div>
      <p className="sr-only" id={`${id}-explanation`}>
        {current.title} {current.caption} {note}
      </p>
      <div className="story-controls">
        <span>
          {state.reduced
            ? "Static view · choose a step"
            : state.playing
              ? "Following the work…"
              : state.elapsed >= story.duration
                ? "Every step connected."
                : variant === "card"
                  ? "Play this illustrative concept"
                  : "Explore at your own pace."}
        </span>
        <div>
          {!state.reduced && (
            <>
              <button
                type="button"
                onClick={() => (state.playing ? player.pause() : player.play())}
                aria-label={state.playing ? "Pause story" : "Play story"}
              >
                {state.playing ? <Pause size={14} /> : <Play size={14} />}
                <span>{state.playing ? "Pause" : "Play"}</span>
              </button>
              <button
                type="button"
                onClick={() => player.replay()}
                aria-label="Replay story"
              >
                <RotateCcw size={14} />
                <span>Replay</span>
              </button>
              <span className="story-time">
                {Math.floor(state.elapsed / 1000)
                  .toString()
                  .padStart(2, "0")}{" "}
                / {story.duration / 1000}s
              </span>
            </>
          )}
        </div>
      </div>
      <div className="story-progress" aria-hidden="true">
        <span
          style={{ transform: `scaleX(${state.elapsed / story.duration})` }}
        />
      </div>
    </div>
  );
}
