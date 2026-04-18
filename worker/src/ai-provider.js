/**
 * Server-side LLM provider abstraction (Worker).
 *
 * Today: Google Gemini REST (`generateContent`). To swap vendors, implement the same
 * contract as invokeStructuredJsonModel and point the worker handler here instead.
 *
 * Env:
 * - GEMINI_API_KEY (secret)
 * - GEMINI_MODEL_PRIMARY, GEMINI_MODEL_FALLBACK (optional vars)
 */

function getPreferredModels(env) {
  return [
    env.GEMINI_MODEL_PRIMARY || 'gemini-3.1-flash-lite-preview',
    env.GEMINI_MODEL_FALLBACK || 'gemini-3-flash-preview'
  ]
    .map((item) => String(item).trim())
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

  return text;
}

/**
 * @param {string} prompt
 * @param {object} env Worker env bindings
 * @returns {Promise<object>} Parsed JSON object from model output
 */
export async function invokeStructuredJsonModel(prompt, env) {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const models = getPreferredModels(env);
  let lastError = null;

  for (const model of models) {
    try {
      const text = await callGeminiModel(prompt, apiKey, model);
      const trimmed = text.trim();
      const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      const candidate = fencedMatch ? fencedMatch[1] : trimmed;
      const start = candidate.indexOf('{');
      const end = candidate.lastIndexOf('}');
      if (start === -1 || end === -1 || end <= start) {
        throw new Error('Model response did not contain a JSON object.');
      }
      return JSON.parse(candidate.slice(start, end + 1));
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('No Gemini model could complete the request.');
}
