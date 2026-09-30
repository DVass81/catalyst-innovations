import type { Industry } from "./redesign";
export type SceneKind =
  | "request"
  | "quote"
  | "schedule"
  | "inventory"
  | "invoice"
  | "overview"
  | "review"
  | "report"
  | "sync"
  | "campaign";
export type StoryStep = {
  label: string;
  title: string;
  caption: string;
  kind: SceneKind;
  status: string;
  fields: [string, string][];
  note: string;
  transition?: { at: number; status: string; note: string };
};
export type MotionStory = {
  id: string;
  title: string;
  record: string;
  subject: string;
  duration: number;
  steps: StoryStep[];
};
const step = (
  label: string,
  title: string,
  caption: string,
  kind: SceneKind,
  status: string,
  fields: [string, string][],
  note: string,
): StoryStep => ({ label, title, caption, kind, status, fields, note });
export const connectedStory: MotionStory = {
  id: "connected",
  title: "One request. Every step connected.",
  record: "JOB 104",
  subject: "Equipment service",
  duration: 15000,
  steps: [
    step(
      "Request",
      "Capture the details once.",
      "A new inquiry becomes a customer record. The job details stay with it from here.",
      "request",
      "Request received",
      [
        ["Customer", "Example customer"],
        ["Work requested", "Equipment service"],
        ["Next step", "Prepare a quote"],
      ],
      "One record. Ready for the next step.",
    ),
    {
      ...step(
        "Quote",
        "Keep the next step moving.",
        "The same request becomes a quote. Customer approval moves the work forward.",
        "quote",
        "Awaiting customer approval",
        [
          ["Scope", "Equipment service"],
          ["Prepared from", "The original request"],
          ["Approval", "Customer review"],
        ],
        "Ready for the customer to review.",
      ),
      transition: {
        at: 0.55,
        status: "Approved by customer",
        note: "Customer approval recorded. Ready to schedule.",
      },
    },
    step(
      "Job & materials",
      "Connect the office and the work.",
      "The approved job reaches the schedule. Materials and instructions are connected to the same job.",
      "schedule",
      "Approved job scheduled",
      [
        ["Assigned to", "Service team"],
        ["Job details", "Equipment service"],
        ["Materials", "Linked to JOB 104"],
      ],
      "A shared plan for the office and the field.",
    ),
    step(
      "Invoice",
      "Bring the work and numbers together.",
      "Once the team records completion, those details help prepare the invoice. Ready to bill does not mean paid.",
      "invoice",
      "Completion recorded",
      [
        ["Completed work", "Equipment service"],
        ["Source record", "JOB 104"],
        ["Billing status", "Ready for review"],
      ],
      "Completed work → invoice prepared for review.",
    ),
    step(
      "Connected",
      "Your business. Working together.",
      "Customer details, work, materials and billing share one connected record. Your team can see what happens next.",
      "overview",
      "One connected record",
      [
        ["Customer & quote", "Approval recorded"],
        ["Job & materials", "Completion recorded"],
        ["Invoice", "Ready for review"],
      ],
      "Built around the way your business works.",
    ),
  ],
};
function story(
  id: string,
  title: string,
  subject: string,
  steps: StoryStep[],
): MotionStory {
  return {
    id,
    title,
    subject,
    record: "EXAMPLE 104",
    duration: steps.length * 3000,
    steps,
  };
}
const automation = story(
  "automation",
  "From incoming information to the right next step.",
  "Service request",
  [
    step(
      "Capture",
      "Bring the request into one place.",
      "Start with the information your team already receives.",
      "request",
      "Information received",
      [
        ["Source", "Incoming request"],
        ["Subject", "Service request"],
        ["Next step", "Prepare a draft"],
      ],
      "Keep the original information attached.",
    ),
    step(
      "Prepare",
      "Give your team a useful head start.",
      "An assisted workflow organizes the information into a draft for a person to review.",
      "quote",
      "Draft prepared",
      [
        ["Details", "Organized"],
        ["Suggested action", "Follow-up"],
        ["Decision", "Human review required"],
      ],
      "A draft, not an unattended decision.",
    ),
    step(
      "Review",
      "Keep people in control.",
      "The reviewer checks the information and explicitly approves the next action.",
      "review",
      "Approved by reviewer",
      [
        ["Source", "Original request"],
        ["Draft", "Reviewed"],
        ["Decision", "Approved"],
      ],
      "Approval is recorded before the handoff.",
    ),
    step(
      "Act",
      "Move the approved work forward.",
      "The approved request becomes an assigned task with its context attached.",
      "sync",
      "Task assigned",
      [
        ["Approval", "Recorded"],
        ["Owner", "Operations team"],
        ["Context", "Original request attached"],
      ],
      "The next person gets the information they need.",
    ),
  ],
);
const procurement = story(
  "procurement",
  "From a stock need to a recorded delivery.",
  "Replacement parts",
  [
    step(
      "Stock need",
      "Know what the work needs.",
      "A stock need becomes a purchase request linked to the work.",
      "inventory",
      "Reorder review",
      [
        ["Item", "Replacement parts"],
        ["Stock", "Reorder review needed"],
        ["Source", "Inventory record"],
      ],
      "A signal to review, not an automatic purchase.",
    ),
    step(
      "Request",
      "Prepare the purchase request.",
      "Item details carry into a request for the purchasing team.",
      "quote",
      "Request prepared",
      [
        ["Item", "Replacement parts"],
        ["Supplier", "Example supplier"],
        ["Next step", "Approval"],
      ],
      "The request carries the original stock need.",
    ),
    step(
      "Approve",
      "Record the purchasing decision.",
      "An authorized person reviews and approves the request before ordering.",
      "review",
      "Purchase approved",
      [
        ["Request", "Reviewed"],
        ["Decision", "Approved"],
        ["Next step", "Place order"],
      ],
      "Approval precedes the order.",
    ),
    step(
      "Receive",
      "Connect receiving and inventory.",
      "After the order arrives and is checked, receipt details update the stock record.",
      "inventory",
      "Receipt recorded",
      [
        ["Delivery", "Checked by team"],
        ["Receipt", "Recorded"],
        ["Stock record", "Updated"],
      ],
      "Actual receipt, then an inventory update.",
    ),
  ],
);
const manufacturing = story(
  "manufacturing",
  "Keep the production record moving with the work.",
  "Production order",
  [
    step(
      "Order",
      "Start with the order.",
      "Bring the specification and work requirements together.",
      "request",
      "Order captured",
      [
        ["Work", "Production order"],
        ["Specification", "Attached"],
        ["Next step", "Materials review"],
      ],
      "The specification stays with the order.",
    ),
    step(
      "Materials",
      "Connect the materials.",
      "Check the materials needed for the same order.",
      "inventory",
      "Materials checked",
      [
        ["Order", "EXAMPLE 104"],
        ["Materials", "Available for the order"],
        ["Next step", "Schedule production"],
      ],
      "Material availability checked before work starts.",
    ),
    step(
      "Production",
      "Give the team a shared view.",
      "The production team records progress against the order.",
      "schedule",
      "Work recorded",
      [
        ["Order", "EXAMPLE 104"],
        ["Instructions", "Attached"],
        ["Next step", "Quality review"],
      ],
      "Progress follows the actual work.",
    ),
    step(
      "Quality",
      "Make review part of the process.",
      "Record the quality review before releasing the order.",
      "review",
      "Quality review recorded",
      [
        ["Work", "Production order"],
        ["Review", "Recorded by team"],
        ["Release", "Ready for authorization"],
      ],
      "A clear record of what was checked.",
    ),
  ],
);
const reporting = story(
  "reporting",
  "From scattered records to a clearer view.",
  "Operations report",
  [
    step(
      "Records",
      "Start with the source.",
      "Bring relevant customer, job and purchasing records into the same reporting workflow.",
      "sync",
      "Sources connected",
      [
        ["Customer records", "Connected"],
        ["Job records", "Connected"],
        ["Purchasing records", "Connected"],
      ],
      "Keep each source traceable.",
    ),
    step(
      "Report",
      "See the information together.",
      "Organize source records into a shared operational report.",
      "report",
      "Report assembled",
      [
        ["Work awaiting review", "Visible"],
        ["Open requests", "Visible"],
        ["Record sources", "Linked"],
      ],
      "A view of the work, not invented performance figures.",
    ),
    step(
      "Attention",
      "Find the next useful action.",
      "Highlight records that need a person’s attention and link back to the source.",
      "review",
      "Review needed",
      [
        ["Item", "Pending approval"],
        ["Owner", "Operations team"],
        ["Action", "Open source record"],
      ],
      "Go from a report to the work behind it.",
    ),
  ],
);
const integrations = story(
  "integrations",
  "Enter it once. Keep the right systems in sync.",
  "Customer update",
  [
    step(
      "Enter",
      "Update the original record.",
      "A change starts in the system your team uses.",
      "request",
      "Record updated",
      [
        ["Record", "Example customer"],
        ["Change", "Contact preference"],
        ["Source", "Customer system"],
      ],
      "One deliberate change.",
    ),
    step(
      "Match",
      "Match the right records.",
      "Use the shared record identifier to match information across the connected tools.",
      "review",
      "Matching record found",
      [
        ["Shared identifier", "EXAMPLE 104"],
        ["Source", "Customer system"],
        ["Destination", "Operations system"],
      ],
      "The same record, linked across systems.",
    ),
    step(
      "Sync",
      "Carry the change forward.",
      "The connected record receives the update and the workflow records its status.",
      "sync",
      "Update confirmed",
      [
        ["Source record", "Updated"],
        ["Connected record", "Updated"],
        ["Sync status", "Confirmed"],
      ],
      "A visible handoff, without retyping the same details.",
    ),
  ],
);
export const solutionStories: Record<string, MotionStory> = {
  "custom-software": connectedStory,
  "ai-automation": automation,
  "process-automation": automation,
  procurement: procurement,
  "supply-chain": procurement,
  "manufacturing-operations": manufacturing,
  "data-intelligence": reporting,
  "integrations-consulting": integrations,
};
const community = story(
  "community",
  "Give a community request a clear next step.",
  "Maintenance request",
  [
    step(
      "Request",
      "Bring the request together.",
      "An illustrative resident request starts a shared record.",
      "request",
      "Request received",
      [
        ["Subject", "Maintenance request"],
        ["Details", "Attached"],
        ["Next step", "Review"],
      ],
      "Illustrative concept, not a client screenshot.",
    ),
    step(
      "Assign",
      "Make responsibility clear.",
      "The reviewed request is assigned to the right team.",
      "schedule",
      "Assigned for review",
      [
        ["Request", "EXAMPLE 104"],
        ["Owner", "Community team"],
        ["Next step", "Coordinate work"],
      ],
      "A shared record for follow-up.",
    ),
    step(
      "Coordinate",
      "Keep the conversation with the work.",
      "Notes and scheduling stay attached to the request.",
      "schedule",
      "Work coordinated",
      [
        ["Instructions", "Attached"],
        ["Scheduling", "Coordinated"],
        ["Next step", "Record completion"],
      ],
      "Updates stay in one place.",
    ),
    step(
      "Complete",
      "Record what happened.",
      "Completion is recorded by the team responsible for the work.",
      "review",
      "Completion recorded",
      [
        ["Request", "EXAMPLE 104"],
        ["Work record", "Updated"],
        ["Next step", "Review summary"],
      ],
      "A recorded outcome, ready to review.",
    ),
    step(
      "Report",
      "Keep a useful history.",
      "The completed request remains available in the community’s records.",
      "report",
      "History available",
      [
        ["Request", "Retained"],
        ["Updates", "Linked"],
        ["Completion", "Recorded"],
      ],
      "A clearer record of community work.",
    ),
  ],
);
const fundraising = story(
  "fundraising",
  "Connect a cause and the people supporting it.",
  "Community campaign",
  [
    step(
      "Campaign",
      "Give the cause a clear home.",
      "An illustrative campaign page explains the purpose and how people can help.",
      "campaign",
      "Campaign page",
      [
        ["Cause", "Community campaign"],
        ["Purpose", "Clearly explained"],
        ["Next step", "Share the campaign"],
      ],
      "Illustrative concept, not a client screenshot.",
    ),
    step(
      "Outreach",
      "Make the next action easy to find.",
      "A clear campaign page gives outreach somewhere useful to lead.",
      "request",
      "Campaign shared",
      [
        ["Campaign", "Community campaign"],
        ["Call to action", "Support the cause"],
        ["Next step", "Supporter response"],
      ],
      "One clear destination for the campaign.",
    ),
    step(
      "Contribution",
      "Keep the response connected.",
      "This concept shows how a contribution record could connect to the campaign.",
      "invoice",
      "Example response recorded",
      [
        ["Campaign", "Community campaign"],
        ["Record", "Illustrative contribution"],
        ["Next step", "Review and follow up"],
      ],
      "No real payment is collected in this demonstration.",
    ),
    step(
      "Follow-up",
      "Keep the human connection.",
      "The campaign record gives the team context for a thoughtful follow-up.",
      "quote",
      "Follow-up prepared",
      [
        ["Campaign", "Community campaign"],
        ["Context", "Response linked"],
        ["Next step", "Team review"],
      ],
      "The team reviews the message before sending.",
    ),
    step(
      "Report",
      "See the campaign record together.",
      "An illustrative summary links outreach, responses and follow-ups.",
      "report",
      "Campaign summary",
      [
        ["Outreach", "Linked"],
        ["Responses", "Linked"],
        ["Follow-ups", "Linked"],
      ],
      "No invented totals or fundraising results.",
    ),
  ],
);
export const projectMotionStories = [
  fundraising,
  community,
  {
    ...connectedStory,
    id: "painting-concept",
    subject: "Painting estimate",
    record: "JOB 104",
    steps: connectedStory.steps.map((s) => ({
      ...s,
      fields: s.fields.map(
        ([k, v]) =>
          [k, v === "Equipment service" ? "Painting work" : v] as [
            string,
            string,
          ],
      ),
    })),
  },
];

const dispatchStep = step(
  "Dispatch",
  "Release the reviewed work.",
  "Quality review is recorded before the team authorizes dispatch.",
  "sync",
  "Release authorized",
  [
    ["Quality review", "Recorded"],
    ["Dispatch", "Authorized"],
    ["Order history", "Attached"],
  ],
  "Review first. Release second.",
);
const tradeSteps = [
  connectedStory.steps[0],
  connectedStory.steps[1],
  connectedStory.steps[2],
  step(
    "Materials",
    "Give materials a place in the plan.",
    "The team checks and links the materials needed for the scheduled job.",
    "inventory",
    "Materials checked",
    [
      ["Job", "JOB 104"],
      ["Materials", "Linked to the job"],
      ["Next step", "Complete the work"],
    ],
    "The materials record stays with the job.",
  ),
  connectedStory.steps[3],
];
const distributionSteps = [
  step(
    "Order",
    "Keep the order details together.",
    "Capture the order and its requirements in one shared record.",
    "request",
    "Order captured",
    [
      ["Order", "EXAMPLE 104"],
      ["Items", "Order details attached"],
      ["Next step", "Check stock"],
    ],
    "Order details travel with the work.",
  ),
  step(
    "Stock check",
    "Check availability before the handoff.",
    "Review available stock against the same order.",
    "inventory",
    "Availability checked",
    [
      ["Order", "EXAMPLE 104"],
      ["Stock", "Checked against the order"],
      ["Next step", "Prepare picking"],
    ],
    "A stock check before picking begins.",
  ),
  step(
    "Pick",
    "Give the warehouse a clear picking record.",
    "The team records what was picked against the order.",
    "inventory",
    "Picking recorded",
    [
      ["Order", "EXAMPLE 104"],
      ["Pick list", "Attached"],
      ["Next step", "Check and ship"],
    ],
    "The picking record stays with the order.",
  ),
  step(
    "Ship",
    "Record the outbound handoff.",
    "After the picked order is checked, shipment details are recorded.",
    "schedule",
    "Shipment recorded",
    [
      ["Order check", "Recorded"],
      ["Shipment", "Details attached"],
      ["Next step", "Prepare invoice"],
    ],
    "Checked work, then a shipment record.",
  ),
  step(
    "Invoice",
    "Connect shipping and billing.",
    "Use the shipment record to prepare an invoice for review.",
    "invoice",
    "Invoice prepared",
    [
      ["Source", "Shipment record"],
      ["Order", "EXAMPLE 104"],
      ["Billing", "Ready for review"],
    ],
    "Prepared for review. No payment is implied.",
  ),
];
const financialSteps = [
  automation.steps[0],
  {
    ...automation.steps[1],
    kind: "review" as const,
    label: "Review",
    title: "Review the request with its context.",
    status: "Human review in progress",
    note: "Review before a decision is recorded.",
  },
  automation.steps[2],
  automation.steps[3],
  reporting.steps[1],
];
const growthSteps = [
  connectedStory.steps[0],
  step(
    "Plan",
    "Put a shared plan around the request.",
    "The team reviews the request and agrees on the next steps.",
    "schedule",
    "Plan reviewed",
    [
      ["Request", "JOB 104"],
      ["Plan", "Agreed by team"],
      ["Next step", "Assign the work"],
    ],
    "A reviewed plan before the work begins.",
  ),
  step(
    "Work",
    "Keep progress with the original request.",
    "Assigned work carries the instructions and history the team needs.",
    "schedule",
    "Completion recorded",
    [
      ["Work", "Equipment service"],
      ["Owner", "Operations team"],
      ["Completion", "Recorded by team"],
    ],
    "The team records completion before billing.",
  ),
  connectedStory.steps[3],
  {
    ...reporting.steps[1],
    fields: [
      ["Customer record", "Linked"],
      ["Work record", "Linked"],
      ["Invoice record", "Linked"],
    ] as [string, string][],
  },
];
export function industryStory(industry: Industry): MotionStory {
  const isFundraising = ["schools-athletics", "churches-nonprofits"].includes(
    industry.slug,
  );
  const group = industry.group;
  const base = isFundraising
    ? fundraising
    : industry.slug === "hoa"
      ? community
      : group.startsWith("Manufacturing")
        ? manufacturing
        : group.startsWith("Distribution")
          ? { ...procurement, subject: "Customer order" }
          : group.startsWith("Financial")
            ? automation
            : connectedStory;
  const scenes = isFundraising
    ? fundraising.steps
    : industry.slug === "hoa"
      ? community.steps
      : group.startsWith("Manufacturing")
        ? [...manufacturing.steps, dispatchStep]
        : group.startsWith("Distribution")
          ? distributionSteps
          : group.startsWith("Financial")
            ? financialSteps
            : group.startsWith("Growing")
              ? growthSteps
              : tradeSteps;
  return {
    ...base,
    id: "industry-" + industry.slug,
    title: "Connected work for " + industry.name.toLowerCase() + ".",
    duration: 15000,
    steps: industry.workflow.map((label, n) => ({ ...scenes[n], label })),
  };
}

/** Populate only after the generated film has passed content and playback review. */
export const signatureFilm: {
  status: "pending" | "reviewed";
  src?: string;
  poster?: string;
} = { status: "pending" };
