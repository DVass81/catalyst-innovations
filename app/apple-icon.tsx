import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS "Add to Home Screen" icon — same brand mark as the favicon, rendered as a PNG. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A1628",
          borderRadius: 32,
        }}
      >
        <svg width="132" height="132" viewBox="0 0 100 100" fill="none">
          <path d="M50 8 L84 27 V43 L70 35 L50 24 L30 36 V64 L50 76 L70 65 L84 57 V73 L50 92 L16 73 V27 Z" fill="#C8D2DE" />
          <path d="M50 33 L68 43 L61 47 L50 41 L41 46 V54 L50 59 L61 53 L68 57 L50 67 L34 58 V42 Z" fill="#4A8FD4" />
        </svg>
      </div>
    ),
    size,
  );
}
