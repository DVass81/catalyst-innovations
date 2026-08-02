"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useInView } from "framer-motion";
import { Reveal } from "../Reveal";

/** A soft reprise of the portal's CRT hum, only if the visitor opted in earlier. */
function useEpilogueHum(active: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  useEffect(() => {
    if (!active) return;
    let enabled = false;
    try {
      enabled = localStorage.getItem("ci-sound") === "1";
    } catch {
      /* localStorage unavailable — skip */
    }
    if (!enabled) return;
    const Ctx = window.AudioContext;
    if (!Ctx) return;

    const ctx = new Ctx();
    ctxRef.current = ctx;
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 140;
    [50, 100.3].forEach((f) => {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = f;
      o.connect(lp);
      o.start();
    });
    lp.connect(master);

    const t = ctx.currentTime;
    master.gain.setTargetAtTime(0.035, t, 0.8);
    const fadeOut = setTimeout(() => {
      master.gain.setTargetAtTime(0, ctx.currentTime, 1.2);
    }, 3200);

    return () => {
      clearTimeout(fadeOut);
      ctx.close().catch(() => {});
    };
  }, [active]);
}

/** Closing bookend: the old machine again — small, dark, powered off. */
export default function Epilogue() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [woke, setWoke] = useState(false);
  useEpilogueHum(inView);

  return (
    <section className="bg-navy-950 py-24 text-center">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <Reveal>
          <div ref={ref} aria-hidden="true" className="mx-auto w-[150px]">
            <button
              type="button"
              onClick={() => setWoke((w) => !w)}
              aria-label="Wake the old computer, one more time"
              className="block w-full cursor-pointer appearance-none rounded-[10px] border-0 bg-gradient-to-b from-[#4a4639] to-[#35322a] p-2.5 pb-3.5 opacity-70 transition-opacity hover:opacity-90"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-[#0a0d0a]">
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.05) 0%, transparent 30%)" }}
                />
                {woke && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#04140a]">
                    <p className="font-mono text-[0.4rem] text-[#52c56d]">still works.</p>
                  </div>
                )}
              </div>
              <div className="mt-1.5 flex items-center justify-end gap-1 pr-1">
                <span className="font-mono text-[0.3rem] text-[#5c584c]">PWR</span>
                <span className={`h-[4px] w-[4px] rounded-full transition-colors ${woke ? "bg-[#e8a13c] shadow-[0_0_5px_rgb(232_161_60/0.9)]" : "bg-[#3a372e]"}`} />
              </div>
            </button>
            <div className="mx-auto h-[8px] w-[34%] bg-[#35322a] opacity-70 [clip-path:polygon(15%_0,85%_0,100%_100%,0_100%)]" />
          </div>

          <p className="mt-10 font-grotesk text-2xl font-semibold text-white sm:text-3xl">
            You&apos;ve seen the other side.
          </p>
          <p className="mt-3 text-lg text-silver-400">The door is open.</p>
          <Link
            href="/consultation"
            className="mt-8 inline-flex min-h-[48px] items-center rounded-lg bg-steel-400 px-8 font-semibold text-white transition-colors hover:bg-steel-500"
          >
            Step through
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
