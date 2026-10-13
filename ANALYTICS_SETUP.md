# Production analytics

Activated 2026-10-13 on https://www.thecreativebunch.eu.

- Visitors, page views, countries, referrers, devices and daily traffic come from the official Vercel Web Analytics aggregate API. Supported UI periods: 7/30 days on the current Hobby plan. Production traffic is queried in UTC. Vercel reporting can be delayed and consent/ad blockers limit coverage; this is measured traffic, not a complete census.
- Project opens and booking-link clicks are consent-gated events stored privately in Supabase. Collection started October 13; historical interactions cannot be reconstructed. Book-a-call clicks count create_project_click only; pricing_cta_click is a breakdown of the same click and is not added again.
- Booked calls are non-cancelled reservations CREATED in the selected period, read from the existing private booking store. Upcoming meetings remain separate. Sales and realtime active-user metrics are unavailable rather than fabricated.
- Reporting refreshes every minute while Dashboard or Analytics is visible. Backend cache: 60 seconds. Missing providers show unavailable metrics, not dummy data. Period controls share state; stale requests cannot overwrite a newer report.
- Interaction records contain only UUID, server time, approved event name and optional project ID. No names, emails, private booking links or raw IP addresses enter this table. A short-lived hashed IP key in the existing rate-limit store limits submissions. RLS is enabled; anon/authenticated roles cannot read the table or execute event/report RPCs. Service-role-only RPCs are defined in supabase/analytics.sql.
- Records older than 90 days are removed on new events and by the existing authenticated daily cleanup job. CRON_SECRET is configured in production.
- /api/analytics requires the existing admin session. /api/events accepts only approved origins, consent=true, valid UUID and allowlisted event types, with a request-size cap and rate limit. Invalid submissions returned 400, foreign origin 403 and unauthenticated report 401 in live checks.
- Vercel reporting token: project-scoped to the-creative-bunch-website, expires October 13, 2027. Stored only as TCB_VERCEL_ANALYTICS_TOKEN in backend Vercel production. Companion IDs: TCB_VERCEL_PROJECT_ID and TCB_VERCEL_TEAM_ID. Never put credentials in analytics-config.js or browser scripts.
- Live browser check: initial 30-day report showed 17 measured visitors and one confirmed booking. One real QA project opening and one real booking-link click appeared as 1 each in the 7-day report. These initial interaction totals include that QA visit. No booking/email was created by the analytics test.
- Checks: scripts/check-analytics.mjs, scripts/check-cookie-consent.cjs, scripts/check-bookings.mjs, scripts/check-booking-brevo.mjs. Privacy regression checks include denial, expiry, storage failure, withdrawal, URL redaction and exclusion of private data from interaction payloads.

Frontend release is built from the current public files with analytics-specific changes. Previously approved, unpublished cosmetic/project-editor work remains in the local workspace for the next requested full site push.
