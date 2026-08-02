import { ImageResponse } from "next/og";
import { getService, services } from "@/data/services";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Catalyst Innovations solution";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 90,
          background: "radial-gradient(ellipse at 20% 20%, #122642 0%, #050b16 70%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="72" height="72" viewBox="0 0 100 100" fill="none">
            <path d="M50 4 L88 26 V44 L72 35 L50 22 L28 35 V65 L50 78 L72 65 L88 56 V74 L50 96 L12 74 V26 Z" fill="#C8D2DE" />
            <path d="M50 32 L70 43 L62 48 L50 41 L40 47 V53 L50 59 L62 52 L70 57 L50 68 L32 58 V42 Z" fill="#4A8FD4" />
          </svg>
          <div style={{ display: "flex", fontSize: 28, letterSpacing: 8, color: "#b9c8da" }}>
            CATALYST INNOVATIONS
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 62, fontWeight: 700, marginTop: 56, lineHeight: 1.15 }}>
          {s?.title ?? "Solutions"}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#6fabe3", marginTop: 28, maxWidth: 900 }}>
          {s?.tagline ?? "Technology built around the way your business actually works."}
        </div>
      </div>
    ),
    size,
  );
}
