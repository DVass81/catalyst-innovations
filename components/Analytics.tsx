"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  configuredAnalytics, consentChangeEvent, createAnalyticsSession,
  createBrowserAnalyticsTransport, getAnalyticsConsent, parseAnalyticsConsent, analyticsArticleIds,
} from "@/lib/analytics";
import { createBlogCampaignSession } from "@/lib/blog-attribution";
import { AnalyticsConsentNotice } from "./AnalyticsPreferences";

let session: ReturnType<typeof createAnalyticsSession> | undefined;

function getSession(articleIds: readonly string[], blogPostIds: readonly string[]) {
  if (session) return session;
  const providers = configuredAnalytics();
  if (!providers.gaId && !providers.plausibleDomain) return undefined;
  const campaign = createBlogCampaignSession(articleIds, () => window.sessionStorage, blogPostIds);
  const transport = createBrowserAnalyticsTransport(providers, articleIds, blogPostIds);
  session = createAnalyticsSession({
    start(path, ads) { campaign.activate(window.location.search, path); transport.start(path, ads); },
    page(path) { campaign.capture(window.location.search, path); transport.page(path); },
    send(payload) { transport.send({ ...payload, props: { ...campaign.properties(), ...payload.props } }); },
    stop(reloadForModeChange) { campaign.withdraw(); transport.stop(reloadForModeChange); },
  }, { articleIds, blogPostIds });
  const applyConsent = (choice: ReturnType<typeof getAnalyticsConsent>) => {
    // A denial may arrive before this document ever loaded a measurement tag.
    // Remove a previous tab-session label rather than revive it on later opt-in.
    if (choice !== "granted" && choice !== "ad_measurement") campaign.withdraw();
    session?.consent(choice);
  };
  session.navigate(window.location.pathname);
  applyConsent(getAnalyticsConsent());
  const w = window as typeof window & { ciTrack?: (event: string, props?: Record<string, string | number>) => void };
  w.ciTrack = (event, props) => session?.track(event, props);
  window.addEventListener(consentChangeEvent, (event) => {
    applyConsent(parseAnalyticsConsent((event as CustomEvent).detail));
  });
  window.addEventListener("storage", () => applyConsent(getAnalyticsConsent()));
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
    if (url.origin === window.location.origin && url.pathname === "/consultation") {
      const article = url.searchParams.get("article");
      const post = url.searchParams.get("post");
      w.ciTrack?.("cta_consultation_click", post ? { post } : article ? { article } : undefined);
    }
  });
  return session;
}

export default function Analytics({ articleIds = analyticsArticleIds, blogPostIds = [] }: { articleIds?: readonly string[]; blogPostIds?: readonly string[] }) {
  const pathname = usePathname();
  useEffect(() => { getSession(articleIds, blogPostIds)?.navigate(pathname); }, [pathname, articleIds, blogPostIds]);
  return <AnalyticsConsentNotice />;
}
