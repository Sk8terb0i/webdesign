import React from "react";

const Header = ({ t, isEn, toggleLang, textColor }) => (
  <header className="flex justify-between items-start w-full relative z-20">
    <span
      className="text-xl font-extralight tracking-tight flex items-center"
      style={{ color: textColor }}
    >
      — &nbsp; {t("brand")}
    </span>
    <button
      onClick={toggleLang}
      style={{ borderColor: textColor }}
      className="w-16 h-8 bg-transparent border-[1px] rounded-full relative flex items-center group shrink-0 cursor-pointer transition-colors duration-500"
    >
      <span
        className={`absolute left-2 text-xs font-extralight transition-opacity duration-300 ${isEn ? "opacity-100" : "opacity-0"}`}
        style={{ color: textColor }}
      >
        EN
      </span>
      <span
        className={`absolute right-2 text-xs font-extralight transition-opacity duration-300 ${!isEn ? "opacity-100" : "opacity-0"}`}
        style={{ color: textColor }}
      >
        DE
      </span>
      <div
        style={{ backgroundColor: textColor }}
        className={`w-5 h-5 rounded-full transition-all duration-300 mx-1 ${isEn ? "translate-x-8" : "translate-x-0"}`}
      />
    </button>
  </header>
);

export default Header;
