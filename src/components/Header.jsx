import React from "react";
import { motion } from "framer-motion";

const Header = ({ t, isEn, toggleLang, textColor }) => (
  <header className="flex justify-between items-start w-full relative z-20">
    <span
      className="text-xl font-extralight tracking-tight flex items-center transition-colors duration-500"
      style={{ color: textColor }}
    >
      — &nbsp; {t("brand")}
    </span>
    <button
      onClick={toggleLang}
      style={{ borderColor: textColor }}
      className="w-16 h-8 bg-transparent border-[1px] rounded-full relative flex items-center shrink-0 cursor-pointer transition-colors duration-500 overflow-hidden"
    >
      {/* Labels */}
      <span
        className={`absolute left-2 text-[10px] font-bold transition-opacity duration-300 ${isEn ? "opacity-20" : "opacity-100"}`}
        style={{ color: textColor }}
      >
        EN
      </span>
      <span
        className={`absolute right-2 text-[10px] font-bold transition-opacity duration-300 ${!isEn ? "opacity-20" : "opacity-100"}`}
        style={{ color: textColor }}
      >
        DE
      </span>

      {/* The Moving Dot: Right (36px) for EN, Left (4px) for DE */}
      <motion.div
        initial={false}
        animate={{ x: isEn ? 36 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-5 h-5 rounded-full"
        style={{ backgroundColor: textColor }}
      />
    </button>
  </header>
);

export default Header;
