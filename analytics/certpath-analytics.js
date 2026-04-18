/**
 * CertPath product analytics — lightweight client instrumentation for future SaaS.
 *
 * - No third-party SDKs; optional HTTP ingest via APP_CONFIG.ANALYTICS_ENDPOINT (POST + sendBeacon).
 * - Optional hook: window.CertPathAnalyticsHook = function (envelope) { ... } for tests or custom routing.
 * - Debug: APP_CONFIG.ANALYTICS_DEBUG === true or ?certpath_analytics_debug=1 in URL → console output.
 *
 * See docs/SAAS_FOUNDATIONS.md for event catalog, suggested Postgres schema, and backend phases.
 */
(function initCertPathAnalytics() {
  'use strict';

  var SESSION_ID_KEY = 'certpath-analytics-session-id';
  var DEVICE_ID_KEY = 'certpath-analytics-device-id';

  var EVENTS = Object.freeze({
    LANDING_PAGE_CTA_CLICK: 'landing_page_cta_click',
    ASSESSMENT_STARTED: 'assessment_started',
    ASSESSMENT_COMPLETED: 'assessment_completed',
    RESULT_VIEWED: 'result_viewed',
    PDF_DOWNLOADED: 'pdf_downloaded',
    SUPPORT_REQUESTED: 'support_requested',
    PACKAGE_CTA_CLICKED: 'package_cta_clicked'
  });

  function uuid() {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
      return globalThis.crypto.randomUUID();
    }
    return 'cp_' + String(Date.now()) + '_' + String(Math.random()).slice(2, 10);
  }

  function getOrCreateSessionId() {
    try {
      var existing = sessionStorage.getItem(SESSION_ID_KEY);
      if (existing) {
        return existing;
      }
      var id = uuid();
      sessionStorage.setItem(SESSION_ID_KEY, id);
      return id;
    } catch {
      return uuid();
    }
  }

  function getOrCreateDeviceId() {
    try {
      var existing = localStorage.getItem(DEVICE_ID_KEY);
      if (existing) {
        return existing;
      }
      var id = uuid();
      localStorage.setItem(DEVICE_ID_KEY, id);
      return id;
    } catch {
      return '';
    }
  }

  function isDebugEnabled() {
    try {
      if (globalThis.APP_CONFIG && globalThis.APP_CONFIG.ANALYTICS_DEBUG) {
        return true;
      }
      return /(?:^|[?&])certpath_analytics_debug=1(?:&|$)/.test(globalThis.location.search || '');
    } catch {
      return false;
    }
  }

  function getEndpoint() {
    var c = globalThis.APP_CONFIG || {};
    return (c.ANALYTICS_ENDPOINT || '').trim();
  }

  function buildEnvelope(eventName, properties) {
    var appMeta = globalThis.__CERTPATH_APP_META__ || {};
    return {
      v: 1,
      event: eventName,
      ts: new Date().toISOString(),
      properties: properties && typeof properties === 'object' ? properties : {},
      context: {
        session_id: getOrCreateSessionId(),
        device_id: getOrCreateDeviceId() || undefined,
        page_path: globalThis.location.pathname + (globalThis.location.search || ''),
        referrer: globalThis.document.referrer || undefined,
        app_release: appMeta.version || undefined,
        data_release: appMeta.dataVersion || undefined
      }
    };
  }

  function postEnvelope(envelope) {
    var url = getEndpoint();
    if (!url) {
      return;
    }
    var body = JSON.stringify(envelope);
    try {
      if (navigator.sendBeacon) {
        var blob = new Blob([body], { type: 'application/json' });
        if (navigator.sendBeacon(url, blob)) {
          return;
        }
      }
    } catch {
      /* fall through */
    }
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
      mode: 'cors',
      keepalive: true
    }).catch(function () {
      /* non-blocking */
    });
  }

  function track(eventName, properties) {
    if (!eventName || typeof eventName !== 'string') {
      return;
    }
    var envelope = buildEnvelope(eventName, properties);
    if (typeof globalThis.CertPathAnalyticsHook === 'function') {
      try {
        globalThis.CertPathAnalyticsHook(envelope);
      } catch (err) {
        if (isDebugEnabled()) {
          console.warn('[CertPathAnalytics] hook error', err);
        }
      }
    }
    if (isDebugEnabled()) {
      console.info('[CertPathAnalytics]', envelope.event, envelope);
    }
    postEnvelope(envelope);
  }

  globalThis.CertPathAnalytics = Object.freeze({
    EVENTS: EVENTS,
    track: track,
    getSessionId: getOrCreateSessionId,
    getDeviceId: getOrCreateDeviceId
  });
}());
