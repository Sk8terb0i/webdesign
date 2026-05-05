import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import Landing from "./components/Landing";
import AdminDashboard from "./components/AdminDashBoard";
import AdminLogin from "./components/AdminLogin"; // Ensure this import path is correct

function App() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentLang = i18n.language;

  useEffect(() => {
    // Listen for auth state once when the app starts
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fce0e8]">
        <p className="text-[10px] tracking-widest animate-pulse uppercase">
          Initializing Secure Session...
        </p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <html lang={currentLang} />
        <title>{pageTitle}</title>
        <meta name="description" content={t("about_text")} />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/admin"
          element={
            user ? (
              <AdminDashboard />
            ) : (
              <AdminLogin
                theme={{ bg: "#fce0e8", text: "#c61e3d" }}
                onLogin={() => {}}
              />
            )
          }
        />
        {/* Redirect any stray admin paths back to the main admin route */}
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </>
  );
}

export default App;
