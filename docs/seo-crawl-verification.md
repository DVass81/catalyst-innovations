# SEO crawl verification

Run: 2026-10-02T23:46:18.791Z on http://127.0.0.1:3111.

Result: **PASS**. 71/71 sitemap pages passed their individual checks.

- Every sitemap page: HTTP 200, matching canonical and OpenGraph URL, matching search/OpenGraph/Twitter titles and descriptions, matching social images, one meaningful H1, at least 25 words in server-rendered main content, and parseable JSON-LD with a type or graph.
- Unique titles: PASS; unique descriptions: PASS.
- Social image responses: 9/9 passed.
- Permanent redirects: 4/4 passed.
- Unknown routes: 5/5 returned HTTP 404 with noindex.
- Public portal: PASS (HTTP 200, noindex, crawl allowed). Robots/API/sitemap checks: PASS.

## Initial JavaScript

| Route | Prior build bytes | Current bytes | Difference | Calculator-definition chunks remaining |
| --- | ---: | ---: | ---: | ---: |
| / | 573048 | 568058 | -4990 | 0 |
| /tools | 550098 | 544294 | -5804 | 0 |

Values are uncompressed initial JavaScript from Next build diagnostics. The prior build predates the combined SEO/analytics/content changes, so the overall difference is not attributable to one change. Absence of calculator field strings checks the intended IndustrySelector/ToolLibrary boundary reduction. This is not a mobile performance score.

## Limits

This checks raw responses from the local production build; browser interaction, actual indexing, real-user performance and rich-result eligibility are separate checks. Parseable JSON-LD is not a guarantee of search-engine eligibility. No production traffic, forms or analytics events were sent.
