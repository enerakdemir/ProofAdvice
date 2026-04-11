window.APP_I18N = {
  locales: [
    { code: 'tr', label: 'TR', nativeName: 'Türkçe' },
    { code: 'en', label: 'EN', nativeName: 'English' },
    { code: 'de', label: 'DE', nativeName: 'Deutsch' }
  ],
  ui: {
    tr: {
      meta: { title: 'CertiRehber | Hedef Pazar Bazlı Sertifika Rehberi', description: 'Şirketiniz için gerekli sertifika, uyum ve hedef pazar gereksinimlerini hızlıca keşfedin.' },
      language: { label: 'Dil seçin' },
      header: { tagline: 'Kurumsal Uyum Asistanı', cta: 'Analizi Başlat' },
      nav: { assessment: 'Değerlendirme', journey: 'Yol Haritası', certificates: 'Belgeler', playbooks: 'Sektör Rehberleri', resources: 'Kaynaklar', faq: 'SSS', contact: 'Teklif Al' },
      hero: {
        badge: 'Hedef pazarınıza göre sertifika ve uyum yol haritası',
        title: 'Ürün ve hizmetlerinizi hangi pazara sunacağınıza göre doğru belge setini bulun.',
        description: 'CertiRehber; sektör, ekip büyüklüğü, şirket aşaması, veri işleme yapısı ve hedef pazarlarınıza göre zorunlu belgeleri ve tavsiye edilen sertifikaları tek raporda gösterir.',
        primaryCta: 'Hemen Başla',
        secondaryCta: 'Kaynakları İncele',
        sampleEyebrow: 'Örnek Çıktı',
        sampleTitle: 'Pazar Bazlı Uyum Özeti',
        sampleLive: 'Canlı skor kartı',
        sampleDescription: 'Türkiye, Avrupa, Amerika, Asya ve global satış hedeflerine göre uyum başlıklarını aynı ekranda karşılaştırır.',
        sampleRegional: 'Bölgesel regülasyonlar',
        sampleGlobal: 'Global standartlar',
        metricMarkets: 'Hedef pazar',
        metricRequirements: 'Zorunlu / tavsiye',
        metricTopics: 'Uyum başlığı'
      },
      assessment: {
        eyebrow: 'Akıllı Değerlendirme',
        title: 'Şirket profilinize ve hedef pazarınıza göre belge yol haritası oluşturun.',
        description: 'Sektörünüz, firma aşamanız ve satış yapacağınız bölgeler değiştikçe almanız gereken belgeler de değişir.',
        fields: { sector: '1. Sektör', employees: '2. Çalışan sayısı', stage: '3. Firma aşaması', personalData: '4. Kişisel veri işliyor musunuz?', regions: '5. Ürün veya hizmetlerinizi hangi pazara sunuyorsunuz? (Hedef pazarınız)' },
        findButton: 'Sonuçları Gör',
        resetButton: 'Temizle',
        reportTitle: 'Rapor alanı',
        reportDescription: 'Analiz tamamlandığında hedef pazarlarınıza göre zorunlu ve tavsiye edilen belgeler burada görüntülenir.'
      },
      journey: { eyebrow: 'Yol Haritası', title: 'Doğru belge setine sistematik şekilde ulaşın.', subtitle: 'İlk değerlendirmeden belgelendirme hazırlığına kadar temel akış' },
      certificates: {
        eyebrow: 'Belge Kataloğu',
        title: 'Popüler sertifikalar ve pazar bazlı uyum başlıkları',
        description: 'Kartlar doğrudan veri deposundan beslenir. Böylece GitHub Actions ile güncellendiğinde arayüz otomatik olarak yeni veriyi gösterir.'
      },
      playbooks: {
        eyebrow: 'Sektör Rehberleri',
        title: 'Büyüme ve ihracat senaryoları için önerilen oyun planları',
        description: 'Her sektör aynı belge setine ihtiyaç duymaz. Bu bölüm, sık karşılaşılan pazar açılım senaryolarını özetler.'
      },
      resources: { eyebrow: 'Kaynaklar', title: 'Karar vermeyi kolaylaştıran hızlı kaynaklar', description: 'Bu alan, blog, checklist ve rehber içeriklerle ileride daha da büyütülebilir.' },
      faq: { eyebrow: 'SSS', title: 'En sık sorulan sorular' },
      contact: {
        eyebrow: 'Profesyonel Destek',
        title: 'Belgelendirme hazırlığınızı danışman desteğiyle hızlandırın.',
        description: 'İlk sürümde bu form demo amaçlıdır. Gönderim sonrası örnek bir teklif akışı mesajı gösterilir. İleride CRM veya form servislerine bağlanabilir.',
        bullet1: 'Ön analiz ve belge yol haritası',
        bullet2: 'Danışman ve belgelendirme kuruluşu eşleştirme',
        bullet3: 'Teknik dosya ve süreç hazırlık desteği',
        demoVisitor: 'Ziyaretçi',
        alert: '{name}, talebiniz demo modunda alındı. Gerçek sürümde bu form CRM veya teklif sistemine bağlanacaktır.',
        form: {
          name: 'Ad Soyad',
          email: 'E-posta',
          company: 'Şirket',
          phone: 'Telefon',
          message: 'İhtiyacınız',
          namePlaceholder: 'Adınızı girin',
          emailPlaceholder: 'E-posta adresiniz',
          companyPlaceholder: 'Şirket adı',
          phonePlaceholder: '+90 ...',
          messagePlaceholder: 'Hangi belge veya pazara açılım konusunda destek istiyorsunuz?',
          submit: 'Teklif Talebi Gönder'
        }
      },
      common: { required: 'Zorunlu', recommended: 'Tavsiye Edilen', duration: 'Süre', cost: 'Maliyet', authority: 'Kaynak', yes: 'Evet', no: 'Hayır' },
      select: { sector: 'Sektör seçin', employees: 'Çalışan sayısını seçin', stage: 'Firma aşamasını seçin', personalData: 'Seçim yapın' },
      regions: {
        globalHint: 'Global standartlar ve bölgesel gereksinimleri birlikte düşünmek için kullanın.',
        marketHint: 'Bu pazara açılımda geçerli olan veya öne çıkan gereksinimler filtrelenir.'
      },
      empty: {
        assessmentTitle: 'Değerlendirme için tüm alanları doldurun',
        assessmentDescription: 'Sektör, çalışan sayısı, şirket aşaması, kişisel veri işleme durumu ve en az bir hedef pazar seçildiğinde sonuçlar oluşturulur.',
        dataTitle: 'Veri yüklenemedi',
        dataDescription: 'data.json dosyası okunamadı. Dosya yolunu ve JSON yapısını kontrol edin.'
      },
      summary: {
        companyProfile: 'Şirket Profili',
        dataProcessing: 'Veri İşleme Durumu',
        targetMarkets: 'Hedef Pazarlar',
        personalDataYes: 'Evet, işliyoruz',
        personalDataNo: 'Hayır, işlemiyoruz',
        dataProcessingDetail: 'Veri koruma gereksinimleri buna göre şekillenir.',
        targetMarketsDetail: 'Global seçim yapıldıysa global standartlar ve bölgesel gereksinimler birlikte değerlendirilir.'
      },
      results: {
        mandatoryTitle: 'Alınması zorunlu belgeler',
        mandatoryDescription: 'Mevzuat, ürün uygunluğu veya hedef pazardaki regülasyon sebebiyle öne çıkan başlıklar',
        mandatoryEmpty: 'Seçtiğiniz profil için doğrudan zorunlu bir başlık görünmüyor. Yine de resmi kaynak doğrulaması önerilir.',
        recommendedTitle: 'Tavsiye edilen belgeler',
        recommendedDescription: 'Kurumsallaşma, müşteri güveni, ihracat ve büyüme hedefleri açısından güçlü değer üreten başlıklar',
        recommendedEmpty: 'Bu profil için tavsiye alanı boş görünüyor. Daha geniş sektör veya pazar kombinasyonlarıyla tekrar deneyebilirsiniz.'
      },
      actions: {
        first: { title: '1. Önceliklendirme yapın', withMandatory: 'Önce {certificate} gibi zorunlu başlıklardan başlayın ve mevzuat yükümlülüklerini kapatın.', withoutMandatory: 'Zorunlu başlık görünmüyorsa tavsiye edilen belgeleri müşteri ve büyüme hedeflerinize göre önceliklendirin.' },
        second: { title: '2. Hazırlık paketinizi oluşturun', personalData: 'Veri envanteri, politika seti, açık rıza metinleri ve sözleşme ekleri gibi temel dokümanları planlayın.', noPersonalData: 'Süreç dokümantasyonu, görev tanımları, risk analizi ve iç denetim hazırlığını erken aşamada kurun.' },
        third: { title: '3. Destek modelinizi seçin', complex: 'Birden fazla pazara açılıyorsanız danışmanlık ve belgelendirme kuruluşu eşleştirmesi zaman kazandırır.', simple: 'İlk belge süreciniz sınırlıysa iç kaynak ve dış denetim modeliyle de ilerleyebilirsiniz.' }
      },
      status: { waiting: 'Yerel kayıt bekleniyor', updated: 'Yerel kayıt güncellendi', loaded: 'Yerel kayıt yüklendi', cleared: 'Yerel kayıt temizlendi', error: 'Veri yükleme hatası' },
      footer: { meta: 'Son güncelleme {date} · {email}' }
    },
    en: {
      meta: { title: 'CertiRehber | Target Market Certification Guide', description: 'Quickly discover the certificates, compliance needs, and target-market requirements your company should address.' },
      language: { label: 'Choose language' },
      header: { tagline: 'Corporate Compliance Assistant', cta: 'Start Analysis' },
      nav: { assessment: 'Assessment', journey: 'Roadmap', certificates: 'Certificates', playbooks: 'Industry Playbooks', resources: 'Resources', faq: 'FAQ', contact: 'Get a Quote' },
      hero: {
        badge: 'Certification and compliance roadmap by target market',
        title: 'Find the right document set based on the markets where you plan to offer your products and services.',
        description: 'CertiRehber shows mandatory documents and recommended certifications in a single report based on your sector, team size, business stage, data-processing model, and target markets.',
        primaryCta: 'Get Started',
        secondaryCta: 'Explore Resources',
        sampleEyebrow: 'Sample Output',
        sampleTitle: 'Market-Based Compliance Summary',
        sampleLive: 'Live scorecard',
        sampleDescription: 'Compare compliance topics for Turkey, Europe, America, Asia, and global sales goals on one screen.',
        sampleRegional: 'Regional regulations',
        sampleGlobal: 'Global standards',
        metricMarkets: 'Target markets',
        metricRequirements: 'Mandatory / recommended',
        metricTopics: 'Compliance topics'
      },
      assessment: {
        eyebrow: 'Smart Assessment',
        title: 'Build a certificate roadmap based on your company profile and target markets.',
        description: 'The documents you need change as your sector, growth stage, and sales regions change.',
        fields: { sector: '1. Sector', employees: '2. Number of employees', stage: '3. Business stage', personalData: '4. Do you process personal data?', regions: '5. Which markets do you serve with your products or services? (Target markets)' },
        findButton: 'See Results',
        resetButton: 'Clear',
        reportTitle: 'Report area',
        reportDescription: 'Mandatory and recommended documents for your target markets will appear here after the analysis.'
      },
      journey: { eyebrow: 'Roadmap', title: 'Reach the right document set in a structured way.', subtitle: 'Core flow from first assessment to certification readiness' },
      certificates: { eyebrow: 'Certificate Catalog', title: 'Popular certifications and market-based compliance topics', description: 'Cards are fed directly from the data repository. When GitHub Actions updates the data, the interface shows the new content automatically.' },
      playbooks: { eyebrow: 'Industry Playbooks', title: 'Recommended game plans for growth and export scenarios', description: 'Not every sector needs the same document set. This section summarizes common market-expansion scenarios.' },
      resources: { eyebrow: 'Resources', title: 'Fast resources that make decisions easier', description: 'This area can later grow further with blog posts, checklists, and guides.' },
      faq: { eyebrow: 'FAQ', title: 'Frequently asked questions' },
      contact: {
        eyebrow: 'Professional Support',
        title: 'Speed up your certification preparation with expert guidance.',
        description: 'In this first version the form is a demo. After submission, it shows a sample quote-flow message. Later it can connect to a CRM or form service.',
        bullet1: 'Pre-assessment and document roadmap',
        bullet2: 'Matching with consultants and certification bodies',
        bullet3: 'Technical file and process readiness support',
        demoVisitor: 'Visitor',
        alert: '{name}, your request has been received in demo mode. In the production version, this form would connect to a CRM or quotation system.',
        form: {
          name: 'Full name',
          email: 'Email',
          company: 'Company',
          phone: 'Phone',
          message: 'Your need',
          namePlaceholder: 'Enter your name',
          emailPlaceholder: 'Your email address',
          companyPlaceholder: 'Company name',
          phonePlaceholder: '+90 ...',
          messagePlaceholder: 'Which certificate or market expansion topic do you need help with?',
          submit: 'Send Quote Request'
        }
      },
      common: { required: 'Mandatory', recommended: 'Recommended', duration: 'Timeline', cost: 'Cost', authority: 'Authority', yes: 'Yes', no: 'No' },
      select: { sector: 'Select sector', employees: 'Select employee range', stage: 'Select business stage', personalData: 'Make a selection' },
      regions: { globalHint: 'Use this when you want to consider global standards together with regional requirements.', marketHint: 'Requirements that apply to or stand out for this market are filtered here.' },
      empty: {
        assessmentTitle: 'Fill in all fields for the assessment',
        assessmentDescription: 'Results appear when sector, employee range, business stage, personal-data status, and at least one target market are selected.',
        dataTitle: 'Data could not be loaded',
        dataDescription: 'The data.json file could not be read. Check the file path and JSON structure.'
      },
      summary: { companyProfile: 'Company Profile', dataProcessing: 'Data Processing Status', targetMarkets: 'Target Markets', personalDataYes: 'Yes, we do', personalDataNo: 'No, we do not', dataProcessingDetail: 'Data protection requirements are shaped accordingly.', targetMarketsDetail: 'If Global is selected, global standards and regional requirements are evaluated together.' },
      results: {
        mandatoryTitle: 'Mandatory documents to obtain',
        mandatoryDescription: 'Topics that stand out because of regulation, product conformity, or target-market requirements',
        mandatoryEmpty: 'There is no directly mandatory topic visible for your selected profile. Official-source verification is still recommended.',
        recommendedTitle: 'Recommended documents',
        recommendedDescription: 'Topics that create strong value for maturity, customer trust, exports, and growth goals',
        recommendedEmpty: 'The recommendation area looks empty for this profile. Try again with broader sector or market combinations.'
      },
      actions: {
        first: { title: '1. Prioritize the queue', withMandatory: 'Start with mandatory topics such as {certificate} and close legal or regulatory obligations first.', withoutMandatory: 'If no mandatory topic appears, prioritize the recommended documents based on customer and growth goals.' },
        second: { title: '2. Build your prep pack', personalData: 'Plan the core documents early, such as the data inventory, policy set, consent texts, and contract annexes.', noPersonalData: 'Set up process documentation, role definitions, risk analysis, and internal-audit readiness early.' },
        third: { title: '3. Choose your support model', complex: 'If you are entering multiple markets, consultant support and certification-body matching will save time.', simple: 'If your first certification scope is limited, you can also move forward with an internal team plus external audit model.' }
      },
      status: { waiting: 'Waiting for local save', updated: 'Local save updated', loaded: 'Local save loaded', cleared: 'Local save cleared', error: 'Data loading error' },
      footer: { meta: 'Last update {date} · {email}' }
    },
    de: {
      meta: { title: 'CertiRehber | Zertifizierungsleitfaden nach Zielmarkt', description: 'Ermitteln Sie schnell, welche Zertifikate, Compliance-Anforderungen und Zielmarkt-Vorgaben für Ihr Unternehmen relevant sind.' },
      language: { label: 'Sprache wählen' },
      header: { tagline: 'Assistent für Unternehmens-Compliance', cta: 'Analyse starten' },
      nav: { assessment: 'Analyse', journey: 'Roadmap', certificates: 'Zertifikate', playbooks: 'Branchenleitfäden', resources: 'Ressourcen', faq: 'FAQ', contact: 'Angebot anfragen' },
      hero: {
        badge: 'Zertifizierungs- und Compliance-Roadmap nach Zielmarkt',
        title: 'Finden Sie das richtige Dokumentenpaket passend zu den Märkten, in denen Sie Ihre Produkte und Leistungen anbieten wollen.',
        description: 'CertiRehber zeigt Pflichtdokumente und empfohlene Zertifizierungen in einem Bericht auf Basis von Branche, Teamgröße, Unternehmensphase, Datenverarbeitung und Zielmärkten.',
        primaryCta: 'Jetzt starten',
        secondaryCta: 'Ressourcen ansehen',
        sampleEyebrow: 'Beispielausgabe',
        sampleTitle: 'Marktbasierte Compliance-Zusammenfassung',
        sampleLive: 'Live-Scorecard',
        sampleDescription: 'Vergleichen Sie Compliance-Themen für Türkei, Europa, Amerika, Asien und globale Vertriebsziele auf einem Bildschirm.',
        sampleRegional: 'Regionale Vorgaben',
        sampleGlobal: 'Globale Standards',
        metricMarkets: 'Zielmärkte',
        metricRequirements: 'Pflicht / empfohlen',
        metricTopics: 'Compliance-Themen'
      },
      assessment: {
        eyebrow: 'Intelligente Analyse',
        title: 'Erstellen Sie eine Dokumenten-Roadmap passend zu Ihrem Unternehmensprofil und Ihren Zielmärkten.',
        description: 'Welche Unterlagen Sie benötigen, ändert sich mit Branche, Unternehmensphase und Vertriebsregionen.',
        fields: { sector: '1. Branche', employees: '2. Anzahl Mitarbeitende', stage: '3. Unternehmensphase', personalData: '4. Verarbeiten Sie personenbezogene Daten?', regions: '5. In welche Märkte bieten Sie Ihre Produkte oder Dienstleistungen an? (Zielmärkte)' },
        findButton: 'Ergebnisse anzeigen',
        resetButton: 'Zurücksetzen',
        reportTitle: 'Berichtsbereich',
        reportDescription: 'Nach der Analyse erscheinen hier die verpflichtenden und empfohlenen Dokumente für Ihre Zielmärkte.'
      },
      journey: { eyebrow: 'Roadmap', title: 'Erreichen Sie das richtige Dokumentenpaket strukturiert.', subtitle: 'Kernablauf von der ersten Analyse bis zur Zertifizierungsreife' },
      certificates: { eyebrow: 'Zertifikatskatalog', title: 'Beliebte Zertifikate und marktbezogene Compliance-Themen', description: 'Die Karten werden direkt aus dem Datenbestand gespeist. Wenn GitHub Actions die Daten aktualisiert, zeigt die Oberfläche die neuen Inhalte automatisch.' },
      playbooks: { eyebrow: 'Branchenleitfäden', title: 'Empfohlene Vorgehenspläne für Wachstum und Export', description: 'Nicht jede Branche braucht dasselbe Dokumentenpaket. Dieser Bereich fasst typische Marktexpansionsszenarien zusammen.' },
      resources: { eyebrow: 'Ressourcen', title: 'Schnelle Hilfen für bessere Entscheidungen', description: 'Dieser Bereich kann später mit Blogbeiträgen, Checklisten und Leitfäden weiter ausgebaut werden.' },
      faq: { eyebrow: 'FAQ', title: 'Häufig gestellte Fragen' },
      contact: {
        eyebrow: 'Professionelle Unterstützung',
        title: 'Beschleunigen Sie Ihre Zertifizierungsvorbereitung mit externer Beratung.',
        description: 'In dieser ersten Version dient das Formular nur als Demo. Nach dem Absenden wird ein Beispiel für den Angebotsprozess angezeigt. Später kann es an CRM- oder Formularsysteme angebunden werden.',
        bullet1: 'Voranalyse und Dokumenten-Roadmap',
        bullet2: 'Matching mit Beratungen und Zertifizierungsstellen',
        bullet3: 'Unterstützung bei technischer Akte und Prozessvorbereitung',
        demoVisitor: 'Besucher',
        alert: '{name}, Ihre Anfrage wurde im Demo-Modus erfasst. In der produktiven Version würde dieses Formular an ein CRM- oder Angebotssystem angebunden.',
        form: {
          name: 'Name',
          email: 'E-Mail',
          company: 'Unternehmen',
          phone: 'Telefon',
          message: 'Ihr Bedarf',
          namePlaceholder: 'Namen eingeben',
          emailPlaceholder: 'Ihre E-Mail-Adresse',
          companyPlaceholder: 'Unternehmensname',
          phonePlaceholder: '+49 ...',
          messagePlaceholder: 'Wobei benötigen Sie Unterstützung: Zertifikat oder Markteintritt?',
          submit: 'Anfrage senden'
        }
      },
      common: { required: 'Pflicht', recommended: 'Empfohlen', duration: 'Dauer', cost: 'Kosten', authority: 'Quelle', yes: 'Ja', no: 'Nein' },
      select: { sector: 'Branche wählen', employees: 'Mitarbeitendenzahl wählen', stage: 'Unternehmensphase wählen', personalData: 'Auswahl treffen' },
      regions: { globalHint: 'Nutzen Sie diese Option, wenn globale Standards zusammen mit regionalen Anforderungen betrachtet werden sollen.', marketHint: 'Hier werden Anforderungen gefiltert, die für diesen Markt gelten oder besonders relevant sind.' },
      empty: {
        assessmentTitle: 'Bitte alle Felder für die Analyse ausfüllen',
        assessmentDescription: 'Ergebnisse werden erstellt, sobald Branche, Mitarbeitendenzahl, Unternehmensphase, Datenverarbeitungsstatus und mindestens ein Zielmarkt ausgewählt sind.',
        dataTitle: 'Daten konnten nicht geladen werden',
        dataDescription: 'Die Datei data.json konnte nicht gelesen werden. Bitte prüfen Sie Pfad und JSON-Struktur.'
      },
      summary: { companyProfile: 'Unternehmensprofil', dataProcessing: 'Status der Datenverarbeitung', targetMarkets: 'Zielmärkte', personalDataYes: 'Ja, wir verarbeiten Daten', personalDataNo: 'Nein, wir verarbeiten keine Daten', dataProcessingDetail: 'Davon hängen die Datenschutzanforderungen ab.', targetMarketsDetail: 'Wenn Global ausgewählt ist, werden globale Standards und regionale Anforderungen gemeinsam bewertet.' },
      results: {
        mandatoryTitle: 'Verpflichtend benötigte Dokumente',
        mandatoryDescription: 'Themen, die aufgrund von Regulierung, Produktkonformität oder Zielmarkt-Vorgaben im Vordergrund stehen',
        mandatoryEmpty: 'Für dieses Profil ist derzeit kein direkt verpflichtendes Thema sichtbar. Eine Prüfung anhand offizieller Quellen ist dennoch empfehlenswert.',
        recommendedTitle: 'Empfohlene Dokumente',
        recommendedDescription: 'Themen mit starkem Nutzen für Professionalität, Kundenvertrauen, Export und Wachstum',
        recommendedEmpty: 'Für dieses Profil erscheinen aktuell keine Empfehlungen. Versuchen Sie es mit breiteren Branchen- oder Marktkombinationen.'
      },
      actions: {
        first: { title: '1. Prioritäten setzen', withMandatory: 'Starten Sie zuerst mit Pflicht-Themen wie {certificate} und schließen Sie regulatorische Anforderungen ab.', withoutMandatory: 'Wenn kein Pflicht-Thema erscheint, priorisieren Sie die Empfehlungen nach Kunden- und Wachstumszielen.' },
        second: { title: '2. Vorbereitungspaket aufbauen', personalData: 'Planen Sie früh Kernunterlagen wie Dateninventar, Richtlinien, Einwilligungstexte und Vertragsanhänge.', noPersonalData: 'Bauen Sie Prozessdokumentation, Rollenbeschreibungen, Risikoanalyse und Audit-Vorbereitung früh auf.' },
        third: { title: '3. Unterstützungsmodell wählen', complex: 'Wenn Sie mehrere Märkte adressieren, sparen Beratung und die passende Zertifizierungsstelle Zeit.', simple: 'Wenn Ihr erster Zertifizierungsumfang begrenzt ist, können Sie auch mit internem Team plus externem Audit starten.' }
      },
      status: { waiting: 'Warten auf lokale Speicherung', updated: 'Lokale Speicherung aktualisiert', loaded: 'Lokale Speicherung geladen', cleared: 'Lokale Speicherung gelöscht', error: 'Fehler beim Laden der Daten' },
      footer: { meta: 'Letzte Aktualisierung {date} · {email}' }
    }
  },
  data: {
    en: {
      meta: {
        description: 'A guide to certificates, compliance, and target-market requirements for newly founded companies and growing SMEs.',
        disclaimer: 'CertiRehber is an informational decision-support platform. Final suitability, certification, and legal requirements should be confirmed with the relevant official authorities and accredited certification bodies.'
      },
      stats: ['Core compliance topics tracked', 'Sector-focused scenarios', 'Target market regions', 'Fast assessment time'],
      filters: {
        sectors: {
          'Teknoloji / Yazılım': 'Technology / Software',
          'E-Ticaret': 'E-commerce',
          'Üretim / Sanayi': 'Manufacturing / Industry',
          'Sağlık': 'Healthcare',
          'Gıda': 'Food',
          'Lojistik / Taşımacılık': 'Logistics / Transportation',
          'Danışmanlık / Hizmet': 'Consulting / Services',
          'İnşaat': 'Construction',
          'Diğer': 'Other'
        },
        employeeRanges: { '1-9': '1-9 employees', '10-49': '10-49 employees', '50-249': '50-249 employees', '250+': '250+ employees' },
        businessStages: { new: 'Newly founded', growth: '3-5 years / growing', scaling: 'Scaling / enterprise-focused' },
        regions: { Turkiye: 'Turkey only', Avrupa: 'European Union (EU)', Amerika: 'United States (US)', Asya: 'Asia / China', Global: 'Worldwide (Global)' }
      },
      journey: [
        { title: 'Clarify your company profile', description: 'Your sector, team size, company stage, and data-processing model determine your baseline certification needs.' },
        { title: 'Mark your target markets', description: 'Turkey, Europe, America, Asia, or global expansion goals directly affect the mandatory regulations and document set.' },
        { title: 'Separate mandatory and recommended items', description: 'Legal obligations and recommendation-driven documents for customers, tenders, investment, and export should be managed together but prioritized differently.' },
        { title: 'Plan the readiness package', description: 'Manage certification readiness with policies, process documents, training plans, technical files, and a responsibility matrix.' }
      ],
      certificates: {
        kvkk: { name: 'Turkish PDPL Compliance Program', category: 'Legal Compliance', summary: 'A core compliance structure for companies processing personal data in Turkey, covering notices, consent, data inventory, retention, and disposal processes.', estimatedTimeline: '2-8 weeks', estimatedCost: 'Varies by company structure', issuingAuthority: 'Turkish DPA / applicable legislation', officialHint: 'It should be assessed together with VERBIS obligations, privacy notices, processing inventory, and retention-destruction policies.' },
        gdpr: { name: 'GDPR Compliance Framework', category: 'Data Protection', summary: 'Defines data-protection, consent, data-subject rights, and cross-border processing obligations for companies handling the personal data of EU residents.', estimatedTimeline: '4-12 weeks', estimatedCost: 'Medium to high', issuingAuthority: 'EU data protection authorities / applicable legislation', officialHint: 'Companies selling into Europe or serving individuals in the EU may also face country-specific obligations.' },
        pipl: { name: 'PIPL Compliance Requirements', category: 'Data Protection', summary: 'Includes strict data-protection and cross-border transfer requirements for companies processing personal data in China or offering digital products and services into the Chinese market.', estimatedTimeline: '6-14 weeks', estimatedCost: 'Medium to high', issuingAuthority: 'Chinese data protection regulations', officialHint: 'Chinese data localization and security-assessment requirements should be reviewed separately.' },
        ccpa: { name: 'CCPA / CPRA Compliance Program', category: 'Data Protection', summary: 'Defines privacy, disclosure, and consumer-request handling obligations for companies serving California consumers and meeting certain thresholds.', estimatedTimeline: '4-10 weeks', estimatedCost: 'Medium', issuingAuthority: 'California Privacy Protection Agency / applicable legislation', officialHint: 'Because privacy laws vary across U.S. states, additional state-by-state analysis is often needed.' },
        ce: { name: 'CE Mark / CE Conformity Process', category: 'Product Compliance', summary: 'Refers to the conformity marking and technical-file process required to place products covered by Turkish and European technical regulations on the market.', estimatedTimeline: '3-12 weeks', estimatedCost: 'Varies by product class', issuingAuthority: 'Relevant technical regulation / notified body', officialHint: 'Requirements differ by product group; testing, technical documentation, labeling, and declaration steps must be handled together.' },
        fda: { name: 'FDA Approval / FDA Compliance Process', category: 'Regulated Market Entry', summary: 'Covers the registrations, filings, testing, and notification processes needed for market access in the U.S. across certain healthcare, medical device, cosmetic, and food categories.', estimatedTimeline: '6-20 weeks', estimatedCost: 'Varies by product class', issuingAuthority: 'U.S. Food and Drug Administration', officialHint: 'Depending on the product class, 510(k), establishment registration, labeling, or facility obligations may differ.' },
        ccc: { name: 'CCC Certificate', category: 'Product Compliance', summary: 'Mandatory product certification for certain product categories in China, covering testing, factory inspection, and labeling processes.', estimatedTimeline: '8-18 weeks', estimatedCost: 'Medium to high', issuingAuthority: 'China Compulsory Certification', officialHint: 'Pre-validation is critical because product classification and customs-code matching drive the obligation.' },
        'iso-27001': { name: 'ISO 27001 Information Security Management System', category: 'Information Security', summary: 'Stands out for managing information assets on a risk basis, building enterprise customer trust, and demonstrating security maturity in global sales cycles.', estimatedTimeline: '6-16 weeks', estimatedCost: 'Medium to high', issuingAuthority: 'Accredited certification body', officialHint: 'Especially for SaaS, software, and data-intensive service companies, it can shorten the sales cycle.' },
        'iso-9001': { name: 'ISO 9001 Quality Management System', category: 'Quality', summary: 'One of the most common management-system certifications for process standardization, operational maturity, and tender or enterprise-customer qualification.', estimatedTimeline: '4-12 weeks', estimatedCost: 'Low to medium', issuingAuthority: 'Accredited certification body', officialHint: 'It should be considered as a foundational maturity certificate in almost every growing sector.' },
        'iso-22000': { name: 'ISO 22000 Food Safety Management System', category: 'Food Safety', summary: 'A critical system for controlling hazards in the food chain, ensuring traceability, and managing hygiene.', estimatedTimeline: '6-14 weeks', estimatedCost: 'Medium', issuingAuthority: 'Accredited certification body', officialHint: 'Provides customer confidence and audit readiness for food production, storage, and supply-chain operations.' },
        'iso-13485': { name: 'ISO 13485 Medical Device Quality Management System', category: 'Healthcare & Regulated Industry', summary: 'A strong reference framework for quality, traceability, and regulatory compliance in medical-device manufacturing and related supply chains.', estimatedTimeline: '8-18 weeks', estimatedCost: 'Medium to high', issuingAuthority: 'Accredited certification body', officialHint: 'It should be evaluated together with additional regulations depending on device class and target market.' }
      },
      playbooks: {
        'Teknoloji / Yazılım': { headline: 'Market-entry playbook for SaaS and software companies', summary: 'For software teams starting in Turkey and aiming to sell into Europe and the U.S., the first step is usually a strong privacy and security foundation.', recommendedCertificates: ['Turkish PDPL Compliance Program', 'GDPR Compliance Framework', 'CCPA / CPRA Compliance Program', 'ISO 27001 Information Security Management System', 'ISO 9001 Quality Management System'] },
        'E-Ticaret': { headline: 'Compliance setup for multi-market e-commerce growth', summary: 'For e-commerce companies, data privacy, consumer-data handling, operational quality, and market-specific privacy notices are especially important.', recommendedCertificates: ['Turkish PDPL Compliance Program', 'GDPR Compliance Framework', 'CCPA / CPRA Compliance Program', 'ISO 27001 Information Security Management System'] },
        'Üretim / Sanayi': { headline: 'Export and conformity starter pack for manufacturers', summary: 'In manufacturing, CE, FDA, or CCC requirements should be planned together with quality systems based on the target market.', recommendedCertificates: ['CE Mark / CE Conformity Process', 'FDA Approval / FDA Compliance Process', 'CCC Certificate', 'ISO 9001 Quality Management System'] },
        'Sağlık': { headline: 'Regulatory readiness for healthcare and medical companies', summary: 'In healthcare, data protection, product safety, quality systems, and target-market filings should be managed together.', recommendedCertificates: ['Turkish PDPL Compliance Program', 'GDPR Compliance Framework', 'FDA Approval / FDA Compliance Process', 'ISO 13485 Medical Device Quality Management System'] }
      },
      resources: [
        { title: 'Target-market document selection checklist', type: 'Checklist', description: 'A quick-start checklist that simplifies certificate decision logic for Turkey, Europe, the U.S., and China.' },
        { title: 'KVKK and GDPR starter differences', type: 'Comparison Guide', description: 'Summarizes the main differences between Turkish and European data-protection obligations in scope, rights, and operations.' },
        { title: 'CE, FDA, and CCC product conformity comparison', type: 'Market Entry Guide', description: 'Lists the first topics manufacturers should review for product conformity in Europe, the U.S., and China.' },
        { title: 'ISO prep pack for enterprise sales', type: 'Preparation Guide', description: 'Offers process, policy, responsibility-matrix, and pre-audit gap guidance for ISO 9001 and ISO 27001 readiness.' }
      ],
      faq: [
        { question: 'Which documents should a newly founded company start with?', answer: 'It depends on your sector, whether you process personal data, and your first target market. In general, data-processing companies start with KVKK or GDPR, while teams targeting enterprise sales often prioritize ISO 9001 and ISO 27001.' },
        { question: 'What should I do if I sell to more than one country?', answer: 'You should assess all target markets together. For regions such as Europe, the U.S., and China, regional regulations and global ISO standards usually sit on the same roadmap.' },
        { question: 'What does the Global option mean?', answer: 'The Global option assumes the company plans to expand into multiple markets. In that case, the system recommends globally recognized ISO certifications together with regional regulations relevant to the selected sector.' },
        { question: 'Do these results replace official consulting?', answer: 'No. CertiRehber provides pre-assessment and decision support. Final applications and conformity analysis should be validated with official institutions, legal advisors, and accredited certification bodies.' }
      ]
    },
    de: {
      meta: {
        description: 'Ein Leitfaden zu Zertifikaten, Compliance und Zielmarkt-Anforderungen für neu gegründete Unternehmen und wachsende KMU.',
        disclaimer: 'CertiRehber ist eine Informations- und Entscheidungshilfe. Endgültige Eignung, Zertifizierung und rechtliche Anforderungen sollten mit den zuständigen Behörden und akkreditierten Zertifizierungsstellen abgestimmt werden.'
      },
      stats: ['Verfolgte Compliance-Kernthemen', 'Branchenszenarien im Fokus', 'Zielmarkt-Regionen', 'Schnelle Analysedauer'],
      filters: {
        sectors: {
          'Teknoloji / Yazılım': 'Technologie / Software',
          'E-Ticaret': 'E-Commerce',
          'Üretim / Sanayi': 'Fertigung / Industrie',
          'Sağlık': 'Gesundheitswesen',
          'Gıda': 'Lebensmittel',
          'Lojistik / Taşımacılık': 'Logistik / Transport',
          'Danışmanlık / Hizmet': 'Beratung / Dienstleistungen',
          'İnşaat': 'Bauwesen',
          'Diğer': 'Sonstige'
        },
        employeeRanges: { '1-9': '1-9 Mitarbeitende', '10-49': '10-49 Mitarbeitende', '50-249': '50-249 Mitarbeitende', '250+': '250+ Mitarbeitende' },
        businessStages: { new: 'Neu gegründet', growth: '3-5 Jahre / wachsend', scaling: 'Skalierend / auf Großkunden ausgerichtet' },
        regions: { Turkiye: 'Nur Türkei', Avrupa: 'Europäische Union (EU)', Amerika: 'Vereinigte Staaten (USA)', Asya: 'Asien / China', Global: 'Weltweit (Global)' }
      },
      journey: [
        { title: 'Unternehmensprofil schärfen', description: 'Branche, Teamgröße, Unternehmensphase und Datenverarbeitung bestimmen den grundlegenden Zertifizierungsbedarf.' },
        { title: 'Zielmärkte markieren', description: 'Ob Türkei, Europa, Amerika, Asien oder globales Wachstum: Die Wahl beeinflusst direkt Pflichtvorgaben und Dokumentenpaket.' },
        { title: 'Pflicht und Empfehlung trennen', description: 'Rechtliche Verpflichtungen und empfohlene Nachweise für Kunden, Ausschreibungen, Investitionen und Export sollten gemeinsam, aber mit unterschiedlicher Priorität gemanagt werden.' },
        { title: 'Vorbereitungspaket planen', description: 'Steuern Sie die Zertifizierungsreife mit Richtlinien, Prozessdokumenten, Trainingsplänen, technischer Akte und Verantwortungsmatrix.' }
      ],
      certificates: {
        kvkk: { name: 'Türkisches Datenschutz-Compliance-Programm', category: 'Rechtliche Compliance', summary: 'Ein grundlegendes Compliance-Programm für Unternehmen, die in der Türkei personenbezogene Daten verarbeiten, einschließlich Informationspflichten, Einwilligungen, Dateninventar, Aufbewahrung und Löschung.', estimatedTimeline: '2-8 Wochen', estimatedCost: 'Abhängig von der Unternehmensstruktur', issuingAuthority: 'Türkische Datenschutzbehörde / einschlägige Gesetzgebung', officialHint: 'Es sollte zusammen mit VERBIS-Pflichten, Datenschutzhinweisen, Verarbeitungsverzeichnis sowie Aufbewahrungs- und Löschrichtlinien bewertet werden.' },
        gdpr: { name: 'DSGVO-Compliance-Rahmen', category: 'Datenschutz', summary: 'Regelt Datenschutz, Einwilligungen, Rechte betroffener Personen und grenzüberschreitende Verarbeitung für Unternehmen, die personenbezogene Daten von EU-Bürgern verarbeiten.', estimatedTimeline: '4-12 Wochen', estimatedCost: 'Mittel bis hoch', issuingAuthority: 'EU-Datenschutzbehörden / einschlägige Gesetzgebung', officialHint: 'Unternehmen mit Vertrieb in Europa oder Leistungen für Personen in der EU können zusätzlich länderspezifische Pflichten haben.' },
        pipl: { name: 'PIPL-Compliance-Anforderungen', category: 'Datenschutz', summary: 'Umfasst strenge Datenschutz- und grenzüberschreitende Transferanforderungen für Unternehmen, die in China personenbezogene Daten verarbeiten oder digitale Produkte und Dienste in den chinesischen Markt anbieten.', estimatedTimeline: '6-14 Wochen', estimatedCost: 'Mittel bis hoch', issuingAuthority: 'Chinesische Datenschutzvorgaben', officialHint: 'Anforderungen zu Datenlokalisierung und Sicherheitsbewertung in China sollten gesondert geprüft werden.' },
        ccpa: { name: 'CCPA / CPRA-Compliance-Programm', category: 'Datenschutz', summary: 'Definiert Datenschutz-, Offenlegungs- und Verbraucherrechte-Pflichten für Unternehmen, die Verbraucher in Kalifornien bedienen und bestimmte Schwellenwerte erreichen.', estimatedTimeline: '4-10 Wochen', estimatedCost: 'Mittel', issuingAuthority: 'California Privacy Protection Agency / einschlägige Gesetzgebung', officialHint: 'Da sich Datenschutzgesetze zwischen US-Bundesstaaten unterscheiden, ist oft eine zusätzliche bundesstaatliche Analyse nötig.' },
        ce: { name: 'CE-Kennzeichnung / CE-Konformitätsprozess', category: 'Produktkonformität', summary: 'Bezeichnet den Konformitätskennzeichnungs- und technischen Dossierprozess, der für Produkte unter türkischen und europäischen technischen Vorschriften erforderlich ist.', estimatedTimeline: '3-12 Wochen', estimatedCost: 'Abhängig von der Produktklasse', issuingAuthority: 'Einschlägige technische Vorschrift / benannte Stelle', officialHint: 'Die Anforderungen unterscheiden sich je nach Produktgruppe; Prüfungen, technische Dokumentation, Kennzeichnung und Erklärungen müssen zusammen betrachtet werden.' },
        fda: { name: 'FDA-Zulassung / FDA-Compliance-Prozess', category: 'Regulierter Markteintritt', summary: 'Umfasst Registrierungen, Einreichungen, Prüfungen und Meldungen, die für den Markteintritt in den USA in bestimmten Gesundheits-, Medizinprodukte-, Kosmetik- und Lebensmittelkategorien erforderlich sind.', estimatedTimeline: '6-20 Wochen', estimatedCost: 'Abhängig von der Produktklasse', issuingAuthority: 'U.S. Food and Drug Administration', officialHint: 'Je nach Produktklasse unterscheiden sich 510(k)-Pflichten, Registrierungen, Kennzeichnung oder Standortanforderungen.' },
        ccc: { name: 'CCC-Zertifikat', category: 'Produktkonformität', summary: 'Pflichtzertifizierung für bestimmte Produktkategorien in China, einschließlich Prüfung, Werksaudit und Kennzeichnung.', estimatedTimeline: '8-18 Wochen', estimatedCost: 'Mittel bis hoch', issuingAuthority: 'China Compulsory Certification', officialHint: 'Eine Vorprüfung ist entscheidend, da Produktklassifizierung und Zolltarifzuordnung die Pflicht auslösen.' },
        'iso-27001': { name: 'ISO 27001 Informationssicherheits-Managementsystem', category: 'Informationssicherheit', summary: 'Wichtig für die risikobasierte Steuerung von Informationswerten, den Aufbau von Vertrauen bei Unternehmenskunden und den Nachweis von Sicherheitsreife in globalen Vertriebsprozessen.', estimatedTimeline: '6-16 Wochen', estimatedCost: 'Mittel bis hoch', issuingAuthority: 'Akkreditierte Zertifizierungsstelle', officialHint: 'Vor allem für SaaS-, Software- und datenintensive Dienstleistungsunternehmen kann es den Vertriebszyklus verkürzen.' },
        'iso-9001': { name: 'ISO 9001 Qualitätsmanagementsystem', category: 'Qualität', summary: 'Eines der am weitesten verbreiteten Managementsystem-Zertifikate für Prozessstandardisierung, operative Reife und Eignung für Ausschreibungen oder Unternehmenskunden.', estimatedTimeline: '4-12 Wochen', estimatedCost: 'Niedrig bis mittel', issuingAuthority: 'Akkreditierte Zertifizierungsstelle', officialHint: 'Es sollte in fast jeder wachsenden Branche als grundlegender Reife-Nachweis betrachtet werden.' },
        'iso-22000': { name: 'ISO 22000 Lebensmittelsicherheits-Managementsystem', category: 'Lebensmittelsicherheit', summary: 'Ein kritisches System zur Beherrschung von Gefahren in der Lebensmittelkette, zur Rückverfolgbarkeit und zum Hygienemanagement.', estimatedTimeline: '6-14 Wochen', estimatedCost: 'Mittel', issuingAuthority: 'Akkreditierte Zertifizierungsstelle', officialHint: 'Bietet Kundenvertrauen und Audit-Bereitschaft in Produktion, Lagerung und Lieferkette von Lebensmitteln.' },
        'iso-13485': { name: 'ISO 13485 Qualitätsmanagementsystem für Medizinprodukte', category: 'Gesundheit & regulierte Industrie', summary: 'Ein starker Referenzrahmen für Qualität, Rückverfolgbarkeit und regulatorische Konformität in der Herstellung von Medizinprodukten und zugehörigen Lieferketten.', estimatedTimeline: '8-18 Wochen', estimatedCost: 'Mittel bis hoch', issuingAuthority: 'Akkreditierte Zertifizierungsstelle', officialHint: 'Es sollte zusammen mit weiteren Vorgaben je nach Produktklasse und Zielmarkt bewertet werden.' }
      },
      playbooks: {
        'Teknoloji / Yazılım': { headline: 'Markteintritts-Playbook für SaaS- und Softwareunternehmen', summary: 'Für Softwareteams, die in der Türkei starten und nach Europa oder in die USA verkaufen möchten, steht meist zunächst ein belastbares Datenschutz- und Sicherheitsfundament im Vordergrund.', recommendedCertificates: ['Türkisches Datenschutz-Compliance-Programm', 'DSGVO-Compliance-Rahmen', 'CCPA / CPRA-Compliance-Programm', 'ISO 27001 Informationssicherheits-Managementsystem', 'ISO 9001 Qualitätsmanagementsystem'] },
        'E-Ticaret': { headline: 'Compliance-Aufbau für E-Commerce-Wachstum in mehreren Märkten', summary: 'Für E-Commerce-Unternehmen sind Datenschutz, Verarbeitung von Kundendaten, operative Qualität und marktspezifische Datenschutzhinweise besonders wichtig.', recommendedCertificates: ['Türkisches Datenschutz-Compliance-Programm', 'DSGVO-Compliance-Rahmen', 'CCPA / CPRA-Compliance-Programm', 'ISO 27001 Informationssicherheits-Managementsystem'] },
        'Üretim / Sanayi': { headline: 'Export- und Konformitäts-Starterpaket für Hersteller', summary: 'In der Fertigung sollten CE-, FDA- oder CCC-Anforderungen gemeinsam mit Qualitätssystemen entsprechend dem Zielmarkt geplant werden.', recommendedCertificates: ['CE-Kennzeichnung / CE-Konformitätsprozess', 'FDA-Zulassung / FDA-Compliance-Prozess', 'CCC-Zertifikat', 'ISO 9001 Qualitätsmanagementsystem'] },
        'Sağlık': { headline: 'Regulatorische Vorbereitung für Gesundheits- und Medizintechnikunternehmen', summary: 'Im Gesundheitsbereich müssen Datenschutz, Produktsicherheit, Qualitätssysteme und zielmarktspezifische Zulassungen zusammen gesteuert werden.', recommendedCertificates: ['Türkisches Datenschutz-Compliance-Programm', 'DSGVO-Compliance-Rahmen', 'FDA-Zulassung / FDA-Compliance-Prozess', 'ISO 13485 Qualitätsmanagementsystem für Medizinprodukte'] }
      },
      resources: [
        { title: 'Checkliste zur Dokumentenauswahl nach Zielmarkt', type: 'Checkliste', description: 'Eine Schnellstart-Checkliste, die die Zertifikatslogik für Türkei, Europa, USA und China vereinfacht.' },
        { title: 'Einstiegsunterschiede zwischen KVKK und DSGVO', type: 'Vergleichsleitfaden', description: 'Fasst die wichtigsten Unterschiede zwischen türkischen und europäischen Datenschutzpflichten bei Umfang, Rechten und Betrieb zusammen.' },
        { title: 'Vergleich der Produktkonformität: CE, FDA und CCC', type: 'Markteintrittsleitfaden', description: 'Listet die ersten Prüfpunkte für Hersteller zur Produktkonformität in Europa, den USA und China auf.' },
        { title: 'ISO-Vorbereitungspaket für Enterprise-Sales', type: 'Vorbereitungsleitfaden', description: 'Bietet Hinweise zu Prozessen, Richtlinien, Verantwortungsmatrix und Audit-Lücken für ISO 9001 und ISO 27001.' }
      ],
      faq: [
        { question: 'Mit welchen Dokumenten sollte ein neu gegründetes Unternehmen starten?', answer: 'Das hängt von Ihrer Branche, der Verarbeitung personenbezogener Daten und dem ersten Zielmarkt ab. Unternehmen mit Datenverarbeitung beginnen häufig mit KVKK oder DSGVO, Teams mit Fokus auf Unternehmenskunden priorisieren oft ISO 9001 und ISO 27001.' },
        { question: 'Was sollte ich tun, wenn ich in mehr als ein Land verkaufe?', answer: 'Sie sollten alle Zielmärkte gemeinsam bewerten. Für Regionen wie Europa, USA und China gehören regionale Vorgaben und globale ISO-Standards meist in dieselbe Roadmap.' },
        { question: 'Was bedeutet die Option Global?', answer: 'Die Option Global geht davon aus, dass das Unternehmen in mehrere Märkte expandieren möchte. Dann empfiehlt das System global anerkannte ISO-Zertifikate zusammen mit branchenrelevanten regionalen Vorgaben.' },
        { question: 'Ersetzen diese Ergebnisse eine offizielle Beratung?', answer: 'Nein. CertiRehber bietet Voranalyse und Entscheidungshilfe. Endgültige Anträge und Konformitätsbewertungen sollten mit Behörden, Rechtsberatung und akkreditierten Zertifizierungsstellen abgestimmt werden.' }
      ]
    }
  }
};
