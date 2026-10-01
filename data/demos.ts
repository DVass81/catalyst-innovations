export type DemoId = "hoa" | "flooring" | "painting";
export type DemoStep = {
  title: string;
  text: string;
  image: string;
  width: number;
  height: number;
  alt: string;
};
export type Demo = {
  id: DemoId;
  title: string;
  purpose: string;
  industry: string;
  availability: "public-sample" | "guided-only" | "archived-guided";
  status: string;
  capabilities: [string, string, string];
  steps: [DemoStep, DemoStep, DemoStep];
  publicUrl?: string;
};
export const demos: Demo[] = [
  {
    id: "hoa",
    title: "A clearer path from resident to community team.",
    purpose:
      "Community software that gives a resident request a clear starting point, useful details and a review before sending.",
    industry: "hoa",
    availability: "public-sample",
    status: "Public sample experience",
    capabilities: [
      "Guided resident requests",
      "Supporting-information guidance",
      "Review before sending",
    ],
    publicUrl: "https://commonplace-public-hp2b7.ondigitalocean.app/",
    steps: [
      {
        title: "Describe the request",
        text: "A resident starts with a title and description. The guided form keeps the next step clear.",
        image: "/demos/hoa-entry.webp",
        width: 830,
        height: 380,
        alt: "Actual resident request form with title and description fields.",
      },
      {
        title: "Know what to include",
        text: "The next screen explains useful supporting information and when documents can be added.",
        image: "/demos/hoa-support.webp",
        width: 830,
        height: 478,
        alt: "Actual supporting-information step with back and continue controls.",
      },
      {
        title: "Review, then send",
        text: "The resident checks the request before sending it to the community team. Sending does not approve work or reserve a date.",
        image: "/demos/hoa-review.webp",
        width: 830,
        height: 560,
        alt: "Actual review screen showing a fictional path-lighting request, ready to send.",
      },
    ],
  },
  {
    id: "flooring",
    title: "Turn room measurements into a clearer estimate.",
    purpose:
      "A flooring estimator brings room dimensions, cost assumptions and proposal preparation into one connected workspace.",
    industry: "construction",
    availability: "guided-only",
    status: "Guided preview",
    capabilities: [
      "Room measurements and area totals",
      "Editable waste, labor and preparation costs",
      "Estimate summary with proposal handoff",
    ],
    steps: [
      {
        title: "Measure the work",
        text: "Enter room length and width. The estimator totals the floor area for the quote.",
        image: "/demos/flooring-measure.webp",
        width: 402,
        height: 217,
        alt: "Actual flooring estimator with a sample 20 by 15 foot room and 300 square foot total.",
      },
      {
        title: "Account for the details",
        text: "Review waste, material and labor rates, plus preparation needs such as tear-out or subfloor repair.",
        image: "/demos/flooring-costs.webp",
        width: 402,
        height: 395,
        alt: "Actual flooring cost controls showing waste, labor, materials and preparation options.",
      },
      {
        title: "Review the estimate",
        text: "See the entered costs, suggested price and estimated margin before choosing the proposal handoff. These are sample inputs, not a customer result.",
        image: "/demos/flooring-summary.webp",
        width: 188,
        height: 456,
        alt: "Actual flooring estimate summary with order quantity, cost breakdown and Convert to Proposal action.",
      },
    ],
  },
  {
    id: "painting",
    title: "Keep the scope and the estimate together.",
    purpose:
      "A painting-system prototype connects measured areas, preparation scope and entered costs before the estimate goes to a customer.",
    industry: "painting",
    availability: "archived-guided",
    status: "Planned system · recovered prototype",
    capabilities: [
      "Editable area-by-area scope",
      "Connected labor and material costing",
      "Customer-ready estimate review",
    ],
    steps: [
      {
        title: "Define the scope",
        text: "Break the work into areas, with preparation, hours and amounts recorded together.",
        image: "/demos/painting-scope.webp",
        width: 1118,
        height: 420,
        alt: "Actual painting prototype showing editable room scopes, hours and amounts with fictional seed data.",
      },
      {
        title: "Check the pricing",
        text: "Review line items alongside the connected estimate summary. All figures shown are fictional demo values.",
        image: "/demos/painting-pricing.webp",
        width: 1118,
        height: 420,
        alt: "Actual painting prototype showing area pricing and an estimate summary.",
      },
      {
        title: "Prepare for review",
        text: "Check costs and margin before customer review. Sending and approval are simulated in this prototype; no live payment or messaging is shown.",
        image: "/demos/painting-review.webp",
        width: 355,
        height: 397,
        alt: "Actual painting prototype with a Ready for Customer summary and simulated approval action.",
      },
    ],
  },
];
