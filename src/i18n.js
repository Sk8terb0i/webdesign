import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      // --- Brand & Navigation ---
      brand: "Arnold Web & Streaming",
      tagline: "A simple, good looking solution without any monthly costs",
      verticalText: "Modern. Simple. Yours.",
      drag_explore: "Drag to explore",
      about_me: "about me",
      contact_me: "contact",
      examples: "Examples",
      details: "Details",
      get_in_touch: "Get in touch",
      web_technical: "Technical",
      stream_technical: "Technical",

      // --- Services Content ---
      web_p1: "A responsive site that looks great on all devices",
      web_p2: "Built with modern tools",
      web_p3: "Hosted for free on GitHub",
      web_p4: "Custom domain as the only recurring cost (~10-20 CHF/year)",
      web_p6:
        "Easy to use admin panel to update website info without having to code",
      web_p7:
        "A clear handover guide so you can maintain and edit the site yourself",
      web_p8: "Optional maintenance by me if you don’t want to touch any code",

      stream_p1:
        "Streaming on popular platforms (YouTube, Twitch, Instagram etc.)",
      stream_p2: "Clean stable set up",
      stream_p3: "All costs upfront",
      stream_p4: "I handle the technical setup during the event",
      stream_p5:
        "Optional post processing (short edits for Reels, full recording etc.)",

      about_text:
        "I am a web designer and streaming technician based in Switzerland, focused on clean, high-performance solutions without the headache of monthly subscriptions.",
      contact_email: "noe.arnold@outlook.com",

      // --- Inquiry Form: Headings (Questions) ---
      form_title_web: "Inquiry Web Design",
      form_subtitle:
        "tell me a bit about your idea so we can start a conversation.",
      section_1: "What are we building?",
      section_2: "What should it be able to do?",
      section_3: "How should it look and feel?",
      section_4: "What about the logistics?",
      get_in_touch_out: "How can I reach you?",

      // --- Inquiry Form: Questions & Labels ---
      form_scope_new: "A brand new website",
      form_scope_redesign: "Redesign an existing site",
      form_scope_landing: "A simple landing page",
      form_pages_label: "How many pages approximately?",
      form_deadline: "Do you have a specific deadline?",
      form_deadline_placeholder: "e.g. Launch in June, or flexible...",

      form_feat_shop_c: "Custom shop system",
      form_feat_shop_e: "External shop (Stripe/Shopify)",
      form_feat_admin: "Edit text/images myself (Admin Panel)",
      form_feat_lang: "Multiple languages",
      form_feat_book: "Appointment booking",
      form_feat_login: "User accounts / login system",
      form_feat_api: "Social media feeds / third-party tools",

      form_assets_ready: "I have a logo & brand guide",
      form_assets_need: "I need a visual identity created",
      form_copy_provide: "I will provide all content",
      form_copy_need: "I need help with copywriting/photos",
      form_style_label: "Visual style (minimal, bold, playful...)",

      form_host_free: "Free hosting (GitHub) — no monthly fees",
      form_host_ext: "My own server / external provider",
      form_budget_label: "budget range (CHF)",
      budget_low: "1'000 – 3'000",
      budget_mid: "3'000 – 7'000",
      budget_high: "7'000+",

      // --- Inquiry Form: Contact & Messenger ---
      form_contact_placeholder: "Email address or phone number",
      form_channel_chat: "Messaging app",
      form_channel_email: "Email",
      form_channel_call: "Phone call",
      form_select_app: "Which app do you prefer?",
      form_details: "Tell me more about your idea...",
      form_submit: "Send inquiry",
      form_app_whatsapp: "WhatsApp",
      form_app_signal: "Signal",
      form_app_telegram: "Telegram",
      form_app_sms: "SMS",
      form_skip_to_call: "I'd rather have a phone call",
      form_phone_label: "Phone number",
      form_message_label: "Anything I should know before we call?",

      // --- Missing Keys ---
      direct_contact: "direct inquiry",
      back_to_form: "back to form",
      step: "step",
      button_next: "next step",
      button_back: "go back",

      // --- Submit Stuff ---
      form_style_placeholder: "e.g. clean, dark mode, high contrast...",
      form_error_required: "Please complete all required steps first.",
      form_success_title: "Thank you!",
      form_success_body:
        "Your inquiry has been sent. I will get back to you soon.",
      optional: "optional",
    },
  },
  de: {
    translation: {
      // --- Brand & Navigation ---
      brand: "Arnold Web & Streaming",
      tagline: "Eine einfache, gut aussehende Lösung ohne monatliche Kosten",
      verticalText: "Modern. Einfach. Deins.",
      drag_explore: "Maus gedrückt halten und erkunden",
      about_me: "über mich",
      contact_me: "kontakt",
      examples: "Beispiele",
      details: "Details",
      get_in_touch: "Schreib mir",
      web_technical: "Technisches",
      stream_technical: "Technisches",

      // --- Services Content ---
      web_p1: "Eine responsive Seite, die auf allen Geräten gut aussieht",
      web_p2: "Erstellt mit modernen Tools",
      web_p3: "Kostenloses Hosting auf GitHub",
      web_p4: "Eigene Domain als einzige Fixkosten (~10-20 CHF/Jahr)",
      web_p6: "Einfaches Admin-Panel für Inhalte ohne Programmierkenntnisse",
      web_p7: "Ein klarer Übergabeguide zur eigenständigen Verwaltung",
      web_p8: "Optionale Wartung durch mich",

      stream_p1:
        "Streaming auf gängigen Plattformen (YouTube, Twitch, Instagram etc.)",
      stream_p2: "Sauberes, stabiles Setup",
      stream_p3: "Alle Kosten im Voraus",
      stream_p4: "Ich übernehme das technische Setup während des Events",
      stream_p5: "Optionale Nachbearbeitung (Reels, komplette Aufnahme etc.)",

      about_text:
        "Ich bin Webdesigner und Streaming-Techniker aus der Schweiz, spezialisiert auf performante Lösungen ohne monatliche Abonnements.",
      contact_email: "noe.arnold@outlook.com",

      // --- Inquiry Form: Headings (Questions) ---
      form_title_web: "Offertenanfrage Webdesign",
      form_subtitle: "erzähl mir ein wenig von deiner Idee.",
      section_1: "Was bauen wir?",
      section_2: "Was soll die Seite können?",
      section_3: "Wie soll sie sich anfühlen?",
      section_4: "Wie sieht der Rahmen aus?",
      get_in_touch_out: "Wie erreiche ich dich?",

      // --- Inquiry Form: Questions & Labels ---
      form_scope_new: "Eine ganz neue Website",
      form_scope_redesign: "Eine bestehende Seite umdesignen",
      form_scope_landing: "Eine einfache Einstiegseite (Landingpage)",
      form_pages_label: "Wie viele Seiten planst du etwa?",
      form_deadline: "Hast du eine feste Deadline?",
      form_deadline_placeholder: "z.B. Launch im Juni, oder flexibel...",

      form_feat_shop_c: "Eigenes Shopsystem",
      form_feat_shop_e: "Externer Shop (Stripe/Shopify)",
      form_feat_admin: "Inhalte selbst bearbeiten (Admin Panel)",
      form_feat_lang: "Mehrere Sprachen",
      form_feat_book: "Termine buchen",
      form_feat_login: "Mitgliederbereich / Login-System",
      form_feat_api: "Social Media Feeds / externe Tools",

      form_assets_ready: "Logo & Markenguide vorhanden",
      form_assets_need: "Visuelle Identität muss erstellt werden",
      form_copy_provide: "Ich liefere alle Inhalte",
      form_copy_need: "Brauche Hilfe bei Texten/Fotos",
      form_style_label: "Visueller Stil (Minimal, fett, verspielt...)",

      form_host_free: "Kostenloses Hosting (GitHub) — keine Fixkosten",
      form_host_ext: "Eigener Server / externer Anbieter",
      form_budget_label: "Budgetrahmen (CHF)",
      budget_low: "1'000 – 3'000",
      budget_mid: "3'000 – 7'000",
      budget_high: "7'000+",

      // --- Inquiry Form: Contact & Messenger ---
      form_contact_placeholder: "E-Mail-Adresse oder Telefonnummer",
      form_channel_chat: "Messenger App",
      form_channel_email: "E-Mail",
      form_channel_call: "Anruf",
      form_select_app: "Welche App bevorzugst du?",
      form_details: "Erzähl mir mehr über deine Idee...",
      form_submit: "Anfrage senden",
      form_app_whatsapp: "WhatsApp",
      form_app_signal: "Signal",
      form_app_telegram: "Telegram",
      form_app_sms: "SMS",
      form_skip_to_call: "Ich möchte lieber direkt telefonieren",
      form_phone_label: "Telefonnummer",
      form_message_label: "Gibt es etwas, das ich vorab wissen sollte?",

      // --- Missing Keys ---
      direct_contact: "Direktanfrage",
      back_to_form: "Zurück zum Formular",
      step: "Schritt",
      button_next: "nächster schritt",
      button_back: "zurück",

      // --- Submit Stuff ---
      form_style_placeholder: "z.B. sauber, Dark-Mode, hoher Kontrast...",
      form_error_required:
        "Bitte fülle zuerst alle erforderlichen Schritte aus.",
      form_success_title: "Vielen Dank!",
      form_success_body:
        "Deine Anfrage wurde gesendet. Ich melde mich bald bei dir.",
      optional: "optional",
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
