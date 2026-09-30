# Redesign preview handoff

Branch: `redesign/clearer-catalyst`. Local preview: http://127.0.0.1:3100.
The DigitalOcean deployment and main branch have not been changed.

## Delivered

- Original cream, navy and Catalyst blue homepage with clear service copy.
- Accessible 12-second workflow story with play, pause and replay; a static reduced-motion view; short progressive section reveals.
- 19 industry pages and refreshed solutions, About, portfolio, contact and pricing pages. Existing prices, terms and guarantees retained.
- 24 browser-only calculators with empty initial inputs, optional examples, industry and problem filtering, printable styling, formula explanations and optional inquiry attachments.
- Four required inquiry fields; industry and phone optional. Existing delivery integrations, validation, rate limiting and old submission compatibility retained.
- Client names, logos and links excluded. Three anonymous project summaries distinguish built work from planned work.
- Permanent redirects from `/start` and `/roi-estimator`; updated navigation, sitemap and page metadata.
- Desktop/mobile Figma compositions and native 12-second prototype in the linked design file in `redesign-notes.md`.

## Checks completed

- Production build on Next.js 16.3.8 succeeds; 86 generated routes/assets.
- ESLint and TypeScript checks pass.
- Seven automated test groups pass: all 24 formulas against independent examples; blank/zero/invalid/extreme inputs; ROI/payback edge cases; margins/proceeds; industry recommendations; old/new inquiry schemas; mocked delivery successes and failures, including missing production configuration.
- All 66 sitemap pages return successful responses and contain titles/descriptions. Internal route crawl found no broken pages. Both legacy redirects return HTTP 308 to `/tools/project-roi`.
- Browser checks at phone, tablet and desktop sizes; search/filtering, industry switching, example loading, explicit attachment and inquiry context, keyboard menu dismissal, animation play/pause/replay. No observed browser console warnings/errors on the tested homepage.
- Lighthouse 13.0.1 mobile simulation, Chrome on Windows, local production server: repeated homepage LCP 2.38 and 2.37 seconds, CLS 0, performance 98/100 and automated accessibility 100/100 after fixes. Inquiry and calculator accessibility 100/100. These are local lab measurements, not production field guarantees.
- Two audit runs wrote complete reports but returned a Windows temporary-folder cleanup warning afterward; their report runtime errors were null. Subsequent homepage and inquiry runs exited cleanly.
- Existing framework security fixes applied with compatible dependency updates. Package audit reports zero known vulnerabilities at verification time.

## Limits and launch handoff

- No real inquiry emails or webhook test messages were sent. The preview has no delivery credentials; production mode correctly returns an error rather than claiming delivery. Verify the real configured provider during the separately approved deployment.
- Set the real `NEXT_PUBLIC_SITE_URL` before deployment. The checked-in DigitalOcean example currently uses a placeholder domain; live dashboard configuration was not changed.
- Printable CSS and shared result data are implemented. Native print-dialog/PDF rendering and an actual OS reduced-motion setting were not exercised in this environment. Review these on the final deployment browser; automated accessibility scores do not replace assistive-technology testing.
- The existing recreated Catalyst mark is a preview asset. Official artwork can replace it without holding up review.
- Higgsfield video was not generated: the preflight estimate was 54 credits versus 9.49 available. No credits were spent. The functional website uses native motion and has no video dependency.

## Continue development

From this repository, use `npm ci`, then `npm run dev` for development. Use `npm test`, `npm run lint`, `npm run typecheck` and `npm run build` for checks. To restart this production preview after a build, run `npm run start -- --hostname 127.0.0.1 --port 3100`.

Review this branch before merging. Pushing changes to main triggers the existing DigitalOcean deployment.
