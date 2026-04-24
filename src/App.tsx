import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTemplates from "./pages/AdminTemplates";
import AdminCategories from "./pages/AdminCategories";
import Settings from "./pages/Settings";
import EditTemplate from "./pages/EditTemplate";
import EditCategory from "./pages/EditCategory";
import TemplateDetail from "./pages/TemplateDetail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/template/:slug" element={<TemplateDetail />} />
        <Route path="/admin" element={<AdminDashboard />} />
        
        <Route path="/admin/templates" element={<AdminTemplates />} />
        <Route path="/admin/templates/new" element={<EditTemplate />} />
        <Route path="/admin/templates/edit/:id" element={<EditTemplate />} />
        
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/categories/new" element={<EditCategory />} />
        <Route path="/admin/categories/edit/:id" element={<EditCategory />} />
        
        <Route path="/admin/settings" element={<Settings />} />
        
        {/* Prossimamente AdSlots e Legal */}
        <Route path="/admin/ads" element={<div className="p-10 text-left">Ads coming soon...</div>} />
        <Route path="/admin/legal" element={<div className="p-10 text-left">Legal coming soon...</div>} />
      </Routes>
    </Router>
  );
}
