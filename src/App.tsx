import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTemplates from "./pages/AdminTemplates";
import AdminCategories from "./pages/AdminCategories";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Site */}
        <Route path="/" element={<Home />} />
        
        {/* Central Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Admin Subpages - Routes linked to Dashboard cards */}
        <Route path="/admin/templates" element={<AdminTemplates />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/settings" element={<Settings />} />
        
        {/* Placeholders for sections under development */}
        <Route path="/admin/ads" element={<div className="p-10 text-left font-sans">Ad Slots section coming soon...</div>} />
        <Route path="/admin/legal" element={<div className="p-10 text-left font-sans">Legal & SEO section coming soon...</div>} />
      </Routes>
    </Router>
  );
}
