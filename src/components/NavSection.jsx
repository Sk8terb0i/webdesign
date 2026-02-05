import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import WebInquiryForm from "./WebInquiryForm";
import StreamInquiryForm from "./StreamInquiryForm";
import GeneralInquiryForm from "./GeneralInquiryForm";
import PhotoCollage from "./PhotoCollage";

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
            className="space-y-1 overflow-hidden"
            style={{ color: textColor }}
          >
            {subItems.map((sub) => {
              const isSubOpen = openSections.includes(sub.id);

              return (
                <div key={sub.id} className="relative">
                  <button
                    onClick={() => onToggleSub(sub.id, id)}
                    className="flex items-center gap-2 text-base font-bold outline-none cursor-pointer hover:opacity-70 hover:translate-x-1 transition-all duration-300 group/sub pl-12 md:pl-14 relative z-20"
                  >
                    <span
                      className={`w-4 inline-flex justify-center transition-transform duration-500 ${!isSubOpen ? "group-hover/sub:rotate-90" : ""}`}
                    >
                      {isSubOpen ? "-" : "+"}
                    </span>
                    <span className="lowercase">{t(sub.labelKey)}</span>
                  </button>

                  <AnimatePresence>
                    {isSubOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="relative"
                      >
                        {sub.type === "list" ? (
                          <ul className="mt-2 mb-4 space-y-3 pl-[4.5rem] md:pl-[5rem]">
                            {sub.items.map((i, idx) => (
                              <li
                                key={i}
                                className="text-xs max-w-md flex gap-3 items-start"
                                style={{ color: theme.level3 }}
                              >
                                <span className="font-mono text-[10px] mt-[3.5px] opacity-25">
                                  {(idx + 1).toString().padStart(2, "0")}
                                </span>
                                <span className="leading-relaxed">
                                  {t(`${sub.translationPrefix}${i}`)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : sub.type === "form" ? (
                          <div className="w-full relative mt-4 md:hidden">
                            <div
                              className="absolute inset-0 z-0"
                              style={{
                                backgroundColor: theme.text,
                                backdropFilter: "blur(8px)",
                              }}
                            />
                            <div className="relative z-10 w-full flex justify-center py-12 px-6">
                              <div className="w-full max-w-md">
                                {sub.id === "web-inquiry" ? (
                                  <WebInquiryForm
                                    textColor={textColor}
                                    t={t}
                                    theme={theme}
                                    hideHeading={true}
                                    onSuccess={() => onToggleLevel1(id, [])}
                                  />
                                ) : sub.id === "stream-inquiry" ? (
                                  <StreamInquiryForm
                                    textColor={textColor}
                                    t={t}
                                    theme={theme}
                                    hideHeading={true}
                                    onSuccess={() => onToggleLevel1(id, [])}
                                  />
                                ) : (
                                  <GeneralInquiryForm
                                    t={t}
                                    theme={theme}
                                    onSuccess={() => onToggleLevel1(id, [])}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        ) : sub.type === "link" ? (
                          <div className="pl-[4.5rem] md:pl-[5rem] py-2">
                            <a
                              href={sub.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-bold hover:opacity-70 transition-opacity flex items-center gap-2 w-fit"
                              style={{ color: theme.level3 }}
                            >
                              {/* Just the filename, no label, no brackets */}
                              <span>{sub.fileName}</span>

                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                              </svg>
                            </a>
                          </div>
                        ) : (
                          <>
                            <div
                              className="pl-[4.5rem] md:pl-[5rem] py-2 text-xs max-w-md leading-relaxed"
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

                            {sub.id === "about-details" && (
                              <div className="md:hidden w-full h-[350px] mt-4 pointer-events-auto relative">
                                <PhotoCollage theme={theme} />
                              </div>
                            )}
                          </>
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
