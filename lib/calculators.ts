export type Field = {
  key: string;
  label: string;
  unit: string;
  example: number;
  max?: number;
  optional?: boolean;
};
export type Result = {
  label: string;
  value: number | null;
  unit: "USD" | "hours" | "%" | "months" | "units";
  note?: string;
};
export type Calculator = {
  slug: string;
  title: string;
  category: string;
  description: string;
  kind: string;
  fields: Field[];
  formula: string;
  caveat: string;
};
const f = (
  key: string,
  label: string,
  unit: string,
  example: number,
  max = 1e9,
  optional = false,
): Field => ({ key, label, unit, example, max, optional });
const time = (
  slug: string,
  title: string,
  category: string,
  activity: string,
  description: string,
): Calculator => ({
  slug,
  title,
  category,
  description,
  kind: "time",
  fields: [
    f("volume", activity, "per year", 1200, 1e7),
    f("minutes", "Time saved per activity", "minutes", 10, 10080),
    f("rate", "Fully loaded hourly labor cost", "$ / hour", 30, 10000),
  ],
  formula:
    "Annual hours returned = annual activities × minutes saved ÷ 60. Estimated labor capacity value = hours returned × hourly cost.",
  caveat:
    "Time returned is capacity, not automatic cash savings. Only count cash savings if actual spending falls. Do not count the same activity in more than one estimate.",
});
const opportunity = (
  slug: string,
  title: string,
  category: string,
  activity: string,
): Calculator => ({
  slug,
  title,
  category,
  description:
    "Explore the potential value of following through on more opportunities.",
  kind: "opportunity",
  fields: [
    f("volume", activity, "per year", 500, 1e7),
    f(
      "improvement",
      "Expected conversion improvement",
      "percentage points",
      5,
      100,
    ),
    f("value", "Average transaction or gift", "$", 200, 1e8),
    f("margin", "Contribution margin (optional)", "%", 30, 100, true),
  ],
  formula:
    "Additional transactions = annual eligible contacts × conversion improvement ÷ 100. Potential revenue = additional transactions × average value. Contribution = potential revenue × margin ÷ 100, if entered.",
  caveat:
    "An opportunity estimate, not a forecast. Enter a realistic percentage-point change (for example, 20% to 25% is 5 points). Do not count the same contacts twice. Donation receipts are not business profit.",
});
export const calculators: Calculator[] = [
  time(
    "manual-work",
    "Manual-work savings",
    "Everyday operations",
    "Manual tasks completed",
    "What could your team do with fewer repetitive tasks?",
  ),
  time(
    "duplicate-entry",
    "Duplicate-entry savings",
    "Everyday operations",
    "Records entered more than once",
    "Put a number on typing the same information twice.",
  ),
  {
    slug: "software-consolidation",
    title: "Software consolidation",
    category: "Everyday operations",
    kind: "software",
    description:
      "Compare the recurring cost of your current tools with a connected alternative.",
    fields: [
      f("current", "Current software spending", "$ / month", 800),
      f("replacement", "Replacement software spending", "$ / month", 500),
    ],
    formula:
      "Annual recurring cash difference = (current monthly spending − replacement monthly spending) × 12.",
    caveat:
      "A negative result means the replacement costs more. Include all licenses and support. Implementation costs are separate; evaluate them with the project ROI tool.",
  },
  {
    slug: "project-roi",
    title: "Project ROI & payback",
    category: "Everyday operations",
    kind: "roi",
    description:
      "Weigh the benefits you expect against the full cost of a project.",
    fields: [
      f("upfront", "One-time implementation cost", "$", 15000),
      f("recurring", "Ongoing solution cost", "$ / month", 300),
      f("cash", "Expected cash savings", "$ / month", 1000),
      f(
        "capacity",
        "Labor capacity value (optional)",
        "$ / month",
        500,
        1e9,
        true,
      ),
      f(
        "contribution",
        "Additional contribution (optional)",
        "$ / month",
        200,
        1e9,
        true,
      ),
    ],
    formula:
      "First-year costs = upfront + 12 × recurring. First-year net benefit = 12 × selected monthly benefits − first-year costs. ROI = net benefit ÷ first-year costs × 100. Payback = upfront ÷ (selected monthly benefits − recurring), when positive.",
    caveat:
      "A steady-state estimate that excludes ramp-up, taxes, financing and discounting. Capacity value is not cash. Add only distinct benefits. No fixed project price or promised savings is assumed.",
  },
  opportunity(
    "missed-inquiries",
    "Missed-inquiry opportunity",
    "Sales & administration",
    "Unanswered or missed inquiries",
  ),
  opportunity(
    "sales-follow-up",
    "Follow-up opportunity",
    "Sales & administration",
    "Eligible sales contacts",
  ),
  time(
    "quoting-time",
    "Quoting time",
    "Sales & administration",
    "Quotes prepared",
    "Estimate time returned by preparing quotes more efficiently.",
  ),
  time(
    "invoice-preparation",
    "Invoice preparation",
    "Sales & administration",
    "Invoices prepared",
    "See the capacity tied up in assembling invoices.",
  ),
  time(
    "dispatch-admin",
    "Dispatch administration",
    "Trades & field services",
    "Jobs dispatched",
    "Explore time saved coordinating jobs and crews.",
  ),
  time(
    "crew-travel",
    "Crew travel time",
    "Trades & field services",
    "Individual worker trips",
    "Estimate labor capacity returned by reducing travel per worker.",
  ),
  {
    slug: "job-margin",
    title: "Job gross margin",
    category: "Trades & field services",
    kind: "margin",
    description: "Understand what remains after the direct cost of a job.",
    fields: [
      f("revenue", "Job revenue", "$", 10000),
      f("labor", "Direct labor cost", "$", 3000),
      f("materials", "Materials cost", "$", 2500),
      f("other", "Other direct costs", "$", 500),
    ],
    formula:
      "Gross profit = revenue − labor − materials − other direct costs. Gross margin = gross profit ÷ revenue × 100.",
    caveat:
      "Gross profit is before overhead, tax and financing. A zero-revenue job has no defined margin percentage.",
  },
  {
    slug: "change-orders",
    title: "Unbilled change orders",
    category: "Trades & field services",
    kind: "changes",
    description:
      "See the revenue at risk when additional work never reaches an invoice.",
    fields: [
      f("volume", "Unbilled change orders", "per year", 24),
      f("value", "Average unbilled amount", "$", 400),
      f("recovery", "Expected recovery", "%", 50, 100),
    ],
    formula:
      "Potential recovered revenue = annual unbilled change orders × average amount × recovery percentage ÷ 100.",
    caveat:
      "Recovered billing is revenue, not profit or guaranteed collection. Do not also count it as a new sale.",
  },
  {
    slug: "inventory-carrying",
    title: "Inventory carrying cost",
    category: "Inventory & purchasing",
    kind: "inventory",
    description: "Understand the yearly cost of holding inventory.",
    fields: [
      f("stock", "Average inventory value", "$", 100000),
      f("rate", "Annual carrying rate", "%", 20, 100),
    ],
    formula:
      "Annual carrying cost = average inventory value × annual carrying rate ÷ 100.",
    caveat:
      "Include storage, capital, insurance and risk in your own carrying-rate estimate. The stock value itself is working capital, not an annual savings amount.",
  },
  {
    slug: "reorder-point",
    title: "Reorder point",
    category: "Inventory & purchasing",
    kind: "reorder",
    description: "Estimate when to reorder before your stock runs out.",
    fields: [
      f("demand", "Average daily demand", "units / day", 20),
      f("lead", "Supplier lead time", "days", 7, 3650),
      f("safety", "Safety stock", "units", 50),
    ],
    formula:
      "Reorder point = daily demand × supplier lead time + safety stock. Round up to whole units.",
    caveat:
      "Assumes consistent units and average demand. You choose the safety buffer; this is not a service-level forecast.",
  },
  time(
    "warehouse-picking",
    "Warehouse picking time",
    "Inventory & purchasing",
    "Orders picked",
    "See the capacity returned by smoother picking workflows.",
  ),
  time(
    "purchase-orders",
    "Purchase-order processing",
    "Inventory & purchasing",
    "Purchase orders processed",
    "Estimate time saved on requests, approvals and purchase orders.",
  ),
  {
    slug: "downtime-cost",
    title: "Downtime cost",
    category: "Manufacturing",
    kind: "downtime",
    description:
      "Put a value on unplanned interruptions using your operation’s own costs.",
    fields: [
      f("events", "Unplanned interruptions", "per year", 12),
      f("hours", "Average duration", "hours", 2, 8760),
      f("rate", "Cost per downtime hour", "$ / hour", 400),
    ],
    formula:
      "Annual downtime cost = interruptions per year × hours per interruption × cost per hour.",
    caveat:
      "Use either lost contribution or a defensible cost estimate. Do not add costs already included in your hourly figure.",
  },
  {
    slug: "scrap-rework",
    title: "Scrap & rework",
    category: "Manufacturing",
    kind: "rework",
    description:
      "Understand the cost of discarded materials and repeated work.",
    fields: [
      f("scrap", "Scrapped units", "per year", 120),
      f("unit", "Unrecoverable cost per scrapped unit", "$", 40),
      f("hours", "Rework labor", "hours / year", 200, 1e7),
      f("rate", "Loaded rework labor cost", "$ / hour", 30, 10000),
    ],
    formula:
      "Annual cost = scrapped units × unrecoverable unit cost + rework hours × hourly labor cost.",
    caveat:
      "Use mutually exclusive scrap and rework costs. This estimates current cost, not an assumed reduction.",
  },
  time(
    "hoa-administration",
    "HOA administration",
    "HOAs & communities",
    "Administrative tasks",
    "Explore time returned from simpler community administration.",
  ),
  time(
    "maintenance-coordination",
    "Maintenance coordination",
    "HOAs & communities",
    "Maintenance requests coordinated",
    "Estimate time saved on request intake, assignment and follow-up.",
  ),
  {
    slug: "campaign-proceeds",
    title: "Campaign net proceeds",
    category: "Fundraising & nonprofits",
    kind: "campaign",
    description:
      "See what a fundraising campaign retains after fees and expenses.",
    fields: [
      f("receipts", "Total campaign receipts", "$", 20000),
      f("fees", "Total payment and platform fees", "$", 800),
      f("expenses", "Other campaign expenses", "$", 1200),
    ],
    formula:
      "Net proceeds = campaign receipts − total fees − other campaign expenses.",
    caveat:
      "Enter actual or estimated total fees, including fixed charges. Negative proceeds mean expenses exceed receipts.",
  },
  opportunity(
    "donor-follow-up",
    "Donor follow-up opportunity",
    "Fundraising & nonprofits",
    "Eligible donor contacts",
  ),
  time(
    "reporting-time",
    "Reporting time",
    "Everyday operations",
    "Reports prepared",
    "Estimate capacity returned by connecting your reporting data.",
  ),
  time(
    "customer-onboarding",
    "Customer onboarding",
    "Sales & administration",
    "Customers onboarded",
    "Explore the time spent setting up each new customer.",
  ),
];
export const getCalculator = (slug: string) =>
  calculators.find((c) => c.slug === slug);
export type Calculation = {
  results: Result[];
  errors: Record<string, string>;
  complete: boolean;
};
export function calculate(
  c: Calculator,
  raw: Record<string, string>,
  selected: string[] = ["cash"],
): Calculation {
  const v: Record<string, number> = {};
  const errors: Record<string, string> = {};
  let complete = true;
  for (const field of c.fields) {
    const text = raw[field.key]?.trim() ?? "";
    if (!text) {
      if (!field.optional) complete = false;
      v[field.key] = 0;
      continue;
    }
    const value = Number(text);
    if (!Number.isFinite(value) || value < 0 || value > (field.max ?? 1e9))
      errors[field.key] =
        `Enter a number between 0 and ${(field.max ?? 1e9).toLocaleString()}.`;
    v[field.key] = value;
  }
  if (Object.keys(errors).length || !complete)
    return { results: [], errors, complete: false };
  const results: Result[] = [];
  const add = (
    label: string,
    value: number | null,
    unit: Result["unit"],
    note?: string,
  ) => results.push({ label, value, unit, note });
  switch (c.kind) {
    case "time": {
      const hours = (v.volume * v.minutes) / 60;
      add("Annual hours returned", hours, "hours");
      add(
        "Estimated annual labor capacity value",
        hours * v.rate,
        "USD",
        "Capacity value, not automatic cash savings.",
      );
      break;
    }
    case "opportunity": {
      const revenue = ((v.volume * v.improvement) / 100) * v.value;
      add("Potential additional annual revenue", revenue, "USD");
      if (raw.margin?.trim())
        add("Potential annual contribution", (revenue * v.margin) / 100, "USD");
      break;
    }
    case "software":
      add(
        "Annual recurring cash difference",
        (v.current - v.replacement) * 12,
        "USD",
      );
      break;
    case "roi": {
      const benefit = ["cash", "capacity", "contribution"]
        .filter((k) => selected.includes(k))
        .reduce((s, k) => s + v[k], 0);
      const cost = v.upfront + v.recurring * 12;
      const net = benefit * 12 - cost;
      add("First-year net benefit", net, "USD");
      add(
        "First-year ROI",
        cost > 0 ? (net / cost) * 100 : null,
        "%",
        cost > 0 ? undefined : "ROI needs a positive total cost.",
      );
      add(
        "Payback",
        benefit > v.recurring ? v.upfront / (benefit - v.recurring) : null,
        "months",
        benefit > v.recurring
          ? undefined
          : "No payback when monthly net benefit is zero or negative.",
      );
      add("First-year total cost", cost, "USD");
      break;
    }
    case "margin": {
      const profit = v.revenue - v.labor - v.materials - v.other;
      add("Job gross profit", profit, "USD");
      add(
        "Job gross margin",
        v.revenue > 0 ? (profit / v.revenue) * 100 : null,
        "%",
      );
      break;
    }
    case "changes":
      add(
        "Potential annual recovered revenue",
        (v.volume * v.value * v.recovery) / 100,
        "USD",
      );
      break;
    case "inventory":
      add("Annual carrying cost", (v.stock * v.rate) / 100, "USD");
      break;
    case "reorder":
      add("Reorder at", Math.ceil(v.demand * v.lead + v.safety), "units");
      break;
    case "downtime":
      add("Annual downtime cost", v.events * v.hours * v.rate, "USD");
      break;
    case "rework":
      add(
        "Annual scrap and rework cost",
        v.scrap * v.unit + v.hours * v.rate,
        "USD",
      );
      break;
    case "campaign":
      add("Campaign net proceeds", v.receipts - v.fees - v.expenses, "USD");
      break;
  }
  return { results, errors, complete: true };
}
export function formatResult(r: Result): string {
  if (r.value === null) return "Not available";
  const n = r.value.toLocaleString("en-US", {
    maximumFractionDigits: r.unit === "months" || r.unit === "%" ? 1 : 0,
  });
  return r.unit === "USD"
    ? r.value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      })
    : `${n}${r.unit === "%" ? "%" : ` ${r.unit}`}`;
}
