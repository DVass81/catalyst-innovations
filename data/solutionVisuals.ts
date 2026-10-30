import type { WorkflowStep } from "@/components/studio/WorkflowDiagram";
import type { studioPhotos } from "./studioMedia";

export type SolutionVisual = {
  photoKey: keyof typeof studioPhotos;
  photoNote: string;
  workflowTitle: string;
  workflow: readonly WorkflowStep[];
  caption: string;
};

/** Original conceptual workflows; actual application demonstrations are labeled separately. */
export const solutionVisuals: Record<string, SolutionVisual> = {
  "custom-software": {
    photoKey: "planning", photoNote: "The starting point is your team's real work.",
    workflowTitle: "One job, from the first request to the office handoff.",
    workflow: [
      { title: "Capture the request", detail: "Keep customer details and the work requested in one job record.", record: "Customer + job" },
      { title: "Approve the scope", detail: "Record the agreed quote before scheduling the work.", record: "Human approval" },
      { title: "Coordinate the job", detail: "Connect the schedule, material needs and completion update.", record: "Office + field" },
      { title: "Prepare the invoice", detail: "Review completed work and approved changes before billing.", record: "Reviewed handoff" },
    ],
    caption: "A possible custom-software workflow. Scope, permissions and existing-system connections are agreed for each engagement.",
  },
  "ai-automation": {
    photoKey: "office", photoNote: "Give people better preparation for the decisions they make.",
    workflowTitle: "Assistance that reaches a person before the next action.",
    workflow: [
      { title: "Find the source", detail: "Start with the approved document or information the task needs.", record: "Traceable input" },
      { title: "Prepare a draft", detail: "Extract details or assemble a suggested summary for review.", record: "AI assistance" },
      { title: "Check the details", detail: "A person checks the source, uncertainty and proposed action.", record: "Human review" },
      { title: "Move it forward", detail: "Take only the permitted action, preserving the review record.", record: "Agreed permissions" },
    ],
    caption: "AI assistance is assessed for a specific task. Ambiguous information and consequential decisions need the agreed review and fallback.",
  },
  procurement: {
    photoKey: "warehouse", photoNote: "Connect what the team needs with what is actually received.",
    workflowTitle: "From a material need to a checked receipt.",
    workflow: [
      { title: "Identify the need", detail: "Review demand, stock and outstanding orders for the item.", record: "One item reference" },
      { title: "Approve the purchase", detail: "Check the supplier, amount and budget before commitment.", record: "Approval record" },
      { title: "Track the order", detail: "Keep the purchase order, expected date and changes visible.", record: "Purchase order" },
      { title: "Check the receipt", detail: "Record received, short and damaged quantities separately.", record: "Actual quantities" },
    ],
    caption: "Illustrative purchasing handoffs include partial deliveries and exceptions. Sending an order and changing stock follow the agreed controls.",
  },
  "manufacturing-operations": {
    photoKey: "manufacturing", photoNote: "Production visibility starts with a record the floor can trust.",
    workflowTitle: "A work order that stays connected to the floor.",
    workflow: [
      { title: "Define the order", detail: "Identify the quantity, operations and materials required.", record: "Work order" },
      { title: "Check readiness", detail: "Make material shortages and their owners visible.", record: "Ready or held" },
      { title: "Record progress", detail: "Capture the current operation and actual quantities.", record: "Floor update" },
      { title: "Review quality", detail: "Keep accepted, held and reworked quantities distinct.", record: "Required check" },
      { title: "Release the work", detail: "Complete the agreed review before dispatch or the next handoff.", record: "Reviewed release" },
    ],
    caption: "An operational-information workflow. Machine controls, safety functions and equipment connectivity require their own assessment.",
  },
  "supply-chain": {
    photoKey: "warehouse", photoNote: "A useful supply view shows the decision that needs attention.",
    workflowTitle: "Make a supply exception understandable and actionable.",
    workflow: [
      { title: "Connect demand", detail: "Bring item demand and recorded stock into the same view.", record: "Demand + stock" },
      { title: "Check receipts", detail: "Review open orders and the latest expected delivery dates.", record: "Expected supply" },
      { title: "Explain the gap", detail: "Show which work is affected by a delay or shortage.", record: "Visible exception" },
      { title: "Agree the response", detail: "A buyer reviews options and records the next action.", record: "Buyer decision" },
    ],
    caption: "The illustration shows a reviewed exception process. Supplier performance, accurate records and the team's decisions still determine availability.",
  },
  "process-automation": {
    photoKey: "planning", photoNote: "Make the next responsibility visible to the next person.",
    workflowTitle: "A request with a clear decision and next step.",
    workflow: [
      { title: "Create the request", detail: "Capture the information the reviewer actually needs.", record: "Shared reference" },
      { title: "Route for review", detail: "Assign an owner and keep requests for clarification visible.", record: "Named reviewer" },
      { title: "Record the decision", detail: "Separate approval, rejection and a request for changes.", record: "Human decision" },
      { title: "Create the next task", detail: "Carry the approved details forward; flag failed steps for follow-up.", record: "Visible handoff" },
    ],
    caption: "A possible approval workflow. Routing, reminders and exception handling are defined before automation is introduced.",
  },
  "data-intelligence": {
    photoKey: "office", photoNote: "Clear reporting comes from clear definitions and dependable inputs.",
    workflowTitle: "From source records to a question worth answering.",
    workflow: [
      { title: "Identify the records", detail: "Agree where the information comes from and who maintains it.", record: "Source ownership" },
      { title: "Define the measure", detail: "Set the calculation, period and appropriate refresh frequency.", record: "Shared meaning" },
      { title: "Reconcile the report", detail: "Check sample results and show when the data was updated.", record: "Checked figures" },
      { title: "Focus attention", detail: "Highlight the exception and the decision someone needs to make.", record: "Useful next action" },
    ],
    caption: "Illustrative reporting preparation. Refresh speed and available measures depend on the source systems and agreed definitions.",
  },
  "integrations-consulting": {
    photoKey: "planning", photoNote: "Keep useful tools. Connect the information between them carefully.",
    workflowTitle: "A checked connection between the tools you already use.",
    workflow: [
      { title: "Choose the owner", detail: "Agree which system maintains each important record.", record: "System of record" },
      { title: "Map the fields", detail: "Define matching rules, permissions and update behavior.", record: "Agreed mapping" },
      { title: "Test the transfer", detail: "Check normal records, duplicates and changed information.", record: "Reviewed test" },
      { title: "Follow exceptions", detail: "Keep failed transfers visible with a deliberate recovery path.", record: "Retry + review" },
    ],
    caption: "A possible integration approach. Supported interfaces, permissions and recovery behavior are confirmed before delivery is scoped.",
  },
};
