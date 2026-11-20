# Native Blog editor: release evidence

Verified November 20, 2026 against the main website source `DVass81/catalyst-innovations`, base `f09f376fdcc8e9e015ac24e59f3a7a0d2397ba27`, isolated branch `codex/native-blog-editor`.

## Result

The native paste, preview and publication implementation is complete and tested locally. It uses the existing website framework, GitHub source and DigitalOcean deployment. Sanity is not required. **Production publishing is not activated and the live website has not been changed.** Both the GitHub connector and CLI report read-only permission on Daniel’s source repository.

- `npm test`: **175 passed, zero failed**. Includes real scrypt/HMAC authentication, session expiry/rotation, same-origin enforcement, bounded requests, unauthorized reads/writes, shared text rendering, strict published catalog validation, preview fingerprints, conflict handling, idempotent retries and queued-only acknowledgements. The actual editor handlers are exercised using real validation and Web Crypto with mocked network requests.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed after final product changes; 102 static pages generated, private editor and both publishing API routes dynamic.
- `git diff --check`: passed.
- No paid services, real GitHub article writes or production deployments were performed.

## Chrome checks

Used browser-scoped Chrome automation. Verified real local sign-in and sign-out, form and preview at 320, 390, 768 and 1440 CSS pixels, and no horizontal control/page overflow at those widths. Editing the title removed the previous preview and kept Publish disabled. With the publishing token absent, the editor kept pasted text, displayed the catalog error and prevented publication.

A temporary **local-only** article verified the public reading page, complete body text, paragraph/list formatting, safe source links, one H1, matching contents anchors, canonical address and absence of empty legacy example/source boxes. Its source was restored to `[]` before final tests and build. No sample post is included in this release.

Confirmed editor HTML `noindex,nofollow`, and signed-out page returned the password form. RSS, sitemap, post metadata and social-image behavior have automated integration coverage. The local screenshot is retained outside the repository at `C:/Projects/Websites/work/native-blog-editor-2026-11-20/editor-phone.jpg`; the final test log is beside it. The temporary local server was stopped after testing.

Initial Turbopack development-cache issues were resolved by clearing only this clone’s generated `.next` directory and running a clean build. Browser checks used the clean webpack development server. The final Turbopack production build passes. A pre-existing development-only logo LCP hint was observed; no new production performance measurement was performed.

## Remaining release gate

Daniel needs to review/merge the code, configure the restricted GitHub publishing token and private editor secrets on the existing DigitalOcean app, and approve the first actual article. Then observe a real publication commit, successful deployment and public article/feed/sitemap before describing publication as live. Login rate limiting is per process; inspect host IP trust and existing edge protection before wider access. See `native-blog-publishing.md` for exact activation and operational limits.

The SEO Engine planning report is `native-blog-seo-plan.json`. It deliberately records performance as unmeasured and does not claim SEO-ready status. Existing public schema and canonical paths are preserved; private editor routes remain outside the sitemap.

## Repository transfer follow-up — November 20, 2026

The initial verification above is preserved as the pre-transfer snapshot. A later GitHub inspection confirmed the canonical source is now `My-Catalyst-Innovations/catalyst-innovations`, with Josh's administrator access. The prepared publisher and deployment template now use that organization-owned repository. Requests intentionally reject redirects, so this explicit target update is required after the transfer.

After the target correction, `npm test` passed all 175 tests, `npm run lint` passed, `npm run typecheck` passed, and `git diff --check` passed. The local default `npm run build` remained at “Creating an optimized production build” without further output for several minutes and was stopped. No generated files were deleted and no compiler configuration was changed. The earlier successful build above is historical evidence, not a successful build of this follow-up. A fresh successful default build is still required before release.

The existing Lighthouse CI workflow now also audits `/blog` and the signed-out `/blog/editor`, without editor credentials. Its existing thresholds, permissions and upload settings are unchanged. No new CI build or Lighthouse report has yet been observed for this follow-up.

Production activation remains pending: verify the canonical GitHub connection on the existing DigitalOcean application, configure the restricted publishing token and private editor runtime settings, and complete the live publication checks in `native-blog-publishing.md`. No actual article has been supplied or published. Keep `native-blog-seo-plan.json` performance status pending until production-like measurements are recorded. Lighthouse can provide laboratory LCP, CLS and a responsiveness proxy; it does not establish field INP or field Core Web Vitals.
