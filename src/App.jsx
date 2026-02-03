import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

// Import your new components
import Header from "./components/Header";
import NavSection from "./components/NavSection";
import ThemeControls from "./components/ThemeControls";

/**
 * THEME CONFIGURATION
 */
const themes = [
  { name: "pink", bg: "#fce0e8", text: "#c61e3d", level3: "#232c2d" },
  { name: "industrial", bg: "#f4f4f4", text: "#232c2d", level3: "#232c2d" },
  { name: "midnight", bg: "#1a1a1a", text: "#e5e5e5", level3: "#a3a3a3" },
  { name: "moss", bg: "#2d3436", text: "#fab1a0", level3: "#dfe6e9" },
];

const CIRCLE_SETTINGS = {
  origin: "95% 95%",
  previewRadius: "54%",
  expandRadius: "150%",
};

function App() {
  const { t, i18n } = useTranslation();

  const [openSections, setOpenSections] = useState([]);
  const [themeIndex, setThemeIndex] = useState(0);
  const [hoveredTheme, setHoveredTheme] = useState(null);
  const [isExpanding, setIsExpanding] = useState(false);

  const currentTheme = themes[themeIndex];
  const activeColor = isExpanding
    ? themes[hoveredTheme].text
    : currentTheme.text;
  const isEn = i18n.language === "en";

  const toggleLang = () => i18n.changeLanguage(isEn ? "de" : "en");

  const handleThemeClick = (idx) => {
    if (idx === themeIndex || isExpanding) return;
    setHoveredTheme(idx);
    setIsExpanding(true);
    setTimeout(() => setThemeIndex(idx), 450);
    setTimeout(() => {
      setIsExpanding(false);
      setHoveredTheme(null);
    }, 850);
  };

  const handleLevel1Toggle = (id, subIds = []) => {
    const isAlreadyOpen = openSections.includes(id);
    if (isAlreadyOpen) {
      setOpenSections([]);
    } else {
      setOpenSections([id]);
      const idsToAutoExpand =
        subIds.length === 1
          ? subIds
          : subIds.filter((subId) => subId.includes("tech"));
      setTimeout(
        () => setOpenSections((prev) => [...prev, ...idsToAutoExpand]),
        300,
      );
    }
  };

  const handleSubToggle = (id) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  return (
    <div
      className="h-screen w-full font-sans overflow-hidden flex relative selection:bg-current selection:text-white transition-colors duration-700"
      style={{ backgroundColor: currentTheme.bg }}
    >
      <AnimatePresence mode="wait">
        {hoveredTheme !== null && hoveredTheme !== themeIndex && (
          <motion.div
            key={`theme-circle-${hoveredTheme}`}
            initial={{ clipPath: `circle(0% at ${CIRCLE_SETTINGS.origin})` }}
            animate={{
              clipPath: isExpanding
                ? `circle(${CIRCLE_SETTINGS.expandRadius} at ${CIRCLE_SETTINGS.origin})`
                : `circle(${CIRCLE_SETTINGS.previewRadius} at ${CIRCLE_SETTINGS.origin})`,
            }}
            exit={{
              opacity: isExpanding ? 1 : 0,
              clipPath: isExpanding
                ? `circle(${CIRCLE_SETTINGS.expandRadius} at ${CIRCLE_SETTINGS.origin})`
                : `circle(0% at ${CIRCLE_SETTINGS.origin})`,
            }}
            transition={{
              duration: isExpanding ? 0.8 : 0.5,
              ease: isExpanding ? [0.4, 0, 0.2, 1] : "circOut",
            }}
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ backgroundColor: themes[hoveredTheme].bg }}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-10 p-6 md:p-12 flex flex-col justify-between transition-colors duration-500">
        <Header
          t={t}
          isEn={isEn}
          toggleLang={toggleLang}
          textColor={activeColor}
        />

        <div className="space-y-8 md:space-y-12 my-12 overflow-y-auto no-scrollbar">
          {/* WEB DESIGN SECTION */}
          <NavSection
            title="web design"
            id="web"
            t={t}
            theme={currentTheme}
            textColor={activeColor}
            openSections={openSections}
            onToggleLevel1={handleLevel1Toggle}
            onToggleSub={handleSubToggle}
            subItems={[
              {
                id: "web-ex",
                labelKey: "examples",
                type: "simple",
                contentKey: "examples",
              },
              {
                id: "web-tech",
                labelKey: "web_technical",
                type: "list",
                items: [1, 2, 3, 4, 6, 7, 8],
                translationPrefix: "web_p",
              },
            ]}
          />

          {/* STREAMING SECTION - Updated to use List Type */}
          <NavSection
            title="live streaming"
            id="stream"
            t={t}
            theme={currentTheme}
            textColor={activeColor}
            openSections={openSections}
            onToggleLevel1={handleLevel1Toggle}
            onToggleSub={handleSubToggle}
            subItems={[
              {
                id: "stream-ex",
                labelKey: "examples",
                type: "simple",
                contentKey: "examples",
              },
              {
                id: "stream-tech",
                labelKey: "stream_technical",
                type: "list",
                items: [1, 2, 3, 4, 5],
                translationPrefix: "stream_p",
              },
            ]}
          />

          {/* ABOUT SECTION */}
          <NavSection
            title={t("about_me")}
            id="about"
            t={t}
            theme={currentTheme}
            textColor={activeColor}
            openSections={openSections}
            onToggleLevel1={handleLevel1Toggle}
            onToggleSub={handleSubToggle}
            subItems={[
              {
                id: "about-details",
                labelKey: "details",
                type: "simple",
                contentKey: "about_text",
              },
            ]}
          />

          {/* CONTACT SECTION */}
          <NavSection
            title={t("contact_me")}
            id="contact"
            t={t}
            theme={currentTheme}
            textColor={activeColor}
            openSections={openSections}
            onToggleLevel1={handleLevel1Toggle}
            onToggleSub={handleSubToggle}
            subItems={[
              {
                id: "contact-info",
                labelKey: "get_in_touch",
                type: "simple",
                contentKey: "contact_email",
                contentIsLink: true,
              },
            ]}
          />
        </div>

        <ThemeControls
          themes={themes}
          themeIndex={themeIndex}
          hoveredTheme={hoveredTheme}
          isExpanding={isExpanding}
          onThemeClick={handleThemeClick}
          onHover={(idx) => !isExpanding && setHoveredTheme(idx)}
          textColor={activeColor}
          currentThemeName={
            isExpanding ? themes[hoveredTheme].name : currentTheme.name
          }
          tagline={t("tagline")}
        />
      </div>

      <div className="hidden md:block pointer-events-none">
        <div className="absolute right-0 top-0 bottom-0 px-8 flex items-center justify-center z-20">
          <p
            className="[writing-mode:vertical-lr] rotate-180 text-xl lg:text-2xl font-bold tracking-[0.3em] opacity-80 lowercase whitespace-nowrap transition-colors duration-500"
            style={{ color: activeColor }}
          >
            {t("verticalText")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
