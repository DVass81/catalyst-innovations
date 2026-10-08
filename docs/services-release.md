# Services release — review package

Prepared October 8, 2026. Website branch: `redesign/clearer-catalyst`.

## Preview

- Services: http://127.0.0.1:3112/services
- Flooring estimating sample: http://127.0.0.1:3114/estimator
- Painting demonstration prototype: http://127.0.0.1:3113/
- Existing public HOA sample: https://commonplace-public-hp2b7.ondigitalocean.app/

Local Flooring and Painting destinations are enabled only in development with loopback-only preview settings. Production definitions must receive their verified HTTPS public destinations after deployment. Do not publish the Services release before that integration and Daniel's finished-page review.

## Exact additional hosting configuration

| Setting | Flooring | Painting |
| --- | --- | --- |
| New application | `catalyst-flooring-public-sample` | `catalyst-painting-public-demo` |
| Source repository | `DVass81/knox-flooring-operations` | `DVass81/oxendine-operations-demo` (private) |
| Source branch | `demo/public-sample` | `demo/public-sample` |
| Runtime | Narrow Node server and public frontend only | Next.js with enforced public-demo mode |
| Region | NYC | NYC |
| Service instances | One | One |
| Instance size | `apps-s-1vcpu-1gb-fixed` | `apps-s-1vcpu-1gb-fixed` |
| Memory / CPU | 1 GiB / 1 shared vCPU | 1 GiB / 1 shared vCPU |
| Base monthly cost | $10 | $10 |
| Database, jobs, buckets, autoscaling | None | None |
| Automatic deployment on push | Disabled | Disabled |

Combined additional base hosting: **$20/month**, before applicable taxes or usage charges. This is within the $30/month planning limit. Pricing was checked against [DigitalOcean's current App Platform pricing](https://docs.digitalocean.com/products/app-platform/details/pricing/). Activation still requires Daniel's review of this configuration and cost.

The original private Flooring app, archived Painting app, and existing HOA deployment are not deployment targets. No new hosting has been activated while preparing this package.

## Release order

1. Review the Services page and both local workflows. Approve the exact hosting configuration before creating the two new apps.
2. Save and push only the new demo branches. Keep the Painting repository private.
3. Create the separate applications using their reviewed `.do` specifications. Set a fresh, cryptographically random Painting session-signing secret through DigitalOcean's encrypted environment setting; never deploy the template placeholder. Confirm Flooring's exact HTTPS origin binding.
4. Check HTTPS health, actual estimation and draft handoff, two independent visitor sessions, own reset, expiry, restricted API calls, and excluded branding on the deployed applications.
5. Update the website's shared demo definitions with only verified public URLs. Preserve recordings and Painting's prototype status; update affected availability checks.
6. Show the completed page with its final public links. After Daniel approves publication, release the website through its existing deployment process and check the production Services route, navigation, links, canonical and sitemap.

## Verification completed while preparing the package

- Website: existing tests, lint, type checking, production build, service destinations, sitemap inclusion and consent-controlled analytics path.
- Actual Flooring measurements and costing survive into a fictional draft proposal. A floating-point waste-rounding defect was corrected and tested.
- Actual Painting material changes update costs, gross profit and margin and survive estimate review.
- Both public runtimes use isolated temporary fictional state, two-hour idle expiry, bounded data and server-side restrictions. Outbound providers and administration are unavailable.
- External Website, Elevate and HOA destinations returned HTTP 200 on October 8, 2026.
- Browser checks cover readable page content, keyboard menu, new-tab indicators, complete images, and responsive layouts. Live-cloud validation remains a required step after activation.

No messages, invoices, payments, appointments or real customer records were created during verification.
