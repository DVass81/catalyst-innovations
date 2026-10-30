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
      "img-src 'self' data: blob: https://cdn.sanity.io",
      "font-src 'self' data:",
      // The linked GA4 tag uses these collect endpoints after explicit ad-result
      // consent. Permit only the observed paths, not entire additional hosts.
      "connect-src 'self' https://plausible.io https://*.google-analytics.com https://analytics.google.com/g/collect https://www.google.com/g/collect https://stats.g.doubleclick.net/g/collect",
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
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/blog", destination: "/insights", permanent: true },
      { source: "/pricing", destination: "/discovery", permanent: true },
      { source: "/founders", destination: "/about#our-background", permanent: true },
      { source: "/demo-lab", destination: "/portfolio", permanent: true },
      { source: "/start", destination: "/tools/project-roi", permanent: true },
      {
        source: "/roi-estimator",
        destination: "/tools/project-roi",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
