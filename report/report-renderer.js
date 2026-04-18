/**
 * CertPath report rendering (Layer 1 presentation).
 * Depends on: nothing from app — receives translate/localize via deps and data via ctx.
 * Loaded before app.js; exposes window.CertPathReport.
 */
(function initCertPathReport(global) {
  'use strict';

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function computeReadinessState(profile, engine) {
    const hasCritical = engine.riskFlags.some((f) => f.severity === 'critical');
    if (engine.riskLevel === 'high' || hasCritical || profile.ceStatus === 'no') {
      return { key: 'expert', panelClass: 'border-rose-300 bg-rose-50/95', icon: 'fa-triangle-exclamation' };
    }
    if (engine.riskLevel === 'medium' || engine.missingDocuments.length >= 3 || engine.assumptions.length >= 2) {
      return { key: 'missing', panelClass: 'border-amber-300 bg-amber-50/95', icon: 'fa-circle-exclamation' };
    }
    return { key: 'ready', panelClass: 'border-emerald-200 bg-emerald-50/95', icon: 'fa-circle-check' };
  }

  function formatEngineAreaLine(area) {
    const conf = area.confidence ? ` [${area.confidence}]` : '';
    return `${area.label}${conf} — ${area.rationale}`;
  }

  function reportSectionHtml(t, num, titleKey, subtitleKey, innerHtml, borderClass) {
    const bc = borderClass || 'border-slate-200 bg-white';
    const sub = subtitleKey ? `<p class="mt-1 text-xs font-medium text-slate-500">${t(subtitleKey)}</p>` : '';
    const marker = typeof num === 'number' ? String(num).padStart(2, '0') : String(num);
    const sectionId = `report-h-${String(num).replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'sec'}`;
    return `
    <section class="rounded-[1.75rem] border ${bc} p-6 shadow-sm print:break-inside-avoid" aria-labelledby="${sectionId}">
      <header class="border-b border-slate-100 pb-3">
        <span class="text-[10px] font-black uppercase tracking-[0.22em] text-brand-700">${marker}</span>
        <h3 id="${sectionId}" class="mt-1 text-lg font-black tracking-tight text-slate-950">${t(titleKey)}</h3>
        ${sub}
      </header>
      <div class="mt-4">${innerHtml}</div>
    </section>
  `;
  }

  function buildComplianceReportInnerHtml(ctx, deps) {
    const { t, localize } = deps;
    const { profile, engine, aiAnalysis, channelLabel, marketLabel, roleLabel, ceLabel, categoryLabel, packages = [] } = ctx;
    const readiness = computeReadinessState(profile, engine);
    const assumptionItems = engine.assumptions.slice(0, 8).map((a) => `<li class="text-sm text-slate-700">${escapeHtml(a.field)}: ${escapeHtml(a.text)}</li>`).join('') || `<li class="text-sm text-slate-500">${t('common.none')}</li>`;

    const trustStrip = `
    <div class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs leading-5 text-slate-600 shadow-sm print:border-slate-300">
      <span class="font-bold uppercase tracking-wider text-brand-800">${t('results.report.trustEyebrow')}</span>
      <span class="mx-2 text-slate-300">·</span>
      <span>${escapeHtml(t('results.report.trustBody', { version: engine.engineVersion }))}</span>
    </div>`;

    const s1 = reportSectionHtml(t, 1, 'results.report.sectionAssessmentSummary', 'results.report.sectionAssessmentSummarySub', `
    <dl class="grid gap-3 sm:grid-cols-2">
      <div class="rounded-xl bg-slate-50 px-4 py-3"><dt class="text-[10px] font-bold uppercase tracking-wider text-slate-500">${t('assessment.fields.productName')}</dt><dd class="mt-1 font-semibold text-slate-900">${escapeHtml(profile.productName)}</dd></div>
      <div class="rounded-xl bg-slate-50 px-4 py-3"><dt class="text-[10px] font-bold uppercase tracking-wider text-slate-500">${t('assessment.fields.markets')}</dt><dd class="mt-1 font-semibold text-slate-900">${escapeHtml(marketLabel)}</dd></div>
      <div class="rounded-xl bg-slate-50 px-4 py-3"><dt class="text-[10px] font-bold uppercase tracking-wider text-slate-500">${t('assessment.fields.channel')}</dt><dd class="mt-1 font-semibold text-slate-900">${escapeHtml(channelLabel)}</dd></div>
      <div class="rounded-xl bg-slate-50 px-4 py-3"><dt class="text-[10px] font-bold uppercase tracking-wider text-slate-500">${t('assessment.fields.category')}</dt><dd class="mt-1 font-semibold text-slate-900">${escapeHtml(categoryLabel)}</dd></div>
      <div class="rounded-xl bg-slate-50 px-4 py-3"><dt class="text-[10px] font-bold uppercase tracking-wider text-slate-500">${t('assessment.fields.role')}</dt><dd class="mt-1 font-semibold text-slate-900">${escapeHtml(roleLabel)}</dd></div>
      <div class="rounded-xl bg-slate-50 px-4 py-3"><dt class="text-[10px] font-bold uppercase tracking-wider text-slate-500">${t('assessment.fields.ceStatus')}</dt><dd class="mt-1 font-semibold text-slate-900">${escapeHtml(ceLabel)}</dd></div>
    </dl>
    <div class="mt-4"><div class="text-xs font-bold uppercase tracking-wider text-slate-500">${t('results.report.keyAssumptions')}</div><ul class="mt-2 list-disc space-y-1 pl-5">${assumptionItems}</ul></div>
  `);

    const readinessInner = `
    <div class="flex flex-wrap items-start gap-4">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-2xl text-slate-800 shadow-sm">
        <i class="fa-solid ${readiness.icon}"></i>
      </div>
      <div>
        <p class="text-base font-black text-slate-900">${t(`results.readinessStates.${readiness.key}Title`)}</p>
        <p class="mt-2 text-sm leading-6 text-slate-800">${t(`results.readinessStates.${readiness.key}Detail`)}</p>
      </div>
    </div>`;
    const s2 = reportSectionHtml(t, 2, 'results.report.sectionReadiness', 'results.report.sectionReadinessSub', readinessInner, `${readiness.panelClass} shadow-sm`);

    const riskPillClass = engine.riskLevel === 'high' ? 'bg-rose-100 text-rose-900 border-rose-200' : engine.riskLevel === 'medium' ? 'bg-amber-100 text-amber-950 border-amber-200' : 'bg-emerald-100 text-emerald-900 border-emerald-200';
    const s3 = reportSectionHtml(t, 3, 'results.report.sectionRiskLevel', 'results.report.sectionRiskLevelSub', `
    <div class="flex flex-wrap items-center gap-3">
      <span class="inline-flex items-center rounded-full border px-4 py-2 text-sm font-black uppercase tracking-wide ${riskPillClass}">${t(`results.riskLevelLabel.${engine.riskLevel}`)}</span>
      <p class="max-w-2xl text-sm leading-6 text-slate-600">${escapeHtml(t(`results.riskLevel.${engine.riskLevel}`))}</p>
    </div>
  `);

    const domainsBlock = engine.likelyComplianceAreas.length
      ? `<div class="mb-5"><p class="text-xs font-bold uppercase tracking-wider text-slate-500">${t('results.areasTitle')}</p><ul class="mt-2 space-y-2">${engine.likelyComplianceAreas.map((a) => `
      <li class="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm text-slate-800">
        <i class="fa-solid fa-layer-group mt-0.5 shrink-0 text-brand-600"></i><span>${escapeHtml(formatEngineAreaLine(a))}</span>
      </li>`).join('')}</ul></div>`
      : '';

    const docsIntro = engine.likelyComplianceAreas.length
      ? `<p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">${t('results.report.evidenceDocsLabel')}</p>`
      : '';

    const evidenceList = engine.likelyDocumentsNeeded.map((d) => `
    <li class="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
      <i class="fa-solid fa-file-lines mt-0.5 shrink-0 text-brand-600"></i>
      <div><div class="font-semibold text-slate-900">${escapeHtml(d.text)}</div>${d.confidence ? `<div class="mt-0.5 text-xs font-semibold uppercase tracking-wider text-slate-400">${escapeHtml(d.confidence)}${d.basis ? ` · ${escapeHtml(d.basis)}` : ''}</div>` : ''}</div>
    </li>`).join('');
    const s4 = reportSectionHtml(t, 4, 'results.report.sectionEvidence', 'results.report.sectionEvidenceSub', `${domainsBlock}${docsIntro}<ul class="space-y-2">${evidenceList || `<li class="text-sm text-slate-500">${t('common.none')}</li>`}</ul>`);

    const missingList = engine.missingDocuments.map((m) => `
    <li class="flex gap-3 rounded-xl border border-amber-100 bg-amber-50/40 px-4 py-3">
      <i class="fa-regular fa-square mt-0.5 shrink-0 text-amber-700"></i>
      <span class="text-sm font-medium text-slate-800">${escapeHtml(m.text)}</span>
    </li>`).join('') || `<p class="text-sm text-slate-500">${t('common.none')}</p>`;
    const s5 = reportSectionHtml(t, 5, 'results.report.sectionMissing', 'results.report.sectionMissingSub', `<ul class="space-y-2">${missingList}</ul>`);

    const splitHtml = engine.sellerSupplierSplit.length
      ? `<div class="grid gap-3 md:grid-cols-2">${engine.sellerSupplierSplit.map((item) => {
        const tone = item.side === 'supplier' ? 'border-sky-200 bg-sky-50/60' : item.side === 'seller' ? 'border-brand-200 bg-sky-50/40' : 'border-slate-200 bg-slate-50';
        const side = t(item.side === 'supplier' ? 'results.sideSupplier' : item.side === 'seller' ? 'results.sideSeller' : 'results.sideShared');
        return `<div class="rounded-xl border ${tone} p-4"><div class="text-xs font-black uppercase tracking-wider text-brand-800">${escapeHtml(side)}</div><p class="mt-2 text-sm text-slate-800">${escapeHtml(item.text)}</p></div>`;
      }).join('')}</div>`
      : `<p class="text-sm text-slate-500">${t('results.report.splitEmpty')}</p>`;
    const s6 = reportSectionHtml(t, 6, 'results.report.sectionSplit', 'results.report.sectionSplitSub', splitHtml);

    const risksHtml = engine.riskFlags.length
      ? engine.riskFlags.map((f) => {
        const sev = f.severity || 'info';
        const whyKey = ['info', 'warning', 'critical'].includes(sev) ? sev : 'info';
        const why = t(`results.riskWhy.${whyKey}`);
        return `<div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex flex-wrap items-center gap-2"><span class="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">${escapeHtml(sev)}</span></div>
        <p class="mt-2 text-sm font-semibold text-slate-900">${escapeHtml(f.text)}</p>
        <p class="mt-2 text-xs leading-5 text-slate-600">${escapeHtml(why)}</p>
      </div>`;
      }).join('')
      : `<p class="text-sm text-slate-500">${t('common.none')}</p>`;
    const s7 = reportSectionHtml(t, 7, 'results.report.sectionRisks', 'results.report.sectionRisksSub', `<div class="grid gap-3 md:grid-cols-2">${risksHtml}</div>`);

    const top3 = engine.nextSteps.slice(0, 3);
    const nextHtml = top3.length
      ? `<ol class="space-y-3">${top3.map((n, i) => `<li class="flex gap-3"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-black text-white">${i + 1}</span><span class="text-sm font-medium leading-6 text-slate-800">${escapeHtml(n.text)}</span></li>`).join('')}</ol>`
      : `<p class="text-sm text-slate-500">${t('common.none')}</p>`;
    const s8 = reportSectionHtml(t, 8, 'results.report.sectionNext3', 'results.report.sectionNext3Sub', nextHtml);

    const confList = engine.confidenceNotes.length
      ? engine.confidenceNotes.map((c) => `<li class="text-sm text-slate-700">${escapeHtml(c)}</li>`).join('')
      : `<li class="text-sm text-slate-500">${t('common.none')}</li>`;
    const s9 = reportSectionHtml(t, 9, 'results.report.sectionConfidence', 'results.report.sectionConfidenceSub', `<ul class="list-disc space-y-2 pl-5">${confList}</ul>`);

    const caveats = (aiAnalysis?.caveats || []).filter(Boolean);
    const uncertainty = (aiAnalysis?.uncertaintyNotes || []).filter(Boolean);

    let aiBlock = '';
    if (aiAnalysis?.explanation) {
      aiBlock = reportSectionHtml(t, 'A', 'results.report.sectionAiNarrative', 'results.report.sectionAiNarrativeSub', `
      <p class="whitespace-pre-line text-sm leading-7 text-slate-800">${escapeHtml(aiAnalysis.explanation)}</p>
      ${uncertainty.length ? `<div class="mt-4 text-xs font-bold uppercase text-violet-900">${t('results.uncertaintyHeading')}</div><ul class="mt-2 list-disc space-y-1 pl-5">${uncertainty.map((x) => `<li class="text-sm text-slate-800">${escapeHtml(x)}</li>`).join('')}</ul>` : ''}
      ${caveats.length ? `<div class="mt-4 text-xs font-bold uppercase text-violet-900">${t('results.caveatsHeading')}</div><ul class="mt-2 list-disc space-y-1 pl-5">${caveats.map((x) => `<li class="text-sm text-slate-800">${escapeHtml(x)}</li>`).join('')}</ul>` : ''}
    `, 'border-violet-200 bg-violet-50/30');
    }

    let sourcesBlock = '';
    if (aiAnalysis?.sourcesUsed?.length) {
      sourcesBlock = reportSectionHtml(t, 'B', 'results.sourcesTitle', 'results.report.sourcesSub', `<ul class="space-y-2">${aiAnalysis.sourcesUsed.map((source) => `<li class="text-sm">${source.url ? `<a class="font-semibold text-brand-700 underline" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.title)}</a>` : escapeHtml(source.title)}</li>`).join('')}</ul>`, 'border-sky-200 bg-sky-50/40');
    }

    const packageStrip = packages.map((item) => `${localize(item.name)} — ${item.price}`).join(' · ');
    const packagesBlock = packageStrip
      ? reportSectionHtml(t, 'C', 'results.packagesTitle', 'results.report.packagesSub', `<p class="text-sm leading-6 text-slate-700">${escapeHtml(packageStrip)}</p>`, 'border-slate-200 bg-slate-50/80')
      : '';

    const s10 = `
    <section class="rounded-[1.75rem] border border-brand-200 bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-panel print:break-inside-avoid">
      <div class="text-xs font-bold uppercase tracking-[0.2em] text-sky-200">${t('results.report.sectionCtaEyebrow')}</div>
      <h3 class="mt-2 text-xl font-black">${t('results.report.sectionCtaTitle')}</h3>
      <p class="mt-2 max-w-2xl text-sm leading-6 text-sky-100/95">${t('results.report.sectionCtaBody')}</p>
      <p class="mt-4 text-xs leading-5 text-sky-200/90">${escapeHtml(t('results.report.inlineDisclaimer'))}</p>
    </section>`;

    const disclaimer = `<p class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-xs leading-5 text-slate-600">${escapeHtml(t('results.report.prominentDisclaimer'))}</p>`;

    return trustStrip + s1 + s2 + s3 + s4 + s5 + s6 + s7 + s8 + s9 + aiBlock + sourcesBlock + packagesBlock + s10 + disclaimer;
  }

  function buildPlainReportLines(ctx, deps) {
    const { t, localize } = deps;
    const { profile, engine, aiAnalysis, channelLabel, marketLabel, roleLabel, ceLabel, categoryLabel, packages = [] } = ctx;
    const lines = [
      `CertPath — ${t('results.reportTitle')}`,
      `${t('assessment.fields.productName')}: ${profile.productName}`,
      `${t('assessment.fields.markets')}: ${marketLabel}`,
      `${t('assessment.fields.channel')}: ${channelLabel}`,
      `${t('assessment.fields.category')}: ${categoryLabel}`,
      `${t('assessment.fields.role')}: ${roleLabel}`,
      `${t('assessment.fields.ceStatus')}: ${ceLabel}`,
      '',
      `${t('results.report.sectionReadiness')}: ${t(`results.readinessStates.${computeReadinessState(profile, engine).key}Title`)}`,
      `${t('results.riskLevelCard')}: ${t(`results.riskLevelLabel.${engine.riskLevel}`)}`,
      ''
    ];
    if (engine.likelyComplianceAreas.length) {
      lines.push(`${t('results.areasTitle')}:`, ...engine.likelyComplianceAreas.map((a) => `- ${formatEngineAreaLine(a)}`), '');
    }
    lines.push(
      `${t('results.report.sectionEvidence')}:`,
      ...engine.likelyDocumentsNeeded.map((d) => `- ${d.text}`),
      '',
      `${t('results.report.sectionMissing')}:`,
      ...engine.missingDocuments.map((m) => `- ${m.text}`),
      '',
      `${t('results.report.sectionNext3')}:`,
      ...engine.nextSteps.slice(0, 3).map((n, i) => `${i + 1}. ${n.text}`),
      '',
      t('results.report.emailDisclaimer')
    );
    if (aiAnalysis?.sourcesUsed?.length) {
      lines.push('', `${t('results.sourcesTitle')}:`);
      aiAnalysis.sourcesUsed.forEach((s) => lines.push(s.url ? `- ${s.title} (${s.url})` : `- ${s.title}`));
    }
    if (packages.length) {
      lines.push('', `${t('results.packagesTitle')}:`, packages.map((item) => `${localize(item.name)} — ${item.price}`).join(' | '));
    }
    if (aiAnalysis?.explanation) {
      lines.push('', `${t('results.aiExplanationTitle')}:`, aiAnalysis.explanation);
    }
    return lines.join('\n');
  }

  /** Full-page print (legacy / optional) */
  function buildPrintableDocument(ctx, deps) {
    const { t, locale } = deps;
    const inner = buildComplianceReportInnerHtml(ctx, deps);
    return `<!DOCTYPE html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>CertPath — ${escapeHtml(ctx.profile.productName)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer">
  <script>tailwind.config = { theme: { extend: { colors: { brand: { 700: '#0f4c81', 900: '#0c2744' } } } } };</script>
  <style>
    body{font-family:Segoe UI,Tahoma,sans-serif;color:#0f172a;padding:24px;max-width:800px;margin:0 auto;font-size:14px;line-height:1.5}
    h1{font-size:22px;margin:0 0 8px}
    .muted{color:#64748b;font-size:12px}
    section{border:1px solid #e2e8f0;border-radius:16px;padding:16px;margin-bottom:16px;page-break-inside:avoid}
    h2{font-size:15px;margin:0 0 8px;color:#0f4c81}
    ul.tight, ol.tight { margin: 6px 0 0; padding-left: 20px; }
  ul.tight li, ol.tight li { margin-bottom: 5px; }
  </style></head><body>
  <h1>CertPath</h1>
  <p class="muted">${escapeHtml(t('results.reportTitle'))} · ${escapeHtml(t('results.engineVersionNote', { version: ctx.engine.engineVersion }))}</p>
  ${inner}
  <p class="muted" style="margin-top:24px">${escapeHtml(t('results.report.printDisclaimer'))}</p>
  </body></html>`;
  }

  /**
   * Branded PDF-oriented layout (Save as PDF from print dialog).
   * Sections: product summary, market, evidence, missing, risks, next steps, disclaimer.
   */
  function buildPdfExportDocumentHtml(ctx, deps) {
    const { t, locale } = deps;
    const { profile, engine, channelLabel, marketLabel, roleLabel, ceLabel, categoryLabel } = ctx;
    const gen = ctx.generatedAt ? new Date(ctx.generatedAt) : new Date();
    const dateStr = gen.toLocaleString(locale || 'en', { dateStyle: 'medium', timeStyle: 'short' });

    const evidenceList = engine.likelyDocumentsNeeded.length
      ? `<ul class="tight">${engine.likelyDocumentsNeeded.map((d) => `<li>${escapeHtml(d.text)}</li>`).join('')}</ul>`
      : `<p class="muted">${escapeHtml(t('common.none'))}</p>`;
    const missingList = engine.missingDocuments.length
      ? `<ul class="tight">${engine.missingDocuments.map((m) => `<li>${escapeHtml(m.text)}</li>`).join('')}</ul>`
      : `<p class="muted">${escapeHtml(t('common.none'))}</p>`;
    const riskList = engine.riskFlags.length
      ? `<ul class="tight">${engine.riskFlags.map((f) => `<li><strong>${escapeHtml(f.severity || 'info')}:</strong> ${escapeHtml(f.text)}</li>`).join('')}</ul>`
      : `<p class="muted">${escapeHtml(t('common.none'))}</p>`;
    const nextList = engine.nextSteps.length
      ? `<ol class="tight">${engine.nextSteps.slice(0, 8).map((n) => `<li>${escapeHtml(n.text)}</li>`).join('')}</ol>`
      : `<p class="muted">${escapeHtml(t('common.none'))}</p>`;

    return `<!DOCTYPE html><html lang="${escapeHtml(locale || 'en')}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>CertPath — ${escapeHtml(profile.productName || 'Report')}</title>
<style>
  @page { margin: 16mm; }
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #0f172a; font-size: 10.5pt; line-height: 1.45; max-width: 720px; margin: 0 auto; padding: 12px; }
  .brand { background: linear-gradient(135deg, #0f4c81 0%, #0c2744 100%); color: #fff; border-radius: 12px; padding: 20px 22px; margin-bottom: 22px; }
  .brand h1 { margin: 0; font-size: 20pt; font-weight: 800; letter-spacing: -0.02em; }
  .brand .sub { margin: 8px 0 0; font-size: 9.5pt; opacity: 0.92; }
  .brand .meta { margin-top: 12px; font-size: 8.5pt; opacity: 0.85; }
  h2 { font-size: 10pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: #0f4c81; border-bottom: 2px solid #dbeafe; padding-bottom: 6px; margin: 22px 0 10px; page-break-after: avoid; }
  table.grid { width: 100%; border-collapse: collapse; margin-bottom: 6px; page-break-inside: avoid; }
  table.grid td { border: 1px solid #e2e8f0; padding: 8px 10px; vertical-align: top; }
  table.grid td.label { width: 32%; background: #f8fafc; font-weight: 600; font-size: 9pt; color: #475569; }
  .block { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; background: #fff; page-break-inside: avoid; }
  .muted { color: #64748b; font-size: 9pt; }
  .disclaimer { font-size: 8.5pt; color: #475569; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; background: #f8fafc; margin-top: 28px; line-height: 1.5; }
  ul.tight, ol.tight { margin: 0; padding-left: 20px; }
  ul.tight li, ol.tight li { margin-bottom: 5px; }
</style></head><body>
  <div class="brand">
    <h1>CertPath</h1>
    <p class="sub">${escapeHtml(t('results.reportTitle'))}</p>
    <p class="meta">${escapeHtml(t('results.report.pdfGenerated', { date: dateStr }))} · ${escapeHtml(t('results.engineVersionNote', { version: engine.engineVersion }))}</p>
  </div>
  <h2>${escapeHtml(t('results.report.pdfSectionProduct'))}</h2>
  <table class="grid">
    <tr><td class="label">${escapeHtml(t('assessment.fields.productName'))}</td><td>${escapeHtml(profile.productName)}</td></tr>
    <tr><td class="label">${escapeHtml(t('assessment.fields.markets'))}</td><td>${escapeHtml(marketLabel)}</td></tr>
    <tr><td class="label">${escapeHtml(t('assessment.fields.channel'))}</td><td>${escapeHtml(channelLabel)}</td></tr>
    <tr><td class="label">${escapeHtml(t('assessment.fields.category'))}</td><td>${escapeHtml(categoryLabel)}</td></tr>
    <tr><td class="label">${escapeHtml(t('assessment.fields.role'))}</td><td>${escapeHtml(roleLabel)}</td></tr>
    <tr><td class="label">${escapeHtml(t('assessment.fields.ceStatus'))}</td><td>${escapeHtml(ceLabel)}</td></tr>
  </table>
  <h2>${escapeHtml(t('results.report.pdfSectionEvidence'))}</h2>
  <div class="block">${evidenceList}</div>
  <h2>${escapeHtml(t('results.report.pdfSectionMissing'))}</h2>
  <div class="block">${missingList}</div>
  <h2>${escapeHtml(t('results.report.pdfSectionRisks'))}</h2>
  <div class="block">${riskList}</div>
  <h2>${escapeHtml(t('results.report.pdfSectionNext'))}</h2>
  <div class="block">${nextList}</div>
  <div class="disclaimer">${escapeHtml(t('results.report.prominentDisclaimer'))}</div>
  <p class="muted" style="margin-top:12px">${escapeHtml(t('results.report.printDisclaimer'))}</p>
</body></html>`;
  }

  global.CertPathReport = {
    escapeHtml,
    computeReadinessState,
    formatEngineAreaLine,
    buildComplianceReportInnerHtml,
    buildPlainReportLines,
    buildPrintableDocument,
    buildPdfExportDocumentHtml
  };
}(typeof window !== 'undefined' ? window : globalThis));
