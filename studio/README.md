# Catalyst Blog Editor

This separate Sanity Studio is prepared for Daniel and Josh. **Configuration and deployment must be verified before describing the editor as connected.** This package itself creates no account, project, subscription, token or DigitalOcean service. The actual Blog lives at `/blog`; the eight existing practical Guides remain independent at `/insights` and are not Blog seed content.

The browser editor provides draft autosave, plain-text article fields, an in-editor reading preview, optional service/calculator choices, research-source management, current-version approval and copyable promotion drafts. Aim for about 600–1,000 useful words (roughly 3–5 minutes); this is an editorial warning, not a reason to pad a short approved post. Sanity supplies authenticated login, separate manual Publish/Unpublish, duplicate and history controls. Retention follows the selected plan; no particular history period is promised.

## When you are ready

1. Daniel or Josh signs in to Sanity and creates a **Free** project, or selects an existing appropriate project. Review Sanity's terms personally. Do not enable a paid plan, trial-dependent feature, scheduler or private dataset for this setup.
2. Create the `production` **public dataset**. Published blog articles are public marketing content. Sanity protects unpublished draft documents from anonymous dataset reads; Studio access requires invited user authentication. This is a private authenticated editor, not a paid private dataset.
3. Invite both partners to the project. At preparation time the Free plan supports Administrator and Viewer roles; both partners need Administrator to write and publish on Free. Administrators can also manage project access. Review current plan limits before activation.
4. Use Node **22.12 or later** (Node 24 is suitable) and the pinned pnpm version. Run `pnpm install --frozen-lockfile` inside `studio/` once the checked-in lockfile is available. This package is separate from the website's npm build and runtime. Keep `pnpm-lock.yaml`; do not mix package-manager lockfiles.
5. Copy `.env.example` to `.env.local`; enter the real public project ID, dataset and **Josh's actual Sanity Google sign-in email** as `SANITY_STUDIO_APPROVER_EMAIL`. This identity configuration is public, not a password. No API token belongs here. `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET` are supported fallbacks.
6. Run `pnpm run typecheck`, `pnpm run build`, and `pnpm run dev`. Sign in as an invited partner and check the schema, preview and publish validation using a clearly labeled draft. Josh must use his own Google sign-in to approve a version.
7. Deploy with `pnpm run deploy` in an authorized local Sanity session. Choose a Sanity-hosted `*.sanity.studio` address and record its application ID if prompted. Hosting Studio here requires no new DigitalOcean application. Do not select a paid upgrade or purchase extra usage. Register only the exact Studio and development origins required by Sanity; use credentialed CORS for the real editor origins, never a credentialed wildcard.
8. Give the website its reviewed hosted Studio URL and matching public project/dataset identifiers using the main website's documented configuration. Keep the public editor link hidden until this is verified. The website reads only the `published` perspective; it never receives a write token.
9. Verify a draft is absent from the public website and anonymous API, then publish a reviewed article and verify the public article, metadata and cache refresh. Test with each partner's own login. Do not use shared passwords.

Sanity Studio configuration, schema and uploaded asset URLs are public browser resources. **Never embed a token or upload customer records, private screenshots, credentials, operational documents or unapproved client assets.** A public asset URL can be opened even while its article is a draft.

## Import only explicitly selected new Blog drafts

Do **not** import the existing eight Guides into the actual Blog. They remain static `/insights/` content. A Blog with no approved published posts stays empty; it never substitutes a Guide or an invented replacement post. For explicitly selected new Blog material, prepare a local JSON array or NDJSON file in the documented article shape. Do not evaluate arbitrary imported JavaScript or include private records.

```text
pnpm run prepare-import path/to/articles.json path/to/catalyst-drafts.ndjson
```

The preparation command runs locally, needs no dependencies, makes no network requests and only writes a **new** output file. It uses stable IDs/array keys, preserves existing section anchors, translates numeric source positions to stable `sourceKey` values and creates drafts with unchecked editorial-review fields. It never publishes or certifies a review.

After verifying the project/dataset in the CLI, import the prepared file manually using the authenticated Sanity CLI:

```text
pnpm exec sanity dataset import path/to/catalyst-drafts.ndjson production
```

Import into the intended project only. Do not add `--replace`, overwrite documents, or run repeated imports without reviewing their effect. Review each imported draft in Studio before using Publish. Sanity removes the `drafts.` prefix at publication; the underlying `blog-<slug>` ID contains no dots and is readable as published public content.

## Write → preview → publish → share

- Use the **Write** pane and its groups to write the article, select existing related destinations, and add authoritative HTTPS sources. All article text is rendered as text; arbitrary HTML, scripts, raw embeds and private-record connections are not supported.
- Use **Preview** to read the unpublished text and check a narrow reading layout. This is an authenticated local editor pane, not a public draft URL or an exact browser screenshot of the final website. Website navigation, related-tool cards and optional cover imagery should also be checked on the final page.
- Complete **Review before publishing** after checking the current draft, including all numerical claims. Any statistics need original references, a research/data date, methodology and relevant context. The checklist is an attestation, not an automatic fact checker.
- **Josh approves this exact version.** Signed into the configured reviewer account, Josh uses **Approve this version (Josh)**. The editor records a SHA-256 fingerprint of the visible content, source/evidence records, dates, links and image reference. The document validator blocks Publish when that approval is missing or stale. Meaningful content changes require a fresh review and approval. Promotion-copy edits are separate and do not change the article fingerprint.
- **Publishing is separate.** Use Sanity's built-in Publish only after current approval is recorded. Autosave and Approve this version never publish. There is no automatic publishing, posting or paid scheduler.
- Use **Share drafts** after publishing. Check the public page before copying a link or draft. Copying text does not send email or publish to LinkedIn, Facebook or another account. Choose approved destinations and recipients manually. Promotion fields remain drafts; do not enter private information in them.
- Keep a published slug stable. Ask for a redirect before changing one. `/blog/editor` is reserved. The CMS Blog catalog is authoritative: an unconfigured or empty Blog stays empty rather than restoring static Guides. Permanent redirects require a website change.

## What the Free-plan approval does and does not enforce

The Studio approval action checks the signed-in account email against the configured Josh account. A second SHA-256 check in the public reader rejects changed or unapproved content, even if it was mistakenly published. Approval metadata returned to the website excludes email addresses and is not rendered as public author identity.

This is a **manual approval workflow with a current-content attestation**. Free-plan Administrators control the project, schema and API; they can bypass Studio controls outside this interface. It is not tamper-proof two-person authorization or separate author/publisher permissions. Do not claim otherwise or automatically upgrade to obtain additional roles.

## Echo and the browser workflow

1. Echo can research and prepare a new factual Blog draft and source notes. No statistic, founder story or customer outcome is invented. Existing Guides are left alone.
2. Daniel and Josh review the text and preview. Numerical research claims must have source, reference date, method and scope; a post can contain no statistics when none are warranted.
3. Josh signs into Studio using his own Google account, completes the review checks and explicitly selects **Approve this version (Josh)**.
4. After Josh approves the exact current version, **Josh or Echo in an authorized signed-in session** can select **Publish** as a separate step. Echo can carry out this publication after Josh's explicit instruction; it does not need to edit website code. It must not approve an unseen version on Josh's behalf, auto-publish through a stored token, or treat approval of one post as permission for future posts.
5. After publication, Echo can check the public `/blog/` page, metadata and links and prepare channel-specific sharing copy. Copy buttons send nothing. Social posting or email delivery still needs the intended business account/recipient and authorization.

New article sections use their stable Sanity `_key` as the public anchor unless a legacy `id` exists. Section `sourceKey` points to a stable `_key` within `sources`, so reordering references does not change their meaning. The website adapter maps that key back to the article template's numeric source reference. Keep the fixed options in `schema/options.ts` synchronized with real website destinations.

## Verification before activation

- No write/read API token appears in browser bundles or configuration.
- Drafts and unpublished changes never appear in public article, sitemap or share metadata responses.
- Both invited partners can create, preview, duplicate and explicitly publish; an unrelated account cannot edit.
- Missing required fields, invalid dates, an unchecked review and broken source references block publication.
- Missing/stale Josh approval blocks publication; changing an approved source, statistic, title, body or image requires approval again.
- Short/long posts show the 600–1,000-word guidance without forcing filler. Service links are optional.
- Cover images have meaningful alt text and permission for public use.
- Publication appears after the website's bounded cache refresh; changing text does not require a website deployment.
- Social/email copy is accurate and all external publication remains manual.

## Official references (checked 2026-10-30)

- [Studio deployment](https://www.sanity.io/docs/studio/deployment)
- [Studio system requirements](https://www.sanity.io/docs/studio/system-requirements)
- [Dataset and draft security; public assets](https://www.sanity.io/docs/content-lake/keeping-your-data-safe)
- [Published and draft query perspectives](https://www.sanity.io/docs/content-lake/perspectives)
- [Current plan limits and pricing](https://www.sanity.io/pricing)

No website appearance, calculator formula, inquiry API, booking setting or pricing term is changed by this isolated package.
