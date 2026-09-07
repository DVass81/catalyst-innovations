"use client";

import { Component, useEffect, type ReactNode } from "react";

/**
 * Dependency-free production error reporting. Set
 * NEXT_PUBLIC_ERROR_WEBHOOK_URL to any ingestion endpoint (a Sentry
 * "Envelope"-compatible relay, a simple logging webhook, etc.) and every
 * unhandled error/rejection plus React render error is POSTed there.
 * Without it, errors just go to the browser console — nothing breaks.
 */

const ENDPOINT = process.env.NEXT_PUBLIC_ERROR_WEBHOOK_URL;

function report(payload: Record<string, unknown>) {
  const body = { ...payload, url: typeof location !== "undefined" ? location.href : "", ts: new Date().toISOString() };
  if (!ENDPOINT) {
    console.error("[error-monitoring]", body);
    return;
  }
  try {
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* reporting must never throw */
  }
}

/** Catches window-level errors that React's error boundary can't see. */
function GlobalListeners() {
  useEffect(() => {
    const onError = (e: ErrorEvent) => report({ type: "error", message: e.message, stack: e.error?.stack });
    const onRejection = (e: PromiseRejectionEvent) =>
      report({ type: "unhandledrejection", message: String(e.reason?.message ?? e.reason) });
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);
  return null;
}

type BoundaryState = { hasError: boolean };

class Boundary extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    report({ type: "react_render", message: error.message, stack: error.stack, componentStack: info.componentStack });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-lg px-5 py-24 text-center">
          <p className="font-display text-lg font-semibold text-navy-900">Something went wrong.</p>
          <p className="mt-2 text-sm text-navy-700">
            Please refresh the page. If this keeps happening, use the contact page to let us know.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ErrorMonitoring({ children }: { children: ReactNode }) {
  return (
    <Boundary>
      <GlobalListeners />
      {children}
    </Boundary>
  );
}
