import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTemplates from "./pages/AdminTemplates";
import AdminCategories from "./pages/AdminCategories";
import Settings from "./pages/Settings";
import TemplateDetail from "./pages/TemplateDetail";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Disclaimer from "./pages/Disclaimer";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Site */}
        <Route path="/" element={<Home />} />
        <Route path="/template/:slug" element={<TemplateDetail />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        
        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Admin Subpages - Now correctly linked */}
        <Route path="/admin/templates" element={<AdminTemplates />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/settings" element={<Settings />} />
        
        {/* Placeholders for remaining sections */}
        <Route path="/admin/ads" element={<div className="p-10 text-left font-sans">Ad Slots section coming soon...</div>} />
        <Route path="/admin/legal" element={<div className="p-10 text-left font-sans">Legal & SEO section coming soon...</div>} />
      </Routes>
    </Router>
  );
}
