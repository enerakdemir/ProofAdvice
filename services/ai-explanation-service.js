/**
 * CertPath AI explanation service (browser Layer 2).
 *
 * Single entry: requestExplanation(options) — routes by CertPathAiEnvironment + AI_ENDPOINT.
 * Replace Gemini by swapping the HTTP transport used in callBrowserGeminiModel (dev) and
 * the server-side provider in the worker (see worker/src/ai-provider.js).
 *
 * This module intentionally does not import app.js; the host passes runEngine and key accessors.
 */
(function initCertPathAiExplanationService(global) {
  'use strict';

  const OFFICIAL_SOURCE_REFERENCES = [
    {
      title: 'GOV.UK: placing manufactured goods on the market in Great Britain',
      url: 'https://www.gov.uk/guidance/placing-manufactured-goods-on-the-market-in-great-britain'
    },
    {
      title: 'Your Europe: preparing technical documentation',
      url: 'https://europa.eu/youreurope/business/product-requirements/compliance/preparing-technical-documentation/index_en.htm'
    },
    {
      title: 'Your Europe: CE marking',
      url: 'https://europa.eu/youreurope/business/product-requirements/labels-markings/ce-marking/index_en.htm'
    },
    {
      title: 'Your Europe: declaration of conformity',
      url: 'https://europa.eu/youreurope/business/product-requirements/compliance/declaration-of-conformity/index_en.htm'
    }
  ];

  const BROWSER_GEMINI_MODELS = ['gemini-3.1-flash-lite-preview', 'gemini-3-flash-preview'];

  function normalizeTextList(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean);
  }

  function normalizeSourceList(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value
      .map((item) => {
        if (typeof item === 'string') {
          const trimmed = item.trim();
          return trimmed ? { title: trimmed, url: trimmed } : null;
        }
        if (!item || typeof item !== 'object') {
          return null;
        }
        const title = typeof item.title === 'string' ? item.title.trim() : '';
        const url = typeof item.url === 'string' ? item.url.trim() : '';
        if (!title && !url) {
          return null;
        }
        return { title: title || url, url };
      })
      .filter(Boolean);
  }

  function normalizeAiExplanation(value) {
    if (!value || typeof value !== 'object') {
      return null;
    }
    const explanation = typeof value.explanation === 'string' ? value.explanation.trim() : '';
    if (explanation) {
      return {
        explanation,
        uncertaintyNotes: normalizeTextList(value.uncertaintyNotes),
        caveats: normalizeTextList(value.caveats),
        sourcesUsed: normalizeSourceList(value.sourcesUsed)
      };
    }
    const legacySummary = typeof value.summary === 'string' ? value.summary.trim() : '';
    if (!legacySummary) {
      return null;
    }
    return {
      explanation: legacySummary,
      uncertaintyNotes: normalizeTextList(value.missing),
      caveats: normalizeTextList(value.risks),
      sourcesUsed: normalizeSourceList(value.sourcesUsed)
    };
  }

  function parseModelJson(text) {
    const trimmed = text.trim();
    const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    const candidate = fencedMatch ? fencedMatch[1] : trimmed;
    return JSON.parse(candidate);
  }

  function buildBrowserPrompt(profile, ruleEngineResult, locale) {
    return `
You explain a pre-computed compliance triage for UK/EU-facing e-commerce sellers.

Hard rules:
- A deterministic rule engine has already produced the ONLY authoritative lists (documents, gaps, risks, domains). Treat ruleEngineResult as ground truth.
- Do NOT add new compliance domains, legal conclusions, or document types that are not clearly supported by ruleEngineResult.
- Do NOT present the output as legal advice or a formal conformity decision.
- Reflect uncertainty and assumptions explicitly (especially where ruleEngineResult.assumptions or confidenceNotes exist).
- Use the official references below only as generic context for tone; do not cite facts that contradict ruleEngineResult.

Write in locale "${locale}".

Return JSON only in this exact format:
{
  "explanation": "2–4 short paragraphs in plain language for a busy seller",
  "uncertaintyNotes": ["optional bullets where triage may be incomplete"],
  "caveats": ["optional short reminders about expert verification"],
  "sourcesUsed": [
    { "title": "...", "url": "..." }
  ]
}

Only use URLs from this official list for sourcesUsed:
${OFFICIAL_SOURCE_REFERENCES.map((source) => `- ${source.title}: ${source.url}`).join('\n')}

Product intake (form):
${JSON.stringify(profile, null, 2)}

Rule engine result (authoritative — do not contradict):
${JSON.stringify(ruleEngineResult, null, 2)}
`.trim();
  }

  /**
   * Browser-side Gemini HTTP call (development / demo only).
   * Swap: replace URL construction and body schema when moving to another vendor.
   */
  async function callBrowserGeminiModel(prompt, apiKey, model, signal) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      }),
      signal
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Browser Gemini request failed for ${model}: ${response.status} ${errorText}`);
    }

    const payload = await response.json();
    const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
    if (!text.trim()) {
      throw new Error(`Browser Gemini returned an empty response for ${model}.`);
    }

    const parsed = parseModelJson(text);
    const normalized = normalizeAiExplanation(parsed);
    if (!normalized) {
      throw new Error('Browser Gemini returned an unrecognised explanation payload.');
    }
    if (!normalized.sourcesUsed?.length) {
      normalized.sourcesUsed = normalizeSourceList(OFFICIAL_SOURCE_REFERENCES);
    }
    return normalized;
  }

  function aiLog(options, event, detail) {
    const dbg = global.window?.APP_CONFIG?.AI_CLIENT_DEBUG;
    if (!dbg) {
      return;
    }
    console.info('[CertPath AI]', event, detail);
    if (typeof options.log === 'function') {
      options.log(event, detail);
    }
  }

  async function fetchViaWorker(options, endpoint, signal) {
    const { profile, locale, runEngine } = options;
    const ruleEngineResult = runEngine(profile);
    if (!ruleEngineResult) {
      return { ok: false, reason: 'engine_missing' };
    }

    aiLog(options, 'worker_request', { endpoint: endpoint.replace(/\?.*/, '') });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locale,
        profile,
        ruleEngineResult
      }),
      signal
    });

    if (!response.ok) {
      aiLog(options, 'worker_http_error', { status: response.status });
      return { ok: false, reason: 'worker_http_error', status: response.status };
    }

    const payload = await response.json();
    const analysis = normalizeAiExplanation(payload.analysis);
    if (!analysis) {
      aiLog(options, 'worker_payload_invalid', {});
      return { ok: false, reason: 'worker_invalid_payload' };
    }

    return { ok: true, analysis, channel: 'worker' };
  }

  async function fetchViaBrowserDemo(options, signal) {
    const { profile, locale, getBrowserApiKey, runEngine } = options;
    const apiKey = getBrowserApiKey();
    if (!apiKey) {
      return { ok: false, reason: 'no_browser_key' };
    }

    const ruleEngineResult = runEngine(profile);
    if (!ruleEngineResult) {
      return { ok: false, reason: 'engine_missing' };
    }

    const prompt = buildBrowserPrompt(profile, ruleEngineResult, locale);
    let lastError = null;

    for (const model of BROWSER_GEMINI_MODELS) {
      try {
        aiLog(options, 'browser_gemini_attempt', { model });
        const analysis = await callBrowserGeminiModel(prompt, apiKey, model, signal);
        return { ok: true, analysis, channel: 'browser', model };
      } catch (err) {
        lastError = err;
        aiLog(options, 'browser_gemini_model_failed', { model: String(err?.message || err) });
      }
    }

    return { ok: false, reason: 'browser_gemini_failed', error: lastError };
  }

  /**
   * @param {object} options
   * @param {object} options.profile
   * @param {string} options.locale
   * @param {function} options.runEngine (profile) => ruleEngineResult | null
   * @param {function} options.getBrowserApiKey () => string
   * @param {function} [options.onStatus] (message, tone) => void
   * @param {function} [options.log] (event, detail) => void
   */
  async function requestExplanation(options) {
    const env = global.CertPathAiEnvironment;
    if (!env) {
      console.error('CertPathAiEnvironment not loaded; include services/ai-environment.js before this file.');
      return { ok: false, reason: 'env_missing' };
    }

    const cfg = global.window?.APP_CONFIG || {};
    const endpoint = String(cfg.AI_ENDPOINT || '').trim();
    const timeoutMs = Number(cfg.AI_TIMEOUT_MS || 30000);
    const controller = new AbortController();
    const timeoutId = global.setTimeout(() => controller.abort(), timeoutMs);

    const onStatus = typeof options.onStatus === 'function' ? options.onStatus : () => {};

    try {
      if (env.requiresServerSideAi()) {
        if (!endpoint) {
          aiLog(options, 'blocked_production_no_endpoint', {});
          return { ok: false, reason: 'production_no_endpoint' };
        }
        onStatus('', 'neutral');
        onStatus(
          typeof options.translate === 'function' ? options.translate('results.aiLoading') : '',
          'info'
        );
        const out = await fetchViaWorker(options, endpoint, controller.signal);
        if (!out.ok) {
          return out;
        }
        return out;
      }

      if (endpoint) {
        onStatus('', 'neutral');
        onStatus(
          typeof options.translate === 'function' ? options.translate('results.aiLoading') : '',
          'info'
        );
        const out = await fetchViaWorker(options, endpoint, controller.signal);
        if (out.ok) {
          return out;
        }
        aiLog(options, 'worker_failed_fallback_skipped', { reason: out.reason });
        return { ok: false, reason: out.reason || 'worker_failed' };
      }

      if (!env.isBrowserGeminiDemoEnabled()) {
        return { ok: false, reason: 'browser_demo_disabled' };
      }

      const out = await fetchViaBrowserDemo(options, controller.signal);
      return out;
    } catch (err) {
      if (err?.name === 'AbortError') {
        aiLog(options, 'request_aborted', {});
        return { ok: false, reason: 'aborted' };
      }
      aiLog(options, 'request_exception', { message: String(err?.message || err) });
      return { ok: false, reason: 'exception', error: err };
    } finally {
      global.clearTimeout(timeoutId);
    }
  }

  global.CertPathAiExplanationService = {
    requestExplanation,
    normalizeAiExplanation,
    OFFICIAL_SOURCE_REFERENCES
  };
}(typeof window !== 'undefined' ? window : globalThis));
