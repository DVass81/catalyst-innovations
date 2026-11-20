import { NextRequest, NextResponse } from "next/server";
import { checkEditorPassword, createEditorSession, editorConfigured, editorCookieName, editorCookieOptions, limitEditorLogin, readEditorBody, sameEditorOrigin } from "@/lib/blog-editor-auth";

export const runtime = "nodejs";
const privateHeaders = { "Cache-Control": "no-store, private", "X-Robots-Tag": "noindex, nofollow" };

export async function POST(request: NextRequest) {
  if (!sameEditorOrigin(request)) return NextResponse.json({ error: "Request was not accepted." }, { status: 403, headers: privateHeaders });
  if (!request.headers.get("content-type")?.startsWith("application/x-www-form-urlencoded")) return NextResponse.json({ error: "Form required." }, { status: 415, headers: privateHeaders });
  let form: URLSearchParams;
  try { form = new URLSearchParams(await readEditorBody(request, 2048)); }
  catch { return NextResponse.json({ error: "Form is too large." }, { status: 413, headers: privateHeaders }); }
  const destination = new URL("/blog/editor", process.env.BLOG_EDITOR_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL!);
  if (form.get("action") === "logout") {
    const response = NextResponse.redirect(destination, { status: 303, headers: privateHeaders });
    response.cookies.set(editorCookieName(), "", { ...editorCookieOptions(), maxAge: 0 });
    return response;
  }
  if (!editorConfigured()) return NextResponse.json({ error: "The editor is waiting for activation." }, { status: 503, headers: privateHeaders });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim().slice(0, 80) || "unknown";
  if (!limitEditorLogin(ip)) {
    destination.searchParams.set("error", "wait");
    return NextResponse.redirect(destination, { status: 303, headers: privateHeaders });
  }
  if (!await checkEditorPassword(form.get("password"))) {
    destination.searchParams.set("error", "signin");
    return NextResponse.redirect(destination, { status: 303, headers: privateHeaders });
  }
  const response = NextResponse.redirect(destination, { status: 303, headers: privateHeaders });
  response.cookies.set(editorCookieName(), createEditorSession(), editorCookieOptions());
  return response;
}
