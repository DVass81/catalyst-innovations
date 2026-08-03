import type { Metadata } from "next";
import { Section, Eyebrow, Heading, Lead, HexFrame, StatusBadge, ButtonLink } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { Icon } from "@/components/Icon";
import { getProducts } from "@/lib/cms";
import CTABand from "@/components/CTABand";
import CityAccent from "@/components/CityAccent";

export const metadata: Metadata = {
  title: "Innovation Portfolio — What We're Building",
  description:
    "Catalyst Innovations' growing portfolio: procurement intelligence, Catalyst AI, manufacturing operations intelligence, supply-chain intelligence, and more — labeled honestly by development status.",
};

export default async function PortfolioPage() {
  const products = await getProducts();
  return (
    <>
      <section className="relative overflow-hidden bg-navy-900 pb-20 pt-36 text-white">
        <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
        <CityAccent />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <Eyebrow dark>Innovation portfolio</Eyebrow>
            <Heading dark as="h1">What we&apos;re building</Heading>
            <Lead dark>
              Catalyst Innovations is building a portfolio of specialized products across
              business functions. Every entry below is labeled by its honest development
              status — we never present a concept as a deployed product.
            </Lead>
            <div className="mt-8 flex flex-wrap gap-3 text-xs text-ice-300">
              <span className="rounded-full border border-steel-400/40 bg-steel-400/10 px-3 py-1.5">In Development — actively being built</span>
              <span className="rounded-full border border-warning/40 bg-warning/10 px-3 py-1.5">Concept — validated direction, not yet built</span>
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5">Client-Specific — built for individual engagements</span>
            </div>
          </Reveal>
        </div>
      </section>

      <Section className="bg-ice-50">
        <RevealGroup className="grid gap-7 lg:grid-cols-2">
          {products.map((p) => (
            <RevealItem key={p.slug} className="h-full">
              <article className="flex h-full flex-col rounded-card border border-ice-200 bg-white p-8 shadow-card">
                <div className="flex items-start justify-between gap-4">
                  <HexFrame><Icon name={p.icon} /></HexFrame>
                  <StatusBadge status={p.status} />
                </div>
                <h2 className="mt-5 font-display text-xl font-semibold text-navy-900">{p.name}</h2>
                <p className="mt-1 text-xs font-medium tracking-wide text-silver-500 uppercase">
                  For: {p.audience}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-navy-700">{p.summary}</p>
                <details className="group mt-5">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-steel-600 hover:underline">
                    <span className="group-open:hidden">Show potential capabilities →</span>
                    <span className="hidden group-open:inline">Hide capabilities ↑</span>
                  </summary>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {p.capabilities.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-sm text-navy-700">
                        <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-steel-400" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </details>
                <div className="mt-auto pt-6">
                  <ButtonLink href="/consultation" variant="ghost-light" className="text-sm">
                    Ask about {p.name.replace("Catalyst ", "")}
                  </ButtonLink>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-14 rounded-card border border-dashed border-ice-300 bg-white/60 p-8 text-center">
          <p className="font-display text-base font-semibold text-navy-900">
            Founding Partner Case Study — Coming Soon
          </p>
          <p className="mx-auto mt-2 max-w-lg text-sm text-navy-700">
            We publish results only when they&apos;re real and verified. Early implementation
            partners will be featured here with their permission.
          </p>
        </Reveal>
      </Section>
      <CTABand
        title="Want to be a founding implementation partner?"
        body="Early partners help shape the roadmap and receive founding-partner terms. Let's talk about your use case."
      />
    </>
  );
}
