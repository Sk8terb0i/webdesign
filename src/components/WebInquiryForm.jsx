import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WebInquiryForm = ({ t, theme, hideHeading = false }) => {
  const [step, setStep] = useState(1);
  const [wantsCall, setWantsCall] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);

  const initialFormState = {
    type: "",
    pages: "",
    features: [],
    assets: "",
    copy: "",
    style: "",
    hosting: "",
    budget: "",
    contact: "",
    channel: "",
    chatApp: "whatsapp",
    details: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const uiColor = theme.level3;
  const bgColor = theme.bg;

  const update = (field, val) => {
    setShowError(false);
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const toggleFeat = (f) => {
    setShowError(false);
    const next = formData.features.includes(f)
      ? formData.features.filter((x) => x !== f)
      : [...formData.features, f];
    update("features", next);
  };

  const isStepComplete = (s) => {
    switch (s) {
      case 1:
        return !!(formData.type && formData.pages);
      case 2:
        return formData.features.length > 0;
      case 3:
        return !!(formData.assets && formData.copy);
      case 4:
        return !!(formData.hosting && formData.budget);
      case 5:
        return !!(formData.contact && formData.channel);
      default:
        return false;
    }
  };

  const canSubmit = wantsCall
    ? !!formData.contact
    : [1, 2, 3, 4, 5].every((s) => isStepComplete(s));

  const handleSubmit = () => {
    if (!canSubmit) {
      setShowError(true);
      return;
    }
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setStep(1);
      setWantsCall(false);
      setFormData(initialFormState);
      setShowError(false);
    }, 6000);
  };

  const Choice = ({ label, selected, onClick, isCheck = false }) => (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between w-full px-4 py-3 text-[11px] tracking-wider transition-all duration-200 border mb-2 group cursor-pointer"
      style={{
        color: selected ? bgColor : uiColor,
        borderColor: selected ? uiColor : `${uiColor}22`,
        backgroundColor: selected ? uiColor : "transparent",
      }}
    >
      <span style={{ fontWeight: selected ? "600" : "400" }}>{label}</span>
      <div
        className={`w-1.5 h-1.5 transition-all duration-300 ${isCheck ? "rotate-45" : "rounded-full"}`}
        style={{
          backgroundColor: selected ? bgColor : "transparent",
          border: `1px solid ${selected ? bgColor : uiColor}`,
          opacity: selected ? 1 : 0.3,
        }}
      />
    </button>
  );

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-64 flex flex-col items-center justify-center text-center space-y-4"
        style={{ color: uiColor }}
      >
        <h2 className="text-2xl font-bold tracking-tighter leading-none">
          {t("form_success_title")}
        </h2>
        <p className="text-sm opacity-60 tracking-widest max-w-[280px] leading-relaxed">
          {t("form_success_body")}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col font-sans" style={{ color: uiColor }}>
      {!hideHeading && (
        <header className="mb-8">
          <h2 className="text-2xl font-bold tracking-tighter mb-2 leading-none">
            {t("form_title_web")}
          </h2>
          <p className="text-[10px] opacity-60 tracking-widest">
            {t("form_subtitle")}
          </p>
        </header>
      )}

      <div className="mb-8">
        {!wantsCall && (
          <div className="flex gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className="h-1 flex-grow transition-all duration-300 cursor-pointer hover:opacity-60"
                style={{
                  backgroundColor: uiColor,
                  opacity: step === s || isStepComplete(s) ? 1 : 0.1,
                }}
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between px-1">
          <span className="text-[9px] tracking-[0.2em] opacity-50">
            {wantsCall ? t("direct_contact") : `${t("step")} ${step} / 5`}
          </span>
          <button
            onClick={() => {
              setWantsCall(!wantsCall);
              setStep(1);
              setShowError(false);
            }}
            className="text-[9px] tracking-[0.2em] underline underline-offset-4 cursor-pointer"
          >
            {wantsCall ? t("back_to_form") : t("form_skip_to_call")}
          </button>
        </div>
      </div>

      <div className="flex-grow min-h-[350px]">
        <AnimatePresence mode="wait">
          {wantsCall ? (
            <motion.section
              key="call"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="text-[10px] tracking-widest block mb-4 opacity-70">
                  {t("form_phone_label")}
                </label>
                <input
                  placeholder="+41..."
                  className="w-full bg-transparent border-b py-3 text-lg outline-none placeholder:opacity-20"
                  style={{ borderColor: uiColor, color: uiColor }}
                  onChange={(e) => update("contact", e.target.value)}
                  value={formData.contact}
                />
              </div>
              <div>
                <label className="text-[10px] tracking-widest block mb-4 opacity-70">
                  {t("form_message_label")} ({t("optional")})
                </label>
                <textarea
                  className="w-full bg-transparent border p-4 text-sm h-40 outline-none resize-none placeholder:opacity-20"
                  style={{ borderColor: `${uiColor}44`, color: uiColor }}
                  onChange={(e) => update("details", e.target.value)}
                  value={formData.details}
                />
              </div>
            </motion.section>
          ) : (
            <>
              {step === 1 && (
                <motion.section
                  key="s1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h3 className="text-sm font-bold tracking-tighter mb-6">
                    {t("section_1")}
                  </h3>
                  <div className="flex flex-col gap-1">
                    {["new", "redesign", "landing"].map((type) => (
                      <Choice
                        key={type}
                        label={t(`form_scope_${type}`)}
                        selected={formData.type === type}
                        onClick={() => update("type", type)}
                      />
                    ))}
                  </div>
                  <div className="mt-8">
                    <h3 className="text-[10px] tracking-widest mb-4 opacity-70">
                      {t("form_pages_label")}
                    </h3>
                    <div className="flex flex-col gap-1">
                      {["1-5", "5-10", "10+"].map((p) => (
                        <Choice
                          key={p}
                          label={p}
                          selected={formData.pages === p}
                          onClick={() => update("pages", p)}
                        />
                      ))}
                    </div>
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
                  <div className="flex flex-col gap-1">
                    {[
                      "shop_c",
                      "shop_e",
                      "admin",
                      "lang",
                      "book",
                      "login",
                      "api",
                    ].map((feat) => (
                      <Choice
                        key={feat}
                        isCheck
                        label={t(`form_feat_${feat}`)}
                        selected={formData.features.includes(feat)}
                        onClick={() => toggleFeat(feat)}
                      />
                    ))}
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
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
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
                    <div className="flex flex-col gap-1">
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
                    </div>
                    <div>
                      <label className="text-[10px] tracking-widest block mt-4 opacity-70">
                        {t("form_style_label")} ({t("optional")})
                      </label>
                      <input
                        placeholder={t("form_style_placeholder")}
                        className="w-full border-b bg-transparent py-4 text-sm outline-none placeholder:opacity-30"
                        style={{ borderColor: uiColor, color: uiColor }}
                        onChange={(e) => update("style", e.target.value)}
                        value={formData.style}
                      />
                    </div>
                  </div>
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
                  <div className="space-y-6">
                    <div className="flex flex-col gap-1">
                      {["github", "external"].map((h) => (
                        <Choice
                          key={h}
                          label={t(
                            `form_host_${h === "github" ? "free" : "ext"}`,
                          )}
                          selected={formData.hosting === h}
                          onClick={() => update("hosting", h)}
                        />
                      ))}
                    </div>
                    <div>
                      <h3 className="text-[10px] tracking-widest mb-4 opacity-70">
                        {t("form_budget_label")}
                      </h3>
                      <div className="flex flex-col gap-1">
                        {["low", "mid", "high"].map((b) => (
                          <Choice
                            key={b}
                            label={t(`budget_${b}`)}
                            selected={formData.budget === b}
                            onClick={() => update("budget", b)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}

              {step === 5 && (
                <motion.section
                  key="s5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h3 className="text-sm font-bold tracking-tighter mb-6">
                    {t("get_in_touch_out")}
                  </h3>
                  <input
                    placeholder={t("form_contact_placeholder")}
                    className="w-full border-b bg-transparent py-4 text-lg outline-none placeholder:opacity-30 mb-8"
                    style={{ borderColor: uiColor, color: uiColor }}
                    onChange={(e) => update("contact", e.target.value)}
                    value={formData.contact}
                  />
                  <div className="flex flex-col gap-1 mb-6">
                    {["email", "call", "chat"].map((ch) => (
                      <Choice
                        key={ch}
                        label={t(`form_channel_${ch}`)}
                        selected={formData.channel === ch}
                        onClick={() => update("channel", ch)}
                      />
                    ))}
                    <AnimatePresence>
                      {formData.channel === "chat" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-1 mb-4">
                            {["whatsapp", "signal", "telegram", "sms"].map(
                              (app) => (
                                <button
                                  key={app}
                                  onClick={() => update("chatApp", app)}
                                  className="py-2 text-[9px] border tracking-widest transition-all"
                                  style={{
                                    color:
                                      formData.chatApp === app
                                        ? bgColor
                                        : uiColor,
                                    backgroundColor:
                                      formData.chatApp === app
                                        ? uiColor
                                        : "transparent",
                                    borderColor:
                                      formData.chatApp === app
                                        ? uiColor
                                        : `${uiColor}44`,
                                  }}
                                >
                                  {t(`form_app_${app}`)}
                                </button>
                              ),
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <textarea
                    placeholder={`${t("form_details")} (${t("optional")})`}
                    className="w-full border bg-transparent p-4 text-sm h-32 outline-none resize-none placeholder:opacity-30"
                    style={{ borderColor: `${uiColor}44`, color: uiColor }}
                    onChange={(e) => update("details", e.target.value)}
                    value={formData.details}
                  />
                </motion.section>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      <footer
        className="mt-8 pt-6 border-t"
        style={{ borderColor: `${uiColor}22` }}
      >
        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4"
            >
              <p className="text-[9px] font-bold tracking-[0.2em] text-red-500 uppercase">
                ! {t("form_error_required")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center">
          {!wantsCall && step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-[10px] font-bold tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
            >
              {t("button_back")}
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={() =>
              wantsCall || step === 5 ? handleSubmit() : setStep(step + 1)
            }
            className="group flex items-center gap-4 py-4 text-[10px] font-bold tracking-[0.3em] transition-all cursor-pointer"
            style={{
              color: uiColor,
              opacity: (wantsCall || step === 5) && !canSubmit ? 0.3 : 1,
            }}
          >
            {wantsCall || step === 5 ? t("form_submit") : t("button_next")}
            {!wantsCall && step < 5 && (
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default WebInquiryForm;
