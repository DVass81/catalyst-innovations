export type Industry = {
  slug: string;
  name: string;
  icon: string;
  problems: string[];
  solutions: string[];
  outcomes: string[];
  related: string[]; // service slugs
};

/**
 * Phrased as "designed to support" — Catalyst does not claim active
 * deployments in every industry. Keep language honest.
 */
export const industries: Industry[] = [
  {
    slug: "manufacturing",
    name: "Manufacturing",
    icon: "Factory",
    problems: [
      "Paper travelers and whiteboard scheduling",
      "No real-time view of work-order status",
      "Quality issues found late and repeated",
      "Purchasing disconnected from production",
    ],
    solutions: [
      "Shop-floor dashboards and digital work instructions",
      "Work-order and material traceability",
      "CAPA and lean problem-solving workflows",
      "Integrated procurement and inventory intelligence",
    ],
    outcomes: ["Faster throughput", "Fewer escapes and reworks", "Real-time operational visibility"],
    related: ["manufacturing-operations", "procurement", "supply-chain"],
  },
  {
    slug: "financial-institutions",
    name: "Financial Institutions",
    icon: "Landmark",
    problems: [
      "Legacy purchasing systems staff dread using",
      "Weak spend controls and audit gaps",
      "Manual vendor management",
      "Slow multi-level approvals",
    ],
    solutions: [
      "Modern, auditable procurement platforms",
      "Configurable approval chains and budget controls",
      "Vendor scorecards and contract tracking",
      "Executive spend dashboards",
    ],
    outcomes: ["Audit-ready purchasing", "Faster approvals", "Reduced purchasing leakage"],
    related: ["procurement", "data-intelligence", "process-automation"],
  },
  {
    slug: "credit-unions",
    name: "Credit Unions",
    icon: "PiggyBank",
    problems: [
      "Enterprise procurement tools priced and built for megabanks",
      "Spreadsheet-based expense and vendor tracking",
      "Compliance documentation scattered across drives",
    ],
    solutions: [
      "Right-sized purchasing and vendor-management platforms",
      "Policy-compliance alerts and audit trails",
      "Board-ready spend reporting",
    ],
    outcomes: ["Member-first staff time reclaimed", "Examination-ready records", "Controlled spend"],
    related: ["procurement", "data-intelligence"],
  },
  {
    slug: "logistics",
    name: "Supply Chain & Logistics",
    icon: "Truck",
    problems: [
      "Shipment status living in email threads",
      "No early warning on delivery risk",
      "Manual receiving and put-away records",
    ],
    solutions: [
      "Order and shipment tracking systems",
      "Delivery-risk and disruption alerts",
      "Barcode / QR receiving and warehouse workflows",
    ],
    outcomes: ["Fewer surprises", "Faster dock-to-stock", "Accurate inventory"],
    related: ["supply-chain", "manufacturing-operations"],
  },
  {
    slug: "construction",
    name: "Construction",
    icon: "HardHat",
    problems: [
      "Job costs assembled after the job ends",
      "Paper timesheets and field reports",
      "Material orders untracked between office and site",
    ],
    solutions: [
      "Mobile field applications",
      "Digital daily reports and approvals",
      "Purchase tracking tied to jobs",
    ],
    outcomes: ["Live job-cost visibility", "Less office re-typing", "Faster billing"],
    related: ["custom-software", "process-automation", "procurement"],
  },
  {
    slug: "electrical-contractors",
    name: "Electrical Contractors",
    icon: "Zap",
    problems: [
      "Quoting from old spreadsheets",
      "Material pricing volatility eating margins",
      "Work orders and change orders on paper",
    ],
    solutions: [
      "Quoting systems with price-history intelligence",
      "Digital work-order and change-order workflows",
      "Supplier price tracking",
    ],
    outcomes: ["Protected margins", "Faster quotes", "Cleaner handoffs"],
    related: ["custom-software", "procurement"],
  },
  {
    slug: "welding-fabrication",
    name: "Welding & Fabrication",
    icon: "Flame",
    problems: [
      "Job traceability demands from customers",
      "Certs and inspection records in filing cabinets",
      "Machine and consumable costs untracked",
    ],
    solutions: [
      "Material and lot traceability systems",
      "Digital inspection and certification records",
      "Job-costing dashboards",
    ],
    outcomes: ["Traceability on demand", "Audit-ready quality records", "True job margins"],
    related: ["manufacturing-operations", "custom-software"],
  },
  {
    slug: "industrial-services",
    name: "Industrial Service Companies",
    icon: "Wrench",
    problems: [
      "Dispatch by phone call and sticky note",
      "Service history nobody can find",
      "Invoicing lagging weeks behind work",
    ],
    solutions: [
      "Scheduling and dispatch tools",
      "Mobile service-history applications",
      "Automated work-to-invoice workflows",
    ],
    outcomes: ["More jobs per crew", "Faster cash flow", "Complete service records"],
    related: ["custom-software", "process-automation"],
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    icon: "Briefcase",
    problems: [
      "Client work tracked in inboxes",
      "Manual intake and onboarding",
      "Utilization invisible until month-end",
    ],
    solutions: [
      "Client portals and intake automation",
      "Workflow and deadline management",
      "Utilization and profitability dashboards",
    ],
    outcomes: ["Nothing falls through cracks", "Faster onboarding", "Visible profitability"],
    related: ["custom-software", "process-automation", "data-intelligence"],
  },
  {
    slug: "field-service",
    name: "Field-Service Businesses",
    icon: "MapPin",
    problems: [
      "Paper forms returning days later",
      "No proof-of-work documentation",
      "Techs re-entering data at day's end",
    ],
    solutions: [
      "Mobile-first field apps with photo capture",
      "Digital forms synced instantly",
      "Automated reporting to office and customer",
    ],
    outcomes: ["Same-day paperwork", "Documented work", "Zero double entry"],
    related: ["custom-software", "process-automation"],
  },
  {
    slug: "schools-athletics",
    name: "Schools & Athletic Organizations",
    icon: "Trophy",
    problems: [
      "Fundraisers run on envelopes and group texts",
      "No visibility into campaign progress",
      "Sponsor tracking in someone's notebook",
    ],
    solutions: [
      "Modern fundraising platforms with team pages",
      "Donation tracking and leaderboards",
      "Sponsor management and campaign analytics",
    ],
    outcomes: ["More raised, less chaos", "Engaged donors", "Transparent reporting"],
    related: ["custom-software"],
  },
  {
    slug: "churches-nonprofits",
    name: "Churches & Nonprofits",
    icon: "HeartHandshake",
    problems: [
      "Volunteer coordination by phone tree",
      "Giving campaigns without follow-up",
      "Reporting assembled by hand for boards",
    ],
    solutions: [
      "Campaign and donor-engagement tools",
      "Automated outreach and thank-yous",
      "Simple, clear reporting",
    ],
    outcomes: ["Stronger engagement", "Less admin burden", "Board-ready numbers"],
    related: ["custom-software", "process-automation"],
  },
  {
    slug: "small-business",
    name: "Growing Small Businesses",
    icon: "Sprout",
    problems: [
      "The spreadsheet that runs the company",
      "The one person who knows how everything works",
      "Software subscriptions that don't talk to each other",
    ],
    solutions: [
      "Right-sized custom applications",
      "System integrations that end double entry",
      "Dashboards that show the whole business",
    ],
    outcomes: ["Room to grow", "Less key-person risk", "Owner time back"],
    related: ["custom-software", "integrations-consulting", "process-automation"],
  },
  {
    slug: "multi-location",
    name: "Multi-Location Organizations",
    icon: "Building2",
    problems: [
      "Every location doing it differently",
      "Consolidated reporting weeks late",
      "Purchasing controls varying by site",
    ],
    solutions: [
      "Standardized workflows across locations",
      "Real-time consolidated dashboards",
      "Centralized procurement with local flexibility",
    ],
    outcomes: ["Consistency at scale", "Same-day consolidated numbers", "Controlled spend everywhere"],
    related: ["data-intelligence", "procurement", "custom-software"],
  },
];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}
