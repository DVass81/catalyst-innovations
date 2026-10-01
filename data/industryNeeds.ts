/** Editorial synthesis, researched 2026-09-30. Sources and limits: docs/industry-research.md. */
export const industryNeeds: Record<string, [string, string][]> = {
  manufacturing: [
    [
      "Production plans change before everyone gets the update.",
      "Connect orders, materials and production status in one shared plan.",
    ],
    [
      "Material shortages interrupt the next job.",
      "Show stock, purchase orders and outstanding material needs together.",
    ],
    [
      "Downtime and rework costs are difficult to trace.",
      "Record interruptions and quality issues against the job for review.",
    ],
  ],
  "financial-institutions": [
    [
      "Vendor reviews involve scattered documents and deadlines.",
      "Organize vendor records, review owners and renewal reminders.",
    ],
    [
      "Internal requests wait in email queues.",
      "Route requests through assigned reviewers with a visible status.",
    ],
    [
      "Management reporting requires repeated reconciliation.",
      "Bring approved source records into consistent reports with traceable inputs.",
    ],
  ],
  "credit-unions": [
    [
      "Member-service handoffs are hard to follow across teams.",
      "Give authorized staff a shared request history and clear next action.",
    ],
    [
      "Third-party oversight tasks compete with daily service work.",
      "Track review responsibilities, evidence and due dates in one workflow.",
    ],
    [
      "Operational reports take time away from members.",
      "Prepare repeatable reports from approved systems for staff review.",
    ],
  ],
  logistics: [
    [
      "Shipment updates live in several different systems.",
      "Connect order, dispatch and delivery status in a shared view.",
    ],
    [
      "Delivery exceptions take too long to reach the right person.",
      "Route delays and missing information to an assigned owner.",
    ],
    [
      "Dispatch and billing teams re-enter the same details.",
      "Carry confirmed delivery records into invoice preparation.",
    ],
  ],
  construction: [
    [
      "Changing schedules leave crews working from old plans.",
      "Keep current job schedules, assignments and updates together.",
    ],
    [
      "Extra work is agreed on site but missed in the office.",
      "Capture change requests, approval and billing status against each job.",
    ],
    [
      "Material and labor costs are hard to compare with the estimate.",
      "Connect purchases and time records to the original job budget.",
    ],
  ],
  "electrical-contractors": [
    [
      "Estimates depend on labor and material details in separate files.",
      "Build reusable estimating workflows with quantities, rates and scope together.",
    ],
    [
      "Material availability changes after a crew is scheduled.",
      "Link job requirements, purchasing and receiving to the schedule.",
    ],
    [
      "Field changes lose their approval trail.",
      "Keep site notes, change requests and approved revisions with the job.",
    ],
  ],
  "welding-fabrication": [
    [
      "Shop teams need the current drawing and job requirements.",
      "Keep controlled documents and revision history beside the work order.",
    ],
    [
      "Material readiness is unclear when production is planned.",
      "Connect material requirements, stock and purchasing to each fabrication job.",
    ],
    [
      "Quality records are difficult to retrieve at handoff.",
      "Organize inspection records and required review steps by job.",
    ],
  ],
  "industrial-services": [
    [
      "Maintenance work competes for limited crew time.",
      "Prioritize work orders and schedule people against the work that is ready.",
    ],
    [
      "Parts and service history are hard to find.",
      "Connect equipment records, parts and past work in one place.",
    ],
    [
      "Completed field work arrives as disconnected notes.",
      "Capture completion details for office review and billing preparation.",
    ],
  ],
  "professional-services": [
    [
      "Client information is repeatedly requested by different people.",
      "Create shared intake and client records with appropriate access.",
    ],
    [
      "Review deadlines disappear in inboxes.",
      "Assign tasks, reminders and approval steps to named owners.",
    ],
    [
      "Reporting and billing require copying across tools.",
      "Connect approved time and project records to reports and invoice preparation.",
    ],
  ],
  "field-service": [
    [
      "Dispatch changes do not always reach the technician.",
      "Keep assignments, customer details and job updates in a shared schedule.",
    ],
    [
      "Technicians arrive without the service history they need.",
      "Make equipment history and job requirements available with each visit.",
    ],
    [
      "Office staff chase completion notes before billing.",
      "Collect job completion details and flag records ready for invoice review.",
    ],
  ],
  "schools-athletics": [
    [
      "Events require coordinating facilities, people and transport.",
      "Build one schedule with task owners and event checklists.",
    ],
    [
      "Coaches and families miss changing arrangements.",
      "Keep approved updates and communication tasks attached to each event.",
    ],
    [
      "Fundraising records take time to reconcile.",
      "Organize campaign receipts, expenses and follow-up in one workflow.",
    ],
  ],
  "churches-nonprofits": [
    [
      "Small teams juggle programs and administrative work.",
      "Simplify intake and recurring tasks so staff can see what needs attention.",
    ],
    [
      "Campaign information is spread across several lists.",
      "Connect campaign records, contribution tracking and follow-up tasks.",
    ],
    [
      "Preparing program and funding reports takes repeated effort.",
      "Organize approved activity and expense records for consistent reporting.",
    ],
  ],
  "small-business": [
    [
      "The owner has to chase every next step.",
      "Give work a clear owner, status and reminder.",
    ],
    [
      "Rising costs are hard to see until month-end.",
      "Bring purchasing, job costs and accounting information into useful reports.",
    ],
    [
      "Growing workloads expose gaps between tools.",
      "Connect existing systems and automate repeated data entry.",
    ],
  ],
  "multi-location": [
    [
      "Each location follows a slightly different process.",
      "Create shared workflows with room for approved local differences.",
    ],
    [
      "Head-office reporting depends on manual updates.",
      "Consolidate comparable location records into one reporting view.",
    ],
    [
      "Teams struggle to find current operating guidance.",
      "Keep approved procedures and responsibilities in a shared workspace.",
    ],
  ],
  plumbing: [
    [
      "Urgent calls disrupt an already busy dispatch schedule.",
      "Keep requests, priorities and technician assignments in one queue.",
    ],
    [
      "Material costs and site notes make quotes slow to prepare.",
      "Connect job notes, reusable scope and current entered costs to estimates.",
    ],
    [
      "Finished visits wait for paperwork before invoicing.",
      "Carry technician completion notes into an invoice ready for office review.",
    ],
  ],
  hvac: [
    [
      "Busy seasons make scheduling and follow-up difficult.",
      "Coordinate service requests, technician availability and maintenance reminders.",
    ],
    [
      "Equipment history is scattered across past visits.",
      "Keep equipment details and service records with the customer.",
    ],
    [
      "Parts and purchasing are disconnected from scheduled work.",
      "Connect each job’s parts requirements to stock and purchase requests.",
    ],
  ],
  painting: [
    [
      "Unclear preparation and surface scope create misunderstandings.",
      "Keep measured areas, preparation requirements and exclusions in the estimate.",
    ],
    [
      "Extra work is difficult to separate from the original scope.",
      "Record requested changes and approval before adding them to billing.",
    ],
    [
      "Actual labor and materials drift away from the estimate.",
      "Compare job time and material records with the agreed scope and budget.",
    ],
  ],
  hoa: [
    [
      "Resident requests arrive through too many channels.",
      "Provide a shared request queue with ownership and visible status.",
    ],
    [
      "Maintenance follow-up depends on someone remembering.",
      "Track assignments, due dates and completion records in one place.",
    ],
    [
      "Boards and residents struggle to find current information.",
      "Organize approved documents, notices and community updates by audience.",
    ],
  ],
  warehousing: [
    [
      "Stock records do not reflect what is available to pick.",
      "Connect receiving, movements and picking in a warehouse management system.",
    ],
    [
      "Replenishment decisions rely on separate spreadsheets.",
      "Bring stock levels, entered reorder rules and purchasing together.",
    ],
    [
      "Managers cannot easily see where work is waiting.",
      "Show receiving and picking queues with assignments and exceptions.",
    ],
  ],
};
