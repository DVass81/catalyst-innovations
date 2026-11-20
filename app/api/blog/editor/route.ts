import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { editorCookieName, hasEditorSession, readEditorBody, sameEditorOrigin } from "@/lib/blog-editor-auth";
import { parseNativeBlogInput } from "@/lib/native-blog-content";
import { NativeBlogStoreError, publishDocument, readPublicationCatalog } from "@/lib/native-blog-store";
import { readArticleDeliveries } from "@/lib/native-blog-delivery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const json = (value: unknown, status = 200) => NextResponse.json(value, { status, headers: { "Cache-Control": "no-store, private", "X-Robots-Tag": "noindex, nofollow" } });
const storeError = (error: unknown) => error instanceof NativeBlogStoreError ? json({ error: error.message }, error.status) : json({ error: "Publishing is temporarily unavailable. Your article has not been cleared." }, 503);

export async function GET(request: NextRequest) {
  if (!hasEditorSession(request.cookies.get(editorCookieName())?.value)) return json({ error: "Sign in to open the editor." }, 401);
  try {
    const catalog = await readPublicationCatalog();
    return json({ ...catalog, delivery: await readArticleDeliveries(catalog.posts) });
  }
  catch (error) { return storeError(error); }
}

export async function POST(request: NextRequest) {
  if (!hasEditorSession(request.cookies.get(editorCookieName())?.value)) return json({ error: "Your session expired. Sign in again before publishing." }, 401);
  if (!sameEditorOrigin(request)) return json({ error: "Request was not accepted." }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return json({ error: "JSON required." }, 415);
  let raw: string;
  try { raw = await readEditorBody(request, 90_000); }
  catch { return json({ error: "The article is too large." }, 413); }
  let input;
  try { input = JSON.parse(raw); }
  catch { return json({ error: "The article could not be read." }, 400); }
  const post = parseNativeBlogInput(input?.post);
  if (!post || !/^[a-f0-9]{40}$/.test(input.revision) || !/^[a-f0-9-]{36}$/.test(input.operationId)) return json({ error: "Check the article fields and refresh the published list." }, 422);
  const fingerprint = createHash("sha256").update(JSON.stringify(post)).digest("hex");
  if (input.previewFingerprint !== fingerprint) return json({ error: "Preview the current article before publishing." }, 409);
  try { return json(await publishDocument(post, input.revision, input.operationId)); }
  catch (error) { return storeError(error); }
}
