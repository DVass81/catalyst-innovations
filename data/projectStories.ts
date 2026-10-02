/** Relationship status supplied by Daniel on October 2, 2026. No results are implied. */
export type ProjectStory = {
  id: string;
  name: string;
  status: string;
  title: string;
  text: string;
  detail: string;
  source?: string;
  href: string;
  action: string;
};

export const projectStories: ProjectStory[] = [
  {
    id: "elevate",
    name: "Elevate Fundraising",
    status: "Built by Catalyst · Discussions in progress",
    title: "Technology supporting a bigger purpose.",
    text: "Catalyst built Elevate Fundraising. We’re in discussions with USA Field Hockey about how Elevate could support the organization as it prepares for Los Angeles 2028.",
    detail: "Elevate is an existing fundraising website built by Catalyst. The discussions concern how it could support USA Field Hockey; the scope is still being developed. No completed engagement, fundraising result or official Olympic affiliation is claimed. Separately, USA Field Hockey has confirmed its men’s and women’s national teams for the 2028 Olympic Games in the announcement linked below.",
    source: "https://www.usafieldhockey.com/news/2025/december/11/we-are-in-u-s-national-teams-confirmed-to-return-to-la28-olympic-stage",
    href: "/consultation?industry=schools-athletics",
    action: "Discuss fundraising software",
  },
  {
    id: "communities",
    name: "HOA platform",
    status: "Public sample · Community discussions underway",
    title: "A clearer connection between residents and community teams.",
    text: "We’re in early conversations with HOA communities in Tennessee about their needs. Our public sample shows how residents can describe a request, review supporting information and check the details before sending.",
    detail: "The public walkthrough uses fictional communities and shows a resident describing a request, reviewing supporting information and checking the details before submission. It is a concrete starting point for discussing intake and communication. Community-specific permissions, maintenance coordination and any wider implementation would be defined separately. Early conversations are not presented as completed customer rollouts.",
    href: "/portfolio#hoa",
    action: "Watch the HOA workflow",
  },
  {
    id: "oxendine",
    name: "Oxendine Painting",
    status: "System in development · Prototype available",
    title: "Better field visibility. Less manual administration.",
    text: "We’re working with Oxendine Painting on a system for the painting industry. The goal is to make field activity easier to see and reduce the manual steps between the jobsite and the office.",
    detail: "The recovered demonstration prototype connects room-by-room scope, labor and materials with an estimate. Viewers can follow how entered work and cost assumptions lead to an estimate review. The larger system is still in development: field visibility and fewer manual handoffs are goals to validate, not features claimed to be fully deployed or measured customer results.",
    href: "/portfolio#painting",
    action: "Watch the painting prototype",
  },
];
