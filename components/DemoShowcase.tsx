"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { demos, type Demo } from "@/data/demos";
import { track } from "@/lib/site";

export default function DemoShowcase({ detailed = false, context = "" }: { detailed?: boolean; context?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const [selected, setSelected] = useState<Demo | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!detailed) return;
    const openLinkedDemo = () => {
      const demo = demos.find(item => `#${item.id}` === window.location.hash && item.walkthrough);
      if (!demo) return;
      trigger.current = document.querySelector<HTMLButtonElement>(`#${demo.id} .video-watch`);
      setFailed(false);
      setSelected(demo);
    };
    openLinkedDemo();
    window.addEventListener("hashchange", openLinkedDemo);
    return () => window.removeEventListener("hashchange", openLinkedDemo);
  }, [detailed]);
  useEffect(() => { if (selected) dialog.current?.showModal(); }, [selected]);
  useEffect(() => {
    const pause = () => { if (document.hidden) video.current?.pause(); };
    document.addEventListener("visibilitychange", pause);
    return () => document.removeEventListener("visibilitychange", pause);
  }, []);
  function close() {
    video.current?.pause();
    setSelected(null);
    trigger.current?.focus();
  }
  function inquiry(demo: Demo) {
    const params = new URLSearchParams(context);
    params.set("demo", demo.id);
    if (!params.has("industry")) params.set("industry", demo.industry);
    return `/consultation?${params}`;
  }
  function watch(demo: Demo, button: HTMLButtonElement) {
    trigger.current = button;
    setFailed(false);
    setSelected(demo);
    track("demo_interaction", { demo: demo.id, action: "open_walkthrough" });
  }
  return <>
    <div className={`three-grid demo-cards video-demo-cards${detailed ? " video-demo-library" : ""}`}>
      {demos.map((demo, i) => <article key={demo.id} id={detailed ? demo.id : undefined}>
        <div className="demo-card-image video-demo-poster">
          <Image src={demo.walkthrough?.poster ?? demo.steps[0].image}
            width={demo.walkthrough ? 1920 : demo.steps[0].width} height={demo.walkthrough ? 1080 : demo.steps[0].height}
            alt={`${demo.displayName}: actual application walkthrough preview`}
            sizes="(max-width:700px) 90vw, (max-width:1100px) 45vw, 380px" />
          <span className="video-demo-number">0{i + 1} / BUILT BY CATALYST</span>
        </div>
        <div className="demo-card-copy">
          <p className="overline">{demo.id === "painting" ? "Planned system · Demonstration prototype" : "Actual application · Sample information"}</p>
          {detailed ? <h2>{demo.displayName}</h2> : <h3>{demo.displayName}</h3>}
          <p>{demo.purpose}</p>
          {demo.walkthrough ? <button className="button video-watch"
            onClick={e => watch(demo, e.currentTarget)} aria-haspopup="dialog"
            aria-label={`Watch ${demo.displayName} walkthrough`}>
            <span aria-hidden="true">▶</span> Watch walkthrough
            <span className="video-duration">{Math.floor(demo.walkthrough.durationSeconds / 60)}:{String(Math.round(demo.walkthrough.durationSeconds % 60)).padStart(2, "0")}</span>
          </button> : <p className="video-pending">Narrated walkthrough in production</p>}
          <div className="video-demo-links">
            <Link className="text-link" href={inquiry(demo)}>Discuss a system like this ↗</Link>
            {detailed && demo.availability === "public-sample" && demo.publicUrl &&
              <a className="text-link" href={demo.publicUrl} target="_blank" rel="noopener noreferrer"
                onClick={() => track("demo_interaction", { demo: demo.id, action: "open_public" })}>
                Explore the public sample ↗
              </a>}
          </div>
        </div>
      </article>)}
    </div>
    <dialog ref={dialog} className="demo-dialog walkthrough-dialog" aria-labelledby="walkthrough-title"
      onCancel={() => video.current?.pause()} onClose={close}>
      {selected?.walkthrough && <>
        <div className="viewer-heading">
          <div><p className="overline">Actual software / Narrated walkthrough</p>
            <h2 id="walkthrough-title">{selected.displayName}</h2></div>
          <button autoFocus className="quiet-button" onClick={() => dialog.current?.close()}>Close ✕</button>
        </div>
        {failed ? <p role="alert" className="video-failure">This video couldn’t load. You can read the transcript below or <button className="text-link" onClick={() => setFailed(false)}>try the video again</button>.</p> :
          <video ref={video} key={selected.id} className="walkthrough-video" controls playsInline preload="none"
            width="1920" height="1080" poster={selected.walkthrough.poster}
            aria-label={`${selected.displayName} narrated walkthrough`}
            onError={() => setFailed(true)}
            onPlay={e => {
              document.querySelectorAll("video").forEach(other => { if (other !== e.currentTarget) other.pause(); });
              track("demo_interaction", { demo: selected.id, action: "play_walkthrough" });
            }}>
            <source src={selected.walkthrough.video} type="video/mp4" onError={() => setFailed(true)} />
            <track kind="captions" src={selected.walkthrough.captions} srcLang="en" label="English" default />
            Your browser cannot play this video. Read the transcript below.
          </video>}
        <p className="muted">{selected.id === "painting" ? "Demonstration prototype. " : ""}Sample information. Narration uses a synthetic voice. Use fullscreen for a closer look at the application.</p>
        <details className="walkthrough-transcript"><summary>Read the transcript</summary>
          {selected.walkthrough.transcript.split("\n\n").map((paragraph, i) => <p key={i}>{paragraph}</p>)}
        </details>
        <Link className="text-link" href={inquiry(selected)}>Discuss a system like this ↗</Link>
      </>}
    </dialog>
  </>;
}
