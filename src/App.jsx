import React from "react";
import { Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Landing from "./components/Landing";
import AdminDashboard from "./components/AdminDashBoard";

function App() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  // This object tells Google exactly who you are and what you do in Zürich
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Noe Arnold | Eon Web & Streaming",
    image: "https://www.streaming-web.design/favicon.svg",
    url: "https://www.streaming-web.design",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Zürich",
      addressCountry: "CH",
    },
    description: t("about_text"),
  };

  const pageTitle =
    currentLang === "de"
      ? "Noe Arnold | Webdesign & Streaming Zürich"
      : "Noe Arnold | Web Design & Streaming Zurich";

  return (
    <>
      <Helmet>
        {/* 1. Standard SEO Tags */}
        <html lang={currentLang} />
        <title>{pageTitle}</title>
        <meta name="description" content={t("about_text")} />
        <link rel="canonical" href="https://www.streaming-web.design/" />

        {/* 2. Language Alternates (Hreflang) */}
        <link
          rel="alternate"
          hreflang="en"
          href="https://www.streaming-web.design/"
        />
        <link
          rel="alternate"
          hreflang="de"
          href="https://www.streaming-web.design/"
        />
        <link
          rel="alternate"
          hreflang="x-default"
          href="https://www.streaming-web.design/"
        />

        {/* 3. Open Graph / Facebook / LinkedIn */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.streaming-web.design/" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={t("about_text")} />
        <meta
          property="og:image"
          content="https://www.streaming-web.design/faveicon.svg"
        />

        {/* 4. Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={t("about_text")} />
        <meta
          name="twitter:image"
          content="https://www.streaming-web.design/faveicon.svg"
        />

        {/* 5. JSON-LD Schema */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default App;
