import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Catalyst Innovations — Make More. Save Time. Work Smarter.";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse at 50% 30%, #0d1f3c 0%, #050b16 70%)",
          color: "white",
        }}
      >
        <svg width="140" height="140" viewBox="0 0 100 100" fill="none">
          <path d="M50 4 L88 26 V44 L72 35 L50 22 L28 35 V65 L50 78 L72 65 L88 56 V74 L50 96 L12 74 V26 Z" fill="#C8D2DE" />
          <path d="M50 32 L70 43 L62 48 L50 41 L40 47 V53 L50 59 L62 52 L70 57 L50 68 L32 58 V42 Z" fill="#4A8FD4" />
        </svg>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, letterSpacing: 14, marginTop: 40 }}>
          CATALYST
        </div>
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 26, color: "#b9c8da", marginTop: 8 }}>
          INNOVATIONS
        </div>
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 8, color: "#6fabe3", marginTop: 42, textTransform: "uppercase" }}>
          Make more · Save time · Work smarter
        </div>
      </div>
    ),
    size,
  );
}
