# SEO improvements — October 12, 2026

Daniel authorized the recommended website improvements and publication when ready. Preserve the approved design, film, calculator formulas, prices, APIs, booking destination, honest startup positioning and analytics consent controls. No paid tools, hosting changes or fabricated customer results.

## Search baseline observed before this release

Google Search Console was inspected through the existing verified HTTPS property and approved Google account. The Web Performance report's available data covers September 30–October 9, 2026, even with a longer time-range selector. It has no country filter; these are not Tennessee-only figures.

- 443 impressions (search appearances), 14 clicks, 3.2% click-through rate and average position 20.1. Clicks are not unique visitors or delivered inquiries.
- `catalyst innovations`: 18 impressions, 7 clicks, average position 1.8.
- `reorder point calculator`: 27 impressions, zero clicks, average position 12.4.
- `inventory carrying cost calculation`: 3 impressions, zero clicks, average position 13.7.
- `hoa maintenance requests management`: 3 impressions, zero clicks, average position 17.3.
- `process automation consultants`: 6 impressions, zero clicks, average position 83.2.
- `top software developers in knoxville`: 4 impressions, zero clicks, average position 59.3.

The small sample supports testing useful improvements to established URLs, not claiming stable rankings or a first-page deadline. Search Console is the observed Google baseline. Ubersuggest's separate US/English overview retrieved October 12 still reports its September snapshot; it must not be treated as today's live position report.

The Sitemaps report says **Success**, last read October 7, with 76 discovered pages and 3 discovered videos. Discovery is not indexing. The Page Indexing report, last updated October 8, lists 54 indexed URLs across all known pages. Its seven "Crawled - currently not indexed" examples are VTT caption files and social-preview images, not missing service articles. Most alternate-canonical entries are also not evidence of a defect. The 27 "Discovered - currently not indexed" examples include all 19 industry destinations, `/insights`, the manufacturing-spreadsheets guide, supply-chain solution, `/tools` and four calculators. Check useful destinations individually before requesting indexing; do not indiscriminately submit assets or repeatedly submit unchanged URLs.

Google reports: [Performance](https://search.google.com/search-console/performance/search-analytics?resource_id=https%3A%2F%2Fmycatalystinnovations.com%2F), [Sitemaps](https://search.google.com/search-console/sitemaps?resource_id=https%3A%2F%2Fmycatalystinnovations.com%2F), [Indexing](https://search.google.com/search-console/index?resource_id=https%3A%2F%2Fmycatalystinnovations.com%2F).

The October 12 individual inspection of `/industries/hoa` confirms "Discovered - currently not indexed." Google's live test succeeds with **URL is available to Google / Page can be indexed** and one valid breadcrumb item. This is crawl eligibility, not indexing or ranking. A crawl request will be made once after the website release.

## Website changes

- Reorder Point Calculator: a clear visible heading and matching search metadata; practical guidance on demand, lead time, reorder thresholds versus order quantity, and reviewing stock/open orders/reservations; a purchasing-software connection and source reference. Formula, blank inputs and optional example remain unchanged.
- All calculators: correct the blanket USD statement so money and nonmoney units match each tool. Keep the existing browser-only calculation and explicit attachment choice.
- HOA guide: a reusable request template, proposed role-based handoffs, useful related guides and clearer search presentation. Verified public-sample intake/review remains distinct from a separately scoped full maintenance implementation.
- Sitemap: include the calculator's genuine content-modification date; the HOA article's existing modification-date handling reflects this revision. Do not mark unchanged content as newly written.

This uses Google's guidance on [accurate last-modification dates](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) and [requesting recrawls](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl). An accepted request does not guarantee indexing or a specific completion time.

## Promotion and dependencies

The reviewed handoff is `../../seo-promotion-oct12.html`: three actual-demo posts for Josh, company/process copy and researched Tennessee promotion actions. The existing LinkedIn page is `https://www.linkedin.com/company/catalyst-innovations-llc`; Daniel confirmed Josh manages it and Daniel has no access. Automatic approval review stopped opening LinkedIn sign-in before that clarification. No new account, public post or introduction message was created. Google Business Profile verification still requires Daniel's authentic recording. Do not imply that either dependency was completed by this release.

## Verification and publication

The consolidated production build and TypeScript checks passed (99 prerendered pages); full ESLint, all 65 regression tests and whitespace checks passed. The local production crawl on port 3121 passed all 77 sitemap URLs, unique titles/descriptions, matching canonical/social metadata, images, nine demo-media assets, four redirects, six missing-page responses and portal/robots behavior. No real inquiry or appointment was submitted.

Browser checks confirm the blank-input calculator, its optional 20 × 7 + 50 = 190-unit example and reset, keyboard Enter/Tab through the new native details, no console errors, readable phone/tablet content with no horizontal overflow, and the preserved homepage/Services navigation and three public demo links. Server-rendered content and existing reduced-motion/playback tests passed; the browser did not emulate a reduced-motion preference.

The retained Tailwind scan exclusion makes transferred homepage CSS **22.3% smaller** (29,661 → 23,037 bytes), with no active class candidates removed. Three candidate mobile Lighthouse runs had 100 accessibility/SEO/best-practices and CLS 0. Median LCP was **2.971 seconds**, compared with a **2.908-second** baseline, so this does **not** demonstrate a timing win or reach the 2.5-second target. See `mobile-performance-2026-10-12.md` for all six runs and host-activity limitations. Direct HTTPS has no redirects; keep the required HTTP-to-HTTPS redirect.

Daniel authorized pushing and deploying after these checks. Publication and post-release Google requests are the next delivery actions. Search-result changes must be assessed in later comparable reporting windows; deployment alone does not establish ranking improvement.
