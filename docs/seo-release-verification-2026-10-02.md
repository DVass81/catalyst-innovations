# SEO release verification — updated 2026-10-03

Status: approved commit **`0999693` is deployed** on DigitalOcean deployment `d5d101c7-e169-4b93-8899-7ac0adbb28d6`; the dashboard shows **Healthy/Success, Live Deployment**. Public HTTP checks and the production crawl passed. This record distinguishes prior local checks from production evidence; Search Console sitemap processing and reporting baselines remain unresolved.

## Prior local checks

- Production build: **93 routes**. **56 tests passed**; full ESLint and TypeScript checks passed.
- Sitemap crawl: **71/71 pages passed**. Unique titles/descriptions, matching canonical and social metadata, working social images, meaningful server-rendered headings/content and parseable JSON-LD. Four permanent redirects, five unknown-route 404/noindex responses, portal noindex and robots rules passed. Details: `seo-crawl-verification.json` and `seo-crawl-verification.md`.
- Browser checks: no horizontal overflow on the inspected guide at 390px phone and 768px tablet widths. A no-JavaScript pricing proxy showed all prices, zero hidden cards and zero scripts. Homepage industry switching updated manufacturing problems and recommendations; calculator search and plumbing filtering retained the industry context in links. No console errors were observed on the normal preview.
- Consent: keyboard accept, decline and withdrawal checked with actual components in the local `3196` fixture, including loaded and delayed analytics. No external traffic was sent. Safe page/query handling retained only the allowed `source` value from the tested sensitive query/form payload; page views were recorded once per route, not for query-only changes. Real analytics remains disabled in local previews.
- Hero: simulated 3G plus Save-Data used manual play, with no film source before Play. The selected mobile rendition is **960 × 540, 1,293,455 bytes**, versus **6,576,422 bytes** for desktop. Manual pause survived a connection change. Reduced motion retained the still image with no film source or playback buttons. A simulated media HTTP 503 preserved the poster fallback.
- Browser bundles: calculator field definitions are absent from the homepage and tools-page initial chunks. Combined changes reduced uncompressed initial JavaScript from 573,048 to 568,058 bytes on home and from 550,098 to 544,294 bytes on tools. These totals include all changes and do not isolate one optimization.

## Production evidence — October 3

- Only the three public Google settings—Search Console verification, GA4 ID and manual-tracking review gate—were saved to the actual web service. Existing settings and secrets were preserved. The approved deployment is live; the template was not used to replace the full app configuration.
- The live crawler passed **71/71 sitemap pages**, four redirects, five unknown-route 404/noindex checks and portal/robots checks; health returned HTTP 200. Sitemap GET and HEAD returned HTTP 200 with 71-URL XML for normal and Googlebot-labelled requests.
- Search Console HTML-tag ownership is verified. Its live sitemap URL test reported **URL is available to Google** on October 3. The sitemap submission was accepted, but the row still shows **Couldn't fetch** after one accepted resubmission; no further retry was made. Successful processing remains unconfirmed. URL inspection reports `/`, `/pricing` and `/solutions` indexed, while `/industries/plumbing` and `/tools/manual-work` are unknown to Google. These checks do not establish a complete index count or improved rankings.
- The latest GA4 Realtime display shows **two test users, four page views** (`/`, `/tools`, `/consultation`, `/tools/manual-work`), **two demo interactions**, **one form start**, one `first_visit` and one `session_start`. Withdrawal removed GA cookies during QA, and reporting delay explains the updated counts; these are not customer-traffic metrics. A calculator sample input of 100 was entered and cleared, but `roi_calculator_used` receipt is not yet confirmed. No real inquiry was submitted, and the remaining intended interactions have not all been verified.
- Live consent UI/DOM checks found no Google script before consent or after decline/reload. Acceptance loaded the correct script; withdrawal changed the choice to off, reloaded, and left no Google script after navigation. Raw network payloads were not available through the browser tool, so full live payload inspection and zero-request claims are not established.
- Search Console sitemap processing and representative Google reporting baselines remain pending. Provider settings and detailed evidence are in `analytics-verification.md`.

## Mobile performance

Three comparable local Lighthouse **13.0.1** mobile runs are saved in workspace `work/seo-lighthouse-final-{1,2,3}.json`.

| Run | Performance | LCP | CLS | SEO | Accessibility | Best practices |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 94 | 2.821 s | 0.073 | 100 | 100 | 100 |
| 2 | 93 | 2.904 s | 0 | 100 | 100 | 100 |
| 3 | 88 | 2.920 s | 0 | 100 | 100 | 100 |

Median LCP is **2.904 seconds**, so the **2.5-second target remains unmet**. Maximum CLS is **0.073**, below the **0.1 target**. These are local simulated measurements, not field Core Web Vitals. Automated accessibility scores do not establish complete accessibility compliance.

A final button-label accessibility adjustment followed these three runs. The focused final Lighthouse accessibility audit scored **100**, with the label-content-name check passing and no failed audits. Its report is `work/seo-lighthouse-accessibility-final.json`; the performance measurements above predate that label-only adjustment.

## Open dependencies and limits

- Google setup uses Daniel's approved existing account; no new Google account or Outlook change was made. GA4 is configured with Eastern time/USD. Enhanced measurement, tag-level automatic interaction/contact-data detection, Google signals, granular location/device collection, optional account sharing and advertising personalization are off. Six predefined reporting dimensions are registered. Complete live payload inspection, remaining event receipt, delivered-inquiry validation and customer reporting baselines remain open.
- Resolve Search Console's sitemap-processing status and measure production mobile performance. The passing live fetch/crawl and three indexed URL results do not demonstrate a release-caused ranking or indexing improvement. Existing Ubersuggest estimates remain separate from observed Google data.
- Further mobile LCP improvement needs measured changes that preserve the approved design. Remaining framework JavaScript and render-critical CSS are candidates for investigation, not proven causes from these scores alone.
- Optional ErrorMonitoring diagnostics remain outside the analytics consent flow and are not enabled. Review their behavior and consent requirements before enabling them.

Production analytics QA events were sent and received as listed above; no real inquiry was submitted. This document records existing evidence, with no additional verification runs performed to write it.
