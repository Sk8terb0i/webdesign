import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      // --- General UI ---
      brand: "Eon Web & Streaming",
      tagline: "A simple, good looking solution without any monthly costs",
      verticalText: "Modern. Simple. Yours.",
      drag_explore: "Drag to explore",
      about_me: "about me",
      contact_me: "contact",
      examples: "Examples",
      details: "Details",
      get_in_touch: "Get in touch",
      optional: "optional",
      step: "step",
      button_next: "next step",
      button_back: "go back",

      // --- About Section ---
      about_text:
        "I am Noe Arnold, a web designer and streaming technician based in Switzerland, focused on clean, high-performance solutions without the headache of monthly subscriptions.",

      // --- Technical Lists ---
      web_technical: "Technical",
      web_p1: "A responsive site that looks great on all devices",
      web_p2: "Built with modern tools",
      web_p3: "Hosted for free on GitHub",
      web_p4: "Custom domain as the only recurring cost (~10-20 CHF/year)",
      web_p6:
        "Easy to use admin panel to update website info without having to code",
      web_p7:
        "A clear handover guide so you can maintain and edit the site yourself",
      web_p8: "Optional maintenance by me if you don’t want to touch any code",

      stream_technical: "Technical",
      stream_p1:
        "Streaming on popular platforms (YouTube, Twitch, Instagram etc.)",
      stream_p2: "Clean stable set up",
      stream_p3: "All costs upfront",
      stream_p4: "I handle the technical setup during the event",
      stream_p5:
        "Optional post processing (short edits for Reels, full recording etc.)",

      // --- Common Form Elements ---
      form_subtitle:
        "tell me a bit about your idea so we can start a conversation.",
      form_name_label: "Name",
      form_contact_placeholder: "Email address or phone number",
      form_channel_chat: "Messaging app",
      form_channel_email: "Email",
      form_channel_call: "Phone call",
      form_details: "Tell me more about your idea...",
      form_submit: "Send inquiry",
      form_success_title: "Thank you!",
      form_success_body:
        "Your inquiry has been sent. I will get back to you soon.",
      form_error_required: "Please complete all required steps first.",
      get_in_touch_out: "How can I reach you?",

      // --- Web Inquiry Form ---
      form_title_web: "Inquiry Web Design",
      section_1: "What are we building?",
      section_2: "Features & Functions",
      section_3: "Content & Assets",
      section_4: "Hosting",
      section_level: "Choose your path",
      form_scope_new: "A brand new website",
      form_scope_redesign: "Redesign an existing site",
      form_scope_landing: "A simple landing page",
      form_scope_landing_note:
        "Note: A landing page is limited to one single page to maximize conversion. If you need a navigation menu with sub-pages (e.g., About, Services, Blog), please select 'A brand new website' instead.",
      form_pages_label: "How many pages approximately?",
      form_pages_single: "1 page",
      form_pages_range: "2-5 pages",
      form_feat_shop_c: "Custom shop system",
      form_feat_shop_e: "External shop (Stripe/Shopify)",
      form_feat_admin: "Edit text/images myself (Admin Panel)",
      form_feat_lang: "Multiple languages",
      form_lang_count: "How many additional languages?",
      form_lang_service: "Should I handle the translation of the content?",
      form_lang_service_yes: "Yes, I need translation",
      form_lang_service_no: "No, I will provide the translated text",
      form_feat_book: "Appointment booking",
      form_feat_login: "User accounts / login system",
      form_feat_api: "Social media feeds / third-party tools",
      form_assets_ready: "I have a logo & brand guide",
      form_assets_need: "I need a visual identity created",
      form_copy_provide: "I will provide all content",
      form_copy_need: "I need help with copywriting/photos",
      form_style_label: "Visual style (minimal, bold, playful...)",
      form_style_placeholder: "e.g. clean, dark mode, high contrast...",
      form_host_free: "Free hosting (GitHub) — no monthly fees",
      form_host_ext: "My own server / external provider",
      level_basic: "Basic",
      level_premium: "Premium",
      level_horse: "Horse",
      level_basic_desc: "Solid, clean, and functional.",
      level_premium_desc: "Custom polish, animations, and refined UX.",
      level_horse_desc: "High-end, fully custom, and maximum performance.",
      level_premium_hint: "Recommended",
      recommended_path: "Best balance of performance & design",
      select_this_plan: "Select this plan",
      free_consultation_note:
        "The initial consultation is free if you book the project; otherwise, it is billed at 100 CHF/hour.",
      form_price_disclaimer:
        "This is a non-binding estimate. Final pricing is determined after our initial consultation.",

      // --- Stream Inquiry Form ---
      form_title_stream: "Inquiry Live Streaming",
      section_stream_core: "Production Scope",
      section_stream_infra: "Streaming Infrastructure",
      section_stream_extras: "Add-ons & Post-Production",
      form_stream_days: "Duration (Days)",
      form_stream_cams: "Camera Count",
      form_stream_cams_hint:
        "3+ cameras include an assistant technician (+400 CHF).",
      form_stream_type: "Production Type",
      form_stream_type_local: "One-sided (Local event to Web)",
      form_stream_type_remote: "Double-sided (Remote guests/Interviews)",
      form_stream_dest: "Destinations",
      form_stream_dest_single: "Single Platform (e.g. YouTube)",
      form_stream_dest_multi: "Multi-streaming",
      form_stream_platforms_count:
        "Total platforms (e.g., YouTube + Twitch = 2)",
      form_stream_rec: "Recording",
      form_stream_rec_none: "Access to internal stream recording",
      form_stream_rec_local: "High-quality local storage backup",
      form_stream_overlay: "Graphics & Overlays",
      form_stream_overlay_none: "No graphics",
      form_stream_overlay_basic: "Basic (Lower thirds/Logo)",
      form_stream_overlay_custom: "Full Custom Branding (Overlays/Intros)",
      form_stream_edits: "Post-Event Edits",
      form_stream_edits_none: "None",
      form_stream_edits_reel: "Highlight Reel",
      form_total_estimate: "Estimated Production Total",

      // --- General/Contact Form (New) ---
      message_label: "Your message",
      message_placeholder: "Tell me about your project or ask a question...",
      form_skip_to_call: "I'd rather have a phone call",
      form_phone_label: "Phone number",
      form_message_label: "Anything I should know before we call?",
      direct_contact: "direct inquiry",
      back_to_form: "back to form",

      cv_label: "experience",
      cv_file: "Curriculum vitae",
    },
  },
  de: {
    translation: {
      // --- General UI ---
      brand: "Eon Web & Streaming",
      tagline: "Eine einfache, gut aussehende Lösung ohne monatliche Kosten",
      verticalText: "Modern. Einfach. Deins.",
      drag_explore: "Maus gedrückt halten und erkunden",
      about_me: "über mich",
      contact_me: "kontakt",
      examples: "Beispiele",
      details: "Details",
      get_in_touch: "Schreib mir",
      optional: "optional",
      step: "Schritt",
      button_next: "nächster Schritt",
      button_back: "zurück",

      // --- About Section ---
      about_text:
        "Ich bin Noe Arnold ein Webdesigner und Streaming-Techniker aus der Schweiz, spezialisiert auf performante Lösungen ohne monatliche Abonnements.",

      // --- Technical Lists ---
      web_technical: "Technisches",
      web_p1: "Eine responsive Seite, die auf allen Geräten gut aussieht",
      web_p2: "Erstellt mit modernen Tools",
      web_p3: "Kostenloses Hosting auf GitHub",
      web_p4: "Eigene Domain als einzige Fixkosten (~10-20 CHF/Jahr)",
      web_p6: "Einfaches Admin-Panel für Inhalte ohne Programmierkenntnisse",
      web_p7: "Ein klarer Übergabeguide zur eigenständigen Verwaltung",
      web_p8: "Optionale Wartung durch mich",

      stream_technical: "Technisches",
      stream_p1:
        "Streaming auf gängigen Plattformen (YouTube, Twitch, Instagram etc.)",
      stream_p2: "Sauberes, stabiles Setup",
      stream_p3: "Alle Kosten im Voraus",
      stream_p4: "Ich übernehme das technische Setup während des Events",
      stream_p5: "Optionale Nachbearbeitung (Reels, komplette Aufnahme etc.)",

      // --- Common Form Elements ---
      form_subtitle: "erzähl mir ein wenig von deiner Idee.",
      form_name_label: "Name",
      form_contact_placeholder: "E-Mail-Adresse oder Telefonnummer",
      form_channel_chat: "Messenger App",
      form_channel_email: "E-Mail",
      form_channel_call: "Anruf",
      form_details: "Erzähl mir mehr über deine Idee...",
      form_submit: "Anfrage senden",
      form_success_title: "Vielen Dank!",
      form_success_body:
        "Deine Anfrage wurde gesendet. Ich melde mich bald bei dir.",
      form_error_required:
        "Bitte fülle zuerst alle erforderlichen Schritte aus.",
      get_in_touch_out: "Wie erreiche ich dich?",

      // --- Web Inquiry Form ---
      form_title_web: "Offertenanfrage Webdesign",
      section_1: "Was bauen wir?",
      section_2: "Funktionen",
      section_3: "Inhalte & Design",
      section_4: "Hosting",
      section_level: "Wähle deinen Pfad",
      form_scope_new: "Eine ganz neue Website",
      form_scope_redesign: "Eine bestehende Seite umdesignen",
      form_scope_landing: "Eine einfache Einstiegseite (Landingpage)",
      form_scope_landing_note:
        "Hinweis: Eine Landingpage ist auf eine einzige Seite beschränkt, um die Conversion zu maximieren. Wenn du ein Navigationsmenü mit Unterseiten benötigst (z. B. Über mich, Leistungen, Blog), wähle bitte stattdessen 'Eine ganz neue Website'.",
      form_pages_label: "Wie viele Seiten planst du etwa?",
      form_pages_single: "1 Seite",
      form_pages_range: "2-5 Seiten",
      form_feat_shop_c: "Eigenes Shopsystem",
      form_feat_shop_e: "Externer Shop (Stripe/Shopify)",
      form_feat_admin: "Inhalte selbst bearbeiten (Admin Panel)",
      form_feat_lang: "Mehrere Sprachen",
      form_lang_count: "Wie viele zusätzliche Sprachen?",
      form_lang_service: "Soll ich die Übersetzung der Inhalte übernehmen?",
      form_lang_service_yes: "Ja, ich benötige eine Übersetzung",
      form_lang_service_no: "Nein, ich liefere die fertigen Texte",
      form_feat_book: "Termine buchen",
      form_feat_login: "Mitgliederbereich / Login-System",
      form_feat_api: "Social Media Feeds / externe Tools",
      form_assets_ready: "Logo & Markenguide vorhanden",
      form_assets_need: "Visuelle Identität muss erstellt werden",
      form_copy_provide: "Ich liefere alle Inhalte",
      form_copy_need: "Brauche Hilfe bei Texten/Fotos",
      form_style_label: "Visueller Stil (Minimal, stark, verspielt...)",
      form_style_placeholder: "z.B. sauber, Dark-Mode, hoher Kontrast...",
      form_host_free: "Kostenloses Hosting (GitHub) — keine Fixkosten",
      form_host_ext: "Eigener Server / externer Anbieter",
      level_basic: "Basic",
      level_premium: "Premium",
      level_horse: "Horse",
      level_basic_desc: "Solide, sauber und funktional.",
      level_premium_desc:
        "Individueller Schliff, Animationen und verfeinerte UX.",
      level_horse_desc: "High-end, individuell und maximale Performance.",
      level_premium_hint: "Empfohlen",
      recommended_path: "Beste Balance zwischen Leistung & Design",
      select_this_plan: "Diesen Plan wählen",
      free_consultation_note:
        "Das Erstgespräch ist bei einer Auftragserteilung kostenlos, ansonsten wird es mit 100 CHF/Std. verrechnet.",
      form_price_disclaimer:
        "Dies ist eine unverbindliche Schätzung. Der endgültige Preis wird nach unserem Gespräch festgelegt.",

      // --- Stream Inquiry Form ---
      form_title_stream: "Offertenanfrage Live Streaming",
      section_stream_core: "Produktionsumfang",
      section_stream_infra: "Streaming Infrastruktur",
      section_stream_extras: "Add-ons & Post-Produktion",
      form_stream_days: "Dauer (Tage)",
      form_stream_cams: "Anzahl Kameras",
      form_stream_cams_hint:
        "Ab 3 Kameras ist ein technischer Assistent dabei (+400 CHF).",
      form_stream_type: "Produktionsart",
      form_stream_type_local: "Einseitig (Event ins Web streamen)",
      form_stream_type_remote: "Zweiseitig (Remote-Gäste/Interviews)",
      form_stream_dest: "Plattformen",
      form_stream_dest_single: "Einzelne Plattform (z.B. YouTube)",
      form_stream_dest_multi: "Multi-streaming",
      form_stream_platforms_count:
        "Anzahl Plattformen (z.B. YouTube + Twitch = 2)",
      form_stream_rec: "Aufnahme",
      form_stream_rec_none: "Zugriff auf interne Stream-Aufnahme",
      form_stream_rec_local: "Hochwertiges lokales Backup-Storage",
      form_stream_overlay: "Grafiken & Overlays",
      form_stream_overlay_none: "Keine Grafiken",
      form_stream_overlay_basic: "Einfach (Bauchbinden/Logo)",
      form_stream_overlay_custom: "Vollständiges Branding (Overlays/Intros)",
      form_stream_edits: "Nachbearbeitung",
      form_stream_edits_none: "Keine",
      form_stream_edits_reel: "Highlight Reel",
      form_total_estimate: "Geschätztes Produktionstotal",

      // --- General/Contact Form (New) ---
      message_label: "Deine Nachricht",
      message_placeholder:
        "Erzähl mir von deinem Projekt oder stell eine Frage...",
      form_skip_to_call: "Ich möchte lieber direkt telefonieren",
      form_phone_label: "Telefonnummer",
      form_message_label: "Gibt es etwas, das ich vorab wissen sollte?",
      direct_contact: "Direktanfrage",
      back_to_form: "Zurück zum Formular",

      cv_label: "erfahrung",
      cv_file: "Lebenslauf",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
