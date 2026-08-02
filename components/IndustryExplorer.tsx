"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, CheckCircle2, Target, XCircle } from "lucide-react";
import { industries as localIndustries } from "@/data/industries";
import { services as localServices } from "@/data/services";
import type { Industry } from "@/data/industries";
import type { Service } from "@/data/services";
import { Icon } from "./Icon";
import { Section } from "./ui";
import { track } from "@/lib/site";

export default function IndustryExplorer({
  industries = localIndustries,
  services = localServices,
}: {
  industries?: Industry[];
  services?: Service[];
}) {
  const [active, setActive] = useState(industries[0].slug);
  const current = industries.find((i) => i.slug === active) ?? industries[0];

  // Deep-link support: /industries#credit-unions.
  // Deferred a frame so hydration completes before the tab switches.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash || !industries.some((i) => i.slug === hash)) return;
    const id = requestAnimationFrame(() => setActive(hash));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only ever needs to run on mount
  }, []);

  return (
    <Section className="bg-ice-50">
      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Selector */}
        <div role="tablist" aria-label="Industries" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
          {industries.map((i) => {
            const selected = i.slug === active;
            return (
              <button
                key={i.slug}
                role="tab"
                id={i.slug}
                aria-selected={selected}
                aria-controls="industry-panel"
                onClick={() => {
                  setActive(i.slug);
                  track("demo_interaction", { widget: "industry_explorer", industry: i.slug });
                }}
                className={`flex min-h-[48px] shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                  selected
                    ? "border-steel-400 bg-navy-900 text-white"
                    : "border-ice-200 bg-white text-navy-800 hover:border-steel-400/50"
                }`}
              >
                <Icon name={i.icon} size={18} className={selected ? "text-steel-300" : "text-steel-600"} />
                {i.name}
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div id="industry-panel" role="tabpanel" aria-labelledby={current.slug}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="rounded-card border border-ice-200 bg-white p-7 shadow-card sm:p-9"
            >
              <div className="flex items-center gap-3">
                <Icon name={current.icon} size={26} className="text-steel-600" />
                <h2 className="font-display text-2xl font-semibold text-navy-900">{current.name}</h2>
              </div>

              {/* Before / after — the same "old way vs. with Catalyst" language as the homepage story */}
              <div className="mt-6 grid gap-3 rounded-card border border-ice-200 bg-ice-50 p-1.5 sm:grid-cols-2">
                <div className="rounded-[10px] bg-white p-4">
                  <p className="flex items-center gap-1.5 text-[0.65rem] font-bold tracking-[0.18em] text-silver-500 uppercase">
                    <XCircle size={13} className="text-danger/70" /> The old way
                  </p>
                  <p className="mt-2 text-sm leading-snug text-navy-700">{current.problems[0]}</p>
                </div>
                <div className="rounded-[10px] bg-navy-900 p-4">
                  <p className="flex items-center gap-1.5 text-[0.65rem] font-bold tracking-[0.18em] text-steel-300 uppercase">
                    <CheckCircle2 size={13} className="text-success" /> With Catalyst
                  </p>
                  <p className="mt-2 text-sm leading-snug text-white">{current.solutions[0]}</p>
                </div>
              </div>

              <div className="mt-8 grid gap-8 md:grid-cols-3">
                <div>
                  <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-navy-900">
                    <AlertCircle size={16} className="text-warning" /> Common problems
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {current.problems.map((p) => (
                      <li key={p} className="text-sm leading-snug text-navy-700">{p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-navy-900">
                    <CheckCircle2 size={16} className="text-steel-500" /> How we can help
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {current.solutions.map((s) => (
                      <li key={s} className="text-sm leading-snug text-navy-700">{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-navy-900">
                    <Target size={16} className="text-success" /> Target outcomes
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {current.outcomes.map((o) => (
                      <li key={o} className="text-sm leading-snug text-navy-700">{o}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-ice-200 pt-6">
                <span className="text-xs font-semibold tracking-wide text-silver-500 uppercase">Relevant solutions:</span>
                {current.related.map((slug) => {
                  const s = services.find((x) => x.slug === slug);
                  if (!s) return null;
                  return (
                    <Link
                      key={slug}
                      href={`/solutions/${slug}`}
                      className="rounded-full border border-ice-200 bg-ice-50 px-3 py-1.5 text-xs font-medium text-navy-800 hover:border-steel-400/50"
                    >
                      {s.navLabel}
                    </Link>
                  );
                })}
              </div>

              <Link
                href="/consultation"
                onClick={() => track("cta_consultation_click", { location: "industry_explorer" })}
                className="mt-7 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-steel-400 px-6 font-medium text-white transition-colors hover:bg-steel-500"
              >
                Discuss your industry <ArrowRight size={16} />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
