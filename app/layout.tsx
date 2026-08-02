import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import Analytics from "@/components/Analytics";
import CommandPalette from "@/components/CommandPalette";
import ErrorMonitoring from "@/components/ErrorMonitoring";
import { site } from "@/lib/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
// Display voice: industrial grotesque reserved for headlines only.
const grotesk = Space_Grotesk({ variable: "--font-grotesk", subsets: ["latin"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Catalyst Innovations — Make More. Save Time. Work Smarter.",
    template: "%s | Catalyst Innovations",
  },
  description: site.positioning,
  openGraph: {
    siteName: site.name,
    type: "website",
    title: "Catalyst Innovations — Make More. Save Time. Work Smarter.",
    description: site.positioning,
  },
  robots: { index: true, follow: true },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  slogan: site.motto,
  description: site.positioning,
  address: { "@type": "PostalAddress", addressLocality: "Knoxville", addressRegion: "TN", addressCountry: "US" },
  founder: [
    { "@type": "Person", name: "Daniel Vass", jobTitle: "Co-Founder" },
    { "@type": "Person", name: "Josh Ogle", jobTitle: "Co-Founder" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} ${grotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Faint site-wide film grain — ties the whole site to the portal's material feel */}
        <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-[999] opacity-[0.025]" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <ErrorMonitoring>
          <Navbar />
          <ScrollProgress />
          <Analytics />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CommandPalette />
        </ErrorMonitoring>
      </body>
    </html>
  );
}
