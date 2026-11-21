import { NextRequest, NextResponse } from "next/server";
import { readEditorBody } from "@/lib/blog-editor-auth";
import { checkPublisherPassword, createPublisherSession, limitPublisherLogin, publisherConfigured, publisherCookieName, publisherCookieOptions, samePublisherOrigin } from "@/lib/blog-publisher-auth";

export const runtime = "nodejs";
const privateHeaders = { "Cache-Control": "no-store, private", "X-Robots-Tag": "noindex, nofollow" };

export async function POST(request: NextRequest) {
  if (!samePublisherOrigin(request)) return NextResponse.json({ error: "Request was not accepted." }, { status: 403, headers: privateHeaders });
  if (!request.headers.get("content-type")?.startsWith("application/x-www-form-urlencoded")) return NextResponse.json({ error: "Form required." }, { status: 415, headers: privateHeaders });
  let form: URLSearchParams;
  try { form = new URLSearchParams(await readEditorBody(request, 2048)); }
  catch { return NextResponse.json({ error: "Form is too large." }, { status: 413, headers: privateHeaders }); }
  const destination = new URL("/blog/publisher", process.env.BLOG_EDITOR_ORIGIN!);
  if (form.get("action") === "logout") {
    const response = NextResponse.redirect(destination, { status: 303, headers: privateHeaders });
    response.cookies.set(publisherCookieName(), "", publisherCookieOptions(0));
    return response;
  }
  if (form.has("action") && form.get("action") !== "login") return NextResponse.json({ error: "Action was not accepted." }, { status: 400, headers: privateHeaders });
  if (!publisherConfigured()) return NextResponse.json({ error: "The publisher is waiting for activation." }, { status: 503, headers: privateHeaders });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim().slice(0, 80) || "unknown";
  if (!limitPublisherLogin(ip)) {
    destination.searchParams.set("error", "wait");
    return NextResponse.redirect(destination, { status: 303, headers: privateHeaders });
  }
  if (!await checkPublisherPassword(form.get("password"))) {
    destination.searchParams.set("error", "signin");
    return NextResponse.redirect(destination, { status: 303, headers: privateHeaders });
  }
  const response = NextResponse.redirect(destination, { status: 303, headers: privateHeaders });
  response.cookies.set(publisherCookieName(), createPublisherSession(), publisherCookieOptions());
  return response;
}
