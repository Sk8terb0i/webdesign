import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const GeneralInquiryForm = ({ t, theme, onSuccess, data = null }) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);

  const [formData, setFormData] = useState({
    name: data?.name || "", // Added name field
    message: data?.message || "",
    contact: data?.contact || "",
    channel: data?.channel || "",
    messagingApp: data?.messagingApp || "",
  });

  const isAdmin = !!data;

  const update = (field, val) => {
    if (isAdmin) return;
    setShowError(false);
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleNext = async (e) => {
    if (e) e.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      if (isAdmin) return;
      const hasName = !!formData.name && formData.name.trim() !== ""; // Name validation
      const hasMessage = !!formData.message && formData.message.trim() !== "";
      const hasContact = !!formData.contact && !!formData.channel;
      const chatValid =
        formData.channel === "chat" ? !!formData.messagingApp : true;

      if (!hasName || !hasMessage || !hasContact || !chatValid) {
        setShowError(true);
        return;
      }

      try {
        await addDoc(collection(db, "inquiries"), {
          ...formData,
          formType: "general",
          createdAt: serverTimestamp(),
        });
        setSubmitted(true);
        setTimeout(() => onSuccess?.(), 2000);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const Choice = ({ label, selected, onClick }) => {
    const supportsHover =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover)").matches;

    const isInteractionDisabled = isAdmin;

    return (
      <motion.button
        type="button"
        whileHover={
          supportsHover && !selected && !isInteractionDisabled
            ? { backgroundColor: `${theme.bg}11` }
            : {}
        }
        onClick={(e) => {
          if (isInteractionDisabled) return;
          onClick();
          e.currentTarget.blur();
        }}
        className={`group flex flex-col w-full px-4 py-3 border mb-2 transition-all outline-none ${isInteractionDisabled ? "cursor-default" : "cursor-pointer"}`}
        style={{
          color: selected ? theme.text : theme.bg,
          borderColor: selected ? theme.bg : `${theme.bg}44`,
          backgroundColor: selected ? theme.bg : "transparent",
          opacity: isAdmin && !selected ? 0.3 : 1,
        }}
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] tracking-wider font-medium">
            {label}
          </span>
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: selected ? theme.text : "transparent",
              border: `1px solid ${selected ? theme.text : theme.bg}`,
            }}
          />
        </div>
      </motion.button>
    );
  };

  return (
    <div className="w-full flex flex-col font-sans" style={{ color: theme.bg }}>
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-grow flex flex-col items-center justify-center min-h-[400px]"
          >
            <h2 className="text-xl font-bold tracking-tighter mb-2">
              {t("form_success_title")}
            </h2>
            <p className="text-[10px] opacity-60 tracking-widest text-center">
              {t("form_success_body")}
            </p>
          </motion.div>
        ) : (
          <motion.div key="form-container">
            <header className="mb-8">
              <h2 className="text-2xl font-bold tracking-tighter mb-2">
                {isAdmin
                  ? `INQUIRY: ${formData.name || formData.contact}`
                  : t("contact_me")}
              </h2>
              <div className="flex gap-1 mt-4">
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    className="h-1 flex-grow cursor-pointer"
                    onClick={() => setStep(s)}
                    style={{
                      backgroundColor: theme.bg,
                      opacity: step === s ? 1 : 0.15,
                    }}
                  />
                ))}
              </div>
            </header>

            <div className="min-h-[350px]">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.section
                    key="step1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <h3 className="text-sm font-bold tracking-tighter mb-6">
                      {t("message_label")}
                    </h3>
                    <textarea
                      readOnly={isAdmin}
                      placeholder={t("message_placeholder")}
                      className={`w-full bg-transparent border-b py-4 text-sm outline-none resize-none min-h-[150px] ${isAdmin ? "cursor-default" : "cursor-text"}`}
                      style={{
                        borderColor:
                          showError && !formData.message
                            ? theme.bg
                            : `${theme.bg}44`,
                      }}
                      value={formData.message}
                      onChange={(e) => update("message", e.target.value)}
                    />
                  </motion.section>
                ) : (
                  <motion.section
                    key="step2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <h3 className="text-sm font-bold tracking-tighter mb-6">
                      {t("get_in_touch")}
                    </h3>

                    {/* Name Field */}
                    <input
                      readOnly={isAdmin}
                      placeholder={t("form_name_label") || "Name"}
                      className={`w-full border-b bg-transparent py-4 text-lg outline-none mb-4 ${isAdmin ? "cursor-default" : "cursor-text"}`}
                      style={{
                        borderColor:
                          showError && !formData.name
                            ? theme.bg
                            : `${theme.bg}44`,
                      }}
                      value={formData.name}
                      onChange={(e) => update("name", e.target.value)}
                    />

                    {/* Contact Field */}
                    <input
                      readOnly={isAdmin}
                      placeholder={t("form_contact_placeholder")}
                      className={`w-full border-b bg-transparent py-4 text-lg outline-none mb-6 ${isAdmin ? "cursor-default" : "cursor-text"}`}
                      style={{
                        borderColor:
                          showError && !formData.contact
                            ? theme.bg
                            : `${theme.bg}44`,
                      }}
                      value={formData.contact}
                      onChange={(e) => update("contact", e.target.value)}
                    />

                    {["email", "call", "chat"].map((ch) => (
                      <Choice
                        key={ch}
                        label={t(`form_channel_${ch}`)}
                        selected={formData.channel === ch}
                        onClick={() => update("channel", ch)}
                      />
                    ))}
                    {formData.channel === "chat" && (
                      <div className="grid grid-cols-2 gap-2 mt-4">
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
                    )}
                  </motion.section>
                )}
              </AnimatePresence>
            </div>

            <footer
              className="mt-8 pt-6 border-t flex flex-col gap-4"
              style={{ borderColor: `${theme.bg}22` }}
            >
              <div className="flex justify-between items-center w-full">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="p-2 outline-none cursor-pointer"
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
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-3 outline-none group cursor-pointer"
                >
                  {step === 2 && (
                    <span className="text-[10px] tracking-widest uppercase">
                      {isAdmin ? "END" : t("form_submit")}
                    </span>
                  )}
                  <div className="p-2 transition-transform group-hover:translate-x-1">
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
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GeneralInquiryForm;
