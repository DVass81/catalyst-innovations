import type { Metadata } from "next";
import { Check, Sparkles, Clock, ShieldCheck, RefreshCw, TrendingUp } from "lucide-react";
import { Section, Eyebrow, Heading, Lead, ButtonLink } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { Spotlight } from "@/components/Spotlight";
import CTABand from "@/components/CTABand";
import { pricingTiers, pricingFaqs } from "@/data/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Straightforward implementation and monthly pricing for custom software, automation, and AI — from a digital foundation to a complete digital operating system.",
};

const foundingPartner = pricingTiers.find((t) => t.id === "founding-partner")!;
const standardTiers = pricingTiers.filter((t) => t.id !== "founding-partner");

const trustPoints = [
  { icon: RefreshCw, text: "Month-to-month, cancel anytime" },
  { icon: TrendingUp, text: "Upgrade tiers as you grow" },
  { icon: ShieldCheck, text: "No hidden fees, ever" },
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
                    Once the first 10 spots are filled, this tier closes for good.
                  </p>
                  <div className="mt-6 flex items-baseline gap-3">
                    <span className="font-display text-4xl font-semibold text-white">
                      {foundingPartner.oneTime}
                    </span>
                    <span className="text-sm text-silver-400">one-time implementation</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-3">
                    <span className="font-display text-2xl font-semibold text-steel-300">
                      {foundingPartner.monthly}
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

        <RevealGroup className="mt-14 grid items-start gap-6 lg:grid-cols-3" stagger={0.08}>
          {standardTiers.map((tier) => (
            <RevealItem key={tier.id} className="h-full">
              <Spotlight className="h-full rounded-card">
                <div
                  className={`relative flex h-full flex-col rounded-card border bg-white p-8 ${
                    tier.popular
                      ? "border-steel-400 shadow-card-dark lg:-translate-y-3"
                      : "border-ice-200 shadow-card"
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-steel-400 px-3.5 py-1 text-xs font-semibold tracking-wide text-white shadow-card">
                      <Sparkles size={12} /> Most Popular
                    </span>
                  )}
                  <h3 className="font-display text-xl font-semibold text-navy-900">{tier.name}</h3>
                  <p className="mt-1.5 text-sm leading-snug text-silver-500">{tier.idealFor}</p>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="font-display text-3xl font-semibold text-navy-900">
                      {tier.oneTime}
                    </span>
                  </div>
                  <p className="text-xs text-silver-500">one-time implementation</p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-display text-xl font-semibold text-steel-600">
                      {tier.monthly}
                    </span>
                  </div>
                  <p className="text-xs text-silver-500">ongoing investment</p>

                  <ul className="mt-7 flex-1 space-y-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-navy-700">
                        <Check size={16} className="mt-0.5 shrink-0 text-steel-600" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <ButtonLink
                    href="/consultation"
                    variant={tier.popular ? "primary" : "secondary"}
                    className="mt-8 w-full"
                  >
                    Get Started
                  </ButtonLink>
                </div>
              </Spotlight>
            </RevealItem>
          ))}
        </RevealGroup>

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
