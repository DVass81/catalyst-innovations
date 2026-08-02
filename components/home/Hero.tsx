"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import { CatalystMark } from "../Logo";
import { ButtonLink } from "../ui";
import { track } from "@/lib/site";

/** Animated network of connected operation nodes behind the hero copy. */
function OpsNetwork() {
  const nodes = [
    { x: 8, y: 22, label: "Purchasing" },
    { x: 30, y: 8, label: "Production" },
    { x: 55, y: 18, label: "Inventory" },
    { x: 80, y: 10, label: "Quality" },
    { x: 92, y: 34, label: "Shipping" },
    { x: 70, y: 48, label: "AI Insights" },
    { x: 42, y: 42, label: "Dashboards" },
    { x: 16, y: 52, label: "Approvals" },
  ];
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [2, 6], [6, 7], [0, 7], [6, 5], [5, 4], [1, 6],
  ];
  return (
    <svg
      viewBox="0 0 100 60"
      className="h-full w-full opacity-[0.55]"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke="rgba(111,171,227,0.35)"
          strokeWidth="0.25"
          strokeDasharray="1.5 1.5"
          className="animate-dash"
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="1.1" fill="#4A8FD4" />
          <circle cx={n.x} cy={n.y} r="2.4" fill="none" stroke="rgba(74,143,212,0.4)" strokeWidth="0.2" />
          <text x={n.x} y={n.y - 3} textAnchor="middle" fontSize="2.1" fill="rgba(200,214,230,0.75)">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-navy-950 pt-[72px]"
    >
      {/* Layered background */}
      <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: yBg }}
        className="absolute inset-0"
      >
        <div className="absolute -left-40 top-1/4 h-[480px] w-[480px] rounded-full bg-steel-600/25 blur-[130px] animate-drift" />
        <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-steel-400/15 blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 top-1/3 hidden md:block">
          <OpsNetwork />
        </div>
      </motion.div>

      <motion.div
        style={reduce ? undefined : { opacity: fade }}
        className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8"
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.21, 0.6, 0.35, 1] }}
          className="max-w-3xl"
        >
          <div className="mb-8 flex items-center gap-4">
            <CatalystMark size={52} />
            <p className="font-display text-xs font-semibold tracking-[0.3em] text-steel-300 uppercase">
              Make more · Save time · Work smarter
            </p>
          </div>

          <h1 className="font-display text-[2.4rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-[4.2rem]">
            Turn operational problems into{" "}
            <span className="bg-gradient-to-r from-steel-300 to-steel-400 bg-clip-text text-transparent">
              intelligent systems.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ice-300 sm:text-xl">
            Catalyst Innovations combines real-world operational experience, modern software,
            automation, and practical AI to help organizations make more money, save time,
            and work smarter.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <ButtonLink
              href="/consultation"
              onClick={() => track("cta_consultation_click", { location: "hero" })}
              className="text-base"
            >
              Request a Consultation
            </ButtonLink>
            <ButtonLink href="/solutions" variant="ghost-dark" className="text-base">
              Explore Our Solutions
            </ButtonLink>
            <Link
              href="/portfolio"
              className="text-sm font-medium text-steel-300 underline-offset-4 hover:text-white hover:underline sm:ml-2"
            >
              See what we&apos;re building →
            </Link>
          </div>

          <p className="mt-8 text-sm text-silver-400">
            Founded by operators and technologists — built for real work, real teams, and real results.
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ice-300"
        animate={reduce ? undefined : { y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <ChevronDown size={26} />
      </motion.div>
    </section>
  );
}
