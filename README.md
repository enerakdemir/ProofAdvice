# CertPath

CertPath helps companies and sellers see which certificates and conformity evidence they are likely to need for the UK and EU, and what to obtain next. The frontend runs as a static GitHub Pages site, while live AI analysis is designed to run through a secure server-side worker so API keys never ship to the browser.

## What The App Does

- Collects product intake details for Amazon, Shopify, Etsy, and similar sellers
- Produces a fallback decision-engine report directly in the browser
- Supports live AI analysis grounded in official UK/EU source pages
- Surfaces likely certificates and documentation, possible frameworks, gaps, risk flags, and next steps
- Supports English, Turkish, and German UI
- Refreshes reference content from official sources through a scheduled AI updater

## Core Files

- `index.html`: Static UI shell and section layout
- `privacy.html`, `terms.html`, `methodology.html`, `about.html`, `disclaimer.html`: Trust and transparency pages (English reference copy; linked from the main footer and navigation)
- `resources/`: SEO-oriented library (`index.html` hub plus topic pages) linked from the in-app Resources section and footer; deployed as static HTML alongside the main app
- `landings/`: Segment-specific acquisition pages (Amazon electronics, battery/charger brands, white-label, importers/resellers) linking into the same `#assessment` / `#contact` / `#packages` flows as the main SPA; see `landings/index.html` for the hub and HTML comment block describing URL and CTA conventions
- `engine/assessment-schema.js`, `engine/compliance-rules.js`, `engine/rule-engine.js`: Versioned deterministic assessment (Layer 1)
- `services/ai-environment.js`: Reads `window.APP_CONFIG` for **development vs production** AI rules (browser demo allowed or not, server-side required).
- `services/ai-explanation-service.js`: **Single browser entry** for AI explanations — worker fetch, optional browser Gemini demo, normalization; swap Gemini by changing this module + `worker/src/ai-provider.js`.
- `app.js`: Frontend state, form logic, rule-engine integration; calls `CertPathAiExplanationService.requestExplanation` for Layer 2 AI
- `report/report-renderer.js`: Report HTML builders (on-screen, print/PDF export) — no dependency on wizard DOM
- `report/report-persistence.js`: Demo-mode localStorage history + compressed share payloads for `report-view.html`
- `report-view.html` + `report/report-view-app.js`: Read-only report page (`?id=` or `#p=gz|raw.…`)
- `translations.js`: UI translations
- `runtime-config.js`: Frontend runtime configuration, including `AI_ENDPOINT`
- `data.json`: Local structured content for packages, resources, FAQ, and filters
- `update_data.py`: Official-source fetch plus LLM-assisted content refresh for `data.json`
- `worker/src/index.js`: Secure AI endpoint that fetches official sources and calls Gemini server-side
- `worker/wrangler.toml`: Cloudflare Worker config

## Security Note

Do not place a Gemini or Google AI key inside `app.js`, `index.html`, or any other frontend file. If a key was pasted into chat or committed anywhere, treat it as exposed and rotate it.

## AI modes (demo vs production)

| Mode | `APP_ENV` in `runtime-config.js` | Browser Gemini key panel | Where AI runs |
|------|----------------------------------|----------------------------|----------------|
| **Development / demo** | `development` (default) | Shown unless `ENABLE_BROWSER_GEMINI_DEMO: false` | If `AI_ENDPOINT` is set → worker first; if empty → optional browser key demo |
| **Production** | `production` | Hidden; keys cannot be saved from the UI | **Only** `AI_ENDPOINT` (no client provider keys) |

Optional: `AI_CLIENT_DEBUG: true` logs coarse routing events in the console (no secrets).

Worker-side: set `AI_LOG` to `1` or `true` for structured JSON logs (extend `logAi` in `worker/src/index.js` to ship to your log provider).

## Migration path (static site → full product)

1. **Now:** Static Pages + optional Cloudflare Worker for AI. Configure `AI_ENDPOINT` + deploy worker with `GEMINI_API_KEY`. Use `APP_ENV: 'production'` on the public site when the worker is live.
2. **Next API:** Add a small backend (or extend the worker with Durable Objects / routes) for `POST /reports`, auth callbacks, and webhooks; keep AI explanation behind the same trust boundary as today’s worker.
3. **Data plane:** Postgres (e.g. Supabase, Neon, RDS) for users, saved reports, audit trails; object storage or DB blobs for large payloads if needed.
4. **Leads / experts:** CRM (HubSpot, Pipedrive) or a `leads` table + internal admin UI; email via Postmark/SendGrid/SES.

## Live AI Architecture

1. The GitHub Pages frontend runs the deterministic rule engine in the browser, then posts `{ profile, locale, ruleEngineResult }` to `AI_ENDPOINT`.
2. The worker **requires** `ruleEngineResult` (from `engine/rule-engine.js`) so the model only generates an **explanation layer** and cannot replace the structured assessment.
3. The worker fetches current official source pages from GOV.UK and EU portals.
4. The worker sends a grounded **explanation-only** prompt to Gemini using a server-side environment secret.
5. The worker returns `{ explanation, uncertaintyNotes, caveats, sourcesUsed }` plus official source links.
6. The frontend renders the rule-engine snapshot first, then the AI explanation when available.

## Report export, email, share links, and history

**Current stack:** GitHub Pages serves **only static files**. There is **no app backend** for persistence or outbound email; the Cloudflare Worker in this repo is for **AI explanation** calls only.

| Capability | Demo (this repo) | Production-oriented approach |
|------------|------------------|------------------------------|
| **PDF** | Branded print layout (`report/report-renderer.js` → browser **Save as PDF** from print dialog) | Server-rendered PDF (e.g. headless Chromium, Prince, or a PDF API) for consistent output and audit trails |
| **Email** | Mailto + copy-to-clipboard modal (message composed on the user’s device) | Transactional email provider (SES, SendGrid, Postmark) via your API; store consent and templates server-side |
| **Share link** | Compressed `{ profile, aiAnalysis, locale }` in the URL hash; recipient’s browser recomputes the rule engine | Short opaque IDs: `POST /reports` → store payload in **KV / Postgres / S3**, `GET /reports/:id` returns HTML or JSON |
| **History** | `localStorage` (per browser, capped list) | Authenticated user + server storage |

The UI in `app.js` wires buttons to these modules so you can later **swap persistence** for API calls without rewriting the assessment form.

## Local Frontend Development

Serve the site with any static server:

```powershell
python -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

## Worker Setup

This repo includes a Cloudflare Worker example because GitHub Pages cannot safely run secret-backed AI calls.

1. Install Wrangler.
2. Create a worker secret for `GEMINI_API_KEY`.
3. Optionally set `GEMINI_MODEL_PRIMARY` and `GEMINI_MODEL_FALLBACK`.
4. Optionally override `OFFICIAL_SOURCE_URLS`.
5. Deploy the worker and copy its public URL into `runtime-config.js`.

Example:

```powershell
npm install -g wrangler
cd worker
wrangler secret put GEMINI_API_KEY
wrangler deploy
```

Then update `runtime-config.js` (public values only — never commit secrets):

```js
window.APP_CONFIG = window.APP_CONFIG || {
  APP_ENV: 'production',
  AI_ENDPOINT: 'https://your-worker-domain.example',
  AI_TIMEOUT_MS: 30000
};
```

For local testing without a worker, omit `AI_ENDPOINT` and keep `APP_ENV: 'development'` so the optional browser Gemini panel can be used.

## GitHub Pages Deployment

`pages.yml` copies these static assets into the published site:

- `index.html`, `report-view.html`
- `app.js`
- `translations.js`
- `runtime-config.js`
- `data.json`
- `robots.txt`
- `engine/`, `report/`, and **`services/`** (AI environment + explanation layer)

Push to `main` to trigger deployment.

## Scheduled Official-Source Updates

The GitHub Actions workflow `ai-updater.yml` can refresh `data.json` on a weekly schedule by:

1. Fetching official source pages
2. Passing their contents plus the current JSON to the updater model
3. Writing back `data.json` only when meaningful changes are found

Required secrets for that flow:

- `LLM_API_KEY`
- `LLM_MODEL` optional
- `LLM_BASE_URL` optional
- `OFFICIAL_SOURCE_URLS` optional

## Suggested stack for saved reports, accounts, analytics, admin, leads

A pragmatic default that stays close to your current setup:

- **Frontend:** Keep static hosting (Pages) or move to Vercel/Netlify if you add SSR later.
- **API + auth:** Supabase Auth, Clerk, or Auth0; API on Cloudflare Workers + D1/Hyperdrive to Postgres, or a Node service (Fly.io, Railway) if you prefer a traditional server.
- **Database:** Postgres for users, report snapshots (JSONB), lead records, and audit logs.
- **Analytics:** Plausible or PostHog for product analytics; worker `AI_LOG` → Axiom / Datadog for operational AI metrics.
- **Admin + expert leads:** Retool or an internal Next.js admin reading the same Postgres; sync leads to HubSpot/Pipedrive via webhook or n8n.

## Environment Variables

See `.env.example` for the full list. The main variables are:

- `AI_ENDPOINT`: public URL used by the frontend (set in `runtime-config.js` for the browser; not a worker secret)
- `GEMINI_API_KEY`: server-side worker secret
- `GEMINI_MODEL_PRIMARY`: first worker model to try
- `GEMINI_MODEL_FALLBACK`: fallback worker model if the first call fails
- `OFFICIAL_SOURCE_URLS`: comma-separated official source pages
- `LLM_API_KEY`: updater script key

## Official Sources

The default worker configuration currently uses official pages from:

- GOV.UK guidance on placing manufactured goods on the market in Great Britain
- Your Europe guidance on technical documentation
- Your Europe guidance on CE marking
- Your Europe guidance on declarations of conformity

You can replace or expand these sources later depending on the product categories you want to support.
