import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTemplates from "./pages/admin/AdminTemplates"; // Verifica il nome file
import AdminCategories from "./pages/admin/AdminCategories"; // Verifica il nome file
import Settings from "./pages/admin/Settings";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Sito Pubblico */}
        <Route path="/" element={<Home />} />
        
        {/* Dashboard Admin Centrale */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Sottopagine Admin - Qui colleghiamo le mattonelle */}
        <Route path="/admin/templates" element={<AdminTemplates />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/settings" element={<Settings />} />
        
        {/* Placeholder per le sezioni mancanti, così non vedi vuoto */}
        <Route path="/admin/ads" element={<div className="p-10">Sezione Ads in arrivo...</div>} />
        <Route path="/admin/legal" element={<div className="p-10">Sezione Legal in arrivo...</div>} />
      </Routes>
    </Router>
  );
}
