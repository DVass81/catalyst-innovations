/** Approved website destinations. Keep in sync when a real service/tool/industry is added. */
export const toolOptions = [
  ["Manual-work savings", "manual-work"], ["Duplicate-entry savings", "duplicate-entry"],
  ["Software consolidation", "software-consolidation"], ["Project ROI & payback", "project-roi"],
  ["Missed-inquiry opportunity", "missed-inquiries"], ["Follow-up opportunity", "sales-follow-up"],
  ["Quoting time", "quoting-time"], ["Invoice preparation", "invoice-preparation"],
  ["Dispatch administration", "dispatch-admin"], ["Crew travel time", "crew-travel"],
  ["Job gross margin", "job-margin"], ["Unbilled change orders", "change-orders"],
  ["Inventory carrying cost", "inventory-carrying"], ["Reorder point", "reorder-point"],
  ["Warehouse picking time", "warehouse-picking"], ["Purchase-order processing", "purchase-orders"],
  ["Downtime cost", "downtime-cost"], ["Scrap & rework", "scrap-rework"],
  ["HOA administration", "hoa-administration"], ["Maintenance coordination", "maintenance-coordination"],
  ["Campaign net proceeds", "campaign-proceeds"], ["Donor follow-up", "donor-follow-up"],
  ["Reporting time", "reporting-time"], ["Customer onboarding", "customer-onboarding"],
].map(([title, value]) => ({ title, value }));

export const solutionOptions = [
  ["Custom software", "custom-software"], ["AI & Automation", "ai-automation"],
  ["Procurement", "procurement"], ["Manufacturing operations", "manufacturing-operations"],
  ["Supply-chain intelligence", "supply-chain"], ["Process automation", "process-automation"],
  ["Data & reporting", "data-intelligence"], ["Integrations & consulting", "integrations-consulting"],
].map(([title, value]) => ({ title, value }));

export const industryOptions = [
  ["Manufacturing", "manufacturing"], ["Financial institutions", "financial-institutions"],
  ["Credit unions", "credit-unions"], ["Logistics", "logistics"], ["Construction", "construction"],
  ["Electrical contractors", "electrical-contractors"], ["Welding & fabrication", "welding-fabrication"],
  ["Industrial services", "industrial-services"], ["Professional services", "professional-services"],
  ["Field service", "field-service"], ["Schools & athletics", "schools-athletics"],
  ["Churches & nonprofits", "churches-nonprofits"], ["Small business", "small-business"],
  ["Multi-location businesses", "multi-location"], ["Plumbing", "plumbing"], ["HVAC", "hvac"],
  ["Painting", "painting"], ["HOAs & communities", "hoa"], ["Warehousing", "warehousing"],
].map(([title, value]) => ({ title, value }));

export const demoOptions = [
  { title: "HOA public sample", value: "hoa" },
  { title: "Knoxville Flooring sample", value: "flooring" },
  { title: "Oxendine Painting prototype", value: "painting" },
];

export const categoryOptions = [
  "Everyday operations", "Inventory & purchasing", "Manufacturing", "Communities & nonprofits",
  "Software decisions", "Trades & field work",
];
