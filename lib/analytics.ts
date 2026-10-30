/** Only reviewed identifiers may leave the browser through site analytics. */
export const analyticsEvents = [
  "cta_consultation_click", "form_start", "form_step", "form_complete",
  "form_error", "inquiry_draft_created", "inquiry_draft_copied",
  "inquiry_email_opened", "roi_calculator_used", "roi_pdf_download",
  "assessment_start", "assessment_complete", "booking_click",
  "demo_interaction", "industry_select", "section_view",
  "founder_profile_view", "phone_click", "email_click",
] as const;
export type AnalyticsEvent = (typeof analyticsEvents)[number];
// `granted` is basic site analytics only. Advertising measurement is a separate,
// explicit choice; existing saved grants must never silently become ad consent.
export type AnalyticsConsent = "pending" | "granted" | "ad_measurement" | "denied";
export type AnalyticsProperties = Record<string, string>;

// Keep these small, explicit registries separate from customer-facing copy.
export const analyticsToolIds = [
  "manual-work", "duplicate-entry", "software-consolidation", "project-roi",
  "missed-inquiries", "sales-follow-up", "quoting-time", "invoice-preparation",
  "dispatch-admin", "crew-travel", "job-margin", "change-orders",
  "inventory-carrying", "reorder-point", "warehouse-picking", "purchase-orders",
  "downtime-cost", "scrap-rework", "hoa-administration", "maintenance-coordination",
  "campaign-proceeds", "donor-follow-up", "reporting-time", "customer-onboarding",
] as const;
export const analyticsIndustryIds = [
  "manufacturing", "financial-institutions", "credit-unions", "logistics",
  "construction", "electrical-contractors", "welding-fabrication",
  "industrial-services", "professional-services", "field-service",
  "schools-athletics", "churches-nonprofits", "small-business", "multi-location",
  "plumbing", "hvac", "painting", "hoa", "warehousing",
] as const;
export const analyticsArticleIds = [
  "estimate-to-invoice-field-office", "manufacturing-spreadsheets",
  "inventory-purchasing-stock", "trackable-approval-workflows",
  "hoa-maintenance-requests", "custom-software-vs-off-the-shelf",
  "software-data-migration", "software-rollout-small-team",
] as const;
export const analyticsDemoIds = ["hoa", "flooring", "painting"] as const;
export const analyticsPaths = new Set([
  "/", "/services", "/solutions", "/industries", "/portfolio", "/method", "/about",
  "/discovery", "/contact", "/consultation", "/tools", "/insights",
  "/privacy", "/terms", "/accessibility",
  ...analyticsToolIds.map((id) => `/tools/${id}`),
  ...analyticsIndustryIds.map((id) => `/industries/${id}`),
  ...analyticsArticleIds.map((id) => `/insights/${id}`),
  ...analyticsDemoIds.map((id) => `/portfolio/${id}`),
  ...["custom-software", "ai-automation", "procurement", "manufacturing-operations",
    "supply-chain", "process-automation", "data-intelligence", "integrations-consulting"]
    .map((id) => `/solutions/${id}`),
]);

/** No absolute URLs, unknown paths, user identifiers, query strings or fragments. */
export function analyticsPath(input: unknown): string | null {
  if (typeof input !== "string" || !input.startsWith("/") || input.startsWith("//")) return null;
  const path = input.split(/[?#]/, 1)[0];
  return analyticsPaths.has(path) ? path : null;
}

const identifiers: Record<string, readonly string[]> = {
  tool: analyticsToolIds,
  industry: analyticsIndustryIds,
  source: ["calculator", "inquiry", "demo", "inquiry_draft"],
  demo: analyticsDemoIds,
  location: ["hero", "portal_hero", "value_hero", "assessment_result", "roi_calculator", "industry_explorer"],
  problem: ["quoting", "scheduling", "inventory", "reporting", "administration"],
  section: ["founders", "problem-finder"],
  founder: ["daniel-vass", "josh-ogle"],
  context: ["daniel-vass", "josh-ogle", "contact_page_daniel-vass", "contact_page_josh-ogle", "footer"],
  widget: ["command_palette", "industry_explorer", "procurement_dashboard", "ai_briefing", "approval_workflow", "ops_kpis", "nl_query"],
  action: ["open", "open_walkthrough", "open_public", "complete_walkthrough", "walkthrough_progress", "play_walkthrough", "filter", "approve", "reject", "approved", "rejected", "open_alert", "ask"],
};
const eventKeys: Record<AnalyticsEvent, readonly string[]> = {
  cta_consultation_click: ["location"],
  form_start: ["source"], form_step: [], form_complete: ["source"], form_error: ["source"],
  inquiry_draft_created: ["source"], inquiry_draft_copied: ["source"], inquiry_email_opened: ["source"],
  roi_calculator_used: ["tool"], roi_pdf_download: ["tool"],
  assessment_start: ["problem"], assessment_complete: [], booking_click: [],
  demo_interaction: ["demo", "widget", "action", "industry"], industry_select: ["industry"],
  section_view: ["section"], founder_profile_view: ["founder"],
  phone_click: ["context"], email_click: ["context", "source"],
};

export function sanitizeAnalyticsEvent(event: unknown, input: unknown = {}): { name: AnalyticsEvent; props: AnalyticsProperties } | null {
  if (typeof event !== "string" || !(analyticsEvents as readonly string[]).includes(event)) return null;
  const name = event as AnalyticsEvent;
  const props: AnalyticsProperties = {};
  if (input && typeof input === "object") {
    for (const key of eventKeys[name]) {
      const value = (input as Record<string, unknown>)[key];
      if (typeof value === "string" && identifiers[key]?.includes(value)) props[key] = value;
    }
  }
  return { name, props };
}

export const consentStorageKey = "catalyst-analytics-consent-v1";
export const consentChangeEvent = "catalyst:analytics-consent";
export const preferencesOpenEvent = "catalyst:analytics-preferences";
const consentCookie = "catalyst_analytics_consent";

export function parseAnalyticsConsent(value: unknown): AnalyticsConsent {
  return value === "granted" || value === "ad_measurement" || value === "denied" ? value : "pending";
}

export function getAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return "pending";
  const override = (window as unknown as AnalyticsWindow).ciConsentOverride;
  if (override) return override;
  let saved: AnalyticsConsent = "pending";
  try { saved = parseAnalyticsConsent(window.localStorage.getItem(consentStorageKey)); } catch {}
  let cookie: AnalyticsConsent = "pending";
  try { cookie = parseAnalyticsConsent(document.cookie.split("; ").find((part) => part.startsWith(`${consentCookie}=`))?.split("=")[1]); } catch {}
  // A denial in either store wins, including a withdrawal after a storage failure.
  if (saved === "denied" || cookie === "denied") return "denied";
  // The more permissive ad choice requires both stores to agree. A stale or
  // blocked store must not turn an older analytics-only choice into ad consent.
  if (saved === "ad_measurement" && cookie === "ad_measurement") return "ad_measurement";
  return saved === "granted" || cookie === "granted" ? "granted" : "pending";
}

/** Persist before notifying listeners. Acceptance fails closed if storage is blocked. */
export function saveAnalyticsConsent(choice: Exclude<AnalyticsConsent, "pending">): boolean {
  const w = window as unknown as AnalyticsWindow;
  const previouslyBlocked = Boolean(w.ciConsentOverride);
  delete w.ciConsentOverride;
  try { window.localStorage.setItem(consentStorageKey, choice); } catch {}
  try { document.cookie = `${consentCookie}=${choice}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`; } catch {}
  const persisted = getAnalyticsConsent() === choice;
  // A failed downgrade must never revive a stale, more permissive preference.
  // Keep this document off instead of reloading into stores we could not update.
  if (!persisted) w.ciConsentOverride = "denied";
  if (!persisted || choice !== "ad_measurement") clearGoogleMeasurementCookies(choice === "denied" || !persisted);
  window.dispatchEvent(new CustomEvent(consentChangeEvent, { detail: persisted && !previouslyBlocked ? choice : "denied" }));
  // After a failed save the previous tag may still have code in this document.
  // A later successful choice starts from a fresh document, never a second tag.
  if (persisted && previouslyBlocked) window.location.reload();
  return persisted;
}

export function subscribeAnalyticsConsent(listener: () => void) {
  window.addEventListener(consentChangeEvent, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(consentChangeEvent, listener);
    window.removeEventListener("storage", listener);
  };
}

export function configuredAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID ?? "";
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "";
  return {
    gaId: /^G-[A-Z0-9]+$/.test(id) && process.env.NEXT_PUBLIC_GA_MANUAL_TRACKING_VERIFIED === "true" ? id : "",
    plausibleDomain: /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(domain) ? domain : "",
  };
}

export type AnalyticsPayload = { name: AnalyticsEvent | "page_view"; path: string; props: AnalyticsProperties };
export type AnalyticsTransport = {
  start: (path: string | null, adMeasurement: boolean) => void;
  page: (path: string | null) => void;
  send: (payload: AnalyticsPayload) => void;
  stop: (reloadForModeChange?: boolean) => void;
};

const isActiveConsent = (choice: AnalyticsConsent) => choice === "granted" || choice === "ad_measurement";

/** Testable state machine: no queue/replay of interactions made before consent. */
export function createAnalyticsSession(transport: AnalyticsTransport) {
  let consent: AnalyticsConsent = "pending";
  let path: string | null = null;
  let lastViewed: string | null = null;
  let reloading = false;
  const view = () => {
    if (!isActiveConsent(consent) || reloading || !path || path === lastViewed) return;
    lastViewed = path;
    transport.send({ name: "page_view", path, props: {} });
  };
  return {
    consent(next: AnalyticsConsent) {
      if (next === consent || reloading) return;
      const previous = consent;
      consent = next;
      if (isActiveConsent(previous) && isActiveConsent(next)) {
        // A loaded Google tag can retain its old consent state. Persist the
        // choice first, tear down the old tag, then start clean on reload.
        reloading = true;
        lastViewed = null;
        transport.stop(true);
      } else if (isActiveConsent(next)) {
        transport.start(path, next === "ad_measurement");
        view();
      } else {
        lastViewed = null;
        if (isActiveConsent(previous)) transport.stop();
      }
    },
    navigate(input: unknown) {
      const next = analyticsPath(input);
      if (next === path) return;
      path = next;
      if (!path) lastViewed = null;
      if (isActiveConsent(consent) && !reloading) transport.page(path);
      view();
    },
    track(event: unknown, props?: unknown) {
      if (!isActiveConsent(consent) || reloading || !path) return;
      const clean = sanitizeAnalyticsEvent(event, props);
      if (clean) transport.send({ ...clean, path });
    },
  };
}

export const googlePrivacyConfig = {
  send_page_view: false,
  allow_google_signals: false,
  allow_ad_personalization_signals: false,
  ads_data_redaction: true,
  ignore_referrer: true,
  page_referrer: "",
  // Do not inherit campaigns or search terms from the real URL.
  campaign_id: "", campaign_source: "", campaign_medium: "",
  campaign_name: "", campaign_term: "", campaign_content: "",
};

const googleAdMeasurementConfig = {
  ...googlePrivacyConfig,
  ads_data_redaction: false,
};

export function analyticsPageFields(origin: string, path: string | null) {
  const safePath = analyticsPath(path) ?? "/";
  return { page_location: `${new URL(origin).origin}${safePath}`, page_title: safePath, page_referrer: "" };
}

/** Only documented Google Ads click/aggregate identifiers are allowed into a
 * consented GA URL. All other queries, including UTMs and form values, stay out. */
export function adMeasurementPageFields(origin: string, path: string | null, search: string) {
  const fields = analyticsPageFields(origin, path);
  if (!analyticsPath(path)) return fields;
  const input = new URLSearchParams(search);
  const safe = new URLSearchParams();
  for (const [name, pattern] of [
    ["gclid", /^[A-Za-z0-9_-]{10,256}$/],
    ["gbraid", /^[A-Za-z0-9_-]{8,256}$/],
    ["wbraid", /^[A-Za-z0-9_-]{8,256}$/],
    ["gad_source", /^[0-9]{1,4}$/],
    ["gad_campaignid", /^[0-9]{1,20}$/],
  ] as const) {
    const values = input.getAll(name);
    if (values.length === 1 && pattern.test(values[0])) safe.set(name, values[0]);
  }
  const query = safe.toString();
  return query ? { ...fields, page_location: `${fields.page_location}?${query}` } : fields;
}

/** Acquisition category only: never retain or send the referring URL or search. */
export function analyticsEntrySource(referrer: unknown): "google" | "bing" | "duckduckgo" | "direct_or_other" {
  if (typeof referrer !== "string") return "direct_or_other";
  try {
    const url = new URL(referrer);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "direct_or_other";
    const host = url.hostname.toLowerCase();
    if (["google.com", "www.google.com", "www.google.co.uk", "www.google.ca", "www.google.com.au", "www.google.de"].includes(host)) return "google";
    if (["bing.com", "www.bing.com"].includes(host)) return "bing";
    if (["duckduckgo.com", "www.duckduckgo.com", "html.duckduckgo.com"].includes(host)) return "duckduckgo";
  } catch {}
  return "direct_or_other";
}

type AnalyticsWindow = Window & {
  ciConsentOverride?: AnalyticsConsent;
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  ciTrack?: (event: string, props?: Record<string, string | number>) => void;
  [key: `ga-disable-${string}`]: boolean;
};

/** Remove browser-accessible cookies for the host and parent-domain variants. */
function clearGoogleMeasurementCookies(includeAnalytics: boolean) {
  try {
    for (const pair of document.cookie.split("; ")) {
      const name = pair.split("=")[0];
      const analyticsCookie = name === "_ga" || name.startsWith("_ga_");
      if (!name.startsWith("_gcl_") && !(includeAnalytics && analyticsCookie)) continue;
      const domains = window.location.hostname.split(".");
      document.cookie = `${name}=; Max-Age=0; Path=/`;
      while (domains.length > 1) {
        document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${domains.join(".")}`;
        domains.shift();
      }
    }
  } catch { /* Storage restrictions must not prevent stopping the tag. */ }
}

/** Browser adapter. Plausible uses explicit API calls, with no automatic tracker. */
export function createBrowserAnalyticsTransport(providers = configuredAnalytics()): AnalyticsTransport {
  const w = window as unknown as AnalyticsWindow;
  const requests = new Set<AbortController>();
  let active = false;
  let script: HTMLScriptElement | null = null;
  let generation = 0;
  let adMeasurement = false;
  const entrySource = analyticsEntrySource(document.referrer);
  const fields = (path: string | null) => adMeasurement && path === window.location.pathname
    ? adMeasurementPageFields(window.location.origin, path, window.location.search)
    : analyticsPageFields(window.location.origin, path);
  const privacyConfig = () => adMeasurement ? googleAdMeasurementConfig : googlePrivacyConfig;
  const page = (path: string | null) => {
    if (!active || !providers.gaId) return;
    w[`ga-disable-${providers.gaId}`] = path === null;
    w.gtag?.("set", { ...privacyConfig(), ...fields(path) });
    w.gtag?.("config", providers.gaId, { ...privacyConfig(), ...fields(path), update: true });
  };
  return {
    start(path, measureAds) {
      if (active) return;
      active = true;
      adMeasurement = measureAds;
      if (!adMeasurement) clearGoogleMeasurementCookies(false);
      const currentGeneration = ++generation;
      if (!providers.gaId) return;
      w[`ga-disable-${providers.gaId}`] = path === null;
      w.dataLayer = [];
      w.gtag = function () {
        // Google's documented queue expects an Arguments object, not a rest array.
        // eslint-disable-next-line prefer-rest-params
        if (active && generation === currentGeneration) w.dataLayer?.push(arguments);
      };
      w.gtag("consent", "default", {
        analytics_storage: "granted", ad_storage: adMeasurement ? "granted" : "denied",
        ad_user_data: adMeasurement ? "granted" : "denied", ad_personalization: "denied",
      });
      w.gtag("set", { ...privacyConfig(), ...fields(path) });
      w.gtag("js", new Date());
      w.gtag("config", providers.gaId, { ...privacyConfig(), ...fields(path) });
      script = document.createElement("script");
      script.id = "catalyst-consented-ga4";
      script.async = true;
      script.referrerPolicy = "no-referrer";
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(providers.gaId)}`;
      // No load callback can restart a withdrawn session.
      document.head.appendChild(script);
    },
    page,
    send(payload) {
      if (!active) return;
      if (providers.gaId) {
        w.gtag?.("event", payload.name, {
          ...payload.props, entry_source: entrySource, ...fields(payload.path), send_to: providers.gaId,
          allow_google_signals: false, allow_ad_personalization_signals: false,
        });
      }
      if (providers.plausibleDomain) {
        const controller = new AbortController();
        requests.add(controller);
        void fetch("https://plausible.io/api/event", {
          method: "POST", headers: { "Content-Type": "text/plain" },
          credentials: "omit", referrerPolicy: "no-referrer", signal: controller.signal,
          body: JSON.stringify({
            name: payload.name === "page_view" ? "pageview" : payload.name,
            domain: providers.plausibleDomain,
            // Plausible never receives click IDs, even when ad measurement is on.
            url: analyticsPageFields(window.location.origin, payload.path).page_location,
            props: { ...payload.props, entry_source: entrySource },
          }),
        }).catch(() => {}).finally(() => requests.delete(controller));
      }
    },
    stop(reloadForModeChange = false) {
      if (!active) return;
      // Inform an already loaded Google tag before disabling our event bridge.
      w.gtag?.("consent", "update", {
        analytics_storage: "denied", ad_storage: "denied",
        ad_user_data: "denied", ad_personalization: "denied",
      });
      active = false;
      generation++;
      if (providers.gaId) w[`ga-disable-${providers.gaId}`] = true;
      w.dataLayer?.splice(0);
      w.gtag = () => {};
      script?.remove();
      script = null;
      requests.forEach((request) => request.abort());
      requests.clear();
      clearGoogleMeasurementCookies(true);
      // Persisted denial is read before any scripts load in the fresh document.
      // This also removes listeners installed inside an already-loaded Google tag.
      if (!w.ciConsentOverride && (reloadForModeChange || (providers.gaId && !isActiveConsent(getAnalyticsConsent())))) window.location.reload();
    },
  };
}
