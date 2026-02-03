import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          brand: "arnold web & streaming",
          tagline: "a simple, good looking solution without any monthly costs",
          verticalText: "modern. simple. yours.",
          web_technical: "technical",
          stream_technical: "technical",
          about_me: "about me",
          contact_me: "contact",
          examples: "examples",
          details: "details",
          get_in_touch: "get in touch",
          web_p1: "A responsive site that looks great on all devices",
          web_p2: "Built with modern tools",
          web_p3: "Hosted for free on GitHub",
          web_p4: "Custom domain as the only recurring cost (~10-20 CHF/year)",
          web_p6:
            "Easy to use admin panel to update website info without having to code",
          web_p7:
            "A clear handover guide so you can maintain and edit the site yourself",
          web_p8:
            "Optional maintenance by me if you don’t want to touch any code",
          stream_p1:
            "Streaming on popular platforms (YouTube, Twitch, Instagram etc.)",
          stream_p2: "Clean stable set up",
          stream_p3: "All costs upfront",
          stream_p4: "I handle the technical setup during the event",
          stream_p5:
            "Optional post processing (short edits for reels, full recording etc.)",
          about_text:
            "I am a web designer and streaming technician based in Switzerland, focused on clean, high-performance solutions without the headache of monthly subscriptions.",
          contact_email: "noe.arnold@outlook.com",
        },
      },
      de: {
        translation: {
          brand: "arnold web & streaming",
          tagline:
            "eine einfache, gut aussehende Lösung ohne monatliche Kosten",
          verticalText: "modern. einfach. deins.",
          web_technical: "technisches",
          stream_technical: "technisches",
          about_me: "über mich",
          contact_me: "kontakt",
          examples: "beispiele",
          details: "details",
          get_in_touch: "schreib mir",
          web_p1: "Eine responsive Seite, die auf allen Geräten gut aussieht",
          web_p2: "Erstellt mit modernen Tools",
          web_p3: "Kostenloses Hosting auf GitHub",
          web_p4: "Eigene Domain als einzige Fixkosten (~10-20 CHF/Jahr)",
          web_p6:
            "Einfaches Admin-Panel, um Inhalte ohne Programmierkenntnisse zu aktualisieren",
          web_p7:
            "Ein klarer Übergabeguide, damit du die Seite selbst verwalten und bearbeiten kannst",
          web_p8:
            "Optionale Wartung durch mich, falls du dich nicht um den Code kümmern willst",
          stream_p1:
            "Streaming auf gängigen Plattformen (YouTube, Twitch, Instagram etc.)",
          stream_p2: "Sauberes, stabiles Setup",
          stream_p3: "Alle Kosten im Voraus",
          stream_p4: "Ich übernehme das technische Setup während des Events",
          stream_p5:
            "Optionale Nachbearbeitung (Shorts für Reels, komplette Aufnahme etc.)",
          about_text:
            "Ich bin Webdesigner und Streaming-Techniker aus der Schweiz, spezialisiert auf saubere, performante Lösungen ohne die Kopfschmerzen von monatlichen Abonnements.",
          contact_email: "noe.arnold@outlook.com",
        },
      },
    },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
