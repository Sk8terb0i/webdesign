import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import Header from "./components/Header";
import NavSection from "./components/NavSection";
import ThemeControls from "./components/ThemeControls";

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
  const isEn = i18n.language?.startsWith("en");
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
        subIds.length === 1 ? subIds : subIds.filter((s) => s.includes("tech"));
      setTimeout(
        () => setOpenSections((prev) => [...prev, ...idsToAutoExpand]),
        300,
      );
    }
  };

  // Helper for the vertical text component to avoid repetition
  const VerticalText = ({ color }) => (
    <div className="absolute right-0 top-0 bottom-0 px-8 flex items-center justify-center pointer-events-none">
      <p
        className="[writing-mode:vertical-lr] rotate-180 text-xl lg:text-2xl font-bold tracking-[0.3em] lowercase whitespace-nowrap transition-colors duration-500"
        style={{ color }}
      >
        {t("verticalText")}
      </p>
    </div>
  );

  return (
    <div
      className="h-screen w-full font-sans overflow-hidden flex relative transition-colors duration-700"
      style={{ backgroundColor: currentTheme.bg }}
    >
      {/* 1. BASE VERTICAL TEXT (Current Theme Color) */}
      <div className="hidden md:block">
        <VerticalText color={currentTheme.text} />
      </div>

      {/* 2. THEME PREVIEW CIRCLE & OVERLAP TEXT */}
      <AnimatePresence mode="wait">
        {hoveredTheme !== null && hoveredTheme !== themeIndex && (
          <motion.div
            key={`theme-layer-${hoveredTheme}`}
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
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ backgroundColor: themes[hoveredTheme].bg }}
          >
            {/* This text is only visible where the circle clips it */}
            <div className="hidden md:block h-full w-full relative">
              <VerticalText color={themes[hoveredTheme].text} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. MAIN INTERACTIVE CONTENT */}
      <div className="absolute inset-0 z-20 p-6 md:p-12 flex flex-col justify-between">
        <Header
          t={t}
          isEn={isEn}
          toggleLang={toggleLang}
          textColor={
            isExpanding ? themes[hoveredTheme].text : currentTheme.text
          }
        />

        <div className="space-y-8 md:space-y-12 my-12 overflow-y-auto no-scrollbar">
          <NavSection
            title="web design"
            id="web"
            t={t}
            theme={currentTheme}
            textColor={
              isExpanding ? themes[hoveredTheme].text : currentTheme.text
            }
            openSections={openSections}
            onToggleLevel1={handleLevel1Toggle}
            onToggleSub={(id) =>
              setOpenSections((prev) =>
                prev.includes(id)
                  ? prev.filter((s) => s !== id)
                  : [...prev, id],
              )
            }
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
          <NavSection
            title="live streaming"
            id="stream"
            t={t}
            theme={currentTheme}
            textColor={
              isExpanding ? themes[hoveredTheme].text : currentTheme.text
            }
            openSections={openSections}
            onToggleLevel1={handleLevel1Toggle}
            onToggleSub={(id) =>
              setOpenSections((prev) =>
                prev.includes(id)
                  ? prev.filter((s) => s !== id)
                  : [...prev, id],
              )
            }
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
          <NavSection
            title={t("about_me")}
            id="about"
            t={t}
            theme={currentTheme}
            textColor={
              isExpanding ? themes[hoveredTheme].text : currentTheme.text
            }
            openSections={openSections}
            onToggleLevel1={handleLevel1Toggle}
            onToggleSub={(id) =>
              setOpenSections((prev) =>
                prev.includes(id)
                  ? prev.filter((s) => s !== id)
                  : [...prev, id],
              )
            }
            subItems={[
              {
                id: "about-details",
                labelKey: "details",
                type: "simple",
                contentKey: "about_text",
              },
            ]}
          />
          <NavSection
            title={t("contact_me")}
            id="contact"
            t={t}
            theme={currentTheme}
            textColor={
              isExpanding ? themes[hoveredTheme].text : currentTheme.text
            }
            openSections={openSections}
            onToggleLevel1={handleLevel1Toggle}
            onToggleSub={(id) =>
              setOpenSections((prev) =>
                prev.includes(id)
                  ? prev.filter((s) => s !== id)
                  : [...prev, id],
              )
            }
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
          textColor={
            isExpanding ? themes[hoveredTheme].text : currentTheme.text
          }
          currentThemeName={
            isExpanding ? themes[hoveredTheme].name : currentTheme.name
          }
          tagline={t("tagline")}
        />
      </div>
    </div>
  );
}

export default App;
