import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WebInquiryForm = ({ textColor, t, theme, hideHeading = false }) => {
  const [step, setStep] = useState(1);
  const [wantsCall, setWantsCall] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    pages: "",
    deadline: "",
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
  });

  const uiColor = theme.level3;
  const update = (field, val) =>
    setFormData((prev) => ({ ...prev, [field]: val }));

  const toggleFeat = (f) => {
    const next = formData.features.includes(f)
      ? formData.features.filter((x) => x !== f)
      : [...formData.features, f];
    update("features", next);
  };

  const PillButton = ({ label, selected, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 border text-[10px] font-bold transition-all duration-200 lowercase"
      style={{
        borderColor: uiColor,
        backgroundColor: selected ? uiColor : "transparent",
        color: selected ? theme.bg : uiColor,
      }}
    >
      {label}
    </button>
  );

  const Choice = ({ label, selected, onClick, isCheck = false }) => (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 py-1.5 text-xs text-left transition-all group lowercase"
      style={{ color: uiColor }}
    >
      <div
        className={`w-3.5 h-3.5 border transition-all duration-200 ${isCheck ? "rounded-sm" : "rounded-full"}`}
        style={{
          borderColor: uiColor,
          backgroundColor: selected ? uiColor : "transparent",
        }}
      />
      <span style={{ fontWeight: selected ? "600" : "400" }}>{label}</span>
    </button>
  );

  const handleSubmit = () => {
    console.log("inquiry submitted:", { ...formData, wantsCall });
  };

  return (
    <div className="h-full flex flex-col lowercase" style={{ color: uiColor }}>
      {!hideHeading && (
        <header className="mb-6">
          <h2
            className="text-xl font-bold tracking-tighter mb-1 leading-none"
            style={{ color: textColor }}
          >
            {t("form_title_web")}
          </h2>
          <p className="text-[10px] opacity-70 italic pr-4">
            {t("form_subtitle")}
          </p>
        </header>
      )}

      {/* Progress / Fast-Track Selection */}
      <div className="mb-8">
        {!wantsCall && (
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className="h-0.5 flex-grow transition-all duration-500"
                style={{
                  backgroundColor: uiColor,
                  opacity: step >= s ? 1 : 0.15,
                }}
              />
            ))}
          </div>
        )}

        {step === 1 && (
          <div
            className="pb-4 border-b mb-6"
            style={{ borderColor: `${uiColor}22` }}
          >
            <Choice
              label={t("form_skip_to_call")}
              selected={wantsCall}
              onClick={() => {
                setWantsCall(!wantsCall);
                setStep(1);
              }}
            />
          </div>
        )}
      </div>

      <div className="flex-grow overflow-y-auto no-scrollbar pr-4">
        <AnimatePresence mode="wait">
          {wantsCall ? (
            <motion.section
              key="call-only"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] mb-3 opacity-70 italic">
                    {t("form_phone_label")}
                  </p>
                  <input
                    placeholder="+41..."
                    className="w-full border-b bg-transparent py-2 text-sm outline-none placeholder:opacity-40"
                    style={{ borderColor: uiColor, color: uiColor }}
                    onChange={(e) => update("contact", e.target.value)}
                    value={formData.contact}
                  />
                </div>
                <div>
                  <p className="text-[10px] mb-3 opacity-70 italic">
                    {t("form_message_label")}
                  </p>
                  <textarea
                    className="w-full border bg-transparent p-4 text-sm h-32 outline-none resize-none placeholder:opacity-40"
                    style={{ borderColor: uiColor, color: uiColor }}
                    onChange={(e) => update("details", e.target.value)}
                    value={formData.details}
                  />
                </div>
              </div>
            </motion.section>
          ) : (
            <>
              {step === 1 && (
                <motion.section
                  key="s1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <h3
                    className="text-[11px] font-bold tracking-widest mb-6"
                    style={{ color: textColor }}
                  >
                    {t("section_1")}
                  </h3>
                  <div className="space-y-6">
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
                    <div>
                      <p className="text-[10px] mb-3 opacity-70 italic">
                        {t("form_pages_label")}
                      </p>
                      <div className="flex gap-2">
                        {["1-5", "5-10", "10+"].map((p) => (
                          <PillButton
                            key={p}
                            label={p}
                            selected={formData.pages === p}
                            onClick={() => update("pages", p)}
                          />
                        ))}
                      </div>
                    </div>
                    <input
                      placeholder={t("form_deadline")}
                      className="w-full border-b bg-transparent py-2 text-sm outline-none placeholder:opacity-40"
                      style={{ borderColor: uiColor, color: uiColor }}
                      onChange={(e) => update("deadline", e.target.value)}
                      value={formData.deadline}
                    />
                  </div>
                </motion.section>
              )}

              {step === 2 && (
                <motion.section
                  key="s2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <h3
                    className="text-[11px] font-bold tracking-widest mb-6"
                    style={{ color: textColor }}
                  >
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
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <h3
                    className="text-[11px] font-bold tracking-widest mb-6"
                    style={{ color: textColor }}
                  >
                    {t("section_3")}
                  </h3>
                  <div className="space-y-6">
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
                    <input
                      placeholder={t("form_style_label")}
                      className="w-full border-b bg-transparent py-2 text-sm outline-none placeholder:opacity-40"
                      style={{ borderColor: uiColor, color: uiColor }}
                      onChange={(e) => update("style", e.target.value)}
                      value={formData.style}
                    />
                  </div>
                </motion.section>
              )}

              {step === 4 && (
                <motion.section
                  key="s4"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <h3
                    className="text-[11px] font-bold tracking-widest mb-6"
                    style={{ color: textColor }}
                  >
                    {t("section_4")}
                  </h3>
                  <div className="space-y-6">
                    <div className="flex flex-col gap-1">
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
                    </div>
                    <div>
                      <p className="text-[10px] mb-3 opacity-70 italic">
                        {t("form_budget_label")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["low", "mid", "high"].map((b) => (
                          <PillButton
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
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <h3
                    className="text-[11px] font-bold tracking-widest mb-6"
                    style={{ color: textColor }}
                  >
                    {t("get_in_touch")}
                  </h3>
                  <input
                    placeholder={t("form_contact_placeholder")}
                    className="w-full border-b bg-transparent py-3 text-sm outline-none placeholder:opacity-40 mb-6"
                    style={{ borderColor: uiColor, color: uiColor }}
                    onChange={(e) => update("contact", e.target.value)}
                    value={formData.contact}
                  />

                  <div className="flex flex-wrap gap-4 mb-2">
                    {["chat", "email", "call"].map((c) => (
                      <Choice
                        key={c}
                        label={t(`form_channel_${c}`)}
                        selected={formData.channel === c}
                        onClick={() => update("channel", c)}
                      />
                    ))}
                  </div>

                  <AnimatePresence>
                    {formData.channel === "chat" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-6 pl-6 border-l ml-1.5"
                        style={{ borderColor: `${uiColor}33` }}
                      >
                        <p className="text-[9px] mb-2 opacity-60 lowercase tracking-tighter">
                          {t("form_select_app")}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {["whatsapp", "signal", "telegram", "sms"].map(
                            (app) => (
                              <Choice
                                key={app}
                                label={t(`form_app_${app}`)}
                                selected={formData.chatApp === app}
                                onClick={() => update("chatApp", app)}
                              />
                            ),
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <textarea
                    placeholder={t("form_details")}
                    className="w-full border bg-transparent p-4 text-sm h-32 outline-none resize-none placeholder:opacity-40 mt-4"
                    style={{ borderColor: uiColor, color: uiColor }}
                    onChange={(e) => update("details", e.target.value)}
                    value={formData.details}
                  />
                </motion.section>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      <div
        className="mt-8 pt-6 border-t"
        style={{ borderColor: `${uiColor}33` }}
      >
        <div className="flex justify-between items-center h-12">
          {!wantsCall && step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-[10px] font-bold tracking-widest lowercase opacity-50 hover:opacity-100 transition-opacity"
              style={{ color: uiColor }}
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
            className="px-8 py-3 border text-[10px] font-bold tracking-[0.2em] transition-all duration-300"
            style={{
              backgroundColor: "transparent",
              borderColor: uiColor,
              color: uiColor,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = uiColor;
              e.currentTarget.style.color = theme.bg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = uiColor;
            }}
          >
            {wantsCall || step === 5
              ? t("form_submit")
              : `${t("button_next")} →`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebInquiryForm;
