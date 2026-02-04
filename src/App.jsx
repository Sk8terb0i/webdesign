import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import Header from "./components/Header";
import NavSection from "./components/NavSection";
import ThemeControls from "./components/ThemeControls";
import WebInquiryForm from "./components/WebInquiryForm";

const themes = [
  { name: "pink", bg: "#fce0e8", text: "#c61e3d", level3: "#232c2d" },
  { name: "industrial", bg: "#f4f4f4", text: "#232c2d", level3: "#232c2d" },
  { name: "midnight", bg: "#1a1a1a", text: "#e5e5e5", level3: "#a3a3a3" },
  { name: "moss", bg: "#2d3436", text: "#fab1a0", level3: "#dfe6e9" },
];

const CIRCLE_SETTINGS = {
  previewRadius: "54%",
  dragRadius: "27%",
  expandRadius: "150%",
};

const DragIndicator = ({ color, isDragging, isExpanding, t }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute flex flex-col items-center justify-end pointer-events-none z-50"
    style={{
      left: "var(--mouse-x)",
      top: "var(--mouse-y)",
      transform: "translate(-50%, -100%)",
      height: "40px",
      paddingBottom: "10px",
    }}
  >
    <AnimatePresence>
      {!isDragging && !isExpanding && (
        <motion.span
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 2 }}
          className="text-[10px] font-medium tracking-widest whitespace-nowrap lowercase"
          style={{ color }}
        >
          {t("drag_explore")}
        </motion.span>
      )}
    </AnimatePresence>
  </motion.div>
);

const MainUIContent = React.memo(
  ({
    t,
    isEn,
    toggleLang,
    theme, // Now correctly used
    textColor,
    openSections,
    handleLevel1Toggle,
    setOpenSections,
    themeIndex,
    hoveredTheme,
    isExpanding,
    onThemeMouseDown,
    onHover,
  }) => {
    const isWebExpanded = openSections.includes("web");

    return (
      <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-between">
        <Header
          t={t}
          isEn={isEn}
          toggleLang={toggleLang}
          textColor={textColor}
        />

        <div className="my-12 flex-grow flex flex-col justify-center">
          <div className="space-y-8 md:space-y-12 overflow-y-auto no-scrollbar">
            {[
              {
                id: "web",
                title: "web design",
                subs: [
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
                ],
              },
              {
                id: "stream",
                title: "live streaming",
                subs: [
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
                ],
              },
              {
                id: "about",
                title: t("about_me"),
                subs: [
                  {
                    id: "about-details",
                    labelKey: "details",
                    type: "simple",
                    contentKey: "about_text",
                  },
                ],
              },
              {
                id: "contact",
                title: t("contact_me"),
                subs: [
                  {
                    id: "contact-info",
                    labelKey: "get_in_touch",
                    type: "simple",
                    contentKey: "contact_email",
                    contentIsLink: true,
                  },
                ],
              },
            ].map((sec) => (
              <NavSection
                key={sec.id}
                title={sec.title}
                id={sec.id}
                t={t}
                theme={theme}
                textColor={textColor}
                openSections={openSections}
                onToggleLevel1={handleLevel1Toggle}
                onToggleSub={(id) =>
                  setOpenSections((prev) =>
                    prev.includes(id)
                      ? prev.filter((s) => s !== id)
                      : [...prev, id],
                  )
                }
                subItems={sec.subs}
              />
            ))}
          </div>
        </div>

        <div className="hidden md:flex fixed inset-y-0 right-0 w-[66.6vw] pointer-events-none items-center justify-center z-40">
          <AnimatePresence>
            {isWebExpanded && (
              <motion.div
                className="pointer-events-auto max-h-[75vh]"
                style={{ width: "25vw" }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "circOut" }}
              >
                {/* FIX: Passing theme object here is vital for PillButton colors */}
                <WebInquiryForm textColor={textColor} t={t} theme={theme} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ThemeControls
          themes={themes}
          themeIndex={themeIndex}
          hoveredTheme={hoveredTheme}
          isExpanding={isExpanding}
          onThemeMouseDown={onThemeMouseDown}
          onHover={onHover}
          textColor={textColor}
          currentThemeName={theme.name}
          tagline={t("tagline")}
        />
      </div>
    );
  },
);

function App() {
  const { t, i18n } = useTranslation();
  const containerRef = useRef(null);

  const [openSections, setOpenSections] = useState([]);
  const [themeIndex, setThemeIndex] = useState(() => {
    const saved = localStorage.getItem("selectedThemeIndex");
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [hoveredTheme, setHoveredTheme] = useState(null);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const currentTheme = themes[themeIndex];
  const isEn = i18n.language?.startsWith("en");
  const toggleLang = () => i18n.changeLanguage(isEn ? "de" : "en");

  const updateCursor = useCallback((e) => {
    if (!containerRef.current) return;
    const clientX =
      e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY =
      e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    const xPct = (clientX / window.innerWidth) * 100;
    const yPct = (clientY / window.innerHeight) * 100;
    containerRef.current.style.setProperty("--mouse-x", `${xPct}%`);
    containerRef.current.style.setProperty("--mouse-y", `${yPct}%`);
  }, []);

  const finalizeTheme = useCallback(
    (idx) => {
      if (idx === themeIndex || isExpanding) {
        setIsDragging(false);
        return;
      }
      setIsExpanding(true);
      setIsDragging(false);
      localStorage.setItem("selectedThemeIndex", idx);
      setTimeout(() => setThemeIndex(idx), 450);
      setTimeout(() => {
        setIsExpanding(false);
        setHoveredTheme(null);
        if (containerRef.current) {
          containerRef.current.style.setProperty("--mouse-x", "95%");
          containerRef.current.style.setProperty("--mouse-y", "95%");
        }
      }, 850);
    },
    [themeIndex, isExpanding],
  );

  useEffect(() => {
    const handleMove = (e) =>
      (hoveredTheme !== null || isDragging) && updateCursor(e);
    const handleUp = () =>
      isDragging && hoveredTheme !== null && finalizeTheme(hoveredTheme);
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [isDragging, hoveredTheme, finalizeTheme, updateCursor]);

  const handleLevel1Toggle = useCallback((id, subIds = []) => {
    setOpenSections((prev) => {
      if (prev.includes(id)) return [];
      const auto =
        subIds.length === 1 ? subIds : subIds.filter((s) => s.includes("tech"));
      setTimeout(() => setOpenSections((p) => [...p, ...auto]), 300);
      return [id];
    });
  }, []);

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
      ref={containerRef}
      className={`h-screen w-full font-sans overflow-hidden flex relative transition-colors duration-700 ${isDragging ? "cursor-grabbing" : "cursor-default"}`}
      style={{
        backgroundColor: currentTheme.bg,
        "--mouse-x": "95%",
        "--mouse-y": "95%",
        touchAction: isDragging ? "none" : "auto",
      }}
    >
      <div className="absolute inset-0 z-0">
        <div className="hidden md:block">
          <VerticalText color={currentTheme.text} />
        </div>
        <MainUIContent
          t={t}
          isEn={isEn}
          toggleLang={toggleLang}
          theme={currentTheme}
          textColor={
            isExpanding ? themes[hoveredTheme].text : currentTheme.text
          }
          openSections={openSections}
          handleLevel1Toggle={handleLevel1Toggle}
          setOpenSections={setOpenSections}
          themeIndex={themeIndex}
          hoveredTheme={hoveredTheme}
          isExpanding={isExpanding}
          onThemeMouseDown={(idx, e) => {
            if (idx === themeIndex || isExpanding) return;
            updateCursor(e);
            setHoveredTheme(idx);
            setIsDragging(true);
          }}
          onHover={(idx) => !isExpanding && !isDragging && setHoveredTheme(idx)}
        />
      </div>

      <AnimatePresence>
        {hoveredTheme !== null && hoveredTheme !== themeIndex && (
          <>
            <DragIndicator
              color={themes[hoveredTheme].text}
              isDragging={isDragging}
              isExpanding={isExpanding}
              t={t}
            />
            <motion.div
              key={`preview-layer-${hoveredTheme}`}
              initial={{ "--radius": "0%" }}
              animate={{
                "--radius": isExpanding
                  ? CIRCLE_SETTINGS.expandRadius
                  : isDragging
                    ? CIRCLE_SETTINGS.dragRadius
                    : CIRCLE_SETTINGS.previewRadius,
              }}
              exit={{
                opacity: isExpanding ? 1 : 0,
                "--radius": isExpanding ? CIRCLE_SETTINGS.expandRadius : "0%",
              }}
              transition={{
                duration: isExpanding ? 0.8 : 0.25,
                ease: isExpanding ? [0.4, 0, 0.2, 1] : "easeOut",
              }}
              className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
              style={{
                backgroundColor: themes[hoveredTheme].bg,
                clipPath: `circle(var(--radius) at var(--mouse-x) var(--mouse-y))`,
              }}
            >
              <div className="hidden md:block h-full w-full relative">
                <VerticalText color={themes[hoveredTheme].text} />
              </div>
              <MainUIContent
                t={t}
                isEn={isEn}
                toggleLang={toggleLang}
                theme={themes[hoveredTheme]}
                textColor={themes[hoveredTheme].text}
                openSections={openSections}
                handleLevel1Toggle={() => {}}
                setOpenSections={() => {}}
                themeIndex={themeIndex}
                hoveredTheme={hoveredTheme}
                isExpanding={isExpanding}
                onThemeMouseDown={(idx, e) => {
                  if (idx === themeIndex || isExpanding) return;
                  updateCursor(e);
                  setHoveredTheme(idx);
                  setIsDragging(true);
                }}
                onHover={() => {}}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
