"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  configuredAnalytics, getAnalyticsConsent, preferencesOpenEvent,
  saveAnalyticsConsent, subscribeAnalyticsConsent, type AnalyticsConsent,
} from "@/lib/analytics";
import styles from "./AnalyticsPreferences.module.css";

export default function AnalyticsPreferences() {
  return (
    <button type="button" className={styles.preferenceLink}
      onClick={() => window.dispatchEvent(new Event(preferencesOpenEvent))}>
      Analytics preferences
    </button>
  );
}

export function AnalyticsConsentNotice() {
  const consent = useSyncExternalStore(subscribeAnalyticsConsent, getAnalyticsConsent, () => "pending");
  const [opened, setOpened] = useState(false);
  const [message, setMessage] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const { gaId, plausibleDomain } = configuredAnalytics();
  const configured = Boolean(gaId || plausibleDomain);
  useEffect(() => {
    const open = () => {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setOpened(true);
      requestAnimationFrame(() => heading.current?.focus());
    };
    window.addEventListener(preferencesOpenEvent, open);
    return () => window.removeEventListener(preferencesOpenEvent, open);
  }, []);
  if (!opened && (!configured || consent !== "pending")) return null;
  const close = () => {
    setOpened(false);
    setMessage("");
    returnFocus.current?.focus();
  };
  const choose = (choice: Exclude<AnalyticsConsent, "pending">) => {
    const persisted = saveAnalyticsConsent(choice);
    if (!persisted) {
      setMessage("Measurement is off on this page. Your browser could not save the new preference. Reloading or opening another page may restore your previous choice; please allow preference storage and choose again.");
      return;
    }
    close();
  };
  return (
    <section className={styles.notice} aria-labelledby="analytics-choice-title">
      <h2 id="analytics-choice-title" ref={heading} tabIndex={-1}>Your analytics choice</h2>
      {configured ? (
        <>
          <p>
            With your permission, {gaId && plausibleDomain ? "Google Analytics and Plausible help" : gaId ? "Google Analytics helps" : "Plausible helps"}{" "}
            us understand which pages and features people use. The custom events we
            send omit form answers, contact fields and calculator values.
            {gaId ? " Google Analytics uses cookies." : ""}
          </p>
          {gaId && <p>
            The URL we supply for basic analytics excludes query details. Separately, “Measure ad results”
            allows Google advertising cookies and validated Google click or aggregate
            identifiers to help us see whether
            a Google ad led to an inquiry. We do not share form answers or use ad personalization.
          </p>}
          <p>You can use the site either way and change your choice here at any time. <Link href="/privacy">Privacy details</Link>.</p>
          {consent !== "pending" && <p className={styles.status}>Current choice: {consent === "ad_measurement" ? "analytics and ad-result measurement" : consent === "granted" ? "basic analytics only" : "necessary only"}.</p>}
          <div className={styles.actions}>
            <button type="button" aria-pressed={consent === "granted"} onClick={() => choose("granted")}>Basic analytics</button>
            {gaId && <button type="button" aria-pressed={consent === "ad_measurement"} onClick={() => choose("ad_measurement")}>Measure ad results</button>}
            <button type="button" aria-pressed={consent === "denied"} onClick={() => choose("denied")}>Necessary only</button>
          </div>
          {(consent === "granted" || consent === "ad_measurement") && gaId && <p className={styles.status}>Changing this choice refreshes the page to reset an already loaded Google tag.</p>}
        </>
      ) : <p>Optional analytics is not enabled on this website. No analytics choice is needed right now.</p>}
      {message && <p role="status">{message}</p>}
      {opened && <button type="button" className={styles.close} onClick={close}>Close preferences</button>}
    </section>
  );
}
