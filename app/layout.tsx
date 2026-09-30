import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import "./redesign.css";
import "./motion-story.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import ErrorMonitoring from "@/components/ErrorMonitoring";
import RouteProgress from "@/components/RouteProgress";
import SectionMotion from "@/components/SectionMotion";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Catalyst Innovations — Less Busywork. A Better-Running Business.",
    template: "%s | Catalyst Innovations",
  },
  description: site.positioning,
  openGraph: {
    siteName: site.name,
    type: "website",
    title: "Catalyst Innovations — Less Busywork. A Better-Running Business.",
    description: site.positioning,
  },
  robots: { index: true, follow: true },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Catalyst",
  },
  // Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION with the code from Google
  // Search Console (Settings -> Ownership verification -> HTML tag) to
  // verify ownership without touching this file again.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
  }),
};

export const viewport: Viewport = {
  themeColor: "#0a1628",
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  slogan: site.motto,
  description: site.positioning,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Knoxville",
    addressRegion: "TN",
    addressCountry: "US",
  },
  // TEMPORARY: Daniel's profile is pulled from public display for now — see
  // data/content.ts's `activeFounders` comment. Add him back here too once
  // his updated profile is live.
  founder: [{ "@type": "Person", name: "Josh Ogle", jobTitle: "Co-Founder" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <Suspense fallback={null}>
          <RouteProgress />
          <SectionMotion />
        </Suspense>
        <ErrorMonitoring>
          <Navbar />
          <Analytics />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </ErrorMonitoring>
      </body>
    </html>
  );
}
