"use client";

import { AppWindow, BrainCircuit, FileText, Layers, Phone } from "lucide-react";
import { Eyebrow, Heading, Lead } from "./ui";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

/**
 * The same past-to-future arc the homepage hero tells through animation,
 * told here as a static graphic further down the same page.
 */
const stages = [
  { icon: Phone, era: "Where most start", title: "Paper & phone calls", text: "Work orders on clipboards. Status updates by phone. Nothing connected." },
  { icon: FileText, era: "The workaround", title: "Spreadsheets everywhere", text: "The system everyone actually trusts, held together by one person's memory." },
  { icon: Layers, era: "Point solutions", title: "Disconnected software", text: "Five tools that don't talk to each other, each demanding its own data entry." },
  { icon: AppWindow, era: "The Catalyst Method", title: "Connected systems", text: "Discover, diagnose, design — technology built around how the work actually happens." },
  { icon: BrainCircuit, era: "Where you're headed", title: "Intelligent operations", text: "Risks surfaced early, decisions backed by real data, AI that assists — with people still in control." },
];

export default function AboutTimeline() {
  return (
    <div>
      <Reveal>
        <Eyebrow>The arc we build toward</Eyebrow>
        <Heading>From clipboard to intelligent system.</Heading>
        <Lead>The same transformation, every time — just at a different starting point.</Lead>
      </Reveal>

      <div className="relative mt-14">
        <div
          aria-hidden="true"
          className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-[#c9a35c] via-steel-400 to-[#7dd3fc] lg:left-0 lg:top-7 lg:h-px lg:w-full lg:bg-gradient-to-r"
        />
        <RevealGroup className="grid gap-10 lg:grid-cols-5" stagger={0.08}>
          {stages.map((s, i) => (
            <RevealItem key={s.title}>
              <div className="relative pl-16 lg:pl-0 lg:pt-16">
                <span
                  className="absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-full border bg-white shadow-card lg:-top-0"
                  style={{
                    borderColor: i === 0 ? "#c9a35c" : i === stages.length - 1 ? "#7dd3fc" : "#4A8FD4",
                  }}
                >
                  <s.icon
                    size={22}
                    style={{ color: i === 0 ? "#c9a35c" : i === stages.length - 1 ? "#2f5d8f" : "#2f5d8f" }}
                  />
                </span>
                <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-silver-500 uppercase">{s.era}</p>
                <h3 className="mt-1 font-display text-base font-semibold text-navy-900 dark:text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-700 dark:text-ice-300">{s.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </div>
  );
}
