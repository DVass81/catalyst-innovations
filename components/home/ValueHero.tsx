"use client";

import { ArrowRight } from "lucide-react";
import { CatalystMark } from "../Logo";
import { ButtonLink } from "../ui";
import { Reveal } from "../Reveal";
import { track } from "@/lib/site";

/**
 * The plain, confident statement of what Catalyst Innovations does —
 * deliberately the first thing a visitor reads, before the cinematic
 * "Through the Screen" piece lower on the page tells the problem story.
 */
export default function ValueHero() {
  return (
    <section className="relative overflow-hidden bg-navy-900 pb-24 pt-40 text-white">
      <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <div className="mb-8 flex items-center justify-center gap-3">
            <CatalystMark size={44} />
            <p className="font-display text-xs font-semibold tracking-[0.3em] text-steel-300 uppercase">
              Make more · Save time · Work smarter
            </p>
          </div>
          <h1 className="font-display text-[2.2rem] font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
            Turn operational problems into{" "}
            <span className="bg-gradient-to-r from-steel-300 to-steel-400 bg-clip-text text-transparent">
              intelligent systems.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ice-300">
            Catalyst Innovations builds software, automation, and practical AI around how
            your business actually runs — not the other way around.
          </p>
          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <ButtonLink
              href="/consultation"
              onClick={() => track("cta_consultation_click", { location: "value_hero" })}
              className="text-base"
            >
              Request a Consultation
            </ButtonLink>
            <a
              href="#the-problem"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-steel-300 underline-offset-4 hover:text-white hover:underline"
            >
              See how we think about it <ArrowRight size={15} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
