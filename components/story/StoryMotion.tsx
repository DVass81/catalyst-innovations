"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { Pause, Play } from "lucide-react";
const noopSubscribe = () => () => {};
const serverFalse = () => false,
  serverTrue = () => true;
const subscribeMedia = (callback: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const readMedia = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const subscribeVisibility = (callback: () => void) => {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
};
const readVisibility = () => document.hidden;
let memoryPaused = false;
const readPaused = () => {
  try {
    return localStorage.getItem("ci-motion-paused") === "1";
  } catch {
    return memoryPaused;
  }
};
const subscribePause = (callback: () => void) => {
  window.addEventListener("ci-motion-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("ci-motion-change", callback);
    window.removeEventListener("storage", callback);
  };
};
const MotionContext = createContext({
  paused: false,
  reduced: true,
  hidden: false,
  toggle: () => {},
});
export function StoryMotionProvider({ children }: { children: ReactNode }) {
  const paused = useSyncExternalStore(subscribePause, readPaused, serverFalse);
  const reduced = useSyncExternalStore(subscribeMedia, readMedia, serverTrue);
  const hidden = useSyncExternalStore(
    subscribeVisibility,
    readVisibility,
    serverFalse,
  );
  const toggle = () => {
    memoryPaused = !paused;
    try {
      localStorage.setItem("ci-motion-paused", memoryPaused ? "1" : "0");
    } catch {}
    window.dispatchEvent(new Event("ci-motion-change"));
  };
  return (
    <MotionContext.Provider value={{ paused, reduced, hidden, toggle }}>
      {children}
    </MotionContext.Provider>
  );
}
export const useStoryMotion = () => useContext(MotionContext);
export function MotionToggle() {
  const { paused, reduced, toggle } = useStoryMotion();
  return (
    <button
      type="button"
      className="ci-icon-btn story-motion-toggle"
      onClick={toggle}
      disabled={reduced}
      aria-label={
        reduced
          ? "Reduced motion is enabled on your device"
          : paused
            ? "Resume site motion"
            : "Pause site motion"
      }
      title={
        reduced
          ? "Your device prefers reduced motion"
          : paused
            ? "Resume site motion"
            : "Pause site motion"
      }
    >
      {paused || reduced ? <Play size={17} /> : <Pause size={17} />}
    </button>
  );
}
/** Bounded timelines do no work offscreen, in hidden tabs or while paused. */
export function useStoryTimeline(duration = 5, sessionKey?: string) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.12 });
  const { paused: sitePaused, reduced, hidden } = useStoryMotion();
  const ready = useSyncExternalStore(noopSubscribe, serverTrue, serverFalse);
  const progress = useMotionValue(0);
  const [paused, setPaused] = useState(false),
    [revision, setRevision] = useState(0),
    [phase, setPhase] = useState(0),
    [complete, setComplete] = useState(false);
  useMotionValueEvent(progress, "change", (v) => {
    setPhase(Math.min(4, Math.floor(v * 5)));
    setComplete(v >= 1);
  });
  useEffect(() => {
    if (!ready) return;
    let seen = false;
    try {
      seen =
        revision === 0 &&
        !!sessionKey &&
        sessionStorage.getItem(sessionKey) === "1";
    } catch {}
    if (reduced || seen) {
      progress.set(1);
      return;
    }
    if (!inView || hidden || paused || sitePaused || progress.get() >= 1)
      return;
    const animation = animate(progress, 1, {
      duration: duration * (1 - progress.get()),
      ease: "linear",
      onComplete: () => {
        try {
          if (sessionKey) sessionStorage.setItem(sessionKey, "1");
        } catch {}
      },
    });
    return () => animation.stop();
  }, [
    duration,
    hidden,
    inView,
    paused,
    progress,
    ready,
    reduced,
    revision,
    sessionKey,
    sitePaused,
  ]);
  const replay = () => {
    if (reduced) return;
    progress.set(0);
    setPaused(false);
    setRevision((v) => v + 1);
  };
  const finish = () => {
    progress.set(1);
    setRevision((v) => v + 1);
    try {
      if (sessionKey) sessionStorage.setItem(sessionKey, "1");
    } catch {}
  };
  return {
    ref,
    progress,
    phase,
    complete,
    paused: paused || sitePaused,
    reduced,
    replay,
    toggle: () => setPaused((v) => !v),
    finish,
  };
}
export function useMorphTarget(target: number, duration = 1.15) {
  const ref = useRef<HTMLDivElement>(null),
    visible = useInView(ref, { amount: 0.08 });
  const { reduced, paused, hidden } = useStoryMotion();
  const progress = useMotionValue(target);
  useEffect(() => {
    if (reduced || paused || !visible || hidden) {
      progress.set(target);
      return;
    }
    const animation = animate(progress, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => animation.stop();
  }, [duration, hidden, paused, progress, reduced, target, visible]);
  return { ref, progress };
}
