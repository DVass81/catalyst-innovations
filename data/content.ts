/* Method stages, outcomes, differentiators, founders, FAQs. */

export const methodStages = [
  {
    n: 1,
    name: "Discover",
    text: "We meet with leadership and frontline employees to understand the current process, frustrations, systems, business requirements, and desired outcomes.",
    icon: "Search",
  },
  {
    n: 2,
    name: "Diagnose",
    text: "We identify bottlenecks, waste, risk, duplicate work, disconnected data, poor controls, and opportunities for automation.",
    icon: "Stethoscope",
  },
  {
    n: 3,
    name: "Design",
    text: "We map the future-state process and create a solution designed around the organization's actual workflow.",
    icon: "PenTool",
  },
  {
    n: 4,
    name: "Demonstrate",
    text: "We build a focused prototype or interactive demonstration so stakeholders can experience the solution before full implementation.",
    icon: "MonitorPlay",
  },
  {
    n: 5,
    name: "Deploy",
    text: "We implement the system in controlled phases, train users, migrate necessary data, and establish governance.",
    icon: "Rocket",
  },
  {
    n: 6,
    name: "Improve",
    text: "We measure adoption and performance, gather feedback, refine the platform, and continue adding value.",
    icon: "TrendingUp",
  },
] as const;

export const outcomes = [
  "Reduced administrative labor",
  "Faster approvals",
  "Better purchasing control",
  "Improved supplier performance",
  "Reduced data entry",
  "Fewer errors",
  "Lower operating costs",
  "Shorter process cycle times",
  "Greater employee accountability",
  "Improved compliance",
  "Better audit readiness",
  "Real-time operational visibility",
  "Faster management decisions",
  "Better customer service",
  "Improved inventory accuracy",
  "Reduced purchasing leakage",
  "Stronger cross-department communication",
  "Increased scalability",
  "Increased profitability",
] as const;

export const coreValues = [
  {
    title: "Integrity",
    text: "Tell the truth, keep commitments, protect client interests, and do the right thing even when it is inconvenient.",
  },
  {
    title: "Partnership",
    text: "Work alongside clients as a trusted business partner — not simply as a software vendor.",
  },
  {
    title: "Trust & Confidence",
    text: "Create confidence through clear communication, reliable delivery, disciplined follow-through, and measurable outcomes.",
  },
  {
    title: "Practical Innovation",
    text: "Use AI and technology where they remove friction, create value, and improve the customer's business — not for novelty.",
  },
  {
    title: "Adaptability",
    text: "Continuously evolve with technology, customer needs, and market conditions so solutions remain useful over time.",
  },
  {
    title: "Continuous Improvement",
    text: "Apply lean thinking, learn from results, eliminate waste, and make systems simpler and more effective.",
  },
  {
    title: "Family & Sustainability",
    text: "Build a company that supports strong families, healthy careers, and long-term opportunity for employees and founders.",
  },
];

export const differentiators = [
  {
    title: "Operational experience before software recommendations",
    text: "We ran production floors and purchasing departments before we wrote software for them. The diagnosis comes from experience, not a discovery questionnaire.",
  },
  {
    title: "Technology built around real workflows",
    text: "We design for the way work actually happens — including the exceptions, workarounds, and Friday-afternoon realities most software ignores.",
  },
  {
    title: "Practical AI rather than novelty",
    text: "AI that reads documents, flags risks, and drafts summaries — transparent, auditable, and approval-gated. No magic claims.",
  },
  {
    title: "Business outcomes before feature lists",
    text: "Every project starts with the financial and operational result it must produce, and is measured against it.",
  },
  {
    title: "Direct founder involvement",
    text: "You work with the people whose names are on the company — from first conversation through continuous improvement.",
  },
  {
    title: "Fast prototyping, phased implementation",
    text: "You see a working demonstration before you commit, and we deploy in controlled phases designed for adoption.",
  },
  {
    title: "Partnership rather than transactional development",
    text: "We build long-term relationships around trust, accountability, and continuous improvement — not one-and-done deliveries.",
  },
  {
    title: "Bridging leadership, employees, operations, and technology",
    text: "Boardroom, office, shop floor, purchasing, warehouse, field team, and software environment — connected by people who have worked in all of them.",
  },
] as const;

export const founders = [
  {
    slug: "daniel-vass",
    name: "Daniel Vass",
    email: "daniel@mycatalystinnovations.com",
    role: "Co-Founder | Operations, Manufacturing & Business Transformation",
    years: "~20 years",
    summary:
      "Daniel combines real-world operational experience with a practical understanding of what employees, managers, suppliers, and executives need from business technology.",
    bio: "Daniel brings approximately 20 years of manufacturing, procurement, supply-chain, operations, leadership, and continuous-improvement experience. He understands how organizations actually operate — not only how a process looks on paper. His strength is identifying operational friction, understanding the financial consequences, and helping convert those problems into scalable technology solutions.",
    expertise: [
      "Manufacturing operations",
      "Strategic purchasing & procurement management",
      "Supplier development & vendor negotiations",
      "Supply-chain problem-solving & material planning",
      "Inventory control & cost reduction",
      "Lean manufacturing & continuous improvement",
      "Workflow design & standard operating procedures",
      "Safety, compliance & operational accountability",
      "Cross-functional leadership",
      "Translating frontline problems into practical systems",
    ],
  },
  {
    slug: "josh-ogle",
    name: "Josh Ogle",
    email: "josh@mycatalystinnovations.com",
    role: "Co-Founder | Technology, Systems & Product Development",
    years: "~10 years U.S. Army + technology",
    summary:
      "Josh combines military leadership with modern technology expertise to turn complex operational requirements into secure, practical, scalable systems.",
    bio: "Josh brings approximately 10 years of United States Army experience along with information technology, systems, product-development, and software expertise. He brings structured execution, technical knowledge, discipline, and a mission-oriented approach to building reliable solutions.",
    expertise: [
      "Technology strategy & information systems",
      "Product development & software architecture",
      "Application development",
      "Cybersecurity awareness",
      "Systems integration & workflow automation",
      "AI-assisted development",
      "Infrastructure & data systems",
      "Troubleshooting & technical implementation",
      "Project execution",
      "Military leadership & discipline",
    ],
  },
] as const;

export const partnershipStatement =
  "One founder understands the operational problem. The other knows how to engineer the solution.";

export const faqs = [
  {
    q: "Do you only work with large companies?",
    a: "No. Catalyst Innovations is built to serve both growing small businesses and large multi-location organizations. We scope solutions to fit the organization — enterprise capability with small-business accessibility.",
  },
  {
    q: "How is pricing structured?",
    a: "Pricing is based on scope, users, integrations, implementation requirements, and ongoing support. After a consultation we provide a clear proposal — no surprise line items.",
  },
  {
    q: "How long does a typical project take?",
    a: "It depends on scope, but our method is built around fast prototyping: stakeholders see a working demonstration early, and we deploy in controlled phases rather than one risky big-bang launch.",
  },
  {
    q: "Will your AI make decisions without us?",
    a: "No. We build practical, controlled AI. Recommendations are transparent and auditable, and consequential actions stay gated behind human approval where appropriate.",
  },
  {
    q: "Can you integrate with our existing systems?",
    a: "Often, yes. We can connect systems such as QuickBooks, Microsoft 365, Google Workspace, CRMs, ERPs, and custom APIs when technically appropriate — we assess feasibility honestly before committing.",
  },
  {
    q: "What happens after launch?",
    a: "The Improve stage of the Catalyst Method: we measure adoption and performance, gather feedback, refine the platform, and continue adding value. We build long-term partnerships, not handoffs.",
  },
] as const;
