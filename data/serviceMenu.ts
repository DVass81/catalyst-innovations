import { services } from "./services";
import { solutionContent } from "./seoContent";
import type { DemoId } from "./demos";

export type ServiceMenuItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  external: boolean;
  featured: boolean;
};

const softwareLabels: Record<string, string> = {
  "custom-software": "Custom-Built Software",
  "ai-automation": "AI & Automation",
  procurement: "Purchasing & Inventory",
  "manufacturing-operations": "Manufacturing Operations",
  "supply-chain": "Supply-Chain Visibility",
  "process-automation": "Business Process Automation",
  "data-intelligence": "Dashboards & Reporting",
  "integrations-consulting": "Integrations & Consulting",
};

export const serviceMenu: ServiceMenuItem[] = [
  {
    id: "website-design",
    title: "Website Development & Design",
    description: "A website that makes your business easy to understand and easy to contact. Custom design, thoughtful redesigns, and ongoing website care.",
    href: "https://sales.mycatalystinnovations.com/websites",
    external: true,
    featured: true,
  },
  {
    id: "fundraising",
    title: "Fundraising Campaign Platform",
    description: "Give your team or organization a place to tell its story, share its campaign, and follow fundraising progress with Elevate, a Catalyst Innovations product.",
    href: "https://elevateourteam.com/",
    external: true,
    featured: true,
  },
  ...services.map((service) => ({
    id: service.slug,
    title: softwareLabels[service.slug] ?? service.title,
    description: solutionContent[service.slug].summary,
    href: `/solutions/${service.slug}`,
    external: false,
    featured: service.slug === "custom-software",
  })),
];

export const serviceDemoLabels: Record<DemoId, { title: string; description: string }> = {
  hoa: {
    title: "HOA Platform",
    description: "A clearer way for residents to describe a request and review the details before handing it to their community team.",
  },
  flooring: {
    title: "Knoxville Flooring CRM",
    description: "Connect room measurements, waste, materials, labor, and preparation costs in an estimate, then prepare a proposal draft.",
  },
  painting: {
    title: "Oxendine Painting Management",
    description: "Define room-by-room scope, adjust labor and materials, and review the estimate in a demonstration prototype.",
  },
};
