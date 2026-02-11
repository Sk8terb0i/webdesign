import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Sub-components
import WebInquiryForm from "./WebInquiryForm";
import StreamInquiryForm from "./StreamInquiryForm";

const PRICING_CONFIG = {
  base: {
    new: [2000, 3000, 4500],
    redesign: [1200, 1800, 2800],
    landing: [600, 900, 1500],
  },
  rates: { new: 200, redesign: 120, landing: 0 },
  features: {
    shop_c: [1500, 2250, 3000],
    shop_e: [800, 1400, 2000],
    admin: [400, 950, 1500],
    book: [500, 1250, 2000],
    login: [1000, 2000, 3000],
    api: [200, 600, 1000],
  },
  language: { technical: 100, translation: 100 },
  assets: [200, 600, 1000],
  copy: [200, 600, 1000],
};

const AdminDashboard = ({ theme }) => {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [exactPageCount, setExactPageCount] = useState(5);

  const [adminInfo, setAdminInfo] = useState({
    name: "YOUR LEGAL NAME / AGENCY",
    address: "Street Address, City, ZIP",
    bank: "Your Bank Name",
    iban: "CHXX XXXX XXXX XXXX XXXX X",
    bic: "XXXXXXXX",
  });

  const [clientInfo, setClientInfo] = useState({
    name: "",
    address: "",
  });

  const { t } = useTranslation();
  const safeTheme = theme || { bg: "#000", text: "#fff" };

  // 1. DUAL LISTENER: Fetch from 'inquiries' AND 'inquiries_stream'
  useEffect(() => {
    const qWeb = query(
      collection(db, "inquiries"),
      orderBy("createdAt", "desc"),
    );
    const qStream = query(
      collection(db, "inquiries_stream"),
      orderBy("createdAt", "desc"),
    );

    const unsubWeb = onSnapshot(qWeb, (snapshot) => {
      const webData = snapshot.docs.map((d) => ({
        id: d.id,
        source: "web",
        ...d.data(),
      }));
      setInquiries((prev) => {
        const others = prev.filter((iq) => iq.source !== "web");
        return [...webData, ...others].sort(
          (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
        );
      });
    });

    const unsubStream = onSnapshot(qStream, (snapshot) => {
      const streamData = snapshot.docs.map((d) => ({
        id: d.id,
        source: "stream",
        ...d.data(),
      }));
      setInquiries((prev) => {
        const others = prev.filter((iq) => iq.source !== "stream");
        return [...streamData, ...others].sort(
          (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
        );
      });
    });

    return () => {
      unsubWeb();
      unsubStream();
    };
  }, []);

  // 2. Sync client form when inquiry is selected
  useEffect(() => {
    if (selectedInquiry) {
      setClientInfo({
        // Priority check for names across different form types
        name:
          selectedInquiry.name || selectedInquiry.contact || "Unnamed Client",
        address: selectedInquiry.address || "",
      });

      // Reset page count logic for Web Inquiries only
      if (selectedInquiry.source === "web") {
        setExactPageCount(
          selectedInquiry.pages === "2-5"
            ? 4
            : selectedInquiry.pages === "5-10"
              ? 8
              : 15,
        );
      }
    }
  }, [selectedInquiry]);

  const generateBreakdownPDF = (iq) => {
    // Note: This logic currently supports Web Inquiries.
    // Streaming inquiries may require a different PDF template.
    const doc = new jsPDF();
    const tierIdx =
      iq.selectedTier === "horse" ? 2 : iq.selectedTier === "premium" ? 1 : 0;
    const lang = iq.language === "de" ? "de" : "en";

    // ... (Your existing PDF i18n and drawing logic remains same)
    // To keep this brief, I'll assume your existing generateBreakdownPDF logic follows here.
    // Ensure you handle cases where iq.type might be different for streams.
  };

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: safeTheme.text, color: safeTheme.bg }}
    >
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <h1 className="text-4xl font-bold tracking-tighter italic">
            ADMIN_CTRL
          </h1>
          <button
            onClick={() => signOut(auth)}
            className="text-[10px] border px-4 py-2 hover:bg-red-500 hover:text-white transition-colors"
          >
            LOGOUT
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* List Section */}
          <div className="lg:col-span-3 space-y-2">
            <h2 className="text-[10px] font-bold opacity-30 mb-4 tracking-widest">
              INCOMING_INQUIRIES
            </h2>
            {inquiries.map((iq) => (
              <div
                key={iq.id}
                onClick={() => setSelectedInquiry(iq)}
                className="border p-4 cursor-pointer transition-all relative"
                style={{
                  borderColor:
                    selectedInquiry?.id === iq.id
                      ? safeTheme.bg
                      : `${safeTheme.bg}22`,
                  backgroundColor:
                    selectedInquiry?.id === iq.id
                      ? `${safeTheme.bg}08`
                      : "transparent",
                }}
              >
                {/* Language Badge */}
                <div className="absolute top-2 right-2 text-[8px] font-bold opacity-30 border px-1 uppercase">
                  {iq.language || "en"}
                </div>

                <div className="text-sm font-bold truncate">
                  {iq.name || iq.contact}
                </div>
                <div className="text-[9px] opacity-40 uppercase">
                  {iq.source === "stream"
                    ? `STREAM — ${iq.type}`
                    : `${iq.type || "WEB"}`}
                </div>
              </div>
            ))}
          </div>

          {/* Editor Section */}
          <div className="lg:col-span-9 border p-8">
            {selectedInquiry ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="border-r pr-8 border-dashed">
                  <h3 className="text-[10px] font-bold mb-6 opacity-50 uppercase tracking-widest">
                    Submission Preview
                  </h3>

                  {/* DYNAMIC FORM PREVIEW */}
                  {selectedInquiry.source === "stream" ? (
                    <StreamInquiryForm
                      t={t}
                      theme={safeTheme}
                      data={selectedInquiry} // Uses your 'isAdmin' logic inside the form
                      hideHeading={true}
                    />
                  ) : (
                    <WebInquiryForm
                      t={t}
                      theme={safeTheme}
                      data={selectedInquiry}
                      hideHeading={true}
                    />
                  )}
                </div>

                <div className="space-y-10">
                  <section>
                    <h3 className="text-[10px] font-bold mb-4 opacity-50 uppercase tracking-widest underline decoration-1">
                      1. Your Credentials
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        value={adminInfo.name}
                        onChange={(e) =>
                          setAdminInfo({ ...adminInfo, name: e.target.value })
                        }
                        placeholder="Provider Legal Name"
                        className="w-full bg-transparent border-b p-1 text-sm outline-none"
                      />
                      <input
                        value={adminInfo.address}
                        onChange={(e) =>
                          setAdminInfo({
                            ...adminInfo,
                            address: e.target.value,
                          })
                        }
                        placeholder="Provider Address"
                        className="w-full bg-transparent border-b p-1 text-sm outline-none"
                      />
                      <input
                        value={adminInfo.iban}
                        onChange={(e) =>
                          setAdminInfo({ ...adminInfo, iban: e.target.value })
                        }
                        placeholder="IBAN"
                        className="w-full bg-transparent border-b p-1 text-sm outline-none"
                      />
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[10px] font-bold mb-4 opacity-50 uppercase tracking-widest underline decoration-1">
                      2. Target Client
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        value={clientInfo.name}
                        onChange={(e) =>
                          setClientInfo({ ...clientInfo, name: e.target.value })
                        }
                        placeholder="Client Name / Company"
                        className="w-full bg-transparent border-b p-1 text-sm outline-none"
                      />
                      <input
                        value={clientInfo.address}
                        onChange={(e) =>
                          setClientInfo({
                            ...clientInfo,
                            address: e.target.value,
                          })
                        }
                        placeholder="Client Address (Optional)"
                        className="w-full bg-transparent border-b p-1 text-sm outline-none"
                      />
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[10px] font-bold mb-4 opacity-50 uppercase tracking-widest underline decoration-1">
                      3. Action
                    </h3>
                    <div className="flex items-center gap-4">
                      {selectedInquiry.source === "web" && (
                        <div className="flex-1">
                          <label className="text-[9px] opacity-40 block mb-1">
                            PAGE COUNT
                          </label>
                          <input
                            type="number"
                            value={exactPageCount}
                            onChange={(e) =>
                              setExactPageCount(parseInt(e.target.value))
                            }
                            className="w-full bg-transparent border-b p-1 text-lg font-bold outline-none"
                          />
                        </div>
                      )}
                      <button
                        onClick={() => generateBreakdownPDF(selectedInquiry)}
                        className="flex-1 bg-black text-white border-black border py-4 font-bold text-[10px] hover:invert transition-all"
                      >
                        DOWNLOAD CONTRACT
                      </button>
                    </div>
                  </section>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <p className="opacity-20 text-sm uppercase tracking-[0.2em] animate-pulse">
                  Select an inquiry to proceed
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
