import { NextRequest, NextResponse } from "next/server";
import { consultationSchema } from "@/lib/consultation";
import { scoreLead } from "@/lib/leadScoring";
import { isRateLimited } from "@/lib/rateLimit";

/**
 * Consultation form endpoint.
 *
 * Backend-ready structure: validated, honeypot-protected, rate-limited
 * (Upstash Redis when configured, in-memory fallback otherwise — see
 * lib/rateLimit.ts).
 *
 * Delivery: set CONSULTATION_WEBHOOK_URL (e.g. a Zapier/Make/CRM webhook or an
 * email-service endpoint) to forward submissions. Until configured,
 * submissions are logged server-side so nothing is silently lost in dev.
 */

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (await isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = consultationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the highlighted fields.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  // Honeypot triggered → pretend success, discard silently.
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const submission = { ...parsed.data };
  delete submission.website;
  const { score: leadScore, tier: leadTier } = scoreLead(parsed.data);
  const payload = {
    ...submission,
    leadScore,
    leadTier,
    submittedAt: new Date().toISOString(),
    source: "catalyst-innovations-website",
  };

  /* Delivery — whichever channels are configured:
     1. CONSULTATION_WEBHOOK_URL          → POST JSON (CRM / Zapier / Make)
     2. RESEND_API_KEY + CONSULTATION_TO  → email via Resend
     If neither is set, submissions log to the server console (dev). */
  const webhook = process.env.CONSULTATION_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONSULTATION_TO_EMAIL;
  let delivered = false;
  const failures: string[] = [];

  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
      delivered = true;
    } catch (err) {
      console.error("[consultation] webhook delivery failed:", err);
      failures.push("webhook");
    }
  }

  if (resendKey && toEmail) {
    try {
      const text = Object.entries(payload)
        .map(([k, v]) => `${k}: ${v || "—"}`)
        .join("\n");
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.CONSULTATION_FROM_EMAIL ?? "Catalyst Website <onboarding@resend.dev>",
          to: [toEmail],
          reply_to: payload.email,
          subject: `[${leadTier}] New ${payload.inquiryType.toLowerCase()} — ${payload.name} (${payload.company})`,
          text,
        }),
      });
      if (!res.ok) throw new Error(`Resend responded ${res.status}`);
      delivered = true;
    } catch (err) {
      console.error("[consultation] email delivery failed:", err);
      failures.push("email");
    }
  }

  if (!webhook && !(resendKey && toEmail)) {
    // Dev fallback — visible in server logs so submissions aren't lost.
    console.log("[consultation] submission (no delivery configured):", payload);
    delivered = true;
  }

  if (!delivered) {
    return NextResponse.json(
      { ok: false, error: "We couldn't submit your request right now. Please try again or email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
