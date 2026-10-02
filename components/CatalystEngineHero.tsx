"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { storyCoordinator } from "@/lib/storyPlayback";
import {
  createWorkaroundsPlayer,
  initialWorkaroundsSnapshot,
  workaroundsStory,
} from "@/lib/workaroundsStory";

export default function CatalystEngineHero() {
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const actions = useRef({ toggle: () => {}, replay: () => {} });
  const [loaded, setLoaded] = useState(false);
  const [snapshot, setSnapshot] = useState(initialWorkaroundsSnapshot);

  useEffect(() => {
    const element = video.current;
    const container = frame.current;
    if (!element || !container || !loaded) return;
    const player = createWorkaroundsPlayer(element, storyCoordinator, setSnapshot);
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout>;
    const onVisibility = () => player.setDocumentVisible(!document.hidden);
    const onPreference = () => player.setReduced(preference.matches);
    const onLoad = () => { timer = setTimeout(() => player.setReady(true), 250); };
    onVisibility();
    onPreference();
    const nearby = new IntersectionObserver(([entry]) => {
      player.setNearby(entry.isIntersecting);
    }, { rootMargin: "250px 0px" });
    const visibility = new IntersectionObserver(([entry]) => {
      player.setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.5);
    }, { threshold: [0, 0.5] });
    nearby.observe(container);
    visibility.observe(container);
    document.addEventListener("visibilitychange", onVisibility);
    preference.addEventListener("change", onPreference);
    window.addEventListener("load", onLoad);
    if (document.readyState === "complete") onLoad();
    actions.current = player;
    return () => {
      clearTimeout(timer);
      nearby.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      preference.removeEventListener("change", onPreference);
      window.removeEventListener("load", onLoad);
      player.dispose();
      actions.current = { toggle: () => {}, replay: () => {} };
    };
  }, [loaded]);

  const bringFilmIntoView = () => {
    const bounds = frame.current?.getBoundingClientRect();
    if (bounds && (bounds.top < 0 || bounds.bottom > window.innerHeight)) {
      frame.current?.scrollIntoView({ block: "center", behavior: "instant" });
    }
  };
  const toggle = () => {
    if (!snapshot.playing) bringFilmIntoView();
    actions.current.toggle();
  };
  const replay = () => {
    bringFilmIntoView();
    actions.current.replay();
  };

  return (
    <figure className="catalyst-engine-hero">
      <div className="catalyst-engine-art" ref={frame}>
        <Image
          src="/brand/catalyst-workarounds-poster-v1.webp"
          width={1920}
          height={1080}
          sizes="(max-width: 900px) 92vw, 48vw"
          loading="eager"
          onLoad={() => setLoaded(true)}
          alt="A beige 1980s computer in a warm cream studio, the starting point of an illustration about connecting business processes."
        />
        <video ref={video} muted playsInline preload="none" width={1920} height={1080}
          className={snapshot.showFilm ? "engine-film engine-film-visible" : "engine-film"}
          aria-hidden="true" tabIndex={-1} />
      </div>
      <figcaption>
        <span className="overline">From workarounds to working together</span>
        <p className="engine-stage" aria-live="off">{workaroundsStory[snapshot.stage].label}</p>
        <p className="engine-summary">Custom software connects your customer information, approved jobs, materials and invoicing in one workflow.</p>
        <div className="engine-controls">
          {snapshot.available && <>
            <button type="button" onClick={toggle} aria-label={snapshot.playing ? "Pause Catalyst story" : "Play Catalyst story"}>{snapshot.playing ? "Pause motion" : "Play motion"}</button>
            <button type="button" onClick={replay} aria-label="Replay Catalyst story">Replay</button>
          </>}
        </div>
        <details className="engine-story-summary">
          <summary>Read the story</summary>
          <ol>{workaroundsStory.map((stage) => <li key={stage.start}><strong>{stage.label}</strong><span>{stage.description}</span></li>)}</ol>
        </details>
      </figcaption>
    </figure>
  );
}
