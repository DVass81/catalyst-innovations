import type { Metadata } from "next";
import { Section, Eyebrow, Heading, Lead, HexFrame, ButtonLink } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { Icon } from "@/components/Icon";
import { methodStages, faqs } from "@/data/content";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "The Catalyst Method — Six Stages From Problem to Improvement",
  description:
    "Discover, Diagnose, Design, Demonstrate, Deploy, Improve — how Catalyst Innovations turns operational problems into adopted, measurable systems.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function MethodPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="relative overflow-hidden bg-navy-900 pb-20 pt-36 text-white">
        <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
        <div aria-hidden="true" className="absolute right-0 top-0 h-96 w-96 rounded-full bg-steel-400/15 blur-[120px]" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <Eyebrow dark>How we work</Eyebrow>
            <Heading dark as="h1">The Catalyst Method</Heading>
            <Lead dark>
              Six stages designed to de-risk transformation: you see a working demonstration
              before committing, deploy in controlled phases, and keep improving after launch.
            </Lead>
          </Reveal>
        </div>
      </section>

      <Section className="bg-ice-50">
        <div className="relative">
          {/* Vertical connector */}
          <div aria-hidden="true" className="absolute left-[27px] top-4 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-steel-400 via-steel-400/40 to-transparent" />
          <RevealGroup className="space-y-10" stagger={0.08}>
            {methodStages.map((m) => (
              <RevealItem key={m.n}>
                <div className="relative flex gap-6 pl-0">
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-steel-400 bg-white font-display text-lg font-semibold text-steel-600 shadow-card">
                    {m.n}
                  </div>
                  <div className="flex-1 rounded-card border border-ice-200 bg-white p-6 shadow-card sm:p-8">
                    <div className="flex items-center gap-3">
                      <HexFrame><Icon name={m.icon} /></HexFrame>
                      <h2 className="font-display text-xl font-semibold text-navy-900">{m.name}</h2>
                    </div>
                    <p className="mt-4 max-w-2xl leading-relaxed text-navy-700">{m.text}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      <Section className="bg-white" id="faq">
        <Reveal>
          <Eyebrow>Common questions</Eyebrow>
          <Heading>Before you ask</Heading>
        </Reveal>
        <RevealGroup className="mt-10 grid gap-4 md:grid-cols-2">
          {faqs.map((f) => (
            <RevealItem key={f.q}>
              <details className="group rounded-card border border-ice-200 bg-ice-50 p-6 open:bg-white open:shadow-card transition-all">
                <summary className="cursor-pointer list-none font-display text-base font-semibold text-navy-900 marker:content-none">
                  {f.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-navy-700">{f.a}</p>
              </details>
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal className="mt-12">
          <ButtonLink href="/roi-estimator">Find your best starting point</ButtonLink>
        </Reveal>
      </Section>
      <CTABand />
    </>
  );
}
