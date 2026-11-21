import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getPublishedPost } from "@/lib/blog";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "The Catalyst Blog — practical perspectives on business and automation";
export const revalidate = 300;

export default async function BlogPostImage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPublishedPost((await params).slug);
  if (!post) notFound();
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: 66, background: "linear-gradient(125deg, #0a1628 15%, #173454 75%, #2f5d8f 100%)", color: "#faf7f1" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 22 }}><span>{site.name}</span><span style={{ color: "#acd0ef", fontSize: 18 }}>THE CATALYST BLOG</span></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}><div style={{ display: "flex", fontSize: 18, letterSpacing: 2, color: "#acd0ef" }}>{post.category}</div><div style={{ display: "flex", fontSize: post.title.length > 100 ? 46 : 56, fontWeight: 700, lineHeight: 1.16, letterSpacing: -1.5 }}>{post.title}</div></div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #4a6d90", paddingTop: 24, fontSize: 20, color: "#d1e1ef" }}><span>Less busywork. A fresh perspective.</span><span>mycatalystinnovations.com/blog</span></div>
    </div>, size,
  );
}
