import { discoveryOffer } from "./catalystProcess";
import { buyerFaqs } from "./buyerFaqs";

export const discoveryFeeLabel = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
}).format(discoveryOffer.fee);

export const discoveryFaqs = [
  {
    question: "What does discovery cost?",
    answer: `The ${discoveryOffer.durationMinutes}-minute discovery call is ${discoveryFeeLabel}. We walk through a real process, discuss where work gets held up and provide a one-page summary of practical improvement opportunities.`,
  },
  {
    question: "How does the implementation credit work?",
    answer: `If you choose Catalyst to build your software, your ${discoveryFeeLabel} discovery fee is credited toward implementation fees. Your proposal shows the implementation scope, quote and discovery credit before you decide to proceed.`,
  },
  buyerFaqs.cost,
  {
    question: "What will our custom quote cover?",
    answer: "We define the system around your workflows, the features you need, existing tools to connect and any data to bring across. Your written proposal identifies implementation, training, ongoing support and any third-party costs, along with responsibilities and the agreed schedule. You review the scope and quote before choosing to build.",
  },
  {
    question: "What should we bring to the call?",
    answer: "Bring one process that creates delays, duplicate work or frustration. A fictional or redacted example of the forms, spreadsheets or tools involved is helpful. You don’t need a technical specification; we’ll work through the questions together.",
  },
  buyerFaqs.timeline,
];
