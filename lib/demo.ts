export const demoIndustries = [
  "manufacturing",
  "field-service",
  "professional-services",
] as const;
export type DemoIndustry = (typeof demoIndustries)[number];
export type Purchase = {
  id: string;
  item: string;
  department: string;
  amount: number;
  status: "pending" | "approved" | "returned";
  reason?: string;
};
export const initialPurchases: Purchase[] = [
  {
    id: "REQ–024",
    item: "Replacement pump",
    department: "Maintenance · Line 02",
    amount: 2400,
    status: "pending",
  },
  {
    id: "REQ–025",
    item: "Safety equipment",
    department: "Operations · Workshop",
    amount: 680,
    status: "pending",
  },
];
export function decidePurchase(
  items: Purchase[],
  id: string,
  status: "approved" | "returned",
  reason = "",
): Purchase[] {
  if (status === "returned" && reason.trim().length < 3) return items;
  return items.map((item) =>
    item.id === id && item.status === "pending"
      ? {
          ...item,
          status,
          ...(status === "returned" ? { reason: reason.trim() } : {}),
        }
      : item,
  );
}
export function hasScheduleConflict(
  start: number,
  duration: number,
  busy: { start: number; end: number }[],
): boolean {
  return busy.some((slot) => start < slot.end && start + duration > slot.start);
}
export const demoDetails: Record<
  DemoIndustry,
  {
    name: string;
    label: string;
    headline: string;
    description: string;
    image: string;
    solution: string;
    range: string;
    steps: string[];
  }
> = {
  manufacturing: {
    name: "Manufacturing",
    label: "PURCHASING & OPERATIONS",
    headline: "Keep work moving. Stop chasing approvals.",
    description:
      "Bring the request, the budget, and the decision into one place. Try approving a purchase or return it with a clear next step.",
    image: "manufacturing.jpg",
    solution: "procurement",
    range: "A focused approval workflow typically starts at $5,000–$10,000.",
    steps: ["Review the request", "Make a decision", "See the summary update"],
  },
  "field-service": {
    name: "Field service",
    label: "SCHEDULING & JOB COMPLETION",
    headline: "The right person. The right place. A clear plan.",
    description:
      "Give your office and field team the same view of the job. Assign a technician, resolve a conflict, and complete the work.",
    image: "field-service.jpg",
    solution: "process-automation",
    range:
      "Connected scheduling and job workflows typically fit a $12,000–$30,000 custom system.",
    steps: ["Check availability", "Assign the job", "Complete the checklist"],
  },
  "professional-services": {
    name: "Professional services",
    label: "CLIENT ONBOARDING & HANDOFFS",
    headline: "A confident start for every new client.",
    description:
      "Make missing information visible before it holds up delivery. Complete the onboarding checklist and hand the project to its owner.",
    image: "professional-services.jpg",
    solution: "custom-software",
    range: "A focused onboarding workflow typically starts at $5,000–$10,000.",
    steps: [
      "Find the missing item",
      "Complete the brief",
      "Approve the handoff",
    ],
  },
};
