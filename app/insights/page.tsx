import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow, Heading, Lead } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { insights } from "@/data/content";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Insights — Thinking From the Shop Floor Up",
  description:
    "Practical writing on business software, process automation, procurement intelligence, manufacturing technology, and AI that earns its keep.",
};

export default function InsightsPage() {
  return (
    <>
      <section className="bg-navy-900 pb-16 pt-36 text-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <Eyebrow dark>Insights</Eyebrow>
            <Heading dark as="h1">Thinking from the shop floor up.</Heading>
            <Lead dark>
              Practical writing on operations, procurement, automation, and AI — from people
              who have lived the problems, not just consulted on them.
            </Lead>
          </Reveal>
        </div>
      </section>

      <Section className="bg-ice-50">
        <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {insights.map((a) => (
            <RevealItem key={a.slug} className="h-full">
              {a.draft ? (
                <div className="flex h-full flex-col rounded-card border border-dashed border-ice-300 bg-white/70 p-6">
                  <p className="text-xs font-semibold tracking-wide text-steel-600 uppercase">
                    {a.category}
                    <span className="ml-2 rounded bg-ice-200 px-1.5 py-0.5 text-[0.6rem] text-navy-700">
                      Draft — publishing soon
                    </span>
                  </p>
                  <h2 className="mt-3 flex-1 font-display text-base font-semibold leading-snug text-navy-800">
                    {a.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-navy-700">{a.excerpt}</p>
                  <p className="mt-4 text-xs text-silver-500">{a.readMinutes} min read</p>
                </div>
              ) : (
                <Link
                  href={`/insights/${a.slug}`}
                  className="group flex h-full flex-col rounded-card border border-ice-200 bg-white p-6 shadow-card transition-all hover:-translate-y-1"
                >
                  <p className="text-xs font-semibold tracking-wide text-steel-600 uppercase">{a.category}</p>
                  <h2 className="mt-3 flex-1 font-display text-base font-semibold leading-snug text-navy-900 transition-colors group-hover:text-steel-600">
                    {a.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-navy-700">{a.excerpt}</p>
                  <p className="mt-4 text-xs text-silver-500">{a.readMinutes} min read · Read article →</p>
                </Link>
              )}
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal className="mt-10">
          <p className="text-xs text-silver-500">
            Sample editorial content is labeled as draft until approved for publication by
            the founders.
          </p>
        </Reveal>
      </Section>
      <CTABand />
    </>
  );
}
