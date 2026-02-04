import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import WebInquiryForm from "./WebInquiryForm";

const NavSection = ({
  title,
  id,
  subItems,
  openSections,
  onToggleLevel1,
  onToggleSub,
  t,
  theme,
  textColor,
}) => {
  const springConfig = { type: "spring", stiffness: 300, damping: 30 };
  const isOpen = openSections.includes(id);

  return (
    <section>
      <motion.div
        whileHover={{ x: 8, opacity: 0.7 }}
        className="flex items-center gap-4 mb-4 cursor-pointer w-fit group"
        onClick={() =>
          onToggleLevel1(
            id,
            subItems.map((s) => s.id),
          )
        }
        style={{ color: textColor }}
      >
        <span
          className={`text-3xl md:text-4xl font-light w-8 md:w-10 inline-flex justify-center transition-transform duration-500 ${!isOpen ? "group-hover:rotate-90" : ""}`}
        >
          {isOpen ? "-" : "+"}
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
          {title}
        </h1>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springConfig}
            className="pl-12 md:pl-14 space-y-1 overflow-hidden"
            style={{ color: textColor }}
          >
            {subItems.map((sub) => {
              // hide the "inquiry form" link on desktop since it has its own floating panel
              if (
                sub.type === "form" &&
                typeof window !== "undefined" &&
                window.innerWidth > 768
              )
                return null;

              return (
                <div key={sub.id}>
                  <button
                    onClick={() => onToggleSub(sub.id, id)}
                    className="flex items-center gap-2 text-base font-bold outline-none cursor-pointer hover:opacity-70 hover:translate-x-1 transition-all duration-300 group/sub"
                  >
                    <span
                      className={`w-4 inline-flex justify-center transition-transform duration-500 ${!openSections.includes(sub.id) ? "group-hover/sub:rotate-90" : ""}`}
                    >
                      {openSections.includes(sub.id) ? "-" : "+"}
                    </span>
                    <span className="lowercase">{t(sub.labelKey)}</span>
                  </button>

                  <AnimatePresence>
                    {openSections.includes(sub.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        {sub.type === "list" ? (
                          <ul className="mt-2 mb-4 space-y-3 pl-6 md:pl-8">
                            {sub.items.map((i, idx) => (
                              <li
                                key={i}
                                className="text-xs max-w-md flex gap-3 items-start"
                                style={{ color: theme.level3 }}
                              >
                                <span className="font-mono text-[10px] mt-[3.5px] opacity-25">
                                  {(idx + 1).toString().padStart(2, "0")}
                                </span>
                                <span className="leading-relaxed lowercase">
                                  {t(`${sub.translationPrefix}${i}`)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : sub.type === "form" ? (
                          <div className="w-full flex justify-center py-8 px-4 md:px-0 md:justify-start md:pl-8">
                            <div className="w-full max-w-md">
                              <WebInquiryForm
                                textColor={textColor}
                                t={t}
                                theme={theme}
                                hideHeading={true}
                              />
                            </div>
                          </div>
                        ) : (
                          <div
                            className="pl-6 md:pl-8 py-2 text-xs max-w-md lowercase leading-relaxed"
                            style={{ color: theme.level3 }}
                          >
                            {sub.contentIsLink ? (
                              <a
                                href={`mailto:${t(sub.contentKey)}`}
                                className="font-bold hover:opacity-70"
                              >
                                {t(sub.contentKey)}
                              </a>
                            ) : (
                              t(sub.contentKey)
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default NavSection;
