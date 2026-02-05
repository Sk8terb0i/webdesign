import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- ADJUSTED PRICES ---
const PRICING_CONFIG = {
  base: {
    landing: [500, 1300, 2000],
    new: [2000, 3500, 4500],
    redesign: [1500, 3500, 6000],
  },
  pageRate: [100, 100, 100],
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

const WebInquiryForm = ({ t, theme, hideHeading = false, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);

  const [formData, setFormData] = useState({
    type: "",
    pages: "",
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
  });

  const isStepComplete = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return !!(formData.type && formData.pages);
      case 2:
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
    if (formData.type === "landing") update("pages", "1-5");
  }, [formData.type]);

  const calculatedTiers = useMemo(() => {
    if (!formData.type) return [0, 0, 0];
    return [0, 1, 2].map((idx) => {
      let total = PRICING_CONFIG.base[formData.type][idx];
      if (formData.type === "landing") {
        total += PRICING_CONFIG.pageRate[idx] * 1;
      } else {
        if (formData.pages === "1-5")
          total += PRICING_CONFIG.pageRate[idx] * 2.5;
        if (formData.pages === "5-10")
          total += PRICING_CONFIG.pageRate[idx] * 7.5;
        if (formData.pages === "10+")
          total += PRICING_CONFIG.pageRate[idx] * 12;
      }
      formData.features.forEach((f) => {
        if (PRICING_CONFIG.features[f])
          total += PRICING_CONFIG.features[f][idx];
      });
      if (formData.features.includes("lang")) {
        const perLangCost =
          PRICING_CONFIG.language.technical +
          (formData.needsTranslation ? PRICING_CONFIG.language.translation : 0);
        total += formData.extraLangs * perLangCost;
      }
      if (formData.assets === "need") total += PRICING_CONFIG.assets[idx];
      if (formData.copy === "need") total += PRICING_CONFIG.copy[idx];
      return total;
    });
  }, [formData]);

  const update = (field, val) => {
    setShowError(false);
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleNext = () => {
    if (step === 6) {
      // Final Validation on Submit
      for (let i = 1; i <= 6; i++) {
        if (!isStepComplete(i)) {
          setStep(i);
          setShowError(true);
          return;
        }
      }
      setSubmitted(true);
      setTimeout(() => onSuccess?.(), 2000);
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
  }) => (
    <motion.button
      type="button"
      whileHover={
        !disabled && !selected ? { backgroundColor: `${theme.bg}22` } : {}
      }
      transition={{ duration: 0.1 }}
      onClick={disabled ? null : onClick}
      className={`group flex flex-col w-full px-4 py-3 border mb-2 transition-all relative outline-none
        ${disabled ? "cursor-not-allowed opacity-20" : "cursor-pointer"} 
        ${selected ? "pointer-events-none" : ""} 
      `}
      style={{
        color: selected ? theme.text : theme.bg,
        borderColor: selected ? theme.bg : `${theme.bg}44`,
        backgroundColor: selected ? theme.bg : "transparent",
      }}
    >
      <div className="flex items-center justify-between w-full relative z-10">
        <span className="text-[11px] tracking-wider font-medium">{label}</span>
        <div
          className={`w-1.5 h-1.5 transition-colors duration-200 ${isCheck ? "rotate-45" : "rounded-full"}`}
          style={{
            backgroundColor: selected ? theme.text : "transparent",
            border: `1px solid ${selected ? theme.text : theme.bg}`,
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

  return (
    <div className="w-full flex flex-col font-sans" style={{ color: theme.bg }}>
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
                      backgroundColor: theme.bg,
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
                        selected={formData.type === type}
                        onClick={() => update("type", type)}
                      />
                    ))}
                    {formData.type === "landing" && (
                      <p
                        className="text-[9px] mt-2 opacity-70 leading-relaxed italic border-l-2 pl-3"
                        style={{ borderColor: theme.bg }}
                      >
                        {t("form_scope_landing_note")}
                      </p>
                    )}
                    <div className="mt-8">
                      <h3 className="text-[10px] tracking-widest mb-1 opacity-70">
                        {t("form_pages_label")}
                      </h3>
                      <p className="text-[9px] mb-4 opacity-50 italic">
                        {t("form_pages_hint")}
                      </p>
                      {["1-5", "5-10", "10+"].map((p) => (
                        <Choice
                          key={p}
                          label={
                            p === "1-5" && formData.type === "landing" ? "1" : p
                          }
                          selected={formData.pages === p}
                          onClick={() => update("pages", p)}
                          disabled={formData.type === "landing" && p !== "1-5"}
                        />
                      ))}
                    </div>
                  </motion.section>
                )}

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
                        selected={formData.features.includes(f)}
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
                      style={{ borderColor: `${theme.bg}22` }}
                    >
                      <Choice
                        isCheck
                        label={t("form_feat_lang")}
                        sublabel={t("form_feat_lang_desc")}
                        selected={formData.features.includes("lang")}
                        onClick={() => {
                          const next = formData.features.includes("lang")
                            ? formData.features.filter((x) => x !== "lang")
                            : [...formData.features, "lang"];
                          update("features", next);
                        }}
                      />
                      {formData.features.includes("lang") && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="pl-4 space-y-4 mt-4"
                        >
                          <div>
                            <p className="text-[9px] tracking-widest mb-2 opacity-60">
                              {t("form_lang_count")}
                            </p>
                            <div className="flex gap-2">
                              {[1, 2, 3].map((num) => (
                                <button
                                  key={num}
                                  onClick={() => update("extraLangs", num)}
                                  className="px-4 py-2 border text-[10px]"
                                  style={{
                                    borderColor:
                                      formData.extraLangs === num
                                        ? theme.bg
                                        : `${theme.bg}44`,
                                    backgroundColor:
                                      formData.extraLangs === num
                                        ? theme.bg
                                        : "transparent",
                                    color:
                                      formData.extraLangs === num
                                        ? theme.text
                                        : theme.bg,
                                  }}
                                >
                                  +{num}
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
                              selected={formData.needsTranslation}
                              onClick={() => update("needsTranslation", true)}
                            />
                            <Choice
                              label={t("form_lang_service_no")}
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
                        selected={formData.assets === "ready"}
                        onClick={() => update("assets", "ready")}
                      />
                      <Choice
                        label={t("form_assets_need")}
                        selected={formData.assets === "need"}
                        onClick={() => update("assets", "need")}
                      />
                    </div>
                    <Choice
                      label={t("form_copy_provide")}
                      selected={formData.copy === "provide"}
                      onClick={() => update("copy", "provide")}
                    />
                    <Choice
                      label={t("form_copy_need")}
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
                      selected={formData.hosting === "github"}
                      onClick={() => update("hosting", "github")}
                    />
                    <Choice
                      label={t("form_host_ext")}
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
                            formData.selectedTier !== tier
                              ? { backgroundColor: `${theme.bg}11`, x: 4 }
                              : {}
                          }
                          transition={{ duration: 0.1 }}
                          onClick={() => update("selectedTier", tier)}
                          className="w-full p-5 border text-left transition-all relative outline-none cursor-pointer"
                          style={{
                            borderWidth: tier === "premium" ? "1.5px" : "1px",
                            borderColor:
                              formData.selectedTier === tier
                                ? theme.bg
                                : tier === "premium"
                                  ? `${theme.bg}88`
                                  : `${theme.bg}33`,
                            backgroundColor:
                              formData.selectedTier === tier
                                ? theme.bg
                                : "transparent",
                            color:
                              formData.selectedTier === tier
                                ? theme.text
                                : theme.bg,
                            zIndex: tier === "premium" ? 10 : 1,
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
                      placeholder={t("form_contact_placeholder")}
                      className="w-full border-b bg-transparent py-4 text-lg outline-none mb-6"
                      style={{ borderColor: theme.bg }}
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
                          style={{ borderColor: `${theme.bg}22` }}
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
              style={{ borderColor: `${theme.bg}22` }}
            >
              {showError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -top-4 left-0 text-[8px] font-bold tracking-widest"
                  style={{ color: theme.bg }}
                >
                  {t("form_error_required")}
                </motion.p>
              )}
              {step > 1 ? (
                <button
                  onClick={() => {
                    setShowError(false);
                    setStep(step - 1);
                  }}
                  className="group flex items-center cursor-pointer p-2 -ml-2 transition-transform active:scale-95"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={theme.bg}
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
                className="group flex items-center gap-3 cursor-pointer transition-all active:scale-95"
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
                    stroke={theme.bg}
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
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WebInquiryForm;
