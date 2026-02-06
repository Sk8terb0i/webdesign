import React, { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./Header";
import NavSection from "./NavSection";
import ThemeControls from "./ThemeControls";
import WebInquiryForm from "./WebInquiryForm";
import StreamInquiryForm from "./StreamInquiryForm";
import GeneralInquiryForm from "./GeneralInquiryForm";
import PhotoCollage from "./PhotoCollage";
import cvEn from "../assets/cv/CV_EN_2025.pdf";
import cvDe from "../assets/cv/CV_DE_2025.pdf";

const themes = [
  {
    name: "pink",
    bg: "#fce0e8",
    text: "#c61e3d",
    level3: "#232c2d",
    accent: "rgba(89, 114, 205, 0.1)",
  },
  {
    name: "industrial",
    bg: "#f4f4f4",
    text: "#232c2d",
    level3: "#232c2d",
    accent: "rgba(35, 44, 45, 0.05)",
  },
  {
    name: "midnight",
    bg: "#1a1a1a",
    text: "#e5e5e5",
    level3: "#a3a3a3",
    accent: "rgba(255, 255, 255, 0.03)",
  },
  {
    name: "moss",
    bg: "#2d3436",
    text: "#fab1a0",
    level3: "#dfe6e9",
    accent: "rgba(250, 177, 160, 0.07)",
  },
];

const CIRCLE_SETTINGS = {
  previewRadius: "54%",
  dragRadius: "27%",
  expandRadius: "150%",
};

const getSectionsData = (t, isEn) => [
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
      { id: "web-inquiry", labelKey: "form_title_web", type: "form" },
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
      { id: "stream-inquiry", labelKey: "form_title_stream", type: "form" },
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
      {
        id: "about-cv",
        labelKey: "cv_label",
        type: "link",
        href: isEn ? cvEn : cvDe,
        fileName: t("cv_file"),
      },
    ],
  },
  {
    id: "contact",
    title: t("contact_me"),
    subs: [
      {
        id: "contact-form",
        labelKey: "get_in_touch",
        type: "form",
      },
    ],
  },
];

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
    theme,
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
    const isWebExpanded = openSections.includes("web-inquiry");
    const sectionsData = getSectionsData(t, isEn);

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
            {sectionsData.map((sec) => (
              <NavSection
                key={sec.id}
                title={sec.title}
                id={sec.id}
                t={t}
                theme={theme}
                textColor={textColor}
                openSections={openSections}
                onToggleLevel1={handleLevel1Toggle}
                onToggleSub={(subId, parentId) => {
                  setOpenSections((prev) => {
                    const isOpening = !prev.includes(subId);
                    if (isOpening) {
                      const section = sectionsData.find(
                        (s) => s.id === parentId,
                      );
                      const siblings = section
                        ? section.subs.map((s) => s.id)
                        : [];
                      return [
                        ...prev.filter((id) => !siblings.includes(id)),
                        subId,
                      ];
                    }
                    return prev.filter((s) => s !== subId);
                  });
                }}
                subItems={sec.subs}
              />
            ))}
          </div>
        </div>

        <div className="hidden md:flex fixed inset-y-0 right-0 w-[66.6vw] pointer-events-none items-center justify-center z-40">
          <AnimatePresence mode="wait">
            {openSections.includes("web-inquiry") ||
            openSections.includes("stream-inquiry") ||
            openSections.includes("contact-form") ? (
              <motion.div
                key={
                  openSections.includes("web-inquiry")
                    ? "web-panel"
                    : openSections.includes("stream-inquiry")
                      ? "stream-panel"
                      : "general-panel"
                }
                className="relative flex items-center justify-center h-full"
                style={{ width: "30vw" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  className="absolute inset-y-0 inset-x-0 z-[-1] transition-colors duration-700"
                  style={{
                    backgroundColor: `${theme.text}`,
                    backdropFilter: "blur(8px)",
                  }}
                />
                <motion.div
                  className="pointer-events-auto w-full max-h-screen overflow-y-auto no-scrollbar py-20 flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                >
                  <div style={{ width: "25vw" }}>
                    {openSections.includes("web-inquiry") ? (
                      <WebInquiryForm
                        textColor={textColor}
                        t={t}
                        theme={theme}
                        onSuccess={() => setOpenSections([])}
                      />
                    ) : openSections.includes("stream-inquiry") ? (
                      <StreamInquiryForm
                        textColor={textColor}
                        t={t}
                        theme={theme}
                        onSuccess={() => setOpenSections([])}
                      />
                    ) : (
                      <GeneralInquiryForm
                        t={t}
                        theme={theme}
                        onSuccess={() => setOpenSections([])}
                      />
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ) : openSections.includes("about") ? (
              <motion.div
                key="about-collage-panel"
                className="relative flex items-center justify-center h-full"
                style={{ width: "40vw" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="pointer-events-auto w-full h-full flex items-center justify-center">
                  <PhotoCollage theme={theme} />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="block md:block">
          <AnimatePresence>
            {!isWebExpanded && (
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="md:!opacity-100 md:!transform-none"
              >
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
                  dragExploreLabel={t("drag_explore")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  },
);

function Landing() {
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

  const handleLevel1Toggle = useCallback(
    (id) => {
      setOpenSections((prev) => {
        // If already open, close it (empty the array)
        if (prev.includes(id)) return [];

        const sections = getSectionsData(t, isEn);
        const section = sections.find((s) => s.id === id);

        if (section && section.subs && section.subs.length > 0) {
          // Logic for About and Contact: Open every sub-item
          if (id === "about" || id === "contact") {
            const subIds = section.subs.map((sub) => sub.id);
            return [id, ...subIds];
          }

          // Logic for Web and Stream: Only auto-expand the inquiry sub-item
          const inquirySub = section.subs.find((sub) =>
            sub.id.includes("inquiry"),
          );
          if (inquirySub) {
            return [id, inquirySub.id];
          }
        }

        return [id];
      });
    },
    [t, isEn],
  );

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
      className={`min-h-screen w-full font-sans overflow-y-auto flex relative transition-colors duration-700 ${
        isDragging ? "cursor-grabbing select-none" : "cursor-default"
      }`}
      style={{
        backgroundColor: currentTheme.bg,
        "--mouse-x": "95%",
        "--mouse-y": "95%",
        touchAction: isDragging ? "none" : "auto",
        // Add these to ensure no selection or callouts happen during drag
        userSelect: isDragging ? "none" : "auto",
        WebkitUserSelect: isDragging ? "none" : "auto",
        WebkitTouchCallout: isDragging ? "none" : "none",
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

export default Landing;
