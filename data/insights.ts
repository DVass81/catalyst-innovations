export type InsightSource = { title: string; url: string; reviewedAt: string };
export type InsightSection = { id: string; heading: string; paragraphs: string[]; checklist?: string[]; source?: number };
export type Insight = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  introduction: string;
  takeaway: string;
  sections: InsightSection[];
  example: { title: string; text: string };
  nextStep: string;
  tools: string[];
  solution: string;
  industry?: string;
  demo?: "painting" | "flooring" | "hoa";
  sources: InsightSource[];
};

const publishedAt = "2026-10-02";
const source = (title: string, url: string): InsightSource => ({ title, url, reviewedAt: publishedAt });

/** Original editorial guidance. Examples are hypothetical; sources support the attributed background only. */
export const insights: Insight[] = [
  {
    slug: "estimate-to-invoice-field-office",
    title: "From estimate to invoice: connecting the field and office",
    description: "A practical way to connect scope, approvals, field updates and invoice preparation without asking your team to enter every detail twice.",
    category: "Trades & field work", publishedAt, updatedAt: publishedAt,
    introduction: "A job can look organized in the estimate and still become hard to follow once work starts. The crew has the latest measurements, the office has the approved price, and an extra request lives in a text message. Start by connecting those handoffs. You do not need to replace every tool to establish one reliable job record.",
    takeaway: "Give each job one identity, preserve the approved scope, and make completion a clear handoff to the office.",
    sections: [
      { id: "one-job-record", heading: "1. Give the work one shared reference", paragraphs: ["Choose a job number that follows the customer inquiry, estimate, schedule, material request and invoice. Decide which system owns the customer address and contact information. Other screens should refer to that record rather than create independent copies.", "Keep the first version small: customer, location, scope, current status and the person responsible for the next step. A long intake form can simply move the administrative burden to the field."] },
      { id: "approved-scope", heading: "2. Keep the approved scope visible", paragraphs: ["Save the version the customer approved. Record changes separately with their description, price impact, decision and date. AIA Contract Documents’ G701 change-order resource illustrates why agreed changes to scope and cost need a clear record. Your exact authorization process should follow the agreement used for the job."], checklist: ["Show the current approved scope alongside proposed changes.", "Keep a requested change distinct from an approved change.", "Make the billing status of each approved change visible."], source: 0 },
      { id: "field-handoff", heading: "3. Ask for the update the office actually needs", paragraphs: ["A useful field update tells the office what happened and what to do next. For one type of job, that might be work completed, quantities used, supporting photos and remaining work. Test those fields with the person preparing invoices before adding more.", "Make the mobile screen easy to use with short choices and a place for exceptions. If crews need offline capture, specify and test it explicitly; a mobile-friendly website does not automatically work without a connection."] },
      { id: "invoice-ready", heading: "4. Separate complete work from invoice-ready work", paragraphs: ["Use an office review step to check the approved scope, completed work and billable changes. An integration can prepare a draft in an accounting system when its interface and permissions support that handoff. Sending an invoice or collecting payment should be a separate, deliberate action.", "For a pilot, track missing completion details, time spent preparing invoices and jobs waiting for review. Compare the same type of work before and after the change. Time returned is useful capacity; it is not automatically money saved."] },
    ],
    example: { title: "A painting job with an added room", text: "In this fictional example, the estimate covers two rooms. The customer requests a third. The crew records the request against the same job, the office prepares the price, and approval is recorded before the extra work becomes billable. Completion notes then support the invoice review. This describes a possible workflow, not a measured outcome from a Catalyst customer." },
    nextStep: "Bring one recent estimate, a blank field-update form and a sample invoice. Remove private information first. Together we can identify the handoff that deserves attention before discussing a larger system.",
    tools: ["quoting-time", "invoice-preparation", "change-orders"], solution: "custom-software", industry: "painting", demo: "painting",
    sources: [source("AIA Contract Documents: G701 change order", "https://learn.aiacontracts.com/aia-document/g701-2017/")],
  },
  {
    slug: "manufacturing-spreadsheets",
    title: "When manufacturing spreadsheets stop keeping up",
    description: "Learn when shared spreadsheets need a connected production workflow, and how to start with orders, materials and status without replacing everything.",
    category: "Manufacturing", publishedAt, updatedAt: publishedAt,
    introduction: "A spreadsheet can be a sensible way to plan production. The warning sign is not the file format. It is the growing amount of work required to reconcile versions, find the current order status or explain why a job cannot move. A useful software project starts with those decisions and handoffs, not a bigger dashboard.",
    takeaway: "Map one product family from order to dispatch, then connect the information needed to move that work safely and predictably.",
    sections: [
      { id: "find-the-friction", heading: "1. Find where the plan stops matching the floor", paragraphs: ["Follow one recent order with a planner, an operator and a materials owner. Note where people call someone, retype a number or wait for information. Distinguish a data problem from a capacity or equipment problem: software can expose a missing material, but cannot manufacture it.", "NIST MEP describes value-stream mapping as a way to see both manufacturing processes and information flows. Its approach starts with the current state, identifies improvements and then implements a future state. That is a useful foundation for deciding what a system should support."], source: 0 },
      { id: "define-status", heading: "2. Agree on what each status means", paragraphs: ["Define a small number of states such as ready, in progress, waiting on material, quality review and complete. Give each one an entry condition and an owner. A record should explain why work is blocked, not simply turn red.", "Decide whether quantities mean planned, started, accepted or shipped units. Mixing those meanings in one production total can make a polished report less useful than the spreadsheet it replaces."] },
      { id: "connect-records", heading: "3. Connect the minimum records", paragraphs: ["Start with an order identifier, required materials, work steps, quantities and a dated status history. If a current ERP already owns the order or item master, assess its export or API before building another source of truth."], checklist: ["Record who maintains part numbers and units of measure.", "Define how shortages and quality holds are raised and cleared.", "Keep rejected or reworked quantities distinct from accepted output.", "Specify access, correction history and backups for the pilot." ] },
      { id: "pilot-one-flow", heading: "4. Pilot one flow and compare the evidence", paragraphs: ["Choose a contained product family or department with an available process owner. Run representative normal orders and exceptions through the proposed flow: a shortage, a revised due date, a quality hold and a partial completion. Teach the team how to correct an error before expanding access.", "Measure the time needed to find an order, reconcile a report and explain a hold. Record downtime and scrap using your own costs. Do not assume that every recorded interruption could have been prevented by the software."] },
    ],
    example: { title: "One fabrication order, one current status", text: "A fictional fabrication shop keeps its accounting software but gives work orders a shared status record. When one item is short, the planner sees the affected operation and the purchasing owner. The order stays on hold until someone confirms the material is available. No automatic production or quality approval is implied." },
    nextStep: "Start with one production spreadsheet and a sketch of the decisions it supports. Catalyst can help separate the essential workflow from reports that would be useful later.",
    tools: ["downtime-cost", "scrap-rework", "reporting-time"], solution: "manufacturing-operations", industry: "manufacturing",
    sources: [source("NIST MEP: Value Stream Mapping", "https://www.nist.gov/mep/value-stream-mapping")],
  },
  {
    slug: "inventory-purchasing-stock",
    title: "Connecting inventory and purchasing before stock runs short",
    description: "A practical starting point for linking item records, demand, purchase orders and receiving so stock decisions use the same information.",
    category: "Inventory & purchasing", publishedAt, updatedAt: publishedAt,
    introduction: "A stock count and a purchase-order list answer different questions. One describes what is recorded on hand; the other describes what is expected. Teams need both, together with reservations and demand, to decide what to buy. The starting point is consistent records and ownership, not a promise that a forecasting tool will eliminate shortages.",
    takeaway: "Connect the item, the demand, the order and the receipt before automating a buying decision.",
    sections: [
      { id: "item-basics", heading: "1. Make the item record dependable", paragraphs: ["Give each item a stable identifier, a description, a purchasing unit and a stocking unit. Record the conversion if a supplier sells cases while your team consumes individual units. Name the person who can approve a new item or merge a duplicate.", "Check a small sample against the shelf. A connection between two systems will move bad information efficiently if the underlying count or unit is wrong. Include returns, damaged stock and stock reserved for an existing order in the discussion."] },
      { id: "replenishment", heading: "2. Write down the replenishment rule", paragraphs: ["For a simple starting estimate, a reorder point is average daily demand multiplied by lead time, plus a chosen safety-stock buffer. Use matching time units and review actual supplier performance rather than relying only on a catalog lead time.", "ASCM describes safety stock as a buffer for demand spikes or supply disruptions. A buffer is a choice with a carrying cost, not a guarantee of availability. Seasonal demand, minimum order quantities and variable lead times may require a more detailed planning approach."], source: 0 },
      { id: "approval-receiving", heading: "3. Keep the purchasing decision reviewable", paragraphs: ["A low-stock alert should explain the item, demand, available quantity, open orders and proposed action. Decide who checks that information, who approves the purchase and what happens if the supplier cannot meet the need. Starting with an alert and human review is often a clearer pilot than automatic ordering.", "Receiving needs its own record: what arrived, when, against which order and whether any quantity is damaged or short. Marking a purchase order as received without recording a partial delivery can hide the very problem the workflow is meant to expose."] },
      { id: "exceptions", heading: "4. Test the exceptions before expanding", paragraphs: ["Use sample orders to test a partial receipt, a duplicate receipt, a changed delivery date and a canceled demand. Make corrections visible to the people who use the stock figure. Agree on the frequency of reconciliation with accounting or the warehouse system."], checklist: ["Choose a small group of items for the pilot.", "Review count accuracy and overdue purchase orders.", "Track administrative time separately from inventory investment.", "Do not add released working capital to annual recurring savings." ] },
    ],
    example: { title: "A transparent reorder calculation", text: "For illustration only, an item used at 20 units per day with a seven-day lead time and 50 units of safety stock has a starting reorder point of 190 units. That arithmetic is not a recommended stocking policy. Open purchase orders, reservations, variability and supplier constraints still need review." },
    nextStep: "Bring a small item list, one purchase order and your current receiving process. We can identify which records should connect before designing alerts or purchasing automation.",
    tools: ["reorder-point", "inventory-carrying", "purchase-orders"], solution: "procurement", industry: "warehousing",
    sources: [source("ASCM: Supply Chain Resilience", "https://www.ascm.org/topics/what-is-supply-chain-resilience/")],
  },
  {
    slug: "trackable-approval-workflows",
    title: "Replacing email approvals with a trackable workflow",
    description: "Define request details, reviewers, decisions and exceptions so approvals can be followed without searching through email threads.",
    category: "Everyday operations", publishedAt, updatedAt: publishedAt,
    introduction: "Email is useful for conversation. It becomes difficult to use as the only record of an approval when requests change, reviewers are away or someone needs to reconstruct a decision. A trackable workflow gives the request a stable record while keeping the actual decision with the right person.",
    takeaway: "Make the request, the decision and the next action separate and visible. Automate routing before automating judgment.",
    sections: [
      { id: "request-record", heading: "1. Define a complete request", paragraphs: ["Start with one request type, such as a purchase or a scope change. List the information the reviewer needs: purpose, amount, owner, supporting document and deadline. Mark only genuinely necessary information as required.", "Save one record with a reference number and version. If an amount or scope changes after submission, define whether approval must restart. An old approval should not silently authorize a different request."] },
      { id: "decision-rules", heading: "2. Agree on reviewer and exception rules", paragraphs: ["Write down who reviews the request and whether decisions happen in sequence or in parallel. Decide how a request is returned for clarification, rejected, reassigned or withdrawn. A reminder should point to the current record instead of creating another independent copy."], checklist: ["Identify the request owner and a backup reviewer.", "Define what changes require a fresh decision.", "Record the decision, reviewer, time and any explanation.", "Give overdue requests a visible owner rather than silently approving them." ] },
      { id: "existing-tools", heading: "3. Check what your existing tools can do", paragraphs: ["Microsoft documents approval workflows that capture a response and then update a record or take another action. That is one example of a capability a business may already have access to. Licensing, connectors and the exact review requirements still need checking before selecting an approach.", "Use standard functionality when it fits. A custom workflow becomes more useful when approvals depend on information spread across systems, unusual ownership rules or a field process that existing forms cannot capture clearly."], source: 0 },
      { id: "test-actions", heading: "4. Test the decision and the downstream action separately", paragraphs: ["An approval and a successful purchase-order creation are two different events. If the next system is unavailable, preserve the decision and show the failed handoff for retry. Avoid sending another order just because someone clicks twice.", "Walk through approval, rejection, missing information, absence and a downstream failure using fictional requests. In a pilot, compare the time spent chasing status, the number of returned requests and the time waiting for a decision. Faster decisions alone do not prove that controls are better."] },
    ],
    example: { title: "A purchase request with a visible next step", text: "A fictional operations team submits a material request with the item, quantity and job reference. The supervisor asks for clarification; the request returns to its owner. After resubmission and approval, purchasing prepares the order. Everyone sees the current state without treating an email acknowledgment as approval." },
    nextStep: "Choose one recurring request and show us a blank form or a redacted email chain. Catalyst can map the decision rules and identify a small, testable first workflow.",
    tools: ["purchase-orders", "manual-work", "duplicate-entry"], solution: "process-automation",
    sources: [source("Microsoft Learn: Create and test an approval workflow", "https://learn.microsoft.com/en-us/power-automate/modern-approvals")],
  },
  {
    slug: "hoa-maintenance-requests",
    title: "A clearer process for HOA maintenance requests",
    description: "Plan resident intake, responsibility, status updates and completion records for community maintenance without creating another confusing inbox.",
    category: "Communities", publishedAt, updatedAt: publishedAt,
    introduction: "A resident wants to report a problem and understand what happens next. The community team needs enough detail to determine responsibility and arrange the right response. A useful request process serves both needs. It should also preserve a practical way to contact the team for residents who cannot use a portal.",
    takeaway: "Collect a clear request, assign an accountable owner, and distinguish receiving a report from approving or completing work.",
    sections: [
      { id: "resident-intake", heading: "1. Make the first report easy to understand", paragraphs: ["Ask for a location, a short description, a way to reply and supporting information when useful. Explain which kinds of request the form accepts. Provide the community’s approved instructions for urgent situations; a routine web form should not be presented as an emergency response service.", "Let the resident review the details before submission. Once submitted, show a reference and an acknowledgment that explains the next review step. Avoid promising a completion date before the request has been assessed."] },
      { id: "responsibility", heading: "2. Check responsibility before assigning work", paragraphs: ["A report may concern a common area, a resident responsibility or an issue needing professional assessment. Make that review explicit. The software can organize the evidence and handoff, but the community’s responsible people determine the decision.", "CAI’s facilities-management education treats maintenance as a planning and communication discipline, covering maintenance categories, checklists, reports and contractor oversight. A request queue should connect to that process rather than become a separate list nobody owns."], source: 0 },
      { id: "status", heading: "3. Use a small set of honest statuses", paragraphs: ["Received, under review, assigned, waiting and completed are useful starting points. Define the meaning of each state with the manager or board. For a waiting request, record the reason and who will follow up. Keep resident-facing updates separate from internal notes that should not be shared."], checklist: ["Name the person responsible for each open request.", "Give residents an understandable update when status changes.", "Restrict personal details and supporting files to appropriate roles.", "Keep a contact alternative alongside the online form." ] },
      { id: "close-review", heading: "4. Close the loop with a completion record", paragraphs: ["Capture what was done, when and by whom, with supporting information appropriate to the work. Define how residents can report that an issue remains. A completed status should mean the required review is finished, not simply that a contractor was contacted.", "For a pilot, review requests missing a location, time spent asking follow-up questions and open items without a next action. Use those observations to improve the form and ownership rules before adding more features. Catalyst’s public HOA sample demonstrates intake and review; a community’s full maintenance implementation would be scoped separately."] },
    ],
    example: { title: "A fictional common-area lighting request", text: "A resident identifies a walkway light and adds a description. The team checks responsibility and assigns a reviewer. A later implementation might add contractor coordination and completion updates. This example explains a possible process; it does not claim those later stages are all available in the public sample." },
    nextStep: "Start with the requests your community receives most often. We can use the public sample as a discussion aid, then define the responsibilities and information your community actually needs.",
    tools: ["maintenance-coordination", "hoa-administration", "manual-work"], solution: "custom-software", industry: "hoa", demo: "hoa",
    sources: [source("Community Associations Institute: M-201 Facilities Management", "https://www.caionline.org/education-for-managers/m201/")],
  },
  {
    slug: "custom-software-vs-off-the-shelf",
    title: "Custom software or an off-the-shelf tool: how to decide",
    description: "Compare an existing software package, integration and custom development using your real workflow, total cost, data needs and a small practical trial.",
    category: "Software decisions", publishedAt, updatedAt: publishedAt,
    introduction: "Buying an existing tool may be the best answer. So may connecting tools you already have, or building a focused application for a process that standard products do not fit. The decision becomes clearer when you compare the same real work across those options rather than compare long feature lists.",
    takeaway: "Choose the smallest dependable approach that fits the process, the people and the ongoing cost of ownership.",
    sections: [
      { id: "real-workflow", heading: "1. Write a short, testable workflow", paragraphs: ["Describe who starts the work, what information they enter, who decides and what result is needed. Include two or three awkward cases, such as a changed quote, a rejected request or a duplicate customer. Separate requirements from preferences.", "For every must-have, write how you will demonstrate it. For example: a field employee records a completion update from a phone, and the office can review it against the approved scope. That is easier to evaluate than a requirement for a modern platform."] },
      { id: "three-options", heading: "2. Compare buy, connect and build", paragraphs: ["Choose an existing package when its normal workflow fits and its limitations are acceptable. Consider integration when current tools work individually but people spend time moving information between them. Consider custom development when an important process has specific rules, handoffs or interfaces that available tools cannot support economically.", "The SBA’s software-selection checklist highlights fit, integration, growth and hands-on evaluation. Its advice is a useful starting point, not a substitute for testing current product capabilities or reviewing a specific contract."], source: 0 },
      { id: "ownership-cost", heading: "3. Include the costs after launch", paragraphs: ["Compare setup, licenses, migration, training, support, hosting, integrations and likely changes over the same period. Include time your team needs to prepare data and learn the process. Ask what happens when a connected service changes or a key person leaves.", "Review access controls, backup and recovery expectations, data export and who can maintain the solution. A low initial price can still be a poor fit if getting your records out is difficult or critical support is unclear. Request written terms rather than assume any ownership or service commitment."] },
      { id: "trial", heading: "4. Run a practical trial before a wider commitment", paragraphs: ["Use fictional or appropriately redacted information for the initial trial. Have the people who do the work perform the normal case and the exceptions. Record what required a workaround and what still depended on re-entering information."], checklist: ["Can the team complete the essential workflow without assistance?", "Can someone correct an error and see what changed?", "Does information reach the next person or system in a usable form?", "Are recurring costs, responsibilities and an exit path understood?" ] },
      { id: "value", heading: "5. Make the value estimate conservative", paragraphs: ["Calculate time returned separately from cash savings and potential extra contribution. Do not count the same work twice across tools. Include implementation and recurring costs, and use a lower-benefit scenario to see whether the choice still makes sense. A calculator supports a decision; it does not prove a project will deliver its assumptions."] },
    ],
    example: { title: "Keep accounting; improve the missing handoff", text: "A fictional service business likes its accounting package but prepares estimates in several files. It first tests standard estimating tools. If none fits the required workflow, it explores a focused estimating application with a reviewed accounting handoff instead of assuming it needs to rebuild accounting too." },
    nextStep: "Tell us which tools already work well and where the process breaks down. Catalyst can help assess an existing product, an integration or a focused custom build without assuming the largest project is the right one.",
    tools: ["software-consolidation", "duplicate-entry", "project-roi"], solution: "integrations-consulting",
    sources: [source("U.S. Small Business Administration: Checklist for Choosing Business Software", "https://www.sba.gov/blog/2018/2018-06/checklist-choosing-business-software/")],
  },
];

export const getInsight = (slug: string) => insights.find((article) => article.slug === slug);

export function insightReadingMinutes(article: Insight) {
  const text = [article.introduction, article.takeaway, article.example.text, article.nextStep,
    ...article.sections.flatMap(section => [section.heading, ...section.paragraphs, ...(section.checklist ?? [])])].join(" ");
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
}
