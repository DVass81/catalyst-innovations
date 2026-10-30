import type { studioPhotos } from "./studioMedia";

export type IndustryVisual = {
  photoKey: keyof typeof studioPhotos;
  subtitle: string;
  observation: string;
  flowTitle: string;
  flowIntroduction: string;
  stepNotes: readonly [string, string, string, string, string];
  exception: { after: number; title: string; detail: string; returnLabel: string };
  source: { title: string; url: string };
};

/** Proposed workflow explanations. Primary background is recorded in docs/industry-research.md; these are not delivered-product claims. */
export const industryVisuals: Record<string, IndustryVisual> = {
  manufacturing: {
    photoKey: "manufacturing", subtitle: "A clearer view of the floor.", observation: "Start with the people doing the work.",
    flowTitle: "Give every handoff a clear next step.", flowIntroduction: "Keep an order’s material needs, production updates and required quality review connected.",
    stepNotes: ["Agree the work and its requirements.", "Check availability before production.", "Record operations and quantities.", "Retain the required review decision.", "Confirm release for dispatch."],
    exception: { after: 1, title: "Keep a material hold visible.", detail: "Assign the shortage to an owner and confirm the receipt before checking availability again.", returnLabel: "Recheck materials before production" },
    source: { title: "NIST MEP · Value stream mapping", url: "https://www.nist.gov/mep/value-stream-mapping" },
  },
  "financial-institutions": {
    photoKey: "planning", subtitle: "A clear owner for the next decision.", observation: "Make the internal request easier to follow without assuming changes to core banking.",
    flowTitle: "Follow the request, not the inbox.", flowIntroduction: "An internal purchase or vendor request can carry its evidence, reviewer and decision through one accountable process.",
    stepNotes: ["Record the department, need and responsible person.", "Check the supporting information and requirements.", "Capture the authorized decision and its conditions.", "Record the agreed administrative next action.", "Retain the decision history for internal review."],
    exception: { after: 1, title: "Missing evidence? Return the request.", detail: "Name what is missing and who will provide it. Keep the request in review until the required information is available.", returnLabel: "Return to review before approval" },
    source: { title: "FDIC · Third-party risk management guide for community banks", url: "https://www.fdic.gov/news/financial-institution-letters/2024/third-party-risk-management-guide-community-banks" },
  },
  "credit-unions": {
    photoKey: "planning", subtitle: "Internal work, with a visible next step.", observation: "Start with an administrative handoff and the minimum information it needs.",
    flowTitle: "Make the review part of the record.", flowIntroduction: "A shared internal request can keep department responsibilities and supporting evidence visible without assuming access to member accounts.",
    stepNotes: ["Describe the internal service or purchasing need.", "Route the evidence to the responsible reviewer.", "Record the authorized decision.", "Track the agreed service or purchasing handoff.", "Review status and outstanding follow-up."],
    exception: { after: 1, title: "Clarify the information before it moves.", detail: "Return an incomplete request to its owner rather than allowing a missing detail to become an assumed approval.", returnLabel: "Resume the review when complete" },
    source: { title: "NCUA · Supervisory priorities", url: "https://ncua.gov/regulation-supervision/letters-credit-unions-other-guidance/ncuas-2025-supervisory-priorities" },
  },
  logistics: {
    photoKey: "warehouse", subtitle: "The order, the update and the exception.", observation: "Visibility is useful when the team can act on what it sees.",
    flowTitle: "Keep the shipment’s story together.", flowIntroduction: "Connect the order reference to confirmed stock, dispatch and delivery information, with a named person for exceptions.",
    stepNotes: ["Confirm the order and delivery requirements.", "Check the stock or supply needed for release.", "Record quantities prepared against the order.", "Capture the confirmed dispatch and delivery updates.", "Prepare the billing handoff after required delivery checks."],
    exception: { after: 3, title: "A delay needs an owner, not a guess.", detail: "Record the latest confirmed information and the next follow-up. A missing carrier event stays visible rather than being treated as delivery.", returnLabel: "Confirm the update before the billing handoff" },
    source: { title: "ASCM · Supply-chain visibility", url: "https://www.ascm.org/ascm-insights/gaining-clarity-the-power-of-supply-chain-visibility/" },
  },
  construction: {
    photoKey: "painting", subtitle: "Keep the job and its changes together.", observation: "The field update should still make sense when it reaches the office.",
    flowTitle: "Carry the approved scope through the job.", flowIntroduction: "Keep the estimate, field requirements and completion details connected, while separating requested changes from approved work.",
    stepNotes: ["Capture the site, request and initial scope.", "Prepare the estimate and record approval.", "Plan the crew against the agreed work.", "Check requirements and record the materials used.", "Prepare invoice review from completed work and approved changes."],
    exception: { after: 1, title: "A requested change is not approved scope.", detail: "Keep the addition against the job, review its price and record the decision before it changes the schedule or billable work.", returnLabel: "Continue from the approved scope" },
    source: { title: "AGC · Construction hiring and business outlook", url: "https://www.agc.org/2025-construction-hiring-and-business-outlook" },
  },
  "electrical-contractors": {
    photoKey: "trades", subtitle: "One job record, from office to site.", observation: "Give the crew the current requirements and the office a usable completion record.",
    flowTitle: "Connect the estimate to the work on site.", flowIntroduction: "Carry the approved scope and material requirements into crew planning, then return completion information for review.",
    stepNotes: ["Record the location, requirements and relevant scope details.", "Prepare the estimate from the agreed requirements.", "Assign the work after its scope is approved.", "Check required materials against the current job.", "Review completion notes and approved changes before billing."],
    exception: { after: 2, title: "A revised requirement needs a review.", detail: "Keep the change and its decision visible before the crew works from a different scope. Required professional and inspection decisions remain with the authorized people.", returnLabel: "Use the current approved requirements" },
    source: { title: "NECA · Manual of labor units", url: "https://www.necanet.org/education/publications/neca-manual-of-labor-units-%28mlu%29" },
  },
  "welding-fabrication": {
    photoKey: "manufacturing", subtitle: "The right revision, beside the work.", observation: "A job’s drawing, materials and release decision belong in the same conversation.",
    flowTitle: "Keep the current job requirements in view.", flowIntroduction: "A fabrication order can connect its drawing reference, material readiness and required quality records through to dispatch.",
    stepNotes: ["Record the job and approved drawing reference.", "Confirm the material requirement and availability.", "Follow the operation against the current requirements.", "Record the required inspection and release decision.", "Carry the released job and records into dispatch."],
    exception: { after: 2, title: "A revision or quality hold stays attached.", detail: "Identify the affected work and responsible reviewer. Resume only after the required technical or quality decision is recorded.", returnLabel: "Resume from the authorized decision" },
    source: { title: "AWS · Certified Welding Fabricator program", url: "https://www.aws.org/Businesses/Facility-Accreditation/CWF/" },
  },
  "industrial-services": {
    photoKey: "manufacturing", subtitle: "The service history meets the next job.", observation: "Make equipment, people and completion details easier to bring together.",
    flowTitle: "Give the service job a complete handoff.", flowIntroduction: "Connect the request to approved work, crew planning and the information the office needs after the visit.",
    stepNotes: ["Capture the equipment, site and reported need.", "Review the proposed work and obtain the required approval.", "Plan the crew around the work that is ready.", "Check parts and site requirements before the visit.", "Prepare billing review from the recorded completion details."],
    exception: { after: 2, title: "A job that is not ready stays visible.", detail: "Name the missing part, access requirement or decision and assign its follow-up before treating the visit as ready to dispatch.", returnLabel: "Confirm readiness before the visit" },
    source: { title: "SMRP · Body of knowledge", url: "https://smrp.org/learning-resources/smrp-library/body-of-knowledge/" },
  },
  "professional-services": {
    photoKey: "office", subtitle: "Less reconstructing the work from email.", observation: "Keep client requests, review responsibilities and the next action together.",
    flowTitle: "Move the engagement through clear decisions.", flowIntroduction: "Give the team a shared view of the information needed, the reviewer responsible and the next agreed deliverable.",
    stepNotes: ["Capture the client request and engagement reference.", "Check the required information and responsible reviewer.", "Record the appropriate scope or internal approval.", "Track the agreed deliverable and its review.", "Prepare reporting and follow-up from approved records."],
    exception: { after: 1, title: "Waiting on a document should be visible.", detail: "Assign the request for information and keep its status beside the engagement, instead of assuming an unanswered email has moved the work forward.", returnLabel: "Resume review when the information arrives" },
    source: { title: "AICPA & CIMA · Workflow and capacity", url: "https://www.aicpa-cima.com/resources/article/beyond-email-using-ai-and-automation-to-enhance-capacity" },
  },
  "field-service": {
    photoKey: "trades", subtitle: "A useful handoff, on both sides of the visit.", observation: "The technician and office should be following the same job.",
    flowTitle: "Connect the request to the return update.", flowIntroduction: "Keep customer information, service history and required parts beside the visit, then carry the completion details back to the office.",
    stepNotes: ["Record the customer, location and reported issue.", "Review scope and any required estimate approval.", "Assign the technician and confirm the appointment.", "Check parts and the information needed for the visit.", "Prepare invoice review from the completed-job record."],
    exception: { after: 2, title: "A dispatch change needs confirmation.", detail: "Keep the revised assignment visible to the technician and the office. A changed schedule is not proof that the person doing the work has seen it.", returnLabel: "Confirm the assignment before the visit" },
    source: { title: "PHCC · Environmental scan", url: "https://www.phccweb.org/wp-content/uploads/2025/02/2025-PHCC-Environmental-Scan.pdf" },
  },
  "schools-athletics": {
    photoKey: "community", subtitle: "Keep the campaign’s people and records connected.", observation: "Support the organizing work around a shared goal.",
    flowTitle: "Give campaign follow-up a clear owner.", flowIntroduction: "A campaign workflow can organize its goal, outreach and receipt reporting while limiting the student and donor information each person needs.",
    stepNotes: ["Agree the goal, organizer and campaign requirements.", "Assign outreach tasks and approved communication.", "Record receipts from the chosen giving tools.", "Assign appropriate acknowledgment and follow-up tasks.", "Review receipts, fees and campaign expenses together."],
    exception: { after: 2, title: "An unclear receipt needs reconciliation.", detail: "Keep the discrepancy with its source and responsible reviewer. A recorded contribution is not a claim that this workflow collects or processes payments.", returnLabel: "Resolve the record before final reporting" },
    source: { title: "NFHS · Athletic administrator responsibilities", url: "https://nfhs.org/stories/documenting-what-an-athletic-administrator-does" },
  },
  "churches-nonprofits": {
    photoKey: "community", subtitle: "More attention for the purpose behind the work.", observation: "Give a small team a clearer view of its campaign and follow-up responsibilities.",
    flowTitle: "Connect the campaign without losing the detail.", flowIntroduction: "Keep the activity, assigned tasks and approved financial records together, while retaining the giving and accounting tools that already work.",
    stepNotes: ["Set the activity, purpose and responsible organizer.", "Coordinate volunteers and assigned outreach.", "Record receipts from existing contribution tools.", "Track acknowledgment and the next responsible person.", "Prepare activity and expense information for review."],
    exception: { after: 3, title: "A follow-up without an owner is still open.", detail: "Assign the next action and the appropriate information before closing the task. Permissions and donor information remain explicit scope decisions.", returnLabel: "Confirm responsibility before closing" },
    source: { title: "National Council of Nonprofits · Workforce survey", url: "https://www.councilofnonprofits.org/reports/2023-nonprofit-workforce-survey-results" },
  },
  "small-business": {
    photoKey: "planning", subtitle: "A next step that does not depend on chasing.", observation: "Start with the repeated task that takes the owner away from the customer.",
    flowTitle: "Make one recurring process easier to follow.", flowIntroduction: "A focused workflow can give the request a plan, an owner and a completion record before anyone considers a larger platform.",
    stepNotes: ["Capture the request and what a useful outcome means.", "Agree the scope, owner and next action.", "Keep updates and exceptions against the work.", "Prepare billing from approved completion details.", "Review the records needed for the next decision."],
    exception: { after: 1, title: "An unclear next step is a planning issue.", detail: "Clarify the person responsible and the information they need. Automating an undefined handoff does not define it for the team.", returnLabel: "Agree the handoff before the work moves" },
    source: { title: "NFIB · Small business problems and priorities", url: "https://www.nfib.com/small-business-problems-and-priorities/?tab=Problems+and+Priorities" },
  },
  "multi-location": {
    photoKey: "planning", subtitle: "A shared picture, with room for local detail.", observation: "Agree what a status means before combining locations into a report.",
    flowTitle: "Keep the local record connected to the wider view.", flowIntroduction: "Start with a shared process and explicitly agreed local variations, so a company-wide report compares information with the same meaning.",
    stepNotes: ["Record the request and responsible location.", "Agree common requirements and permitted local differences.", "Track the location’s work and exception owner.", "Prepare the reviewed financial handoff where required.", "Compare location records using shared definitions."],
    exception: { after: 2, title: "A local exception needs a defined treatment.", detail: "Record the difference and the responsible reviewer before changing a shared status or reporting definition.", returnLabel: "Confirm the definition before consolidation" },
    source: { title: "IFA · Consistency within a system", url: "https://www.franchise.org/2019/04/best-practices-promoting-consistency-within-a-system/" },
  },
  plumbing: {
    photoKey: "plumbing", subtitle: "The right details, from the first call onward.", observation: "Keep the property, technician and office working from the same information.",
    flowTitle: "Carry the service call through to office review.", flowIntroduction: "Connect the reported issue, approved work, technician assignment and completion notes without giving every job the same oversized form.",
    stepNotes: ["Record the property and reported issue.", "Review the proposed scope and any required approval.", "Assign the technician and confirm the visit.", "Check the parts needed for the job.", "Prepare invoice review from the work performed."],
    exception: { after: 2, title: "An urgent call changes the plan.", detail: "Record the priority and revised assignment, then confirm who is handling it. Keep the displaced work visible for follow-up.", returnLabel: "Confirm the revised dispatch handoff" },
    source: { title: "PHCC · Environmental scan", url: "https://www.phccweb.org/wp-content/uploads/2025/02/2025-PHCC-Environmental-Scan.pdf" },
  },
  hvac: {
    photoKey: "trades", subtitle: "Equipment history that travels with the visit.", observation: "Connect the appointment to what the technician needs before and after it.",
    flowTitle: "Keep the equipment, visit and follow-up together.", flowIntroduction: "Give the office a way to prepare the visit and the technician a clear handoff for parts used, work performed and further attention.",
    stepNotes: ["Capture the customer, equipment and service need.", "Review the repair or service scope and approval.", "Confirm availability, appointment and technician.", "Check parts requirements against the planned work.", "Review completion details before preparing the invoice."],
    exception: { after: 2, title: "A reminder is not a confirmed appointment.", detail: "Keep customer confirmation and technician availability explicit before a recurring visit becomes a dispatch assignment.", returnLabel: "Confirm the visit before dispatch" },
    source: { title: "PHCC · Industry environmental scan overview", url: "https://www.phccweb.org/news/phcc-releases-2026-industry-environmental-scan-highlighting-key-trends-and-opportunities/" },
  },
  painting: {
    photoKey: "painting", subtitle: "The scope should stay connected to the work.", observation: "Keep each room’s preparation, costs and agreed changes in view.",
    flowTitle: "Carry the estimate into a clearer job handoff.", flowIntroduction: "The painting prototype demonstrates estimating. This wider workflow illustrates how agreed scope could connect to field updates and office review.",
    stepNotes: ["Record the areas, surfaces and requested work.", "Review preparation, labor, materials and estimate approval.", "Plan the crew against the agreed scope.", "Check the requirements and record material use.", "Review completed work and approved changes before billing."],
    exception: { after: 1, title: "An added area needs its own decision.", detail: "Keep a requested addition separate from the original scope until its price and approval are recorded. The broader field workflow remains a development goal.", returnLabel: "Continue with the agreed scope" },
    source: { title: "Painting Contractors Association · Industry standards", url: "https://www.pcapainted.org/industry-standards/" },
  },
  hoa: {
    photoKey: "community", subtitle: "A request the resident and community can follow.", observation: "Make the first description useful to the person who reviews it.",
    flowTitle: "Give the request a responsible next step.", flowIntroduction: "The public sample demonstrates intake and review. These later handoffs are an illustrative process to scope with a community, rather than a claim about the sample’s full functionality.",
    stepNotes: ["Capture the community, location and description.", "Review responsibility and assign the next owner.", "Coordinate the agreed next action and required approvals.", "Record completion information for the team to review.", "Share the appropriate update with the right audience."],
    exception: { after: 1, title: "A request does not approve the work.", detail: "Check responsibility and any required decision before arranging work. Keep the resident’s request distinct from an authorized maintenance action.", returnLabel: "Confirm the decision before coordination" },
    source: { title: "CAI · Community communication", url: "https://hoaresources.caionline.org/how-to-avoid-communication-breakdown-across-your-associations/" },
  },
  warehousing: {
    photoKey: "warehouse", subtitle: "A stock figure the next person can use.", observation: "Receiving, movement and picking need to tell the same story.",
    flowTitle: "Connect the item to each movement.", flowIntroduction: "Start with the item, location and unit of measure, then agree how receipts, reservations and picks change the available quantity.",
    stepNotes: ["Confirm the order and item requirements.", "Check available stock, reservations and units.", "Record the item, location and confirmed quantity.", "Carry the checked pick into dispatch.", "Prepare the reviewed order-to-accounting handoff."],
    exception: { after: 1, title: "A stock difference needs a correction path.", detail: "Identify the count or movement to review and assign an owner. A scanned value is not accepted as accurate without the agreed validation.", returnLabel: "Recheck available quantity before picking" },
    source: { title: "MHI · Warehouse operations", url: "https://www.mhi.org/blog/126152/ai-in-the-modern-warehouse" },
  },
};

export const industryGroupVisuals = [
  { group: "Trades & construction", id: "trades-construction", photoKey: "trades", title: "The office and the work, connected.", description: "Scope, crews, materials and completion details that can follow the same job." },
  { group: "Manufacturing & fabrication", id: "manufacturing-fabrication", photoKey: "manufacturing", title: "A clearer picture of what is ready.", description: "Orders, current requirements and shop-floor updates with an owner for the exceptions." },
  { group: "Distribution & warehousing", id: "distribution-warehousing", photoKey: "warehouse", title: "Know what is moving, and what is waiting.", description: "Item records, stock checks and dispatch information that support the next decision." },
  { group: "Financial & professional services", id: "financial-professional-services", photoKey: "office", title: "The next decision should be easy to find.", description: "Internal requests, review responsibilities and approved records in a clearer workflow." },
  { group: "Communities & nonprofits", id: "communities-nonprofits", photoKey: "community", title: "Less chasing, more attention to the purpose.", description: "Requests, campaign tasks and community handoffs organized around their responsible people." },
  { group: "Growing businesses", id: "growing-businesses", photoKey: "planning", title: "Make the process ready for the next chapter.", description: "Start with the recurring task or shared location workflow that needs a clearer next step." },
] as const satisfies readonly { group: string; id: string; photoKey: keyof typeof studioPhotos; title: string; description: string }[];
