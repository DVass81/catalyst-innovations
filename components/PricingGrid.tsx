"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { ButtonLink } from "./ui";
import { Spotlight } from "./Spotlight";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { ANNUAL_DISCOUNT, formatPriceRange, type PricingTier } from "@/data/pricing";

export default function PricingGrid({ tiers }: { tiers: PricingTier[] }) {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      <Reveal className="mt-10 flex justify-center">
        <div className="inline-flex items-center rounded-full border border-ice-200 bg-white p-1 shadow-card">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            aria-pressed={!annual}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              !annual ? "bg-navy-900 text-white" : "text-navy-700 hover:text-navy-900"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            aria-pressed={annual}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              annual ? "bg-navy-900 text-white" : "text-navy-700 hover:text-navy-900"
            }`}
          >
            Annual
            <span
              className={`rounded-full px-2 py-0.5 text-[0.68rem] font-bold ${
                annual ? "bg-steel-400 text-white" : "bg-steel-400/15 text-steel-600"
              }`}
            >
              Save {ANNUAL_DISCOUNT * 100}%
            </span>
          </button>
        </div>
      </Reveal>

      <RevealGroup className="mt-10 grid items-start gap-6 lg:grid-cols-3" stagger={0.08}>
        {tiers.map((tier) => {
          const factor = annual ? 1 - ANNUAL_DISCOUNT : 1;
          const monthlyLow = tier.monthlyLow * factor;
          const monthlyHigh = tier.monthlyHigh * factor;
          const annualLow = tier.monthlyLow * 12 * (1 - ANNUAL_DISCOUNT);
          const annualHigh = tier.monthlyHigh * 12 * (1 - ANNUAL_DISCOUNT);
          return (
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
                    <span className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
                      {formatPriceRange(tier.oneTimeLow, tier.oneTimeHigh)}
                    </span>
                  </div>
                  <p className="text-xs text-silver-500">one-time implementation</p>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-display text-lg font-semibold text-steel-600 sm:text-xl">
                      {formatPriceRange(monthlyLow, monthlyHigh)}/mo
                    </span>
                  </div>
                  <p className="text-xs text-silver-500">
                    {annual
                      ? `billed annually · ${formatPriceRange(annualLow, annualHigh)}/year`
                      : "billed monthly"}
                  </p>

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
          );
        })}
      </RevealGroup>
    </>
  );
}
