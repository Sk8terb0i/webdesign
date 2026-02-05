import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import WebInquiryForm from "./WebInquiryForm";
import StreamInquiryForm from "./StreamInquiryForm";
import GeneralInquiryForm from "./GeneralInquiryForm";

const AdminDashboard = ({ theme }) => {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const { t } = useTranslation();

  const safeTheme = theme || { bg: "#000", text: "#fff" };

  useEffect(() => {
    // Listen to Web Inquiries
    const qWeb = query(
      collection(db, "inquiries"),
      orderBy("createdAt", "desc"),
    );
    const unsubscribeWeb = onSnapshot(qWeb, (snapshot) => {
      const webData = snapshot.docs.map((doc) => ({
        id: doc.id,
        sourceCollection: "inquiries",
        ...doc.data(),
      }));

      // Listen to Stream Inquiries
      const qStream = query(
        collection(db, "inquiries_stream"),
        orderBy("createdAt", "desc"),
      );
      const unsubscribeStream = onSnapshot(qStream, (snapshot) => {
        const streamData = snapshot.docs.map((doc) => ({
          id: doc.id,
          sourceCollection: "inquiries_stream",
          ...doc.data(),
        }));

        // Merge and sort both by date
        const combined = [...webData, ...streamData].sort(
          (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
        );
        setInquiries(combined);
      });

      return () => unsubscribeStream();
    });

    return () => unsubscribeWeb();
  }, []);

  const handleDelete = async (id, collectionName, e) => {
    e.stopPropagation();
    if (window.confirm("Delete this inquiry?")) {
      try {
        await deleteDoc(doc(db, collectionName, id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  return (
    <div
      className="min-h-screen p-4 md:p-8 font-sans"
      style={{ backgroundColor: safeTheme.text, color: safeTheme.bg }}
    >
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter">ADMIN_PANEL</h1>
            <p className="text-[10px] tracking-[0.3em] opacity-50 mt-2">
              MANAGING {inquiries.length} INQUIRIES
            </p>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="text-[10px] tracking-widest border px-4 py-2 hover:bg-black hover:text-white transition-colors cursor-pointer"
            style={{ borderColor: safeTheme.bg }}
          >
            LOGOUT
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-2">
            {inquiries.map((iq) => (
              <div
                key={iq.id}
                onClick={() => setSelectedInquiry(iq)}
                className="group border p-4 cursor-pointer transition-all relative overflow-hidden"
                style={{
                  borderColor:
                    selectedInquiry?.id === iq.id
                      ? safeTheme.bg
                      : `${safeTheme.bg}22`,
                  backgroundColor:
                    selectedInquiry?.id === iq.id
                      ? `${safeTheme.bg}05`
                      : "transparent",
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold tracking-widest uppercase">
                    {iq.sourceCollection === "inquiries_stream"
                      ? "STREAM"
                      : iq.type || "WEB"}
                  </span>
                  <button
                    onClick={(e) => handleDelete(iq.id, iq.sourceCollection, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none bg-transparent"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
                <div className="text-lg font-medium truncate">{iq.contact}</div>
                <div className="text-[9px] opacity-40 mt-1 uppercase">
                  {iq.createdAt?.toDate().toLocaleDateString()} —{" "}
                  {iq.sourceCollection === "inquiries_stream"
                    ? `${iq.cameras} CAMS`
                    : iq.selectedTier}
                </div>
              </div>
            ))}
          </div>

          <div
            className="lg:col-span-8 border p-6 md:p-12 relative"
            style={{ borderColor: `${safeTheme.bg}22` }}
          >
            <AnimatePresence mode="wait">
              {selectedInquiry ? (
                <motion.div
                  key={selectedInquiry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div
                    className="mb-8 pb-8 border-b flex justify-between items-center"
                    style={{ borderColor: `${safeTheme.bg}11` }}
                  >
                    <h2 className="text-sm font-bold tracking-[0.2em] uppercase">
                      Inquiry Playback
                    </h2>
                    <span className="text-[10px] opacity-50 italic">
                      ID: {selectedInquiry.id}
                    </span>
                  </div>

                  {selectedInquiry.sourceCollection === "inquiries_stream" ? (
                    <StreamInquiryForm
                      t={t}
                      theme={safeTheme}
                      data={selectedInquiry}
                      hideHeading={true}
                    />
                  ) : selectedInquiry.formType === "general" ? (
                    <GeneralInquiryForm
                      t={t}
                      theme={safeTheme}
                      data={selectedInquiry}
                    />
                  ) : (
                    <WebInquiryForm
                      t={t}
                      theme={safeTheme}
                      readOnlyData={selectedInquiry}
                      hideHeading={true}
                    />
                  )}
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center opacity-20 py-20">
                  <p className="text-[10px] tracking-[0.5em] uppercase text-center leading-relaxed">
                    Select an inquiry
                    <br />
                    to view details
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
