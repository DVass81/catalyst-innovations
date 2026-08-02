export type Service = {
  slug: string;
  title: string;
  navLabel: string;
  tagline: string;
  keyMessage: string;
  description: string;
  capabilities: string[];
  outcomes: string[];
  icon: string; // lucide icon name key, resolved in components
};

export const services: Service[] = [
  {
    slug: "custom-software",
    title: "Custom Business Software",
    navLabel: "Custom Software",
    tagline: "Software designed around the way your business actually works.",
    keyMessage:
      "Stop forcing your business to work around software. Use software designed around your business.",
    description:
      "Off-the-shelf tools force your team to adapt to someone else's workflow. Catalyst Innovations studies how your organization actually operates — then builds internal applications, portals, dashboards, and platforms that match the real work, not the brochure version of it.",
    capabilities: [
      "Internal business applications",
      "SaaS platforms",
      "Operational dashboards",
      "Employee, customer, and vendor portals",
      "Mobile-friendly field applications",
      "Approval workflows",
      "Document-management systems",
      "Scheduling and reporting tools",
      "Inventory, quoting, and work-order systems",
      "Logistics and workflow-management platforms",
      "Industry-specific solutions",
      "API integrations and legacy-system modernization",
    ],
    outcomes: [
      "Employees stop fighting their tools and start finishing work",
      "One system of record instead of five disconnected ones",
      "Processes that scale with headcount instead of breaking",
    ],
    icon: "AppWindow",
  },
  {
    slug: "ai-automation",
    title: "AI & Intelligent Automation",
    navLabel: "AI & Automation",
    tagline: "Practical AI. Smarter operations. Measurable results.",
    keyMessage:
      "We build practical, controlled AI that helps people perform better — transparent, auditable, and subject to human approval where it matters.",
    description:
      "Catalyst Innovations focuses on AI that does real work: reading documents, routing tasks, flagging risks, drafting summaries, and answering operational questions. Recommendations stay transparent and auditable, and consequential actions remain gated behind human approval.",
    capabilities: [
      "AI business assistants and department copilots",
      "Intelligent document processing",
      "Automated data entry",
      "AI-generated executive summaries",
      "Predictive alerts and operational recommendations",
      "Knowledge assistants and AI-powered search",
      "Natural-language reporting",
      "AI-assisted purchasing and supplier analysis",
      "AI workflow routing and task prioritization",
      "Automated follow-up",
      "Document and contract analysis",
      "Anomaly detection and risk identification",
      "Approval-gated AI actions",
      "Human-in-the-loop automation",
    ],
    outcomes: [
      "Hours of reading, typing, and chasing reduced to minutes",
      "Risks surfaced before they become expensive",
      "Leaders get answers in plain language, not report backlogs",
    ],
    icon: "BrainCircuit",
  },
  {
    slug: "procurement",
    title: "Procurement & Supply-Chain Technology",
    navLabel: "Procurement",
    tagline: "Replace frustrating purchasing systems with intelligent, auditable ones.",
    keyMessage:
      "We help organizations replace outdated, frustrating purchasing systems with intuitive, intelligent, auditable procurement platforms.",
    description:
      "Purchasing is where money leaks quietly: maverick spend, duplicate orders, missed bids, blown budgets, suppliers nobody is measuring. Built by a founder with two decades in strategic purchasing, our procurement solutions give organizations control and visibility without enterprise-grade pain.",
    capabilities: [
      "Purchase-requisition systems and PO workflows",
      "Multi-level approvals and budget controls",
      "Supplier portals and scorecards",
      "Bid and RFQ management with quote comparison",
      "Contract tracking",
      "Spend visibility and price-history analysis",
      "PO tracking and delivery-risk alerts",
      "Supplier-performance analysis",
      "Invoice matching and duplicate-purchase detection",
      "Policy compliance",
      "Inventory intelligence and lead-time tracking",
      "Alternative supplier recommendations",
      "Executive purchasing dashboards",
      "Banking and credit-union purchasing solutions",
    ],
    outcomes: [
      "Every dollar of spend visible, approved, and auditable",
      "Faster approvals without weaker controls",
      "Supplier performance measured instead of assumed",
    ],
    icon: "ShoppingCart",
  },
  {
    slug: "manufacturing-operations",
    title: "Manufacturing & Operations Systems",
    navLabel: "Manufacturing & Operations",
    tagline: "From the shop floor to the boardroom, on one connected picture.",
    keyMessage:
      "Built by people who have run production, not just modeled it.",
    description:
      "We build the systems manufacturers actually need: visibility into work orders, quality, safety, maintenance, and materials — with the lean and continuous-improvement discipline (5 Why, A3, DMAIC, kaizen) wired in rather than bolted on.",
    capabilities: [
      "Shop-floor dashboards and digital work instructions",
      "Work-order tracking and production visibility",
      "Quality-management and corrective-action workflows (CAPA)",
      "Safety-management applications",
      "Equipment and maintenance tracking",
      "Material traceability and inventory control",
      "Warehouse management with barcode / QR workflows",
      "Operational KPI dashboards",
      "Lean tools: 5 Why, fishbone, A3, DMAIC, kaizen tracking",
      "Standard work and training records",
      "Shift communication and employee accountability",
      "Executive operational briefings",
    ],
    outcomes: [
      "Supervisors see problems in hours, not month-end",
      "Quality issues traced to root cause, not repeated",
      "Tribal knowledge captured as standard work",
    ],
    icon: "Factory",
  },
  {
    slug: "supply-chain",
    title: "Supply-Chain Intelligence",
    navLabel: "Supply Chain",
    tagline: "See disruptions coming while there is still time to act.",
    keyMessage:
      "Turn supplier risk, lead times, and cost changes into signals you act on — not surprises you absorb.",
    description:
      "Most companies discover supply-chain problems when a truck doesn't arrive. We build systems that watch lead times, supplier performance, cost movement, and inventory exposure continuously, and put the answers in front of the people who can act.",
    capabilities: [
      "Supplier risk monitoring",
      "Lead-time tracking and material-shortage alerts",
      "Order tracking",
      "Alternative sourcing recommendations",
      "Cost-change and tariff-exposure tracking",
      "Delivery-performance measurement",
      "Supplier communication tools",
      "Inventory exposure analysis",
      "Purchasing priorities",
      "Predictive disruption alerts",
      "Executive supply-chain visibility",
    ],
    outcomes: [
      "Shortages flagged weeks earlier",
      "Sourcing decisions backed by data, not memory",
      "Executives see supply risk on one screen",
    ],
    icon: "Truck",
  },
  {
    slug: "process-automation",
    title: "Business Process Automation",
    navLabel: "Process Automation",
    tagline: "From manual processes to intelligent operations.",
    keyMessage:
      "Every hour your team spends re-typing, forwarding, and chasing is an hour your competitors are spending on customers.",
    description:
      "We map the process as it actually runs, redesign it, and automate the repetitive parts: forms, approvals, notifications, handoffs, reminders, escalations, and reports — so people do the judgment work and software does the paperwork.",
    capabilities: [
      "Process mapping and workflow redesign",
      "Digital forms and automated approvals",
      "Notification and email automation",
      "Repetitive-task automation",
      "Department handoffs and data synchronization",
      "Automated reminders and escalations",
      "Report generation",
      "CRM automation",
      "Customer, employee, and vendor onboarding",
      "Compliance workflows and task orchestration",
    ],
    outcomes: [
      "Cycle times cut from days to hours",
      "Nothing waits in an inbox unnoticed",
      "Audit trails created automatically",
    ],
    icon: "Workflow",
  },
  {
    slug: "data-intelligence",
    title: "Data, Reporting & Executive Intelligence",
    navLabel: "Executive Intelligence",
    tagline: "Executive-level clarity from data you already have.",
    keyMessage:
      "Your data already knows the answer. We make it speak up.",
    description:
      "Real-time dashboards, department scorecards, and natural-language queries that turn scattered spreadsheets into decision support — profitability, cost drivers, trends, and risks visible daily instead of quarterly.",
    capabilities: [
      "Real-time dashboards and department scorecards",
      "Financial visibility and operational KPIs",
      "Custom reports and trend analysis",
      "Forecasting and risk alerts",
      "Natural-language data queries",
      "Daily executive briefings",
      "Cross-department reporting",
      "Profitability and cost-driver analysis",
      "Performance tracking and decision support",
    ],
    outcomes: [
      "Decisions made on today's numbers, not last quarter's",
      "One version of the truth across departments",
      "Problems surfaced automatically, not discovered manually",
    ],
    icon: "BarChart3",
  },
  {
    slug: "integrations-consulting",
    title: "Integrations & Digital Transformation Consulting",
    navLabel: "Integrations & Consulting",
    tagline: "Connect what you have. Plan what you need.",
    keyMessage:
      "Enterprise capability, small-business accessibility — starting from an honest assessment, not a sales pitch.",
    description:
      "We connect the systems you already run — accounting, email, CRM, ERP, storage — when technically appropriate, and provide the roadmap work that keeps transformation grounded: assessments, audits, build-versus-buy analysis, pilots, and phased implementation planning.",
    capabilities: [
      "Integration capability: QuickBooks, Microsoft 365, Google Workspace, Outlook, Gmail, HubSpot, CRMs, ERPs, accounting and procurement systems, inventory systems, payment platforms, calendars, cloud storage, existing databases, and custom APIs",
      "Operational assessments and process audits",
      "Technology roadmaps",
      "Automation opportunity analysis",
      "Software selection and build-versus-buy analysis",
      "AI-readiness and data-readiness assessments",
      "Implementation planning and change-management support",
      "Technology ROI analysis",
      "Prototype development and pilot programs",
      "Continuous improvement",
    ],
    outcomes: [
      "Systems that talk to each other instead of through people",
      "A realistic roadmap instead of a shelf-ware strategy deck",
      "Proof through pilots before major commitments",
    ],
    icon: "Plug",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
