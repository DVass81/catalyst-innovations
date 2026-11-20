import { NextResponse } from "next/server";
import catalog from "@/data/blog-published.json";
import { getPublishedPosts } from "@/lib/blog";
import { publicPublicationVersions } from "@/lib/native-blog-delivery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const headers = { "Cache-Control": "no-store, max-age=0", "X-Robots-Tag": "noindex, nofollow" };
  try {
    // Use the public reader's validation, including dates and duplicate checks.
    await getPublishedPosts();
    return NextResponse.json({ posts: publicPublicationVersions(catalog) }, { headers });
  }
  catch { return NextResponse.json({ error: "Public publication status is unavailable." }, { status: 503, headers }); }
}
