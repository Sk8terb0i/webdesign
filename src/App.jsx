import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import AdminDashboard from "./components/AdminDashBoard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
