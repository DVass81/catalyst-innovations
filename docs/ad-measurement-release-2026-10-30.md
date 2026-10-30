# Ad-result measurement — October 30, 2026

Status: prepared for review from main commit
`d997fef186a3f8e9384c67d47192e6f6253efe89`. Not committed, pushed or deployed.
The Google Ads campaign remains unpublished.

## Website behavior

The preferences offer Necessary only, Basic analytics and Measure ad results.
An existing `granted` preference remains basic analytics. Ad measurement requires
an explicit new choice in both first-party preference stores. Ad personalization
and Google signals remain disabled in every mode.

Only ad-result consent allows validated `gclid`, `gbraid`, `wbraid`, `gad_source`
and `gad_campaignid` in GA4 page URLs. Duplicate or malformed values are dropped.
UTMs, arbitrary URL queries, fragments, referrers, form answers, contact fields
and calculator values are excluded. Both analytics modes retain blank campaign
overrides so Google does not derive campaign fields from arbitrary UTMs.
Plausible remains query-free. This change adds no enhanced conversions, second
tag or server-side click-ID storage.

Changing an active measurement mode stops the old tag, clears browser-accessible
first-party Google measurement cookies and reloads before tracking resumes.
Basic and Necessary also clear stale ad-click cookies without requiring an active
tag. If preference writes fail, measurement stops on the current page and the
site avoids automatically reloading stale ad consent. The notice explains that
a manually reloaded or newly opened page may restore the old choice when the
browser prevents saving preferences.

The existing inquiry delivery and email-draft fallback remain. Completion is
emitted only after a successful direct-delivery response with an empty honeypot.
Whitespace honeypots cannot count as leads. A synchronous submission guard
prevents duplicate requests and completion events before React rerenders.

## Local checks

- 79 automated tests passed, including actual inquiry-handler success,
  failure/retry, draft, duplicate-submit and whitespace-honeypot cases.
- Lint, TypeScript and `git diff --check` passed.
- The default Next.js production build passed and generated all 99 pages.
  The sandboxed attempt could not write generated artifacts; the same default
  build passed after approval for local build permissions. The build script was
  not changed. A production preview is running at `http://127.0.0.1:3100` for
  controlled browser review.
- Tests mock inquiry providers and do not send real inquiries.

The local preview uses only public GA configuration (`G-X1CZXDD7JC` and the
manual-tracking review flag). No production secrets or delivery configuration
were copied. A preview test is not evidence of live-domain delivery or GA4
receipt.

## Provider observations

Read-only browser review on October 30 confirmed GA4 property **557166821**,
stream **15974916158**, tag **G-X1CZXDD7JC**:

- Enhanced Measurement is off.
- Google-tag automatic history, scroll, outbound-link, form, video and download
  detection are unchecked. The base page-view checkbox is controlled by the
  website's `send_page_view: false` and explicit page-view event.
- Allow user-provided data capabilities is off. Property user-provided data and
  Google signals both show the option to turn them on, rather than being enabled.
- Advertising personalization is allowed in 0 of 307 regions.
- Granular location/device collection is off.

No provider settings were changed during this review. The pilot account is
Google Ads **353-982-1684**, not historical customer 968-914-1805. Josh's handoff
identifies the imported secondary action as Catalyst consultation request,
`form_complete`, conversion ID **7883004137**; this does not establish receipt
of a new live test conversion.

## Outstanding release evidence

Daniel's final review of the consent/privacy wording, actual Google request
payloads under all three choices, deployed commit/time, a labeled successful
test inquiry and GA4 DebugView receipt remain to be recorded. `dataLayer`
entries alone are insufficient network evidence. A synthetic click ID cannot
prove Ads attribution; that requires an eligible real ad click after launch.
The site's normal reviewed release process must preserve live configuration.
