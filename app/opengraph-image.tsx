import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Catalyst Innovations — Custom software. A better-running business.";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/catalyst-official.png"));
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 72, background: "#faf7f1", color: "#0a1628" }}>
      {/* Native img is required by ImageResponse's renderer. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`data:image/png;base64,${logo.toString("base64")}`} alt="Catalyst Innovations" width={540} height={174} />
      <div style={{ display: "flex", fontSize: 58, fontWeight: 700, marginTop: 40 }}>Custom software.</div>
      <div style={{ display: "flex", fontSize: 58, color: "#2f5d8f", marginTop: 4 }}>A better-running business.</div>
      <div style={{ display: "flex", fontSize: 24, marginTop: 30 }}>Customers. Jobs. Inventory. Your numbers. Connected.</div>
    </div>, size,
  );
}
