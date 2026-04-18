import { invokeStructuredJsonModel } from './ai-provider.js';

const DEFAULT_SOURCE_URLS = [
  'https://www.gov.uk/guidance/placing-manufactured-goods-on-the-market-in-great-britain',
  'https://europa.eu/youreurope/business/product-requirements/compliance/preparing-technical-documentation/index_en.htm',
  'https://europa.eu/youreurope/business/product-requirements/labels-markings/ce-marking/index_en.htm',
  'https://europa.eu/youreurope/business/product-requirements/compliance/declaration-of-conformity/index_en.htm'
];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}

function getOfficialSourceUrls(env) {
  const raw = env.OFFICIAL_SOURCE_URLS || env.OFFICIAL_SOURCE_URL || '';
  if (!raw.trim()) {
    return DEFAULT_SOURCE_URLS;
  }

  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchSourceContext(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'CertPathAIWorker/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`Source fetch failed: ${response.status} ${url}`);
  }

  const html = await response.text();
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : url;
  const text = stripHtml(html).slice(0, 8000);

  return { title, url, text };
}

function validateProfile(profile) {
  if (!profile || typeof profile !== 'object') {
    return 'Profile payload is missing.';
  }

  const requiredFields = [
    'productName',
    'salesChannel',
    'productCategory',
    'sellerRole',
    'ceStatus',
    'electrical',
    'battery',
    'wireless',
    'skinContact',
    'children'
  ];

  for (const field of requiredFields) {
    if (!profile[field]) {
      return `Profile field is missing: ${field}`;
    }
  }

  if (!Array.isArray(profile.markets) || profile.markets.length === 0) {
    return 'At least one target market is required.';
  }

  return '';
}

/** Soft cap on raw POST body (bytes) — tune for your CDN/WAF limits. */
const MAX_JSON_BODY_BYTES = 400_000;

/**
 * Optional structured logs when env.AI_LOG is '1' or 'true'.
 * Hook log shipping (Axiom, Datadog, etc.) here in production.
 */
function logAi(env, level, message, meta = {}) {
  if (env.AI_LOG !== '1' && env.AI_LOG !== 'true') {
    return;
  }
  console.log(
    JSON.stringify({
      ts: new Date().toISOString(),
      level,
      message,
      ...meta
    })
  );
}

/**
 * Rate limiting placeholder: return an error string to block, or '' to allow.
 * Implement with Cloudflare Rate Limiting, Durable Object counters, or KV sliding window.
 */
function rateLimitCheck(request, env) {
  if (env.DISABLE_RATE_LIMIT === '1' || env.DISABLE_RATE_LIMIT === 'true') {
    return '';
  }
  void request;
  void env;
  return '';
}

function validateRuleEngineResult(value) {
  if (!value || typeof value !== 'object') {
    return 'ruleEngineResult is required (run the browser rule engine first).';
  }
  if (typeof value.engineVersion !== 'string' || !value.engineVersion.trim()) {
    return 'ruleEngineResult.engineVersion is required.';
  }
  if (!Array.isArray(value.likelyComplianceAreas) || !Array.isArray(value.likelyDocumentsNeeded)) {
    return 'ruleEngineResult must include structured arrays from the deterministic engine.';
  }
  return '';
}

function buildExplanationPrompt(profile, locale, sources, ruleEngineResult) {
  return `
You write a plain-language explanation for e-commerce sellers about a UK/EU compliance triage snapshot.

Authoritative facts:
- A deterministic rule engine has ALREADY produced the only authoritative assessment (domains, documents, gaps, risks, next steps). It is provided as JSON in ruleEngineResult.
- Official pages below are for tone and reading suggestions only — do not contradict ruleEngineResult.

Strict rules:
- Do NOT add new compliance domains, legal conclusions, or document types beyond what ruleEngineResult supports.
- Do NOT output separate lists that duplicate ruleEngineResult arrays as if they were new findings.
- Do NOT present the result as legal advice or a formal conformity decision.
- Call out uncertainty using ruleEngineResult.assumptions and confidenceNotes where relevant.
- Do not mention being an AI model.

Write in locale "${locale || 'en'}".

Return JSON only in this exact shape:
{
  "explanation": "2–4 short paragraphs for a busy seller",
  "uncertaintyNotes": ["optional short bullets"],
  "caveats": ["optional reminders about expert verification"],
  "sourcesUsed": [
    { "title": "...", "url": "..." }
  ]
}

Only include source URLs that appear in this allowed list:
${sources.map((s) => `- ${s.title}: ${s.url}`).join('\n')}

Product intake (form):
${JSON.stringify(profile, null, 2)}

ruleEngineResult (deterministic — do not contradict):
${JSON.stringify(ruleEngineResult, null, 2)}

Official source excerpts (context only):
${sources.map((source) => `Title: ${source.title}\nURL: ${source.url}\nContent: ${source.text}`).join('\n\n---\n\n')}
`.trim();
}

function normalizeExplanation(analysis, sources) {
  const safeArray = (value) => Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean)
    : [];

  const knownSources = new Map(sources.map((source) => [source.url, { title: source.title, url: source.url }]));
  const normalizedSources = Array.isArray(analysis.sourcesUsed)
    ? analysis.sourcesUsed
      .map((item) => {
        const url = typeof item?.url === 'string' ? item.url.trim() : '';
        if (url && knownSources.has(url)) {
          return knownSources.get(url);
        }
        return null;
      })
      .filter(Boolean)
    : [];

  let explanation = typeof analysis.explanation === 'string' ? analysis.explanation.trim() : '';
  let uncertaintyNotes = safeArray(analysis.uncertaintyNotes);
  let caveats = safeArray(analysis.caveats);

  if (!explanation && typeof analysis.summary === 'string' && analysis.summary.trim()) {
    explanation = analysis.summary.trim();
    uncertaintyNotes = uncertaintyNotes.length ? uncertaintyNotes : safeArray(analysis.missing);
    caveats = caveats.length ? caveats : safeArray(analysis.risks);
  }

  return {
    explanation,
    uncertaintyNotes,
    caveats,
    sourcesUsed: normalizedSources.length ? normalizedSources : sources.map((source) => ({ title: source.title, url: source.url }))
  };
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed.' }, 405);
    }

    try {
      const rl = rateLimitCheck(request, env);
      if (rl) {
        logAi(env, 'warn', 'rate_limited', { reason: rl });
        return jsonResponse({ error: rl }, 429);
      }

      const bodyText = await request.text();
      if (bodyText.length > MAX_JSON_BODY_BYTES) {
        logAi(env, 'warn', 'body_too_large', { length: bodyText.length });
        return jsonResponse({ error: 'Request body too large.' }, 413);
      }

      let body;
      try {
        body = JSON.parse(bodyText);
      } catch {
        return jsonResponse({ error: 'Invalid JSON body.' }, 400);
      }

      const { profile, locale, ruleEngineResult } = body;
      const profileError = validateProfile(profile);
      if (profileError) {
        logAi(env, 'info', 'validation_failed', { field: 'profile' });
        return jsonResponse({ error: profileError }, 400);
      }

      const engineError = validateRuleEngineResult(ruleEngineResult);
      if (engineError) {
        logAi(env, 'info', 'validation_failed', { field: 'ruleEngineResult' });
        return jsonResponse({ error: engineError }, 400);
      }

      logAi(env, 'info', 'analyze_start', { locale: locale || 'en' });

      const sourceUrls = getOfficialSourceUrls(env);
      const sources = await Promise.all(sourceUrls.map((url) => fetchSourceContext(url)));
      const prompt = buildExplanationPrompt(profile, locale, sources, ruleEngineResult);
      const rawAnalysis = await invokeStructuredJsonModel(prompt, env);
      const analysis = normalizeExplanation(rawAnalysis, sources);

      logAi(env, 'info', 'analyze_ok', {});

      return jsonResponse({
        analysis
      });
    } catch (error) {
      logAi(env, 'error', 'analyze_failed', { message: error instanceof Error ? error.message : String(error) });
      return jsonResponse({
        error: error instanceof Error ? error.message : 'Unexpected worker error.'
      }, 500);
    }
  }
};
