"use client";
import { useEffect, useRef, useState } from "react";
import { type MotionValue, useMotionValueEvent } from "framer-motion";
import type { WorldFrame } from "./paper-world";
import type { DemoIndustry } from "@/lib/demo";

type World = ReturnType<typeof import("./paper-world").createPaperWorld>;
let modulePromise: Promise<typeof import("./paper-world")> | undefined;
const names: DemoIndustry[] = [
  "manufacturing",
  "field-service",
  "professional-services",
];

/** No Three.js enters the initial bundle. Each view draws only when its values change. */
export default function PaperWorld({
  opening,
  connected,
  industryProgress,
  industry = "manufacturing",
  approved = false,
  onReady,
  intro = false,
}: {
  opening: MotionValue<number>;
  connected: MotionValue<number>;
  industryProgress: MotionValue<number>;
  industry?: DemoIndustry;
  approved?: boolean;
  onReady?: () => void;
  intro?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null),
    canvas = useRef<HTMLCanvasElement>(null);
  const world = useRef<World | null>(null),
    visible = useRef(false),
    pending = useRef(0);
  const frame = useRef<WorldFrame>({
    opening: intro ? 0 : 1,
    connected: 1,
    industry: 0,
    target: 0,
    approved: false,
  });
  const [status, setStatus] = useState<"waiting" | "ready" | "still">(
    "waiting",
  );
  const [poster, setPoster] = useState(intro ? "paper" : industry);
  function schedule() {
    if (
      pending.current ||
      document.hidden ||
      !visible.current ||
      !world.current
    )
      return;
    pending.current = requestAnimationFrame(() => {
      pending.current = 0;
      world.current?.draw(frame.current);
    });
  }
  useMotionValueEvent(opening, "change", (v) => {
    frame.current.opening = v;
    if (v > 0.4) setPoster(industry);
    else if (intro) setPoster("paper");
    schedule();
  });
  useMotionValueEvent(connected, "change", (v) => {
    frame.current.connected = v;
    schedule();
  });
  useMotionValueEvent(industryProgress, "change", (v) => {
    frame.current.industry = v;
    schedule();
  });
  useEffect(() => {
    frame.current.target = names.indexOf(industry);
    frame.current.approved = approved;
    frame.current.opening = opening.get();
    frame.current.connected = connected.get();
    frame.current.industry = industryProgress.get();
    schedule();
  }, [approved, connected, industry, industryProgress, opening]);
  useEffect(() => {
    const el = host.current,
      c = canvas.current;
    if (!el || !c) return;
    let canceled = false,
      started = false,
      timer: ReturnType<typeof setTimeout>;
    const fail = () => {
      if (!canceled) {
        setStatus("still");
        onReady?.();
      }
    };
    const start = () => {
      if (started || canceled) return;
      started = true;
      modulePromise ??= import("./paper-world");
      modulePromise
        .then(({ createPaperWorld }) => {
          if (canceled) return;
          try {
            world.current = createPaperWorld(
              c,
              window.matchMedia("(max-width: 760px)").matches,
            );
            world.current.draw(frame.current);
            setStatus("ready");
            onReady?.();
          } catch {
            fail();
          }
        })
        .catch(fail);
    };
    const queue = () => {
      clearTimeout(timer);
      timer = setTimeout(start, 160);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        visible.current = entries[0].isIntersecting;
        if (visible.current) {
          if (document.readyState === "complete") queue();
          else window.addEventListener("load", queue, { once: true });
          schedule();
        }
      },
      { rootMargin: "0px", threshold: 0.03 },
    );
    observer.observe(el);
    const lost = (e: Event) => {
      e.preventDefault();
      fail();
    };
    c.addEventListener("webglcontextlost", lost);
    const visibility = () => {
      if (!document.hidden) schedule();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      canceled = true;
      observer.disconnect();
      clearTimeout(timer);
      window.removeEventListener("load", queue);
      document.removeEventListener("visibilitychange", visibility);
      c.removeEventListener("webglcontextlost", lost);
      cancelAnimationFrame(pending.current);
      pending.current = 0;
      world.current?.dispose();
      world.current = null;
    };
  }, [onReady]);
  const posterName = intro ? poster : industry;
  return (
    <div
      ref={host}
      className={`paper-world ${intro ? "paper-world-intro" : "paper-world-compare"}`}
      data-renderer={status}
    >
      {/* Native render of this exact model; also available without JavaScript or WebGL. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="paper-world-still"
        src={`/world-stills/${posterName}.webp`}
        width="1000"
        height="500"
        alt=""
        loading="lazy"
        hidden={status === "ready"}
      />
      <canvas
        ref={canvas}
        aria-hidden="true"
        className={status === "ready" ? "is-ready" : ""}
      />
      <span className="sr-only">
        An illustrative paper request unfolds into a{" "}
        {industry === "manufacturing"
          ? "factory"
          : industry === "field-service"
            ? "service operation"
            : "client workspace"}
        , connected by the glass Catalyst mark.
      </span>
      {status === "still" && (
        <span className="paper-world-fallback">
          Still view · The demonstration below is fully interactive.
        </span>
      )}
    </div>
  );
}
