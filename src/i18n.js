import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      // --- Brand & Navigation ---
      brand: "arnold web & streaming",
      tagline: "a simple, good looking solution without any monthly costs",
      verticalText: "modern. simple. yours.",
      drag_explore: "drag to explore",
      about_me: "about me",
      contact_me: "contact",
      examples: "examples",
      details: "details",
      get_in_touch: "get in touch",
      web_technical: "technical",
      stream_technical: "technical",

      // --- Services Content ---
      web_p1: "a responsive site that looks great on all devices",
      web_p2: "built with modern tools",
      web_p3: "hosted for free on github",
      web_p4: "custom domain as the only recurring cost (~10-20 chf/year)",
      web_p6:
        "easy to use admin panel to update website info without having to code",
      web_p7:
        "a clear handover guide so you can maintain and edit the site yourself",
      web_p8: "optional maintenance by me if you don’t want to touch any code",

      stream_p1:
        "streaming on popular platforms (youtube, twitch, instagram etc.)",
      stream_p2: "clean stable set up",
      stream_p3: "all costs upfront",
      stream_p4: "i handle the technical setup during the event",
      stream_p5:
        "optional post processing (short edits for reels, full recording etc.)",

      about_text:
        "i am a web designer and streaming technician based in switzerland, focused on clean, high-performance solutions without the headache of monthly subscriptions.",
      contact_email: "noe.arnold@outlook.com",

      // --- Inquiry Form: Headings (Questions) ---
      form_title_web: "inquiry web design",
      form_subtitle:
        "tell me a bit about your idea so we can start a conversation.",
      section_1: "what are we building?",
      section_2: "what should it be able to do?",
      section_3: "how should it look and feel?",
      section_4: "what about the logistics?",
      get_in_touch: "how can i reach you?",

      // --- Inquiry Form: Questions & Labels ---
      form_scope_new: "a brand new website",
      form_scope_redesign: "redesign an existing site",
      form_scope_landing: "a simple landing page",
      form_pages_label: "how many pages approximately?",
      form_deadline: "do you have a specific deadline?",
      form_deadline_placeholder: "e.g. launch in june, or flexible...",

      form_feat_shop_c: "custom shop system",
      form_feat_shop_e: "external shop (stripe/shopify)",
      form_feat_admin: "edit text/images myself (admin panel)",
      form_feat_lang: "multiple languages",
      form_feat_book: "appointment booking",
      form_feat_login: "user accounts / login system",
      form_feat_api: "social media feeds / third-party tools",

      form_assets_ready: "i have a logo & brand guide",
      form_assets_need: "i need a visual identity created",
      form_copy_provide: "i will provide all content",
      form_copy_need: "i need help with copywriting/photos",
      form_style_label: "visual style (minimal, bold, playful...)",

      form_host_free: "free hosting (github) — no monthly fees",
      form_host_ext: "my own server / external provider",
      form_budget_label: "budget range (chf)",
      budget_low: "1'000 – 3'000",
      budget_mid: "3'000 – 7'000",
      budget_high: "7'000+",

      // --- Inquiry Form: Contact & Messenger ---
      form_contact_placeholder: "email address or phone number",
      form_channel_chat: "messaging app",
      form_channel_email: "email",
      form_channel_call: "phone call",
      form_select_app: "which app do you prefer?",
      form_details: "tell me more about your idea...",
      form_submit: "send inquiry",
      form_app_whatsapp: "whatsapp",
      form_app_signal: "signal",
      form_app_telegram: "telegram",
      form_app_sms: "sms",
      form_skip_to_call: "i'd rather just discuss this over a phone call",
      form_phone_label: "phone number",
      form_message_label: "anything i should know before we call?",

      button_next: "next step",
      button_back: "go back",
    },
  },
  de: {
    translation: {
      // --- Brand & Navigation ---
      brand: "arnold web & streaming",
      tagline: "eine einfache, gut aussehende lösung ohne monatliche kosten",
      verticalText: "modern. einfach. deins.",
      drag_explore: "maus gedrückt halten und erkunden",
      about_me: "über mich",
      contact_me: "kontakt",
      examples: "beispiele",
      details: "details",
      get_in_touch: "schreib mir",
      web_technical: "technisches",
      stream_technical: "technisches",

      // --- Services Content ---
      web_p1: "eine responsive seite, die auf allen geräten gut aussieht",
      web_p2: "erstellt mit modernen tools",
      web_p3: "kostenloses hosting auf github",
      web_p4: "eigene domain als einzige fixkosten (~10-20 chf/jahr)",
      web_p6: "einfaches admin-panel für inhalte ohne programmierkenntnisse",
      web_p7: "ein klarer übergabeguide zur eigenständigen verwaltung",
      web_p8: "optionale wartung durch mich",

      stream_p1:
        "streaming auf gängigen plattformen (youtube, twitch, insta etc.)",
      stream_p2: "sauberes, stabiles setup",
      stream_p3: "alle kosten im voraus",
      stream_p4: "ich übernehme das technische setup während des events",
      stream_p5: "optionale nachbearbeitung (reels, komplette aufnahme etc.)",

      about_text:
        "ich bin webdesigner und streaming-techniker aus der schweiz, spezialisiert auf performante lösungen ohne monatliche abonnements.",
      contact_email: "noe.arnold@outlook.com",

      // --- Inquiry Form: Headings (Questions) ---
      form_title_web: "offertenanfrage webdesign",
      form_subtitle: "erzähl mir ein wenig von deiner idee.",
      section_1: "was bauen wir?",
      section_2: "was soll die seite können?",
      section_3: "wie soll sie sich anfühlen?",
      section_4: "wie sieht der rahmen aus?",
      get_in_touch: "wie erreiche ich dich?",

      // --- Inquiry Form: Questions & Labels ---
      form_scope_new: "eine ganz neue website",
      form_scope_redesign: "eine bestehende seite umdesignen",
      form_scope_landing: "eine einfache einstiegseite (landingpage)",
      form_pages_label: "wie viele seiten planst du etwa?",
      form_deadline: "hast du eine feste deadline?",
      form_deadline_placeholder: "z.b. launch im juni, oder flexibel...",

      form_feat_shop_c: "eigenes shopsystem",
      form_feat_shop_e: "externer shop (stripe/shopify)",
      form_feat_admin: "inhalte selbst bearbeiten (admin panel)",
      form_feat_lang: "mehrere sprachen",
      form_feat_book: "termine buchen",
      form_feat_login: "mitgliederbereich / login-system",
      form_feat_api: "social media feeds / externe tools",

      form_assets_ready: "logo & markenguide vorhanden",
      form_assets_need: "visuelle identität muss erstellt werden",
      form_copy_provide: "ich liefere alle inhalte",
      form_copy_need: "brauche hilfe bei texten/fotos",
      form_style_label: "visueller stil (minimal, fett, verspielt...)",

      form_host_free: "kostenloses hosting (github) — keine fixkosten",
      form_host_ext: "eigener server / externer anbieter",
      form_budget_label: "budgetrahmen (chf)",
      budget_low: "1'000 – 3'000",
      budget_mid: "3'000 – 7'000",
      budget_high: "7'000+",

      // --- Inquiry Form: Contact & Messenger ---
      form_contact_placeholder: "email-adresse oder telefonnummer",
      form_channel_chat: "messenger app",
      form_channel_email: "e-mail",
      form_channel_call: "anruf",
      form_select_app: "welche app bevorzugst du?",
      form_details: "erzähl mir mehr über deine idee...",
      form_submit: "anfrage senden",
      form_app_whatsapp: "whatsapp",
      form_app_signal: "signal",
      form_app_telegram: "telegram",
      form_app_sms: "sms",
      form_skip_to_call: "ich möchte das lieber direkt am telefon besprechen",
      form_phone_label: "telefonnummer",
      form_message_label: "gibt es etwas, das ich vorab wissen sollte?",

      button_next: "nächster schritt",
      button_back: "zurück",
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
