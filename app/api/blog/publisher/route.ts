import { NextRequest, NextResponse } from "next/server";
import { publisherCookieName, publisherCookieOptions, readPublisherSession, refreshPublisherSession, samePublisherOrigin, signPublisherPreview, verifyPublisherPreview } from "@/lib/blog-publisher-auth";
import { readEditorBody } from "@/lib/blog-editor-auth";
import { parseNativeBlogInput } from "@/lib/native-blog-content";
import { publicationFingerprint, readArticleDeliveries } from "@/lib/native-blog-delivery";
import { createWeeklyPublication, inputFingerprint, publisherEdition, PublisherStoreError, readPublisherState, type PublisherReceipt } from "@/lib/blog-publisher-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store, private", "X-Robots-Tag": "noindex, nofollow" };
const json = (value: unknown, status = 200) => NextResponse.json(value, { status, headers });

function authenticated(request: NextRequest) {
  return readPublisherSession(request.cookies.get(publisherCookieName())?.value) !== null;
}

function renew(request: NextRequest, response: NextResponse) {
  const value = refreshPublisherSession(request.cookies.get(publisherCookieName())?.value);
  if (value) response.cookies.set(publisherCookieName(), value, publisherCookieOptions());
  return response;
}

async function delivery(state: Awaited<ReturnType<typeof readPublisherState>>, receipt: PublisherReceipt | undefined) {
  if (!receipt) return { status: "NOT_SAVED", receipt: null, checkedAt: new Date().toISOString() };
  const document = state.posts.find(post => post.slug === receipt.slug);
  if (!document || publicationFingerprint(document) !== receipt.documentFingerprint) {
    return { status: "SUPERSEDED", receipt, checkedAt: new Date().toISOString() };
  }
  const checked = (await readArticleDeliveries([document]))[document.slug];
  return { status: checked.status.toUpperCase(), receipt, checkedAt: checked.checkedAt };
}

function failed(error: unknown) {
  return error instanceof PublisherStoreError ? json({ error: error.message }, error.status)
    : json({ error: "Publishing is temporarily unavailable. Check this edition’s receipt before retrying." }, 503);
}

export async function GET(request: NextRequest) {
  if (!authenticated(request)) return json({ error: "Sign in to the dedicated publisher." }, 401);
  const edition = request.nextUrl.searchParams.get("edition");
  if (edition && !/^\d{4}-\d{2}-\d{2}$/.test(edition)) return json({ error: "Invalid edition." }, 422);
  try {
    const state = await readPublisherState();
    const window = publisherEdition();
    const selected = edition ?? window.edition;
    return renew(request, json({ ...window, selectedEdition: selected,
      ...await delivery(state, state.journal.find(row => row.edition === selected)) }));
  } catch (error) { return failed(error); }
}

export async function POST(request: NextRequest) {
  if (!authenticated(request)) return json({ error: "Your publisher sign-in needs renewal. Ask Josh to sign in privately." }, 401);
  if (!samePublisherOrigin(request)) return json({ error: "Request was not accepted." }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return json({ error: "JSON required." }, 415);
  let input;
  try { input = JSON.parse(await readEditorBody(request, 90_000)); }
  catch { return json({ error: "The article could not be read or is too large." }, 400); }
  const post = parseNativeBlogInput(input?.post);
  if (!post || !["preview", "publish"].includes(input?.action)) return json({ error: "Check the article fields." }, 422);
  try {
    if (input.action === "preview") {
      const state = await readPublisherState();
      const window = publisherEdition();
      if (state.journal.some(row => row.edition === window.edition)) return json({ error: "This edition already has a saved article. Check its receipt instead." }, 409);
      const payload = JSON.stringify({ edition: window.edition, revision: state.revision, fingerprint: inputFingerprint(post) });
      return renew(request, json({ post, revision: state.revision, previewToken: signPublisherPreview(payload), ...window }));
    }
    if (typeof input.edition !== "string" || typeof input.revision !== "string" || typeof input.previewToken !== "string") return json({ error: "Preview this article first." }, 409);
    const payload = JSON.stringify({ edition: input.edition, revision: input.revision, fingerprint: inputFingerprint(post) });
    if (!verifyPublisherPreview(input.previewToken, payload)) return json({ error: "The preview expired or the article changed. Preview it again before publishing." }, 409);
    const result = await createWeeklyPublication(post, input.revision, input.edition);
    // The save receipt is authoritative. Exact live status is a separate, read-only check.
    return renew(request, json({ ...result, status: "SAVED", checkedAt: new Date().toISOString() }));
  } catch (error) { return failed(error); }
}
