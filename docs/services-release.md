# Services release — review package

Prepared October 8, 2026. Website branch: `redesign/clearer-catalyst`.

## Preview

- Services: http://127.0.0.1:3112/services
- Flooring estimating sample: https://catalyst-flooring-public-sample-6kvkd.ondigitalocean.app/
- Painting demonstration prototype: https://catalyst-painting-public-demo-euchg.ondigitalocean.app/
- Existing public HOA sample: https://commonplace-public-hp2b7.ondigitalocean.app/

The public samples have been activated following Daniel's explicit $20/month hosting approval. The Services page remains on the redesign branch for Daniel's finished-page review before website publication. Development-only loopback preview settings remain available; verified public URLs take precedence.

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
| HTTP readiness endpoint | `/api/healthz` | `/api/health` |
| App ID | `75abae07-969d-49b3-861a-908a99c0d70c` | `f4fd8157-94d3-4d68-99c8-94a2a48c98cf` |
| Source commit | `2d976b6` | `3042c82` |

Combined additional base hosting: **$20/month**, before applicable taxes or usage charges. This is within the $30/month planning limit. Pricing was checked against [DigitalOcean's current App Platform pricing](https://docs.digitalocean.com/products/app-platform/details/pricing/). Daniel approved the exact configuration before activation on October 8, 2026. DigitalOcean's default two-container selection was changed to one fixed container per application before creation.

The original private Flooring app, archived Painting app, and existing HOA deployment were not changed. The two new public samples are isolated deployments without databases, jobs, buckets, or external provider credentials. Painting's repository remains private.

Flooring uses its public branch's default Dockerfile, which is identical to `Dockerfile.public-sample` and copies only the narrow public server, fictional fixtures, and public frontend into the final unprivileged container. Painting uses the Node buildpack with `npm ci && npm run build`, `npm start`, and public-demo build flags. Its fresh session-signing value is encrypted and available at runtime only; no secret is committed. HTTPS origin binding uses DigitalOcean's `${APP_URL}` for Flooring. Both services listen on port 8080 and use HTTP readiness checks.

## Release order

1. Completed: cost approval, demo branches pushed, and separate public apps activated.
2. Completed: production builds, browser workflows, own reset, public branding, and readiness checks.
3. Completed: deployed API verification, verified public URLs integrated throughout the website, and final checks.
4. Show the completed page with its final public links. After Daniel approves publication, release the website through its existing deployment process and check the production Services route, navigation, links, canonical and sitemap.

## Verification completed while preparing the package

- Website: all 64 tests passed, lint and type checking passed, and the production build generated 99 pages including static `/services`. Production HTML contains all three reviewed HTTPS demo URLs with no loopback links or video preloading; the canonical and sitemap include `/services`. Consent-controlled analytics excludes email-link parameters.
- Actual Flooring measurements and costing survive into a fictional draft proposal. A floating-point waste-rounding defect was corrected and tested.
- Actual Painting material changes update costs, gross profit and margin and survive estimate review.
- Both public runtimes use isolated temporary fictional state, two-hour idle expiry, bounded data and server-side restrictions. Outbound providers and administration are unavailable.
- External Website, Elevate and HOA destinations returned HTTP 200 on October 8, 2026.
- Browser checks cover readable page content, keyboard menu, new-tab indicators, complete images, and responsive layouts.
- Flooring live API checks: healthy response, secure HttpOnly/SameSite cookies, no-store, two independent sessions, scope-preserving draft, own reset, cross-session access rejection, origin/CSRF rejection, and unavailable owner/admin/provider routes. The 24 × 15 ft example produces 396 material square feet at 10% waste and $4,670.77.
- Painting live browser check: changing materials from $1,180 to $1,401 produces $4,015 estimated costs and a 41.3% margin; those values survive review. Reset restores the original $3,794 costs and clears unsaved local input state. No browser errors were reported in either live workflow.
- Painting live API checks: 24 checks passed. Independent sessions and resets preserved visitor isolation; modified scope, 89 hours, $6,890 revenue and $1,450 materials persisted as $4,092 estimated costs and 40.6% margin. Secure HttpOnly/SameSite cookies, relative redirects, no-store, and CSRF rejection passed. Anonymous mutation, uploads, owner login, and payments were blocked. Literal and encoded private-client logo paths returned 404; the official Catalyst logo remained available. Both test sessions were reset and logged out.
- Two-hour expiry and concurrency limits are covered by deterministic local tests rather than waiting two hours in production.

No messages, invoices, payments, appointments or real customer records were created during verification.
