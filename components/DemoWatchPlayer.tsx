"use client";

import { useEffect, useRef, useState } from "react";
import type { Demo } from "@/data/demos";
import { track } from "@/lib/site";
import { storyCoordinator } from "@/lib/storyPlayback";

type Props = {
  demoId: Demo["id"];
  displayName: string;
  walkthrough: NonNullable<Demo["walkthrough"]>;
  className?: string;
};

/** Render the real media in initial HTML; only playback coordination needs JavaScript. */
export default function DemoWatchPlayer({ demoId, displayName, walkthrough, className }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const identity = useRef({});
  const [failed, setFailed] = useState(false);
  const progressTracked = useRef(false);
  const completionTracked = useRef(false);

  useEffect(() => {
    const player = video.current;
    const owner = identity.current;
    const pauseWhenHidden = () => { if (document.hidden) player?.pause(); };
    const pauseForOtherMedia = (event: Event) => {
      if (event.target instanceof HTMLMediaElement && event.target !== player) player?.pause();
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    document.addEventListener("play", pauseForOtherMedia, true);
    return () => {
      player?.pause();
      storyCoordinator.release(owner);
      document.removeEventListener("visibilitychange", pauseWhenHidden);
      document.removeEventListener("play", pauseForOtherMedia, true);
    };
  }, [demoId]);

  return <>
    <video ref={video} controls playsInline preload="none" width={1920} height={1080}
      poster={walkthrough.poster} className={className}
      aria-label={`${displayName} narrated software walkthrough`}
      aria-describedby="watch-player-help"
      onError={() => setFailed(true)}
      onPlay={event => {
        const player = event.currentTarget;
        setFailed(false);
        storyCoordinator.claim(identity.current, () => player.pause());
        document.querySelectorAll("video, audio").forEach(other => {
          if (other instanceof HTMLMediaElement && other !== player) other.pause();
        });
        track("demo_interaction", { demo: demoId, action: "play_walkthrough" });
      }}
      onPause={() => storyCoordinator.release(identity.current)}
      onTimeUpdate={event => {
        const player = event.currentTarget;
        if (!progressTracked.current && Number.isFinite(player.duration) && player.duration > 0 && player.currentTime / player.duration >= 0.5) {
          progressTracked.current = true;
          track("demo_interaction", { demo: demoId, action: "walkthrough_progress" });
        }
      }}
      onEnded={() => {
        storyCoordinator.release(identity.current);
        if (!completionTracked.current) {
          completionTracked.current = true;
          track("demo_interaction", { demo: demoId, action: "complete_walkthrough" });
        }
      }}>
      <source src={walkthrough.video} type="video/mp4" onError={() => setFailed(true)} />
      <track kind="captions" src={walkthrough.captions} srcLang="en" label="English" default />
      Your browser cannot play this video. <a href="#transcript">Read the full transcript</a> instead.
    </video>
    <p id="watch-player-help" className="muted">Press play when you’re ready. English captions, volume and fullscreen are available in the player. <a className="text-link" href="#transcript">Read the transcript ↓</a></p>
    {failed && <p role="alert">The video couldn’t load. The application screens and transcript below are still available. <button className="text-link" onClick={() => {
      const player = video.current;
      if (!player) return;
      setFailed(false);
      player.load();
      void player.play().catch(() => setFailed(true));
    }}>Retry the video</button></p>}
  </>;
}
