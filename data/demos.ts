export type DemoId = "hoa" | "flooring" | "painting";
export type DemoStep = {
  title: string;
  text: string;
  image: string;
  width: number;
  height: number;
  alt: string;
};
export type Demo = {
  id: DemoId;
  displayName: string;
  walkthrough?: {
    video: string;
    poster: string;
    captions: string;
    transcript: string;
    durationSeconds: number;
  };
  title: string;
  purpose: string;
  industry: string;
  availability: "public-sample" | "guided-only" | "archived-guided";
  status: string;
  capabilities: [string, string, string];
  steps: [DemoStep, DemoStep, DemoStep];
  publicUrl?: string;
};
export const demos: Demo[] = [
  {
    id: "hoa",
    displayName: "HOA platform",
    walkthrough: {
      "video": "/demos/hoa-walkthrough.mp4",
      "poster": "/demos/hoa-walkthrough.webp",
      "captions": "/demos/hoa-walkthrough.vtt",
      "transcript": "Here is the HOA platform's public sample experience, built by Catalyst Innovations. The communities and information in this demonstration are fictional. We will follow a resident request from the first description to the final review. Start by giving the request a clear title. Then describe what needs attention, so the community team has useful context from the beginning. In this example, the resident is reporting a problem with path lighting. \n\nNext, the form explains what supporting information could help the team understand the request. Clear guidance at this stage can make the handoff easier and reduce the need to chase missing details. \n\nContinue to the review screen. The resident can check the information before sending it, and go back if something needs changing. We are stopping here without submitting a request. Sending a request does not approve the work or reserve a date. This workflow gives the resident a clear starting point and the community team a more structured handoff. Talk with Catalyst about simplifying the everyday work in your community.",
      "durationSeconds": 63.48
},
    title: "A clearer path from resident to community team.",
    purpose:
      "Community software that gives a resident request a clear starting point, useful details and a review before sending.",
    industry: "hoa",
    availability: "public-sample",
    status: "Public sample experience",
    capabilities: [
      "Guided resident requests",
      "Supporting-information guidance",
      "Review before sending",
    ],
    publicUrl: "https://commonplace-public-hp2b7.ondigitalocean.app/",
    steps: [
      {
        title: "Describe the request",
        text: "A resident starts with a title and description. The guided form keeps the next step clear.",
        image: "/demos/hoa-entry.webp",
        width: 830,
        height: 380,
        alt: "Actual resident request form with title and description fields.",
      },
      {
        title: "Know what to include",
        text: "The next screen explains useful supporting information and when documents can be added.",
        image: "/demos/hoa-support.webp",
        width: 830,
        height: 478,
        alt: "Actual supporting-information step with back and continue controls.",
      },
      {
        title: "Review, then send",
        text: "The resident checks the request before sending it to the community team. Sending does not approve work or reserve a date.",
        image: "/demos/hoa-review.webp",
        width: 830,
        height: 560,
        alt: "Actual review screen showing a fictional path-lighting request, ready to send.",
      },
    ],
  },
  {
    id: "flooring",
    displayName: "Knoxville Flooring",
    walkthrough: {
      "video": "/demos/flooring-walkthrough.mp4",
      "poster": "/demos/flooring-walkthrough.webp",
      "captions": "/demos/flooring-walkthrough.vtt",
      "transcript": "This is Knoxville Flooring's application, built by Catalyst Innovations. We are using sample information to show how room measurements become an estimate. Start by choosing a room and entering its length and width. The estimator calculates the floor area, keeping the measurements and the quantity together. \n\nNext, review the assumptions around the work. Waste allowance, material costs, and labor all affect the estimate. Preparation matters too. The application includes options for work such as tear-out and subfloor repair, so those details can be considered alongside the flooring itself. \n\nAs the inputs change, review the updated summary. It brings the quantity, entered costs, suggested price, and estimated margin into one view. These are sample calculations, not a promise of profit. Finally, the proposal handoff provides a next step from the estimate. We are stopping before creating or sending anything to a customer. Measurements, job details, and pricing stay connected. Talk with Catalyst about building software around the way your team estimates and manages work.",
      "durationSeconds": 69.78
},
    title: "Turn room measurements into a clearer estimate.",
    purpose:
      "A flooring estimator brings room dimensions, cost assumptions and proposal preparation into one connected workspace.",
    industry: "construction",
    availability: "guided-only",
    status: "Guided preview",
    capabilities: [
      "Room measurements and area totals",
      "Editable waste, labor and preparation costs",
      "Estimate summary with proposal handoff",
    ],
    steps: [
      {
        title: "Measure the work",
        text: "Enter room length and width. The estimator totals the floor area for the quote.",
        image: "/demos/flooring-measure.webp",
        width: 402,
        height: 217,
        alt: "Actual flooring estimator with a sample 20 by 15 foot room and 300 square foot total.",
      },
      {
        title: "Account for the details",
        text: "Review waste, material and labor rates, plus preparation needs such as tear-out or subfloor repair.",
        image: "/demos/flooring-costs.webp",
        width: 402,
        height: 395,
        alt: "Actual flooring cost controls showing waste, labor, materials and preparation options.",
      },
      {
        title: "Review the estimate",
        text: "See the entered costs, suggested price and estimated margin before choosing the proposal handoff. These are sample inputs, not a customer result.",
        image: "/demos/flooring-summary.webp",
        width: 188,
        height: 456,
        alt: "Actual flooring estimate summary with order quantity, cost breakdown and Convert to Proposal action.",
      },
    ],
  },
  {
    id: "painting",
    displayName: "Oxendine Painting",
    walkthrough: {
      "video": "/demos/painting-walkthrough.mp4",
      "poster": "/demos/painting-walkthrough.webp",
      "captions": "/demos/painting-walkthrough.vtt",
      "transcript": "Welcome to the Oxendine Painting demonstration, built by Catalyst Innovations. This is the actual application running with fictional sample information. We will follow one estimate from its scope through pricing and review. Start with the areas of the job. Each room keeps its work, preparation, and estimated hours together, so the scope is easier to review. When the work changes, update the area rather than searching through a separate document. \n\nNext, open pricing. Here, the estimate connects labor and material costs with the work being quoted. Review the line items alongside the summary, and see how the entered assumptions affect the estimate. These figures are sample inputs, not promised business results. \n\nFinally, move to review. Check the costs and estimated margin before the customer handoff. This is a demonstration prototype for a planned system; approval and sending are simulated. The useful idea is simple: keep the scope, the costs, and the next step together. Talk with Catalyst about connecting the work in your business.",
      "durationSeconds": 76.5
},
    title: "Keep the scope and the estimate together.",
    purpose:
      "A painting-system prototype connects measured areas, preparation scope and entered costs before the estimate goes to a customer.",
    industry: "painting",
    availability: "archived-guided",
    status: "Planned system Â· recovered prototype",
    capabilities: [
      "Editable area-by-area scope",
      "Connected labor and material costing",
      "Customer-ready estimate review",
    ],
    steps: [
      {
        title: "Define the scope",
        text: "Break the work into areas, with preparation, hours and amounts recorded together.",
        image: "/demos/painting-scope.webp",
        width: 1118,
        height: 420,
        alt: "Actual painting prototype showing editable room scopes, hours and amounts with fictional seed data.",
      },
      {
        title: "Check the pricing",
        text: "Review line items alongside the connected estimate summary. All figures shown are fictional demo values.",
        image: "/demos/painting-pricing.webp",
        width: 1118,
        height: 420,
        alt: "Actual painting prototype showing area pricing and an estimate summary.",
      },
      {
        title: "Prepare for review",
        text: "Check costs and margin before customer review. Sending and approval are simulated in this prototype; no live payment or messaging is shown.",
        image: "/demos/painting-review.webp",
        width: 355,
        height: 397,
        alt: "Actual painting prototype with a Ready for Customer summary and simulated approval action.",
      },
    ],
  },
];
