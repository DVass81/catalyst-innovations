/** Confirmed discovery offer; implementation prices and terms remain in the proposal. */
export const discoveryOffer = {
  fee: 250,
  durationMinutes: 45,
  foundingPartnerLimit: 10,
} as const;

/** Confirmed custom-software engagement approach. */
export type CatalystProcessStep = {
  id: string;
  number: string;
  title: string;
  description: string;
};

export const catalystProcess = {
  title: "The Catalyst Process",
  introduction:
    "Better software starts with understanding your business. We meet your team, see how the work happens, and build alongside you—so the system supports your actual processes.",
  discoveryInvitation: `Start with a ${discoveryOffer.durationMinutes}-minute discovery visit for $${discoveryOffer.fee}.`,
  proposalNote:
    `For custom software engagements. The 4–6-week build begins after the scope, access and delivery arrangements are agreed. Your written proposal confirms the schedule, on-site arrangements and project responsibilities. The $${discoveryOffer.fee} discovery fee is waived for the first ${discoveryOffer.foundingPartnerLimit} founding partners. Discovery includes a visit and recommendations; implementation is a separate paid engagement.`,
  steps: [
    {
      id: "discovery",
      number: "01",
      title: "A 45-minute discovery visit",
      description:
        `A $${discoveryOffer.fee} visit to walk through a process that creates extra work, delays or frustration. We listen to your team and follow a real example, then provide a one-page summary of practical improvement opportunities.`,
    },
    {
      id: "plan",
      number: "02",
      title: "A clear plan before we build",
      description:
        "Together, we agree on the system, its scope, investment, schedule and what successful completion looks like. Existing tools that work remain part of the conversation.",
    },
    {
      id: "build",
      number: "03",
      title: "Built on site in 4–6 weeks",
      description:
        "We work alongside your team to build the complete agreed system. Seeing the work first-hand, gathering team feedback and testing real handoffs help us refine it around the way your business actually operates.",
    },
    {
      id: "launch",
      number: "04",
      title: "Launch with your team",
      description:
        "We check the agreed workflows, train the people using the system and help put it into everyday use. Support and further improvements follow the agreed arrangements.",
    },
  ] satisfies CatalystProcessStep[],
};

export const catalystTimelineAnswer =
  `For custom software engagements, we build the complete agreed system on site in 4–6 weeks. That build period begins after the scope, access to existing systems and data, and delivery arrangements are agreed. We work alongside your team, continuing to observe, test and refine the system around your processes. Your written proposal confirms the schedule, on-site arrangements, review milestones, training and launch responsibilities. The ${discoveryOffer.durationMinutes}-minute discovery visit comes first and costs $${discoveryOffer.fee}; this fee is waived for the first ${discoveryOffer.foundingPartnerLimit} founding partners. It is separate from implementation and from the 30-minute introductory Calendly conversation.`;
