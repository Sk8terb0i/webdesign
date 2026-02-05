import React, { useEffect, useState } from "react";
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

  // Use a fallback theme if the prop is missing to prevent crashes
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
        className="flex justify-between items-end mb-16 border-b pb-8"
        style={{ borderColor: `${safeTheme.bg}22` }}
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tighter">Inquiries</h1>
          <p className="text-[10px] opacity-50 tracking-[0.3em] mt-2">
            {inquiries.length} TOTAL REQUESTS
          </p>
        </div>
        <button
          onClick={() => signOut(auth)}
          className="text-[10px] font-bold tracking-[0.2em] border px-4 py-2 hover:bg-white hover:text-black"
          style={{ borderColor: `${safeTheme.bg}44` }}
        >
          LOGOUT
        </button>
      </header>

      <div className="grid grid-cols-1 gap-12">
        {inquiries.map((iq) => (
          <div
            key={iq.id}
            className="border-l-2 pl-8 py-2"
            style={{ borderColor: `${safeTheme.bg}22` }}
          >
            <h2 className="text-2xl font-bold">{iq.contact}</h2>
            <p className="text-[10px] opacity-50">
              {iq.createdAt?.toDate().toLocaleString() || "Recent"}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <DataBlock label="Type" value={iq.type} />
              <DataBlock label="Tier" value={iq.selectedTier} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DataBlock = ({ label, value }) => (
  <div>
    <p className="text-[9px] opacity-40 tracking-widest mb-1">{label}</p>
    <p className="text-xs font-medium">{value}</p>
  </div>
);

export default AdminDashboard;
