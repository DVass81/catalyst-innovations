import type { studioPhotos } from "./studioMedia";
type GuideVisual = { photoKey: keyof typeof studioPhotos; steps: readonly [string, string, string]; description: string };
export const guideVisuals: Record<string, GuideVisual> = {
  "estimate-to-invoice-field-office": { photoKey: "painting", steps: ["Agree the scope", "Record the work", "Review for invoicing"], description: "Keep the same job reference through the field and office handoffs." },
  "manufacturing-spreadsheets": { photoKey: "manufacturing", steps: ["Follow one order", "Make holds visible", "Confirm completion"], description: "Understand the decisions behind the spreadsheet before changing the system." },
  "inventory-purchasing-stock": { photoKey: "warehouse", steps: ["Check demand", "Review the order", "Confirm the receipt"], description: "Connect item records, purchase decisions and what actually arrives." },
  "trackable-approval-workflows": { photoKey: "office", steps: ["Describe the request", "Record the decision", "Carry out the next action"], description: "Give a request an owner, a clear decision and a traceable next step." },
  "hoa-maintenance-requests": { photoKey: "community", steps: ["Describe the issue", "Coordinate review", "Record the outcome"], description: "Keep resident information and community decisions in the same request history." },
  "custom-software-vs-off-the-shelf": { photoKey: "planning", steps: ["Understand the process", "Compare the options", "Test the fit"], description: "Start with the work, then decide what to buy, connect or build." },
  "software-data-migration": { photoKey: "office", steps: ["Understand the records", "Check a sample", "Reconcile the move"], description: "Prepare the data and ownership decisions before moving business records." },
  "software-rollout-small-team": { photoKey: "planning", steps: ["Involve the team", "Try real handoffs", "Train and review"], description: "A useful rollout begins with the people who will use the software." },
};
