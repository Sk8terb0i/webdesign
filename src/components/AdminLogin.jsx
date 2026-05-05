import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const AdminLogin = ({ theme, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      // Use setPersistence if you want to ensure it stays logged in across refreshes
      await signInWithEmailAndPassword(auth, email, password);

      // We don't call onLogin() immediately. We wait a tiny bit for
      // the Firebase Auth token to propagate to the browser.
      setTimeout(() => {
        onLogin();
      }, 500);
    } catch (err) {
      console.error("Login Error:", err.code);
      setError("Invalid credentials or connection issue.");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold tracking-tighter">Admin Access</h1>
        {error && (
          <p className="text-red-500 text-xs font-bold tracking-widest">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border-b bg-transparent py-3 outline-none"
            style={{ borderColor: theme.text }}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border-b bg-transparent py-3 outline-none"
            style={{ borderColor: theme.text }}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 font-bold tracking-[0.2em] transition-opacity hover:opacity-80"
          style={{ backgroundColor: theme.text, color: theme.bg }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
