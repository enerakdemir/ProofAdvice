window.APP_I18N = {
  locales: [
    { code: 'en', label: 'EN', nativeName: 'English' },
    { code: 'tr', label: 'TR', nativeName: 'Türkçe' },
    { code: 'de', label: 'DE', nativeName: 'Deutsch' }
  ],
  ui: {
    tr: {
      meta: {
        title: 'CertPath | UK/EU Sertifika ve Uyum Asistanı',
        description: 'Şirketinizin UK ve AB için muhtemel sertifika ve uyum kanıtı ihtiyaçlarını ve neleri temin etmeniz gerektiğini kısa bir intake ile görün.'
      },
      language: { label: 'Dil seçin' },
      header: { tagline: 'UK/EU Sertifika ve Uyum Asistanı', cta: 'Ürün Kontrolü Başlat' },
      nav: { assessment: 'Assessment', playbooks: 'Playbooklar', packages: 'Paketler', resources: 'Kaynaklar', faq: 'SSS', contact: 'İletişim' },
      hero: {
        badge: 'UK/EU pazarına açılan Amazon, Shopify ve e-ticaret satıcıları için',
        title: 'Satış öncesi hangi sertifika ve uyum kanıtlarına ihtiyacınız olabileceğini haritalayın.',
        description: 'CertPath; şirket ve satıcıların ürün bazında olası sertifika ve doküman ihtiyaçlarını, eksikleri, riskleri ve temin edilmesi gerekenleri sade bir intake ile netleştirir.',
        primaryCta: 'Ürün Kontrolünü Çalıştır',
        secondaryCta: 'Servis Paketlerini Gör',
        sampleEyebrow: 'Örnek çıktı',
        sampleTitle: 'Amazon Ürün Compliance Snapshot',
        sampleLive: 'SME-friendly',
        sampleDescription: 'Sonuç ekranı; muhtemel gereklilikleri, eksikleri ve listeleme öncesi kontrol edilmesi gereken riskleri birlikte gösterir.',
        sampleCardOne: 'Olası sertifikalar ve kanıtlar',
        sampleCardTwo: 'Riskler ve next steps',
        metricOne: 'İlk intake süresi',
        metricTwo: 'Ana sonuç bloğu',
        metricThree: 'Pazar odağı'
      },
      assessment: {
        eyebrow: 'Compliance intake',
        title: 'Birkaç ürün sorusu yanıtlayın; muhtemel sertifika ve uyum yolunuzu özetleyelim.',
        description: 'Bu akış; Amazon, Shopify, Etsy ve benzeri kanallardan UK/EU pazarına ürün satan şirket ve satıcılar için tasarlandı.',
        noteEyebrow: 'Bu araç ne yapar?',
        noteBody: 'Hukuki danışmanlık yerine geçmez. Muhtemel sertifikalar ve kanıtlar, eksikler, liste riskleri ve temin listesi için ilk yön verir.',
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
          productUrl: 'Amazon, Shopify veya tedarikçi linki',
          geminiApiKey: 'Yerel test için Gemini API key girin'
        },
        aiTestEyebrow: 'AI test modu',
        aiTestBody: 'Sadece test için Gemini API key girebilirsiniz. Bu anahtar sadece bu tarayıcıda kalır ve repoya commit edilmez.',
        saveApiKey: 'Anahtarı kaydet',
        clearApiKey: 'Anahtarı temizle',
        apiKeySaved: 'Tarayıcı anahtarı kaydedildi',
        apiKeyMissing: 'Tarayıcı anahtarı girilmedi',
        findButton: 'Sertifika ve Uyum Özeti Oluştur',
        resetButton: 'Temizle'
      },
      results: {
        reportTitle: 'Sertifika ve uyum raporu',
        reportDescription: 'Muhtemel sertifikalar ve dokümanlar, çerçeveler, eksikler, riskler ve temin adımları burada görünür.',
        emptyTitle: 'Ön değerlendirme için temel alanları doldurun',
        emptyDescription: 'En az ürün adı, kanal, kategori, pazar ve binary ürün sorularını seçtiğinizde karar motoru sonuç üretir.',
        summaryOne: 'Ürün ve kanal',
        summaryTwo: 'Satıcı pozisyonu',
        summaryThree: 'Mevcut dosya durumu',
        summaryAi: 'AI sertifika ve uyum özeti',
        documentsTitle: 'Muhtemel sertifikalar ve temel dokümanlar',
        regulationsTitle: 'Possible regulations / frameworks',
        missingTitle: 'Missing information or files',
        risksTitle: 'Risk flags',
        nextTitle: 'Recommended next steps',
        packagesTitle: 'Suggested support path',
        sourcesTitle: 'Kullanılan resmi kaynaklar',
        aiLoading: 'AI, resmi UK/EU kaynaklarını kontrol ederek grounded analiz hazırlıyor...',
        aiReady: 'AI analizi resmi kaynak bağlamıyla güncellendi.',
        aiBrowserConfigured: 'Tarayıcı test modu aktif. AI isteği kaydedilmiş Gemini API key ile gönderilecek.',
        aiBrowserReady: 'Tarayıcı test modu ile AI analizi tamamlandı ({model}).',
        aiBrowserError: 'Tarayıcı test modunda Gemini çağrısı başarısız oldu. API key veya model erişimini kontrol edin.',
        aiFallback: 'Canlı AI analizi şu anda kullanılamıyor. Yerleşik karar motoru gösteriliyor.',
        aiUnavailable: 'AI henüz aktif değil. Canlı worker endpoint ekleyin veya test için Gemini API key girin.',
        aiError: 'AI analizi tamamlanamadı. Fallback karar motoru çalışmaya devam ediyor.'
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
        title: 'CertPath | UK/EU Certificate & Compliance Advisor',
        description: 'Map likely certificates and conformity evidence for the UK and EU, and see what your company should obtain before selling.'
      },
      language: { label: 'Choose language' },
      header: { tagline: 'UK/EU Certificate & Compliance Advisor', cta: 'Start Product Check' },
      nav: { assessment: 'Assessment', playbooks: 'Playbooks', packages: 'Packages', resources: 'Resources', faq: 'FAQ', contact: 'Contact' },
      hero: {
        badge: 'For Amazon, Shopify and e-commerce sellers entering the UK/EU market',
        title: 'Map likely certificates and conformity evidence before you sell in the UK or EU.',
        description: 'CertPath helps companies and sellers clarify probable certificate and documentation needs, gaps, risks, and what to obtain—from a short product intake.',
        primaryCta: 'Run Product Check',
        secondaryCta: 'View Service Packages',
        sampleEyebrow: 'Sample output',
        sampleTitle: 'Amazon Product Compliance Snapshot',
        sampleLive: 'SME-friendly',
        sampleDescription: 'The result explains what is likely required, what is missing, and what should be checked before listing the product.',
        sampleCardOne: 'Certificates & evidence',
        sampleCardTwo: 'Risk flags and next steps',
        metricOne: 'Initial intake',
        metricTwo: 'Core result blocks',
        metricThree: 'Market focus'
      },
      assessment: {
        eyebrow: 'Compliance intake',
        title: 'Answer a few product questions and get a certificate-and-compliance snapshot.',
        description: 'Built for companies and sellers listing technical products through Amazon, Shopify, Etsy, and similar channels into the UK and EU.',
        noteEyebrow: 'What this does',
        noteBody: 'It does not replace legal advice. It highlights likely certificates and evidence, supplier gaps, listing risks, and what to obtain next.',
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
          productUrl: 'Amazon, Shopify or supplier URL',
          geminiApiKey: 'Enter Gemini API key for local testing'
        },
        aiTestEyebrow: 'AI test mode',
        aiTestBody: 'For testing only, you can enter a Gemini API key here. It stays in this browser and is not committed to the repo.',
        saveApiKey: 'Save key',
        clearApiKey: 'Clear key',
        apiKeySaved: 'Browser key saved',
        apiKeyMissing: 'No browser key saved',
        findButton: 'Build Certificate & Compliance Summary',
        resetButton: 'Reset'
      },
      results: {
        reportTitle: 'Certificate & compliance report',
        reportDescription: 'Likely certificates and documents, frameworks, gaps, risks, and what to obtain will appear here.',
        emptyTitle: 'Fill in the core intake first',
        emptyDescription: 'The decision engine will generate results once the product basics, markets, and core binary product questions are filled in.',
        summaryOne: 'Product and channel',
        summaryTwo: 'Seller position',
        summaryThree: 'Current file readiness',
        summaryAi: 'AI certificate & compliance summary',
        documentsTitle: 'Likely certificates & key documents',
        regulationsTitle: 'Possible regulations / frameworks',
        missingTitle: 'Missing information or files',
        risksTitle: 'Risk flags',
        nextTitle: 'Recommended next steps',
        packagesTitle: 'Suggested support path',
        sourcesTitle: 'Official sources used',
        aiLoading: 'AI is checking official UK/EU sources and building a grounded analysis...',
        aiReady: 'AI analysis updated using official-source context.',
        aiBrowserConfigured: 'Browser test mode is active. AI requests will use the saved Gemini API key.',
        aiBrowserReady: 'Browser test mode completed the AI analysis ({model}).',
        aiBrowserError: 'Browser test mode could not call Gemini. Check the API key or model access.',
        aiFallback: 'Live AI analysis is unavailable right now. Showing the built-in decision engine instead.',
        aiUnavailable: 'AI is not active yet. Configure the secure worker endpoint or enter a Gemini API key for testing.',
        aiError: 'AI analysis could not be completed. The fallback decision engine is still available.'
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
        title: 'CertPath | UK/EU Zertifikats- & Compliance-Advisor',
        description: 'Ermitteln Sie wahrscheinliche Zertifikats- und Konformitätsnachweise für UK und EU und was Ihr Unternehmen als Nächstes beschaffen sollte.'
      },
      language: { label: 'Sprache wählen' },
      header: { tagline: 'UK/EU Zertifikats- & Compliance-Advisor', cta: 'Produkt-Check starten' },
      nav: { assessment: 'Assessment', playbooks: 'Playbooks', packages: 'Pakete', resources: 'Ressourcen', faq: 'FAQ', contact: 'Kontakt' },
      hero: {
        badge: 'Für Amazon-, Shopify- und E-Commerce-Verkäufer mit UK/EU-Fokus',
        title: 'Ordnen Sie vor dem Verkauf wahrscheinliche Zertifikate und Konformitätsnachweise für UK und EU ein.',
        description: 'CertPath hilft Unternehmen und Verkäufern, wahrscheinliche Zertifikats- und Dokumentenbedarfe, Lücken, Risiken und Beschaffungsschritte über ein kurzes Intake zu klären.',
        primaryCta: 'Produkt-Check starten',
        secondaryCta: 'Servicepakete ansehen',
        sampleEyebrow: 'Beispielausgabe',
        sampleTitle: 'Amazon Product Compliance Snapshot',
        sampleLive: 'SME-friendly',
        sampleDescription: 'Das Ergebnis zeigt, was wahrscheinlich nötig ist, was fehlt und was vor dem Listing geprüft werden sollte.',
        sampleCardOne: 'Zertifikate & Nachweise',
        sampleCardTwo: 'Risiken und nächste Schritte',
        metricOne: 'Erstes Intake',
        metricTwo: 'Kern-Ergebnisblöcke',
        metricThree: 'Marktfokus'
      },
      assessment: {
        eyebrow: 'Compliance Intake',
        title: 'Beantworten Sie einige Produktfragen und erhalten Sie eine Zertifikats- und Compliance-Snapshot.',
        description: 'Für Unternehmen und Verkäufer technischer Produkte über Amazon, Shopify, Etsy und ähnliche Kanäle in UK und EU.',
        noteEyebrow: 'Was dieses Tool leistet',
        noteBody: 'Es ersetzt keine Rechtsberatung. Es zeigt wahrscheinliche Zertifikate und Nachweise, Lücken, Listing-Risiken und was als Nächstes zu beschaffen ist.',
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
          productUrl: 'Amazon-, Shopify- oder Lieferanten-URL',
          geminiApiKey: 'Gemini-API-Schlüssel für lokalen Test eingeben'
        },
        aiTestEyebrow: 'KI-Testmodus',
        aiTestBody: 'Nur zum Testen können Sie hier einen Gemini-API-Schlüssel eingeben. Er bleibt nur in diesem Browser und wird nicht ins Repo übernommen.',
        saveApiKey: 'Schlüssel speichern',
        clearApiKey: 'Schlüssel löschen',
        apiKeySaved: 'Browser-Schlüssel gespeichert',
        apiKeyMissing: 'Kein Browser-Schlüssel gespeichert',
        findButton: 'Zertifikats- & Compliance-Zusammenfassung erstellen',
        resetButton: 'Zurücksetzen'
      },
      results: {
        reportTitle: 'Zertifikats- & Compliance-Bericht',
        reportDescription: 'Wahrscheinliche Zertifikate und Unterlagen, Regelwerke, Lücken, Risiken und Beschaffungsschritte erscheinen hier.',
        emptyTitle: 'Bitte zuerst das Kern-Intake ausfüllen',
        emptyDescription: 'Die Engine erzeugt Ergebnisse, sobald Produktbasis, Märkte und die Kernfragen zum Produkt ausgefüllt sind.',
        summaryOne: 'Produkt und Kanal',
        summaryTwo: 'Verkäuferposition',
        summaryThree: 'Aktueller Dokumentenstand',
        summaryAi: 'KI-Zertifikats- & Compliance-Zusammenfassung',
        documentsTitle: 'Wahrscheinliche Zertifikate & Kernunterlagen',
        regulationsTitle: 'Mögliche Regelwerke / Rahmen',
        missingTitle: 'Fehlende Informationen oder Unterlagen',
        risksTitle: 'Risikoflaggen',
        nextTitle: 'Empfohlene nächste Schritte',
        packagesTitle: 'Empfohlener Support-Pfad',
        sourcesTitle: 'Verwendete offizielle Quellen',
        aiLoading: 'Die KI prüft offizielle UK/EU-Quellen und erstellt eine fundierte Analyse...',
        aiReady: 'Die KI-Analyse wurde mit offiziellem Quellenkontext aktualisiert.',
        aiBrowserConfigured: 'Der Browser-Testmodus ist aktiv. KI-Anfragen nutzen den gespeicherten Gemini-API-Schlüssel.',
        aiBrowserReady: 'Der Browser-Testmodus hat die KI-Analyse abgeschlossen ({model}).',
        aiBrowserError: 'Der Browser-Testmodus konnte Gemini nicht aufrufen. Prüfen Sie API-Schlüssel oder Modellzugriff.',
        aiFallback: 'Die Live-KI-Analyse ist derzeit nicht verfügbar. Stattdessen wird die eingebaute Entscheidungslogik angezeigt.',
        aiUnavailable: 'Die KI ist noch nicht aktiv. Konfigurieren Sie den sicheren Worker-Endpunkt oder geben Sie zum Testen einen Gemini-API-Schlüssel ein.',
        aiError: 'Die KI-Analyse konnte nicht abgeschlossen werden. Die Fallback-Entscheidungslogik bleibt verfügbar.'
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
