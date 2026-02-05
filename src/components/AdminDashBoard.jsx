import React, { useEffect, useState, useMemo } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
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
      if (currentUser) fetchInquiries();
    });
    return () => unsubscribe();
  }, []);

  const fetchInquiries = async () => {
    try {
      const q = query(
        collection(db, "inquiries"),
        orderBy("createdAt", "desc"),
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInquiries(data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setLoginError("Invalid credentials");
    }
  };

  // Filter logic for the three categories
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((iq) => {
      if (activeTab === "web") return !!iq.type; // Web forms have 'type'
      if (activeTab === "streaming") return !!iq.streamType || !!iq.gear; // Streaming specific fields
      if (activeTab === "general") return !iq.type && !iq.streamType; // Fallback for general contact
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
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">
              Admin Access
            </h1>
            <p className="text-[10px] opacity-50 tracking-[0.3em] mt-2">
              SECURE PORTAL
            </p>
          </div>
          {loginError && (
            <p className="text-red-500 text-[10px] font-bold tracking-widest">
              {loginError}
            </p>
          )}
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border-b bg-transparent py-4 text-sm outline-none transition-all border-opacity-30"
              style={{ borderColor: safeTheme.text, color: safeTheme.text }}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border-b bg-transparent py-4 text-sm outline-none transition-all border-opacity-30"
              style={{ borderColor: safeTheme.text, color: safeTheme.text }}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-5 text-[11px] font-bold tracking-[0.3em]"
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
          <p className="text-[10px] opacity-50 tracking-[0.3em] mt-2">
            {filteredInquiries.length} {activeTab.toUpperCase()} REQUESTS
          </p>
        </div>
        <button
          onClick={() => signOut(auth)}
          className="text-[10px] font-bold tracking-[0.2em] border px-4 py-2 hover:bg-white hover:text-black transition-colors"
          style={{ borderColor: `${safeTheme.bg}44` }}
        >
          LOGOUT
        </button>
      </header>

      {/* Tabs Navigation */}
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

      <div className="grid grid-cols-1 gap-10">
        <AnimatePresence mode="wait">
          {filteredInquiries.length > 0 ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              {filteredInquiries.map((iq) => (
                <div
                  key={iq.id}
                  className="border-l-2 pl-8 py-2 group"
                  style={{ borderColor: `${safeTheme.bg}22` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold">{iq.contact}</h2>
                      <p className="text-[10px] opacity-50">
                        {iq.createdAt?.toDate().toLocaleString() || "Recent"} —{" "}
                        {iq.channel}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Common Fields */}
                    {iq.type && (
                      <DataBlock label="Project Type" value={iq.type} />
                    )}
                    {iq.selectedTier && (
                      <DataBlock label="Tier" value={iq.selectedTier} />
                    )}
                    {iq.pages && <DataBlock label="Pages" value={iq.pages} />}

                    {/* Streaming Specific */}
                    {iq.streamType && (
                      <DataBlock label="Stream" value={iq.streamType} />
                    )}
                    {iq.location && (
                      <DataBlock label="Location" value={iq.location} />
                    )}

                    {/* General/Message */}
                    {iq.details && (
                      <div className="col-span-2">
                        <DataBlock label="Details" value={iq.details} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="text-xs italic"
            >
              No {activeTab} inquiries found.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const DataBlock = ({ label, value }) => {
  if (!value) return null;
  return (
    <div>
      <p className="text-[9px] opacity-40 tracking-widest mb-1 uppercase">
        {label}
      </p>
      <p className="text-xs font-medium">
        {Array.isArray(value) ? value.join(", ") : value}
      </p>
    </div>
  );
};

export default AdminDashboard;
