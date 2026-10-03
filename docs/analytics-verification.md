# Analytics setup and verification

## Current state

As of **October 3, 2026**, approved commit `0999693` is live on DigitalOcean deployment `d5d101c7-e169-4b93-8899-7ac0adbb28d6`; the dashboard shows Healthy/Success and Live Deployment. Search Console HTML-tag ownership is verified, and GA4 has received the controlled production test events described below. These are QA counts, not a customer-traffic baseline. Plausible remains off, and local previews keep real analytics disabled.

## GA4 configuration to preserve

1. Use Daniel’s approved existing Google account. Reuse an existing Catalyst property and web stream if present; otherwise create **Catalyst Innovations**, with **Eastern time** and **USD**, for `https://mycatalystinnovations.com/`. Daniel completes sign-in, security checks and any required terms. Record the stream's measurement ID (`G-…`). Outlook remains the customer email service.
2. In **Admin → Data collection and modification → Data streams → the web stream**, turn **Enhanced measurement off**. This includes history-based page views, scroll, outbound clicks, site search, video, file download and form-interaction collection. The site emits its own reviewed events. In particular, `send_page_view: false` alone does not disable history-based enhanced page views.
3. Keep **Google signals**, advertising personalization and user-provided data collection off. In **Configure tag settings**, also disable the Google tag's automatic event detection (history page views, scrolls, outbound clicks, forms, video and downloads), and disable **Allow user-provided data capabilities** plus automatic user-data detection. These tag-level defaults can remain on even when the GA4 stream's enhanced measurement is off. The base page-view checkbox is not editable there; the website's `send_page_view: false` and explicit pageview events control it. Do not add a second Google tag, Google Tag Manager installation or automatic tracking plugin to this site. Site code denies advertising storage, advertising user data and advertising personalization; it also disables Google signals and ad-personalization signals.
4. Set `NEXT_PUBLIC_GA_ID` to the stream ID. Only after the stream and tag-level reviews in steps 2–3 are confirmed, set `NEXT_PUBLIC_GA_MANUAL_TRACKING_VERIFIED=true`. Build/redeploy is required because these public settings are embedded at build time. The second flag intentionally keeps an unfinished setup inactive.
5. In **Admin → Data display → Custom definitions**, register `entry_source` as an event-scoped custom dimension if reporting on safe acquisition labels is desired. Values are limited to `google`, `bing`, `duckduckgo` and `direct_or_other`; no raw referring URL or search words are sent.
6. In **Admin → Data display → Events / Key events**, treat `form_complete` as a delivered inquiry only after testing the configured delivery provider. Do not mark `inquiry_draft_created`, `inquiry_draft_copied`, `inquiry_email_opened` or `booking_click` as completed inquiries or appointments. A booking completion requires a separately implemented, verified callback; this site does not emit one.
7. Check actual request payloads and GA4 Realtime / DebugView on the final domain. Confirm one `page_view` per route visit, correct consent behavior, no automatic form/search/link events, and no query/hash/referrer/form/calculator data. Configure provider retention according to the business's chosen policy; this change does not claim an approved retention duration.

## Optional Plausible setup

Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` to the domain registered in Plausible. It uses the documented Events API after the same explicit consent choice. There is no automatically capturing Plausible script. The payload contains a reviewed page URL, event name, approved feature identifiers and the safe `entry_source` category. Requests omit credentials and the HTTP referrer. Register desired custom-event goals in Plausible and verify receipt there; an HTTP success response alone does not establish that a provider accepted the event into reports.

## Google connection and release status — October 3, 2026

The current connection task uses free Search Console and Google Analytics only. Do not enable Plausible, buy a subscription, create a new Google account or change Outlook as part of it. Daniel completed sign-in and the security check with the chosen existing account. No existing Search Console property was available; the HTTPS URL-prefix property has been added. Analytics opened its first-use setup, so no existing Analytics account/property was available there.

The Search Console HTML tag is present in the deployment template and ignored local preview configuration. The prior local build passed with 93 routes and exactly one matching homepage verification tag. GA and Plausible remain disabled locally; the local manual-tracking gate is false.

Daniel completed Google's terms step. Analytics now has account and property name **Catalyst Innovations**, **New York time** (Eastern), **US Dollar**, Computers & Electronics, and the small-business category. Reporting objectives are leads and website traffic; all optional account data-sharing boxes are off. Account ID: `410491039`; property ID: `557166821`. The web stream **Catalyst Innovations Website**, URL `https://mycatalystinnovations.com`, has stream ID `15974916158` and measurement ID `G-X1CZXDD7JC` (Google tag alias `GT-M63CVZ7T`).

Verified provider settings:

- Enhanced measurement is off after reopening the saved stream, with zero connected site tags. The Google tag's destination diagram lists only Catalyst's GA4 stream.
- Google signals and property-level user-provided data collection are off. Granular location/device collection is off. Advertising personalization is allowed in **0 of 307 regions**.
- At Google-tag level, history page views, scrolls, outbound clicks, forms, video and downloads were disabled and saved. User-provided data capabilities and automatic detection were disabled and saved; reopening confirmed the capability remains unchecked. Email data redaction remains on as an additional safeguard, not a substitute for source sanitization.
- Six event-scoped reporting dimensions are saved: `entry_source`, `tool`, `industry`, `demo`, `action` and `source`. They use only predefined website labels. No answers, contact details or entered calculator figures are dimensions.
- No advertising destination or extra website tag was installed, no subscriptions purchased, and Outlook was not changed.

For the approved release, only `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_GA_MANUAL_TRACKING_VERIFIED` were saved to the actual DigitalOcean web service; existing settings and secrets were preserved. The deployed ID is `G-X1CZXDD7JC` and its review gate is true. These Google values are public configuration, not account credentials. The local `.env.local` still has an empty ID and false gate to avoid localhost activity, including previously saved consent. Do not replace the live app spec with the starter template.

Production evidence so far:

- **Search Console:** HTML-tag ownership verified for `https://mycatalystinnovations.com/`. Sitemap submission was accepted. A live sitemap URL test reported **URL is available to Google** on October 3, but the sitemap row still shows **Couldn't fetch**, including after one accepted resubmission. No further retry was made; successful sitemap processing remains unconfirmed. URL inspection reports the homepage, `/pricing` and `/solutions` indexed; `/industries/plumbing` and `/tools/manual-work` are unknown to Google. This is a sample, not a complete index count or evidence that the release improved rankings.
- **GA4 Realtime:** the latest display shows two controlled test users, four `page_view` events for `/`, `/tools`, `/consultation` and `/tools/manual-work`, two `demo_interaction` events, one `form_start`, one `first_visit` and one `session_start`. Withdrawal removed GA cookies during QA; the two reported users are not evidence of two customers. Reporting delay explains the updated counts. A calculator sample input of 100 was entered and cleared, but receipt of `roi_calculator_used` is not yet confirmed. No real inquiry was submitted. Receipt of every intended interaction or delivered-inquiry event has not been verified.
- **Live consent UI/DOM:** no Google script before consent; decline plus reload showed none; acceptance loaded the correct measurement-ID script; withdrawal switched analytics off, reloaded, and left no Google script after further navigation. The browser tool did not expose raw network payloads, so this does not establish complete payload inspection or zero network requests.
- **Prior isolated evidence:** 11 focused analytics tests passed using mocks, and the actual-component fixture passed sanitization, route-view deduplication, decline and loaded/delayed-tag withdrawal checks without external traffic. These do not replace live payload inspection.
- **Public HTTP and crawl:** 71/71 sitemap pages passed the live crawler, along with four redirects, five unknown-route 404/noindex checks, portal/robots checks and health HTTP 200. Sitemap GET and HEAD returned HTTP 200 with XML containing 71 URLs for both normal and Googlebot-labelled requests. These successful checks do not override Search Console's unresolved sitemap-processing status.

Search Console sitemap processing, broader provider-event verification, complete live payload inspection and representative reporting baselines remain open.

| Baseline item | Current status |
| --- | --- |
| Search Console ownership | Verified HTTPS URL-prefix property using the HTML tag |
| Sitemap and indexing | Live fetch/crawl and Google's live URL test passed; sitemap row still Couldn't fetch after one resubmission. Three inspected URLs indexed, two unknown; full index count pending |
| Search queries, impressions, clicks and position | Representative baseline pending; unavailable is not zero |
| GA4 property, stream, timezone and currency | Created as Catalyst Innovations, Eastern/USD, one web stream |
| Enhanced measurement and advertising settings | Verified off; reviewed Google configuration deployed |
| Visitor and inquiry reporting | QA events received as listed above; customer baseline and delivered-inquiry verification pending |
| Consent acceptance, decline and withdrawal | Live UI/DOM checks passed; complete live network/payload inspection not performed |

Existing Ubersuggest estimates are recorded separately in `seo-keyword-map-2026-10-02.md`; they are not a substitute for observed Google reporting. Do not classify email-draft actions or booking-link clicks as confirmed leads.

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

Analytics represents only visitors who opt in and whose browsers permit requests. It does not establish total traffic, rankings, leads sent through external email, or completed appointments. GA4 may generate its normal session/engagement bookkeeping after opt-in; the manual controls govern page views and the reviewed website interactions. Referrer URLs and campaign/query values are deliberately omitted. Standard GA channel attribution will therefore be incomplete; use the coarse `entry_source` dimension for search-engine referral comparisons and Search Console for actual organic search queries/impressions. A recognized search-engine referrer is a referral category, not proof that the click was organic rather than paid.

Automated tests cover sanitization, route allowlisting, source categorization, consent changes, pre-consent event dropping, pageview deduplication, provider gating, blocked storage, and revocation of pending/loaded transports. Production has confirmed the limited event receipt and consent-script behavior above. Complete live payload inspection and verification of the remaining interactions are still pending.

References: [Google pageview controls](https://developers.google.com/analytics/devguides/collection/ga4/views), [Google configuration fields](https://developers.google.com/analytics/devguides/collection/ga4/reference/config), [Plausible Events API](https://plausible.io/docs/events-api).
