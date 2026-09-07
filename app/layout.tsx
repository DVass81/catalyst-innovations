import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import Script from "next/script";
import "./globals.css";
import "./redesign.css";
import "./experience.css";
import "./forms.css";
import "./editorial.css";
import "./story.css";
import "./story-sections.css";
import "./paper-world.css";
import { StoryMotionProvider } from "@/components/story/StoryMotion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import CommandPalette from "@/components/CommandPalette";
import ErrorMonitoring from "@/components/ErrorMonitoring";
import RouteProgress from "@/components/RouteProgress";
import { site } from "@/lib/site";
import { DemoProvider } from "@/components/demos/DemoProvider";

const inter = localFont({
  src: "../public/fonts/inter-latin.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});
const space = localFont({
  src: "../public/fonts/space-grotesk-latin.woff2",
  variable: "--font-space",
  weight: "300 700",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Catalyst Innovations — See your business working better",
    template: "%s | Catalyst Innovations",
  },
  description: site.positioning,
  openGraph: {
    siteName: site.name,
    type: "website",
    title: "Catalyst Innovations",
    description: site.positioning,
  },
  robots: {
    index: process.env.SITE_PREVIEW !== "true",
    follow: process.env.SITE_PREVIEW !== "true",
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
  }),
};
export const viewport: Viewport = { themeColor: "#07111f" };
const org = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  description: site.positioning,
  founder: [
    {
      "@type": "Person",
      name: "Daniel Vass",
      jobTitle: "Co-Founder, Operations & Business Transformation",
    },
    {
      "@type": "Person",
      name: "Josh Ogle",
      jobTitle: "Co-Founder, Technology & Product Development",
    },
  ],
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${space.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('ci-theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(org).replace(/</g, "\\u003c"),
          }}
        />
        <Suspense fallback={null}>
          <RouteProgress />
        </Suspense>
        <ErrorMonitoring>
          <DemoProvider>
            <StoryMotionProvider>
              <Navbar />
              <Analytics />
              <main id="main" tabIndex={-1} className="flex-1">
                {children}
              </main>
              <Footer />
              <CommandPalette />
            </StoryMotionProvider>
          </DemoProvider>
        </ErrorMonitoring>
      </body>
    </html>
  );
}
