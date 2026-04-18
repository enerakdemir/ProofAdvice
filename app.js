const STORAGE_KEY = 'certpath-product-profile';
const LANGUAGE_KEY = 'certpath-language';
const GEMINI_KEY_STORAGE = 'certpath-gemini-api-key';
const SESSION_CONTACT_FROM_REPORT = 'certpath-contact-from-report';
const SESSION_ANALYTICS_ASSESSMENT_STARTED = 'certpath-analytics-assessment-started';
const WIZARD_STEP_COUNT = 5;

const CONTACT_DOC_GAP_VALUES = ['mostly_complete', 'partial_missing', 'substantial_gaps', 'export_route', 'not_sure'];
const CONTACT_URGENCY_VALUES = ['planning', 'active', 'blocked', 'tender'];

let reportToolbarBound = false;

function trackProduct(eventName, properties = {}) {
  const A = window.CertPathAnalytics;
  if (!A?.track) {
    return;
  }
  A.track(eventName, {
    locale: state.locale,
    ...properties
  });
}

function setAppMetaForAnalytics() {
  window.__CERTPATH_APP_META__ = {
    version: state.data?.meta?.version,
    dataVersion: state.data?.meta?.lastGlobalUpdate
  };
}

function markAssessmentStartedOnce(entry) {
  try {
    if (sessionStorage.getItem(SESSION_ANALYTICS_ASSESSMENT_STARTED)) {
      return;
    }
    sessionStorage.setItem(SESSION_ANALYTICS_ASSESSMENT_STARTED, '1');
    trackProduct(window.CertPathAnalytics.EVENTS.ASSESSMENT_STARTED, { entry });
  } catch {
    /* sessionStorage unavailable */
  }
}

const elements = {
  assessmentForm: document.getElementById('assessment-form'),
  productName: document.getElementById('product-name'),
  productUrl: document.getElementById('product-url'),
  salesChannel: document.getElementById('sales-channel'),
  productCategory: document.getElementById('product-category'),
  sellerRole: document.getElementById('seller-role'),
  ceStatus: document.getElementById('ce-status'),
  electricalContainer: document.getElementById('electrical-container'),
  batteryContainer: document.getElementById('battery-container'),
  wirelessContainer: document.getElementById('wireless-container'),
  skinContactContainer: document.getElementById('skin-contact-container'),
  childrenContainer: document.getElementById('children-container'),
  marketsContainer: document.getElementById('markets-container'),
  documentsContainer: document.getElementById('documents-container'),
  electricalPowerContainer: document.getElementById('electrical-power-container'),
  batteryRemovableContainer: document.getElementById('battery-removable-container'),
  batteryChemistryContainer: document.getElementById('battery-chemistry-container'),
  wirelessTechContainer: document.getElementById('wireless-tech-container'),
  childAgeContainer: document.getElementById('child-age-container'),
  electricalContextPanel: document.getElementById('electrical-context-panel'),
  batteryFollowupPanel: document.getElementById('battery-followup-panel'),
  wirelessContextPanel: document.getElementById('wireless-context-panel'),
  skinContactNotePanel: document.getElementById('skin-contact-note-panel'),
  childrenWarningPanel: document.getElementById('children-warning-panel'),
  wizardProgressBar: document.getElementById('wizard-progress-bar'),
  wizardStepIndicator: document.getElementById('wizard-step-indicator'),
  wizardStepHeading: document.getElementById('wizard-step-heading'),
  wizardStepHint: document.getElementById('wizard-step-hint'),
  wizardValidationBanner: document.getElementById('wizard-validation-banner'),
  wizardReviewSummary: document.getElementById('wizard-review-summary'),
  wizardBackButton: document.getElementById('wizard-back-button'),
  wizardNextButton: document.getElementById('wizard-next-button'),
  findButton: document.getElementById('find-button'),
  resetButton: document.getElementById('reset-button'),
  geminiApiKey: document.getElementById('gemini-api-key'),
  saveApiKeyButton: document.getElementById('save-api-key-button'),
  clearApiKeyButton: document.getElementById('clear-api-key-button'),
  apiKeyStatus: document.getElementById('api-key-status'),
  complianceReportBody: document.getElementById('compliance-report-body'),
  reportToolbar: document.getElementById('report-toolbar'),
  expertHandoffBanner: document.getElementById('expert-handoff-banner'),
  reportBtnPdf: document.getElementById('report-btn-pdf'),
  reportBtnEmail: document.getElementById('report-btn-email'),
  reportBtnSave: document.getElementById('report-btn-save'),
  reportBtnShare: document.getElementById('report-btn-share'),
  reportBtnExpert: document.getElementById('report-btn-expert'),
  reportBtnExpertBanner: document.getElementById('report-btn-expert-banner'),
  reportBtnEdit: document.getElementById('report-btn-edit'),
  reportHistoryPanel: document.getElementById('report-history-panel'),
  reportHistoryList: document.getElementById('report-history-list'),
  emailReportModal: document.getElementById('email-report-modal'),
  emailModalClose: document.getElementById('email-modal-close'),
  emailModalCopy: document.getElementById('email-modal-copy'),
  emailModalMailto: document.getElementById('email-modal-mailto'),
  emailReportRecipient: document.getElementById('email-report-recipient'),
  reportToast: document.getElementById('report-toast'),
  analysisStatus: document.getElementById('analysis-status'),
  statsGrid: document.getElementById('stats-grid'),
  playbookGrid: document.getElementById('playbook-grid'),
  packageGrid: document.getElementById('package-grid'),
  resourceGrid: document.getElementById('resource-grid'),
  faqGrid: document.getElementById('faq-grid'),
  savedStatus: document.getElementById('saved-status'),
  footerDisclaimer: document.getElementById('footer-disclaimer'),
  footerMeta: document.getElementById('footer-meta'),
  footerSupport: document.getElementById('footer-support'),
  wizardLiveRegion: document.getElementById('wizard-live-region'),
  contactForm: document.getElementById('contact-form'),
  contactMessage: document.getElementById('contact-message'),
  contactProductCategory: document.getElementById('contact-product-category'),
  contactSellerRole: document.getElementById('contact-seller-role'),
  contactDocGap: document.getElementById('contact-doc-gap'),
  contactUrgency: document.getElementById('contact-urgency'),
  contactMarketsContainer: document.getElementById('contact-markets-container'),
  languageSwitcher: document.getElementById('language-switcher'),
  mobileLanguageSwitcher: document.getElementById('language-switcher-mobile'),
  metaDescription: document.querySelector('meta[name="description"]')
};

const state = {
  data: null,
  locale: 'en',
  activeSection: '',
  aiAnalysis: null,
  wizardStep: 1,
  reportContext: null
};

let profileSaveTimer = null;

function scheduleProfilePersistFromInput() {
  window.clearTimeout(profileSaveTimer);
  profileSaveTimer = window.setTimeout(() => {
    saveProfile(getProfile());
    if (state.wizardStep === 5) {
      renderWizardReview();
    }
  }, 280);
}

function getSupportedLocales() {
  return window.APP_I18N?.locales || [];
}

function getCurrentUi() {
  return window.APP_I18N?.ui?.[state.locale] || window.APP_I18N?.ui?.tr || {};
}

function t(key, replacements = {}) {
  const value = key.split('.').reduce((accumulator, part) => accumulator?.[part], getCurrentUi());
  const fallback = key.split('.').reduce((accumulator, part) => accumulator?.[part], window.APP_I18N?.ui?.tr || {});
  const template = value ?? fallback ?? key;
  return Object.entries(replacements).reduce((text, [name, replacement]) => {
    return text.replaceAll(`{${name}}`, replacement);
  }, template);
}

function localize(value) {
  if (typeof value === 'string') {
    return value;
  }
  return value?.[state.locale] || value?.tr || '';
}

function createOption(value, label) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = label;
  return option;
}

function renderLanguageSwitchers() {
  const locales = getSupportedLocales();
  [elements.languageSwitcher, elements.mobileLanguageSwitcher].forEach((container) => {
    if (!container) {
      return;
    }
    container.innerHTML = '';
    locales.forEach((locale) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.locale = locale.code;
      button.className = locale.code === state.locale
        ? 'rounded-full bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
        : 'rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-sky-50 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';
      button.textContent = locale.label;
      button.setAttribute('aria-pressed', String(locale.code === state.locale));
      button.setAttribute('aria-label', `${t('language.label')}: ${locale.nativeName}`);
      container.appendChild(button);
    });
  });
}

function applyStaticTranslations() {
  document.documentElement.lang = state.locale;
  document.title = t('meta.title');
  elements.metaDescription?.setAttribute('content', t('meta.description'));
  const desc = t('meta.description');
  const title = t('meta.title');
  document.getElementById('meta-og-title')?.setAttribute('content', title);
  document.getElementById('meta-og-description')?.setAttribute('content', desc);
  document.getElementById('meta-twitter-title')?.setAttribute('content', title);
  document.getElementById('meta-twitter-description')?.setAttribute('content', desc);
  try {
    const path = `${window.location.pathname}${window.location.search || ''}`;
    document.getElementById('certpath-canonical')?.setAttribute('href', `${window.location.origin}${path}`.split('#')[0]);
  } catch {
    /* ignore */
  }
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
    node.setAttribute('placeholder', t(node.dataset.i18nPlaceholder));
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach((node) => {
    node.setAttribute('aria-label', t(node.dataset.i18nAriaLabel));
  });
}

function resolveInitialLocale() {
  const savedLocale = localStorage.getItem(LANGUAGE_KEY);
  if (savedLocale && getSupportedLocales().some((item) => item.code === savedLocale)) {
    return savedLocale;
  }
  return 'en';
}

function saveLocale(locale) {
  localStorage.setItem(LANGUAGE_KEY, locale);
}

function getBrowserApiKey() {
  return localStorage.getItem(GEMINI_KEY_STORAGE)?.trim() || '';
}

function saveBrowserApiKey(apiKey) {
  localStorage.setItem(GEMINI_KEY_STORAGE, apiKey.trim());
}

function clearBrowserApiKey() {
  localStorage.removeItem(GEMINI_KEY_STORAGE);
}

function setSavedStatus(mode) {
  const keyMap = {
    waiting: 'status.waiting',
    updated: 'status.updated',
    loaded: 'status.loaded',
    cleared: 'status.cleared',
    error: 'status.error'
  };
  elements.savedStatus.textContent = t(keyMap[mode] || keyMap.waiting);
}

function renderApiKeyStatus() {
  if (!elements.apiKeyStatus || !elements.geminiApiKey) {
    return;
  }

  if (window.CertPathAiEnvironment && !window.CertPathAiEnvironment.isBrowserGeminiDemoEnabled()) {
    elements.geminiApiKey.value = '';
    elements.apiKeyStatus.textContent = t('assessment.apiKeyDisabledEnv');
    elements.apiKeyStatus.className = 'mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500';
    return;
  }

  const apiKey = getBrowserApiKey();
  elements.geminiApiKey.value = apiKey;
  elements.apiKeyStatus.textContent = apiKey ? t('assessment.apiKeySaved') : t('assessment.apiKeyMissing');
  elements.apiKeyStatus.className = apiKey
    ? 'mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700'
    : 'mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500';
}

function setAnalysisStatus(message = '', tone = 'neutral') {
  if (!elements.analysisStatus) {
    return;
  }

  if (!message) {
    elements.analysisStatus.className = 'mt-4 hidden rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-600';
    elements.analysisStatus.textContent = '';
    return;
  }

  const toneClasses = {
    neutral: 'border-sky-200 bg-white text-slate-600',
    info: 'border-sky-200 bg-sky-50 text-brand-700',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    error: 'border-rose-200 bg-rose-50 text-rose-800'
  };

  elements.analysisStatus.className = `mt-4 rounded-2xl border px-4 py-3 text-sm ${toneClasses[tone] || toneClasses.neutral}`;
  elements.analysisStatus.textContent = message;
}

function populateSelect(selectElement, placeholder, items) {
  selectElement.innerHTML = '';
  selectElement.appendChild(createOption('', placeholder));
  items.forEach((item) => {
    selectElement.appendChild(createOption(item.value, localize(item.label)));
  });
}

function renderBinaryOptions(container, name, items, selectedValue = '') {
  container.innerHTML = '';
  items.forEach((item) => {
    const wrapper = document.createElement('label');
    wrapper.className = 'flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:border-sky-300 hover:bg-white focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100';
    wrapper.innerHTML = `
      <input type="radio" name="${name}" value="${item.value}" class="mt-1 h-4 w-4 border-slate-300 text-brand-700 focus:ring-brand-500" ${selectedValue === item.value ? 'checked' : ''}>
      <span class="font-semibold text-slate-900">${localize(item.label)}</span>
    `;
    container.appendChild(wrapper);
  });
}

function renderCheckboxOptions(container, items, selectedValues = []) {
  container.innerHTML = '';
  items.forEach((item) => {
    const wrapper = document.createElement('label');
    wrapper.className = 'flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:border-sky-300 hover:bg-white focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100';
    wrapper.innerHTML = `
      <input type="checkbox" value="${item.value}" class="mt-1 h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500" ${selectedValues.includes(item.value) ? 'checked' : ''}>
      <span class="font-semibold text-slate-900">${localize(item.label)}</span>
    `;
    container.appendChild(wrapper);
  });
}

function getRadioValue(container) {
  return container.querySelector('input[type="radio"]:checked')?.value || '';
}

function getCheckboxValues(container) {
  return Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map((input) => input.value);
}

function populateContactDocGapSelect() {
  if (!elements.contactDocGap) {
    return;
  }
  elements.contactDocGap.innerHTML = '';
  elements.contactDocGap.appendChild(createOption('', t('contact.form.selectPlaceholder')));
  CONTACT_DOC_GAP_VALUES.forEach((value) => {
    elements.contactDocGap.appendChild(createOption(value, t(`contact.docGaps.${value}`)));
  });
}

function populateContactUrgencySelect() {
  if (!elements.contactUrgency) {
    return;
  }
  elements.contactUrgency.innerHTML = '';
  elements.contactUrgency.appendChild(createOption('', t('contact.form.selectPlaceholder')));
  CONTACT_URGENCY_VALUES.forEach((value) => {
    elements.contactUrgency.appendChild(createOption(value, t(`contact.urgency.${value}`)));
  });
}

function renderContactMarketChips(container, selectedValues = []) {
  if (!container || !state.data?.filters?.markets) {
    return;
  }
  container.innerHTML = '';
  state.data.filters.markets.forEach((item) => {
    const wrapper = document.createElement('label');
    wrapper.className = 'inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-sky-100';
    const checked = selectedValues.includes(item.value);
    wrapper.innerHTML = `
      <input type="checkbox" name="contact-market" value="${escapeHtml(item.value)}" class="h-3.5 w-3.5 shrink-0 rounded border-slate-300 text-brand-700 focus:ring-brand-500" ${checked ? 'checked' : ''}>
      <span>${escapeHtml(localize(item.label))}</span>
    `;
    container.appendChild(wrapper);
  });
}

function getContactMarketSelection() {
  if (!elements.contactMarketsContainer) {
    return [];
  }
  return Array.from(elements.contactMarketsContainer.querySelectorAll('input[name="contact-market"]:checked')).map((input) => input.value);
}

function deriveRecommendedDocGap(profile) {
  const held = profile?.documents?.length ?? 0;
  const total = state.data?.filters?.documents?.length || 1;
  if (held === 0) {
    return 'substantial_gaps';
  }
  if (held < Math.max(1, Math.ceil(total / 2))) {
    return 'partial_missing';
  }
  return 'mostly_complete';
}

function buildReportContactMessage(profile) {
  const channel = profile.salesChannel ? getFilterLabel('channels', profile.salesChannel) : '—';
  const category = profile.productCategory ? getFilterLabel('categories', profile.productCategory) : '—';
  const role = profile.sellerRole ? getFilterLabel('sellerRoles', profile.sellerRole) : '—';
  const markets = profile.markets?.length
    ? profile.markets.map((m) => getFilterLabel('markets', m)).join(', ')
    : '—';
  const docs = profile.documents?.length
    ? profile.documents.map((d) => getFilterLabel('documents', d)).join(', ')
    : t('common.none');
  const url = profile.productUrl?.trim() ? profile.productUrl.trim() : t('common.none');
  return t('contact.prefillReportBody', {
    product: profile.productName?.trim() || '—',
    channel,
    category,
    role,
    markets,
    docs,
    url
  });
}

function prefillContactFromProfile(profile) {
  if (elements.contactProductCategory) {
    elements.contactProductCategory.value = profile.productCategory || '';
  }
  if (elements.contactSellerRole) {
    elements.contactSellerRole.value = profile.sellerRole || '';
  }
  if (elements.contactDocGap) {
    elements.contactDocGap.value = deriveRecommendedDocGap(profile);
  }
  if (elements.contactUrgency) {
    elements.contactUrgency.value = 'planning';
  }
  renderContactMarketChips(elements.contactMarketsContainer, profile.markets || []);
}

function applyContactPrefillFromAssessmentReport() {
  if (!sessionStorage.getItem(SESSION_CONTACT_FROM_REPORT)) {
    return;
  }
  sessionStorage.removeItem(SESSION_CONTACT_FROM_REPORT);
  const profile = getProfile();
  prefillContactFromProfile(profile);
  if (elements.contactMessage && !elements.contactMessage.value.trim()) {
    elements.contactMessage.value = buildReportContactMessage(profile);
  }
}

function renderContactSupportFields() {
  if (!state.data?.filters || !elements.contactProductCategory) {
    return;
  }
  populateSelect(elements.contactProductCategory, t('contact.form.selectPlaceholder'), state.data.filters.categories);
  populateSelect(elements.contactSellerRole, t('contact.form.selectPlaceholder'), state.data.filters.sellerRoles);
  populateContactDocGapSelect();
  populateContactUrgencySelect();
  renderContactMarketChips(elements.contactMarketsContainer, []);
}

function applyContactPrefills() {
  applyContactPrefillFromPackageInterest();
  applyContactPrefillFromAssessmentReport();
}

function getProfile() {
  return {
    productName: elements.productName.value.trim(),
    productUrl: elements.productUrl.value.trim(),
    salesChannel: elements.salesChannel.value,
    productCategory: elements.productCategory.value,
    sellerRole: elements.sellerRole.value,
    ceStatus: elements.ceStatus.value,
    electrical: getRadioValue(elements.electricalContainer),
    battery: getRadioValue(elements.batteryContainer),
    wireless: getRadioValue(elements.wirelessContainer),
    skinContact: getRadioValue(elements.skinContactContainer),
    children: getRadioValue(elements.childrenContainer),
    markets: getCheckboxValues(elements.marketsContainer),
    documents: getCheckboxValues(elements.documentsContainer),
    electricalPowerSource: elements.electricalPowerContainer ? getRadioValue(elements.electricalPowerContainer) : '',
    batteryRemovable: elements.batteryRemovableContainer ? getRadioValue(elements.batteryRemovableContainer) : '',
    batteryChemistry: elements.batteryChemistryContainer ? getRadioValue(elements.batteryChemistryContainer) : '',
    wirelessTech: elements.wirelessTechContainer ? getRadioValue(elements.wirelessTechContainer) : '',
    childAgeFocus: elements.childAgeContainer ? getRadioValue(elements.childAgeContainer) : ''
  };
}

function isProfileReady(profile) {
  if (!profile.productName?.trim()) {
    return false;
  }
  if (!profile.salesChannel || !profile.productCategory || !profile.sellerRole || !profile.ceStatus) {
    return false;
  }
  if (!profile.electrical || !profile.battery || !profile.wireless || !profile.skinContact || !profile.children) {
    return false;
  }
  if (profile.electrical === 'yes' && !profile.electricalPowerSource) {
    return false;
  }
  if (profile.battery === 'yes' && (!profile.batteryRemovable || !profile.batteryChemistry)) {
    return false;
  }
  if (profile.wireless === 'yes' && !profile.wirelessTech) {
    return false;
  }
  if (profile.children === 'yes' && !profile.childAgeFocus) {
    return false;
  }
  if (!profile.markets?.length) {
    return false;
  }
  return true;
}

function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  setSavedStatus('updated');
}

function readProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function getWizardStepPanels() {
  return Array.from(document.querySelectorAll('[data-wizard-step]'));
}

function hideWizardValidation() {
  if (!elements.wizardValidationBanner) {
    return;
  }
  elements.wizardValidationBanner.classList.add('hidden');
  elements.wizardValidationBanner.textContent = '';
}

function toggleBranchPanel(panel, visible) {
  if (!panel) {
    return;
  }
  panel.classList.toggle('hidden', !visible);
}

function syncWizardBranchPanels() {
  const profile = getProfile();
  toggleBranchPanel(elements.electricalContextPanel, profile.electrical === 'yes');
  toggleBranchPanel(elements.batteryFollowupPanel, profile.battery === 'yes');
  toggleBranchPanel(elements.wirelessContextPanel, profile.wireless === 'yes');
  toggleBranchPanel(elements.skinContactNotePanel, profile.skinContact === 'yes');
  toggleBranchPanel(elements.childrenWarningPanel, profile.children === 'yes');
}

function validateWizardStep(step) {
  const profile = getProfile();
  if (step === 1) {
    if (!profile.productName?.trim()) {
      return { ok: false, message: t('wizard.validation.step1') };
    }
    return { ok: true };
  }
  if (step === 2) {
    if (!profile.salesChannel || !profile.productCategory || !profile.sellerRole || !profile.ceStatus) {
      return { ok: false, message: t('wizard.validation.step2') };
    }
    return { ok: true };
  }
  if (step === 3) {
    if (!profile.electrical || !profile.battery || !profile.wireless || !profile.skinContact || !profile.children) {
      return { ok: false, message: t('wizard.validation.step3') };
    }
    if (profile.electrical === 'yes' && !profile.electricalPowerSource) {
      return { ok: false, message: t('wizard.validation.electricalPower') };
    }
    if (profile.battery === 'yes' && (!profile.batteryRemovable || !profile.batteryChemistry)) {
      return { ok: false, message: t('wizard.validation.batteryFollowup') };
    }
    if (profile.wireless === 'yes' && !profile.wirelessTech) {
      return { ok: false, message: t('wizard.validation.wirelessTech') };
    }
    if (profile.children === 'yes' && !profile.childAgeFocus) {
      return { ok: false, message: t('wizard.validation.childAge') };
    }
    return { ok: true };
  }
  if (step === 4) {
    if (!profile.markets?.length) {
      return { ok: false, message: t('wizard.validation.markets') };
    }
    return { ok: true };
  }
  return { ok: true };
}

function renderWizardChrome() {
  if (!elements.wizardProgressBar || !elements.wizardStepIndicator) {
    return;
  }

  const step = state.wizardStep;
  const pct = (step / WIZARD_STEP_COUNT) * 100;
  elements.wizardProgressBar.style.width = `${pct}%`;
  elements.wizardStepIndicator.textContent = t('wizard.stepOf', { current: step, total: WIZARD_STEP_COUNT });
  elements.wizardStepHeading.textContent = t(`wizard.stepTitles.s${step}`);
  elements.wizardStepHint.textContent = t(`wizard.stepHints.s${step}`);

  if (elements.wizardLiveRegion) {
    elements.wizardLiveRegion.textContent = `${t('wizard.stepOf', { current: step, total: WIZARD_STEP_COUNT })} — ${t(`wizard.stepTitles.s${step}`)}. ${t(`wizard.stepHints.s${step}`)}`;
  }

  getWizardStepPanels().forEach((panel) => {
    const n = Number(panel.dataset.wizardStep);
    const active = n === step;
    if (n === 1) {
      panel.classList.toggle('hidden', !active);
      panel.classList.toggle('contents', active);
    } else {
      panel.classList.toggle('hidden', !active);
    }
  });

  if (elements.wizardBackButton) {
    elements.wizardBackButton.classList.toggle('hidden', step <= 1);
  }
  if (elements.wizardNextButton) {
    elements.wizardNextButton.classList.toggle('hidden', step >= WIZARD_STEP_COUNT);
  }
  if (elements.findButton) {
    const showGenerate = step >= WIZARD_STEP_COUNT;
    elements.findButton.style.display = showGenerate ? 'inline-flex' : 'none';
  }
}

function renderWizardReview() {
  if (!elements.wizardReviewSummary) {
    return;
  }

  const profile = getProfile();
  const rows = [
    [t('assessment.fields.productName'), profile.productName || '—'],
    [t('assessment.fields.productUrl'), profile.productUrl || t('common.none')],
    [t('assessment.fields.channel'), profile.salesChannel ? getFilterLabel('channels', profile.salesChannel) : '—'],
    [t('assessment.fields.category'), profile.productCategory ? getFilterLabel('categories', profile.productCategory) : '—'],
    [t('assessment.fields.role'), profile.sellerRole ? getFilterLabel('sellerRoles', profile.sellerRole) : '—'],
    [t('assessment.fields.ceStatus'), profile.ceStatus ? getFilterLabel('ceStatuses', profile.ceStatus) : '—'],
    [t('assessment.fields.electrical'), profile.electrical ? getFilterLabel('binaryOptions', profile.electrical) : '—'],
    [t('assessment.fields.battery'), profile.battery ? getFilterLabel('binaryOptions', profile.battery) : '—'],
    [t('assessment.fields.wireless'), profile.wireless ? getFilterLabel('binaryOptions', profile.wireless) : '—'],
    [t('assessment.fields.skinContact'), profile.skinContact ? getFilterLabel('binaryOptions', profile.skinContact) : '—'],
    [t('assessment.fields.children'), profile.children ? getFilterLabel('binaryOptions', profile.children) : '—'],
    [t('assessment.fields.markets'), profile.markets.length ? profile.markets.map((m) => getFilterLabel('markets', m)).join(', ') : '—'],
    [t('assessment.fields.documents'), profile.documents.length ? profile.documents.map((d) => getFilterLabel('documents', d)).join(', ') : t('common.none')]
  ];

  if (profile.electrical === 'yes' && profile.electricalPowerSource) {
    rows.push([t('assessment.fields.electricalPower'), getFilterLabel('electricalPowerSource', profile.electricalPowerSource)]);
  }
  if (profile.battery === 'yes') {
    if (profile.batteryRemovable) {
      rows.push([t('assessment.fields.batteryRemovable'), getFilterLabel('batteryRemovable', profile.batteryRemovable)]);
    }
    if (profile.batteryChemistry) {
      rows.push([t('assessment.fields.batteryChemistry'), getFilterLabel('batteryChemistry', profile.batteryChemistry)]);
    }
  }
  if (profile.wireless === 'yes' && profile.wirelessTech) {
    rows.push([t('assessment.fields.wirelessTech'), getFilterLabel('wirelessTech', profile.wirelessTech)]);
  }
  if (profile.children === 'yes' && profile.childAgeFocus) {
    rows.push([t('assessment.fields.childAgeFocus'), getFilterLabel('childAgeFocus', profile.childAgeFocus)]);
  }

  elements.wizardReviewSummary.innerHTML = rows.map(([dt, dd]) => `
    <div class="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:items-start sm:gap-6">
      <dt class="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">${dt}</dt>
      <dd class="text-sm font-semibold text-slate-900">${dd}</dd>
    </div>
  `).join('');
}

function scrollWizardToTop() {
  document.getElementById('wizard-progress-wrap')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleWizardNext() {
  hideWizardValidation();
  const result = validateWizardStep(state.wizardStep);
  if (!result.ok) {
    if (elements.wizardValidationBanner) {
      elements.wizardValidationBanner.textContent = result.message;
      elements.wizardValidationBanner.classList.remove('hidden');
    }
    return;
  }
  if (state.wizardStep < WIZARD_STEP_COUNT) {
    const previousStep = state.wizardStep;
    state.wizardStep += 1;
    if (previousStep === 1 && state.wizardStep === 2) {
      markAssessmentStartedOnce('wizard');
    }
    if (state.wizardStep === 5) {
      renderWizardReview();
    }
    renderWizardChrome();
    scrollWizardToTop();
  }
}

function handleWizardBack() {
  hideWizardValidation();
  if (state.wizardStep > 1) {
    state.wizardStep -= 1;
    renderWizardChrome();
    scrollWizardToTop();
  }
}

function getFilterLabel(groupName, value) {
  const group = state.data.filters[groupName] || [];
  return localize(group.find((item) => item.value === value)?.label || value);
}

function getDocumentCountText(profile) {
  if (!profile.documents.length) {
    return t('common.none');
  }
  return profile.documents.map((item) => getFilterLabel('documents', item)).join(', ');
}

function createSummaryCard(label, value, detail) {
  return `
    <article class="rounded-[1.5rem] border border-white/60 bg-white p-5 shadow-sm">
      <div class="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">${label}</div>
      <div class="mt-3 text-lg font-black text-slate-950">${value}</div>
      <div class="mt-2 text-sm leading-6 text-slate-600">${detail}</div>
    </article>
  `;
}

function createEmptyState() {
  return `
    <div class="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
      <div class="text-lg font-bold text-slate-900">${t('results.emptyTitle')}</div>
      <p class="mt-2 text-sm leading-6 text-slate-600">${t('results.emptyDescription')}</p>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function runDeterministicEngine(profile) {
  if (!globalThis.CertPathRuleEngine || typeof globalThis.CertPathRuleEngine.run !== 'function') {
    return null;
  }
  return globalThis.CertPathRuleEngine.run(profile);
}

function configureAiDemoUiVisibility() {
  window.CertPathAiEnvironment?.syncBrowserDemoPanelVisibility?.();
}

/**
 * AI Layer 2: delegates to services/ai-explanation-service.js (routing, prompts, browser demo).
 * Production uses AI_ENDPOINT only; development may use the same endpoint or the browser demo when allowed.
 */
async function fetchAiAnalysis(profile) {
  const svc = window.CertPathAiExplanationService;
  if (!svc?.requestExplanation) {
    state.aiAnalysis = null;
    setAnalysisStatus(t('results.aiRendererMissing'), 'error');
    renderResults(profile, { emitResultViewAnalytics: false });
    return null;
  }

  const result = await svc.requestExplanation({
    profile,
    locale: state.locale,
    runEngine: runDeterministicEngine,
    getBrowserApiKey,
    translate: t,
    onStatus: (message, tone) => {
      setAnalysisStatus(message ?? '', tone || 'neutral');
    },
    log: (event, detail) => {
      if (window.APP_CONFIG?.AI_CLIENT_DEBUG) {
        console.info('[CertPath AI app]', event, detail);
      }
    }
  });

  if (!result.ok) {
    state.aiAnalysis = null;
    const keyMap = {
      production_no_endpoint: 'results.aiProductionNoEndpoint',
      no_browser_key: 'results.aiUnavailable',
      browser_demo_disabled: 'results.aiDemoDisabled',
      engine_missing: 'results.engineMissing',
      worker_http_error: 'results.aiFallback',
      worker_invalid_payload: 'results.aiFallback',
      aborted: 'results.aiError',
      exception: 'results.aiFallback',
      browser_gemini_failed: 'results.aiBrowserError',
      worker_failed: 'results.aiFallback',
      env_missing: 'results.aiRendererMissing'
    };
    const key = keyMap[result.reason] || 'results.aiFallback';
    setAnalysisStatus(t(key), result.reason === 'engine_missing' ? 'error' : 'warning');
    renderResults(profile, { emitResultViewAnalytics: false });
    return null;
  }

  state.aiAnalysis = result.analysis;
  if (result.channel === 'browser' && result.model) {
    setAnalysisStatus(t('results.aiBrowserReady', { model: result.model }), 'success');
  } else {
    setAnalysisStatus(t('results.aiReady'), 'success');
  }
  renderResults(profile, { emitResultViewAnalytics: false });
  return result.analysis;
}

function renderStats() {
  elements.statsGrid.innerHTML = state.data.stats.map((item) => `
    <div class="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <div class="text-3xl font-black tracking-tight text-brand-700">${item.value}</div>
      <div class="mt-2 text-sm leading-6 text-slate-600">${localize(item.label)}</div>
    </div>
  `).join('');
}

function renderPlaybooks() {
  elements.playbookGrid.innerHTML = state.data.playbooks.map((item) => `
    <article class="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
      <div class="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">${localize(item.audience)}</div>
      <h3 class="mt-3 text-2xl font-black tracking-tight">${localize(item.headline)}</h3>
      <p class="mt-3 text-sm leading-6 text-slate-300">${localize(item.summary)}</p>
    </article>
  `).join('');
}

function renderPackages() {
  elements.packageGrid.innerHTML = state.data.packages.map((item) => {
    const highlight = Boolean(item.highlight);
    const articleClass = highlight
      ? 'relative rounded-[1.75rem] border-2 border-brand-500 bg-white p-6 pt-8 shadow-panel ring-4 ring-brand-500/15'
      : 'rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm';
    const tierLabel = item.tierKey ? t(`packages.tierLabels.${item.tierKey}`) : '';
    const ctaTarget = item.ctaTarget === 'assessment' ? 'assessment' : 'contact';
    const ctaHref = `#${ctaTarget}`;
    const interestAttr = item.packageInterest
      ? ` data-package-interest="${escapeHtml(item.packageInterest)}"`
      : '';
    const tierKeyEsc = escapeHtml(item.tierKey || '');
    const ctaTargetEsc = escapeHtml(item.ctaTarget || '');
    const packageInterestEsc = escapeHtml(item.packageInterest || '');
    const packageCtaAttrs = ` data-package-cta="${tierKeyEsc}" data-package-cta-target="${ctaTargetEsc}" data-package-cta-interest="${packageInterestEsc}"`;
    const ctaLabel = item.ctaKey ? t(`packages.cta.${item.ctaKey}`) : t('packages.cta.default');
    const ctaClass = item.ctaTarget === 'assessment'
      ? 'mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand-700 bg-white px-5 py-3 text-sm font-semibold text-brand-700 hover:bg-sky-50'
      : 'mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-900';
    const priceDetail = item.priceDetail ? `<p class="mt-1 text-xs leading-5 text-slate-500">${escapeHtml(localize(item.priceDetail))}</p>` : '';
    const trustLine = item.trustLine ? `<p class="mt-4 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">${escapeHtml(localize(item.trustLine))}</p>` : '';
    const badge = highlight
      ? `<div class="absolute -top-3 left-1/2 z-[1] -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-700 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-sm">${escapeHtml(t('packages.badgeRecommended'))}</div>`
      : '';

    return `
    <article class="${articleClass}">
      ${badge}
      ${tierLabel ? `<p class="text-[10px] font-black uppercase tracking-[0.24em] text-brand-700">${escapeHtml(tierLabel)}</p>` : ''}
      <div class="mt-1 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h3 class="text-xl font-black tracking-tight text-slate-950">${localize(item.name)}</h3>
        <div class="shrink-0 text-right sm:pl-4">
          <div class="text-lg font-black text-brand-700">${escapeHtml(item.price)}</div>
          ${priceDetail}
        </div>
      </div>
      <p class="mt-4 text-sm leading-6 text-slate-600">${localize(item.summary)}</p>
      <div class="mt-5 space-y-2.5">
        ${item.deliverables.map((deliverable) => `
          <div class="flex gap-3 rounded-2xl bg-slate-50 px-4 py-3">
            <i class="fa-solid fa-check mt-0.5 shrink-0 text-emerald-600" aria-hidden="true"></i>
            <span class="text-sm leading-6 text-slate-700">${localize(deliverable)}</span>
          </div>
        `).join('')}
      </div>
      ${trustLine}
      <a href="${ctaHref}" data-section-link="${ctaTarget}" class="${ctaClass}"${interestAttr}${packageCtaAttrs}>
        ${item.ctaTarget === 'assessment' ? '<i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i>' : '<i class="fa-solid fa-comments" aria-hidden="true"></i>'}
        <span>${escapeHtml(ctaLabel)}</span>
      </a>
      <a href="#contact" data-section-link="contact" data-package-interest="cardExpert" class="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-center text-xs font-semibold text-brand-700 transition hover:border-brand-500 hover:bg-white">
        <i class="fa-solid fa-user-tie" aria-hidden="true"></i>
        <span>${escapeHtml(t('packages.cardExpertLink'))}</span>
      </a>
    </article>
  `;
  }).join('');
}

function applyContactPrefillFromPackageInterest() {
  const interest = sessionStorage.getItem('certpath-package-interest');
  if (!interest || !elements.contactMessage) {
    return;
  }
  const template = t(`packages.contactPrefill.${interest}`);
  if (!template || template.startsWith('packages.')) {
    sessionStorage.removeItem('certpath-package-interest');
    return;
  }
  if (!elements.contactMessage.value.trim()) {
    elements.contactMessage.value = template;
  }
  sessionStorage.removeItem('certpath-package-interest');
}

function renderResources() {
  elements.resourceGrid.innerHTML = state.data.resources.map((item) => {
    const slug = typeof item.slug === 'string' ? item.slug.trim() : '';
    const detailHref = slug ? `./resources/${slug}.html` : '#resources';
    const categoryLabel = item.categoryKey
      ? t(`resources.categories.${item.categoryKey}`)
      : localize(item.type);
    const typeLabel = localize(item.type);
    const badgeText = item.categoryKey ? `${escapeHtml(categoryLabel)} · ${escapeHtml(typeLabel)}` : escapeHtml(typeLabel);
    return `
    <article class="flex h-full flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200 hover:shadow-md">
      <span class="inline-flex w-fit rounded-full bg-sky-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-700">${badgeText}</span>
      <h3 class="mt-4 text-lg font-black leading-snug tracking-tight text-slate-950">
        <a href="${escapeHtml(detailHref)}" class="hover:text-brand-700">${localize(item.title)}</a>
      </h3>
      <p class="mt-3 flex-1 text-sm leading-6 text-slate-600">${localize(item.description)}</p>
      <div class="mt-6 flex flex-col gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:flex-wrap">
        <a href="${escapeHtml(detailHref)}" class="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-700 px-4 py-2.5 text-center text-xs font-semibold text-white hover:bg-brand-900 sm:flex-none sm:px-5">
          <i class="fa-solid fa-book-open" aria-hidden="true"></i>
          ${escapeHtml(t('resources.ctaRead'))}
        </a>
        <a href="#assessment" data-section-link="assessment" class="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-center text-xs font-semibold text-slate-700 hover:border-brand-500 hover:text-brand-800 sm:flex-none sm:px-5">
          <i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i>
          ${escapeHtml(t('resources.ctaRunCheck'))}
        </a>
        <a href="#packages" data-section-link="packages" class="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-transparent px-4 py-2 text-center text-xs font-semibold text-brand-700 hover:underline sm:flex-none">
          ${escapeHtml(t('resources.ctaPackages'))}
        </a>
      </div>
    </article>
  `;
  }).join('');
}

function renderFaq() {
  elements.faqGrid.innerHTML = state.data.faq.map((item) => `
    <details class="group rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-slate-900">
        <span>${localize(item.question)}</span>
        <i class="fa-solid fa-plus text-brand-700 transition group-open:rotate-45"></i>
      </summary>
      <p class="mt-4 text-sm leading-7 text-slate-600">${localize(item.answer)}</p>
    </details>
  `).join('');
}

function getReportRenderer() {
  return window.CertPathReport || null;
}

function getReportDeps() {
  return {
    t,
    localize,
    locale: state.locale,
    packages: state.data?.packages ?? []
  };
}

function buildComplianceReportInnerHtml(ctx) {
  const R = getReportRenderer();
  if (!R) {
    return `<p class="text-sm text-rose-800">${escapeHtml(t('results.report.rendererMissing'))}</p>`;
  }
  return R.buildComplianceReportInnerHtml(ctx, getReportDeps());
}

function buildPlainReportLines(ctx) {
  const R = getReportRenderer();
  if (!R) {
    return '';
  }
  return R.buildPlainReportLines(ctx, getReportDeps());
}

function setReportToolbarVisible(visible) {
  if (elements.reportToolbar) {
    elements.reportToolbar.classList.toggle('hidden', !visible);
  }
  if (elements.expertHandoffBanner) {
    elements.expertHandoffBanner.classList.toggle('hidden', !visible);
  }
}

function handleReportPdfClick() {
  if (!state.reportContext) {
    return;
  }
  const R = getReportRenderer();
  if (!R?.buildPdfExportDocumentHtml) {
    return;
  }
  const html = R.buildPdfExportDocumentHtml(state.reportContext, getReportDeps());
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=1200');
  if (!printWindow) {
    return;
  }
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.addEventListener('load', () => {
    window.setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 600);
  });
  trackProduct(window.CertPathAnalytics?.EVENTS?.PDF_DOWNLOADED || 'pdf_downloaded', { surface: 'spa' });
}

function showReportToast(message) {
  if (!elements.reportToast) {
    return;
  }
  elements.reportToast.textContent = message;
  elements.reportToast.classList.remove('hidden', 'opacity-0');
  window.clearTimeout(showReportToast._tid);
  showReportToast._tid = window.setTimeout(() => {
    elements.reportToast.classList.add('opacity-0');
    window.setTimeout(() => elements.reportToast.classList.add('hidden'), 300);
  }, 3200);
}

function openEmailReportModal() {
  if (!state.reportContext || !elements.emailReportModal) {
    return;
  }
  elements.emailReportModal.classList.remove('hidden');
  elements.emailReportModal.classList.add('flex');
}

function closeEmailReportModal() {
  if (!elements.emailReportModal) {
    return;
  }
  elements.emailReportModal.classList.add('hidden');
  elements.emailReportModal.classList.remove('flex');
}

function buildMailtoForReport(recipientOverride) {
  const support = state.data?.meta?.supportEmail || 'hello@certpath.com';
  const body = buildPlainReportLines(state.reportContext);
  const subject = t('results.report.emailSubject', { product: state.reportContext.profile.productName || 'Product' });
  const to = (recipientOverride || '').trim() || support;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function handleReportEmailClick() {
  if (!state.reportContext) {
    return;
  }
  openEmailReportModal();
}

function handleEmailModalCopy() {
  if (!state.reportContext) {
    return;
  }
  const text = buildPlainReportLines(state.reportContext);
  navigator.clipboard.writeText(text).then(() => {
    showReportToast(t('results.report.emailCopied'));
  }).catch(() => {
    window.prompt(t('results.report.emailCopyManual'), text);
  });
}

function handleEmailModalMailto() {
  if (!state.reportContext) {
    return;
  }
  const to = elements.emailReportRecipient?.value?.trim() || '';
  const href = buildMailtoForReport(to);
  const a = document.createElement('a');
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  closeEmailReportModal();
}

function handleSaveReportClick() {
  const P = window.CertPathReportPersistence;
  if (!state.reportContext || !P) {
    return;
  }
  const record = P.saveToHistory({
    ...state.reportContext,
    locale: state.locale,
    createdAt: new Date().toISOString()
  });
  showReportToast(t('results.report.savedToast', { title: record.profile.productName || t('results.reportTitle') }));
  renderReportHistoryPanel();
}

async function handleShareReportClick() {
  const P = window.CertPathReportPersistence;
  if (!state.reportContext || !P) {
    return;
  }
  const encoded = await P.encodeSharePayload({
    locale: state.locale,
    profile: state.reportContext.profile,
    aiAnalysis: state.reportContext.aiAnalysis
  });
  if (encoded.tooLong) {
    window.alert(t('results.report.shareTooLong'));
    return;
  }
  const url = new URL('report-view.html', window.location.href);
  url.hash = `p=${encoded.format}.${encoded.data}`;
  const urlStr = url.toString();
  try {
    await navigator.clipboard.writeText(urlStr);
    showReportToast(t('results.report.shareCopied'));
  } catch {
    window.prompt(t('results.report.shareManual'), urlStr);
  }
}

function renderReportHistoryPanel() {
  const P = window.CertPathReportPersistence;
  if (!elements.reportHistoryPanel || !elements.reportHistoryList || !P) {
    return;
  }
  const items = P.listHistory();
  if (!items.length) {
    elements.reportHistoryPanel.classList.add('hidden');
    elements.reportHistoryList.innerHTML = '';
    return;
  }
  elements.reportHistoryPanel.classList.remove('hidden');
  elements.reportHistoryList.innerHTML = items.map((item) => {
    const fullUrl = new URL(`report-view.html?id=${encodeURIComponent(item.id)}`, window.location.href).toString();
    const title = escapeHtml(item.profile?.productName || t('results.reportTitle'));
    const when = escapeHtml(new Date(item.createdAt).toLocaleString(state.locale, { dateStyle: 'short', timeStyle: 'short' }));
    return `
      <li class="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0">
        <div>
          <div class="font-semibold text-slate-900">${title}</div>
          <div class="text-xs text-slate-500">${when}</div>
        </div>
        <div class="flex flex-wrap gap-2">
          <a href="${escapeHtml(fullUrl)}" class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 hover:border-brand-500">${t('results.report.historyOpen')}</a>
          <button type="button" class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-rose-200 hover:text-rose-700" data-history-delete="${escapeHtml(item.id)}">${t('results.report.historyDelete')}</button>
        </div>
      </li>`;
  }).join('');
}

function handleReportExpertClick() {
  if (state.reportContext?.profile) {
    sessionStorage.setItem(SESSION_CONTACT_FROM_REPORT, '1');
  }
  activateSection('contact', { updateHash: true, scroll: true });
}

function handleReportEditClick() {
  state.wizardStep = 1;
  hideWizardValidation();
  renderWizardChrome();
  activateSection('assessment', { updateHash: true, scroll: true });
  scrollWizardToTop();
}

function bindReportToolbar() {
  if (reportToolbarBound) {
    return;
  }
  reportToolbarBound = true;
  elements.reportBtnPdf?.addEventListener('click', handleReportPdfClick);
  elements.reportBtnEmail?.addEventListener('click', handleReportEmailClick);
  elements.reportBtnSave?.addEventListener('click', handleSaveReportClick);
  elements.reportBtnShare?.addEventListener('click', () => {
    handleShareReportClick();
  });
  elements.reportBtnExpert?.addEventListener('click', handleReportExpertClick);
  elements.reportBtnExpertBanner?.addEventListener('click', handleReportExpertClick);
  elements.reportBtnEdit?.addEventListener('click', handleReportEditClick);
  elements.emailModalClose?.addEventListener('click', closeEmailReportModal);
  elements.emailModalCopy?.addEventListener('click', handleEmailModalCopy);
  elements.emailModalMailto?.addEventListener('click', handleEmailModalMailto);
  elements.emailReportModal?.addEventListener('click', (event) => {
    if (event.target === elements.emailReportModal) {
      closeEmailReportModal();
    }
  });
  elements.reportHistoryList?.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-history-delete]');
    if (!btn || !window.CertPathReportPersistence) {
      return;
    }
    window.CertPathReportPersistence.deleteHistoryById(btn.getAttribute('data-history-delete'));
    renderReportHistoryPanel();
  });
}

function renderResults(profile, options = {}) {
  const { emitResultViewAnalytics = true } = options;
  const isReady = isProfileReady(profile);

  if (!elements.complianceReportBody) {
    return;
  }

  if (!isReady) {
    if (!state.aiAnalysis && !options.preserveAnalysisStatus) {
      setAnalysisStatus();
    }
    setReportToolbarVisible(false);
    state.reportContext = null;
    elements.complianceReportBody.innerHTML = createEmptyState();
    return;
  }

  const engine = runDeterministicEngine(profile);
  const aiAnalysis = state.aiAnalysis;
  const channelLabel = getFilterLabel('channels', profile.salesChannel);
  const categoryLabel = getFilterLabel('categories', profile.productCategory);
  const roleLabel = getFilterLabel('sellerRoles', profile.sellerRole);
  const ceLabel = getFilterLabel('ceStatuses', profile.ceStatus);
  const marketLabel = profile.markets.map((item) => getFilterLabel('markets', item)).join(', ');

  if (!engine) {
    setReportToolbarVisible(false);
    state.reportContext = null;
    elements.complianceReportBody.innerHTML = `
      <div class="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-6 shadow-sm">
        <div class="text-lg font-bold text-rose-900">${t('results.engineMissing')}</div>
        <p class="mt-2 text-sm text-rose-800">${t('results.engineMissingDetail')}</p>
      </div>
    `;
    return;
  }

  state.reportContext = {
    profile,
    engine,
    aiAnalysis,
    channelLabel,
    categoryLabel,
    roleLabel,
    ceLabel,
    marketLabel,
    packages: state.data?.packages ?? [],
    locale: state.locale,
    generatedAt: new Date().toISOString()
  };

  elements.complianceReportBody.innerHTML = buildComplianceReportInnerHtml(state.reportContext);
  setReportToolbarVisible(true);
  renderReportHistoryPanel();
  if (emitResultViewAnalytics) {
    trackProduct(window.CertPathAnalytics?.EVENTS?.RESULT_VIEWED || 'result_viewed', {
      surface: 'spa',
      product_category: profile.productCategory || undefined,
      sales_channel: profile.salesChannel || undefined,
      rule_engine_version: engine.engineVersion || undefined,
      risk_level: engine.riskLevel || undefined
    });
  }
}

function restoreProfile(profile) {
  elements.productName.value = profile?.productName || '';
  elements.productUrl.value = profile?.productUrl || '';
  elements.salesChannel.value = profile?.salesChannel || '';
  elements.productCategory.value = profile?.productCategory || '';
  elements.sellerRole.value = profile?.sellerRole || '';
  elements.ceStatus.value = profile?.ceStatus || '';

  renderBinaryOptions(elements.electricalContainer, 'electrical', state.data.filters.binaryOptions, profile?.electrical || '');
  renderBinaryOptions(elements.batteryContainer, 'battery', state.data.filters.binaryOptions, profile?.battery || '');
  renderBinaryOptions(elements.wirelessContainer, 'wireless', state.data.filters.binaryOptions, profile?.wireless || '');
  renderBinaryOptions(elements.skinContactContainer, 'skin-contact', state.data.filters.binaryOptions, profile?.skinContact || '');
  renderBinaryOptions(elements.childrenContainer, 'children', state.data.filters.binaryOptions, profile?.children || '');
  renderCheckboxOptions(elements.marketsContainer, state.data.filters.markets, profile?.markets || []);
  renderCheckboxOptions(elements.documentsContainer, state.data.filters.documents, profile?.documents || []);

  if (elements.electricalPowerContainer && state.data.filters.electricalPowerSource) {
    renderBinaryOptions(elements.electricalPowerContainer, 'electrical-power', state.data.filters.electricalPowerSource, profile?.electricalPowerSource || '');
  }
  if (elements.batteryRemovableContainer && state.data.filters.batteryRemovable) {
    renderBinaryOptions(elements.batteryRemovableContainer, 'battery-removable', state.data.filters.batteryRemovable, profile?.batteryRemovable || '');
  }
  if (elements.batteryChemistryContainer && state.data.filters.batteryChemistry) {
    renderBinaryOptions(elements.batteryChemistryContainer, 'battery-chemistry', state.data.filters.batteryChemistry, profile?.batteryChemistry || '');
  }
  if (elements.wirelessTechContainer && state.data.filters.wirelessTech) {
    renderBinaryOptions(elements.wirelessTechContainer, 'wireless-tech', state.data.filters.wirelessTech, profile?.wirelessTech || '');
  }
  if (elements.childAgeContainer && state.data.filters.childAgeFocus) {
    renderBinaryOptions(elements.childAgeContainer, 'child-age', state.data.filters.childAgeFocus, profile?.childAgeFocus || '');
  }

  syncWizardBranchPanels();
}

function renderForm(profile) {
  populateSelect(elements.salesChannel, t('assessment.fields.channel'), state.data.filters.channels);
  populateSelect(elements.productCategory, t('assessment.fields.category'), state.data.filters.categories);
  populateSelect(elements.sellerRole, t('assessment.fields.role'), state.data.filters.sellerRoles);
  populateSelect(elements.ceStatus, t('assessment.fields.ceStatus'), state.data.filters.ceStatuses);
  restoreProfile(profile);
  renderWizardChrome();
  if (state.wizardStep === 5) {
    renderWizardReview();
  }
}

function renderApp(profile) {
  setAppMetaForAnalytics();
  applyStaticTranslations();
  renderLanguageSwitchers();
  configureAiDemoUiVisibility();
  renderApiKeyStatus();
  renderStats();
  renderPlaybooks();
  renderPackages();
  renderResources();
  renderFaq();
  renderForm(profile);
  renderContactSupportFields();

  elements.footerDisclaimer.textContent = localize(state.data.meta.disclaimer);
  elements.footerMeta.textContent = t('footer.meta', {
    date: state.data.meta.lastGlobalUpdate,
    email: state.data.meta.supportEmail
  });
  if (elements.footerSupport && state.data?.meta?.supportEmail) {
    const em = state.data.meta.supportEmail;
    elements.footerSupport.innerHTML = `${escapeHtml(t('footer.supportIntro'))} <a class="font-semibold text-brand-700 underline-offset-2 hover:underline" href="mailto:${escapeHtml(em)}">${escapeHtml(em)}</a> <span class="text-slate-500">${escapeHtml(t('footer.supportNote'))}</span>`;
  } else if (elements.footerSupport) {
    elements.footerSupport.textContent = '';
  }

  renderResults(getProfile());
  renderReportHistoryPanel();
  renderSectionVisibility(state.activeSection);
}

function handleLanguageChange(locale) {
  state.locale = locale;
  state.aiAnalysis = null;
  saveLocale(locale);
  const currentProfile = getProfile();
  renderApp(currentProfile);
  setSavedStatus(readProfile() ? 'loaded' : 'waiting');
}

function getSectionPanels() {
  return Array.from(document.querySelectorAll('[data-section-panel]'));
}

function getSectionLinks() {
  return Array.from(document.querySelectorAll('[data-section-link]'));
}

function renderSectionVisibility(sectionId) {
  const homePanel = document.querySelector('[data-home-panel="true"]');
  if (homePanel) {
    homePanel.classList.toggle('hidden', Boolean(sectionId));
  }

  getSectionPanels().forEach((panel) => {
    panel.classList.toggle('hidden', panel.dataset.sectionPanel !== sectionId);
  });

  getSectionLinks().forEach((link) => {
    if (link.closest('#package-grid')) {
      return;
    }
    const isActive = link.dataset.sectionLink === sectionId;
    if (link.classList.contains('text-white') || link.dataset.sectionLink === 'home') {
      return;
    }
    link.classList.toggle('text-brand-700', isActive);
    link.classList.toggle('font-bold', isActive);
  });
}

function activateSection(sectionId, options = {}) {
  const { updateHash = true, scroll = true, navigationSource = 'app' } = options;
  state.activeSection = sectionId;
  renderSectionVisibility(sectionId);

  if (sectionId === 'assessment' && (navigationSource === 'spa_link' || navigationSource === 'hash')) {
    markAssessmentStartedOnce(navigationSource === 'hash' ? 'hash' : 'nav');
  }

  if (updateHash) {
    history.replaceState(null, '', sectionId ? `#${sectionId}` : '#hero');
  }

  if (!sectionId) {
    const homePanel = document.querySelector('[data-home-panel="true"]');
    if (scroll && homePanel) {
      homePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return;
  }

  const panel = document.querySelector(`[data-section-panel="${sectionId}"]`);
  if (!panel) {
    return;
  }

  if (scroll) {
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (sectionId === 'contact') {
    applyContactPrefills();
  }
}

function resolveInitialSection() {
  const hash = window.location.hash.replace('#', '');
  if (hash && document.querySelector(`[data-section-panel="${hash}"]`)) {
    return hash;
  }
  if (hash === 'hero') {
    return '';
  }
  return '';
}

function bindSectionLinks() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-section-link]');
    if (!link) {
      return;
    }
    const sectionId = link.dataset.sectionLink;
    if (sectionId === 'home') {
      event.preventDefault();
      activateSection('', { updateHash: true, scroll: true });
      return;
    }
    if (!sectionId || !document.querySelector(`[data-section-panel="${sectionId}"]`)) {
      return;
    }
    event.preventDefault();
    if (link.dataset.certpathEvent) {
      trackProduct(link.dataset.certpathEvent, {
        cta_label: link.dataset.certpathEventLabel || undefined,
        target_section: sectionId
      });
    }
    activateSection(sectionId, { navigationSource: 'spa_link' });
  });
}

function resetForm() {
  const emptyProfile = {
    productName: '',
    productUrl: '',
    salesChannel: '',
    productCategory: '',
    sellerRole: '',
    ceStatus: '',
    electrical: '',
    battery: '',
    wireless: '',
    skinContact: '',
    children: '',
    markets: [],
    documents: [],
    electricalPowerSource: '',
    batteryRemovable: '',
    batteryChemistry: '',
    wirelessTech: '',
    childAgeFocus: ''
  };
  state.aiAnalysis = null;
  state.wizardStep = 1;
  localStorage.removeItem(STORAGE_KEY);
  hideWizardValidation();
  restoreProfile(emptyProfile);
  setSavedStatus('cleared');
  setAnalysisStatus();
  renderWizardChrome();
  renderResults(getProfile());
}

function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('contact-name').value || t('contact.demoVisitor');
  const categoryVal = elements.contactProductCategory?.value;
  const roleVal = elements.contactSellerRole?.value;
  const docGapVal = elements.contactDocGap?.value;
  const urgencyVal = elements.contactUrgency?.value;
  const markets = getContactMarketSelection();
  const detailLines = [
    categoryVal ? `${t('contact.form.productCategory')}: ${getFilterLabel('categories', categoryVal)}` : '',
    roleVal ? `${t('contact.form.sellerRole')}: ${getFilterLabel('sellerRoles', roleVal)}` : '',
    docGapVal ? `${t('contact.form.docGap')}: ${t(`contact.docGaps.${docGapVal}`)}` : '',
    urgencyVal ? `${t('contact.form.urgency')}: ${t(`contact.urgency.${urgencyVal}`)}` : '',
    markets.length ? `${t('contact.form.markets')}: ${markets.map((m) => getFilterLabel('markets', m)).join(', ')}` : ''
  ].filter(Boolean);
  const suffix = detailLines.length ? `\n\n${detailLines.join('\n')}` : '';
  trackProduct(window.CertPathAnalytics?.EVENTS?.SUPPORT_REQUESTED || 'support_requested', {
    has_structured: Boolean(categoryVal || roleVal || docGapVal || urgencyVal),
    markets_selected: markets.length,
    urgency_set: Boolean(urgencyVal),
    doc_gap_set: Boolean(docGapVal)
  });
  alert(`${t('contact.alert', { name })}${suffix}`);
  elements.contactForm.reset();
}

function handleSaveApiKey() {
  if (window.CertPathAiEnvironment && !window.CertPathAiEnvironment.isBrowserGeminiDemoEnabled()) {
    setAnalysisStatus(t('results.aiProductionBrowserBlocked'), 'warning');
    return;
  }
  const apiKey = elements.geminiApiKey?.value?.trim() || '';
  if (!apiKey) {
    clearBrowserApiKey();
  } else {
    saveBrowserApiKey(apiKey);
  }
  renderApiKeyStatus();
  setAnalysisStatus(apiKey ? t('results.aiBrowserConfigured') : t('results.aiUnavailable'), apiKey ? 'info' : 'warning');
}

function handleClearApiKey() {
  clearBrowserApiKey();
  if (elements.geminiApiKey) {
    elements.geminiApiKey.value = '';
  }
  renderApiKeyStatus();
  state.aiAnalysis = null;
  setAnalysisStatus(t('results.aiUnavailable'), 'warning');
  renderResults(getProfile());
}

async function init() {
  try {
    state.locale = resolveInitialLocale();
    state.activeSection = resolveInitialSection();
    const response = await fetch('./data.json');
    state.data = await response.json();

    renderLanguageSwitchers();
    const savedProfile = readProfile();
    renderApp(savedProfile);
    bindReportToolbar();
    setSavedStatus(savedProfile ? 'loaded' : 'waiting');

    const onLanguageSwitch = (event) => {
      const locale = event.target.closest('[data-locale]')?.dataset.locale;
      if (locale) {
        handleLanguageChange(locale);
      }
    };

    elements.languageSwitcher?.addEventListener('click', onLanguageSwitch);
    elements.mobileLanguageSwitcher?.addEventListener('click', onLanguageSwitch);
    bindSectionLinks();
    if (state.activeSection === 'assessment') {
      markAssessmentStartedOnce('hash');
    }
    if (state.activeSection === 'contact') {
      applyContactPrefills();
    }
    window.addEventListener('hashchange', () => {
      const sectionId = resolveInitialSection();
      activateSection(sectionId, { updateHash: false, scroll: false, navigationSource: 'hash' });
    });

    elements.findButton.addEventListener('click', async () => {
      const profile = getProfile();
      state.aiAnalysis = null;
      saveProfile(profile);
      activateSection('assessment', { updateHash: true, scroll: false });
      if (state.wizardStep !== WIZARD_STEP_COUNT) {
        hideWizardValidation();
        if (elements.wizardValidationBanner) {
          elements.wizardValidationBanner.textContent = t('wizard.validation.finishStepsFirst');
          elements.wizardValidationBanner.classList.remove('hidden');
        }
        scrollWizardToTop();
        return;
      }
      if (!isProfileReady(profile)) {
        setAnalysisStatus(t('results.validationIncomplete'), 'warning');
        renderResults(profile, { preserveAnalysisStatus: true });
        return;
      }
      hideWizardValidation();
      setAnalysisStatus();
      renderResults(profile);
      trackProduct(window.CertPathAnalytics?.EVENTS?.ASSESSMENT_COMPLETED || 'assessment_completed', {
        product_category: profile.productCategory || undefined,
        sales_channel: profile.salesChannel || undefined,
        wizard_step_count: WIZARD_STEP_COUNT
      });
      await fetchAiAnalysis(profile);
      elements.complianceReportBody?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    elements.wizardBackButton?.addEventListener('click', handleWizardBack);
    elements.wizardNextButton?.addEventListener('click', handleWizardNext);
    elements.assessmentForm?.addEventListener('change', () => {
      syncWizardBranchPanels();
      saveProfile(getProfile());
      if (state.wizardStep === 5) {
        renderWizardReview();
      }
    });
    elements.assessmentForm?.addEventListener('input', () => {
      scheduleProfilePersistFromInput();
    });
    elements.resetButton.addEventListener('click', resetForm);
    elements.saveApiKeyButton?.addEventListener('click', handleSaveApiKey);
    elements.clearApiKeyButton?.addEventListener('click', handleClearApiKey);
    elements.contactForm.addEventListener('submit', handleContactSubmit);
    document.addEventListener('click', (event) => {
      const interestLink = event.target.closest('a[data-package-interest]');
      if (interestLink?.dataset.packageInterest) {
        sessionStorage.setItem('certpath-package-interest', interestLink.dataset.packageInterest);
        trackProduct(window.CertPathAnalytics?.EVENTS?.PACKAGE_CTA_CLICKED || 'package_cta_clicked', {
          package_interest: interestLink.dataset.packageInterest,
          tier_key: interestLink.dataset.packageCta || undefined,
          cta_surface: interestLink.closest('#package-grid') ? 'package_card_secondary' : 'footer_or_static'
        });
      }
      const tierLink = event.target.closest('a[data-package-cta]');
      if (tierLink?.dataset.packageCta && tierLink !== interestLink) {
        trackProduct(window.CertPathAnalytics?.EVENTS?.PACKAGE_CTA_CLICKED || 'package_cta_clicked', {
          tier_key: tierLink.dataset.packageCta,
          cta_target: tierLink.dataset.packageCtaTarget || undefined,
          package_interest: tierLink.dataset.packageCtaInterest || undefined,
          cta_surface: 'package_card_primary'
        });
      }
    }, true);
  } catch (error) {
    applyStaticTranslations();
    if (elements.complianceReportBody) {
      elements.complianceReportBody.innerHTML = `
      <div class="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div class="text-lg font-bold text-slate-900">${t('status.error')}</div>
      </div>
    `;
    }
    setReportToolbarVisible(false);
    setSavedStatus('error');
  }
}

init();
