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
- `app.js`: Frontend state, form logic, fallback analysis, and live AI request flow
- `translations.js`: UI translations
- `runtime-config.js`: Frontend runtime configuration, including `AI_ENDPOINT`
- `data.json`: Local structured content for packages, resources, FAQ, and filters
- `update_data.py`: Official-source fetch plus LLM-assisted content refresh for `data.json`
- `worker/src/index.js`: Secure AI endpoint that fetches official sources and calls Gemini server-side
- `worker/wrangler.toml`: Cloudflare Worker config

## Security Note

Do not place a Gemini or Google AI key inside `app.js`, `index.html`, or any other frontend file. If a key was pasted into chat or committed anywhere, treat it as exposed and rotate it.

## Live AI Architecture

1. The GitHub Pages frontend posts product intake data to `AI_ENDPOINT`.
2. The worker fetches current official source pages from GOV.UK and EU portals.
3. The worker sends the grounded prompt to Gemini using a server-side environment secret.
4. The worker returns structured JSON plus the official source links used.
5. The frontend renders that live AI result, with the built-in rules engine as fallback.

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

Then update `runtime-config.js`:

```js
window.APP_CONFIG = window.APP_CONFIG || {
  AI_ENDPOINT: 'https://your-worker-domain.example',
  AI_TIMEOUT_MS: 30000
};
```

## GitHub Pages Deployment

`pages.yml` copies these static assets into the published site:

- `index.html`
- `app.js`
- `translations.js`
- `runtime-config.js`
- `data.json`
- `robots.txt`

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

## Environment Variables

See `.env.example` for the full list. The main variables are:

- `AI_ENDPOINT`: public URL used by the frontend
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
