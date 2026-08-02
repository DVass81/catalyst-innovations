"use client";

import {
  motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

/**
 * "One day, two realities" — a scroll-driven clock advances from 7:00 AM to
 * 5:00 PM. At each beat, the same moment plays out twice: the manual way on
 * the left, the Catalyst way on the right.
 */

const beats = [
  {
    time: "7:00 AM",
    before: "The supervisor prints yesterday's production report. It's already stale.",
    after: "The dashboard updated overnight. Exceptions were flagged before coffee.",
  },
  {
    time: "8:30 AM",
    before: "Purchasing re-types requisitions from emails into the system. Again.",
    after: "Requests came in from the floor; approvals are already routing.",
  },
  {
    time: "10:00 AM",
    before: "“Did the parts ship?” Third phone call to the supplier this week.",
    after: "PO tracking shows the truck is 40 miles out. Nobody had to call.",
  },
  {
    time: "12:00 PM",
    before: "A quality issue from last month resurfaces. Nobody logged the fix.",
    after: "The corrective-action record shows root cause, fix, and who verified it.",
  },
  {
    time: "2:00 PM",
    before: "A manager starts building a spreadsheet for tomorrow's meeting.",
    after: "One click: today's numbers, formatted, shared with the team.",
  },
  {
    time: "4:30 PM",
    before: "Paper timesheets and travelers get carried to the office in a stack.",
    after: "Everything synced as it happened. There's nothing to carry.",
  },
  {
    time: "5:00 PM",
    before: "Leadership still isn't sure what today actually cost.",
    after: "Leaders end the day knowing — not guessing.",
  },
];

const N = beats.length;

/** "Keep scrolling" hint that swaps to the closing line as the day ends. */
function ScrollHint({ p }: { p: MotionValue<number> }) {
  const hintOpacity = useTransform(p, [0.75, 0.85], [1, 0]);
  const closeOpacity = useTransform(p, [0.85, 0.95], [0, 1]);
  return (
    <div className="relative mt-8 h-6 text-center text-sm">
      <motion.p style={{ opacity: hintOpacity }} className="absolute inset-x-0 text-silver-400">
        Keep scrolling — the day isn&apos;t over yet.
      </motion.p>
      <motion.p style={{ opacity: closeOpacity }} className="absolute inset-x-0 font-medium text-steel-300">
        Same day. Same people. Different system.
      </motion.p>
    </div>
  );
}

function Beat({ i, p }: { i: number; p: MotionValue<number> }) {
  const start = i / N;
  const end = (i + 1) / N;
  const fadePad = 0.25 / N;
  const opacity = useTransform(
    p,
    i === 0
      ? [start, start + 0.001, end - fadePad, end]
      : i === N - 1
        ? [start, start + fadePad, 1, 1]
        : [start, start + fadePad, end - fadePad, end],
    i === 0 ? [1, 1, 1, 0] : i === N - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(p, [start, start + fadePad], i === 0 ? [0, 0] : [26, 0]);
  const b = beats[i];
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0 grid gap-4 md:grid-cols-2 md:gap-8">
      {/* The old way */}
      <div className="flex flex-col rounded-card border border-white/10 bg-navy-850/80 p-5 sm:p-7">
        <p className="flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.22em] text-silver-400 uppercase">
          <XCircle size={14} className="text-danger/80" /> The old way
        </p>
        <p className="mt-4 text-base leading-relaxed text-ice-300 sm:text-lg">{b.before}</p>
      </div>
      {/* With Catalyst */}
      <div className="flex flex-col rounded-card border border-steel-400/40 bg-navy-800/90 p-5 shadow-[0_0_32px_rgb(74_143_212/0.12)] sm:p-7">
        <p className="flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.22em] text-steel-300 uppercase">
          <CheckCircle2 size={14} className="text-success" /> With Catalyst
        </p>
        <p className="mt-4 text-base leading-relaxed text-white sm:text-lg">{b.after}</p>
      </div>
    </motion.div>
  );
}

export default function DayStory() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: pRaw } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Spring smooths motion and forces the JS scroll driver (see PortalHero note).
  const p = useSpring(pRaw, { stiffness: 150, damping: 27, mass: 0.35, restDelta: 0.0005 });

  const timeLabel = useTransform(p, (v) => beats[Math.min(N - 1, Math.max(0, Math.floor(v * N)))].time);
  // Sun/da­y arc: a dot travels along the timeline as the day advances.
  const sunX = useTransform(p, [0, 1], ["0%", "100%"]);

  if (reduce) {
    return (
      <section className="bg-navy-900 py-20 text-white">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <p className="font-display text-xs font-semibold tracking-[0.28em] text-steel-300 uppercase">One day, two realities</p>
          <h2 className="mt-3 font-display text-3xl font-semibold">The same workday, with and without Catalyst.</h2>
          <div className="mt-10 space-y-8">
            {beats.map((b) => (
              <div key={b.time}>
                <p className="font-display text-lg font-semibold text-steel-300">{b.time}</p>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  <p className="rounded-card border border-white/10 bg-navy-850 p-5 text-ice-300">{b.before}</p>
                  <p className="rounded-card border border-steel-400/40 bg-navy-800 p-5 text-white">{b.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div ref={ref} className="relative h-[380svh] bg-navy-900">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-steel-600/15 blur-[120px]"
        />
        <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
          <p className="text-center font-display text-[0.7rem] font-semibold tracking-[0.3em] text-steel-300 uppercase">
            One day · Two realities
          </p>

          {/* The clock */}
          <motion.p
            aria-live="off"
            className="mt-4 text-center font-display text-5xl font-semibold tabular-nums tracking-tight text-white sm:text-7xl"
          >
            {timeLabel}
          </motion.p>

          {/* Day timeline with traveling dot */}
          <div className="relative mx-auto mt-6 h-px w-full max-w-md bg-white/15" aria-hidden="true">
            <motion.span
              style={{ left: sunX }}
              className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-steel-300 shadow-[0_0_16px_rgb(111_171_227/0.8)]"
            />
            <span className="absolute -left-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white/30" />
            <span className="absolute -right-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white/30" />
          </div>

          {/* Beat stage */}
          <div className="relative mt-10 h-[300px] sm:h-[240px]">
            {beats.map((_, i) => (
              <Beat key={i} i={i} p={p} />
            ))}
          </div>

          <ScrollHint p={p} />
        </div>
      </div>
    </div>
  );
}
