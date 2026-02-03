import React from "react";
import { motion } from "framer-motion";

const ThemeControls = ({
  themes,
  themeIndex,
  hoveredTheme,
  isExpanding,
  onThemeClick,
  onHover,
  textColor,
  currentThemeName,
  tagline, // Added prop
}) => (
  <footer className="flex justify-between items-end w-full mt-8 relative md:translate-y-4 z-20">
    <div
      className="flex items-center text-[10px] md:text-sm font-extralight leading-none"
      style={{ color: textColor }}
    >
      <span className="text-xl">—</span> &nbsp; {tagline}
    </div>
    <div className="flex gap-6 items-center">
      <span
        className="hidden md:block text-[10px] lowercase font-bold tracking-[0.2em] opacity-40 transition-colors duration-500"
        style={{ color: textColor }}
      >
        {currentThemeName}
      </span>
      <div className="flex flex-col md:flex-row gap-4 items-center absolute md:relative bottom-[2px] right-0 md:right-auto">
        {themes.map((tItem, idx) => {
          const isActive = themeIndex === idx;
          const isHovered = hoveredTheme === idx;
          const targetScale = isActive
            ? hoveredTheme !== null && !isHovered
              ? 0.6
              : 1.0
            : isHovered
              ? 0.8
              : 0.3;
          return (
            <button
              key={tItem.name}
              onClick={() => onThemeClick(idx)}
              onMouseEnter={() => onHover(idx)}
              onMouseLeave={() => onHover(null)}
              className="relative w-6 h-6 flex items-center justify-center cursor-pointer outline-none"
            >
              <motion.div
                animate={{
                  scale: targetScale,
                  opacity: isActive || isHovered ? 1 : 0.4,
                  backgroundColor: textColor,
                }}
                className="w-5 h-5 rounded-full"
                transition={{
                  scale: { type: "spring", stiffness: 900, damping: 40 },
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  </footer>
);

export default ThemeControls;
