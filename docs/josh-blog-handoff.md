# Josh and Echo: finish connecting the Blog

The corrected website and editor are built and tested. The publishing account is **not connected yet**. Daniel approved resuming Free setup; Josh needs to complete the company Google sign-in. No post has been substituted for Josh's approved first edition.

## The account step for Josh

1. Open https://www.sanity.io/manage and choose **Continue with Google**.
2. Sign in as **mycatalystinnovations@gmail.com**, complete security checks and review any Sanity account terms directly. Do not send a password or security code in chat.
3. Stop at the project dashboard and tell the website agent that sign-in is complete. If a Catalyst project already exists, keep it; do not create a duplicate. No paid plan, card, trial upgrade or additional DigitalOcean hosting is required by this design.

Echo can continue the setup with Josh in an authorized signed-in session. Project IDs and the final Studio URL are public configuration, not secret keys. Do not put a write token in website code or the Studio browser application.

## One-time technical connection

The website agent/Echo should use `studio/README.md` to finish these steps:

- Reuse or create the Free **Catalyst Innovations** project and its `production` dataset. Only approved public marketing material belongs here. Do not import the eight existing Guides.
- Deploy the tested isolated Studio to its reviewed Sanity-hosted address. Confirm the actual project ID, dataset and Josh's sign-in email. Review any new access grants or agreements with the account holder.
- Configure the website's matching `NEXT_PUBLIC_BLOG_SANITY_PROJECT_ID`, `NEXT_PUBLIC_BLOG_SANITY_DATASET` and `BLOG_STUDIO_URL`. Preserve other production environment values.
- Verify sign-in, unauthorized access restrictions, private drafts, current-version approval, publication, updates, unpublishing, the RSS feed and the public page. Use the actual approved post only when its exact text and publication instruction are available. Test data must not become a public customer story.
- Release the corrected website and verify the live `/blog` and `/blog/editor`. Until these checks pass, describe the work as prepared rather than connected.

## Publishing a Friday post after connection

1. Josh or Echo opens **mycatalystinnovations.com/blog/editor** and signs in to the connected editor.
2. Echo prepares a draft and source notes, using the original approved text where supplied. The format is approximately 3–5 minutes about a practical business problem, with verified references and context for any statistics.
3. Josh reviews the exact version. The configured Josh account records **Approve this version (Josh)** after completing the review checklist. This does not publish it.
4. After Josh's explicit approval, Josh or Echo in an authorized signed-in session selects **Publish**. No website-code change is needed for each post. Changes to the public content invalidate the old approval.
5. Check the public post, references, sharing image and links. The content cache refreshes on a five-minute interval, so allow a refresh before treating a missing immediate update as failure.
6. Use the post's sharing tools for the appropriate social account after reviewing the post copy. Opening or copying a draft does not automatically post it.

The Free project administrators retain control of the underlying API. The approval check prevents accidental stale-version publication through this workflow; it is not tamper-proof two-person permission enforcement. Friday is the intended writing cadence, and no unattended publishing automation has been enabled.

The existing practical resources remain **Guides** at `/insights`. The actual **Blog** is a distinct `/blog` publication. See `blog-editorial-policy.md` for the editorial brief and researched topic candidates.
