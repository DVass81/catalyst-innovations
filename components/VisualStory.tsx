"use client";
import Image from "next/image";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Pause, Play, RotateCcw, ArrowRight } from "lucide-react";
import { createStoryPlayer, stepAt } from "@/lib/storyPlayback";
import { visualStories, type VisualStoryKind } from "@/data/visualStories";

export default function VisualStory({
  kind,
  priority = false,
  autoplay = true,
  context,
  workflow,
}: {
  kind: VisualStoryKind;
  priority?: boolean;
  autoplay?: boolean;
  context?: string;
  workflow?: string[];
}) {
  const story = visualStories[kind];
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const [player] = useState(() => createStoryPlayer(9000, autoplay));
  const state = useSyncExternalStore(
    player.subscribe,
    player.getSnapshot,
    player.getSnapshot,
  );
  const active = stepAt(state.elapsed, 3, 9000);
  useEffect(() => {
    const pref = matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => player.setReduced(pref.matches);
    const visibility = () =>
      player.setDocumentVisible(document.visibilityState === "visible");
    reduced();
    visibility();
    pref.addEventListener("change", reduced);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(
      ([entry]) =>
        player.setVisible(
          entry.isIntersecting && entry.intersectionRatio >= 0.3,
        ),
      { threshold: [0, 0.3] },
    );
    if (root.current) observer.observe(root.current);
    return () => {
      observer.disconnect();
      pref.removeEventListener("change", reduced);
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
    <figure
      ref={root}
      className={`visual-story visual-${kind} ${state.reduced ? "visual-static" : ""}`}
      aria-label={story.name}
      data-visual-story={kind}
      data-playing={state.playing}
      data-step={active}
    >
      <div className="visual-heading">
        <span>{story.eyebrow}</span>
        <span>CATALYST / IN MOTION</span>
      </div>
      <div
        className="visual-art"
        aria-label={story.scenes[active].alt}
        role="img"
      >
        {story.scenes.map((scene, index) => (
          <div
            key={scene.label}
            className={`visual-frame ${index === active ? "is-current" : ""}`}
            aria-hidden="true"
          >
            <div
              className="visual-camera"
              style={{
                transform: "none",
              }}
            >
              <Image
                src={`/stories/${kind}-${index}.webp`}
                alt=""
                width={1484}
                height={355}
                sizes="(max-width: 700px) 100vw, 1200px"
                priority={priority && index === 0}
                loading={priority && index === 0 ? undefined : "lazy"}
                className="visual-sheet"
              />
            </div>
          </div>
        ))}
        <span className="visual-example">Illustrative service business</span>
      </div>
      <div className="visual-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${state.elapsed / 9000})` }} />
      </div>
      <figcaption id={id} className="visual-story-caption">
        <span className="visual-number">
          0{active + 1}
          <span> / 03</span>
        </span>
        <div>
          <p className="visual-title">{story.scenes[active].title}</p>
          <p>{story.scenes[active].text}</p>
        </div>
      </figcaption>
      <div className="visual-controls">
        <div
          className="visual-chapters"
          role="group"
          aria-label="Choose a scene"
        >
          {story.scenes.map((scene, index) => (
            <button
              key={scene.label}
              aria-pressed={active === index}
              aria-controls={id}
              onClick={() => player.seek(index * 3000)}
            >
              <span>0{index + 1}</span>
              {scene.label}
            </button>
          ))}
        </div>
        {!state.reduced && (
          <div className="visual-playback">
            <button
              onClick={() => (state.playing ? player.pause() : player.play())}
              aria-label={
                state.playing ? "Pause visual story" : "Play visual story"
              }
            >
              {state.playing ? <Pause size={16} /> : <Play size={16} />}
              <span>{state.playing ? "Pause" : "Play"}</span>
            </button>
            <button
              onClick={() => player.replay()}
              aria-label="Replay visual story"
            >
              <RotateCcw size={16} />
              <span>Replay</span>
            </button>
          </div>
        )}
        {state.reduced && (
          <span className="visual-motion-note">Choose a scene to explore.</span>
        )}
      </div>
      {workflow && (
        <div className="visual-context">
          <p>
            {context
              ? `A workflow for ${context.toLowerCase()}`
              : "Your workflow"}
          </p>
          <ol>
            {workflow.map((label, index) => (
              <li key={`${index}-${label}`}>
                {label}
                {index < workflow.length - 1 && (
                  <ArrowRight size={13} aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
          <span>
            The illustration shows a service business. We adapt the software to
            your process.
          </span>
        </div>
      )}
    </figure>
  );
}
