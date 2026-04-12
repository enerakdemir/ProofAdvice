const STORAGE_KEY = 'certirehber-product-profile';
const LANGUAGE_KEY = 'certirehber-language';

const elements = {
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
  findButton: document.getElementById('find-button'),
  resetButton: document.getElementById('reset-button'),
  summaryGrid: document.getElementById('summary-grid'),
  resultGrid: document.getElementById('result-grid'),
  nextActions: document.getElementById('next-actions'),
  statsGrid: document.getElementById('stats-grid'),
  playbookGrid: document.getElementById('playbook-grid'),
  packageGrid: document.getElementById('package-grid'),
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
  data: null,
  locale: 'tr'
};

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
    wrapper.className = 'flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:border-sky-300 hover:bg-white';
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
    wrapper.className = 'flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:border-sky-300 hover:bg-white';
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
    documents: getCheckboxValues(elements.documentsContainer)
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

function uniquePush(list, value) {
  if (value && !list.includes(value)) {
    list.push(value);
  }
}

function buildAnalysis(profile) {
  const requiredDocuments = [];
  const regulations = [];
  const missing = [];
  const risks = [];
  const nextSteps = [];

  uniquePush(requiredDocuments, 'Declaration of Conformity');
  uniquePush(requiredDocuments, 'Technical file structure');
  uniquePush(requiredDocuments, 'Label and marking review');
  uniquePush(requiredDocuments, 'User manual / instructions');

  if (profile.markets.includes('eu')) {
    uniquePush(regulations, 'EU GPSR readiness review');
    uniquePush(nextSteps, 'Confirm the EU listing path and make sure the product file supports EU market surveillance requests.');
  }
  if (profile.markets.includes('uk')) {
    uniquePush(regulations, 'UK product safety and importer responsibility review');
    uniquePush(nextSteps, 'Review UK-side importer or responsible operator expectations before launch.');
  }

  if (profile.electrical === 'yes') {
    uniquePush(requiredDocuments, 'Electrical test evidence');
    uniquePush(regulations, 'Electrical safety review');
    uniquePush(regulations, 'EMC review');
    uniquePush(nextSteps, 'Check electrical safety evidence and make sure the technical file references the right product variant.');
  } else if (profile.electrical === 'not-sure') {
    uniquePush(missing, 'Clarify whether the product is classified as electrical.');
  }

  if (profile.battery === 'yes') {
    uniquePush(requiredDocuments, 'Battery safety information');
    uniquePush(requiredDocuments, 'Transport and battery labeling details');
    uniquePush(regulations, 'Battery regulation and transport review');
    uniquePush(risks, 'Battery-powered products often carry extra transport, safety, and labeling risk.');
  } else if (profile.battery === 'not-sure') {
    uniquePush(missing, 'Clarify whether an internal or removable battery is present.');
  }

  if (profile.wireless === 'yes') {
    uniquePush(requiredDocuments, 'Wireless / radio test evidence');
    uniquePush(regulations, 'Radio equipment / wireless functionality review');
    uniquePush(risks, 'Wireless features may trigger additional testing or supplier evidence needs.');
  } else if (profile.wireless === 'not-sure') {
    uniquePush(missing, 'Confirm whether the product uses Bluetooth, Wi-Fi, RF, or similar wireless features.');
  }

  if (profile.skinContact === 'yes') {
    uniquePush(requiredDocuments, 'Material and contact-safety information');
    uniquePush(regulations, 'Material safety / contact-risk review');
    uniquePush(nextSteps, 'Check which materials contact the body and whether supplier evidence covers those materials.');
  } else if (profile.skinContact === 'not-sure') {
    uniquePush(missing, 'Clarify whether the product is worn, attached to skin, or used directly on the body.');
  }

  if (profile.children === 'yes') {
    uniquePush(requiredDocuments, 'Child-safety warnings and age guidance');
    uniquePush(regulations, 'Children product safety review');
    uniquePush(risks, 'Products intended for children usually require a tighter safety and warning review.');
  } else if (profile.children === 'not-sure') {
    uniquePush(missing, 'Clarify whether children are a target user group or likely user group.');
  }

  switch (profile.productCategory) {
    case 'consumer-electronics':
      uniquePush(regulations, 'General consumer electronics conformity review');
      break;
    case 'lighting':
      uniquePush(regulations, 'Lighting product conformity review');
      break;
    case 'chargers-batteries':
      uniquePush(regulations, 'Charger and battery accessory review');
      uniquePush(risks, 'Chargers and battery accessories are often requested by marketplaces for extra proof.');
      break;
    case 'home-kitchen-electrical':
      uniquePush(regulations, 'Home and kitchen electrical use-case review');
      break;
    case 'fitness-gadgets':
      uniquePush(regulations, 'Wearable or fitness-device review');
      break;
    case 'beauty-devices':
      uniquePush(regulations, 'Beauty device safety and contact review');
      break;
    case 'children-tech':
      uniquePush(regulations, 'Child-oriented technical product review');
      uniquePush(risks, 'Child-focused positioning increases sensitivity around warnings, intended use, and supporting evidence.');
      break;
    case 'general-non-electrical':
      uniquePush(regulations, 'General product safety review');
      break;
    default:
      break;
  }

  if (profile.salesChannel === 'amazon') {
    uniquePush(nextSteps, 'Prepare the file pack in a format that can answer Amazon compliance document requests quickly.');
  }
  if (profile.salesChannel === 'multi') {
    uniquePush(risks, 'Multiple channels usually mean multiple listing standards and stricter document consistency needs.');
  }

  if (profile.sellerRole === 'reseller' || profile.sellerRole === 'importer') {
    uniquePush(requiredDocuments, 'Supplier compliance pack');
    uniquePush(missing, 'Confirm which core documents must come from the supplier and which must be prepared on your side.');
    uniquePush(risks, 'Reseller and importer models often fail because supplier evidence is incomplete or product-specific proof is weak.');
  }
  if (profile.sellerRole === 'not-sure') {
    uniquePush(missing, 'Clarify whether you act as manufacturer, importer, or reseller in the target market.');
  }

  if (profile.ceStatus === 'no') {
    uniquePush(risks, 'No CE or supplier pack is currently visible, which is a major signal for listing and market-entry risk.');
    uniquePush(nextSteps, 'Request the supplier evidence pack before spending time on final listing preparation.');
  }
  if (profile.ceStatus === 'not-sure') {
    uniquePush(missing, 'Clarify whether any CE, DoC, or supplier evidence already exists.');
  }

  if (!profile.documents.includes('test-report')) {
    uniquePush(missing, 'Test reports are not marked as available.');
  }
  if (!profile.documents.includes('doc')) {
    uniquePush(missing, 'Declaration of Conformity is not marked as available.');
  }
  if (!profile.documents.includes('manual')) {
    uniquePush(missing, 'User manual or instruction set is not marked as available.');
  }
  if (!profile.documents.includes('label-pack')) {
    uniquePush(missing, 'Label or marking pack is not marked as available.');
  }
  if ((profile.sellerRole === 'reseller' || profile.sellerRole === 'importer') && !profile.documents.includes('supplier-pack')) {
    uniquePush(missing, 'Supplier compliance pack is not marked as available.');
  }

  if (!profile.markets.length) {
    uniquePush(missing, 'Choose at least one target market.');
  }

  uniquePush(nextSteps, 'Turn the likely document list into a supplier follow-up checklist and close the missing items one by one.');
  uniquePush(nextSteps, 'If the product is strategically important, move from the check into a starter pack before launch.');

  return { requiredDocuments, regulations, missing, risks, nextSteps };
}

function buildResultCard(title, items, tone = 'neutral') {
  const toneClasses = {
    neutral: 'border-slate-200 bg-white',
    warning: 'border-amber-200 bg-amber-50/60'
  };
  const listHtml = items.length
    ? items.map((item) => `<li class="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">${item}</li>`).join('')
    : `<li class="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-500">${t('common.none')}</li>`;

  return `
    <article class="rounded-[1.75rem] border p-6 shadow-sm ${toneClasses[tone] || toneClasses.neutral}">
      <div class="text-lg font-bold text-slate-900">${title}</div>
      <ul class="mt-5 space-y-3">${listHtml}</ul>
    </article>
  `;
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
  elements.packageGrid.innerHTML = state.data.packages.map((item) => `
    <article class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between gap-4">
        <div class="text-xl font-black tracking-tight text-slate-950">${localize(item.name)}</div>
        <div class="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-brand-700">${item.price}</div>
      </div>
      <p class="mt-4 text-sm leading-6 text-slate-600">${localize(item.summary)}</p>
      <div class="mt-5 space-y-3">
        ${item.deliverables.map((deliverable) => `
          <div class="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">${localize(deliverable)}</div>
        `).join('')}
      </div>
      <a href="#contact" class="mt-6 inline-flex items-center justify-center rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-900">${t('packages.cta')}</a>
    </article>
  `).join('');
}

function renderResources() {
  elements.resourceGrid.innerHTML = state.data.resources.map((item) => `
    <article class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <span class="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-brand-700">${localize(item.type)}</span>
      <h3 class="mt-4 text-xl font-black tracking-tight text-slate-950">${localize(item.title)}</h3>
      <p class="mt-3 text-sm leading-6 text-slate-600">${localize(item.description)}</p>
    </article>
  `).join('');
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

function renderResults(profile) {
  const isReady = profile.productName
    && profile.salesChannel
    && profile.productCategory
    && profile.sellerRole
    && profile.ceStatus
    && profile.electrical
    && profile.battery
    && profile.wireless
    && profile.skinContact
    && profile.children
    && profile.markets.length;

  if (!isReady) {
    elements.summaryGrid.innerHTML = createEmptyState();
    elements.resultGrid.innerHTML = '';
    elements.nextActions.innerHTML = '';
    return;
  }

  const analysis = buildAnalysis(profile);
  const channelLabel = getFilterLabel('channels', profile.salesChannel);
  const categoryLabel = getFilterLabel('categories', profile.productCategory);
  const roleLabel = getFilterLabel('sellerRoles', profile.sellerRole);
  const ceLabel = getFilterLabel('ceStatuses', profile.ceStatus);
  const marketLabel = profile.markets.map((item) => getFilterLabel('markets', item)).join(', ');

  elements.summaryGrid.innerHTML = [
    createSummaryCard(t('results.summaryOne'), profile.productName, `${categoryLabel} · ${channelLabel} · ${marketLabel}`),
    createSummaryCard(t('results.summaryTwo'), roleLabel, ceLabel),
    createSummaryCard(t('results.summaryThree'), getDocumentCountText(profile), profile.productUrl || t('common.none'))
  ].join('');

  elements.resultGrid.innerHTML = [
    buildResultCard(t('results.documentsTitle'), analysis.requiredDocuments),
    buildResultCard(t('results.regulationsTitle'), analysis.regulations),
    buildResultCard(t('results.missingTitle'), analysis.missing),
    buildResultCard(t('results.risksTitle'), analysis.risks, 'warning')
  ].join('');

  const packagePath = state.data.packages.map((item) => `${localize(item.name)} · ${item.price}`);
  elements.nextActions.innerHTML = [
    buildResultCard(t('results.nextTitle'), analysis.nextSteps),
    buildResultCard(t('results.packagesTitle'), packagePath)
  ].join('');
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
}

function renderForm(profile) {
  populateSelect(elements.salesChannel, t('assessment.fields.channel'), state.data.filters.channels);
  populateSelect(elements.productCategory, t('assessment.fields.category'), state.data.filters.categories);
  populateSelect(elements.sellerRole, t('assessment.fields.role'), state.data.filters.sellerRoles);
  populateSelect(elements.ceStatus, t('assessment.fields.ceStatus'), state.data.filters.ceStatuses);
  restoreProfile(profile);
}

function renderApp(profile) {
  applyStaticTranslations();
  renderLanguageSwitchers();
  renderStats();
  renderPlaybooks();
  renderPackages();
  renderResources();
  renderFaq();
  renderForm(profile);

  elements.footerDisclaimer.textContent = localize(state.data.meta.disclaimer);
  elements.footerMeta.textContent = t('footer.meta', {
    date: state.data.meta.lastGlobalUpdate,
    email: state.data.meta.supportEmail
  });

  renderResults(getProfile());
}

function handleLanguageChange(locale) {
  state.locale = locale;
  saveLocale(locale);
  const currentProfile = getProfile();
  renderApp(currentProfile);
  setSavedStatus(readProfile() ? 'loaded' : 'waiting');
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
    documents: []
  };
  localStorage.removeItem(STORAGE_KEY);
  restoreProfile(emptyProfile);
  setSavedStatus('cleared');
  renderResults(getProfile());
}

function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('contact-name').value || t('contact.demoVisitor');
  alert(t('contact.alert', { name }));
  elements.contactForm.reset();
}

async function init() {
  try {
    state.locale = resolveInitialLocale();
    const response = await fetch('./data.json');
    state.data = await response.json();

    renderLanguageSwitchers();
    const savedProfile = readProfile();
    renderApp(savedProfile);
    setSavedStatus(savedProfile ? 'loaded' : 'waiting');

    const onLanguageSwitch = (event) => {
      const locale = event.target.closest('[data-locale]')?.dataset.locale;
      if (locale) {
        handleLanguageChange(locale);
      }
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
    elements.summaryGrid.innerHTML = `
      <div class="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
        <div class="text-lg font-bold text-slate-900">${t('status.error')}</div>
      </div>
    `;
    setSavedStatus('error');
  }
}

init();
