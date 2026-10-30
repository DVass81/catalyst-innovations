# Editorial Blog correction

Prepared October 30, 2026 on `fix/editorial-blog-publishing`, based on production `16bd2c9`.

## Result

- `/blog` is its own publication for short Friday perspectives on manual work, repetitive tasks, useful automation and practical business problems. It no longer redirects to `/insights`.
- The eight existing resources remain a separate Guides library, with their original `/insights/` addresses and reporting context preserved. They are not republished as Blog posts.
- The Blog uses published CMS content only. Before the first approved post exists, it shows an honest empty state and its RSS feed contains no invented or substitute articles.
- `/blog/editor` provides the editorial entry point. When a verified Studio and project are configured, authorized users can draft, review, approve and publish without changing website code. Until then, it identifies the connection dependency and offers account sign-in without claiming a working editor.
- The editor provides optional service links, factual source notes, dates, statistical context and methodology. About 600–1,000 useful words is the 3–5 minute editorial target; a warning encourages editing rather than filler.
- A current-content fingerprint binds Josh's approval to the exact public text, sources, evidence and image reference. Publication is a separate action. Echo may carry out publication in an authorized signed-in session after Josh explicitly approves the current version. There is no unattended weekly publishing or social posting.

## Verification completed locally

- 130 automated tests passed, including distinct Blog/Guide namespaces, source privacy, stale approval rejection, unknown and unapproved post rejection, inquiry compatibility and truthful failure handling.
- Main website ESLint, TypeScript and production build passed.
- The isolated Studio dependency installation, TypeScript check and production build passed with a placeholder public project identifier. No account, content or service was created by those checks.
- 78/78 sitemap pages passed the local production crawl. Unknown Blog posts return 404/noindex, existing Guide URLs remain readable and Blog/Guide titles and canonicals are distinct.
- Browser checks covered direct `/blog` loading, the separate Guides library, the editor entry, a 390px phone layout, mobile Blog navigation and Escape dismissal. No horizontal page overflow was observed.

## Account and release status

Daniel explicitly approved resuming the Free Sanity editor setup, superseding the earlier deferral. The company Google account is `mycatalystinnovations@gmail.com`. Google sign-in, required account terms, project connection, hosted Studio deployment and a real authorized publishing check still need to be completed before this editor can be described as connected. Never store a write token in the website or Studio browser bundle.

No new Blog post has been approved or published by this correction. Josh's already-approved first edition was not available in the connected Outlook search, and no replacement was invented. The final real article can be entered by Josh or Echo after connection.

Free-plan project administrators can bypass Studio controls through their project API. This workflow protects against accidental stale approval; it is not tamper-proof, separate-person authorization. Publication visibility follows the website's five-minute content cache and may require a refresh; account/provider failures are surfaced honestly rather than restoring Guides as posts.

The live release remains unchanged while account activation and verification are pending. See `blog-editorial-policy.md` for sourcing standards and proposed topics, `blog-launch-guide.md` for operator guidance, and `studio/README.md` for setup and approval details.
