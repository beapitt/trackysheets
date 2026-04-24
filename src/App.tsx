import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
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
        
        {/* Fallback per le sottopagine non ancora create */}
        <Route path="/admin/settings" element={<AdminDashboard />} />
        <Route path="/admin/templates" element={<AdminDashboard />} />
        <Route path="/admin/categories" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
