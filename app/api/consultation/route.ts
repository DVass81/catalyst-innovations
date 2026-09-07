import { NextRequest, NextResponse } from "next/server";
import { consultationSchema } from "@/lib/consultation";
import { scoreLead } from "@/lib/leadScoring";
import { isRateLimited } from "@/lib/rateLimit";
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (await isRateLimited(ip))
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a minute." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  if (Number(req.headers.get("content-length") || 0) > 24000)
    return NextResponse.json(
      { ok: false, error: "Your request is too large." },
      { status: 413 },
    );
  let body: unknown;
  try {
    const text = await req.text();
    if (text.length > 24000)
      return NextResponse.json(
        { ok: false, error: "Your request is too large." },
        { status: 413 },
      );
    body = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }
  const parsed = consultationSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      {
        ok: false,
        error: "Please check the highlighted fields.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  const { website: unused, ...submission } = parsed.data;
  void unused;
  const { score: leadScore, tier: leadTier } = scoreLead(parsed.data);
  const payload = {
    ...submission,
    leadScore,
    leadTier,
    submittedAt: new Date().toISOString(),
    source: "catalyst-innovations-website",
  };
  const webhook = process.env.CONSULTATION_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY,
    to = process.env.CONSULTATION_TO_EMAIL,
    from = process.env.CONSULTATION_FROM_EMAIL;
  if (!webhook && !(resendKey && to && from))
    return NextResponse.json(
      {
        ok: false,
        error:
          "Online inquiries are temporarily unavailable. Please email the team or use the booking calendar.",
      },
      { status: 503 },
    );
  let delivered = false;
  if (webhook) {
    try {
      const r = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
      delivered = r.ok;
      if (!r.ok)
        console.error("[consultation] webhook rejected delivery", r.status);
    } catch {
      console.error("[consultation] webhook delivery unavailable");
    }
  }
  if (resendKey && to && from) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: payload.email,
          subject: `[${leadTier}] Website inquiry — ${payload.company.replace(/[\r\n]/g, " ")}`,
          text: Object.entries(payload)
            .map(([k, v]) => `${k}: ${v ?? "—"}`)
            .join("\n"),
        }),
        signal: AbortSignal.timeout(8000),
      });
      delivered = delivered || r.ok;
      if (!r.ok)
        console.error("[consultation] email rejected delivery", r.status);
    } catch {
      console.error("[consultation] email delivery unavailable");
    }
  }
  if (!delivered)
    return NextResponse.json(
      {
        ok: false,
        error:
          "We couldn’t send your request. Please try again or email the team directly.",
      },
      { status: 502 },
    );
  return NextResponse.json({ ok: true });
}
