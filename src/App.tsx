import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Home from './pages/Home';
import TemplateDetail from './pages/TemplateDetail';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminTemplates from './pages/AdminTemplates';
import EditTemplate from './pages/EditTemplate';
import AdminCategories from './pages/AdminCategories';
import EditCategory from './pages/EditCategory';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/template/:slug" element={<TemplateDetail />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Templates */}
        <Route path="/admin/templates" element={<AdminTemplates />} />
        <Route path="/admin/templates/new" element={<EditTemplate />} />
        <Route path="/admin/templates/:id/edit" element={<EditTemplate />} />

        {/* Categories */}
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/categories/new" element={<EditCategory />} />
        <Route path="/admin/categories/:id/edit" element={<EditCategory />} />

        {/* Settings */}
        <Route path="/admin/settings" element={<Settings />} />

        {/* Fallbacks per AdSlots e Legal - Mandano alla dashboard invece che dare errore */}
        <Route path="/admin/ads" element={<AdminDashboard />} />
        <Route path="/admin/legal" element={<AdminDashboard />} />

        {/* Redirect automatico se la pagina non esiste */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
