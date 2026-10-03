# SEO release verification — 2026-10-02

Status: reviewed local production preview at `http://127.0.0.1:3111`, branch `redesign/clearer-catalyst`. Changes are **unpushed and not deployed**. This record combines the completed checks below; it does not establish production behavior, indexing or rankings.

## Completed checks

- Production build: **93 routes**. **56 tests passed**; full ESLint and TypeScript checks passed.
- Sitemap crawl: **71/71 pages passed**. Unique titles/descriptions, matching canonical and social metadata, working social images, meaningful server-rendered headings/content and parseable JSON-LD. Four permanent redirects, five unknown-route 404/noindex responses, portal noindex and robots rules passed. Details: `seo-crawl-verification.json` and `seo-crawl-verification.md`.
- Browser checks: no horizontal overflow on the inspected guide at 390px phone and 768px tablet widths. A no-JavaScript pricing proxy showed all prices, zero hidden cards and zero scripts. Homepage industry switching updated manufacturing problems and recommendations; calculator search and plumbing filtering retained the industry context in links. No console errors were observed on the normal preview.
- Consent: keyboard accept, decline and withdrawal checked with actual components in the local `3196` fixture, including loaded and delayed analytics. No external traffic was sent. Safe page/query handling retained only the allowed `source` value from the tested sensitive query/form payload; page views were recorded once per route, not for query-only changes. No live analytics provider is enabled.
- Hero: simulated 3G plus Save-Data used manual play, with no film source before Play. The selected mobile rendition is **960 × 540, 1,293,455 bytes**, versus **6,576,422 bytes** for desktop. Manual pause survived a connection change. Reduced motion retained the still image with no film source or playback buttons. A simulated media HTTP 503 preserved the poster fallback.
- Browser bundles: calculator field definitions are absent from the homepage and tools-page initial chunks. Combined changes reduced uncompressed initial JavaScript from 573,048 to 568,058 bytes on home and from 550,098 to 544,294 bytes on tools. These totals include all changes and do not isolate one optimization.

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

- Use Daniel’s approved existing Google account; do not create another Google account or change Outlook. Google recognizes that account, and Daniel must complete sign-in/security checks. Search Console ownership verification, sitemap submission and actual GA visits/leads remain unverified. Analytics configuration fails closed and stays disabled until configured and consented.
- Push and deploy the reviewed changes, then verify the actual production domain, crawl responses, consent behavior and mobile performance. Neither ranking improvements nor indexing have been demonstrated. Existing Ubersuggest baseline records remain separate from these local checks.
- Further mobile LCP improvement needs measured changes that preserve the approved design. Remaining framework JavaScript and render-critical CSS are candidates for investigation, not proven causes from these scores alone.
- Optional ErrorMonitoring diagnostics remain outside the analytics consent flow and are not enabled. Review their behavior and consent requirements before enabling them.

No production inquiries, bookings or analytics events were sent during these checks. This document records existing evidence; no additional verification runs were performed to write it.
