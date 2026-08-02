"use client";

import {
  motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { methodStages } from "@/data/content";
import { Icon } from "../Icon";
import { HexFrame, ButtonLink, Eyebrow, Heading } from "../ui";
import { Reveal, RevealGroup, RevealItem } from "../Reveal";

/**
 * The Catalyst Method as a cinematic horizontal journey: the section pins and
 * the six stages travel sideways as you scroll, a progress path drawing
 * beneath them and each stage lighting up as it reaches center stage.
 */

function StaticFallback() {
  return (
    <section className="bg-navy-900 py-20 text-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <Eyebrow dark>How we work</Eyebrow>
          <Heading dark>The Catalyst Method</Heading>
        </Reveal>
        <RevealGroup className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {methodStages.map((m) => (
            <RevealItem key={m.n}>
              <div className="h-full rounded-card border border-white/12 bg-navy-800/70 p-6">
                <span className="font-display text-sm font-semibold text-steel-300">Stage {m.n}</span>
                <h3 className="mt-2 font-display text-lg font-semibold">{m.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ice-300">{m.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal className="mt-10">
          <ButtonLink href="/method" variant="ghost-dark">
            Explore the method <ArrowRight size={16} />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

export default function MethodJourney() {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [shift, setShift] = useState(0);
  const [active, setActive] = useState(0);

  const { scrollYProgress: pRaw } = useScroll({ target: outerRef, offset: ["start start", "end end"] });
  // Spring smooths the horizontal travel and forces the JS scroll driver.
  const p = useSpring(pRaw, { stiffness: 150, damping: 27, mass: 0.35, restDelta: 0.0005 });
  const x = useTransform(p, [0.06, 0.94], [0, -1], { clamp: true });
  const trackX = useTransform(x, (v) => v * shift);
  const pathScale = useTransform(p, [0.06, 0.94], [0, 1]);

  // Measure how far the track must travel (content width − viewport width).
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const overflow = track.scrollWidth - window.innerWidth;
      setShift(Math.max(0, overflow + 48)); // small end padding
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useMotionValueEvent(p, "change", (v) => {
    const idx = Math.min(methodStages.length - 1, Math.max(0, Math.floor(((v - 0.06) / 0.88) * methodStages.length)));
    if (idx !== active) setActive(idx);
  });

  if (reduce) return <StaticFallback />;

  return (
    <div ref={outerRef} className="relative h-[400svh] bg-navy-900">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto mb-10 w-full max-w-7xl px-5 sm:px-8">
          <Eyebrow dark>How we work — scroll to travel the journey</Eyebrow>
          <Heading dark>The Catalyst Method</Heading>
        </div>

        {/* Traveling track */}
        <div className="relative">
          {/* Progress path */}
          <div className="absolute left-0 right-0 top-[92px] h-px bg-white/10" aria-hidden="true">
            <motion.div
              style={{ scaleX: pathScale }}
              className="h-full origin-left bg-gradient-to-r from-steel-600 via-steel-400 to-steel-300"
            />
          </div>

          <motion.div
            ref={trackRef}
            style={{ x: trackX }}
            className="flex w-max gap-6 pl-5 pr-16 sm:gap-8 sm:pl-8 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]"
          >
            {methodStages.map((m, i) => {
              const isActive = i === active;
              return (
                <article
                  key={m.n}
                  className={`relative w-[min(78vw,380px)] shrink-0 rounded-card border p-7 transition-all duration-500 sm:p-8 ${
                    isActive
                      ? "border-steel-400/60 bg-navy-800 shadow-[0_0_40px_rgb(74_143_212/0.18)]"
                      : "border-white/10 bg-navy-850/70 opacity-60"
                  }`}
                >
                  <span
                    className={`absolute -top-[13px] left-8 flex h-[26px] items-center rounded-full border px-3 font-display text-[0.65rem] font-bold transition-colors duration-500 ${
                      isActive
                        ? "border-steel-400 bg-steel-400 text-navy-950"
                        : "border-white/20 bg-navy-900 text-silver-400"
                    }`}
                  >
                    STAGE {m.n} OF 6
                  </span>
                  <div className="mt-4 flex items-center gap-4">
                    <HexFrame dark>
                      <Icon name={m.icon} />
                    </HexFrame>
                    <h3 className="font-grotesk text-2xl font-semibold text-white">{m.name}</h3>
                  </div>
                  <p className="mt-5 text-[0.95rem] leading-relaxed text-ice-300">{m.text}</p>
                </article>
              );
            })}

            {/* Journey's end card */}
            <div className="flex w-[min(78vw,380px)] shrink-0 flex-col items-start justify-center rounded-card border border-steel-400/50 bg-gradient-to-br from-navy-800 to-navy-700 p-8">
              <p className="font-display text-xl font-semibold leading-snug text-white">
                Then we do it again — because operations never stop improving.
              </p>
              <Link
                href="/method"
                className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-steel-400 px-5 text-sm font-semibold text-white transition-colors hover:bg-steel-500"
              >
                Explore the full method <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stage dots */}
        <div className="relative mx-auto mt-10 flex gap-2.5" aria-hidden="true">
          {methodStages.map((m, i) => (
            <span
              key={m.n}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === active ? "w-8 bg-steel-300" : "w-2 bg-white/25"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
