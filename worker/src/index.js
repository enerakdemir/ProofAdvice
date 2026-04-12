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
      'User-Agent': 'CertiRehberAIWorker/1.0'
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

function extractJson(text) {
  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fencedMatch ? fencedMatch[1] : trimmed;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Model response did not contain a JSON object.');
  }

  return JSON.parse(candidate.slice(start, end + 1));
}

function buildPrompt(profile, locale, sources) {
  return `
You are a UK/EU product compliance assistant for small e-commerce sellers.

Task:
- Review the product intake.
- Use only the official-source context below.
- Do not invent legal conclusions or certifications.
- Be cautious and practical.
- If information is missing, say so explicitly.
- Prefer seller-friendly language.
- Focus on likely requirements for UK and/or EU market entry.

Return JSON only in this exact shape:
{
  "summary": "short paragraph",
  "requiredDocuments": ["..."],
  "regulations": ["..."],
  "missing": ["..."],
  "risks": ["..."],
  "nextSteps": ["..."],
  "supportPath": ["..."],
  "sourcesUsed": [
    { "title": "...", "url": "..." }
  ]
}

Rules:
- Keep arrays concise and actionable.
- Only include source URLs from the provided source list.
- If a point is uncertain, place it under "missing" or "risks" rather than overstating.
- Do not mention being an AI model.
- Write the output in locale "${locale || 'en'}".

Product intake:
${JSON.stringify(profile, null, 2)}

Official source context:
${sources.map((source) => `Title: ${source.title}\nURL: ${source.url}\nContent: ${source.text}`).join('\n\n---\n\n')}
`.trim();
}

function getPreferredModels(env) {
  return [
    env.GEMINI_MODEL_PRIMARY || 'gemini-3.1-flash-lite-preview',
    env.GEMINI_MODEL_FALLBACK || 'gemini-3-flash-preview'
  ]
    .map((item) => item.trim())
    .filter(Boolean);
}

async function callGeminiModel(prompt, apiKey, model) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini request failed for ${model}: ${response.status} ${errorText}`);
  }

  const payload = await response.json();
  const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
  if (!text.trim()) {
    throw new Error(`Gemini returned an empty response for ${model}.`);
  }

  return extractJson(text);
}

async function callGemini(prompt, env) {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const models = getPreferredModels(env);
  let lastError = null;

  for (const model of models) {
    try {
      return await callGeminiModel(prompt, apiKey, model);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('No Gemini model could complete the request.');
}

function normalizeAnalysis(analysis, sources) {
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

  return {
    summary: typeof analysis.summary === 'string' ? analysis.summary.trim() : '',
    requiredDocuments: safeArray(analysis.requiredDocuments),
    regulations: safeArray(analysis.regulations),
    missing: safeArray(analysis.missing),
    risks: safeArray(analysis.risks),
    nextSteps: safeArray(analysis.nextSteps),
    supportPath: safeArray(analysis.supportPath),
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
      const { profile, locale } = await request.json();
      const profileError = validateProfile(profile);
      if (profileError) {
        return jsonResponse({ error: profileError }, 400);
      }

      const sourceUrls = getOfficialSourceUrls(env);
      const sources = await Promise.all(sourceUrls.map((url) => fetchSourceContext(url)));
      const prompt = buildPrompt(profile, locale, sources);
      const analysis = await callGemini(prompt, env);

      return jsonResponse({
        analysis: normalizeAnalysis(analysis, sources)
      });
    } catch (error) {
      return jsonResponse({
        error: error instanceof Error ? error.message : 'Unexpected worker error.'
      }, 500);
    }
  }
};
