# Warm working studio: first visual review

This branch begins with the two-page visual review specified in the approved plan: Home and Manufacturing. Other public pages retain their existing layouts until Daniel reviews these previews. The pending Blog/Guides correction is preserved; Sanity account connection remains a separate task.

## Design changes

- The homepage keeps the official logo, approved opening film, headline, supporting message and both main actions. The opening is more compact and the message precedes the film on phones.
- The Catalyst Process stays early. A licensed planning photograph gives context, with an explicit representative label and photographer credit. All four stages remain readable without animation.
- One static connected-work diagram replaces repeated decorative stories. Its approval and completion steps precede downstream work, and it is labeled illustrative.
- Actual application screens and the existing narrated walkthrough player remain. Home presents the first application as a larger feature, followed by two compact examples.
- The founders, industry selector, calculators, FAQs and Maryville-based Chamber membership remain. Discovery prices do not appear on the homepage.
- Manufacturing gains a real workplace photograph, three paired problems and improvements, and an original production diagram including a material shortage/hold. It retains its guide, ERP question, relevant calculators and inquiry context.

These changes are scoped to the pilot components with CSS modules. No inquiry APIs, calculator functions, public demo deployments, booking destinations, contractual prices or analytics permissions change.

## Photography

Sources, licenses and truthful image descriptions are recorded in `studio-media-sources.md`. The two optimized local images total 140,650 bytes. The planning photograph is below the opening and loads lazily; the Manufacturing image is relevant above-page content with explicit dimensions and responsive sizing. Neither photograph is described as Catalyst staff, clients or premises.

`studio-photo-guide.md` lists a short phone-photo session for replacing representative images with approved original Catalyst photography.

## Review and release

Review the homepage and Manufacturing on desktop and phone before extending this direction across Services, Solutions, Industries, About, Method, Blog, Guides, Discovery, contact, tools and legal pages. This preview does not change production.

Working production previews:

- Home: http://127.0.0.1:3132/
- Process section: http://127.0.0.1:3132/#catalyst-process
- Manufacturing: http://127.0.0.1:3132/industries/manufacturing

## Verification completed on October 30, 2026

- All 130 existing tests passed. The industry-content test now renders the actual pilot and continues checking all 19 industries for problem pairs, calculator links, guides and inquiry context.
- Repository lint, TypeScript and production build passed.
- Local production crawl passed all 78 sitemap pages, canonical/social metadata, media, redirects and missing-page checks. See the updated `seo-crawl-verification` reports.
- Desktop, 820-pixel tablet and 390-pixel phone layouts were inspected. The phone and tablet pages have no horizontal overflow; the manufacturing hold branch stays within the phone viewport.
- The phone menu opens with Enter and closes with Escape, returning focus to its trigger. Desktop walkthrough opens on selection, begins playing, pauses the hero and closes with Escape, returning focus to the originating button.
- The film's existing tested controller still supplies pause/replay, visibility handling, reduced-motion and failed-media alternatives. New diagrams are static, and meaningful copy is present in the initial server HTML.
- All application/player assets and fictional/prototype descriptions are retained. Representative-photo labels, sources, list semantics and new-tab announcements were checked.
- A phone heading-spacing issue was corrected before the final build. No real inquiry or appointment was submitted.

The in-app browser's viewport override did not change its layout dimensions, so phone/tablet inspection used the connected Edge browser's working viewport control. That browser's temporary override was reset after testing. Preview screenshots are in the sibling local `outputs/studio-review` folder.

## Mobile performance and accessibility

Three comparable mobile runs were captured per page before and after the pilot. Lighthouse 13.0.1 used Chrome 155, simulated mobile throttling, a 412 × 823 viewport, 4× CPU slowdown, 150 ms network latency and 1,638.4 Kbps throughput. Each run used a fresh Chrome profile and no analytics consent interaction. All samples and traces are retained outside the repository under `work/studio-review`.

| Page | Baseline median LCP | Pilot median LCP | Pilot median performance | CLS |
| --- | ---: | ---: | ---: | ---: |
| Home | 2.271 s | 2.189 s | 99 | 0 |
| Manufacturing | 1.887 s | 2.187 s | 99 | 0 |

Both pilot medians meet the 2.5-second LCP and 0.1 CLS targets. One homepage candidate run measured 2.743 seconds and is retained; the median is not a claim that every run passes. Manufacturing adds meaningful above-page photography and is about 0.30 seconds slower than its baseline. These measurements do not demonstrate a universal speed improvement. Possible test/lint host contention during the baseline is documented with the raw reports.

The initial Manufacturing candidate scored 96 for accessibility because six number labels had insufficient contrast. Their color was corrected from `#8193a2` to `#526878`. Three separate corrected-build runs measured LCP of 2.204, 2.187 and 2.186 seconds; every run scored 100 for accessibility, best practices and technical SEO, with the contrast audit passing and zero measured CLS. The original reports were preserved. Home scored 100 for accessibility, best practices and technical SEO in all three candidate runs; its implementation was unchanged by the Manufacturing-only contrast correction.

Baseline build: `AIRoFG3P4tseDUzjeIL1Z`. Initial candidate: `5QgAACGRrQBN6LZTZkiTb`. Corrected preview build: `zqCjtsXtTwvLVtkuxIYZ-`. These are local laboratory results, not real-user field data, a ranking score or a guarantee of production speed.
