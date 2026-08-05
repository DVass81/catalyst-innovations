import type { Metadata } from "next";
import { Sparkles, Clock, ShieldCheck, RefreshCw, TrendingUp } from "lucide-react";
import { Section, Eyebrow, Heading, Lead, ButtonLink } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import CTABand from "@/components/CTABand";
import PricingGrid from "@/components/PricingGrid";
import { pricingTiers, pricingFaqs, formatPriceRange } from "@/data/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Straightforward implementation and monthly pricing for custom software, automation, and AI — from a digital foundation to a complete digital operating system.",
};

const foundingPartner = pricingTiers.find((t) => t.id === "founding-partner")!;
const standardTiers = pricingTiers.filter((t) => t.id !== "founding-partner");
const FOUNDING_PARTNER_SPOTS_CLAIMED = 0;
const FOUNDING_PARTNER_SPOTS_TOTAL = 10;

const trustPoints = [
  { icon: RefreshCw, text: "Month-to-month, cancel anytime" },
  { icon: TrendingUp, text: "Upgrade tiers as you grow" },
  { icon: ShieldCheck, text: "30-day satisfaction guarantee" },
];

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy-900 pb-20 pt-36 text-white">
        <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <Eyebrow dark>Pricing</Eyebrow>
            <Heading dark as="h1">
              Straightforward packages that scale with you.
            </Heading>
            <Lead dark>
              One implementation cost to build it right, one predictable monthly investment
              to keep it running, growing, and supported. No surprise line items.
            </Lead>
          </Reveal>
        </div>
      </section>

      {/* Founding Partner spotlight */}
      <section className="relative overflow-hidden bg-navy-950 py-16 sm:py-20">
        <div
          aria-hidden="true"
          className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-steel-400/20 blur-[110px]"
        />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <div className="rounded-card bg-gradient-to-br from-steel-400/60 via-white/10 to-transparent p-px shadow-[0_0_60px_rgb(74_143_212/0.2)]">
              <div className="grid gap-10 rounded-[calc(var(--radius-card)-1px)] bg-navy-900/95 p-8 backdrop-blur-md sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-steel-400/50 bg-steel-400/15 px-3 py-1 text-xs font-semibold tracking-wide text-steel-300">
                    <Clock size={13} /> {foundingPartner.limited}
                  </span>
                  <h2 className="mt-4 font-grotesk text-2xl font-semibold text-white sm:text-3xl">
                    {foundingPartner.name} Program
                  </h2>
                  <p className="mt-3 max-w-lg leading-relaxed text-ice-300">
                    We&apos;re opening the door to {foundingPartner.idealFor.toLowerCase()} at
                    founding pricing — below Professional, with founder-level access built in.
                    Once the first {FOUNDING_PARTNER_SPOTS_TOTAL} spots are filled, this tier
                    closes for good.
                  </p>
                  <p className="mt-3 font-display text-sm font-semibold tracking-wide text-steel-300">
                    {FOUNDING_PARTNER_SPOTS_CLAIMED} of {FOUNDING_PARTNER_SPOTS_TOTAL} spots
                    claimed — now accepting applications.
                  </p>
                  <div className="mt-6 flex items-baseline gap-3">
                    <span className="font-display text-4xl font-semibold text-white">
                      {formatPriceRange(foundingPartner.oneTimeLow, foundingPartner.oneTimeHigh)}
                    </span>
                    <span className="text-sm text-silver-400">one-time implementation</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-3">
                    <span className="font-display text-2xl font-semibold text-steel-300">
                      {formatPriceRange(foundingPartner.monthlyLow, foundingPartner.monthlyHigh)}/mo
                    </span>
                    <span className="text-sm text-silver-400">ongoing investment</span>
                  </div>
                  <ButtonLink href="/consultation" className="mt-7">
                    Claim a Founding Partner Spot
                  </ButtonLink>
                </div>
                <ul className="space-y-3 border-t border-white/10 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                  {foundingPartner.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-ice-200">
                      <Sparkles size={16} className="mt-0.5 shrink-0 text-steel-300" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Standard tiers */}
      <Section className="bg-ice-50">
        <Reveal className="text-center">
          <Eyebrow>Standard packages</Eyebrow>
          <Heading className="mx-auto">Pick a starting point. Grow into the next one.</Heading>
          <Lead className="mx-auto">
            Every package includes hosting, security updates, and support — the difference is
            how much automation and AI does for your team, and how deep our involvement goes.
          </Lead>
        </Reveal>

        <Reveal delay={0.05} className="mx-auto mt-8 flex max-w-xl items-center gap-3 rounded-card border border-steel-400/30 bg-steel-400/10 px-5 py-4">
          <ShieldCheck size={22} className="shrink-0 text-steel-600" />
          <p className="text-sm leading-snug text-navy-800">
            <span className="font-semibold text-navy-900">30-day satisfaction guarantee.</span>{" "}
            If it&apos;s not the right fit in your first month, we&apos;ll fix it or refund your
            implementation fee.
          </p>
        </Reveal>

        <PricingGrid tiers={standardTiers} />

        <RevealGroup className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4" stagger={0.05}>
          {trustPoints.map((t) => (
            <RevealItem key={t.text}>
              <div className="flex items-center gap-2.5 text-sm font-medium text-navy-700">
                <t.icon size={17} className="text-steel-600" />
                {t.text}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Not sure which tier? */}
      <Section dark>
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <Eyebrow dark>Not sure which package fits?</Eyebrow>
            <Heading dark>See what inefficiency is actually costing you first.</Heading>
            <Lead dark>
              Run the numbers on your own operation, then let&apos;s talk about which package
              gets you there fastest.
            </Lead>
            <ButtonLink href="/roi-estimator" variant="ghost-dark" className="mt-6">
              Try the ROI Estimator
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-card border border-white/12 bg-navy-800/70 p-8">
              <h3 className="font-display text-lg font-semibold text-white">A quick way to decide</h3>
              <ul className="mt-5 space-y-4 text-sm leading-relaxed text-ice-300">
                <li><span className="font-semibold text-white">Essentials</span> — you need one clean dashboard and to stop chasing paperwork.</li>
                <li><span className="font-semibold text-white">Professional</span> — automation and AI should be doing real work, not just reporting on it.</li>
                <li><span className="font-semibold text-white">Executive</span> — you want a full digital operating system, not another point solution.</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-white">
        <Reveal className="text-center">
          <Eyebrow>Questions</Eyebrow>
          <Heading className="mx-auto">Pricing, plainly explained.</Heading>
        </Reveal>
        <RevealGroup className="mx-auto mt-12 max-w-3xl space-y-4" stagger={0.05}>
          {pricingFaqs.map((f) => (
            <RevealItem key={f.q}>
              <div className="rounded-card border border-ice-200 bg-ice-50 p-6">
                <h3 className="font-display text-base font-semibold text-navy-900">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-700">{f.a}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <CTABand
        title="Still weighing the options?"
        body="Tell us where it hurts most and we'll tell you honestly which package — or whether a custom scope — actually fits."
      />
    </>
  );
}
