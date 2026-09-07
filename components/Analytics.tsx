"use client";
import Script from "next/script";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
const PLAUSIBLE = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  GA_ID = process.env.NEXT_PUBLIC_GA_ID;
let memoryChoice = "unset";
function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener("ci-analytics-change", listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener("ci-analytics-change", listener);
  };
}
function snapshot() {
  try {
    return localStorage.getItem("ci-analytics") || memoryChoice;
  } catch {
    return memoryChoice;
  }
}
export default function Analytics() {
  const choice = useSyncExternalStore(subscribe, snapshot, () => "server");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener("ci-open-privacy", show);
    return () => window.removeEventListener("ci-open-privacy", show);
  }, []);
  useEffect(() => {
    const w = window as typeof window & {
      ciTrack?: (e: string, p?: Record<string, string | number>) => void;
      plausible?: (
        e: string,
        o?: { props?: Record<string, string | number> },
      ) => void;
      gtag?: (...args: unknown[]) => void;
    };
    w.ciTrack = (event, props) => {
      if (choice !== "allow") return;
      try {
        w.plausible?.(event, props ? { props } : undefined);
        w.gtag?.("event", event, props ?? {});
      } catch {}
    };
    const pricing = (e: MouseEvent) => {
      const a = (e.target as Element)?.closest?.("a");
      if (a?.getAttribute("href")?.startsWith("/pricing"))
        w.ciTrack?.("pricing_interest", { location: window.location.pathname });
    };
    window.addEventListener("click", pricing);
    return () => {
      delete w.ciTrack;
      window.removeEventListener("click", pricing);
    };
  }, [choice]);
  if (!PLAUSIBLE && !GA_ID) return null;
  const choose = (value: string) => {
    memoryChoice = value;
    try {
      localStorage.setItem("ci-analytics", value);
    } catch {}
    const wasAllowed = choice === "allow";
    window.dispatchEvent(new Event("ci-analytics-change"));
    setOpen(false);
    if (wasAllowed && value !== "allow") window.location.reload();
  };
  return (
    <>
      {choice === "allow" && (
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
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`}
                strategy="afterInteractive"
              />
              <Script
                id="ga4-init"
                strategy="afterInteractive"
              >{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config',${JSON.stringify(GA_ID)}, {allow_google_signals:false,allow_ad_personalization_signals:false});`}</Script>
            </>
          )}
        </>
      )}
      {choice !== "server" && (choice === "unset" || open) && (
        <section
          className="ci-consent"
          aria-label="Optional analytics preference"
        >
          <div>
            <h2>Help us understand what’s useful.</h2>
            <p>
              Optional analytics measures website use. It does not include your
              inquiry text. <Link href="/privacy">Privacy notice</Link>
            </p>
          </div>
          <button
            className="ci-btn ci-btn-outline ci-btn-small"
            onClick={() => choose("deny")}
          >
            Essential only
          </button>
          <button
            className="ci-btn ci-btn-small"
            onClick={() => choose("allow")}
          >
            Allow analytics
          </button>
        </section>
      )}
    </>
  );
}
