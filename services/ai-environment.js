/**
 * CertPath AI runtime environment (browser).
 *
 * Controlled via window.APP_CONFIG (see runtime-config.js):
 * - APP_ENV: 'development' | 'production' (default: 'development' for backwards compatibility)
 * - AI_ENDPOINT: HTTPS URL of the server-side worker/API (required in production)
 * - ENABLE_BROWSER_GEMINI_DEMO: optional boolean; in development, defaults to true unless false
 * - AI_CLIENT_DEBUG: if truthy, the AI service layer logs coarse events to the console (no secrets)
 *
 * Production rule: never call Gemini from the browser with a user-supplied key.
 * Development rule: if AI_ENDPOINT is unset, optional localStorage Gemini key demo may run.
 */
(function initCertPathAiEnvironment(global) {
  'use strict';

  function config() {
    return global.window?.APP_CONFIG || {};
  }

  /** @returns {'development' | 'production'} */
  function getAppEnv() {
    const raw = String(config().APP_ENV || 'development').toLowerCase();
    return raw === 'production' ? 'production' : 'development';
  }

  function isProductionMode() {
    return getAppEnv() === 'production';
  }

  /**
   * Browser-only Gemini demo (localStorage key). Disabled in production regardless of flag.
   */
  function isBrowserGeminiDemoEnabled() {
    if (isProductionMode()) {
      return false;
    }
    const explicit = config().ENABLE_BROWSER_GEMINI_DEMO;
    if (explicit === false) {
      return false;
    }
    if (explicit === true) {
      return true;
    }
    return true;
  }

  function isServerAiConfigured() {
    return Boolean(String(config().AI_ENDPOINT || '').trim());
  }

  /**
   * When true, AI explanations must go through AI_ENDPOINT only (worker / future API).
   */
  function requiresServerSideAi() {
    return isProductionMode();
  }

  /**
   * Toggle `#ai-browser-demo-panel` before app.js runs to avoid a flash of the key UI in production.
   */
  function syncBrowserDemoPanelVisibility() {
    const doc = global.document;
    if (!doc) {
      return;
    }
    const panel = doc.getElementById('ai-browser-demo-panel');
    if (!panel) {
      return;
    }
    if (isBrowserGeminiDemoEnabled()) {
      panel.classList.remove('hidden');
    } else {
      panel.classList.add('hidden');
    }
  }

  global.CertPathAiEnvironment = {
    getAppEnv,
    isProductionMode,
    isBrowserGeminiDemoEnabled,
    isServerAiConfigured,
    requiresServerSideAi,
    syncBrowserDemoPanelVisibility
  };

  syncBrowserDemoPanelVisibility();
}(typeof window !== 'undefined' ? window : globalThis));
