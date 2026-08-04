"use client";

import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Volume2, VolumeX } from "lucide-react";
import { CatalystMark } from "../Logo";
import { ButtonLink } from "../ui";
import { track } from "@/lib/site";
import Hero from "./Hero";

/**
 * "Through the Screen" — a one-time autoplay intro, not scroll-driven.
 *
 * stage 0  the analog world: a 1997 back office and its CRT (holds ~6s)
 * stage 1  the camera launches into the screen (brief transition, ~0.7s)
 * stage 2  warp tunnel — the Catalyst brand gate holds (~3s)
 * stage 3  teleporter flash (~0.4s)
 * stage 4  arrival: the AI world — permanent resting state of the homepage
 *
 * Nothing here locks scroll — the section is a normal min-h-[100dvh] block,
 * so a visitor who scrolls immediately just moves past it. Returning
 * visitors (localStorage flag) skip straight to stage 4.
 * Reduced motion: renders the static Hero instead.
 */

/* ================= Phase A: the analog world ================= */

/* Individual keycaps, foreshortened like they're lying on the desk. */
const keyRows: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.9],
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.4],
  [1.8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.1],
  [2.3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.6],
  [1.6, 1.3, 7.2, 1.3, 1.6],
];

function RetroKeyboard() {
  return (
    <div aria-hidden="true" className="relative mx-auto mt-[10px] w-[97%] [perspective:340px]">
      <div className="origin-top rounded-[7px] bg-gradient-to-b from-[#d8d3c3] to-[#a8a393] p-[1.6%] pt-[1.9%] shadow-[0_16px_34px_rgb(0_0_0/0.55),inset_0_1px_2px_rgb(255_255_255/0.6)] [transform:rotateX(30deg)]">
        {keyRows.map((row, r) => (
          <div key={r} className="mb-[2px] flex gap-[2px] last:mb-0">
            {row.map((w, k) => (
              <span
                key={k}
                style={{ flex: w }}
                className="h-[8px] rounded-[2px] bg-gradient-to-b from-[#f2ecdb] via-[#ded8c7] to-[#bcb7a7] shadow-[0_1.5px_0_#8f8a7a,inset_0_0.5px_0_rgb(255_255_255/0.8)]"
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mx-auto h-[4px] w-[92%] rounded-b-[4px] bg-[#6f6a5c] shadow-[0_8px_16px_rgb(0_0_0/0.5)]" />
      {/* Coiled cable to the tower */}
      <svg viewBox="0 0 120 30" className="absolute -right-[24%] top-[20%] hidden w-[26%] sm:block" aria-hidden="true">
        <path
          d="M4 8 Q 24 2 34 12 T 62 16 T 92 12 T 116 20"
          fill="none"
          stroke="#57534a"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

const screenLines = [
  { text: "C:\\OPS> status", dim: false },
  { text: "LOADING MASTER_SPREADSHEET_v14_FINAL.xls ...", dim: false },
  { text: "  > 3 users editing · 214 broken links", dim: true },
  { text: "APPROVALS PENDING: 11 days", dim: false },
  { text: "INVENTORY COUNT: \"ask Dave\"", dim: true },
  { text: "LAST SYSTEM UPDATE: 2009", dim: false },
];

/** phase 0 = idle terminal, phase 1 = launch (connection-lost flicker) */
function OldComputer({ phase = 0 }: { phase?: 0 | 1 }) {
  return (
    <div className="relative w-[min(88vw,70svh,500px)]">
      {/* Monitor shell */}
      <div className="relative rounded-[20px] bg-gradient-to-b from-[#ded9cb] via-[#cdc8b8] to-[#b0ab9b] p-[4%] pb-[6.5%] shadow-[0_34px_90px_rgb(0_0_0/0.6),inset_0_2px_3px_rgb(255_255_255/0.55),inset_0_-3px_6px_rgb(0_0_0/0.18)]">
        {/* Vent slits */}
        <div aria-hidden="true" className="absolute right-[6%] top-[3%] flex gap-[3px]">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="h-[10px] w-[2.5px] rounded-full bg-[#9a9585]" />
          ))}
        </div>
        {/* Screen bezel */}
        <div className="rounded-[13px] bg-[#8a8575] p-[2.5%] shadow-[inset_0_4px_10px_rgb(0_0_0/0.55)]">
          <div className="crt-flicker relative aspect-[4/3] overflow-hidden rounded-[10px] bg-[#04140a]">
            {/* Phosphor glow */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(38,140,60,0.24), transparent 72%)" }}
            />
            {phase === 0 ? (
              <div className="relative flex h-full flex-col justify-center gap-[2.5%] px-[7%] font-mono text-[clamp(0.5rem,2.3vw,0.8rem)] leading-snug">
                {screenLines.map((l) => (
                  <p key={l.text} className={l.dim ? "text-[#3f9e55]/70" : "text-[#52c56d]"}>
                    {l.text}
                  </p>
                ))}
                <p className="text-[#52c56d]">
                  C:\OPS&gt; <span className="cursor-blink inline-block h-[1em] w-[0.6em] translate-y-[0.15em] bg-[#52c56d]" />
                </p>
              </div>
            ) : (
              <div className="relative flex h-full flex-col justify-center gap-[2.5%] px-[7%] font-mono text-[clamp(0.5rem,2.3vw,0.8rem)] leading-snug">
                {screenLines.map((l) => (
                  <p key={l.text} className={l.dim ? "text-[#3f9e55]/70" : "text-[#52c56d]"}>
                    {l.text}
                  </p>
                ))}
                <p className="text-[#7ee694]">C:\OPS&gt; CONNECTION LOST<span className="cursor-blink">▮</span></p>
              </div>
            )}
            {/* Scanlines, curvature vignette, glass sheen */}
            <div className="scanlines absolute inset-0" aria-hidden="true" />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ boxShadow: "inset 0 0 60px 18px rgba(0,0,0,0.55)" }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.1) 0%, transparent 22%, transparent 78%, rgba(255,255,255,0.04) 100%)" }}
            />
          </div>
        </div>
        {/* Brand plate + power LED */}
        <div className="mt-[3%] flex items-center justify-between px-[2%]">
          <span className="font-mono text-[clamp(0.4rem,1.4vw,0.6rem)] font-bold tracking-[0.2em] text-[#6f6a5c]">
            OPERATRON 486-SX
          </span>
          <span className="flex items-center gap-2">
            <span className="font-mono text-[clamp(0.35rem,1.2vw,0.5rem)] text-[#6f6a5c]">PWR</span>
            <span className="h-[7px] w-[7px] rounded-full bg-[#e8a13c] shadow-[0_0_8px_rgb(232_161_60/0.95)]" />
          </span>
        </div>

        {/* Sticky notes */}
        <div className="absolute -left-[9%] top-[12%] w-[22%] -rotate-6 rounded-sm bg-[#f5e97a] p-[2.5%] shadow-[0_5px_12px_rgb(0_0_0/0.4)]">
          <p className="font-mono text-[clamp(0.4rem,1.5vw,0.6rem)] font-bold leading-tight text-[#5c5320]">
            CALL SUPPLIER RE: PO #8867!!
          </p>
        </div>
        <div className="absolute -right-[8%] top-[34%] w-[20%] rotate-4 rounded-sm bg-[#8fd7f0] p-[2.5%] shadow-[0_5px_12px_rgb(0_0_0/0.4)]">
          <p className="font-mono text-[clamp(0.4rem,1.5vw,0.6rem)] font-bold leading-tight text-[#1e4b5c]">
            DON&apos;T TURN OFF — nobody knows how to restart
          </p>
        </div>
      </div>

      {/* Stand */}
      <div className="mx-auto h-[24px] w-[32%] bg-gradient-to-b from-[#a8a394] to-[#8f8a7a] [clip-path:polygon(12%_0,88%_0,100%_100%,0_100%)]" />
      <div className="mx-auto h-[9px] w-[44%] rounded-[4px] bg-[#7d7869] shadow-[0_10px_28px_rgb(0_0_0/0.55)]" />

      {/* Keyboard — individual keycaps laid flat in perspective */}
      <RetroKeyboard />

      {/* Tower (desktop only) */}
      <div aria-hidden="true" className="absolute -right-[30%] bottom-[-12px] hidden w-[22%] sm:block">
        <div className="relative h-[190px] rounded-[8px] bg-gradient-to-b from-[#d2cdbd] via-[#c0bbab] to-[#a29d8d] shadow-[0_22px_50px_rgb(0_0_0/0.55),inset_0_2px_2px_rgb(255_255_255/0.5)]">
          <div className="absolute inset-x-[12%] top-[10%] h-[9px] rounded-[2px] bg-[#8a8575] shadow-[inset_0_2px_3px_rgb(0_0_0/0.4)]" />
          <div className="absolute inset-x-[12%] top-[22%] h-[9px] rounded-[2px] bg-[#8a8575] shadow-[inset_0_2px_3px_rgb(0_0_0/0.4)]" />
          <div className="absolute left-[14%] top-[38%] h-[6px] w-[6px] rounded-full bg-[#5fae54] shadow-[0_0_6px_rgb(95_174_84/0.9)]" />
          <div className="absolute inset-x-[14%] bottom-[10%] space-y-[4px]">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-[2.5px] rounded-full bg-[#938e7e]" />
            ))}
          </div>
        </div>
      </div>

      {/* Coffee mug + papers (desktop only) */}
      <div aria-hidden="true" className="absolute -left-[24%] bottom-[-8px] hidden sm:block">
        <div className="relative h-[42px] w-[34px] rounded-b-[8px] rounded-t-[3px] bg-gradient-to-b from-[#b8542e] to-[#8a3c1e] shadow-[0_10px_20px_rgb(0_0_0/0.5)]">
          <div className="absolute -right-[10px] top-[8px] h-[18px] w-[12px] rounded-r-full border-[3.5px] border-[#8a3c1e]" />
        </div>
        <div className="mt-[6px] h-[10px] w-[70px] -rotate-2 rounded-[2px] bg-[#e2ddcd] shadow-[0_2px_0_#c9c4b4,0_4px_0_#d6d1c1,0_8px_16px_rgb(0_0_0/0.4)]" />
      </div>
    </div>
  );
}

/* ================= Phase C: the AI world ================= */

/* Glimpses of the city's morning — roles, not invented people. */
const worldPanels = [
  { x: "5%", y: "14%", rot: -5, cls: "float-slow", title: "PURCHASING · 7:42 AM", value: "6 POs approved", sub: "from the morning commute", spark: "0,14 10,11 20,12 30,7 40,8 50,3" },
  { x: "74%", y: "10%", rot: 4, cls: "float-slower", title: "PLANT OPS · 6:12 AM", value: "Line 3 rebalanced", sub: "AI plan, human-approved", spark: "0,4 10,6 20,5 30,9 40,12 50,14" },
  { x: "78%", y: "58%", rot: -3, cls: "float-slow", title: "SUPPLIER RISK · LIVE", value: "Early warning", sub: "19-day lead detected", spark: "0,10 10,9 20,11 30,6 40,9 50,4" },
  { x: "3%", y: "60%", rot: 5, cls: "float-slower", title: "FINANCE · 9:00 AM", value: "Reports drafted", sub: "review it, don't build it", spark: "0,12 10,10 20,11 30,8 40,6 50,4" },
];

/* ---- Stylized skyline: geometry + light, no clip-art ---- */

const backTowers: [number, number, number][] = [
  [0, 60, 90], [70, 40, 130], [120, 55, 70], [185, 45, 150], [240, 70, 100],
  [320, 50, 170], [380, 60, 80], [450, 45, 120], [505, 65, 95], [580, 50, 140],
  [640, 60, 75], [710, 45, 160], [765, 70, 105], [845, 50, 85], [905, 60, 125],
  [975, 45, 95], [1030, 70, 145], [1110, 50, 80], [1165, 35, 110],
];
const frontTowers: [number, number, number][] = [
  [30, 70, 120], [130, 55, 160], [210, 80, 90], [310, 60, 185], [400, 75, 110],
  [500, 55, 140], [590, 85, 95], [700, 60, 170], [790, 70, 115], [880, 55, 90],
  [950, 75, 150], [1050, 60, 100], [1130, 70, 130],
];

function CitySkyline({ wake = 1 }: { wake?: number }) {
  return (
    <svg
      viewBox="0 0 1200 200"
      preserveAspectRatio="xMidYMax slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      {/* Horizon glow */}
      <rect x="0" y="150" width="1200" height="50" fill="url(#horizonGlow)" />
      {/* Distant layer */}
      <g fill="#16325c" opacity="0.5">
        {backTowers.map(([x, w, h], i) => (
          <rect key={i} x={x} y={200 - h} width={w} height={h} rx="2" />
        ))}
      </g>
      {/* Near layer with lit windows */}
      <g>
        {frontTowers.map(([x, w, h], ti) => (
          <g key={ti}>
            <rect x={x} y={200 - h} width={w} height={h} rx="2" fill="#0d1c33" />
            {Array.from({ length: Math.floor((h - 16) / 15) }).flatMap((_, r) =>
              Array.from({ length: Math.floor((w - 12) / 13) }).map((_, c) => {
                const seed = ti * 31 + r * 7 + c * 3;
                if (seed % 4 !== 0) return null;
                const lit = seed % 8 === 0;
                // Wake-up cascade: each window turns on once `wake` passes
                // its own threshold, so the city lights up as you arrive.
                const threshold = ((seed * 37) % 100) / 100;
                const awake = wake >= threshold;
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={x + 8 + c * 13}
                    y={200 - h + 10 + r * 15}
                    width="4.5"
                    height="6"
                    fill={lit ? "#7dd3fc" : "#3d6fa5"}
                    opacity={awake ? (lit ? 0.9 : 0.45) : 0.06}
                    style={{ transition: "opacity 0.5s ease" }}
                    className={awake && seed % 16 === 0 ? "twinkle" : undefined}
                  />
                );
              }),
            )}
          </g>
        ))}
        {/* Beacon on the tallest tower */}
        <circle cx="340" cy="12" r="2.5" fill="#7dd3fc" className="twinkle" />
        <rect x="338.5" y="15" width="3" height="10" fill="#0d1c33" />
      </g>
      <defs>
        <linearGradient id="horizonGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(74,143,212,0)" />
          <stop offset="1" stopColor="rgba(74,143,212,0.22)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const stars: [number, number, number, number][] = [
  [8, 12, 2, 0], [18, 28, 1.5, 1.2], [26, 8, 2, 2.1], [34, 40, 1.5, 0.6],
  [44, 14, 2, 1.8], [55, 32, 1.5, 0.3], [63, 9, 2, 2.6], [70, 42, 1.5, 1.5],
  [80, 20, 2, 0.9], [88, 36, 1.5, 2.3], [93, 10, 2, 1.1], [14, 52, 1.5, 1.9],
  [30, 70, 2, 0.4], [48, 58, 1.5, 2.8], [60, 74, 2, 1.4], [78, 80, 1.5, 0.7],
  [90, 66, 2, 2.0], [40, 86, 1.5, 1.0],
];

function Sparkline({ points }: { points: string }) {
  return (
    <svg viewBox="0 0 50 16" className="mt-2 h-4 w-full" aria-hidden="true" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke="url(#sparkGrad)" strokeWidth="1.6" strokeLinecap="round" />
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4A8FD4" />
          <stop offset="1" stopColor="#7dd3fc" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ================= Composition ================= */

const stageLabels = ["01 · THE PAST", "01 · THE PAST", "02 · TRANSFER", "02 · TRANSFER", "03 · THE OTHER SIDE"];

// Timeline (ms from mount, first-time visitors only):
const T_LAUNCH = 6000; // office hold, then launch into the tunnel
const T_GATE = 6700; // launch transition done, gate begins its hold
const T_FLASH = 9700; // gate hold done (3000ms), flash begins
const T_ARRIVAL = 10100; // flash done, arrival settles in — permanent

/**
 * Ambient sound, fully synthesized with WebAudio — no audio files.
 * Opt-in only (autoplay-safe: context is created on the user's click),
 * remembered in localStorage. Past = CRT hum; other side = soft pad;
 * the stage-2→3 transition (through the flash) fires a filtered-noise whoosh.
 */
function useAmbientSound(stage: number) {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainsRef = useRef<{ hum?: GainNode; pad?: GainNode; noise?: GainNode }>({});
  const noiseBufRef = useRef<AudioBuffer | null>(null);
  const prevStage = useRef(stage);

  const stop = useCallback(() => {
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    gainsRef.current = {};
  }, []);

  const start = useCallback(() => {
    const Ctx = window.AudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    ctxRef.current = ctx;
    const master = ctx.createGain();
    master.gain.value = 0.7;
    master.connect(ctx.destination);

    // CRT hum: detuned saws through a dark lowpass
    const humGain = ctx.createGain();
    humGain.gain.value = 0;
    const humLp = ctx.createBiquadFilter();
    humLp.type = "lowpass";
    humLp.frequency.value = 130;
    [50, 100.3].forEach((f) => {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = f;
      o.connect(humLp);
      o.start();
    });
    humLp.connect(humGain);
    humGain.connect(master);

    // Air: looped white noise through a lowpass
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    noiseBufRef.current = buf;
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = buf;
    noiseSrc.loop = true;
    const noiseLp = ctx.createBiquadFilter();
    noiseLp.type = "lowpass";
    noiseLp.frequency.value = 380;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0;
    noiseSrc.connect(noiseLp).connect(noiseGain).connect(master);
    noiseSrc.start();

    // Future pad: soft triad through a gently breathing filter
    const padGain = ctx.createGain();
    padGain.gain.value = 0;
    const padLp = ctx.createBiquadFilter();
    padLp.type = "lowpass";
    padLp.frequency.value = 750;
    [110, 164.8, 220, 277.2].forEach((f) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      o.connect(padLp);
      o.start();
    });
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 260;
    lfo.connect(lfoGain).connect(padLp.frequency);
    lfo.start();
    padLp.connect(padGain);
    padGain.connect(master);

    gainsRef.current = { hum: humGain, pad: padGain, noise: noiseGain };
  }, []);

  // Stage-driven mix
  useEffect(() => {
    const ctx = ctxRef.current;
    const g = gainsRef.current;
    if (!enabled || !ctx || !g.hum || !g.pad || !g.noise) return;
    const t = ctx.currentTime;
    const ramp = (node: GainNode, v: number) => {
      node.gain.cancelScheduledValues(t);
      node.gain.setTargetAtTime(v, t, 0.6);
    };
    if (stage < 3) {
      ramp(g.hum, 0.05);
      ramp(g.noise, 0.012);
      ramp(g.pad, 0);
    } else {
      ramp(g.hum, 0);
      ramp(g.noise, 0.006);
      ramp(g.pad, 0.045);
    }
    // Whoosh when passing through the flash
    if (prevStage.current < 3 && stage >= 3 && noiseBufRef.current) {
      const src = ctx.createBufferSource();
      src.buffer = noiseBufRef.current;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.Q.value = 1.2;
      bp.frequency.setValueAtTime(180, t);
      bp.frequency.exponentialRampToValueAtTime(3200, t + 0.5);
      const env = ctx.createGain();
      env.gain.setValueAtTime(0.22, t);
      env.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      src.connect(bp).connect(env).connect(ctx.destination);
      src.start(t);
      src.stop(t + 1);
    }
    prevStage.current = stage;
  }, [stage, enabled]);

  useEffect(() => () => stop(), [stop]);

  const toggle = useCallback(() => {
    setEnabled((was) => {
      const now = !was;
      try {
        localStorage.setItem("ci-sound", now ? "1" : "0");
      } catch {}
      if (now) start();
      else stop();
      return now;
    });
  }, [start, stop]);

  return { enabled, toggle };
}

export default function PortalHero() {
  const reduce = useReducedMotion();
  // Returning visitors (localStorage flag) skip straight to the arrival —
  // decided during the initial render so there's no flash of the office
  // scene before jumping past it.
  const [stage, setStage] = useState(() => {
    if (typeof window === "undefined") return 0;
    try {
      return localStorage.getItem("ci-visited") === "1" ? 4 : 0;
    } catch {
      return 0;
    }
  });

  // Autoplay timeline for first-time visitors — the full ~10s sequence.
  // Nothing here locks scroll; this section is a normal-height block, so a
  // visitor who scrolls immediately just moves past it.
  useEffect(() => {
    try {
      localStorage.setItem("ci-visited", "1");
    } catch {
      /* localStorage unavailable — always show the full sequence */
    }
    if (stage === 4) return;
    const timers = [
      setTimeout(() => setStage(1), T_LAUNCH),
      setTimeout(() => setStage(2), T_GATE),
      setTimeout(() => setStage(3), T_FLASH),
      setTimeout(() => setStage(4), T_ARRIVAL),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on mount using the initial `stage` value only
  }, []);

  /* Ambient sound (opt-in, synthesized) */
  const { enabled: soundOn, toggle: toggleSound } = useAmbientSound(stage);

  /* City wake-up cascade: once arrival begins, ramp a 0→1 value over time
     (was scroll-driven; now time-driven via framer's imperative animate()). */
  const [wake, setWake] = useState(0);
  useEffect(() => {
    if (stage < 4) return;
    const controls = animate(0, 1, {
      duration: 1.8,
      ease: [0.21, 0.6, 0.35, 1],
      onUpdate: setWake,
    });
    return () => controls.stop();
  }, [stage]);

  /* Editorial split layout on desktop: copy left, machine right. */
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const zoomOrigin = desktop ? "63% 46%" : "50% 52%";

  /* Mouse parallax in the AI world (desktop pointer only) */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 55, damping: 18 });
  const smy = useSpring(my, { stiffness: 55, damping: 18 });
  const panelsX = useTransform(smx, (v) => v * 16);
  const panelsYm = useTransform(smy, (v) => v * 10);
  const cityX = useTransform(smx, (v) => v * -7);

  if (reduce) return <Hero />;

  const screenPhase: 0 | 1 = stage === 0 ? 0 : 1;
  const officeVisible = stage <= 1;
  const gateVisible = stage === 1 || stage === 2;
  const flashVisible = stage === 3;
  const worldVisible = stage >= 3;

  return (
    <section
      className="relative min-h-[100dvh] overflow-hidden bg-navy-950"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
        my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
      }}
    >
      {/* Stage marker */}
      <div
        aria-hidden="true"
        className="absolute bottom-5 left-5 z-30 flex items-center gap-3 font-mono text-[0.62rem] tracking-[0.3em] text-white/45"
      >
        <span className="h-px w-8 bg-white/25" />
        {stageLabels[stage]}
      </div>

      {/* Ambient sound toggle (opt-in) */}
      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={soundOn}
        aria-label={soundOn ? "Turn ambient sound off" : "Turn ambient sound on"}
        className="absolute bottom-4 right-4 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-navy-900/60 text-ice-300 backdrop-blur-sm transition-colors hover:border-steel-400/60 hover:text-white"
      >
        {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>

      {/* ============ STAGE 0–1 — the analog world ============ */}
      {officeVisible && (
        <motion.div
          initial={false}
          animate={{
            scale: stage === 1 ? 26 : 1,
            opacity: stage === 1 ? 0 : 1,
          }}
          transition={{ duration: stage === 1 ? 0.7 : 0, ease: [0.6, 0, 0.9, 0.4] }}
          style={{ transformOrigin: zoomOrigin }}
          className="absolute inset-0 will-change-transform"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 55% 38%, #2a241b 0%, #171310 55%, #0a0806 100%)" }}
          />
          {/* Warm desk-lamp glow + drifting dust motes */}
          <div
            aria-hidden="true"
            className="absolute left-[4%] top-[10%] h-[50%] w-[40%] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(214,160,74,0.13), transparent 70%)" }}
          />
          {[[10, 22, 0], [16, 34, 2.2], [22, 18, 4.1], [28, 38, 1.3], [13, 46, 3.2], [25, 28, 5.4]].map(([l, t, d], i) => (
            <span
              key={i}
              aria-hidden="true"
              className="float-slower absolute h-[2px] w-[2px] rounded-full bg-[#d6a04a]/45"
              style={{ left: `${l}%`, top: `${t}%`, animationDelay: `${d}s` }}
            />
          ))}
          {/* Desk */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[22%]"
            style={{ background: "linear-gradient(to bottom, #43331f, #241a10)" }}
          />
          {/* Green phosphor glow spilling onto the desk */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[74%] h-[20%] w-[48%] -translate-x-1/2 rounded-full lg:left-[63%]"
            style={{ background: "radial-gradient(ellipse, rgba(62,180,92,0.13), transparent 68%)" }}
          />
          {/* Film-grain texture + vignette */}
          <div aria-hidden="true" className="grain absolute inset-0" />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ boxShadow: "inset 0 0 180px 60px rgba(0,0,0,0.65)" }}
          />
          <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 lg:left-[63%] lg:top-[52%]">
            <OldComputer phase={screenPhase} />
          </div>
        </motion.div>
      )}

      {/* Phase A copy — editorial left column on desktop, top block on mobile */}
      {stage === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-x-0 top-[calc(72px+2svh)] z-10 px-6 text-center lg:inset-x-auto lg:left-[6%] lg:top-1/2 lg:w-[31%] lg:-translate-y-1/2 lg:px-0 lg:text-left"
        >
          <p className="font-display text-[0.66rem] font-semibold tracking-[0.3em] text-[#c9a35c] uppercase">
            Chapter one — the way it&apos;s always been
          </p>
          <h1 className="mx-auto mt-3 max-w-xl font-grotesk text-[clamp(1.6rem,5.2svh,2.4rem)] font-semibold leading-[1.12] text-[#f3eddc] [text-shadow:0_2px_28px_rgba(0,0,0,0.9)] lg:mx-0 lg:text-[clamp(1.8rem,4.6vw,3.1rem)]">
            Most operations still live in here.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[clamp(0.78rem,2.4svh,1rem)] leading-relaxed text-[#c2b9a4] [text-shadow:0_1px_12px_rgba(0,0,0,0.9)] lg:mx-0">
            Green screens. Spreadsheets. &ldquo;It&apos;s always worked.&rdquo;
          </p>
        </motion.div>
      )}

      {/* Launch message */}
      {stage === 1 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-x-0 top-[14%] z-10 text-center font-mono text-sm tracking-[0.2em] text-[#52c56d] sm:text-lg"
        >
          &gt; INITIATING TRANSFER_
        </motion.p>
      )}

      {/* ============ STAGE 1–2 — WARP TUNNEL + BRAND GATE ============ */}
      {gateVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
            className="absolute inset-0 z-10"
          >
            <div className="absolute inset-0 bg-[#040a14]" />
            <div className="warp-lines absolute inset-0" />
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(circle at 50% 47%, rgba(74,143,212,0.28), transparent 55%)" }}
            />
          </motion.div>

          {/* The brand holds at the gate, then blasts forward into the flash */}
          <motion.div
            initial={{ opacity: 0, scale: 0.35 }}
            animate={{ opacity: 1, scale: stage === 2 ? 1 : 0.35 }}
            transition={{ duration: 0.6, ease: [0.21, 0.6, 0.35, 1] }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center will-change-transform"
          >
            <span aria-hidden="true" className="gate-breathe absolute h-64 w-64 rounded-full bg-steel-400/30 blur-3xl" />
            <span
              aria-hidden="true"
              className="gate-breathe absolute h-44 w-44 rounded-full border border-steel-300/30"
              style={{ animationDelay: "1.4s" }}
            />
            {/* Orbiting particles during the hold */}
            <span aria-hidden="true" className="orbit absolute h-48 w-48">
              <span className="absolute left-1/2 top-0 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-[#7dd3fc] shadow-[0_0_10px_#7dd3fc]" />
            </span>
            <span aria-hidden="true" className="orbit absolute h-64 w-64" style={{ animationDuration: "10s", animationDirection: "reverse" }}>
              <span className="absolute left-1/2 top-0 h-[4px] w-[4px] -translate-x-1/2 rounded-full bg-steel-300 shadow-[0_0_8px_rgb(111_171_227/0.9)]" />
            </span>
            <CatalystMark size={92} />
            <p className="mt-5 font-display text-2xl font-semibold tracking-[0.24em] text-white [text-shadow:0_0_30px_rgba(74,143,212,0.9)]">
              CATALYST
            </p>
            <p className="mt-1 font-display text-[0.75rem] tracking-[0.55em] text-ice-300">
              INNOVATIONS
            </p>
            <p className="mt-4 font-display text-[0.7rem] font-semibold tracking-[0.32em] text-steel-300 uppercase">
              Make more · Save time · Work smarter
            </p>
          </motion.div>
        </>
      )}

      {/* ============ STAGE 3 — TELEPORTER FLASH + SHOCKWAVE ============ */}
      {flashVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.4, times: [0, 0.35, 1] }}
            aria-hidden="true"
            className="absolute inset-0 z-20"
          >
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at 50% 50%, #ffffff 0%, #a8cbef 30%, rgba(10,22,40,0) 75%)" }}
            />
          </motion.div>
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0.65, scale: 0.2 }}
            animate={{ opacity: 0, scale: 3.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ x: "-50%", y: "-50%" }}
            className="absolute left-1/2 top-1/2 z-20 h-[46vmin] w-[46vmin] rounded-full border-2 border-[#a8cbef] shadow-[0_0_40px_rgb(168_203_239/0.5),inset_0_0_40px_rgb(168_203_239/0.3)]"
          />
        </>
      )}

      {/* ============ STAGE 3–4 — the AI world (permanent resting state) ============ */}
      {worldVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 1.18 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.21, 0.6, 0.35, 1] }}
          className="absolute inset-0 will-change-transform"
        >
          {/* Deep-space backdrop */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 50% 30%, #0d1f3c 0%, #050b16 60%, #02050c 100%)" }}
          />
          {/* Rotating light beams */}
          <div
            aria-hidden="true"
            className="beam-spin absolute left-1/2 top-[42%] h-[150vmax] w-[150vmax] -translate-x-1/2 -translate-y-1/2 opacity-35"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(74,143,212,0.18) 18deg, transparent 40deg, transparent 100deg, rgba(125,211,252,0.13) 118deg, transparent 140deg, transparent 200deg, rgba(74,143,212,0.15) 220deg, transparent 245deg, transparent 300deg, rgba(125,211,252,0.1) 318deg, transparent 340deg)",
            }}
          />
          {/* The city on the horizon */}
          <motion.div
            aria-hidden="true"
            initial={{ y: 46 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, ease: [0.21, 0.6, 0.35, 1] }}
            style={{ x: cityX }}
            className="absolute inset-x-0 bottom-[40%] h-[26%] will-change-transform"
          >
            <CitySkyline wake={wake} />
            {/* Maglev light-trail crossing the skyline */}
            <div className="absolute bottom-[6%] left-0 right-0 h-px overflow-visible">
              <span
                className="maglev absolute h-[2.5px] w-36 rounded-full"
                style={{ background: "linear-gradient(90deg, transparent, #7dd3fc, #a8cbef, transparent)", boxShadow: "0 0 12px rgba(125,211,252,0.8)" }}
              />
            </div>
            {/* Drifting drone lights */}
            {[["18%", "22%", "0s"], ["62%", "10%", "3.5s"], ["84%", "30%", "7s"]].map(([l, t, d], i) => (
              <span
                key={i}
                className="drone absolute h-[3px] w-[3px] rounded-full bg-[#7dd3fc]"
                style={{ left: l, top: t, animationDelay: d, boxShadow: "0 0 8px rgba(125,211,252,0.9)" }}
              />
            ))}
          </motion.div>

          {/* Perspective grid floor */}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[46%] [perspective:520px]">
            <div
              className="grid-floor absolute inset-[-40%_-20%_0] origin-bottom [transform:rotateX(63deg)]"
              style={{
                maskImage: "linear-gradient(to top, rgba(0,0,0,0.9) 30%, transparent 95%)",
                WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.9) 30%, transparent 95%)",
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-full"
              style={{ background: "linear-gradient(to top, transparent 55%, rgba(5,11,22,0.9))" }}
            />
          </div>
          {/* Aurora blobs */}
          <div aria-hidden="true" className="hue-drift absolute -left-40 top-1/4 h-[480px] w-[480px] rounded-full bg-steel-600/25 blur-[130px] animate-drift" />
          <div aria-hidden="true" className="hue-drift absolute -right-24 top-0 h-[420px] w-[420px] rounded-full bg-[#22d3ee]/10 blur-[120px]" style={{ animationDelay: "6s" }} />

          {/* Data particles */}
          {stars.map(([x, y, s, d], i) => (
            <span
              key={i}
              aria-hidden="true"
              className="twinkle absolute rounded-full bg-steel-300"
              style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, animationDelay: `${d}s` }}
            />
          ))}
          {/* Shooting light streaks */}
          {[0, 2.4, 4.8].map((d, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="streak absolute h-px w-40"
              style={{
                top: `${18 + i * 22}%`,
                background: "linear-gradient(90deg, transparent, rgba(125,211,252,0.9), transparent)",
                animationDelay: `${d}s`,
              }}
            />
          ))}

          {/* Floating intelligence panels (with cursor parallax) */}
          <motion.div style={{ x: panelsX, y: panelsYm }} className="absolute inset-0">
            {worldPanels.map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: [0.21, 0.6, 0.35, 1] }}
                style={{ left: w.x, top: w.y, rotate: w.rot }}
                className="absolute z-10 hidden lg:[@media(min-height:560px)]:block"
              >
                <div className={`${w.cls} w-44 rounded-xl bg-gradient-to-br from-steel-400/50 via-white/10 to-transparent p-px lg:w-52`}>
                  <div className="rounded-[11px] bg-navy-900/85 p-4 shadow-[0_0_36px_rgb(74_143_212/0.16)] backdrop-blur-md">
                    <p className="text-[0.58rem] font-bold tracking-[0.18em] text-steel-300">{w.title}</p>
                    <p className="mt-1 font-display text-lg font-semibold text-white">{w.value}</p>
                    <p className="mt-0.5 text-[0.68rem] text-ice-300">{w.sub}</p>
                    <Sparkline points={w.spark} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Center: the core ignites */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-5 text-center">
            <motion.div
              initial={{ scale: 2.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.21, 0.6, 0.35, 1] }}
              className="relative"
            >
              <span aria-hidden="true" className="ring-pulse absolute inset-[-18px] rounded-full border border-steel-300/50" />
              <span aria-hidden="true" className="ring-pulse absolute inset-[-18px] rounded-full border border-[#7dd3fc]/40" style={{ animationDelay: "1.3s" }} />
              <span aria-hidden="true" className="absolute inset-0 -z-10 scale-[2] rounded-full bg-steel-400/30 blur-2xl" />
              <CatalystMark size={80} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 36, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.21, 0.6, 0.35, 1] }}
              className="mt-7 max-w-3xl"
            >
              <p className="font-display text-[0.68rem] font-semibold tracking-[0.3em] text-[#7dd3fc] uppercase">
                Welcome to the other side
              </p>
              <h2 className="mt-3 font-grotesk text-[clamp(1.7rem,6svh,3.6rem)] font-semibold leading-[1.08] tracking-tight text-white">
                Turn operational problems into{" "}
                <span className="bg-gradient-to-r from-[#7dd3fc] via-steel-300 to-steel-400 bg-clip-text text-transparent">
                  intelligent systems.
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[clamp(0.82rem,2.4svh,1.1rem)] leading-relaxed text-ice-300">
                Catalyst Innovations combines real-world operational experience, modern
                software, automation, and practical AI to help organizations make more
                money, save time, and work smarter.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.85 }}
              className="mt-7 flex flex-col items-center gap-4 sm:flex-row"
            >
              <ButtonLink
                href="/consultation"
                onClick={() => track("cta_consultation_click", { location: "portal_hero" })}
                className="text-base"
              >
                Request a Consultation
              </ButtonLink>
              <ButtonLink href="/solutions" variant="ghost-dark" className="text-base">
                Explore Our Solutions
              </ButtonLink>
              <Link
                href="/portfolio"
                className="text-sm font-medium text-steel-300 underline-offset-4 hover:text-white hover:underline"
              >
                See what we&apos;re building →
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
