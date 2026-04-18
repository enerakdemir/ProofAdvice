/**
 * CertPath deterministic rule engine (Layer 1).
 * Depends: CertPathAssessmentSchema, CERTPATH_COMPLIANCE_RULES
 */
(function initCertPathRuleEngine() {
  const Schema = globalThis.CertPathAssessmentSchema;
  if (!Schema) {
    throw new Error('CertPathAssessmentSchema must load before rule-engine.js');
  }

  function uniqByCode(list) {
    const seen = new Set();
    return list.filter((item) => {
      if (!item || seen.has(item.code)) {
        return false;
      }
      seen.add(item.code);
      return true;
    });
  }

  function uniqById(list) {
    const seen = new Set();
    return list.filter((item) => {
      if (!item || seen.has(item.id)) {
        return false;
      }
      seen.add(item.id);
      return true;
    });
  }

  function uniqByText(list, key = 'text') {
    const seen = new Set();
    return list.filter((item) => {
      const t = item && item[key];
      if (!t || seen.has(t)) {
        return false;
      }
      seen.add(t);
      return true;
    });
  }

  function computeRiskLevel(result) {
    let score = 0;
    result.riskFlags.forEach((f) => {
      if (f.severity === 'critical') {
        score += 3;
      } else if (f.severity === 'warning') {
        score += 1;
      }
    });
    result.likelyComplianceAreas.forEach((a) => {
      if (a.confidence === 'high') {
        score += 1;
      }
    });
    if (result.assumptions.length > 2) {
      score += 1;
    }
    if (score >= 6) {
      return 'high';
    }
    if (score >= 2) {
      return 'medium';
    }
    return 'low';
  }

  function buildProductSummary(input) {
    const parts = [input.productName || 'Product'];
    if (input.productCategory) {
      parts.push(`category:${input.productCategory}`);
    }
    if (input.markets.length) {
      parts.push(`markets:${input.markets.join('+')}`);
    }
    return parts.join(' · ');
  }

  function runRuleEngine(rawProfile) {
    const input = Schema.normalizeEngineInput(rawProfile);
    const result = Schema.createEmptyEngineResult();

    function pushArea(code, label, rationale, confidence) {
      result.likelyComplianceAreas.push({ code, label, rationale, confidence });
    }
    function pushDoc(id, text, confidence, basis) {
      result.likelyDocumentsNeeded.push({ id, text, confidence, basis });
    }
    function pushMissing(id, text) {
      result.missingDocuments.push({ id, text });
    }
    function pushRisk(id, text, severity) {
      result.riskFlags.push({ id, text, severity });
    }
    function pushNext(id, text) {
      result.nextSteps.push({ id, text });
    }
    function pushSplit(id, side, text) {
      result.sellerSupplierSplit.push({ id, side, text });
    }
    function pushAssumption(field, text) {
      result.assumptions.push({ field, text });
    }
    function pushConfidence(text) {
      result.confidenceNotes.push(text);
    }
    function pushSupport(text) {
      result.suggestedSupportPath.push(text);
    }

    const ctx = {
      input,
      result,
      pushArea,
      pushDoc,
      pushMissing,
      pushRisk,
      pushNext,
      pushSplit,
      pushAssumption,
      pushConfidence,
      pushSupport
    };

    const rules = globalThis.CERTPATH_COMPLIANCE_RULES || [];
    rules.forEach((rule) => {
      try {
        rule.apply(ctx);
      } catch (e) {
        pushRisk(`rule-error-${rule.id}`, `Internal rule error (${rule.id}).`, 'warning');
      }
    });

    result.likelyComplianceAreas = uniqByCode(result.likelyComplianceAreas);
    result.likelyDocumentsNeeded = uniqById(result.likelyDocumentsNeeded);
    result.missingDocuments = uniqById(result.missingDocuments);
    result.riskFlags = uniqById(result.riskFlags);
    result.nextSteps = uniqById(result.nextSteps);
    result.sellerSupplierSplit = uniqById(result.sellerSupplierSplit);
    result.assumptions = uniqById(result.assumptions.map((a) => ({ id: `asm-${a.field}`, field: a.field, text: a.text })));
    result.confidenceNotes = [...new Set(result.confidenceNotes)];
    result.suggestedSupportPath = [...new Set(result.suggestedSupportPath)];

    result.markets = [...input.markets];
    result.productSummary = buildProductSummary(input);
    result.riskLevel = computeRiskLevel(result);

    if (!result.confidenceNotes.length) {
      result.confidenceNotes.push('Assessment is triage-only; expert review may materially change scope.');
    }

    return result;
  }

  /** Flatten engine result for legacy consumers / AI prompts */
  function flattenEngineResult(engineResult) {
    return {
      requiredDocuments: engineResult.likelyDocumentsNeeded.map((d) => d.text),
      regulations: engineResult.likelyComplianceAreas.map((a) => `${a.label}: ${a.rationale}`),
      missing: engineResult.missingDocuments.map((m) => m.text),
      risks: engineResult.riskFlags.map((r) => r.text),
      nextSteps: engineResult.nextSteps.map((n) => n.text),
      supportPath: engineResult.suggestedSupportPath.slice()
    };
  }

  globalThis.CertPathRuleEngine = {
    run: runRuleEngine,
    flatten: flattenEngineResult
  };
}());
