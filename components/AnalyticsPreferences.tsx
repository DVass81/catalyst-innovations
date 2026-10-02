"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  configuredAnalytics, getAnalyticsConsent, preferencesOpenEvent,
  saveAnalyticsConsent, subscribeAnalyticsConsent,
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
  const choose = (choice: "granted" | "denied") => {
    const persisted = saveAnalyticsConsent(choice);
    if (!persisted) {
      setMessage(choice === "granted"
        ? "Your browser could not save this choice. Analytics remains off."
        : "Analytics is off on this page. Your browser could not save the preference for future visits.");
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
            us understand which pages and features people use. We exclude form answers,
            calculator values and URL query details from our analytics events.
            {gaId ? " Google Analytics uses cookies." : ""}
          </p>
          <p>You can use the site either way and change your choice here at any time. <Link href="/privacy">Privacy details</Link>.</p>
          {consent !== "pending" && <p className={styles.status}>Current choice: analytics {consent === "granted" ? "on" : "off"}.</p>}
          <div className={styles.actions}>
            <button type="button" onClick={() => choose("granted")}>Accept analytics</button>
            <button type="button" onClick={() => choose("denied")}>{consent === "granted" ? "Turn analytics off" : "Decline analytics"}</button>
          </div>
          {consent === "granted" && gaId && <p className={styles.status}>Turning analytics off refreshes this page to stop an already loaded Google tag.</p>}
        </>
      ) : <p>Optional analytics is not enabled on this website. No analytics choice is needed right now.</p>}
      {message && <p role="status">{message}</p>}
      {opened && <button type="button" className={styles.close} onClick={close}>Close preferences</button>}
    </section>
  );
}
