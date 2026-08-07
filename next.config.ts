import type { NextConfig } from "next";

/**
 * Security headers. The CSP allows Next.js inline bootstrapping scripts and
 * inline styles (required by the framework and next/font). Tighten with
 * nonces if a stricter policy is required later.
 */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // 'unsafe-eval' is required by React dev tooling only; never shipped in production.
      // plausible.io / googletagmanager only load if the analytics env vars are set.
      `script-src 'self' 'unsafe-inline' https://plausible.io https://www.googletagmanager.com${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://plausible.io https://*.google-analytics.com",
      // Scheduling embed on /consultation — Google Calendar Appointment
      // Schedules and Microsoft Bookings both show up under these hosts.
      "frame-src 'self' https://calendar.google.com https://outlook.office.com https://outlook.office365.com https://bookings.cloud.microsoft",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [{ source: "/start", destination: "/roi-estimator", permanent: true }];
  },
};

export default nextConfig;
