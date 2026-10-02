"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  configuredAnalytics, consentChangeEvent, createAnalyticsSession,
  createBrowserAnalyticsTransport, getAnalyticsConsent, parseAnalyticsConsent,
} from "@/lib/analytics";
import { AnalyticsConsentNotice } from "./AnalyticsPreferences";

let session: ReturnType<typeof createAnalyticsSession> | undefined;

function getSession() {
  if (session) return session;
  const providers = configuredAnalytics();
  if (!providers.gaId && !providers.plausibleDomain) return undefined;
  session = createAnalyticsSession(createBrowserAnalyticsTransport(providers));
  session.navigate(window.location.pathname);
  session.consent(getAnalyticsConsent());
  const w = window as typeof window & { ciTrack?: (event: string, props?: Record<string, string | number>) => void };
  w.ciTrack = (event, props) => session?.track(event, props);
  window.addEventListener(consentChangeEvent, (event) => {
    session?.consent(parseAnalyticsConsent((event as CustomEvent).detail));
  });
  window.addEventListener("storage", () => session?.consent(getAnalyticsConsent()));
  // Cover consultation links without copying destination queries. Explicit CTA
  // hooks and the delegated listener are deduplicated within a click dispatch.
  let lastCtaAt = -100;
  const track = w.ciTrack;
  w.ciTrack = (event, props) => {
    if (event === "cta_consultation_click") {
      const now = performance.now();
      if (now - lastCtaAt < 100) return;
      lastCtaAt = now;
    }
    track(event, props);
  };
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>("a[href]");
    if (!link) return;
    const url = new URL(link.href, window.location.origin);
    if (url.origin === window.location.origin && url.pathname === "/consultation") w.ciTrack?.("cta_consultation_click");
  });
  return session;
}

export default function Analytics() {
  const pathname = usePathname();
  useEffect(() => { getSession()?.navigate(pathname); }, [pathname]);
  return <AnalyticsConsentNotice />;
}
