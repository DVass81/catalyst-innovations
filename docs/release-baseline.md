# Production baseline
Verified September 7, 2026 through DigitalOcean's App Platform interface.
- Existing app: catalyst-innovations
- App ID: 9d0c16a6-acf2-42ac-96fe-27f3ab66dd40
- Domain: https://mycatalystinnovations.com
- Current source commit: b373d106c7cf02d1fff8108ed58e8cba1e2cf979
- Current deployment: 984a8f94-e413-4644-919d-c886b7beb5b2
- Source: DVass81/catalyst-innovations, main, automatic deployment ON.
- Existing service: catalyst-innovations, 1 container, 512 MB RAM, 1 shared vCPU, public port 8080, npm start.
- Existing runtime configuration: NODE_ENV=production; app-level site URL and scheduling URL present.
- No inquiry webhook or email delivery configuration was present during verification.
- Rollback: select the recorded successful deployment in App Platform Activity and use its rollback control. Then revert the release merge in GitHub with a new commit; never rewrite production history.

