import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// --- UPDATED PRICING CONFIG ---
const PRICING_CONFIG = {
  base: {
    // [Basic, Premium, Horse]
    new: [2000, 3000, 4500],
    redesign: [1200, 1800, 2800],
    landing: [600, 900, 1500],
  },
  // Per-page rates based on type
  rates: {
    new: 200,
    redesign: 120,
    landing: 0,
  },
  features: {
    shop_c: [1500, 2250, 3000],
    shop_e: [800, 1400, 2000],
    admin: [400, 950, 1500],
    book: [500, 1250, 2000],
    login: [1000, 2000, 3000],
    api: [200, 600, 1000],
  },
  language: {
    technical: 100,
    translation: 100,
  },
  assets: [200, 600, 1000],
  copy: [200, 600, 1000],
};

const WebInquiryForm = ({
  t,
  theme,
  hideHeading = false,
  onSuccess,
  readOnlyData = null,
}) => {
  const safeTheme = theme || { bg: "#000", text: "#fff" };
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);

  const [formData, setFormData] = useState(
    readOnlyData || {
      type: "new",
      pages: "2-5",
      features: [],
      extraLangs: 0,
      needsTranslation: false,
      assets: "",
      copy: "",
      hosting: "",
      selectedTier: "",
      contact: "",
      channel: "",
      messagingApp: "",
      details: "",
    },
  );

  const formatRange = (range) => {
    if (!range || !Array.isArray(range)) return `(free)`;
    return `chf ${range[0].toLocaleString()} - ${range[2].toLocaleString()}`;
  };

  // --- CALCULATES FULL PRICE FOR PAGE BUTTON LABELS ---
  const getPageRange = (p) => {
    if (!formData.type) return "select type first";

    const rate = PRICING_CONFIG.rates[formData.type];
    const baseRange = PRICING_CONFIG.base[formData.type];

    // Define min/max multipliers for the ranges
    const bounds = {
      "2-5": { min: 2, max: 5 },
      "5-10": { min: 5, max: 10 },
      "10+": { min: 10, max: 20 },
    };

    if (formData.type === "landing") {
      return `chf ${baseRange[0].toLocaleString()} - ${baseRange[2].toLocaleString()}`;
    }

    const b = bounds[p] || { min: 0, max: 0 };
    const minTotal = baseRange[0] + rate * b.min;
    const maxTotal = baseRange[2] + rate * b.max;

    return `chf ${minTotal.toLocaleString()} - ${maxTotal.toLocaleString()}`;
  };

  const isStepComplete = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return !!(formData.type && formData.pages);
      case 2:
        // If the 'lang' feature is selected, they must pick at least 1 extra language
        return formData.features.includes("lang")
          ? formData.extraLangs > 0
          : true;
      case 3:
        return !!(formData.assets && formData.copy);
      case 4:
        return !!formData.hosting;
      case 5:
        return !!formData.selectedTier;
      case 6:
        const hasContact = !!formData.contact && !!formData.channel;
        return formData.channel === "chat"
          ? hasContact && !!formData.messagingApp
          : hasContact;
      default:
        return false;
    }
  };

  useEffect(() => {
    if (readOnlyData) setFormData(readOnlyData);
  }, [readOnlyData]);

  useEffect(() => {
    if (formData.type === "landing" && !readOnlyData) {
      setFormData((prev) => ({ ...prev, pages: "2-5" }));
    }
  }, [formData.type, readOnlyData]);

  // --- UPDATED CALCULATION LOGIC ---
  const calculatedTiers = useMemo(() => {
    if (!formData.type) return [0, 0, 0];

    const rate = PRICING_CONFIG.rates[formData.type];

    return [0, 1, 2].map((idx) => {
      let total = PRICING_CONFIG.base[formData.type][idx];

      // Page additions
      if (formData.type !== "landing") {
        const multipliers = { "2-5": 3.5, "5-10": 7.5, "10+": 15 };
        total += rate * (multipliers[formData.pages] || 0);
      }

      // Feature additions
      formData.features.forEach((f) => {
        if (PRICING_CONFIG.features[f])
          total += PRICING_CONFIG.features[f][idx];
      });

      if (formData.features.includes("lang")) {
        const perLangCost =
          PRICING_CONFIG.language.technical +
          (formData.needsTranslation ? PRICING_CONFIG.language.translation : 0);
        total += (formData.extraLangs || 0) * perLangCost;
      }

      if (formData.assets === "need") total += PRICING_CONFIG.assets[idx];
      if (formData.copy === "need") total += PRICING_CONFIG.copy[idx];

      return total;
    });
  }, [formData]);

  const update = (field, val) => {
    if (readOnlyData) return;
    setShowError(false);
    setFormData((prev) => {
      const isDeselecting = prev[field] === val;
      const newValue = isDeselecting ? "" : val;
      if (field === "type" && val === "landing" && isDeselecting) {
        return { ...prev, [field]: "", pages: "" };
      }
      return { ...prev, [field]: newValue };
    });
  };

  const handleNext = async () => {
    if (readOnlyData) return;
    if (step === 6) {
      for (let i = 1; i <= 6; i++) {
        if (!isStepComplete(i)) {
          setStep(i);
          setShowError(true);
          return;
        }
      }
      try {
        await addDoc(collection(db, "inquiries"), {
          ...formData,
          calculatedTiers,
          createdAt: serverTimestamp(),
        });
        setSubmitted(true);
        setTimeout(() => onSuccess?.(), 2000);
      } catch (error) {
        console.error("Error adding document: ", error);
        alert("Something went wrong. Please try again.");
      }
    } else {
      setStep(step + 1);
    }
  };

  const Choice = ({
    label,
    sublabel,
    selected,
    onClick,
    disabled = false,
    isCheck = false,
  }) => {
    const isViewOnly = !!readOnlyData;
    const supportsHover =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover)").matches;

    return (
      <motion.button
        type="button"
        whileHover={
          supportsHover && !disabled && !selected && !isViewOnly
            ? { backgroundColor: `${safeTheme.bg}11` }
            : {}
        }
        whileTap={!disabled && !isViewOnly ? { scale: 0.98 } : {}}
        transition={{ duration: 0.1 }}
        onClick={(e) => {
          if (disabled || isViewOnly) return;
          onClick();
          e.currentTarget.blur();
        }}
        className={`group flex flex-col w-full px-4 py-3 border mb-2 transition-all relative outline-none
        ${disabled || isViewOnly ? "cursor-default opacity-100" : "cursor-pointer"} 
      `}
        style={{
          color: selected ? safeTheme.text : safeTheme.bg,
          borderColor: selected ? safeTheme.bg : `${safeTheme.bg}44`,
          backgroundColor: selected ? safeTheme.bg : "transparent",
          opacity: isViewOnly && !selected ? 0.3 : 1,
        }}
      >
        <div className="flex items-center justify-between w-full relative z-10">
          <span className="text-[11px] tracking-wider font-medium">
            {label}
          </span>
          <div
            className={`w-1.5 h-1.5 transition-colors duration-200 ${isCheck ? "rotate-45" : "rounded-full"}`}
            style={{
              backgroundColor: selected ? safeTheme.text : "transparent",
              border: `1px solid ${selected ? safeTheme.text : safeTheme.bg}`,
            }}
          />
        </div>
        {sublabel && (
          <span className="text-[9px] mt-1 opacity-60 text-left relative z-10">
            {sublabel}
          </span>
        )}
      </motion.button>
    );
  };

  return (
    <div
      className="w-full flex flex-col font-sans"
      style={{ color: safeTheme.bg }}
    >
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-grow flex flex-col items-center justify-center min-h-[450px]"
          >
            <h2 className="text-xl font-bold tracking-tighter mb-2">
              {t("form_success_title")}
            </h2>
            <p className="text-[10px] opacity-60 tracking-widest text-center">
              {t("form_success_body")}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {!hideHeading && (
              <header className="mb-8">
                <h2 className="text-2xl font-bold tracking-tighter mb-2">
                  {t("form_title_web")}
                </h2>
                <p className="text-[10px] opacity-60 tracking-widest">
                  {t("form_subtitle")}
                </p>
              </header>
            )}

            <div className="mb-8">
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5, 6].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setShowError(false);
                      setStep(s);
                    }}
                    className="h-1 flex-grow transition-all duration-300 cursor-pointer border-none p-0 relative group"
                    style={{
                      backgroundColor: safeTheme.bg,
                      opacity: step === s ? 1 : 0.15,
                    }}
                  >
                    <div className="absolute -inset-y-3 inset-x-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-grow min-h-[450px]">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.section
                    key="s1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <h3 className="text-sm font-bold tracking-tighter mb-6">
                      {t("section_1")}
                    </h3>
                    {["new", "redesign", "landing"].map((type) => (
                      <Choice
                        key={type}
                        label={t(`form_scope_${type}`)}
                        sublabel=""
                        selected={formData.type === type}
                        onClick={() => update("type", type)}
                      />
                    ))}

                    <div className="mt-8">
                      <h3 className="text-[10px] tracking-widest mb-1 opacity-70">
                        {t("form_pages_label")}
                      </h3>
                      {["2-5", "5-10", "10+"].map((p) => {
                        if (formData.type === "landing" && p !== "2-5")
                          return null;
                        return (
                          <Choice
                            key={p}
                            label={
                              p === "2-5" && formData.type === "landing"
                                ? "1"
                                : p
                            }
                            sublabel={getPageRange(p)}
                            selected={formData.pages === p}
                            onClick={() => update("pages", p)}
                            disabled={!formData.type}
                          />
                        );
                      })}
                    </div>
                  </motion.section>
                )}

                {/* Rest of the steps remain unchanged... */}
                {step === 2 && (
                  <motion.section
                    key="s2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <h3 className="text-sm font-bold tracking-tighter mb-6">
                      {t("section_2")}
                    </h3>
                    {Object.keys(PRICING_CONFIG.features).map((f) => (
                      <Choice
                        key={f}
                        isCheck
                        label={t(`form_feat_${f}`)}
                        sublabel={formatRange(PRICING_CONFIG.features[f])}
                        selected={formData.features?.includes(f)}
                        onClick={() => {
                          const next = formData.features.includes(f)
                            ? formData.features.filter((x) => x !== f)
                            : [...formData.features, f];
                          update("features", next);
                        }}
                      />
                    ))}

                    <div
                      className="mt-4 border-t pt-4"
                      style={{ borderColor: `${safeTheme.bg}22` }}
                    >
                      <Choice
                        isCheck
                        label={t("form_feat_lang")}
                        selected={formData.features?.includes("lang")}
                        onClick={() => {
                          const next = formData.features.includes("lang")
                            ? formData.features.filter((x) => x !== "lang")
                            : [...formData.features, "lang"];
                          update("features", next);
                        }}
                      />

                      {formData.features?.includes("lang") && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="pl-4 space-y-4 mt-4 overflow-hidden"
                        >
                          <div>
                            <p className="text-[9px] tracking-widest mb-2 opacity-60">
                              {t("form_lang_count")}
                            </p>
                            <div className="flex gap-2">
                              {[1, 2, 3].map((num) => (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() => update("extraLangs", num)}
                                  className={`flex flex-col items-center justify-center min-w-[60px] py-2 border transition-colors ${readOnlyData ? "cursor-default" : "cursor-pointer"}`}
                                  style={{
                                    borderColor:
                                      formData.extraLangs === num
                                        ? safeTheme.bg
                                        : `${safeTheme.bg}44`,
                                    backgroundColor:
                                      formData.extraLangs === num
                                        ? safeTheme.bg
                                        : "transparent",
                                    color:
                                      formData.extraLangs === num
                                        ? safeTheme.text
                                        : safeTheme.bg,
                                    opacity:
                                      readOnlyData &&
                                      formData.extraLangs !== num
                                        ? 0.3
                                        : 1,
                                  }}
                                >
                                  <span className="text-[10px] font-bold">
                                    +{num}
                                  </span>
                                  {/* Price shown here for the technical setup of that amount */}
                                  <span className="text-[7px] opacity-70">
                                    chf{" "}
                                    {num * PRICING_CONFIG.language.technical}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-[9px] tracking-widest mb-2 opacity-60">
                              {t("form_lang_service")}
                            </p>
                            <Choice
                              label={t("form_lang_service_yes")}
                              // Price for translation based on amount picked above
                              sublabel={`chf ${(formData.extraLangs || 1) * PRICING_CONFIG.language.translation}`}
                              selected={formData.needsTranslation}
                              onClick={() => update("needsTranslation", true)}
                            />
                            <Choice
                              label={t("form_lang_service_no")}
                              sublabel="(free)"
                              selected={!formData.needsTranslation}
                              onClick={() => update("needsTranslation", false)}
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.section>
                )}

                {step === 3 && (
                  <motion.section
                    key="s3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <h3 className="text-sm font-bold tracking-tighter mb-6">
                      {t("section_3")}
                    </h3>
                    <div className="mb-6">
                      <Choice
                        label={t("form_assets_ready")}
                        sublabel="(free)"
                        selected={formData.assets === "ready"}
                        onClick={() => update("assets", "ready")}
                      />
                      <Choice
                        label={t("form_assets_need")}
                        sublabel={formatRange(PRICING_CONFIG.assets)}
                        selected={formData.assets === "need"}
                        onClick={() => update("assets", "need")}
                      />
                    </div>
                    <Choice
                      label={t("form_copy_provide")}
                      sublabel="(free)"
                      selected={formData.copy === "provide"}
                      onClick={() => update("copy", "provide")}
                    />
                    <Choice
                      label={t("form_copy_need")}
                      sublabel={formatRange(PRICING_CONFIG.copy)}
                      selected={formData.copy === "need"}
                      onClick={() => update("copy", "need")}
                    />
                  </motion.section>
                )}

                {step === 4 && (
                  <motion.section
                    key="s4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <h3 className="text-sm font-bold tracking-tighter mb-6">
                      {t("section_4")}
                    </h3>
                    <Choice
                      label={t("form_host_free")}
                      sublabel="(free)"
                      selected={formData.hosting === "github"}
                      onClick={() => update("hosting", "github")}
                    />
                    <Choice
                      label={t("form_host_ext")}
                      sublabel="(free)"
                      selected={formData.hosting === "external"}
                      onClick={() => update("hosting", "external")}
                    />
                  </motion.section>
                )}

                {step === 5 && (
                  <motion.section
                    key="s5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="mb-6">
                      <h3 className="text-sm font-bold tracking-tighter">
                        {t("section_level")}
                      </h3>
                      <p className="text-[9px] opacity-50 italic mt-1">
                        {t("form_price_disclaimer")}
                      </p>
                    </div>
                    <div className="space-y-4">
                      {["basic", "premium", "horse"].map((tier, i) => (
                        <motion.button
                          key={tier}
                          whileHover={
                            formData.selectedTier !== tier && !readOnlyData
                              ? { backgroundColor: `${safeTheme.bg}11`, x: 4 }
                              : {}
                          }
                          transition={{ duration: 0.1 }}
                          onClick={(e) => {
                            update("selectedTier", tier);
                            e.currentTarget.blur();
                          }}
                          className={`w-full p-5 border text-left transition-all relative outline-none ${readOnlyData ? "cursor-default" : "cursor-pointer"}`}
                          style={{
                            borderWidth: tier === "premium" ? "1.5px" : "1px",
                            borderColor:
                              formData.selectedTier === tier
                                ? safeTheme.bg
                                : tier === "premium"
                                  ? `${safeTheme.bg}88`
                                  : `${safeTheme.bg}33`,
                            backgroundColor:
                              formData.selectedTier === tier
                                ? safeTheme.bg
                                : "transparent",
                            color:
                              formData.selectedTier === tier
                                ? safeTheme.text
                                : safeTheme.bg,
                            zIndex: tier === "premium" ? 10 : 1,
                            opacity:
                              readOnlyData && formData.selectedTier !== tier
                                ? 0.3
                                : 1,
                          }}
                        >
                          <div className="flex justify-between items-end">
                            <div className="flex flex-col">
                              <span className="text-[10px] tracking-widest font-bold">
                                {t(`level_${tier}`)}
                              </span>
                              <span className="text-[9px] opacity-60 mt-0.5">
                                {tier === "premium"
                                  ? t("recommended_path")
                                  : ""}
                              </span>
                            </div>
                            <span className="text-xl font-bold">
                              CHF {calculatedTiers[i].toLocaleString()}
                            </span>
                          </div>
                          <p className="text-[9px] mt-3 opacity-70 leading-relaxed max-w-[80%]">
                            {t(`level_${tier}_desc`)}
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </motion.section>
                )}

                {step === 6 && (
                  <motion.section
                    key="s6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <h3 className="text-sm font-bold tracking-tighter mb-6">
                      {t("get_in_touch_out")}
                    </h3>
                    <input
                      readOnly={!!readOnlyData}
                      value={formData.contact}
                      placeholder={t("form_contact_placeholder")}
                      className="w-full border-b bg-transparent py-4 text-lg outline-none mb-6"
                      style={{ borderColor: safeTheme.bg }}
                      onChange={(e) => update("contact", e.target.value)}
                    />
                    <div className="space-y-2 mb-4">
                      {["email", "call", "chat"].map((ch) => (
                        <Choice
                          key={ch}
                          label={t(`form_channel_${ch}`)}
                          selected={formData.channel === ch}
                          onClick={() => update("channel", ch)}
                        />
                      ))}
                    </div>
                    <AnimatePresence>
                      {formData.channel === "chat" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-2 border-t"
                          style={{ borderColor: `${safeTheme.bg}22` }}
                        >
                          <p className="text-[9px] tracking-widest mb-3 opacity-60 mt-2">
                            Preferred messaging app:
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {["WhatsApp", "Signal", "Telegram", "SMS"].map(
                              (app) => (
                                <Choice
                                  key={app}
                                  label={app}
                                  selected={formData.messagingApp === app}
                                  onClick={() => update("messagingApp", app)}
                                />
                              ),
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.section>
                )}
              </AnimatePresence>
            </div>

            <footer
              className="mt-8 pt-6 border-t flex justify-between items-center relative"
              style={{ borderColor: `${safeTheme.bg}22` }}
            >
              {showError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -top-4 left-0 text-[8px] font-bold tracking-widest"
                  style={{ color: safeTheme.bg }}
                >
                  {t("form_error_required")}
                </motion.p>
              )}
              {!readOnlyData ? (
                <>
                  {step > 1 ? (
                    <button
                      onClick={() => {
                        setShowError(false);
                        setStep(step - 1);
                      }}
                      className="group flex items-center cursor-pointer p-2 -ml-2 transition-transform active:scale-95 outline-none"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={safeTheme.bg}
                        strokeWidth="1.5"
                      >
                        <path
                          d="M19 12H5M5 12L12 19M5 12L12 5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  ) : (
                    <div />
                  )}
                  <button
                    onClick={handleNext}
                    className="group flex items-center gap-3 cursor-pointer transition-all active:scale-95 outline-none"
                  >
                    {step === 6 && (
                      <span className="text-[10px] tracking-[0.2em] opacity-100">
                        {t("form_submit")}
                      </span>
                    )}
                    <div className="p-2 -mr-2 transition-transform group-hover:translate-x-1">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={safeTheme.bg}
                        strokeWidth="1.5"
                      >
                        <path
                          d="M5 12H19M19 12L12 5M19 12L12 19"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </button>
                </>
              ) : (
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar w-full">
                  {[1, 2, 3, 4, 5, 6].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStep(s)}
                      className="text-[9px] px-3 py-1 border font-bold tracking-tighter"
                      style={{
                        backgroundColor:
                          step === s ? safeTheme.bg : "transparent",
                        color: step === s ? safeTheme.text : safeTheme.bg,
                        borderColor: safeTheme.bg,
                      }}
                    >
                      Step {s}
                    </button>
                  ))}
                </div>
              )}
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WebInquiryForm;
