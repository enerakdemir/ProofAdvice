window.APP_CONFIG = window.APP_CONFIG || {
  /**
   * deployment mode
   * - 'development': optional browser Gemini key demo if AI_ENDPOINT is empty
   * - 'production': AI_ENDPOINT required; browser key UI disabled; no client-side provider keys
   */
  APP_ENV: 'development',

  // Set this to your deployed worker URL, for example:
  // AI_ENDPOINT: 'https://certpath-ai-worker.your-subdomain.workers.dev',
  AI_ENDPOINT: '',
  AI_TIMEOUT_MS: 30000,

  /** In development only: set false to hide browser Gemini demo even without AI_ENDPOINT */
  // ENABLE_BROWSER_GEMINI_DEMO: true,

  /** Set true to log AI routing events to the console (no secrets). */
  // AI_CLIENT_DEBUG: false,

  /**
   * Product analytics (see analytics/certpath-analytics.js and docs/SAAS_FOUNDATIONS.md).
   * POST JSON envelopes { v, event, ts, properties, context } — optional; leave empty in static demo.
   */
  // ANALYTICS_ENDPOINT: 'https://api.example.com/v1/analytics/events',
  // ANALYTICS_DEBUG: false
};
