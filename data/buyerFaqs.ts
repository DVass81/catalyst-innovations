import { catalystTimelineAnswer } from "./catalystProcess";

/** Buyer guidance, not additional contract terms or delivery guarantees. */
export type BuyerFAQ = { question: string; answer: string };

export const buyerFaqs = {
  cost: {
    question: "What determines the cost of a custom software project?",
    answer: "The workflow, integrations, data migration and level of customization determine the scope. Our published packages provide implementation and monthly price ranges; your written proposal sets the exact price, included work and any third-party charges before you commit. Bring one process you want to improve rather than trying to choose a package on your own.",
  },
  timeline: {
    question: "How long does it take to build and launch a system?",
    answer: catalystTimelineAnswer,
  },
  existingSoftware: {
    question: "Do we need to replace all our software?",
    answer: "No. We start by identifying the tools that already work and the gaps between them. A focused application or integration may be enough. We assess what your current systems support before recommending a replacement, and agree which system will remain responsible for each important record.",
  },
  integrations: {
    question: "Can Catalyst connect our existing business systems?",
    answer: "We check the available APIs, supported connectors or controlled exports, along with permissions and vendor restrictions. Then we define the records to transfer, how updates and duplicates are handled, and who reviews a failed handoff. We confirm feasibility before promising a particular connection; software licenses and vendor fees are identified during scoping.",
  },
  migration: {
    question: "What happens to our existing records when we change systems?",
    answer: "We first agree which records need to move, what should be retained separately and who can authorize the transfer. Migration work can include mapping fields, resolving duplicates and testing a sample import. Your team checks the results before an agreed changeover, with backup and recovery arrangements defined in the project scope. Please bring a fictional or redacted example to the first conversation.",
  },
  security: {
    question: "How do you approach security and access to our information?",
    answer: "Security requirements are part of scoping: who needs access, which records each role can see, and the requirements for authentication, hosting, backups and recovery. We agree the controls and how they will be checked for your implementation. If your business has regulatory or contractual requirements, share them early so we can assess the required work; a custom build alone is not a compliance certification.",
  },
  ownership: {
    question: "Who owns the software, and can we export our business data?",
    answer: "Your agreement defines software ownership and licensing, third-party components, access to source code where applicable, and the arrangements for exporting your business data. We discuss those points before building, including what happens if support ends. Do not assume a particular ownership or export arrangement from a package name; it belongs in the written scope and terms.",
  },
  support: {
    question: "What support is included after launch?",
    answer: "The monthly investment includes hosting, security updates, ongoing support and continued access to the features in your tier. The selected package and written proposal define the support scope and responsibilities. We also clarify how new feature requests, third-party costs and future changes will be handled, so routine support and additional development are understood before launch.",
  },
  training: {
    question: "How will our team learn to use the new software?",
    answer: "Team training is part of implementation. We agree who needs training, which everyday tasks they should practice and what handover material the project includes. Using representative sample work helps reveal confusing steps before a wider rollout. The training schedule, launch responsibilities and follow-up support are confirmed in your proposal.",
  },
  startingSmall: {
    question: "Can we start with one process instead of a whole new system?",
    answer: "Yes. We can scope a useful first workflow, such as quoting, purchase approvals or a field-to-office handoff. It should have a clear start, a responsible owner and a result your team can check. We define its cost and boundaries before building, then decide whether further work is worthwhile based on what the first version teaches us.",
  },
} satisfies Record<string, BuyerFAQ>;
