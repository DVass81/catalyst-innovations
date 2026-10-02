import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
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
  const logo = await readFile(join(process.cwd(), "public/brand/catalyst-official.png"));
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
          background: "#faf7f1",
          color: "#0a1628",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/png;base64,${logo.toString("base64")}`} alt="Catalyst Innovations" width={435} height={140} />
        <div style={{ display: "flex", fontSize: 62, fontWeight: 700, marginTop: 56, lineHeight: 1.15 }}>
          {s?.title ?? "Solutions"}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#2f5d8f", marginTop: 28, maxWidth: 900 }}>
          {s?.tagline ?? "Technology built around the way your business actually works."}
        </div>
      </div>
    ),
    size,
  );
}
