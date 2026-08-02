import { z } from "zod";

/** Shared between the multi-step form (client) and the API route (server). */

export const inquiryTypes = [
  "Request a consultation",
  "Discuss a software idea",
  "Request an operational assessment",
  "Explore a procurement solution",
  "Ask about AI and automation",
  "Discuss a strategic partnership",
  "General inquiry",
] as const;

export const industryOptions = [
  "Manufacturing", "Financial institution", "Credit union", "Supply chain / logistics",
  "Construction", "Electrical contracting", "Welding / fabrication", "Industrial services",
  "Professional services", "Field service", "School / athletics", "Church / nonprofit",
  "Other",
] as const;

export const companySizes = ["1–10", "11–50", "51–200", "201–1000", "1000+"] as const;
export const timelines = ["As soon as possible", "1–3 months", "3–6 months", "6+ months", "Exploring options"] as const;
export const budgets = ["Prefer not to say", "Under $10k", "$10k–$50k", "$50k–$150k", "$150k+"] as const;
export const contactMethods = ["Email", "Phone"] as const;

export const consultationSchema = z.object({
  inquiryType: z.enum(inquiryTypes),
  name: z.string().trim().min(2, "Please enter your name").max(100),
  company: z.string().trim().min(1, "Please enter your company").max(150),
  jobTitle: z.string().trim().max(100).optional().or(z.literal("")),
  email: z.string().trim().email("Please enter a valid email address").max(200),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  industry: z.enum(industryOptions),
  companySize: z.enum(companySizes),
  challenge: z.string().trim().min(10, "Tell us a bit more (at least 10 characters)").max(3000),
  currentTools: z.string().trim().max(1000).optional().or(z.literal("")),
  desiredOutcome: z.string().trim().max(2000).optional().or(z.literal("")),
  timeline: z.enum(timelines),
  budget: z.enum(budgets).optional(),
  contactMethod: z.enum(contactMethods),
  details: z.string().trim().max(5000).optional().or(z.literal("")),
  // Honeypot: real users never fill this hidden field.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ConsultationData = z.infer<typeof consultationSchema>;
