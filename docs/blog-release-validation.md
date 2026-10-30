# Blog release validation

Prepared October 30, 2026 on `feature/blog-and-guides`, based on `0587570` from main. Preview: http://127.0.0.1:3130/insights.

## Included

- Blog header/footer links, homepage highlights, a featured guide and local search/topic filters over the eight existing articles.
- Preserved article addresses, a permanent `/blog` shortcut, article-specific social images, RSS with autodiscovery, sitemap and public article metadata.
- Copy, LinkedIn and email sharing controls. Controls prepare links/drafts; they do not automatically publish or send.
- Consent-controlled article and campaign labels, with published article context carried into inquiries. Existing separate ad-measurement consent remains intact.
- Optional isolated publishing integration, disabled until configured. The private editor account setup, dependency installation, full Studio build and hosting remain deferred at Daniel's request. No account or paid service was created.

## Checks

- All **113 automated tests passed**: calculator/inquiry regression checks, published-content validation, sharing URL safety, article attribution, consent withdrawal, draft versus delivered lead outcomes, and server rendering.
- ESLint, TypeScript and the production build passed. The main website build does not install or compile the deferred Studio package.
- Local production crawl: **77/77 sitemap pages passed**, with correct canonical/social metadata, visible server-rendered content, valid structured-data syntax, working social images, redirects and missing-page responses. Details are in `seo-crawl-verification.json` and `seo-crawl-verification.md`.
- Browser checks covered desktop, 1024px tablet and 390px phone widths. Search, empty results, clearing filters, topic selection, article navigation, mobile menu and Escape dismissal worked. No horizontal page overflow was observed.
- Copied and LinkedIn links contained the correct public article URL and fixed attribution labels. The article inquiry link displayed the correct guide and existing industry/demo context. No inquiry was submitted and no social post or email was sent.
- RSS discovery, the `/blog` redirect, the article social-preview image and browser console were checked in the production preview. No browser errors were reported in the tested flow.

## Delivery boundaries

This is a tested local preview, not a production release. Social-post drafts and operator instructions are in `blog-launch-guide.md`. The optional editor has not been activated. Existing production inquiry-delivery and Analytics provider settings were not changed; automated delivery checks use mocks. New article/campaign labels may need GA4 custom definitions for convenient reporting. These checks do not establish search ranking, traffic growth or live delivery outcomes.
