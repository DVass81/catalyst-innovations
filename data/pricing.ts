import { buyerFaqs } from "./buyerFaqs";
import { discoveryOffer } from "./catalystProcess";

export type PricingTier = {
  id: string;
  name: string;
  /** One-time discovery visit; separate from implementation and monthly support. */
  discoveryFee: number;
  /** Raw one-time implementation range in dollars (equal low/high renders as a single price). */
  oneTimeLow: number;
  oneTimeHigh: number;
  /** Raw monthly range in dollars — formatted in components so annual billing can discount it. */
  monthlyLow: number;
  monthlyHigh: number;
  idealFor: string;
  features: string[];
  /** Visually emphasized in the standard three-tier grid; not a popularity claim. */
  popular?: boolean;
};

/** Discount applied to the monthly price when a client chooses annual billing. */
export const ANNUAL_DISCOUNT = 0.1;

export const discoveryFeeLabel = discoveryOffer.fee.toLocaleString("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

/** Annual savings apply only to standard recurring support, never discovery or implementation. */
export function firstYearTotal(tier: PricingTier, annual = false) {
  const factor = annual ? 1 - ANNUAL_DISCOUNT : 1;
  return {
    low: tier.discoveryFee + tier.oneTimeLow + tier.monthlyLow * factor * 12,
    high: tier.discoveryFee + tier.oneTimeHigh + tier.monthlyHigh * factor * 12,
  };
}

/** Formats a single price, or a range when low and high differ. */
export function formatPriceRange(low: number, high: number): string {
  const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;
  return low === high ? fmt(low) : `${fmt(low)} – ${fmt(high)}`;
}

export const pricingTiers: PricingTier[] = [
  {
    id: "essentials",
    name: "Essentials",
    discoveryFee: discoveryOffer.fee,
    oneTimeLow: 10000,
    oneTimeHigh: 15000,
    monthlyLow: 1500,
    monthlyHigh: 2500,
    idealFor: "Small businesses needing a digital foundation",
    features: [
      "Business dashboard",
      "KPI reporting",
      "Basic workflow automation",
      "Document management",
      "Standard support",
      "Software updates",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    discoveryFee: discoveryOffer.fee,
    oneTimeLow: 15000,
    oneTimeHigh: 30000,
    monthlyLow: 2500,
    monthlyHigh: 5000,
    idealFor: "Growing companies wanting automation and AI",
    popular: true,
    features: [
      "Everything in Essentials plus AI assistants",
      "Advanced workflow automation",
      "Department dashboards",
      "Custom reporting",
      "Integrations",
      "Quarterly business reviews",
      "Priority support",
    ],
  },
  {
    id: "executive",
    name: "Executive",
    discoveryFee: discoveryOffer.fee,
    oneTimeLow: 30000,
    oneTimeHigh: 70000,
    monthlyLow: 5000,
    monthlyHigh: 15000,
    idealFor: "Companies seeking a complete digital operating system",
    features: [
      "Everything in Professional plus executive AI copilot",
      "Predictive analytics",
      "Enterprise integrations",
      "Unlimited dashboards",
      "Custom application development",
      "Dedicated account management",
      "Strategic consulting",
      "On-site planning sessions",
      "Highest support priority",
    ],
  },
];

export const pricingFaqs: { q: string; a: string }[] = [
  {
    q: "What happens during discovery, and what does it cost?",
    a: `The ${discoveryOffer.durationMinutes}-minute discovery visit costs ${discoveryFeeLabel}. We walk through a process with your team, follow a real example and provide a one-page summary of practical improvement opportunities. It is separate from implementation and monthly support.`,
  },
  {
    q: buyerFaqs.timeline.question,
    a: buyerFaqs.timeline.answer,
  },
  {
    q: buyerFaqs.cost.question,
    a: buyerFaqs.cost.answer,
  },
  {
    q: "What does the one-time implementation cost cover?",
    a: "Agreed development, configuration, integration with your existing systems, data migration where applicable, and training your team to use what we build. The initial discovery visit is priced separately. Nothing goes live until it actually works the way your team works.",
  },
  {
    q: buyerFaqs.support.question,
    a: buyerFaqs.support.answer,
  },
  {
    q: "Can we change tiers later?",
    a: "Yes. You can start at Essentials or Professional and upgrade as your needs grow — we'll credit what you've already paid in toward the difference.",
  },
  {
    q: "Is there a contract or can we cancel anytime?",
    a: "Month-to-month after the initial implementation. We'd rather earn the relationship every month than lock you into one.",
  },
  {
    q: "What if we need something outside these packages?",
    a: "Enterprise needs, multi-entity organizations, and unusual compliance requirements are common enough that we scope those separately — reach out and we'll build a custom proposal.",
  },
  {
    q: "What does the 30-day satisfaction guarantee cover?",
    a: "If your package isn't the right fit within the first 30 days after implementation, we'll either fix what's wrong or refund your one-time implementation fee — your choice.",
  },
  {
    q: "Is annual billing actually cheaper?",
    a: "Yes — choosing annual billing takes 10% off the monthly investment on every standard package, billed as one upfront annual payment. The one-time discovery and implementation costs are the same either way.",
  },
];
