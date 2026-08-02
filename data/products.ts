export type ProductStatus =
  | "In Development"
  | "Demonstration Platform"
  | "Concept"
  | "Client-Specific";

export type Product = {
  slug: string;
  name: string;
  status: ProductStatus;
  summary: string;
  audience: string;
  capabilities: string[];
  icon: string;
};

/**
 * Innovation portfolio. Status labels are honest by design — nothing here
 * is presented as a fully deployed product with verified customers.
 */
export const products: Product[] = [
  {
    slug: "procurement-intelligence",
    name: "Catalyst Procurement Intelligence",
    status: "In Development",
    summary:
      "An intelligent purchasing platform designed to modernize requisitions, approvals, purchase orders, supplier management, budgets, reporting, and audit controls — a potential alternative to the outdated, cumbersome procurement systems used by financial institutions, credit unions, and manufacturers.",
    audience: "Financial institutions, credit unions, manufacturers, growing organizations",
    capabilities: [
      "User-friendly purchase requests",
      "Configurable approvals and PO generation",
      "Supplier management and competitive bid tracking",
      "Budget controls and contract management",
      "Spend dashboards and supplier scorecards",
      "AI purchasing assistant and smart recommendations",
      "Duplicate-purchase detection and price-history intelligence",
      "Policy and delivery-risk alerts",
      "Document storage and audit trails",
      "Executive dashboards and multi-location controls",
      "Mobile access, tutorial and guided-demo mode",
    ],
    icon: "ShoppingCart",
  },
  {
    slug: "catalyst-ai",
    name: "Catalyst AI",
    status: "In Development",
    summary:
      "A secure, business-aware intelligence layer that helps employees and leaders understand operations, identify risks, answer questions, summarize information, recommend actions, and coordinate work — with human approval gates on consequential actions.",
    audience: "Leadership teams and departments across industries",
    capabilities: [
      "Department copilots and executive briefings",
      "Organizational knowledge and institutional memory",
      "Operational alerts and predictive insights",
      "Document intelligence",
      "Natural-language reporting",
      "Decision support with approval-gated actions",
      "Cross-functional visibility and task orchestration",
    ],
    icon: "BrainCircuit",
  },
  {
    slug: "manufacturing-intelligence",
    name: "Manufacturing Operations Intelligence",
    status: "Concept",
    summary:
      "A platform concept connecting shop-floor activity, work orders, quality, safety, maintenance, inventory, purchasing, logistics, and executive visibility into one operational picture.",
    audience: "Manufacturers and industrial operations",
    capabilities: [
      "Connected work orders, quality, and safety",
      "Maintenance and equipment tracking",
      "Inventory and purchasing linkage",
      "Executive operational visibility",
    ],
    icon: "Factory",
  },
  {
    slug: "supply-chain-intelligence",
    name: "Supply-Chain Intelligence",
    status: "Concept",
    summary:
      "A solution concept for seeing supply-chain risk early: supplier performance, lead times, shortages, cost changes, and predictive disruptions on one executive view.",
    audience: "Manufacturers, distributors, logistics operations",
    capabilities: [
      "Supplier risk and delivery performance",
      "Lead times, shortages, and order tracking",
      "Alternative sourcing and cost-change alerts",
      "Inventory exposure and purchasing priorities",
      "Predictive disruptions and executive visibility",
    ],
    icon: "Truck",
  },
  {
    slug: "fundraising",
    name: "Fundraising & Team Support Technology",
    status: "Concept",
    summary:
      "Modern fundraising software explored for schools, sports teams, churches, leagues, and community organizations — campaigns, team pages, payments, outreach, and analytics without the spreadsheet chaos.",
    audience: "Schools, teams, churches, leagues, community organizations",
    capabilities: [
      "Campaign creation with team and participant pages",
      "Donation tracking and payment processing",
      "Automated outreach and AI campaign messaging",
      "Sponsor management and leaderboards",
      "Social sharing, donor engagement, campaign analytics",
    ],
    icon: "Trophy",
  },
  {
    slug: "logistics-warehouse",
    name: "Logistics & Warehouse Systems",
    status: "Concept",
    summary:
      "Warehouse and logistics workflows built for accuracy and traceability: receiving, shipping, lot tracking, QR labels, FIFO controls, and mobile-first operations.",
    audience: "Warehouses, manufacturers, distributors",
    capabilities: [
      "Receiving, shipping, and PO status",
      "Outside-service and lot tracking",
      "QR-code labels and barcode scanning",
      "FIFO controls and tariff / cost exposure",
      "Warehouse visualization and material location",
      "Inventory history, compliance records, mobile workflows",
    ],
    icon: "Warehouse",
  },
  {
    slug: "measurement-quality",
    name: "Measurement & Quality Technology",
    status: "Concept",
    summary:
      "Systems connecting digital measuring tools and inspection equipment with software — improving accuracy, traceability, engineering communication, and quality documentation.",
    audience: "Precision manufacturers and quality teams",
    capabilities: [
      "Bluetooth-enabled digital measurements",
      "Guided inspection procedures",
      "Dimensional-data capture linked to drawings and specs",
      "Measurement validation and tolerance alerts",
      "Inspection reports with image capture",
      "Engineering review and historical comparison",
      "AI-assisted anomaly identification",
    ],
    icon: "Ruler",
  },
];
