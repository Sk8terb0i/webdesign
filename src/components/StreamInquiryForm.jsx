import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const STREAM_CONFIG = {
  fixed: 500,
  dayBase: 500,
  dayExtra: 250,
  camBase: 200,
  camExtra: 100,
  assistantFlat: 400,
  platformBase: 300,
  platformExtra: 100,
  recordingLocal: 150,
  typeRates: { local: 200, remote: 500 },
  overlayRates: { none: 0, basic: 150, custom: 400 },
  editRate: 200,
};

const StreamInquiryForm = ({ t, theme, hideHeading = false, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);

  const [formData, setFormData] = useState({
    days: 1,
    cameras: 1,
    type: "local",
    platforms: 1,
    recording: "none",
    overlays: "none",
    edits: 0,
    contact: "",
    channel: "",
    messagingApp: "",
    details: "",
  });

  const isStepComplete = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return !!(formData.days && formData.cameras);
      case 2:
        return !!(formData.type && formData.platforms);
      case 3:
        return !!(formData.recording && formData.overlays);
      case 4:
        const hasContact = !!formData.contact && !!formData.channel;
        return formData.channel === "chat"
          ? hasContact && !!formData.messagingApp
          : hasContact;
      default:
        return false;
    }
  };

  const totalEstimate = useMemo(() => {
    let total = STREAM_CONFIG.fixed;
    total +=
      STREAM_CONFIG.dayBase + (formData.days - 1) * STREAM_CONFIG.dayExtra;
    total +=
      STREAM_CONFIG.camBase + (formData.cameras - 1) * STREAM_CONFIG.camExtra;
    if (formData.cameras >= 3) total += STREAM_CONFIG.assistantFlat;
    total += STREAM_CONFIG.typeRates[formData.type];
    total +=
      STREAM_CONFIG.platformBase +
      (formData.platforms - 1) * STREAM_CONFIG.platformExtra;
    if (formData.recording === "local") total += STREAM_CONFIG.recordingLocal;
    total += STREAM_CONFIG.overlayRates[formData.overlays];
    total += formData.edits * STREAM_CONFIG.editRate;
    return total;
  }, [formData]);

  const update = (field, val) => {
    setShowError(false);
    setFormData((prev) => ({
      ...prev,
      // If the value is already selected, reset to default/empty
      [field]:
        prev[field] === val
          ? field === "days" || field === "cameras" || field === "platforms"
            ? 1
            : ""
          : val,
    }));
  };

  const handleNext = async () => {
    if (step === 4) {
      if (!isStepComplete(4)) {
        setShowError(true);
        return;
      }
      try {
        await addDoc(collection(db, "inquiries_stream"), {
          ...formData,
          totalEstimate,
          createdAt: serverTimestamp(),
        });
        setSubmitted(true);
        setTimeout(() => onSuccess?.(), 2000);
      } catch (e) {
        console.error(e);
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
    // Check if the device actually supports hover to prevent "sticky" states
    const supportsHover =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover)").matches;

    return (
      <motion.button
        type="button"
        // Only apply hover if supported AND not selected
        whileHover={
          supportsHover && !disabled && !selected
            ? { backgroundColor: `${theme.bg}11` }
            : {}
        }
        // Feedback for the actual click/tap
        whileTap={!disabled ? { scale: 0.98 } : {}}
        transition={{ duration: 0.1 }}
        onClick={(e) => {
          if (disabled) return;
          onClick();
          // Blur the element so it doesn't keep "focus" styles/hover state
          e.currentTarget.blur();
        }}
        className={`group flex flex-col w-full px-4 py-3 border mb-2 transition-all relative outline-none
        ${disabled ? "cursor-not-allowed opacity-20" : "cursor-pointer"} 
      `}
        style={{
          color: selected ? theme.text : theme.bg,
          borderColor: selected ? theme.bg : `${theme.bg}44`,
          backgroundColor: selected ? theme.bg : "transparent",
        }}
      >
        <div className="flex items-center justify-between w-full relative z-10">
          <span className="text-[11px] tracking-wider font-medium">
            {label}
          </span>
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
  };

  return (
    <div className="w-full flex flex-col font-sans" style={{ color: theme.bg }}>
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {!hideHeading && (
              <header className="mb-8">
                <h2 className="text-2xl font-bold tracking-tighter mb-2">
                  {t("form_title_stream")}
                </h2>
                <p className="text-[10px] opacity-60 tracking-widest">
                  {t("form_subtitle")}
                </p>
              </header>
            )}

            <div className="mb-8">
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4].map((s) => (
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
                      {t("section_stream_core")}
                    </h3>
                    <div className="mb-8">
                      <p className="text-[9px] tracking-widest mb-3 opacity-60">
                        {t("form_stream_days")}
                      </p>
                      <div className="flex gap-2">
                        {[1, 2, 3].map((n) => (
                          <button
                            key={n}
                            onClick={() => update("days", n)}
                            className="px-5 py-2 border text-[10px]"
                            style={{
                              backgroundColor:
                                formData.days === n ? theme.bg : "transparent",
                              color:
                                formData.days === n ? theme.text : theme.bg,
                              borderColor: theme.bg,
                            }}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] tracking-widest mb-3 opacity-60">
                        {t("form_stream_cams")}
                      </p>
                      <div className="flex gap-2 mb-3">
                        {[1, 2, 3, 4].map((n) => (
                          <button
                            key={n}
                            onClick={() => update("cameras", n)}
                            className="flex-1 py-3 border text-[10px]"
                            style={{
                              backgroundColor:
                                formData.cameras === n
                                  ? theme.bg
                                  : "transparent",
                              color:
                                formData.cameras === n ? theme.text : theme.bg,
                              borderColor: theme.bg,
                            }}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                      {formData.cameras >= 3 && (
                        <p
                          className="text-[9px] italic opacity-70 border-l-2 pl-3"
                          style={{ borderColor: theme.bg }}
                        >
                          {t("form_stream_cams_hint")}
                        </p>
                      )}
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
                      {t("section_stream_infra")}
                    </h3>
                    <Choice
                      label={t("form_stream_type_local")}
                      selected={formData.type === "local"}
                      onClick={() => update("type", "local")}
                    />
                    <Choice
                      label={t("form_stream_type_remote")}
                      selected={formData.type === "remote"}
                      onClick={() => update("type", "remote")}
                    />
                    <div className="mt-8">
                      <p className="text-[9px] tracking-widest mb-3 opacity-60">
                        {t("form_stream_dest")}
                      </p>
                      <Choice
                        label={t("form_stream_dest_single")}
                        selected={formData.platforms === 1}
                        onClick={() => update("platforms", 1)}
                      />
                      <Choice
                        label={t("form_stream_dest_multi")}
                        selected={formData.platforms > 1}
                        onClick={() => update("platforms", 2)}
                      />
                      {formData.platforms > 1 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 pl-4 border-l-2"
                          style={{ borderColor: `${theme.bg}22` }}
                        >
                          <p className="text-[9px] mb-3 opacity-60">
                            {t("form_stream_platforms_count")}
                          </p>
                          <div className="flex gap-2">
                            {[2, 3, 4].map((n) => (
                              <button
                                key={n}
                                onClick={() => update("platforms", n)}
                                className="px-4 py-2 border text-[10px]"
                                style={{
                                  backgroundColor:
                                    formData.platforms === n
                                      ? theme.bg
                                      : "transparent",
                                  color:
                                    formData.platforms === n
                                      ? theme.text
                                      : theme.bg,
                                  borderColor: theme.bg,
                                }}
                              >
                                {n}
                              </button>
                            ))}
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
                      {t("section_stream_extras")}
                    </h3>
                    <p className="text-[9px] tracking-widest mb-3 opacity-60">
                      {t("form_stream_rec")}
                    </p>
                    <Choice
                      label={t("form_stream_rec_none")}
                      selected={formData.recording === "none"}
                      onClick={() => update("recording", "none")}
                    />
                    <Choice
                      label={t("form_stream_rec_local")}
                      selected={formData.recording === "local"}
                      onClick={() => update("recording", "local")}
                    />
                    <p className="text-[9px] tracking-widest mb-3 mt-6 opacity-60">
                      {t("form_stream_overlay")}
                    </p>
                    {["none", "basic", "custom"].map((lvl) => (
                      <Choice
                        key={lvl}
                        label={t(`form_stream_overlay_${lvl}`)}
                        selected={formData.overlays === lvl}
                        onClick={() => update("overlays", lvl)}
                      />
                    ))}
                  </motion.section>
                )}

                {step === 4 && (
                  <motion.section
                    key="s4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div
                      className="mb-8 p-6 border"
                      style={{ borderColor: theme.bg }}
                    >
                      <p className="text-[10px] tracking-widest opacity-60 mb-1">
                        {t("form_total_estimate")}
                      </p>
                      <p className="text-4xl font-bold">
                        CHF {totalEstimate.toLocaleString()}
                      </p>
                      <p className="text-[9px] italic opacity-50 mt-4 leading-relaxed">
                        {t("form_price_disclaimer")}
                      </p>
                    </div>
                    <h3 className="text-sm font-bold tracking-tighter mb-6">
                      {t("get_in_touch_out")}
                    </h3>
                    <input
                      placeholder={t("form_contact_placeholder")}
                      className="w-full border-b bg-transparent py-4 text-lg outline-none mb-6"
                      style={{ borderColor: theme.bg }}
                      value={formData.contact}
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
                {step === 4 && (
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

export default StreamInquiryForm;
