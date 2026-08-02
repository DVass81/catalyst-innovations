import type { ConsultationData } from "./consultation";

/**
 * Simple, transparent lead scoring so a full inbox can be triaged at a
 * glance instead of read top-to-bottom. Not a black box: every point is
 * traceable to a field the visitor filled in.
 */

const timelineScore: Record<string, number> = {
  "As soon as possible": 3,
  "1–3 months": 2,
  "3–6 months": 1,
  "6+ months": 0,
  "Exploring options": 0,
};

const companySizeScore: Record<string, number> = {
  "1–10": 0,
  "11–50": 1,
  "51–200": 2,
  "201–1000": 3,
  "1000+": 3,
};

const budgetScore: Record<string, number> = {
  "Prefer not to say": 0,
  "Under $10k": 0,
  "$10k–$50k": 1,
  "$50k–$150k": 2,
  "$150k+": 3,
};

const inquiryScore: Record<string, number> = {
  "Request a consultation": 2,
  "Discuss a strategic partnership": 2,
  "Explore a procurement solution": 1,
  "Ask about AI and automation": 1,
  "Request an operational assessment": 1,
  "Discuss a software idea": 0,
  "General inquiry": 0,
};

export type LeadTier = "Hot" | "Warm" | "Standard";

export function scoreLead(data: ConsultationData): { score: number; tier: LeadTier } {
  const score =
    (timelineScore[data.timeline] ?? 0) +
    (companySizeScore[data.companySize] ?? 0) +
    (budgetScore[data.budget ?? ""] ?? 0) +
    (inquiryScore[data.inquiryType] ?? 0);

  const tier: LeadTier = score >= 7 ? "Hot" : score >= 4 ? "Warm" : "Standard";
  return { score, tier };
}
