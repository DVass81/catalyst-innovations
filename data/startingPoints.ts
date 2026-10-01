export const startingPoints = [
  {
    id: "quoting",
    label: "Quoting & follow-up",
    category: "Quotes and follow-up",
    before:
      "Measurements, pricing and customer details live in different places.",
    after: "Bring scope and costs together before preparing a quote.",
    tool: "quoting-time",
    demo: "flooring",
  },
  {
    id: "scheduling",
    label: "Scheduling & handoffs",
    category: "Scheduling and handoffs",
    before: "People chase updates to find out what happens next.",
    after: "Capture a clear request and make the next handoff visible.",
    tool: "dispatch-admin",
    demo: "hoa",
  },
  {
    id: "inventory",
    label: "Inventory & purchasing",
    category: "Inventory and purchasing",
    before:
      "Stock needs and purchasing decisions depend on scattered information.",
    after:
      "Connect demand, stock and approvals. The estimate example shows how entered quantities feed the next decision.",
    tool: "inventory-carrying",
    demo: "flooring",
  },
  {
    id: "reporting",
    label: "Invoices & reporting",
    category: "Invoices and reporting",
    before: "The numbers have to be assembled again before a decision.",
    after:
      "Bring entered costs into a reviewable summary. Start with the painting prototype’s estimate review.",
    tool: "invoice-preparation",
    demo: "painting",
  },
  {
    id: "administration",
    label: "Everyday administration",
    category: "Too much manual entry",
    before: "The same information gets copied, checked and chased.",
    after:
      "Collect the right details once, then review them before the next step.",
    tool: "manual-work",
    demo: "hoa",
  },
] as const;
export function recommendedDemo(group: string, slug: string) {
  if (slug === "painting")
    return {
      id: "painting",
      reason:
        "See how scope and pricing come together in a planned painting system.",
    };
  if (group === "Trades & construction")
    return {
      id: "flooring",
      reason:
        "See how a trade estimator connects measurements and costs. We adapt the approach to your work.",
    };
  if (
    group === "Manufacturing & fabrication" ||
    group === "Distribution & warehousing"
  )
    return {
      id: "flooring",
      reason:
        "This estimating example shows quantities feeding cost decisions. It illustrates a transferable pattern, not a warehouse or manufacturing product.",
    };
  return {
    id: "hoa",
    reason:
      "This community example shows request intake and review—a useful pattern for teams coordinating incoming work.",
  };
}
