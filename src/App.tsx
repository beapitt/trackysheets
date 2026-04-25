import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import TemplateDetail from './pages/TemplateDetail';
import Login from './pages/Login'; 
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
        <Route path="/login" element={<Login />} /> 
        
        {/* Rotte Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/templates" element={<AdminTemplates />} />
        <Route path="/admin/templates/new" element={<EditTemplate />} />
        <Route path="/admin/templates/:id/edit" element={<EditTemplate />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/categories/new" element={<EditCategory />} />
        <Route path="/admin/categories/:id/edit" element={<EditCategory />} />
        <Route path="/admin/settings" element={<Settings />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
