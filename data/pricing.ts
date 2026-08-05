export type PricingTier = {
  id: string;
  name: string;
  oneTime: string;
  /** Raw monthly price in dollars — formatted in components so annual billing can discount it. */
  monthlyPrice: number;
  idealFor: string;
  features: string[];
  /** Featured in the standard 3-tier grid ("Most Popular"). */
  popular?: boolean;
  /** Standalone limited-availability spotlight, shown above the main grid. */
  limited?: string;
};

/** Discount applied to the monthly price when a client chooses annual billing. */
export const ANNUAL_DISCOUNT = 0.1;

export function formatMonthly(n: number): string {
  return `$${Math.round(n).toLocaleString()}/mo`;
}

export const pricingTiers: PricingTier[] = [
  {
    id: "founding-partner",
    name: "Founding Partner",
    oneTime: "$7,500",
    monthlyPrice: 1200,
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
    oneTime: "$5,000",
    monthlyPrice: 500,
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
    oneTime: "$10,000",
    monthlyPrice: 1500,
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
    oneTime: "$20,000",
    monthlyPrice: 5000,
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
