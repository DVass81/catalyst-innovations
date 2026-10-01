export const visualStories = {
  blueprint: {
    name: "The Living Blueprint",
    eyebrow: "Built around your business",
    image: "/stories/blueprint.png",
    left: 26,
    width: 1484,
    tops: [49, 339, 628],
    scenes: [
      {
        label: "Understand",
        title: "Start with the way you work.",
        text: "Your people. Your process. Your starting point.",
        alt: "A blue request marked 104 sits on a drawing of an office, workshop and stockroom.",
      },
      {
        label: "Connect",
        title: "Connect the people and the process.",
        text: "Connect customers, operations and numbers.",
        alt: "The drawing becomes a miniature business with a blue connection linking its rooms.",
      },
      {
        label: "Bring together",
        title: "Your business. Working together.",
        text: "One clearer picture of the work.",
        alt: "An office, workshop and stockroom form one connected miniature business.",
      },
    ],
  },
  desk: {
    name: "The Impossible Desk",
    eyebrow: "One request. Every step connected.",
    image: "/stories/desk.png",
    left: 26,
    width: 1484,
    tops: [49, 339, 628],
    scenes: [
      {
        label: "Capture once",
        title: "Every job starts with a request.",
        text: "Capture customer details once.",
        alt: "A service request with the identifier 104 rests on a cream desk.",
      },
      {
        label: "Carry forward",
        title: "Approval sets the next step in motion.",
        text: "Approved quotes connect to schedules and materials.",
        alt: "The request becomes an approved quote, calendar and materials connected by folded paper.",
      },
      {
        label: "Complete",
        title: "Bring the work and numbers together.",
        text: "Completed work becomes an invoice for review.",
        alt: "Request 104, approved quote, schedule, completed work and invoice settle into a connected line.",
      },
    ],
  },
  comparison: {
    name: "The Same Day, Two Ways",
    eyebrow: "A clearer way forward",
    image: "/stories/two-ways.png",
    left: 26,
    width: 1484,
    tops: [49, 339, 628],
    scenes: [
      {
        label: "Same request",
        title: "The same work. Two different experiences.",
        text: "The same request. Two ways to work.",
        alt: "Two illustrative businesses receive the same service request numbered 104.",
      },
      {
        label: "See the difference",
        title: "Less retyping. Fewer updates to chase.",
        text: "Carry approved details forward without retyping.",
        alt: "Repeated paperwork on one side contrasts with connected approval, scheduling, materials and completion on the other.",
      },
      {
        label: "Explore the value",
        title: "Keep the work moving.",
        text: "Find the process worth improving first.",
        alt: "A coordinated business connects completed work to an invoice ready for review.",
      },
    ],
  },
} as const;
export type VisualStoryKind = keyof typeof visualStories;
