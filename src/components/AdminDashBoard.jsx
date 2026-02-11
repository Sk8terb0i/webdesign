import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Sub-components
import WebInquiryForm from "./WebInquiryForm";

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

  // 1. YOUR BUSINESS INFO
  const [adminInfo, setAdminInfo] = useState({
    name: "YOUR LEGAL NAME / AGENCY",
    address: "Street Address, City, ZIP",
    bank: "Your Bank Name",
    iban: "CHXX XXXX XXXX XXXX XXXX X",
    bic: "XXXXXXXX",
  });

  // 2. CLIENT INFO (Populated on selection)
  const [clientInfo, setClientInfo] = useState({
    name: "",
    address: "",
  });

  const { t } = useTranslation();
  const safeTheme = theme || { bg: "#000", text: "#fff" };

  // Sync client form when inquiry is selected
  useEffect(() => {
    if (selectedInquiry) {
      setClientInfo({
        // Priority: Saved Name -> Contact Info -> Empty String
        name: selectedInquiry.name || selectedInquiry.contact || "",
        address: selectedInquiry.address || "",
      });
      setExactPageCount(
        selectedInquiry.pages === "2-5"
          ? 4
          : selectedInquiry.pages === "5-10"
            ? 8
            : 15,
      );
    }
  }, [selectedInquiry]);

  // Firebase Listener
  useEffect(() => {
    const qWeb = query(
      collection(db, "inquiries"),
      orderBy("createdAt", "desc"),
    );
    const unsubscribe = onSnapshot(qWeb, (snapshot) => {
      setInquiries(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  const generateBreakdownPDF = (iq) => {
    const doc = new jsPDF();
    const tierIdx =
      iq.selectedTier === "horse" ? 2 : iq.selectedTier === "premium" ? 1 : 0;
    const lang = iq.language === "de" ? "de" : "en";

    const i18n = {
      en: {
        title: "SERVICE AGREEMENT & INVOICE",
        between: "BETWEEN:",
        andClient: "AND CLIENT (The Customer):",
        ref: "Reference ID:",
        date: "Date of Issue:",
        colItem: "Service Item",
        colClass: "Classification",
        colAmount: "Amount",
        total: "TOTAL INVESTMENT (EXCL. VAT)",
        termsTitle: "TERMS OF AGREEMENT",
        terms: [
          "1. Payment: 50% deposit due upon signing. Remaining 50% due upon project completion.",
          "2. Out of Scope: Additional requests billed at CHF 90/h or an additional agreed flat rate.",
          "3. Validity: This offer is valid for 30 days from the date of issue.",
          "4. Hosting: Client is responsible for third-party hosting fees unless stated otherwise.",
        ],
        sigClient: "CLIENT SIGNATURE",
        sigProvider: "PROVIDER SIGNATURE",
        placeDate: "Place, Date:",
        bankInfo: "PAYMENT INFORMATION",
        descNew: "Professional Website Development (New Build)",
        descRedesign: "Website Evolution & UI/UX Redesign",
        descLanding: "High-Conversion Landing Page",
        pages: "Development: Custom Pages",
        arch: "Architecture & Design",
      },
      de: {
        title: "DIENSTLEISTUNGSVERTRAG & RECHNUNG",
        between: "ZWISCHEN:",
        andClient: "UND KUNDE (Auftraggeber):",
        ref: "Referenz-ID:",
        date: "Ausstellungsdatum:",
        colItem: "Serviceleistung",
        colClass: "Klassifizierung",
        colAmount: "Betrag",
        total: "GESAMTINVESTITION (ZZGL. MWST)",
        termsTitle: "VERTRAGSBEDINGUNGEN",
        terms: [
          "1. Zahlung: 50% Anzahlung bei Unterzeichnung. Restliche 50% nach Projektabschluss.",
          "2. Zusatzleistungen: Mehraufwand wird mit CHF 90/h oder pauschal nach Vereinbarung berechnet.",
          "3. Gültigkeit: Dieses Angebot ist ab Ausstellungsdatum 30 Tage gültig.",
          "4. Hosting: Der Kunde ist für Drittanbieter-Hostinggebühren selbst verantwortlich.",
        ],
        sigClient: "UNTERSCHRIFT KUNDE",
        sigProvider: "UNTERSCHRIFT DIENSTLEISTER",
        placeDate: "Ort, Datum:",
        bankInfo: "ZAHLUNGSINFORMATIONEN",
        descNew: "Professionelle Website-Erstellung (Neubau)",
        descRedesign: "Website-Evolution & UI/UX Redesign",
        descLanding: "High-Conversion Landingpage",
        pages: "Entwicklung: Individuelle Seiten",
        arch: "Architektur & Design",
      },
    };

    const t = i18n[lang];

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(t.title, 14, 25);

    doc.setFontSize(10);
    doc.text(t.between, 14, 40);
    doc.setFont("helvetica", "normal");
    doc.text(adminInfo.name, 14, 45);
    doc.text(adminInfo.address, 14, 49);

    doc.setFont("helvetica", "bold");
    doc.text(t.andClient, 120, 40);
    doc.setFont("helvetica", "normal");
    doc.text(clientInfo.name, 120, 45);
    if (clientInfo.address) doc.text(clientInfo.address, 120, 49);
    doc.text(`${t.ref} ${iq.id.substring(0, 8)}`, 120, 55);
    doc.text(`${t.date} ${new Date().toLocaleDateString()}`, 120, 59);

    const tableRows = [];
    let grandTotal = 0;

    const basePrice = PRICING_CONFIG.base[iq.type][tierIdx];
    const mainDesc =
      iq.type === "new"
        ? t.descNew
        : iq.type === "redesign"
          ? t.descRedesign
          : t.descLanding;
    tableRows.push([mainDesc, t.arch, `CHF ${basePrice.toLocaleString()}`]);
    grandTotal += basePrice;

    if (iq.type !== "landing") {
      const pageRate = PRICING_CONFIG.rates[iq.type];
      const pageCost = exactPageCount * pageRate;
      tableRows.push([
        `${t.pages}: ${exactPageCount}`,
        `Unit Rate: CHF ${pageRate}`,
        `CHF ${pageCost.toLocaleString()}`,
      ]);
      grandTotal += pageCost;
    }

    iq.features.forEach((f) => {
      if (PRICING_CONFIG.features[f]) {
        const cost = PRICING_CONFIG.features[f][tierIdx];
        tableRows.push([
          `Feature: ${f.toUpperCase()}`,
          "Integration",
          `CHF ${cost.toLocaleString()}`,
        ]);
        grandTotal += cost;
      }
    });

    autoTable(doc, {
      startY: 70,
      head: [[t.colItem, t.colClass, t.colAmount]],
      body: tableRows,
      theme: "striped",
      headStyles: { fillColor: [50, 50, 50] },
      columnStyles: { 2: { halign: "right" } },
    });

    const finalYTable = doc.lastAutoTable.finalY;
    doc.setFont("helvetica", "bold");
    doc.text(t.total, 120, finalYTable + 10);
    doc.text(`CHF ${grandTotal.toLocaleString()}`, 196, finalYTable + 10, {
      align: "right",
    });

    let finalY = finalYTable + 25;
    doc.text(t.termsTitle, 14, finalY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(t.terms, 14, finalY + 7);

    finalY += 45;
    doc.line(14, finalY, 90, finalY);
    doc.text(t.sigClient, 14, finalY + 5);
    doc.text(`${t.placeDate} ________________`, 14, finalY + 11);

    doc.line(110, finalY, 190, finalY);
    doc.text(t.sigProvider, 110, finalY + 5);
    doc.text(`${t.placeDate} ________________`, 110, finalY + 11);

    doc.setFontSize(8);
    doc.text(
      `${t.bankInfo}: Bank: ${adminInfo.bank} | IBAN: ${adminInfo.iban} | BIC: ${adminInfo.bic}`,
      105,
      285,
      { align: "center" },
    );

    doc.save(`Contract_${clientInfo.name.replace(/\s+/g, "_")}.pdf`);
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
                className="border p-4 cursor-pointer transition-all"
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
                {/* Prioritize Name in sidebar */}
                <div className="text-sm font-bold truncate">
                  {iq.name || iq.contact}
                </div>
                <div className="text-[9px] opacity-40 uppercase">
                  {iq.name ? iq.contact : `${iq.type} — ${iq.language}`}
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
                  <WebInquiryForm
                    t={t}
                    theme={safeTheme}
                    data={selectedInquiry} // Uses the shared data prop for read-only view
                    hideHeading={true}
                  />
                </div>

                <div className="space-y-10">
                  {/* Part 1: Your Business */}
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

                  {/* Part 2: Client Info */}
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

                  {/* Part 3: Adjustments */}
                  <section>
                    <h3 className="text-[10px] font-bold mb-4 opacity-50 uppercase tracking-widest underline decoration-1">
                      3. Project Scope
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-[9px] opacity-40 block mb-1">
                          TOTAL PAGE COUNT
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
                      <button
                        onClick={() => generateBreakdownPDF(selectedInquiry)}
                        className="flex-1 bg-black text-white border-black border py-4 font-bold text-[10px] hover:invert transition-all"
                      >
                        DOWNLOAD{" "}
                        {selectedInquiry?.language?.toUpperCase() || "EN"}{" "}
                        CONTRACT
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
