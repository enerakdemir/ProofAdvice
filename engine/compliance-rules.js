/**
 * Declarative compliance rules (Layer 1).
 * Each rule: { id, apply(ctx) } — keep predicates small and composable.
 * ctx: { input, result, pushArea, pushDoc, pushMissing, pushRisk, pushNext, pushSplit, pushAssumption, pushConfidence, pushSupport }
 */
(function initCertPathComplianceRules() {
  function hasMarket(input, code) {
    return input.markets.includes(code);
  }

  function isNotSure(value) {
    return value === 'not-sure';
  }

  const rules = [
    {
      id: 'assumption-not-sure-fields',
      apply(ctx) {
        const { input, pushAssumption } = ctx;
        const pairs = [
          ['electrical', input.electrical],
          ['battery', input.battery],
          ['wireless', input.wireless],
          ['skinContact', input.skinContact],
          ['children', input.children],
          ['sellerRole', input.sellerRole],
          ['ceStatus', input.ceStatus]
        ];
        pairs.forEach(([field, val]) => {
          if (isNotSure(val)) {
            pushAssumption(field, 'User selected “not sure” for this field; findings use conservative defaults until clarified.');
          }
        });
        ctx.pushConfidence('Some answers were “not sure”; triage confidence is reduced until details are confirmed.');
      }
    },
    {
      id: 'base-technical-filepack',
      apply(ctx) {
        const { pushDoc, pushArea, pushNext } = ctx;
        pushDoc('doc-technical-file', 'Technical file structure (product-specific)', 'high', 'base');
        pushDoc('doc-doc', 'Declaration of Conformity (where applicable)', 'high', 'base');
        pushDoc('doc-labels', 'Label and marking review pack', 'high', 'base');
        pushDoc('doc-manual', 'User manual / instructions', 'high', 'base');
        pushArea('GENERAL_PRODUCT_SAFETY', 'General product safety & conformity evidence', 'Baseline for placing goods on UK/EU markets.', 'medium');
        pushNext('next-checklist', 'Turn the document list into a supplier follow-up checklist and close gaps one by one.');
      }
    },
    {
      id: 'market-eu',
      apply(ctx) {
        if (!hasMarket(ctx.input, 'eu')) {
          return;
        }
        ctx.pushArea('EU_GPSR', 'EU market readiness (incl. GPSR-style obligations)', 'EU listing and surveillance expectations often require a coherent product file.', 'medium');
        ctx.pushNext('next-eu-file', 'Confirm the EU listing path and ensure the product file can answer market surveillance requests.');
      }
    },
    {
      id: 'market-uk',
      apply(ctx) {
        if (!hasMarket(ctx.input, 'uk')) {
          return;
        }
        ctx.pushArea('UK_PLACEMENT', 'UK placement & economic operator context', 'GB market entry may require clarity on importer / responsible party expectations.', 'medium');
        ctx.pushNext('next-uk-operator', 'Review UK-side importer or responsible operator expectations before launch.');
      }
    },
    {
      id: 'electrical-yes',
      apply(ctx) {
        if (ctx.input.electrical !== 'yes') {
          return;
        }
        ctx.pushArea('ELECTRICAL_SAFETY', 'Electrical safety & related conformity', 'Powered products typically need aligned safety evidence in the technical file.', 'high');
        ctx.pushArea('EMC', 'EMC / immunity (where applicable)', 'Many electrical listings are challenged on EMC-related evidence.', 'medium');
        ctx.pushDoc('doc-electrical-test', 'Electrical safety test evidence', 'high', 'electrical-yes');
        ctx.pushNext('next-electrical-variant', 'Check electrical safety evidence matches the exact product variant you list.');
      }
    },
    {
      id: 'electrical-not-sure',
      apply(ctx) {
        if (ctx.input.electrical !== 'not-sure') {
          return;
        }
        ctx.pushMissing('missing-electrical-class', 'Clarify whether the product is classified as electrical.');
        ctx.pushAssumption('electrical', 'Electrical classification unknown; EMC/safety scope may be understated or overstated.');
      }
    },
    {
      id: 'electrical-mains',
      apply(ctx) {
        if (ctx.input.electrical !== 'yes' || ctx.input.electricalPowerSource !== 'mains') {
          return;
        }
        ctx.pushArea('MAINS_APPLIANCE', 'Mains / plug-related safety expectations', 'Mains-fed products often face plug, voltage, and appliance-labelling scrutiny.', 'medium');
        ctx.pushNext('next-mains-plug', 'Confirm plug type, voltage rating, and any appliance labelling that applies to your listings.');
      }
    },
    {
      id: 'battery-yes',
      apply(ctx) {
        if (ctx.input.battery !== 'yes') {
          return;
        }
        ctx.pushArea('BATTERY_TRANSPORT', 'Battery regulation, transport & labelling', 'Batteries add safety, labelling, and sometimes transport documentation complexity.', 'high');
        ctx.pushDoc('doc-battery-info', 'Battery safety information', 'high', 'battery-yes');
        ctx.pushDoc('doc-battery-transport', 'Transport and battery labelling details', 'medium', 'battery-yes');
        ctx.pushRisk('risk-battery-general', 'Battery-powered products often carry extra transport, safety, and labelling risk.', 'warning');
      }
    },
    {
      id: 'battery-not-sure',
      apply(ctx) {
        if (ctx.input.battery !== 'not-sure') {
          return;
        }
        ctx.pushMissing('missing-battery', 'Clarify whether an internal or removable battery is present.');
      }
    },
    {
      id: 'battery-li-ion',
      apply(ctx) {
        if (ctx.input.battery !== 'yes' || ctx.input.batteryChemistry !== 'li-ion') {
          return;
        }
        ctx.pushRisk('risk-li-ion', 'Rechargeable lithium-based cells are often scrutinised for transport, handling, and documentation.', 'warning');
        ctx.pushNext('next-un-transport', 'If you ship batteries internationally, check carrier rules and UN transport documentation expectations.');
      }
    },
    {
      id: 'wireless-yes',
      apply(ctx) {
        if (ctx.input.wireless !== 'yes') {
          return;
        }
        ctx.pushArea('RADIO_EQUIPMENT', 'Radio / wireless equipment conformity', 'Wireless functions often need aligned radio test evidence and declarations.', 'high');
        ctx.pushDoc('doc-wireless-test', 'Wireless / radio test evidence', 'high', 'wireless-yes');
        ctx.pushRisk('risk-wireless', 'Wireless features may trigger additional testing or supplier evidence needs.', 'warning');
      }
    },
    {
      id: 'wireless-not-sure',
      apply(ctx) {
        if (ctx.input.wireless !== 'not-sure') {
          return;
        }
        ctx.pushMissing('missing-wireless', 'Confirm whether the product uses Bluetooth, Wi-Fi, RF, or similar wireless features.');
      }
    },
    {
      id: 'wireless-cellular',
      apply(ctx) {
        if (ctx.input.wireless !== 'yes' || ctx.input.wirelessTech !== 'cellular') {
          return;
        }
        ctx.pushRisk('risk-cellular', 'Cellular radio modules can add operator and additional radio-framework scrutiny beyond short-range Bluetooth or Wi-Fi.', 'warning');
      }
    },
    {
      id: 'skin-yes',
      apply(ctx) {
        if (ctx.input.skinContact !== 'yes') {
          return;
        }
        ctx.pushArea('SKIN_CONTACT', 'Material safety & prolonged contact', 'Skin or body contact raises material and use-pattern evidence expectations.', 'high');
        ctx.pushDoc('doc-material-contact', 'Material and contact-safety information', 'high', 'skin-yes');
        ctx.pushNext('next-materials', 'Check which materials contact the body and whether supplier evidence covers those materials.');
      }
    },
    {
      id: 'skin-not-sure',
      apply(ctx) {
        if (ctx.input.skinContact !== 'not-sure') {
          return;
        }
        ctx.pushMissing('missing-skin', 'Clarify whether the product is worn, attached to skin, or used directly on the body.');
      }
    },
    {
      id: 'children-yes',
      apply(ctx) {
        if (ctx.input.children !== 'yes') {
          return;
        }
        ctx.pushArea('CHILDREN_PRODUCT', 'Children’s product safety & warnings', 'Child-focused goods usually need tighter warning, age, and evidence alignment.', 'high');
        ctx.pushDoc('doc-child-warnings', 'Child-safety warnings and age guidance', 'high', 'children-yes');
        ctx.pushRisk('risk-children-general', 'Products intended for children usually require a tighter safety and warning review.', 'warning');
      }
    },
    {
      id: 'children-under-3',
      apply(ctx) {
        if (ctx.input.children !== 'yes' || ctx.input.childAgeFocus !== 'under-3') {
          return;
        }
        ctx.pushRisk('risk-under-3', 'Products aimed at the youngest children typically face the strictest toy and small-parts scrutiny—marketplace asks are often a minimum bar.', 'critical');
        ctx.pushNext('next-under-3', 'Prioritise age-grading evidence, warnings, and intended-use clarity before scaling inventory.');
      }
    },
    {
      id: 'children-3-12',
      apply(ctx) {
        if (ctx.input.children !== 'yes' || ctx.input.childAgeFocus !== 'age-3-12') {
          return;
        }
        ctx.pushNext('next-child-312', 'Align warnings, test references, and packaging claims with the stated child age range.');
      }
    },
    {
      id: 'children-not-sure',
      apply(ctx) {
        if (ctx.input.children !== 'not-sure') {
          return;
        }
        ctx.pushMissing('missing-children', 'Clarify whether children are a target user group or likely user group.');
      }
    },
    {
      id: 'category-specific',
      apply(ctx) {
        const cat = ctx.input.productCategory;
        const map = {
          'consumer-electronics': ['CONSUMER_ELECTRONICS', 'General consumer electronics conformity review', 'Category-level review scope.', 'medium'],
          lighting: ['LIGHTING', 'Lighting product conformity review', 'Lighting SKUs often have dedicated safety and marking expectations.', 'medium'],
          'chargers-batteries': ['CHARGERS_BATTERIES', 'Charger and battery accessory review', 'Chargers and power accessories are frequently challenged for extra proof.', 'high'],
          'home-kitchen-electrical': ['HOME_KITCHEN_ELEC', 'Home & kitchen electrical review', 'Use-case and instruction clarity matter for household electrical goods.', 'medium'],
          'fitness-gadgets': ['FITNESS_WEARABLE', 'Wearable / fitness-device review', 'Body-worn electronics combine electrical and contact considerations.', 'medium'],
          'beauty-devices': ['BEAUTY_DEVICE', 'Beauty / personal-care device review', 'Contact and material evidence is often central.', 'high'],
          'children-tech': ['CHILD_TECH', 'Child-oriented technical product review', 'Combines child-product sensitivity with electronics evidence.', 'high'],
          'general-non-electrical': ['GENERAL_NON_ELEC', 'General (non-electrical) product safety review', 'Baseline safety and documentation still apply.', 'low']
        };
        const row = map[cat];
        if (!row) {
          return;
        }
        ctx.pushArea(row[0], row[1], row[2], row[3]);
        if (cat === 'chargers-batteries') {
          ctx.pushRisk('risk-chargers', 'Chargers and battery accessories are often requested by marketplaces for extra proof.', 'warning');
        }
        if (cat === 'children-tech') {
          ctx.pushRisk('risk-child-tech', 'Child-focused positioning increases sensitivity around warnings, intended use, and supporting evidence.', 'warning');
        }
      }
    },
    {
      id: 'channel-amazon',
      apply(ctx) {
        if (ctx.input.salesChannel !== 'amazon') {
          return;
        }
        ctx.pushArea('MARKETPLACE_LISTING', 'Marketplace listing compliance requests', 'Amazon and similar channels may request document packs at short notice.', 'medium');
        ctx.pushNext('next-amazon-pack', 'Prepare the file pack in a format that can answer Amazon compliance document requests quickly.');
      }
    },
    {
      id: 'channel-multi',
      apply(ctx) {
        if (ctx.input.salesChannel !== 'multi') {
          return;
        }
        ctx.pushRisk('risk-multi-channel', 'Multiple channels usually mean multiple listing standards and stricter document consistency needs.', 'warning');
      }
    },
    {
      id: 'role-manufacturer',
      apply(ctx) {
        if (ctx.input.sellerRole !== 'manufacturer') {
          return;
        }
        ctx.pushSplit('split-mfr-docs', 'seller', 'As manufacturer or brand owner you typically compile and maintain the technical file and conformity documentation for the product identity you place on the market.');
      }
    },
    {
      id: 'role-reseller-importer',
      apply(ctx) {
        const r = ctx.input.sellerRole;
        if (r !== 'reseller' && r !== 'importer') {
          return;
        }
        ctx.pushDoc('doc-supplier-pack', 'Supplier compliance pack (product-specific)', 'high', 'role-reseller-importer');
        ctx.pushMissing('missing-role-split', 'Confirm which core documents must come from the supplier and which must be prepared on your side.');
        ctx.pushRisk('risk-reseller-evidence', 'Reseller and importer models often fail because supplier evidence is incomplete or product-specific proof is weak.', 'warning');
        ctx.pushSplit('split-supplier-docs', 'supplier', 'Supplier should provide type-test reports, declarations, and traceability for the exact SKU where possible.');
        ctx.pushSplit('split-seller-rp', 'seller', 'You typically coordinate the listing file, translations, warnings, and economic-operator / importer communications for your market.');
      }
    },
    {
      id: 'role-not-sure',
      apply(ctx) {
        if (ctx.input.sellerRole !== 'not-sure') {
          return;
        }
        ctx.pushMissing('missing-role', 'Clarify whether you act as manufacturer, importer, or reseller in the target market.');
        ctx.pushAssumption('sellerRole', 'Seller role unknown; responsibility split is provisional.');
      }
    },
    {
      id: 'ce-no',
      apply(ctx) {
        if (ctx.input.ceStatus !== 'no') {
          return;
        }
        ctx.pushRisk('risk-no-ce', 'No CE or supplier pack is currently visible—a strong signal for listing and market-entry risk.', 'critical');
        ctx.pushNext('next-request-pack', 'Request the supplier evidence pack before spending time on final listing preparation.');
      }
    },
    {
      id: 'ce-not-sure',
      apply(ctx) {
        if (ctx.input.ceStatus !== 'not-sure') {
          return;
        }
        ctx.pushMissing('missing-ce', 'Clarify whether any CE, DoC, or supplier evidence already exists.');
      }
    },
    {
      id: 'document-gaps',
      apply(ctx) {
        const d = ctx.input.documents;
        if (!d.includes('test-report')) {
          ctx.pushMissing('missing-test-report', 'Test reports are not marked as available.');
        }
        if (!d.includes('doc')) {
          ctx.pushMissing('missing-doc', 'Declaration of Conformity is not marked as available.');
        }
        if (!d.includes('manual')) {
          ctx.pushMissing('missing-manual', 'User manual or instruction set is not marked as available.');
        }
        if (!d.includes('label-pack')) {
          ctx.pushMissing('missing-label', 'Label or marking pack is not marked as available.');
        }
        if ((ctx.input.sellerRole === 'reseller' || ctx.input.sellerRole === 'importer') && !d.includes('supplier-pack')) {
          ctx.pushMissing('missing-supplier-pack', 'Supplier compliance pack is not marked as available.');
        }
      }
    },
    {
      id: 'markets-empty',
      apply(ctx) {
        if (ctx.input.markets.length) {
          return;
        }
        ctx.pushMissing('missing-markets', 'Choose at least one target market.');
      }
    },
    {
      id: 'closing-next-steps',
      apply(ctx) {
        ctx.pushNext('next-starter-pack', 'If the product is strategically important, move from triage into a starter evidence pack before launch.');
      }
    }
  ];

  globalThis.CERTPATH_COMPLIANCE_RULES = rules;
}());
