"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ButtonLink, Heading } from "./ui";
import { CatalystMark } from "./Logo";
import { Reveal } from "./Reveal";
import { track } from "@/lib/site";

/**
 * The mark morphs from a dim outline to a solid, glowing state as it enters
 * view — the same "ignition" beat as the portal hero's AI-city arrival,
 * echoed at every dark call-to-action site-wide instead of just the
 * homepage.
 */
function MorphingMark() {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center">
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-steel-400/30 blur-xl"
        initial={reduce ? undefined : { opacity: 0, scale: 0.4 }}
        whileInView={{ opacity: 1, scale: 1.3 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.1, ease: [0.21, 0.6, 0.35, 1] }}
      />
      <motion.div
        initial={reduce ? undefined : { filter: "grayscale(1) brightness(0.55)", opacity: 0.55, scale: 0.85 }}
        whileInView={{ filter: "grayscale(0) brightness(1)", opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: [0.21, 0.6, 0.35, 1] }}
        className="relative"
      >
        <CatalystMark size={44} />
      </motion.div>
    </div>
  );
}

export default function CTABand({
  title = "Let's talk about the process that frustrates you most.",
  body = "A consultation costs nothing and starts with listening — to leadership and to the people doing the work.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-20">
      <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-steel-400/20 blur-[110px]"
      />
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <MorphingMark />
          <Heading dark>{title}</Heading>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ice-300">{body}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink
              href="/consultation"
              onClick={() => track("cta_consultation_click", { location: "cta_band" })}
            >
              Request a Consultation
            </ButtonLink>
            <ButtonLink href="/start" variant="ghost-dark">
              Find Your Best Starting Point
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
