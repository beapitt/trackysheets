import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Page Imports
import Home from './pages/Home';
import TemplateDetail from './pages/TemplateDetail';
import CategoryPage from './pages/CategoryPage';
import Login from './pages/Login'; 
import AdminDashboard from './pages/AdminDashboard';
import AdminTemplates from './pages/AdminTemplates';
import EditTemplate from './pages/EditTemplate';
import AdminCategories from './pages/AdminCategories';
import EditCategory from './pages/EditCategory';
import Settings from './pages/Settings';
import Disclaimer from './pages/Disclaimer';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

// AGGIUNGI QUESTO IMPORT
import AllTemplates from './pages/AllTemplates';

// Import del Banner Cookie
import CookieBanner from './components/CookieBanner';

export default function App() {
  return (
    <BrowserRouter>
      {/* Il banner deve stare QUI, fuori da Routes, per essere visibile ovunque */}
      <CookieBanner />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/template/:slug" element={<TemplateDetail />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/login" element={<Login />} /> 
        
        {/* AGGIUNGI QUESTA ROTTA */}
        <Route path="/templates" element={<AllTemplates />} />
        
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/templates" element={<AdminTemplates />} />
        <Route path="/admin/templates/new" element={<EditTemplate />} />
        <Route path="/admin/templates/:id/edit" element={<EditTemplate />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/categories/new" element={<EditCategory />} />
        <Route path="/admin/categories/:id/edit" element={<EditCategory />} />
        <Route path="/admin/settings" element={<Settings />} />

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
