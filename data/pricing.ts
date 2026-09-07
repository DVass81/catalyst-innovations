export type PricingTier = {
  id: string;
  name: string;
  oneTimeLow: number;
  oneTimeHigh: number;
  monthlyLow: number;
  monthlyHigh: number;
  idealFor: string;
  features: string[];
  popular?: boolean;
  limited?: string;
};
export const ANNUAL_DISCOUNT = 0;
export const formatPriceRange = (low: number, high: number) =>
  low === high
    ? `$${low.toLocaleString("en-US")}`
    : `$${low.toLocaleString("en-US")}–$${high.toLocaleString("en-US")}`;
export const pricingTiers: PricingTier[] = [
  {
    id: "focused-workflow",
    name: "Focused Workflow",
    oneTimeLow: 5000,
    oneTimeHigh: 10000,
    monthlyLow: 0,
    monthlyHigh: 0,
    idealFor: "One clear problem. One useful solution.",
    features: [
      "One defined workflow",
      "A focused integration or automation",
      "Testing, documentation, and team training",
    ],
  },
  {
    id: "custom-business-system",
    name: "Custom Business System",
    oneTimeLow: 12000,
    oneTimeHigh: 30000,
    monthlyLow: 0,
    monthlyHigh: 0,
    idealFor: "A connected workspace for the way your team works.",
    features: [
      "Several connected workflows",
      "Roles, dashboards, and selected integrations",
      "Testing, documentation, and team training",
    ],
  },
  {
    id: "connected-operations",
    name: "Connected Operations",
    oneTimeLow: 30000,
    oneTimeHigh: 75000,
    monthlyLow: 0,
    monthlyHigh: 0,
    idealFor: "Bring departments, tools, and information together.",
    features: [
      "Multiple teams or departments",
      "Substantial integration and scoped migration",
      "Phased rollout with documentation and training",
    ],
  },
];
export const supportPlans = [
  {
    name: "Care",
    price: 350,
    hours: 2,
    description: "Routine maintenance, monitoring review, and support.",
  },
  {
    name: "Improve",
    price: 1000,
    hours: 6,
    description: "Maintenance, support, and prioritized improvements.",
  },
  {
    name: "Partner",
    price: 2500,
    hours: 16,
    description: "Development, maintenance, and ongoing planning.",
  },
];
export const pricingFaqs = [
  {
    q: "Why are project prices shown as ranges?",
    a: "Integrations, data migration, permissions, and workflow complexity change the scope. You receive a fixed proposal before implementation begins.",
  },
  {
    q: "What do I get from the $1,500 Solution Blueprint?",
    a: "For one priority workflow: stakeholder interviews, a process map, recommendations, and a clearly scoped proposal. You keep the Blueprint whether or not you continue. Multi-department discovery is quoted separately.",
  },
  {
    q: "How does the Blueprint credit work?",
    a: "We credit the full $1,500 against the kickoff payment for implementation booked within 60 days. The Blueprint is paid upfront.",
  },
  {
    q: "What is included in implementation?",
    a: "Design, implementation, testing, documentation, training, and 30 days of fixes for defects in the agreed scope. New features and scope changes are quoted separately.",
  },
  {
    q: "How are project payments scheduled?",
    a: "50% at kickoff, 30% at the agreed demonstration milestone, and 20% at acceptance. Any eligible Blueprint credit is applied to the kickoff payment.",
  },
  {
    q: "Is ongoing support required?",
    a: "No. Care, Improve, and Partner are optional month-to-month arrangements with 30 days’ cancellation notice. Standard support is during business hours; emergency coverage requires a separate arrangement.",
  },
  {
    q: "How do support hours work?",
    a: "All labor, including meetings, counts toward the monthly allowance. Unused hours expire at the end of the month. Additional work requires your approval at $175 per hour or a fixed quote.",
  },
  {
    q: "Which costs are separate?",
    a: "Hosting, AI usage, software subscriptions, travel, and specialist third-party services are disclosed separately. Your proposal identifies the costs applicable to your project.",
  },
  {
    q: "Does this change an existing agreement?",
    a: "No. Existing customer agreements and negotiated product pilots retain their own terms.",
  },
  {
    q: "Who owns the system and its data?",
    a: "Ownership, source access, third-party licensing, and handover requirements are specified in your project agreement before work starts. We discuss these early so the arrangement fits your business.",
  },
];
