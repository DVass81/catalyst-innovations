# Catalyst Blog Editor — prepared, activation deferred

This separate Sanity Studio is prepared for Daniel and Josh. **It is not configured, deployed or connected to an account yet.** The website's existing articles remain available independently. No account, project, subscription, token or additional DigitalOcean service has been created.

The browser editor provides draft autosave, plain-text article fields, an in-editor reading preview, related service/calculator choices, source management, a content-review checklist and copyable social/email promotion drafts. Sanity supplies authenticated login, manual Publish/Unpublish, duplicate and document history controls. History availability and retention follow the chosen Sanity plan; no particular retention period is promised.

## When you are ready

1. Daniel or Josh signs in to Sanity and creates a **Free** project, or selects an existing appropriate project. Review Sanity's terms personally. Do not enable a paid plan, trial-dependent feature, scheduler or private dataset for this setup.
2. Create the `production` **public dataset**. Published blog articles are public marketing content. Sanity protects unpublished draft documents from anonymous dataset reads; Studio access requires invited user authentication. This is a private authenticated editor, not a paid private dataset.
3. Invite both partners to the project. At preparation time the Free plan supports Administrator and Viewer roles; both partners need Administrator to write and publish on Free. Administrators can also manage project access. Review current plan limits before activation.
4. Use Node **22.12 or later** (Node 24 is suitable), then run `npm install` inside `studio/`. This package is intentionally separate from the website build and runtime. Keep the generated `package-lock.json` when dependencies are installed.
5. Copy `.env.example` to `.env.local`; enter the real public project ID and dataset. Do not add any API token. `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET` are supported fallbacks; the documented `SANITY_STUDIO_*` names are preferred.
6. Run `npm run typecheck`, `npm run build`, and `npm run dev`. Sign in as an invited partner and check the schema, preview and publish validation using a clearly labeled draft.
7. Deploy with `npm run deploy` in an authorized local Sanity session. Choose a Sanity-hosted `*.sanity.studio` address and record its application ID if prompted. Hosting Studio here requires no new DigitalOcean application. Do not select a paid upgrade or purchase extra usage. Register only the exact Studio and development origins required by Sanity; use credentialed CORS for the real editor origins, never a credentialed wildcard.
8. Give the website its reviewed hosted Studio URL and matching public project/dataset identifiers using the main website's documented configuration. Keep the public editor link hidden until this is verified. The website reads only the `published` perspective; it never receives a write token.
9. Verify a draft is absent from the public website and anonymous API, then publish a reviewed article and verify the public article, metadata and cache refresh. Test with each partner's own login. Do not use shared passwords.

Sanity Studio configuration, schema and uploaded asset URLs are public browser resources. **Never embed a token or upload customer records, private screenshots, credentials, operational documents or unapproved client assets.** A public asset URL can be opened even while its article is a draft.

## Seed the existing eight articles

The website remains the source of the existing content until a reviewed draft is published in Sanity. Prepare a local JSON array or NDJSON export of the existing `Insight` objects. Do not evaluate arbitrary imported JavaScript or include private records.

```text
npm run prepare-import -- path/to/articles.json path/to/catalyst-drafts.ndjson
```

The preparation command runs locally, needs no dependencies, makes no network requests and only writes a **new** output file. It uses stable IDs/array keys, preserves existing section anchors, translates numeric source positions to stable `sourceKey` values and creates drafts with unchecked editorial-review fields. It never publishes or certifies a review.

After verifying the project/dataset in the CLI, import the prepared file manually using the authenticated Sanity CLI:

```text
npx sanity dataset import path/to/catalyst-drafts.ndjson production
```

Import into the intended project only. Do not add `--replace`, overwrite documents, or run repeated imports without reviewing their effect. Review each imported draft in Studio before using Publish. Sanity removes the `drafts.` prefix at publication; the underlying `blog-<slug>` ID contains no dots and is readable as published public content.

## Write → preview → publish → share

- Use the **Write** pane and its groups to write the article, select existing related destinations, and add authoritative HTTPS sources. All article text is rendered as text; arbitrary HTML, scripts, raw embeds and private-record connections are not supported.
- Use **Preview** to read the unpublished text and check a narrow reading layout. This is an authenticated local editor pane, not a public draft URL or an exact browser screenshot of the final website. Website navigation, related-tool cards and optional cover imagery should also be checked on the final page.
- Complete **Review before publishing** after checking the current draft. The checklist is an editor attestation, not an automatic fact checker; recheck it after significant changes. Sanity's built-in Publish button stays explicit and respects schema validation. Autosave does not publish. There is no automatic posting or paid scheduling integration.
- Use **Share drafts** after publishing. Check the public page before copying a link or draft. Copying text does not send email or publish to LinkedIn, Facebook or another account. Choose approved destinations and recipients manually. Promotion fields remain drafts; do not enter private information in them.
- Keep a published slug stable. Ask for a redirect before changing one. Once configured, the CMS catalog is authoritative: an empty published catalog stays empty rather than restoring static articles. Permanent redirects require a website change.

New article sections use their stable Sanity `_key` as the public anchor unless a legacy `id` exists. Section `sourceKey` points to a stable `_key` within `sources`, so reordering references does not change their meaning. The website adapter maps that key back to the article template's numeric source reference. Keep the fixed options in `schema/options.ts` synchronized with real website destinations.

## Verification before activation

- No write/read API token appears in browser bundles or configuration.
- Drafts and unpublished changes never appear in public article, sitemap or share metadata responses.
- Both invited partners can create, preview, duplicate and explicitly publish; an unrelated account cannot edit.
- Missing required fields, invalid dates, an unchecked review and broken source references block publication.
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
