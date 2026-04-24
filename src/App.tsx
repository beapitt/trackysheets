import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public
import Home from './pages/Home';
import TemplateDetail from './pages/TemplateDetail';

// Admin - Assicurati che i nomi dei file su GitHub siano ESATTAMENTE questi
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
        <Route path="/" element={<Home />} />
        <Route path="/template/:slug" element={<TemplateDetail />} />
        
        {/* Admin Section */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/templates" element={<AdminTemplates />} />
        <Route path="/admin/templates/new" element={<EditTemplate />} />
        <Route path="/admin/templates/:id/edit" element={<EditTemplate />} />
        
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/categories/new" element={<EditCategory />} />
        <Route path="/admin/categories/:id/edit" element={<EditCategory />} />
        
        <Route path="/admin/settings" element={<Settings />} />

        {/* Fallback per AdSlots e Legal che non hai ancora creato */}
        <Route path="/admin/ads" element={<AdminDashboard />} />
        <Route path="/admin/legal" element={<AdminDashboard />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
