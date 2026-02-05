import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";

// 1. Firestore imports (Database)
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";

// 2. Auth imports (Login/User state)
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

  // --- AUTH OBSERVER ---
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) fetchInquiries();
    });
    return () => unsubscribe();
  }, []);

  // --- DATA FETCHING ---
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

  // --- ACTIONS ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setLoginError("Invalid credentials");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      try {
        await deleteDoc(doc(db, "inquiries", id));
        setInquiries(inquiries.filter((iq) => iq.id !== id));
      } catch (err) {
        alert("Error deleting document");
      }
    }
  };

  if (loading) return null;

  // --- LOGIN VIEW ---
  if (!user) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen p-6 font-sans"
        style={{ backgroundColor: theme.bg, color: theme.text }}
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
              className="w-full border-b bg-transparent py-4 text-sm outline-none transition-all focus:border-opacity-100 border-opacity-30"
              style={{ borderColor: theme.text, color: theme.text }}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border-b bg-transparent py-4 text-sm outline-none transition-all focus:border-opacity-100 border-opacity-30"
              style={{ borderColor: theme.text, color: theme.text }}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-5 text-[11px] font-bold tracking-[0.3em] transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: theme.text, color: theme.bg }}
          >
            LOGIN
          </button>
        </form>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div
      className="min-h-screen p-8 md:p-16 font-sans"
      style={{ backgroundColor: theme.text, color: theme.bg }}
    >
      <header
        className="flex justify-between items-end mb-16 border-b pb-8"
        style={{ borderColor: `${theme.bg}22` }}
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tighter">Inquiries</h1>
          <p className="text-[10px] opacity-50 tracking-[0.3em] mt-2">
            {inquiries.length} TOTAL REQUESTS
          </p>
        </div>
        <button
          onClick={() => auth.signOut()}
          className="text-[10px] font-bold tracking-[0.2em] border px-4 py-2 hover:bg-white hover:text-black transition-all"
          style={{ borderColor: `${theme.bg}44` }}
        >
          LOGOUT
        </button>
      </header>

      <div className="grid grid-cols-1 gap-12">
        <AnimatePresence>
          {inquiries.map((iq) => (
            <motion.div
              key={iq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group relative border-l-2 pl-8 py-2 transition-all"
              style={{ borderColor: `${theme.bg}22` }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {iq.contact}
                  </h2>
                  <p className="text-[10px] opacity-50 tracking-widest mt-1">
                    {iq.createdAt?.toDate().toLocaleString() || "Recent"}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="text-right">
                    <p className="text-[9px] opacity-40 tracking-widest">
                      ESTIMATE
                    </p>
                    <p className="text-xl font-bold">
                      CHF {iq.calculatedTiers?.[1]?.toLocaleString() || "N/A"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(iq.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 transition-opacity"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <DataBlock
                  label="Project Type"
                  value={`${iq.type} (${iq.pages} pages)`}
                />
                <DataBlock
                  label="Contact Channel"
                  value={`${iq.channel} ${iq.messagingApp ? `— ${iq.messagingApp}` : ""}`}
                />
                <DataBlock label="Tier Choice" value={iq.selectedTier} />
                <DataBlock
                  label="Assets/Copy"
                  value={`${iq.assets} / ${iq.copy}`}
                />
                <div className="col-span-2 md:col-span-4">
                  <p className="text-[9px] opacity-40 tracking-widest mb-2">
                    FEATURES
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {iq.features?.map((f) => (
                      <span
                        key={f}
                        className="text-[10px] border px-2 py-1"
                        style={{ borderColor: `${theme.bg}22` }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {inquiries.length === 0 && (
          <div className="py-20 text-center opacity-30 text-[11px] tracking-[0.4em]">
            NO INQUIRIES YET
          </div>
        )}
      </div>
    </div>
  );
};

const DataBlock = ({ label, value }) => (
  <div>
    <p className="text-[9px] opacity-40 tracking-widest mb-1">{label}</p>
    <p className="text-xs font-medium tracking-tight">{value}</p>
  </div>
);

export default AdminDashboard;
