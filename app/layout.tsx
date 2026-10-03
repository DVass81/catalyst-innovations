import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import "./redesign.css";
import "./motion-shared.css";
import "./visual-story.css";
import "./experience.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import ErrorMonitoring from "@/components/ErrorMonitoring";
import RouteProgress from "@/components/RouteProgress";
import SectionMotion from "@/components/SectionMotion";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { activeFounders } from "@/data/content";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Catalyst Innovations — Custom software. A better-running business.",
    description: site.positioning,
    path: "/",
  }),
  metadataBase: new URL(site.url),
  title: {
    default: "Catalyst Innovations — Custom software. A better-running business.",
    template: "%s | Catalyst Innovations",
  },
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
  "@id": new URL("/#organization", site.url).toString(),
  name: site.name,
  url: site.url,
  logo: new URL("/brand/catalyst-official.png", site.url).toString(),
  slogan: site.motto,
  description: site.positioning,
  telephone: site.contactPhone,
  email: activeFounders.map((founder) => founder.email),
  areaServed: "Worldwide",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Knoxville",
    addressRegion: "TN",
    addressCountry: "US",
  },
  founder: [
    { "@type": "Person", name: "Josh Ogle", jobTitle: "Co-Founder" },
    { "@type": "Person", name: "Daniel Vass", jobTitle: "Co-Founder" },
  ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema).replace(/</g, "\\u003c") }}
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
