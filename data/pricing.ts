export type PricingTier = {
  id: string;
  name: string;
  /** Raw one-time implementation range in dollars (equal low/high renders as a single price). */
  oneTimeLow: number;
  oneTimeHigh: number;
  /** Raw monthly range in dollars — formatted in components so annual billing can discount it. */
  monthlyLow: number;
  monthlyHigh: number;
  idealFor: string;
  features: string[];
  /** Featured in the standard 3-tier grid ("Most Popular"). */
  popular?: boolean;
  /** Standalone limited-availability spotlight, shown above the main grid. */
  limited?: string;
};

/** Discount applied to the monthly price when a client chooses annual billing. */
export const ANNUAL_DISCOUNT = 0.1;

/** Formats a single price, or a range when low and high differ. */
export function formatPriceRange(low: number, high: number): string {
  const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;
  return low === high ? fmt(low) : `${fmt(low)} – ${fmt(high)}`;
}

export const pricingTiers: PricingTier[] = [
  {
    id: "founding-partner",
    name: "Founding Partner",
    oneTimeLow: 7500,
    oneTimeHigh: 7500,
    monthlyLow: 1200,
    monthlyHigh: 1200,
    idealFor: "The first 10 strategic partners",
    limited: "First 10 Only",
    features: [
      "Everything in Professional",
      "Priority development",
      "Direct access to founders",
      "Influence over product roadmap",
      "Discounted lifetime pricing",
    ],
  },
  {
    id: "essentials",
    name: "Essentials",
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
    q: "Why is pricing shown as a range?",
    a: "Where you land in the range depends on scope — number of integrations, data volume, and how much customization your workflows need. We'll give you an exact number before anything is signed.",
  },
  {
    q: "What does the one-time implementation cost cover?",
    a: "Discovery, configuration, integration with your existing systems, data migration where applicable, and training your team to use what we build. Nothing goes live until it actually works the way your team works.",
  },
  {
    q: "What's included in the monthly investment?",
    a: "Hosting, security updates, ongoing support, and continued access to the features in your tier. Higher tiers add proactive account management and strategic time with our team, not just a bigger support queue.",
  },
  {
    q: "Can we change tiers later?",
    a: "Yes. Most clients start at Essentials or Professional and upgrade as automation and AI needs grow — we'll credit what you've already paid in toward the difference.",
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
    a: "Yes — choosing annual billing takes 10% off the monthly investment on every standard package, billed as one upfront annual payment. The one-time implementation cost is the same either way.",
  },
];
