"use client";

import Script from "next/script";
import { useEffect } from "react";

/**
 * Provider-agnostic analytics loader. Activates automatically when env vars
 * are set — no code changes needed:
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com   → loads Plausible
 *   NEXT_PUBLIC_GA_ID=G-XXXXXXX                   → loads GA4
 * All site events flow through window.ciTrack (see lib/site.ts) and are
 * forwarded to whichever providers are present. No personal data is sent.
 */

const PLAUSIBLE = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function Analytics() {
  useEffect(() => {
    const w = window as typeof window & {
      ciTrack?: (e: string, p?: Record<string, string | number>) => void;
      plausible?: (e: string, o?: { props?: Record<string, string | number> }) => void;
      gtag?: (...args: unknown[]) => void;
    };
    w.ciTrack = (event, props) => {
      try {
        w.plausible?.(event, props ? { props } : undefined);
        w.gtag?.("event", event, props ?? {});
      } catch {
        /* analytics must never break the UI */
      }
    };
  }, []);

  return (
    <>
      {PLAUSIBLE && (
        <Script
          defer
          data-domain={PLAUSIBLE}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });`}
          </Script>
        </>
      )}
    </>
  );
}
