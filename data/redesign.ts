import { industries as existing } from "./industries";
export const groups = [
  "Trades & construction",
  "Manufacturing & fabrication",
  "Distribution & warehousing",
  "Financial & professional services",
  "Communities & nonprofits",
  "Growing businesses",
] as const;
export type Industry = {
  slug: string;
  name: string;
  group: string;
  problems: string[];
  solutions: string[];
  workflow: string[];
  tools: string[];
};
function classify(slug: string): number {
  if (
    [
      "construction",
      "electrical-contractors",
      "industrial-services",
      "field-service",
      "plumbing",
      "hvac",
      "painting",
    ].includes(slug)
  )
    return 0;
  if (["manufacturing", "welding-fabrication"].includes(slug)) return 1;
  if (["logistics", "warehousing"].includes(slug)) return 2;
  if (
    [
      "financial-institutions",
      "credit-unions",
      "professional-services",
    ].includes(slug)
  )
    return 3;
  if (["schools-athletics", "churches-nonprofits", "hoa"].includes(slug))
    return 4;
  return 5;
}
const workflows = [
  ["Inquiry", "Quote", "Schedule", "Materials", "Invoice"],
  ["Order", "Materials", "Production", "Quality check", "Dispatch"],
  ["Order", "Stock check", "Pick", "Ship", "Invoice"],
  ["Request", "Review", "Approve", "Deliver", "Report"],
  ["Request", "Assign", "Coordinate", "Complete", "Report"],
  ["Inquiry", "Plan", "Work", "Invoice", "Report"],
];
const recommendations = [
  ["quoting-time", "dispatch-admin", "job-margin"],
  ["downtime-cost", "scrap-rework", "manual-work"],
  ["inventory-carrying", "reorder-point", "warehouse-picking"],
  ["purchase-orders", "reporting-time", "duplicate-entry"],
  ["hoa-administration", "maintenance-coordination", "manual-work"],
  ["manual-work", "software-consolidation", "project-roi"],
];
const extras = [
  {
    slug: "plumbing",
    name: "Plumbing",
    problems: [
      "Job details scattered across calls and texts",
      "Quotes taking too long to prepare",
      "Completed work waiting to be invoiced",
    ],
    solutions: [
      "Connected customer and job records",
      "Quoting and dispatch workflows",
      "Job-to-invoice handoffs",
    ],
  },
  {
    slug: "hvac",
    name: "HVAC",
    problems: [
      "Seasonal demand stretching office staff",
      "Service histories difficult to find",
      "Parts and jobs tracked separately",
    ],
    solutions: [
      "Scheduling and service workflows",
      "Accessible equipment and service records",
      "Connected inventory and purchasing",
    ],
  },
  {
    slug: "painting",
    name: "Painting businesses",
    problems: [
      "Estimates prepared from disconnected notes",
      "Crews and materials coordinated by text",
      "Change orders missed at billing",
    ],
    solutions: [
      "Connected estimating and job management",
      "Scheduling and material tracking",
      "Documented change-order workflows",
    ],
  },
  {
    slug: "hoa",
    name: "HOAs & community associations",
    problems: [
      "Resident requests spread across inboxes",
      "Maintenance follow-ups handled manually",
      "Community records hard to find",
    ],
    solutions: [
      "A central community platform",
      "Request and maintenance workflows",
      "Organized records and reporting",
    ],
  },
  {
    slug: "warehousing",
    name: "Warehousing & distribution",
    problems: [
      "Inventory counts that do not match the shelf",
      "Manual receiving and picking records",
      "Purchasing disconnected from stock levels",
    ],
    solutions: [
      "Warehouse management systems (WMS)",
      "Receiving, picking and stock workflows",
      "Connected purchasing and inventory",
    ],
  },
];
export const industryList: Industry[] = [...existing, ...extras].map((i) => {
  const g = classify(i.slug);
  const fundraising = ["schools-athletics", "churches-nonprofits"].includes(
    i.slug,
  );
  return {
    slug: i.slug,
    name: i.name,
    group: groups[g],
    problems: i.problems.slice(0, 3),
    solutions: i.solutions.slice(0, 3),
    workflow: fundraising
      ? ["Campaign", "Outreach", "Contribution", "Follow-up", "Report"]
      : workflows[g],
    tools: fundraising
      ? ["campaign-proceeds", "donor-follow-up", "manual-work"]
      : recommendations[g],
  };
});
export const projectStories = [
  {
    title: "A simpler way to support a cause.",
    type: "Fundraising website",
    status: "Built",
    text: "A fundraising website created for an organization bringing people together around a shared goal. A practical example of software built for a specific purpose.",
  },
  {
    title: "One place for community operations.",
    type: "HOA platform",
    status: "Built",
    text: "A custom platform created for homeowners association operations. Built around the needs of a community, rather than a collection of disconnected tools.",
  },
  {
    title: "From the first estimate to the final invoice.",
    type: "Painting business system",
    status: "Planned",
    text: "A planned system for a painting business. The intended focus is connecting the work between the office and the field; scope will be established with the business.",
  },
];
export const solutionGroups = [
  {
    number: "01",
    title: "Win and manage work.",
    text: "Keep customers, quotes and follow-ups connected. Know what needs attention and what happens next.",
    items: [
      "Customer relationship management (CRM)",
      "Quoting and customer onboarding",
      "Scheduling and job management",
    ],
    href: "/solutions/custom-software",
    icon: "customers",
  },
  {
    number: "02",
    title: "Keep operations moving.",
    text: "Connect the work, the materials and the people doing it. Give everyone the same picture.",
    items: [
      "Business operations systems (ERP)",
      "Warehouse management systems (WMS)",
      "Inventory and purchasing",
    ],
    href: "/solutions/procurement",
    icon: "operations",
  },
  {
    number: "03",
    title: "Know where you stand.",
    text: "Bring your numbers together and automate the repetitive steps between your systems.",
    items: [
      "Accounting and financial workflows",
      "Reporting and business dashboards",
      "Automation and system integrations",
    ],
    href: "/solutions/process-automation",
    icon: "reporting",
  },
];
