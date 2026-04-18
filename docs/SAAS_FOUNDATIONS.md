# SaaS foundations: analytics, data model, and backend

This document aligns the static CertPath demo with a future multi-tenant SaaS: **Postgres**, **authenticated users**, **server-side reports**, and a **small admin panel**. The repo already includes client-side instrumentation (`analytics/certpath-analytics.js`) and hook points in `app.js`; wiring to a real API is intentionally deferred.

---

## 1. Product events (client → server)

Canonical names (snake_case) match `CertPathAnalytics.EVENTS`:

| Event | When (current SPA) | Recommended properties (no PII) |
|--------|--------------------|----------------------------------|
| `landing_page_cta_click` | User clicks a CTA tagged with `data-certpath-event` (hero, header) | `cta_label`, `target_section` |
| `assessment_started` | First navigation to `#assessment` from link/hash per session, or wizard step 1→2 | `locale`, `entry` (`nav` \| `wizard`) |
| `assessment_completed` | Successful “Generate snapshot” with valid profile | `locale`, `product_category`, `sales_channel`, `wizard_step_count` |
| `result_viewed` | Rule engine produced HTML report (main app or `report-view.html`) | `surface` (`spa` \| `report_view`), `product_category`, `sales_channel`, `locale`, `rule_engine_version`, `data_version` |

In the SPA, `renderResults` accepts `emitResultViewAnalytics: false` so the follow-up re-render after AI does not double-count the same “Generate snapshot” action.
| `pdf_downloaded` | User triggers PDF/print export from report toolbar | `surface` |
| `support_requested` | Contact form submitted (demo: still `alert`) | `locale`, `has_structured_fields`, field *presence* counts only |
| `package_cta_clicked` | Package tier primary CTA or `data-package-interest` link | `tier_key`, `cta_target`, `package_interest` |

**Privacy:** do not send product names, emails, free-text message bodies, or API keys. Use categorical keys and counts only until a privacy policy and DPA cover expanded fields.

**Ingest:** `APP_CONFIG.ANALYTICS_ENDPOINT` (optional POST URL) receives JSON envelopes `{ v, event, ts, properties, context }` (see `certpath-analytics.js`). Prefer append-only `analytics_events` table (below) plus aggregation jobs.

**Hook for tests or custom routing:** assign `window.CertPathAnalyticsHook = function (envelope) { … }` before or after load; it receives the same envelope object (synchronous; keep it fast).

---

## 2. Proposed Postgres-oriented data model

Rough tables for **accounts**, **assessments**, **saved reports**, **leads**, and **rule versions**. Adjust naming to your ORM (Prisma, Drizzle, etc.).

### `users`

- `id` (uuid, PK)
- `email` (unique), `email_verified_at`
- `password_hash` or `auth_provider` / `auth_subject` (SSO)
- `org_id` (nullable FK → `organizations`)
- `role` (`owner`, `member`, `admin`)
- `created_at`, `updated_at`, `deleted_at`

### `organizations` (B2B)

- `id`, `name`, `billing_email`, `plan_tier`, `created_at`

### `assessments` (wizard submissions / intake)

- `id` (uuid)
- `user_id` (nullable for anonymous → link on signup)
- `anonymous_session_id` (nullable; matches client `session_id` until account merge)
- `locale`, `profile_json` (encrypted at rest if sensitive), `schema_version`
- `rule_bundle_version` (FK or string denoting `rule_versions`)
- `status` (`draft`, `completed`, `abandoned`)
- `completed_at`, `created_at`, `updated_at`

### `saved_reports`

- `id` (uuid)
- `assessment_id` (FK)
- `user_id` (nullable)
- `engine_output_json`, `ai_output_json` (nullable), `locale`
- `storage_key` (optional S3 path for PDF snapshot)
- `created_at`

### `support_leads` (contact / expert requests)

- `id` (uuid)
- `user_id` (nullable), `assessment_id` (nullable), `saved_report_id` (nullable)
- `locale`, `tier_interest`, `urgency`, `doc_gap`, `markets` (text[] or jsonb)
- `message` (encrypted text), `email`, `phone`, `company_name`
- `status` (`new`, `triaged`, `quoted`, `closed`)
- `created_at`

### `rule_versions` (reproducibility)

- `id` (serial or uuid)
- `engine_semver`, `ruleset_hash`, `data_json_version` (e.g. from `data.json` `meta.version`)
- `released_at`, `notes`
- Assessments and saved reports reference the version used at generation time.

### `analytics_events` (optional central log)

- `id` (bigserial)
- `received_at`, `event` (text), `properties` (jsonb), `context` (jsonb)
- `user_id` (nullable), `session_id` (text)
- Partition by month for scale.

---

## 3. Scalable backend architecture (suggested)

```
[Browser SPA] ──► [CDN / static host]
       │
       ├── POST /api/v1/analytics/events  (batched or single; API key or session cookie)
       ├── POST /api/v1/assessments       (autosave draft)
       ├── POST /api/v1/reports          (persist snapshot + PDF job)
       ├── POST /api/v1/support/leads
       └── POST /api/v1/ai/explain       (existing worker pattern; server-side only in prod)

[API / BFF]  (Node, Go, or Python — stateless)
       │
       ├── Postgres (OLTP: users, assessments, reports, leads, analytics)
       ├── Redis (optional: rate limits, session cache)
       ├── Object storage (PDF exports, large payloads)
       └── Queue (optional: PDF render, CRM sync, email)

[Worker] (same repo’s `worker/` pattern extended)
       └── AI calls, heavy exports, webhooks to HubSpot / Intercom

[Admin]
       └── Read-only replica or RLS-scoped role: search users, view leads, replay assessment + rule version
```

- **Auth:** session cookies or short-lived JWT + refresh; org-scoped RLS in Postgres for multi-tenant safety.
- **Admin panel:** start with **Retool**, **Metabase**, or a minimal **Next.js** internal app on `/admin` behind VPN + SSO; later embed lead queues.
- **Migrations:** single migration pipeline (Flyway, Prisma migrate, etc.) versioned with `rule_versions`.

---

## 4. Phased implementation checklist

**Phase A — Telemetry (current repo direction)**  
- [x] Client `CertPathAnalytics` + `APP_CONFIG` hooks  
- [ ] Deploy small `POST /analytics/events` service writing to `analytics_events`  
- [ ] Dashboard: funnels (landing → started → completed → support)

**Phase B — Accounts & persistence**  
- [ ] Auth provider + `users` / `organizations`  
- [ ] Replace `localStorage` profile with `assessments` API + optimistic UI  
- [ ] Move `CertPathReportPersistence` to server `saved_reports` + signed share URLs

**Phase C — CRM & ops**  
- [ ] `support_leads` + email/Slack webhook  
- [ ] Map `package_cta_clicked` → nurture segments

**Phase D — Compliance**  
- [ ] Consent banner if non-essential cookies; document retention for `analytics_events`  
- [ ] DPIA for profile JSON and AI payloads stored server-side

---

## 5. Files reference

| File | Role |
|------|------|
| `analytics/certpath-analytics.js` | `CertPathAnalytics.track`, envelope shape, optional beacon |
| `runtime-config.js` | `ANALYTICS_ENDPOINT`, `ANALYTICS_DEBUG`, optional `meta` for release |
| `app.js` | Instrumentation calls (search `CertPathAnalytics`) |
| `report/report-view-app.js` | `result_viewed` on read-only report page |

This keeps the **frontend contract** stable while Postgres and admin UIs evolve independently.
