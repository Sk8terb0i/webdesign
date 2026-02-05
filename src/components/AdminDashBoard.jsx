import React, { useEffect, useState, useMemo } from "react";
import { db, auth } from "../firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = ({ theme }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("web");

  const safeTheme = theme || { bg: "#000", text: "#fff" };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) fetchAllData();
    });
    return () => unsubscribe();
  }, []);

  const fetchAllData = async () => {
    try {
      const [generalSnap, streamSnap] = await Promise.all([
        getDocs(
          query(collection(db, "inquiries"), orderBy("createdAt", "desc")),
        ),
        getDocs(
          query(
            collection(db, "inquiries_stream"),
            orderBy("createdAt", "desc"),
          ),
        ),
      ]);

      const generalData = generalSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        isStream: false,
      }));
      const streamData = streamSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        isStream: true,
      }));

      const combined = [...generalData, ...streamData].sort(
        (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
      );

      setInquiries(combined);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setLoginError("Invalid credentials");
    }
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((iq) => {
      if (activeTab === "streaming") return iq.isStream;
      if (activeTab === "web") return !iq.isStream && iq.formType !== "general";
      if (activeTab === "general") return iq.formType === "general";
      return true;
    });
  }, [inquiries, activeTab]);

  if (loading) return null;

  if (!user) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen p-6 font-sans"
        style={{ backgroundColor: safeTheme.bg, color: safeTheme.text }}
      >
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-8">
          <h1 className="text-3xl font-bold tracking-tighter">Admin Access</h1>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border-b bg-transparent py-4 text-sm outline-none"
              style={{ borderColor: safeTheme.text }}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border-b bg-transparent py-4 text-sm outline-none"
              style={{ borderColor: safeTheme.text }}
              onChange={(e) => setPassword(e.target.value)}
            />
            {loginError && (
              <p className="text-[10px] text-red-500">{loginError}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-5 text-[11px] font-bold tracking-[0.3em] cursor-pointer"
            style={{ backgroundColor: safeTheme.text, color: safeTheme.bg }}
          >
            LOGIN
          </button>
        </form>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-8 md:p-16 font-sans"
      style={{ backgroundColor: safeTheme.text, color: safeTheme.bg }}
    >
      <header
        className="flex justify-between items-end mb-12 border-b pb-8"
        style={{ borderColor: `${safeTheme.bg}22` }}
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tighter">Dashboard</h1>
          <p className="text-[10px] opacity-50 tracking-[0.3em] mt-2 uppercase">
            {filteredInquiries.length} {activeTab} REQUESTS
          </p>
        </div>
        <button
          onClick={() => signOut(auth)}
          className="text-[10px] font-bold tracking-[0.2em] border px-4 py-2 hover:bg-black hover:text-white transition-colors cursor-pointer"
          style={{ borderColor: `${safeTheme.bg}44` }}
        >
          LOGOUT
        </button>
      </header>

      <nav className="flex gap-8 mb-12">
        {["web", "streaming", "general"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="text-[11px] font-bold tracking-[0.2em] pb-2 relative outline-none cursor-pointer"
            style={{ opacity: activeTab === tab ? 1 : 0.3 }}
          >
            {tab.toUpperCase()}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: safeTheme.bg }}
              />
            )}
          </button>
        ))}
      </nav>

      <div className="grid grid-cols-1 gap-12">
        <AnimatePresence mode="wait">
          {filteredInquiries.length > 0 ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16"
            >
              {filteredInquiries.map((iq) => (
                <div
                  key={iq.id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-8 border-t pt-8"
                  style={{ borderColor: `${safeTheme.bg}15` }}
                >
                  {/* Column 1: Header Info */}
                  <div className="md:col-span-1">
                    <h2 className="text-xl font-bold mb-1">{iq.contact}</h2>
                    <p className="text-[10px] opacity-50 tracking-widest uppercase mb-4">
                      {iq.createdAt?.toDate().toLocaleDateString()} —{" "}
                      {iq.channel}{" "}
                      {iq.messagingApp ? `(${iq.messagingApp})` : ""}
                    </p>

                    {/* Handle both budget field names */}
                    {(iq.totalEstimate || iq.estimatedBudget) && (
                      <div className="inline-block px-3 py-1 bg-black text-white text-[10px] font-bold tracking-tighter">
                        EST. TOTAL: CHF{" "}
                        {(
                          iq.totalEstimate || iq.estimatedBudget
                        ).toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Column 2-4: Data Blocks */}
                  <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
                    {/* WEB FORM DATA */}
                    {activeTab === "web" && (
                      <>
                        <DataBlock label="Project Type" value={iq.type} />
                        <DataBlock
                          label="Selected Tier"
                          value={iq.selectedTier}
                        />
                        <DataBlock label="Number of Pages" value={iq.pages} />
                        <DataBlock
                          label="Design Style"
                          value={iq.designStyle}
                        />
                        <div className="col-span-full">
                          <DataBlock
                            label="Additional Details"
                            value={iq.details}
                          />
                        </div>
                      </>
                    )}

                    {/* STREAMING FORM DATA */}
                    {activeTab === "streaming" && (
                      <>
                        <DataBlock label="Type" value={iq.type} />
                        <DataBlock label="Days" value={iq.days} />
                        <DataBlock label="Cameras" value={iq.cameras} />
                        <DataBlock label="Platforms" value={iq.platforms} />
                        <DataBlock label="Recording" value={iq.recording} />
                        <DataBlock label="Overlays" value={iq.overlays} />
                        <DataBlock label="Edits" value={iq.edits} />
                        <div className="col-span-full">
                          <DataBlock
                            label="Project Details"
                            value={iq.details}
                          />
                        </div>
                      </>
                    )}

                    {/* GENERAL FORM DATA */}
                    {activeTab === "general" && (
                      <div className="col-span-full">
                        <DataBlock
                          label="Client Message"
                          value={iq.message || iq.details}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <p className="text-xs opacity-40 italic">
              No {activeTab} inquiries found.
            </p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const DataBlock = ({ label, value }) => {
  // Check for null, undefined, empty string, or empty array
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  )
    return null;

  return (
    <div className="space-y-1">
      <p className="text-[9px] opacity-40 tracking-widest uppercase">{label}</p>
      <p className="text-sm font-medium leading-relaxed">
        {Array.isArray(value) ? value.join(" + ") : value.toString()}
      </p>
    </div>
  );
};

export default AdminDashboard;
