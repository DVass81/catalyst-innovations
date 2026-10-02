# Analytics setup and verification

## Current state

The site has consent-controlled GA4 and Plausible integrations. Source configuration is not evidence that a provider account, property or verified stream exists. No real measurement ID is checked into this change. With no valid enabled provider, the consent banner is hidden and the footer's Analytics preferences control explains that optional analytics is not enabled.

## GA4 configuration required before activation

1. In an account controlled by Catalyst, create or select the GA4 property and the web data stream for the final public domain. Record the stream's measurement ID (`G-…`).
2. In **Admin → Data collection and modification → Data streams → the web stream**, turn **Enhanced measurement off**. This includes history-based page views, scroll, outbound clicks, site search, video, file download and form-interaction collection. The site emits its own reviewed events. In particular, `send_page_view: false` alone does not disable history-based enhanced page views.
3. Keep **Google signals**, advertising personalization and user-provided data collection off. Do not add a second Google tag, Google Tag Manager container or automatic tracking plugin to this site. Site code denies advertising storage, advertising user data and advertising personalization; it also disables Google signals and ad-personalization signals.
4. Set `NEXT_PUBLIC_GA_ID` to the stream ID. Only after step 2 is confirmed, set `NEXT_PUBLIC_GA_MANUAL_TRACKING_VERIFIED=true`. Build/redeploy is required because these public settings are embedded at build time. The second flag intentionally keeps an unfinished setup inactive.
5. In **Admin → Data display → Custom definitions**, register `entry_source` as an event-scoped custom dimension if reporting on safe acquisition labels is desired. Values are limited to `google`, `bing`, `duckduckgo` and `direct_or_other`; no raw referring URL or search words are sent.
6. In **Admin → Data display → Events / Key events**, treat `form_complete` as a delivered inquiry only after testing the configured delivery provider. Do not mark `inquiry_draft_created`, `inquiry_draft_copied`, `inquiry_email_opened` or `booking_click` as completed inquiries or appointments. A booking completion requires a separately implemented, verified callback; this site does not emit one.
7. Check actual request payloads and GA4 Realtime / DebugView on the final domain. Confirm one `page_view` per route visit, correct consent behavior, no automatic form/search/link events, and no query/hash/referrer/form/calculator data. Configure provider retention according to the business's chosen policy; this change does not claim an approved retention duration.

## Optional Plausible setup

Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` to the domain registered in Plausible. It uses the documented Events API after the same explicit consent choice. There is no automatically capturing Plausible script. The payload contains a reviewed page URL, event name, approved feature identifiers and the safe `entry_source` category. Requests omit credentials and the HTTP referrer. Register desired custom-event goals in Plausible and verify receipt there; an HTTP success response alone does not establish that a provider accepted the event into reports.

## Browser verification without sending live analytics

For a dedicated local fixture build, use `NEXT_PUBLIC_GA_ID=G-TEST123`, `NEXT_PUBLIC_GA_MANUAL_TRACKING_VERIFIED=true`, and optionally `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=fixture.example`. Before opening the page, intercept `https://www.googletagmanager.com/**`, `https://*.google-analytics.com/**` and `https://plausible.io/api/event` in the browser test runner. Fulfill Google scripts locally and capture API payloads; do not send fixture data to a live provider. Environment fixture values are public test identifiers, not credentials.

- In a clean browser context, visit `/consultation?email=private@example.test#private`. No provider script, analytics request or GA cookie should appear before accepting. Decline, navigate and reload: there should still be none.
- Reopen **Analytics preferences** in the footer. Both choices must be keyboard reachable and equally prominent. Accept; one Google script load and one explicit pageview should occur. Repeated rendering, hash changes and query-only changes must not add a pageview. Visit another route and use Back; each actual route visit gets one view.
- Inspect `window.dataLayer` entries by converting them with `Array.from(entry)`. They are Google's standard `Arguments` queue objects. Config must have `send_page_view: false`, blank `page_referrer`, safe `page_location`, signals/personalization disabled, and advertising consent denied. Capture requests as well once the real configured tag is available.
- Try `window.ciTrack('form_complete', { email: 'private@example.test', source: 'inquiry', value: 12345 })`. Only `source: 'inquiry'` should survive. Unknown event names and routes must be dropped. Try a fabricated `/insights/<private identifier>` URL and ensure it is not transmitted.
- In the email-draft inquiry flow, preparing a valid draft emits `inquiry_draft_created`, a successful clipboard copy emits `inquiry_draft_copied`, and opening the mail application emits `inquiry_email_opened`. None emits `form_complete`. With a mocked successful delivery endpoint, a successful direct submission emits `form_complete`; a failed response does not. No message is sent in these checks.
- Accept with the Google script deliberately delayed, then reopen preferences and turn analytics off. Repeat with the script already loaded. Denial must be saved first, the GA-disable flag set, the queue cleared, the script removed, Plausible requests aborted and the document refreshed. The fresh document must not reload analytics. Changing the saved choice in another tab must also stop tracking.
- Block browser storage and cookies: acceptance must fail closed with a readable message. The site still works.
- Without fixture/provider configuration, no consent banner appears; preferences clearly reports analytics is not enabled.

## Reporting boundaries

Analytics represents only visitors who opt in and whose browsers permit requests. It does not establish total traffic, rankings, leads sent through external email, or completed appointments. Referrer URLs and campaign/query values are deliberately omitted. Standard GA channel attribution will therefore be incomplete; use the coarse `entry_source` dimension for search-engine referral comparisons and Search Console for actual organic search queries/impressions. A recognized search-engine referrer is a referral category, not proof that the click was organic rather than paid.

Automated tests cover sanitization, route allowlisting, source categorization, consent changes, pre-consent event dropping, pageview deduplication, provider gating, blocked storage, and revocation of pending/loaded transports. Final provider delivery and real Google tag behavior still require the configured live-account check above.

References: [Google pageview controls](https://developers.google.com/analytics/devguides/collection/ga4/views), [Google configuration fields](https://developers.google.com/analytics/devguides/collection/ga4/reference/config), [Plausible Events API](https://plausible.io/docs/events-api).
