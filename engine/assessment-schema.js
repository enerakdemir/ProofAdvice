/**
 * CertPath deterministic assessment — schema and version.
 * Output is consumed by the UI and by the AI explanation layer (must not be contradicted).
 */
(function initCertPathAssessmentSchema() {
  const ENGINE_VERSION = '1.0.0';

  /**
   * @typedef {'low'|'medium'|'high'} RiskLevel
   * @typedef {'low'|'medium'|'high'} Confidence
   */

  function createEmptyEngineResult() {
    return {
      engineVersion: ENGINE_VERSION,
      productSummary: '',
      markets: [],
      riskLevel: 'low',
      likelyComplianceAreas: [],
      likelyDocumentsNeeded: [],
      missingDocuments: [],
      sellerSupplierSplit: [],
      riskFlags: [],
      nextSteps: [],
      assumptions: [],
      confidenceNotes: [],
      suggestedSupportPath: []
    };
  }

  /**
   * Normalise raw form profile into a stable input object for rules.
   * @param {Record<string, unknown>} profile
   */
  function normalizeEngineInput(profile) {
    const p = profile && typeof profile === 'object' ? profile : {};
    return {
      productName: String(p.productName || '').trim(),
      productUrl: String(p.productUrl || '').trim(),
      salesChannel: String(p.salesChannel || ''),
      productCategory: String(p.productCategory || ''),
      sellerRole: String(p.sellerRole || ''),
      ceStatus: String(p.ceStatus || ''),
      electrical: String(p.electrical || ''),
      battery: String(p.battery || ''),
      wireless: String(p.wireless || ''),
      skinContact: String(p.skinContact || ''),
      children: String(p.children || ''),
      markets: Array.isArray(p.markets) ? p.markets.map(String) : [],
      documents: Array.isArray(p.documents) ? p.documents.map(String) : [],
      electricalPowerSource: String(p.electricalPowerSource || ''),
      batteryRemovable: String(p.batteryRemovable || ''),
      batteryChemistry: String(p.batteryChemistry || ''),
      wirelessTech: String(p.wirelessTech || ''),
      childAgeFocus: String(p.childAgeFocus || '')
    };
  }

  globalThis.CertPathAssessmentSchema = {
    ENGINE_VERSION,
    createEmptyEngineResult,
    normalizeEngineInput
  };
}());
