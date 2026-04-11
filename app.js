const STORAGE_KEY = 'certirehber-profile';
const LANGUAGE_KEY = 'certirehber-language';

const elements = {
  sector: document.getElementById('sector'),
  employees: document.getElementById('employees'),
  stage: document.getElementById('stage'),
  personalData: document.getElementById('personalData'),
  regionsContainer: document.getElementById('regions-container'),
  findButton: document.getElementById('find-button'),
  resetButton: document.getElementById('reset-button'),
  summaryGrid: document.getElementById('summary-grid'),
  resultContent: document.getElementById('result-content'),
  nextActions: document.getElementById('next-actions'),
  statsGrid: document.getElementById('stats-grid'),
  journeyGrid: document.getElementById('journey-grid'),
  certificateGrid: document.getElementById('certificate-grid'),
  playbookGrid: document.getElementById('playbook-grid'),
  resourceGrid: document.getElementById('resource-grid'),
  faqGrid: document.getElementById('faq-grid'),
  savedStatus: document.getElementById('saved-status'),
  footerDisclaimer: document.getElementById('footer-disclaimer'),
  footerMeta: document.getElementById('footer-meta'),
  contactForm: document.getElementById('contact-form'),
  languageSwitcher: document.getElementById('language-switcher'),
  mobileLanguageSwitcher: document.getElementById('language-switcher-mobile'),
  metaDescription: document.querySelector('meta[name="description"]')
};

const state = {
  baseData: null,
  locale: 'tr'
};

function getSupportedLocales() {
  return window.APP_I18N?.locales || [];
}

function getCurrentUi() {
  return window.APP_I18N?.ui?.[state.locale] || window.APP_I18N?.ui?.tr || {};
}

function getCurrentDataOverlay() {
  return window.APP_I18N?.data?.[state.locale] || {};
}

function t(key, replacements = {}) {
  const value = key.split('.').reduce((accumulator, part) => accumulator?.[part], getCurrentUi());
  const fallback = key.split('.').reduce((accumulator, part) => accumulator?.[part], window.APP_I18N?.ui?.tr || {});
  const template = value ?? fallback ?? key;

  return Object.entries(replacements).reduce((text, [name, replacement]) => {
    return text.replaceAll(`{${name}}`, replacement);
  }, template);
}

function createOption(value, label) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = label;
  return option;
}

function createEmptyState(title, description) {
  return `
    <div class="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
      <div class="text-lg font-bold text-slate-900">${title}</div>
      <p class="mt-2 text-sm leading-6 text-slate-600">${description}</p>
    </div>
  `;
}

function obligationClasses(obligation) {
  return obligation === 'zorunlu'
    ? 'bg-rose-50 text-rose-700 border border-rose-100'
    : 'bg-emerald-50 text-emerald-700 border border-emerald-100';
}

function getObligationLabel(obligation) {
  return obligation === 'zorunlu' ? t('common.required') : t('common.recommended');
}

function normalizeEmployees(rangeValue) {
  if (!rangeValue) {
    return 0;
  }
  if (rangeValue === '250+') {
    return 250;
  }
  return Number(rangeValue.split('-')[0]);
}

function matchesEmployeeRequirement(requirement, employeeRange) {
  if (!requirement || requirement === 'all') {
    return true;
  }
  const employeeMin = normalizeEmployees(employeeRange);
  if (!employeeMin && requirement !== '1+') {
    return false;
  }
  if (requirement.endsWith('+')) {
    return employeeMin >= Number(requirement.replace('+', ''));
  }
  return true;
}

function matchesRegions(certificateRegions, selectedRegions) {
  if (!selectedRegions.length) {
    return false;
  }
  if (selectedRegions.includes('Global')) {
    return true;
  }
  return certificateRegions.includes('Global') || selectedRegions.some((region) => certificateRegions.includes(region));
}

function getSelectedRegions() {
  return Array.from(elements.regionsContainer.querySelectorAll('input[type="checkbox"]:checked')).map((input) => input.value);
}

function getProfile() {
  return {
    sector: elements.sector.value,
    employees: elements.employees.value,
    stage: elements.stage.value,
    personalData: elements.personalData.value,
    regions: getSelectedRegions()
  };
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

function resolveInitialLocale() {
  const savedLocale = localStorage.getItem(LANGUAGE_KEY);
  if (savedLocale && getSupportedLocales().some((item) => item.code === savedLocale)) {
    return savedLocale;
  }

  const browserLanguage = (navigator.language || 'tr').toLowerCase();
  const match = getSupportedLocales().find((item) => browserLanguage.startsWith(item.code));
  return match?.code || 'tr';
}

function saveLocale(locale) {
  localStorage.setItem(LANGUAGE_KEY, locale);
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
        ? 'rounded-full bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white transition'
        : 'rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-sky-50 hover:text-brand-700';
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
  elements.metaDescription.setAttribute('content', t('meta.description'));

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
    node.setAttribute('placeholder', t(node.dataset.i18nPlaceholder));
  });
}

function getLocalizedMeta() {
  const overlay = getCurrentDataOverlay().meta || {};
  return {
    ...state.baseData.meta,
    ...overlay
  };
}

function getLocalizedStats() {
  const labels = getCurrentDataOverlay().stats || [];
  return state.baseData.stats.map((item, index) => ({
    ...item,
    label: labels[index] || item.label
  }));
}

function getLocalizedFilters() {
  const filters = getCurrentDataOverlay().filters || {};
  const sectors = state.baseData.filters.sectors.map((value) => ({
    value,
    label: filters.sectors?.[value] || value
  }));
  const employeeRanges = state.baseData.filters.employeeRanges.map((item) => ({
    ...item,
    label: filters.employeeRanges?.[item.value] || item.label
  }));
  const businessStages = state.baseData.filters.businessStages.map((item) => ({
    ...item,
    label: filters.businessStages?.[item.value] || item.label
  }));
  const regions = state.baseData.filters.regions.map((item) => ({
    ...item,
    label: filters.regions?.[item.value] || item.label
  }));

  return { sectors, employeeRanges, businessStages, regions };
}

function getLocalizedJourney() {
  const overlay = getCurrentDataOverlay().journey || [];
  return state.baseData.journey.map((item, index) => ({
    ...item,
    ...(overlay[index] || {})
  }));
}

function getLocalizedCertificate(certificate) {
  const overlay = getCurrentDataOverlay().certificates?.[certificate.id] || {};
  return {
    ...certificate,
    ...overlay
  };
}

function getLocalizedCertificates() {
  return state.baseData.certificates.map(getLocalizedCertificate);
}

function getLocalizedPlaybooks() {
  const playbooks = getCurrentDataOverlay().playbooks || {};
  return state.baseData.playbooks.map((item) => ({
    ...item,
    ...(playbooks[item.sector] || {})
  }));
}

function getLocalizedResources() {
  const overlay = getCurrentDataOverlay().resources || [];
  return state.baseData.resources.map((item, index) => ({
    ...item,
    ...(overlay[index] || {})
  }));
}

function getLocalizedFaq() {
  const overlay = getCurrentDataOverlay().faq || [];
  return state.baseData.faq.map((item, index) => ({
    ...item,
    ...(overlay[index] || {})
  }));
}

function getSectorLabel(value) {
  return getLocalizedFilters().sectors.find((item) => item.value === value)?.label || value;
}

function getStageLabel(value) {
  return getLocalizedFilters().businessStages.find((item) => item.value === value)?.label || value;
}

function getRegionLabel(value) {
  return getLocalizedFilters().regions.find((item) => item.value === value)?.label || value;
}

function regionBadge(regionValue) {
  return `<span class="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-brand-700">${getRegionLabel(regionValue)}</span>`;
}

function populateSelect(selectElement, placeholder, items) {
  selectElement.innerHTML = '';
  selectElement.appendChild(createOption('', placeholder));
  items.forEach((item) => {
    if (typeof item === 'string') {
      selectElement.appendChild(createOption(item, item));
      return;
    }
    selectElement.appendChild(createOption(item.value, item.label));
  });
}

function renderPersonalDataOptions() {
  elements.personalData.innerHTML = '';
  elements.personalData.appendChild(createOption('', t('select.personalData')));
  elements.personalData.appendChild(createOption('true', t('common.yes')));
  elements.personalData.appendChild(createOption('false', t('common.no')));
}

function renderRegions(regions) {
  elements.regionsContainer.innerHTML = '';
  regions.forEach((region) => {
    const wrapper = document.createElement('label');
    wrapper.className = 'flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:border-sky-300 hover:bg-white';
    wrapper.innerHTML = `
      <input type="checkbox" value="${region.value}" class="mt-1 h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500">
      <span>
        <span class="block font-semibold text-slate-900">${region.label}</span>
        <span class="mt-1 block text-xs leading-5 text-slate-500">${region.value === 'Global' ? t('regions.globalHint') : t('regions.marketHint')}</span>
      </span>
    `;
    elements.regionsContainer.appendChild(wrapper);
  });
}

function renderStats(stats) {
  elements.statsGrid.innerHTML = stats.map((stat) => `
    <div class="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <div class="text-3xl font-black tracking-tight text-brand-700">${stat.value}</div>
      <div class="mt-2 text-sm leading-6 text-slate-600">${stat.label}</div>
    </div>
  `).join('');
}

function renderJourney(journey) {
  elements.journeyGrid.innerHTML = journey.map((item) => `
    <article class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div class="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">${item.step}</div>
      <h3 class="mt-3 text-xl font-black tracking-tight text-slate-950">${item.title}</h3>
      <p class="mt-3 text-sm leading-6 text-slate-600">${item.description}</p>
    </article>
  `).join('');
}

function renderCertificates(certificates) {
  elements.certificateGrid.innerHTML = certificates.map((rawCertificate) => {
    const certificate = getLocalizedCertificate(rawCertificate);
    return `
      <article class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex flex-wrap items-center gap-2">
          <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">${certificate.category}</span>
          <span class="rounded-full px-3 py-1 text-xs font-semibold ${obligationClasses(certificate.obligation)}">${getObligationLabel(certificate.obligation)}</span>
        </div>
        <h3 class="mt-4 text-xl font-black tracking-tight text-slate-950">${certificate.name}</h3>
        <p class="mt-3 text-sm leading-6 text-slate-600">${certificate.summary}</p>
        <div class="mt-4 flex flex-wrap gap-2">${certificate.regions.map(regionBadge).join('')}</div>
        <div class="mt-5 grid gap-3 text-sm text-slate-600">
          <div><span class="font-semibold text-slate-900">${t('common.duration')}:</span> ${certificate.estimatedTimeline}</div>
          <div><span class="font-semibold text-slate-900">${t('common.cost')}:</span> ${certificate.estimatedCost}</div>
          <div><span class="font-semibold text-slate-900">${t('common.authority')}:</span> ${certificate.issuingAuthority}</div>
        </div>
      </article>
    `;
  }).join('');
}

function renderPlaybooks(playbooks) {
  elements.playbookGrid.innerHTML = playbooks.map((item) => `
    <article class="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
      <div class="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">${getSectorLabel(item.sector)}</div>
      <h3 class="mt-3 text-2xl font-black tracking-tight">${item.headline}</h3>
      <p class="mt-3 text-sm leading-6 text-slate-300">${item.summary}</p>
      <div class="mt-5 flex flex-wrap gap-2">
        ${item.recommendedCertificates.map((certificate) => `<span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sky-100">${certificate}</span>`).join('')}
      </div>
    </article>
  `).join('');
}

function renderResources(resources) {
  elements.resourceGrid.innerHTML = resources.map((resource) => `
    <article class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <span class="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-brand-700">${resource.type}</span>
      <h3 class="mt-4 text-xl font-black tracking-tight text-slate-950">${resource.title}</h3>
      <p class="mt-3 text-sm leading-6 text-slate-600">${resource.description}</p>
    </article>
  `).join('');
}

function renderFaq(faq) {
  elements.faqGrid.innerHTML = faq.map((item) => `
    <details class="group rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-slate-900">
        <span>${item.question}</span>
        <i class="fa-solid fa-plus text-brand-700 transition group-open:rotate-45"></i>
      </summary>
      <p class="mt-4 text-sm leading-7 text-slate-600">${item.answer}</p>
    </details>
  `).join('');
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

function buildResultCard(title, description, certificates, emptyMessage) {
  if (!certificates.length) {
    return `
      <article class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div class="text-lg font-bold text-slate-900">${title}</div>
        <p class="mt-2 text-sm leading-6 text-slate-600">${description}</p>
        <div class="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">${emptyMessage}</div>
      </article>
    `;
  }

  return `
    <article class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div class="text-lg font-bold text-slate-900">${title}</div>
      <p class="mt-2 text-sm leading-6 text-slate-600">${description}</p>
      <div class="mt-5 space-y-4">
        ${certificates.map((rawCertificate) => {
          const certificate = getLocalizedCertificate(rawCertificate);
          return `
            <div class="rounded-2xl border border-slate-200 p-4">
              <div class="flex flex-wrap items-center gap-2">
                <div class="text-base font-bold text-slate-950">${certificate.name}</div>
                <span class="rounded-full px-3 py-1 text-xs font-semibold ${obligationClasses(certificate.obligation)}">${getObligationLabel(certificate.obligation)}</span>
              </div>
              <p class="mt-2 text-sm leading-6 text-slate-600">${certificate.summary}</p>
              <div class="mt-3 flex flex-wrap gap-2">${certificate.regions.map(regionBadge).join('')}</div>
              <div class="mt-3 text-xs leading-5 text-slate-500">${certificate.officialHint}</div>
            </div>
          `;
        }).join('')}
      </div>
    </article>
  `;
}

function renderNextActions(profile, mandatoryCertificates, recommendedCertificates) {
  const totalCertificates = mandatoryCertificates.length + recommendedCertificates.length;
  const firstMandatory = mandatoryCertificates[0] ? getLocalizedCertificate(mandatoryCertificates[0]).name : '';
  const actions = [
    {
      title: t('actions.first.title'),
      description: mandatoryCertificates.length
        ? t('actions.first.withMandatory', { certificate: firstMandatory })
        : t('actions.first.withoutMandatory')
    },
    {
      title: t('actions.second.title'),
      description: profile.personalData === 'true'
        ? t('actions.second.personalData')
        : t('actions.second.noPersonalData')
    },
    {
      title: t('actions.third.title'),
      description: totalCertificates > 2
        ? t('actions.third.complex')
        : t('actions.third.simple')
    }
  ];

  elements.nextActions.innerHTML = actions.map((action) => `
    <article class="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div class="text-base font-bold text-slate-950">${action.title}</div>
      <p class="mt-3 text-sm leading-6 text-slate-600">${action.description}</p>
    </article>
  `).join('');
}

function filterCertificates(profile) {
  return state.baseData.certificates.filter((certificate) => {
    const sectorMatch = profile.sector ? certificate.sectors.includes(profile.sector) : true;
    const stageMatch = profile.stage ? certificate.businessStages.includes(profile.stage) : true;
    const employeesMatch = profile.employees ? matchesEmployeeRequirement(certificate.employeeRequirement, profile.employees) : true;
    const regionMatch = matchesRegions(certificate.regions, profile.regions);

    let personalDataMatch = true;
    if (profile.personalData === 'true') {
      personalDataMatch = certificate.requiresPersonalData || !certificate.requiresPersonalData;
    }
    if (profile.personalData === 'false') {
      personalDataMatch = !certificate.requiresPersonalData;
    }

    return sectorMatch && stageMatch && employeesMatch && personalDataMatch && regionMatch;
  });
}

function renderResults(profile) {
  if (!profile.sector || !profile.employees || !profile.stage || !profile.personalData || !profile.regions.length) {
    elements.summaryGrid.innerHTML = createEmptyState(
      t('empty.assessmentTitle'),
      t('empty.assessmentDescription')
    );
    elements.resultContent.innerHTML = '';
    elements.nextActions.innerHTML = '';
    return;
  }

  const filteredCertificates = filterCertificates(profile);
  const mandatoryCertificates = filteredCertificates.filter((item) => item.obligation === 'zorunlu');
  const recommendedCertificates = filteredCertificates.filter((item) => item.obligation !== 'zorunlu');

  const personalDataLabel = profile.personalData === 'true' ? t('summary.personalDataYes') : t('summary.personalDataNo');
  const selectedRegionLabels = profile.regions.map(getRegionLabel).join(', ');
  const sectorLabel = getSectorLabel(profile.sector);
  const stageLabel = getStageLabel(profile.stage);
  const employeeLabel = getLocalizedFilters().employeeRanges.find((item) => item.value === profile.employees)?.label || profile.employees;

  elements.summaryGrid.innerHTML = [
    createSummaryCard(t('summary.companyProfile'), sectorLabel, `${employeeLabel}, ${stageLabel}`),
    createSummaryCard(t('summary.dataProcessing'), personalDataLabel, t('summary.dataProcessingDetail')),
    createSummaryCard(t('summary.targetMarkets'), selectedRegionLabels, t('summary.targetMarketsDetail'))
  ].join('');

  elements.resultContent.innerHTML = [
    buildResultCard(
      t('results.mandatoryTitle'),
      t('results.mandatoryDescription'),
      mandatoryCertificates,
      t('results.mandatoryEmpty')
    ),
    buildResultCard(
      t('results.recommendedTitle'),
      t('results.recommendedDescription'),
      recommendedCertificates,
      t('results.recommendedEmpty')
    )
  ].join('');

  renderNextActions(profile, mandatoryCertificates, recommendedCertificates);
}

function restoreProfile(profile) {
  elements.sector.value = profile?.sector || '';
  elements.employees.value = profile?.employees || '';
  elements.stage.value = profile?.stage || '';
  elements.personalData.value = profile?.personalData || '';

  const regionInputs = elements.regionsContainer.querySelectorAll('input[type="checkbox"]');
  regionInputs.forEach((input) => {
    input.checked = Array.isArray(profile?.regions) ? profile.regions.includes(input.value) : false;
  });
}

function resetForm() {
  restoreProfile({ sector: '', employees: '', stage: '', personalData: '', regions: [] });
  localStorage.removeItem(STORAGE_KEY);
  setSavedStatus('cleared');
  renderResults(getProfile());
}

function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('contact-name').value || t('contact.demoVisitor');
  alert(t('contact.alert', { name }));
  elements.contactForm.reset();
}

function renderApp(profile) {
  const localizedFilters = getLocalizedFilters();
  const localizedMeta = getLocalizedMeta();

  applyStaticTranslations();
  renderLanguageSwitchers();

  elements.footerDisclaimer.textContent = localizedMeta.disclaimer;
  elements.footerMeta.textContent = t('footer.meta', {
    date: localizedMeta.lastGlobalUpdate,
    email: localizedMeta.supportEmail
  });

  populateSelect(elements.sector, t('select.sector'), localizedFilters.sectors);
  populateSelect(elements.employees, t('select.employees'), localizedFilters.employeeRanges);
  populateSelect(elements.stage, t('select.stage'), localizedFilters.businessStages);
  renderPersonalDataOptions();
  renderRegions(localizedFilters.regions);
  renderStats(getLocalizedStats());
  renderJourney(getLocalizedJourney());
  renderCertificates(getLocalizedCertificates());
  renderPlaybooks(getLocalizedPlaybooks());
  renderResources(getLocalizedResources());
  renderFaq(getLocalizedFaq());
  restoreProfile(profile);
  renderResults(getProfile());
}

function handleLanguageChange(locale) {
  state.locale = locale;
  saveLocale(locale);
  const currentProfile = getProfile();
  renderApp(currentProfile);
  setSavedStatus(readProfile() ? 'loaded' : 'waiting');
}

async function init() {
  try {
    state.locale = resolveInitialLocale();

    const response = await fetch('./data.json');
    state.baseData = await response.json();

    renderLanguageSwitchers();

    const savedProfile = readProfile();
    renderApp(savedProfile);
    setSavedStatus(savedProfile ? 'loaded' : 'waiting');

    const onLanguageSwitch = (event) => {
      const locale = event.target.closest('[data-locale]')?.dataset.locale;
      if (!locale) {
        return;
      }
      handleLanguageChange(locale);
    };

    elements.languageSwitcher?.addEventListener('click', onLanguageSwitch);
    elements.mobileLanguageSwitcher?.addEventListener('click', onLanguageSwitch);

    elements.findButton.addEventListener('click', () => {
      const profile = getProfile();
      saveProfile(profile);
      renderResults(profile);
    });

    elements.resetButton.addEventListener('click', resetForm);
    elements.contactForm.addEventListener('submit', handleContactSubmit);
  } catch (error) {
    applyStaticTranslations();
    elements.summaryGrid.innerHTML = createEmptyState(
      t('empty.dataTitle'),
      t('empty.dataDescription')
    );
    setSavedStatus('error');
  }
}

init();
