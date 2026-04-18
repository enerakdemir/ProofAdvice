/**
 * Read-only report page: ?id= for saved history, #p=gz|raw.<payload> for share links.
 */
(function initCertPathReportView() {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const savedId = params.get('id');

  let locale = 'en';

  function getUi() {
    return window.APP_I18N?.ui?.[locale] || window.APP_I18N?.ui?.en || {};
  }

  function t(key, replacements = {}) {
    const value = key.split('.').reduce((acc, part) => acc?.[part], getUi());
    const fallback = key.split('.').reduce((acc, part) => acc?.[part], window.APP_I18N?.ui?.tr || {});
    const template = value ?? fallback ?? key;
    return Object.entries(replacements).reduce((text, [name, replacement]) => {
      return text.replaceAll(`{${name}}`, replacement);
    }, template);
  }

  function localize(value) {
    if (typeof value === 'string') {
      return value;
    }
    return value?.[locale] || value?.en || value?.tr || '';
  }

  function getFilterLabel(filters, groupName, value) {
    const group = filters[groupName] || [];
    return localize(group.find((item) => item.value === value)?.label || value);
  }

  function runEngine(profile) {
    if (!window.CertPathRuleEngine || typeof window.CertPathRuleEngine.run !== 'function') {
      return null;
    }
    return window.CertPathRuleEngine.run(profile);
  }

  async function loadJson(path) {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    return response.json();
  }

  async function resolveRecord() {
    if (savedId && window.CertPathReportPersistence) {
      const rec = window.CertPathReportPersistence.getHistoryById(savedId);
      if (rec) {
        locale = rec.locale || 'en';
        return rec;
      }
      return null;
    }
    const hash = (window.location.hash || '').replace(/^#/, '');
    const match = hash.match(/^p=(gz|raw)\.(.+)$/);
    if (!match || !window.CertPathReportPersistence) {
      return null;
    }
    const [, format, data] = match;
    const decoded = await window.CertPathReportPersistence.decodeSharePayload(data, format);
    locale = decoded.locale || 'en';
    return {
      profile: decoded.profile,
      aiAnalysis: decoded.aiAnalysis || null,
      locale,
      createdAt: new Date().toISOString()
    };
  }

  function buildContext(rec, data) {
    const profile = rec.profile;
    const engine = rec.engine || runEngine(profile);
    if (!engine) {
      return null;
    }
    const channelLabel = rec.channelLabel || getFilterLabel(data.filters, 'channels', profile.salesChannel);
    const categoryLabel = rec.categoryLabel || getFilterLabel(data.filters, 'categories', profile.productCategory);
    const roleLabel = rec.roleLabel || getFilterLabel(data.filters, 'sellerRoles', profile.sellerRole);
    const ceLabel = rec.ceLabel || getFilterLabel(data.filters, 'ceStatuses', profile.ceStatus);
    const marketLabel = rec.marketLabel || (profile.markets || []).map((m) => getFilterLabel(data.filters, 'markets', m)).join(', ');
    return {
      profile,
      engine,
      aiAnalysis: rec.aiAnalysis || null,
      channelLabel,
      categoryLabel,
      roleLabel,
      ceLabel,
      marketLabel,
      packages: data?.packages || [],
      locale,
      generatedAt: rec.createdAt || new Date().toISOString()
    };
  }

  async function main() {
    const statusEl = document.getElementById('report-view-status');
    const bodyEl = document.getElementById('report-view-body');

    const rec = await resolveRecord();
    if (!rec) {
      statusEl.classList.remove('hidden');
      statusEl.textContent = t('reportView.loadError');
      return;
    }

    document.documentElement.lang = locale;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });

    if (!window.CertPathReport) {
      statusEl.classList.remove('hidden');
      statusEl.textContent = t('reportView.rendererMissing');
      return;
    }

    let data;
    try {
      data = await loadJson('./data.json');
    } catch {
      statusEl.classList.remove('hidden');
      statusEl.textContent = t('reportView.dataError');
      return;
    }

    const ctx = buildContext(rec, data);
    if (!ctx) {
      statusEl.classList.remove('hidden');
      statusEl.textContent = t('reportView.engineError');
      return;
    }

    const deps = { t, localize, locale, packages: ctx.packages };
    bodyEl.innerHTML = window.CertPathReport.buildComplianceReportInnerHtml(ctx, deps);

    try {
      window.__CERTPATH_APP_META__ = {
        version: data?.meta?.version,
        dataVersion: data?.meta?.lastGlobalUpdate
      };
    } catch {
      /* ignore */
    }
    if (window.CertPathAnalytics?.track) {
      window.CertPathAnalytics.track(window.CertPathAnalytics.EVENTS.RESULT_VIEWED, {
        surface: 'report_view',
        report_source: savedId ? 'saved_id' : 'share_hash',
        product_category: ctx.profile.productCategory || undefined,
        sales_channel: ctx.profile.salesChannel || undefined,
        locale: locale,
        rule_engine_version: ctx.engine?.engineVersion || undefined,
        risk_level: ctx.engine?.riskLevel || undefined
      });
    }
  }

  main();
}());
