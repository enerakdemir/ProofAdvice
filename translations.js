window.APP_I18N = {
  locales: [
    { code: 'en', label: 'EN', nativeName: 'English' },
    { code: 'tr', label: 'TR', nativeName: 'Türkçe' },
    { code: 'de', label: 'DE', nativeName: 'Deutsch' }
  ],
  ui: {
    tr: {
      meta: {
        title: 'CertiRehber | UK/EU Ürün Compliance Asistanı',
        description: 'UK ve AB pazarına teknik ürün satan e-ticaret markaları için hangi compliance dokümanlarının gerektiğini hızla öğrenin.'
      },
      language: { label: 'Dil seçin' },
      header: { tagline: 'UK/EU Ürün Compliance Asistanı', cta: 'Ürün Kontrolü Başlat' },
      nav: { assessment: 'Assessment', playbooks: 'Playbooklar', packages: 'Paketler', resources: 'Kaynaklar', faq: 'SSS', contact: 'İletişim' },
      hero: {
        badge: 'UK/EU pazarına açılan Amazon, Shopify ve e-ticaret satıcıları için',
        title: 'Teknik ürününüz satışa çıkmadan önce hangi compliance dokümanlarına ihtiyaç duyduğunu öğrenin.',
        description: 'CertiRehber; küçük online satıcıların ürün bazında olası doküman ihtiyaçlarını, eksik supplier dosyalarını, temel risk bayraklarını ve sonraki adımlarını sade bir intake ile çıkarır.',
        primaryCta: 'Ürün Kontrolünü Çalıştır',
        secondaryCta: 'Servis Paketlerini Gör',
        sampleEyebrow: 'Örnek çıktı',
        sampleTitle: 'Amazon Ürün Compliance Snapshot',
        sampleLive: 'SME-friendly',
        sampleDescription: 'Sonuç ekranı; muhtemel gereklilikleri, eksikleri ve listeleme öncesi kontrol edilmesi gereken riskleri birlikte gösterir.',
        sampleCardOne: 'Gerekli dokümanlar',
        sampleCardTwo: 'Riskler ve next steps',
        metricOne: 'İlk intake süresi',
        metricTwo: 'Ana sonuç bloğu',
        metricThree: 'Pazar odağı'
      },
      assessment: {
        eyebrow: 'Compliance intake',
        title: 'Birkaç ürün sorusu yanıtlayın, karar odaklı bir compliance overview alın.',
        description: 'Bu akış; Amazon, Shopify, Etsy ve benzeri kanallardan UK/EU pazarına teknik ürün satan satıcılar için tasarlandı.',
        noteEyebrow: 'Bu araç ne yapar?',
        noteBody: 'Bu araç hukuki incelemenin yerini almaz. İlk yön bulma katmanını sağlar: muhtemel dokümanlar, supplier boşlukları, listing riskleri ve sonraki adımlar.',
        fields: {
          productName: '1. Product name',
          productUrl: '2. Product link',
          channel: '3. Sales channel',
          category: '4. Product category',
          role: '5. Seller role',
          ceStatus: '6. CE / supplier compliance status',
          electrical: '7. Ürün elektrikli mi?',
          battery: '8. Batarya içeriyor mu?',
          wireless: '9. Kablosuz bağlantı kullanıyor mu?',
          skinContact: '10. Cilt veya beden ile temas ediyor mu?',
          children: '11. Çocuklar için mi tasarlandı?',
          markets: '12. Hangi pazarlarda satmak istiyorsunuz?',
          documents: '13. Şu anda hangi dokümanlara sahipsiniz?'
        },
        placeholders: {
          productName: 'Ürün adını girin',
          productUrl: 'Amazon, Shopify veya tedarikçi linki'
        },
        findButton: 'Compliance Overview Oluştur',
        resetButton: 'Temizle'
      },
      results: {
        reportTitle: 'Compliance rapor alanı',
        reportDescription: 'Olası dokümanlarınız, düzenleme başlıkları, eksik kalemleriniz, riskleriniz ve next steps burada görünür.',
        emptyTitle: 'Ön değerlendirme için temel alanları doldurun',
        emptyDescription: 'En az ürün adı, kanal, kategori, pazar ve binary ürün sorularını seçtiğinizde karar motoru sonuç üretir.',
        summaryOne: 'Ürün ve kanal',
        summaryTwo: 'Satıcı pozisyonu',
        summaryThree: 'Mevcut dosya durumu',
        documentsTitle: 'Likely required documents',
        regulationsTitle: 'Possible regulations / frameworks',
        missingTitle: 'Missing information or files',
        risksTitle: 'Risk flags',
        nextTitle: 'Recommended next steps',
        packagesTitle: 'Suggested support path'
      },
      playbooks: {
        eyebrow: 'Go-to-market playbooklar',
        title: 'Teknik e-ticaret satıcıları için odaklı giriş senaryoları',
        description: 'Her playbook, geniş compliance problemini daha net ve satıcı-dostu bir öncelik setine indirger.'
      },
      packages: {
        eyebrow: 'Servis paketleri',
        title: 'Önce check, ihtiyaç varsa sonra draft support',
        description: 'Bu yapı uygulamayı hem karar motoru hem de lead-generation katmanı haline getirir.',
        cta: 'Destek talep et'
      },
      resources: {
        eyebrow: 'Kaynaklar',
        title: 'Intake akışını destekleyen seller-friendly içerikler',
        description: 'Bu bloklar positioning’i güçlendirir: sade, pratik ve ürün odaklı.'
      },
      faq: {
        eyebrow: 'SSS',
        title: 'Küçük satıcıların compliance için para harcamadan önce sorduğu sorular'
      },
      contact: {
        eyebrow: 'Human-in-the-loop support',
        title: 'Raporu ilk filtre olarak kullanın, ardından gerekiyorsa draft pack ve prep desteğine geçin.',
        description: 'Pazardaki en güçlü model bu: AI karar hızını artırır, güven ise uzman desteği görünür olduğunda oluşur.',
        bullet1: 'Ürün bazlı doküman inceleme',
        bullet2: 'Starter pack draft desteği',
        bullet3: 'Amazon listing readiness guidance',
        demoVisitor: 'Ziyaretçi',
        alert: '{name}, destek talebiniz demo modunda alındı. Gerçek sürümde bu form bir CRM veya teklif akışına bağlanabilir.',
        form: {
          name: 'Ad soyad',
          email: 'E-posta',
          company: 'Brand veya mağaza',
          phone: 'Telefon',
          message: 'Nasıl yardımcı olalım?',
          namePlaceholder: 'Adınızı girin',
          emailPlaceholder: 'E-posta adresiniz',
          companyPlaceholder: 'Mağaza veya şirket adı',
          phonePlaceholder: '+44 / +49 / +90',
          messagePlaceholder: 'Hangi ürün, hangi pazar ve hangi eksik doküman için destek istediğinizi yazın.',
          submit: 'Destek Talep Et'
        }
      },
      common: {
        yes: 'Evet',
        no: 'Hayır',
        notSure: 'Emin değilim',
        none: 'Henüz hiçbiri yok',
        available: 'Mevcut',
        missing: 'Eksik'
      },
      status: {
        waiting: 'Yerel kayıt bekleniyor',
        updated: 'Yerel kayıt güncellendi',
        loaded: 'Yerel kayıt yüklendi',
        cleared: 'Yerel kayıt temizlendi',
        error: 'Veri yükleme hatası'
      },
      footer: {
        meta: 'Son güncelleme {date} · {email}'
      }
    },
    en: {
      meta: {
        title: 'CertiRehber | UK/EU Product Compliance Advisor',
        description: 'Quickly learn which compliance documents your technical product is likely to need before entering UK and EU markets.'
      },
      language: { label: 'Choose language' },
      header: { tagline: 'UK/EU Product Compliance Advisor', cta: 'Start Product Check' },
      nav: { assessment: 'Assessment', playbooks: 'Playbooks', packages: 'Packages', resources: 'Resources', faq: 'FAQ', contact: 'Contact' },
      hero: {
        badge: 'For Amazon, Shopify and e-commerce sellers entering the UK/EU market',
        title: 'Find out which compliance documents your technical product needs before you sell.',
        description: 'CertiRehber helps small online sellers identify likely UK/EU document requirements, missing supplier files, key risk flags, and practical next steps from a simple intake.',
        primaryCta: 'Run Product Check',
        secondaryCta: 'View Service Packages',
        sampleEyebrow: 'Sample output',
        sampleTitle: 'Amazon Product Compliance Snapshot',
        sampleLive: 'SME-friendly',
        sampleDescription: 'The result explains what is likely required, what is missing, and what should be checked before listing the product.',
        sampleCardOne: 'Required documents',
        sampleCardTwo: 'Risk flags and next steps',
        metricOne: 'Initial intake',
        metricTwo: 'Core result blocks',
        metricThree: 'Market focus'
      },
      assessment: {
        eyebrow: 'Compliance intake',
        title: 'Answer a few product questions and get a decision-style compliance overview.',
        description: 'This workflow is designed for technical products sold through Amazon, Shopify, Etsy, and similar channels into the UK and EU.',
        noteEyebrow: 'What this does',
        noteBody: 'It does not replace legal review. It gives sellers a structured first pass: likely documents, supplier gaps, listing risks, and next actions.',
        fields: {
          productName: '1. Product name',
          productUrl: '2. Product link',
          channel: '3. Sales channel',
          category: '4. Product category',
          role: '5. Seller role',
          ceStatus: '6. CE / supplier compliance status',
          electrical: '7. Is the product electrical?',
          battery: '8. Does it contain a battery?',
          wireless: '9. Does it use wireless connectivity?',
          skinContact: '10. Does it contact skin or the body?',
          children: '11. Is it intended for children?',
          markets: '12. Which markets do you want to sell in?',
          documents: '13. Which documents do you already have?'
        },
        placeholders: {
          productName: 'Enter product name',
          productUrl: 'Amazon, Shopify or supplier URL'
        },
        findButton: 'Build Compliance Overview',
        resetButton: 'Reset'
      },
      results: {
        reportTitle: 'Compliance report area',
        reportDescription: 'Your likely documents, regulations, missing items, risks, and next steps will appear here.',
        emptyTitle: 'Fill in the core intake first',
        emptyDescription: 'The decision engine will generate results once the product basics, markets, and core binary product questions are filled in.',
        summaryOne: 'Product and channel',
        summaryTwo: 'Seller position',
        summaryThree: 'Current file readiness',
        documentsTitle: 'Likely required documents',
        regulationsTitle: 'Possible regulations / frameworks',
        missingTitle: 'Missing information or files',
        risksTitle: 'Risk flags',
        nextTitle: 'Recommended next steps',
        packagesTitle: 'Suggested support path'
      },
      playbooks: {
        eyebrow: 'Go-to-market playbooks',
        title: 'Focused entry points for technical e-commerce sellers',
        description: 'Each playbook turns a broad compliance problem into a clearer seller scenario with concrete priorities.'
      },
      packages: {
        eyebrow: 'Service packages',
        title: 'Start with a check, then move into draft support if needed',
        description: 'This structure lets the product act as both a decision engine and a lead-generation layer.',
        cta: 'Request support'
      },
      resources: {
        eyebrow: 'Resources',
        title: 'Seller-friendly guidance content that supports the intake flow',
        description: 'These blocks reinforce the positioning: simple, practical, and product-specific.'
      },
      faq: {
        eyebrow: 'FAQ',
        title: 'Questions small sellers ask before spending on compliance'
      },
      contact: {
        eyebrow: 'Human-in-the-loop support',
        title: 'Use the report as your first filter, then bring in support for draft packs and prep.',
        description: 'This matches the strongest market pattern: AI speeds up decisions, but trust is built when expert support is visible.',
        bullet1: 'Product-specific document review',
        bullet2: 'Starter pack drafting support',
        bullet3: 'Amazon listing readiness guidance',
        demoVisitor: 'Visitor',
        alert: '{name}, your support request has been received in demo mode. In a live setup this form could connect to a CRM or quote flow.',
        form: {
          name: 'Full name',
          email: 'Email',
          company: 'Brand or store',
          phone: 'Phone',
          message: 'What do you need help with?',
          namePlaceholder: 'Enter your name',
          emailPlaceholder: 'Your email address',
          companyPlaceholder: 'Store or company name',
          phonePlaceholder: '+44 / +49 / +90',
          messagePlaceholder: 'Tell us which product, market, and missing documents you want help with.',
          submit: 'Request Support'
        }
      },
      common: {
        yes: 'Yes',
        no: 'No',
        notSure: 'Not sure',
        none: 'None yet',
        available: 'Available',
        missing: 'Missing'
      },
      status: {
        waiting: 'Waiting for local save',
        updated: 'Local save updated',
        loaded: 'Local save loaded',
        cleared: 'Local save cleared',
        error: 'Data loading error'
      },
      footer: {
        meta: 'Last update {date} · {email}'
      }
    },
    de: {
      meta: {
        title: 'CertiRehber | UK/EU Product Compliance Advisor',
        description: 'Ermitteln Sie schnell, welche Compliance-Dokumente Ihr technisches Produkt vor dem Markteintritt in UK und EU voraussichtlich benötigt.'
      },
      language: { label: 'Sprache wählen' },
      header: { tagline: 'UK/EU Product Compliance Advisor', cta: 'Produkt-Check starten' },
      nav: { assessment: 'Assessment', playbooks: 'Playbooks', packages: 'Pakete', resources: 'Ressourcen', faq: 'FAQ', contact: 'Kontakt' },
      hero: {
        badge: 'Für Amazon-, Shopify- und E-Commerce-Verkäufer mit UK/EU-Fokus',
        title: 'Finden Sie heraus, welche Compliance-Dokumente Ihr technisches Produkt vor dem Verkauf braucht.',
        description: 'CertiRehber hilft kleinen Online-Händlern dabei, wahrscheinliche UK/EU-Dokumente, fehlende Lieferantenunterlagen, zentrale Risikoflaggen und praktische nächste Schritte über ein einfaches Intake zu erkennen.',
        primaryCta: 'Produkt-Check starten',
        secondaryCta: 'Servicepakete ansehen',
        sampleEyebrow: 'Beispielausgabe',
        sampleTitle: 'Amazon Product Compliance Snapshot',
        sampleLive: 'SME-friendly',
        sampleDescription: 'Das Ergebnis zeigt, was wahrscheinlich nötig ist, was fehlt und was vor dem Listing geprüft werden sollte.',
        sampleCardOne: 'Erforderliche Dokumente',
        sampleCardTwo: 'Risiken und nächste Schritte',
        metricOne: 'Erstes Intake',
        metricTwo: 'Kern-Ergebnisblöcke',
        metricThree: 'Marktfokus'
      },
      assessment: {
        eyebrow: 'Compliance Intake',
        title: 'Beantworten Sie einige Produktfragen und erhalten Sie eine entscheidungsorientierte Compliance-Übersicht.',
        description: 'Dieser Ablauf ist für technische Produkte gedacht, die über Amazon, Shopify, Etsy und ähnliche Kanäle in UK und EU verkauft werden.',
        noteEyebrow: 'Was dieses Tool leistet',
        noteBody: 'Es ersetzt keine rechtliche Prüfung. Es gibt Verkäufern eine strukturierte erste Sicht: wahrscheinliche Dokumente, Lieferantenlücken, Listing-Risiken und nächste Schritte.',
        fields: {
          productName: '1. Produktname',
          productUrl: '2. Produktlink',
          channel: '3. Vertriebskanal',
          category: '4. Produktkategorie',
          role: '5. Verkäuferrolle',
          ceStatus: '6. CE- / Lieferanten-Status',
          electrical: '7. Ist das Produkt elektrisch?',
          battery: '8. Enthält es eine Batterie?',
          wireless: '9. Nutzt es Funkverbindungen?',
          skinContact: '10. Hat es Kontakt mit Haut oder Körper?',
          children: '11. Ist es für Kinder gedacht?',
          markets: '12. In welchen Märkten möchten Sie verkaufen?',
          documents: '13. Welche Unterlagen haben Sie bereits?'
        },
        placeholders: {
          productName: 'Produktname eingeben',
          productUrl: 'Amazon-, Shopify- oder Lieferanten-URL'
        },
        findButton: 'Compliance-Überblick erstellen',
        resetButton: 'Zurücksetzen'
      },
      results: {
        reportTitle: 'Compliance-Berichtsbereich',
        reportDescription: 'Wahrscheinliche Dokumente, Regelwerke, fehlende Punkte, Risiken und nächste Schritte erscheinen hier.',
        emptyTitle: 'Bitte zuerst das Kern-Intake ausfüllen',
        emptyDescription: 'Die Engine erzeugt Ergebnisse, sobald Produktbasis, Märkte und die Kernfragen zum Produkt ausgefüllt sind.',
        summaryOne: 'Produkt und Kanal',
        summaryTwo: 'Verkäuferposition',
        summaryThree: 'Aktueller Dokumentenstand',
        documentsTitle: 'Wahrscheinlich erforderliche Dokumente',
        regulationsTitle: 'Mögliche Regelwerke / Rahmen',
        missingTitle: 'Fehlende Informationen oder Unterlagen',
        risksTitle: 'Risikoflaggen',
        nextTitle: 'Empfohlene nächste Schritte',
        packagesTitle: 'Empfohlener Support-Pfad'
      },
      playbooks: {
        eyebrow: 'Go-to-market Playbooks',
        title: 'Fokussierte Einstiegspunkte für technische E-Commerce-Verkäufer',
        description: 'Jedes Playbook verdichtet ein breites Compliance-Problem in ein klareres Verkäuferszenario mit konkreten Prioritäten.'
      },
      packages: {
        eyebrow: 'Servicepakete',
        title: 'Mit einem Check starten und bei Bedarf in Draft Support wechseln',
        description: 'So kann das Produkt sowohl als Entscheidungsmaschine als auch als Lead-Generation-Layer dienen.',
        cta: 'Support anfragen'
      },
      resources: {
        eyebrow: 'Ressourcen',
        title: 'Verkäuferfreundliche Inhalte zur Unterstützung des Intake-Flows',
        description: 'Diese Blöcke stärken die Positionierung: einfach, praktisch und produktspezifisch.'
      },
      faq: {
        eyebrow: 'FAQ',
        title: 'Fragen, die kleine Verkäufer stellen, bevor sie in Compliance investieren'
      },
      contact: {
        eyebrow: 'Human-in-the-loop Support',
        title: 'Nutzen Sie den Bericht als ersten Filter und holen Sie sich danach bei Bedarf Hilfe für Draft Packs und Vorbereitung.',
        description: 'Das passt zum stärksten Marktmodell: KI beschleunigt Entscheidungen, Vertrauen entsteht, wenn Experten-Support sichtbar ist.',
        bullet1: 'Produktspezifische Dokumentenprüfung',
        bullet2: 'Unterstützung bei Starter-Pack-Entwürfen',
        bullet3: 'Amazon Listing Readiness Guidance',
        demoVisitor: 'Besucher',
        alert: '{name}, Ihre Support-Anfrage wurde im Demo-Modus empfangen. In einer Live-Umgebung könnte dieses Formular an ein CRM oder Angebots-Flow angebunden werden.',
        form: {
          name: 'Vollständiger Name',
          email: 'E-Mail',
          company: 'Marke oder Shop',
          phone: 'Telefon',
          message: 'Wobei benötigen Sie Hilfe?',
          namePlaceholder: 'Namen eingeben',
          emailPlaceholder: 'E-Mail-Adresse',
          companyPlaceholder: 'Shop- oder Firmenname',
          phonePlaceholder: '+44 / +49 / +90',
          messagePlaceholder: 'Teilen Sie mit, für welches Produkt, welchen Markt und welche fehlenden Unterlagen Sie Hilfe brauchen.',
          submit: 'Support anfragen'
        }
      },
      common: {
        yes: 'Ja',
        no: 'Nein',
        notSure: 'Nicht sicher',
        none: 'Noch nichts',
        available: 'Vorhanden',
        missing: 'Fehlt'
      },
      status: {
        waiting: 'Warten auf lokale Speicherung',
        updated: 'Lokale Speicherung aktualisiert',
        loaded: 'Lokale Speicherung geladen',
        cleared: 'Lokale Speicherung gelöscht',
        error: 'Fehler beim Laden der Daten'
      },
      footer: {
        meta: 'Letzte Aktualisierung {date} · {email}'
      }
    }
  }
};
