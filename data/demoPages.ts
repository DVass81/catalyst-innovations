import type { DemoId } from "@/data/demos";

type DemoPageLink = { label: string; href: string; description: string };
export type DemoPage = {
  id: DemoId;
  title: string;
  heading: string;
  description: string;
  audience: string;
  boundary: string;
  nextStep: string;
  related: [DemoPageLink, DemoPageLink, DemoPageLink];
  tools: [DemoPageLink, DemoPageLink];
  questions: { question: string; answer: string }[];
};

/** Searchable context for the existing, verified recordings. No customer results are implied. */
export const demoPages: DemoPage[] = [
  {
    id: "hoa",
    title: "HOA Maintenance Request Software Demo",
    heading: "HOA maintenance requests, from description to review.",
    description: "Watch Catalyst’s HOA platform guide a resident through a maintenance request, supporting information and review using fictional sample communities.",
    audience: "For HOA boards and community teams who want residents to provide clearer information before a request reaches the person reviewing it.",
    boundary: "This is a public sample experience with fictional communities and information. The recording stops before submission. It does not demonstrate a completed community rollout, work approval or a reserved service date.",
    nextStep: "Bring one common resident request and the information your team needs to review it. We can discuss the intake, responsibilities and next handoff for your community.",
    related: [
      { label: "Software for HOAs and communities", href: "/industries/hoa", description: "Explore common administration and maintenance coordination problems." },
      { label: "Custom business software", href: "/solutions/custom-software", description: "See how Catalyst scopes a system around an existing process." },
      { label: "A clearer process for HOA maintenance requests", href: "/insights/hoa-maintenance-requests", description: "Read practical steps for intake, review and responsibility." },
    ],
    tools: [
      { label: "HOA administration time", href: "/tools/hoa-administration?industry=hoa", description: "Estimate the value of time spent on recurring community administration." },
      { label: "Maintenance-request coordination", href: "/tools/maintenance-coordination?industry=hoa", description: "Explore the effort involved in coordinating each request." },
    ],
    questions: [
      { question: "Can I try the HOA platform?", answer: "Yes. The public sample linked on this page uses fictional communities. It is separate from any private community environment and is intended to demonstrate the experience." },
      { question: "Does submitting a request approve the work?", answer: "No. Request intake and review come before any decision to approve, assign or schedule work. The recording stops at the review screen without submitting the request." },
    ],
  },
  {
    id: "flooring",
    title: "Flooring Estimating Software Demo — Knoxville Flooring",
    heading: "Flooring estimating software, from room size to proposal handoff.",
    description: "See the Knoxville Flooring application connect room measurements, waste, labor, preparation costs and an estimate summary in a narrated software demo.",
    audience: "For flooring contractors who want the room measurements, job assumptions and pricing review in one estimating workflow.",
    boundary: "This guided preview uses sample information from the actual application. It stops before creating or sending a proposal. The estimate and margin shown are illustrative calculations, not measured customer results. The private evaluation environment is not linked publicly.",
    nextStep: "Bring a typical estimate and explain how your team handles measurements, preparation, allowances and pricing. We can identify where those details should stay connected.",
    related: [
      { label: "Software for construction businesses", href: "/industries/construction", description: "Explore estimating, field communication and office handoffs." },
      { label: "Custom business software", href: "/solutions/custom-software", description: "Start with a focused workflow built around your team." },
      { label: "From estimate to invoice", href: "/insights/estimate-to-invoice-field-office", description: "Read how connected job information supports a clearer handoff." },
    ],
    tools: [
      { label: "Quoting time", href: "/tools/quoting-time?industry=construction", description: "Estimate the labor capacity released by less quote preparation." },
      { label: "Job gross margin", href: "/tools/job-margin?industry=construction", description: "Compare entered revenue with direct job costs." },
    ],
    questions: [
      { question: "What does the flooring estimator show?", answer: "The recording shows room measurements and calculated area, editable waste, material and labor assumptions, preparation options, and an estimate summary with a proposal handoff." },
      { question: "Can I sign into this application?", answer: "This page provides a guided recording of a private evaluation environment. We can discuss a demonstration and your own requirements through the inquiry link; no private owner-entry link is published." },
    ],
  },
  {
    id: "painting",
    title: "Painting Estimating Software Demo — Oxendine Painting",
    heading: "Painting estimating software, from room-by-room scope to review.",
    description: "Watch the Oxendine Painting demonstration prototype connect room scope, preparation, labor and material costs with estimate review using fictional data.",
    audience: "For painting businesses that want scope, preparation and costing to stay connected while an estimate is prepared and reviewed.",
    boundary: "Oxendine Painting is a demonstration prototype for a planned system, shown locally with fictional information. Approval and sending are simulated. Improved field visibility and less manual administration are development goals, not verified outcomes of a completed deployment.",
    nextStep: "Bring a room-by-room estimate and the information your crews need. We can discuss the scope, costing and review process first, then the field workflow a future system should support.",
    related: [
      { label: "Software for painting businesses", href: "/industries/painting", description: "Explore estimating and field coordination needs for painting teams." },
      { label: "Custom business software", href: "/solutions/custom-software", description: "See how a focused first workflow can become a connected system." },
      { label: "From estimate to invoice", href: "/insights/estimate-to-invoice-field-office", description: "Plan the handoff between quoting, field work and the office." },
    ],
    tools: [
      { label: "Quoting time", href: "/tools/quoting-time?industry=painting", description: "Explore the time value of preparing estimates with less repeated work." },
      { label: "Job gross margin", href: "/tools/job-margin?industry=painting", description: "Review the relationship between your revenue and direct costs." },
    ],
    questions: [
      { question: "Is this a finished painting-business platform?", answer: "No. It is a recovered demonstration prototype for a planned system. The verified walkthrough covers area-by-area scope, labor and material costing, and estimate review." },
      { question: "Does the walkthrough send an estimate to a customer?", answer: "No. The prototype’s approval and sending actions are simulated. The recording uses fictional data and does not send a real customer message or collect a payment." },
    ],
  },
];

export const getDemoPage = (id: string) => demoPages.find(page => page.id === id);

export function demoDuration(seconds: number) {
  const rounded = Math.round(seconds);
  return `${Math.floor(rounded / 60)}:${String(rounded % 60).padStart(2, "0")}`;
}
