# Native Blog publishing

Prepared November 20, 2026. This replaces the unfinished Sanity Blog setup. The legacy Studio and its tests remain as inactive compatibility code; public Blog pages now read only `data/blog-published.json`. The eight Guides remain separate at `/insights`.

## Weekly use

1. Open `https://mycatalystinnovations.com/blog/editor` and enter the private editor password.
2. Paste Echo’s article and enter its title and topic. The URL is suggested from the title; the short summary can be entered or derived from the article’s opening.
3. Select **Preview article**. Check the entire text, sources, claims and formatting. Changing any field requires a new preview.
4. Select **Publish article** only after approving the actual content for public release. Publishing saves that exact version and starts the existing website deployment.
5. **Saved. Waiting for deployment.** confirms the source save, not a successful deployment. Use **Check public article** after the hosting deployment completes. Verify the article, sharing image, Blog listing, RSS and sitemap before sharing its link.

Use blank lines for paragraphs, `##` for headings, `###` for subheadings, `-` for lists, `**bold**`, and `[source title](https://example.com)` for citations. HTML is displayed as text. Pasting rich text preserves its plain text; inspect the preview for formatting you want to add. The editor does not upload images.

Select an existing article to revise it. Its URL and original publication date remain fixed. All publication dates use the New York calendar day. Friday is the writing cadence; there is no unattended publishing automation. Echo needs the same authorized session and Josh’s approval to publish.

Text that has not been published exists only in the open editor page. Keep the original draft in Echo or your document. Closing, reloading, signing out or navigating away discards unsaved text. If a session expires, sign in using the separate-tab link, then reload the article list in the original editor to retain the pasted text. If a save result is uncertain, use **Retry publish** without changing the text; the same operation is checked instead of creating a duplicate commit.

## One-time production activation

The implementation is prepared locally. It must not be described as connected until these steps and the live checks pass. No production credentials are included in source.

- Use the existing DigitalOcean App Platform application for `mycatalystinnovations.com`, connected to `My-Catalyst-Innovations/catalyst-innovations`, branch `main`. The repository transferred to the shared organization on November 20, 2026; Josh's repository administrator access was verified after the transfer. Verify the live app's GitHub connection points to that canonical repository before activation. Preserve its actual app spec, secrets and unrelated configuration. `.do/app.yaml` is a template, not an export of production settings.
- Josh or another approved organization owner should create a fine-grained GitHub token with **My-Catalyst-Innovations** as resource owner, **only this repository** selected and **Contents: read/write**, with an expiration and renewal owner. Complete any required organization approval through GitHub's normal controls. Confirm the token can write this fixed content file on `main` under current branch rules. Do not use the developer’s broad CLI token or add workflow/admin permissions.
- Set `BLOG_GITHUB_TOKEN`, `BLOG_EDITOR_PASSWORD_HASH` and `BLOG_EDITOR_SESSION_SECRET` as encrypted **runtime-only** environment values on that application. Set `BLOG_EDITOR_ORIGIN=https://mycatalystinnovations.com`. Never put credentials in `NEXT_PUBLIC_*`, repository files, screenshots or portfolio records.
- The password must contain at least 16 characters. Store its salted scrypt verifier as `scrypt:<16-byte lowercase hex salt>:<64-byte lowercase hex derived key>`, using Node’s default `crypto.scrypt` parameters. Set the session secret to an independent random value of at least 32 bytes, base64url encoded. Choose/store the actual password privately; never submit it in chat. Rotating either secret revokes existing sessions.
- Review and merge the prepared change only after runtime settings are ready. The initial publication catalog is empty. No invented article or draft is included.
- Record production-like performance and rendered mobile checks for the Blog listing and private editor before release. Keep field Core Web Vitals marked unknown until actual field data exists; do not substitute a planning score or a laboratory responsiveness proxy for measured INP.
- Sign in and publish the first **actual, approved** article, observe the resulting GitHub commit and successful DigitalOcean deployment, then verify public article HTML, metadata/social image, Blog listing, feed and sitemap. Also check signed-out access cannot load the catalog or publish, wrong-origin POSTs are rejected, sign-out removes the session, and mobile preview/editing works.

## Storage, deployment and access limits

DigitalOcean App Platform local files are ephemeral. Published articles therefore save through GitHub’s Contents API to the fixed `data/blog-published.json` path on `main`. The app’s existing deploy-on-push pipeline builds that catalog into the public website. There is no extra database or Sanity account. Git history preserves previous published versions.

**This repository is public.** Selecting Publish makes the article public in source immediately, even if deployment is delayed or fails. Draft text is never written to GitHub. Published history is not a place for confidential content, and removing a public article later does not erase its Git history.

The API checks an eight-hour signed, HttpOnly, Secure, SameSite=Strict session and the exact allowed Origin before writes. Preview fingerprints confirm the posted content matches the previewed version; they are not proof of Josh’s identity or a second-person approval system. Anyone holding the editor password has publishing access. Login attempts are bounded to five per forwarded IP and 30 total per 15 minutes **per app process**. Redeployment/scaling resets this in-memory limiter; the global limit can also temporarily block legitimate sign-in. Confirm the host’s forwarded-IP trust and existing edge protections before wider access. No new edge provider is configured here.

Publication uses the catalog’s Git blob SHA to reject conflicts. Retry identity is checked against the published document and the latest 100 commits affecting the catalog. Older unconfirmed retries fail visibly rather than inventing a successful save. The collection is bounded to 900,000 UTF-8 bytes; individual article bodies are bounded to 60,000 characters. At that point, plan a reviewed storage upgrade rather than silently dropping content.

Published articles are public/indexable; editor metadata and HTTP headers are noindex, and the editor is omitted from the sitemap. The public reader contains no publishing token and does not contact GitHub or Sanity to render articles.

References: [DigitalOcean storage guidance](https://docs.digitalocean.com/products/app-platform/how-to/store-data/), [GitHub Contents API](https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents), [fine-grained token limitations](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#fine-grained-personal-access-tokens-limitations).
