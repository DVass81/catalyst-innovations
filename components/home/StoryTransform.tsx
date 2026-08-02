"use client";

import {
  motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle, ArrowRight, CheckCircle2, Eye, FileSpreadsheet, FileText, Inbox, Phone, Zap,
} from "lucide-react";

/**
 * Four-act scroll story: scattered manual-work artifacts are diagnosed,
 * reorganized into one connected intelligent system, then the payoff lands.
 *
 * Act I   (0.00–0.26)  chaos
 * Act II  (0.28–0.48)  diagnosis — bottleneck flags
 * Act III (0.50–0.74)  transformation — cards fly to grid, lines draw
 * Act IV  (0.76–1.00)  payoff — system hums, outcomes fade in
 */

type Chaos = {
  icon: React.ReactNode;
  label: string;
  sub: string;
  cx: number; cy: number; rot: number; // scattered
  gx: number; gy: number;              // final grid
  fixedLabel: string;
};

const cards: Chaos[] = [
  { icon: <FileSpreadsheet size={18} />, label: "Master Spreadsheet v14_FINAL", sub: "3 people editing", cx: 6, cy: 12, rot: -7, gx: 4, gy: 6, fixedLabel: "Live operations dashboard" },
  { icon: <Inbox size={18} />, label: "Approval stuck in inbox", sub: "Waiting 4 days", cx: 66, cy: 6, rot: 5, gx: 54, gy: 6, fixedLabel: "Automated approval routing" },
  { icon: <FileText size={18} />, label: "Paper work order #4417", sub: "Location unknown", cx: 30, cy: 34, rot: -3, gx: 4, gy: 41, fixedLabel: "Digital work orders" },
  { icon: <Phone size={18} />, label: '"Did the parts ship?"', sub: "Third call today", cx: 74, cy: 44, rot: 8, gx: 54, gy: 41, fixedLabel: "Real-time order tracking" },
  { icon: <FileSpreadsheet size={18} />, label: "Re-typed into 3 systems", sub: "Every single day", cx: 12, cy: 62, rot: 6, gx: 4, gy: 76, fixedLabel: "One connected data flow" },
  { icon: <Inbox size={18} />, label: "Month-end surprise", sub: "Found too late", cx: 58, cy: 70, rot: -6, gx: 54, gy: 76, fixedLabel: "Predictive risk alerts" },
];

// Node centers (in % of stage) once cards settle into the grid.
const centers: [number, number][] = [
  [25, 12], [75, 12], [25, 47], [75, 47], [25, 82], [75, 82],
];
const links: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5],
];

const MOVE: [number, number] = [0.5, 0.7];
const DRAW: [number, number] = [0.68, 0.82];

function StoryCard({ c, p }: { c: Chaos; p: MotionValue<number> }) {
  const left = useTransform(p, MOVE, [`${c.cx}%`, `${c.gx}%`]);
  const top = useTransform(p, MOVE, [`${c.cy}%`, `${c.gy}%`]);
  const rotate = useTransform(p, MOVE, [c.rot, 0]);
  const flagOpacity = useTransform(p, [0.27, 0.34, 0.5, 0.58], [0, 1, 1, 0]);
  const flagScale = useTransform(p, [0.27, 0.34], [0.5, 1]);
  // Gentle idle wobble during chaos, killed once diagnosis begins.
  const chaosOpacity = useTransform(p, [0.56, 0.72], [1, 0]);
  const fixedOpacity = useTransform(p, [0.66, 0.78], [0, 1]);
  const glow = useTransform(p, [0.78, 0.9], ["0 0 0px rgba(74,143,212,0)", "0 0 24px rgba(74,143,212,0.35)"]);

  return (
    <motion.div style={{ left, top, rotate }} className="absolute w-[44%] sm:w-[40%] lg:w-[42%]">
      <motion.div
        style={{ boxShadow: glow }}
        className="relative rounded-xl border border-white/12 bg-navy-800/90 p-3.5 backdrop-blur-sm sm:p-4"
      >
        <motion.span
          style={{ opacity: flagOpacity, scale: flagScale }}
          className="absolute -right-2 -top-2 z-10 inline-flex items-center gap-1 rounded-full bg-warning px-2 py-0.5 text-[0.6rem] font-bold text-navy-950"
        >
          <AlertTriangle size={10} /> BOTTLENECK
        </motion.span>

        <motion.div style={{ opacity: chaosOpacity }}>
          <div className="flex items-center gap-2 text-ice-300">
            {c.icon}
            <span className="truncate text-[0.78rem] font-medium text-ice-100 sm:text-sm">{c.label}</span>
          </div>
          <p className="mt-1 text-[0.68rem] text-silver-400 sm:text-xs">{c.sub}</p>
        </motion.div>

        <motion.div
          style={{ opacity: fixedOpacity }}
          className="absolute inset-0 flex items-center gap-2 rounded-xl border border-steel-400/50 bg-navy-700/95 px-3.5"
        >
          <CheckCircle2 size={18} className="shrink-0 text-success" />
          <span className="text-[0.78rem] font-semibold text-white sm:text-sm">{c.fixedLabel}</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/** Connection lines that draw themselves as the system comes online. */
function Wires({ p }: { p: MotionValue<number> }) {
  const pathLength = useTransform(p, DRAW, [0, 1]);
  const opacity = useTransform(p, [DRAW[0], DRAW[0] + 0.04], [0, 1]);
  const pulseOpacity = useTransform(p, [0.84, 0.92], [0, 1]);
  return (
    <motion.svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity }}
      aria-hidden="true"
    >
      {links.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={centers[a][0]} y1={centers[a][1]} x2={centers[b][0]} y2={centers[b][1]}
          stroke="rgba(111,171,227,0.55)"
          strokeWidth="0.35"
          style={{ pathLength }}
        />
      ))}
      {/* Data pulses once the system is live */}
      <motion.g style={{ opacity: pulseOpacity }}>
        {links.map(([a, b], i) => (
          <circle key={`p${i}`} r="0.7" fill="#6FABE3">
            <animateMotion
              dur={`${2 + (i % 3)}s`}
              repeatCount="indefinite"
              path={`M ${centers[a][0]} ${centers[a][1]} L ${centers[b][0]} ${centers[b][1]}`}
            />
          </circle>
        ))}
      </motion.g>
    </motion.svg>
  );
}

const captions = [
  {
    range: [0.02, 0.26] as const,
    eyebrow: "Act I — Today",
    title: "This is how most businesses actually run.",
    text: "Spreadsheets, inboxes, paper, and phone calls — held together by your most patient employees.",
  },
  {
    range: [0.28, 0.48] as const,
    eyebrow: "Act II — Diagnosis",
    title: "We find where the time and money leak out.",
    text: "Bottlenecks, duplicate work, disconnected data, and blind spots — identified with people who've run operations for decades.",
  },
  {
    range: [0.5, 0.74] as const,
    eyebrow: "Act III — Transformation",
    title: "Then we build the intelligent system around your real workflow.",
    text: "Connected, automated, and visible — so people do the judgment work and software does the paperwork.",
  },
  {
    range: [0.76, 0.99] as const,
    eyebrow: "Act IV — The payoff",
    title: "And the whole operation starts to hum.",
    text: "Data flows instead of being carried. Risks announce themselves early. Leaders end the day knowing — not guessing.",
  },
];

function Caption({ p, c }: { p: MotionValue<number>; c: (typeof captions)[number] }) {
  const [a, b] = c.range;
  const opacity = useTransform(p, [a, a + 0.04, b - 0.04, b], [0, 1, 1, 0]);
  const y = useTransform(p, [a, a + 0.04], [24, 0]);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0">
      <p className="font-display text-[0.7rem] font-semibold tracking-[0.28em] text-steel-300 uppercase">
        {c.eyebrow}
      </p>
      <h2 className="mt-3 font-grotesk text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl">
        {c.title}
      </h2>
      <p className="mt-4 max-w-md text-base leading-relaxed text-ice-300">{c.text}</p>
    </motion.div>
  );
}

/** Left-side act rail: four dots that light as the story advances. */
function ActRail({ act }: { act: number }) {
  return (
    <div className="absolute left-3 top-1/2 hidden -translate-y-1/2 flex-col items-center lg:flex" aria-hidden="true">
      {captions.map((c, i) => (
        <div key={c.eyebrow} className="flex flex-col items-center">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full border font-display text-[0.65rem] font-bold transition-all duration-500 ${
              i === act
                ? "scale-110 border-steel-400 bg-navy-800 text-steel-300"
                : "border-white/15 bg-navy-900 text-silver-500 opacity-50"
            }`}
          >
            {["I", "II", "III", "IV"][i]}
          </span>
          {i < captions.length - 1 && <span className="h-10 w-px bg-steel-400/25" />}
        </div>
      ))}
    </div>
  );
}

/** Payoff overlay: outcome statements over the humming system. */
function Payoff({ p }: { p: MotionValue<number> }) {
  const opacity = useTransform(p, [0.84, 0.94], [0, 1]);
  const y = useTransform(p, [0.84, 0.94], [24, 0]);
  const items = [
    { icon: <Zap size={15} />, text: "Approvals in hours, not days" },
    { icon: <Eye size={15} />, text: "One version of the truth" },
    { icon: <CheckCircle2 size={15} />, text: "Problems surfaced before they cost you" },
  ];
  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-auto absolute inset-x-3 bottom-3 sm:inset-x-6 sm:bottom-5"
    >
      <div className="rounded-xl border border-steel-400/40 bg-navy-900/90 p-4 backdrop-blur-md sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            {items.map((it) => (
              <li key={it.text} className="flex items-center gap-2 text-[0.78rem] font-medium text-ice-100">
                <span className="text-steel-300">{it.icon}</span>
                {it.text}
              </li>
            ))}
          </ul>
          <Link
            href="#roi"
            className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-lg bg-steel-400 px-4 text-[0.8rem] font-semibold text-white transition-colors hover:bg-steel-500"
          >
            Run your numbers <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function StoryTransform() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: pRaw } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Spring smooths motion and forces the JS scroll driver (see PortalHero note).
  const p = useSpring(pRaw, { stiffness: 150, damping: 27, mass: 0.35, restDelta: 0.0005 });
  const stageBg = useTransform(p, [0.5, 0.85], ["rgba(5,11,22,1)", "rgba(13,28,51,1)"]);
  const stageBorder = useTransform(p, [0.7, 0.9], ["rgba(255,255,255,0.1)", "rgba(74,143,212,0.45)"]);

  const [act, setAct] = useState(0);
  useMotionValueEvent(p, "change", (v) => {
    const idx = captions.findIndex((c) => v >= c.range[0] && v <= c.range[1]);
    if (idx !== -1 && idx !== act) setAct(idx);
  });

  if (reduce) {
    return (
      <section className="bg-navy-950 py-20 text-white">
        <div className="mx-auto max-w-4xl space-y-12 px-5 sm:px-8">
          {captions.map((c) => (
            <div key={c.eyebrow}>
              <p className="font-display text-xs font-semibold tracking-[0.28em] text-steel-300 uppercase">{c.eyebrow}</p>
              <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{c.title}</h2>
              <p className="mt-3 max-w-xl text-ice-300">{c.text}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div ref={ref} className="relative h-[400svh] bg-navy-950">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <ActRail act={act} />
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:pl-16">
          <div className="relative flex h-48 items-start lg:h-72">
            {captions.map((c) => (
              <Caption key={c.eyebrow} p={p} c={c} />
            ))}
          </div>

          <motion.div
            style={{ backgroundColor: stageBg, borderColor: stageBorder }}
            className="relative h-[48svh] rounded-2xl border lg:h-[64svh]"
          >
            <div className="bg-grid-dark absolute inset-0 rounded-2xl" aria-hidden="true" />
            <div className="absolute inset-4 sm:inset-6">
              <Wires p={p} />
              {cards.map((c) => (
                <StoryCard key={c.label} c={c} p={p} />
              ))}
            </div>
            <Payoff p={p} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
