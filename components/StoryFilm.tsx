"use client";
import { useEffect, useRef, useState } from "react";
import { signatureFilm } from "@/data/motionStories";
import { storyCoordinator } from "@/lib/storyPlayback";
export default function StoryFilm() {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const [owner] = useState(() => ({}));
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!open || !video) return;
    const hide = () => {
      if (document.hidden) video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause();
    });
    observer.observe(video);
    document.addEventListener("visibilitychange", hide);
    return () => {
      video.pause();
      storyCoordinator.release(owner);
      observer.disconnect();
      document.removeEventListener("visibilitychange", hide);
    };
  }, [open, owner, failed]);
  if (signatureFilm.status !== "reviewed" || !signatureFilm.src || failed)
    return null;
  return (
    <div className="story-film">
      {!open ? (
        <button className="quiet-button" onClick={() => setOpen(true)}>
          Watch the story · 15 seconds ↗
        </button>
      ) : (
        <>
          <video
            ref={videoRef}
            aria-label="Catalyst: one request, every step connected"
            controls
            playsInline
            muted
            preload="none"
            poster={signatureFilm.poster}
            onPlay={(e) => {
              const video = e.currentTarget;
              storyCoordinator.claim(owner, () => video.pause());
            }}
            onPause={() => storyCoordinator.release(owner)}
            onEnded={() => storyCoordinator.release(owner)}
            onError={() => {
              storyCoordinator.release(owner);
              setFailed(true);
            }}
          >
            <source src={signatureFilm.src} type="video/mp4" />
          </video>
          <button
            className="quiet-button"
            onClick={() => {
              storyCoordinator.release(owner);
              setOpen(false);
            }}
          >
            Return to the interactive story
          </button>
        </>
      )}
    </div>
  );
}
