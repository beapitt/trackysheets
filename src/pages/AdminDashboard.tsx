import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    templates: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [templatesRes, categoriesRes] = await Promise.all([
        supabase.from('templates').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        templates: templatesRes.count || 0,
        categories: categoriesRes.count || 0,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar - Stessa struttura per coerenza */}
      <aside className="w-64 bg-[#1F5C3E] text-white p-8">
        <div className="mb-12">
          <div className="text-3xl font-bold tracking-tighter mb-1">TS</div>
          <div className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-bold">Admin Panel</div>
        </div>
        <nav className="space-y-4">
          <a href="/admin/templates" className="block text-sm font-bold opacity-70 hover:opacity-100 transition-opacity">Templates</a>
          <a href="/admin/categories" className="block text-sm font-bold opacity-70 hover:opacity-100 transition-opacity">Categories</a>
          <a href="/admin/settings" className="block text-sm font-bold opacity-70 hover:opacity-100 transition-opacity">Settings</a>
          <a href="/admin/dashboard" className="block text-sm font-bold border-l-2 border-white pl-4">Dashboard</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12">
        <header className="mb-12">
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Overview</h1>
           <p className="text-gray-500 text-sm mt-1">Monitor your content and platform statistics.</p>
        </header>

        {loading ? (
          <div className="text-sm font-bold text-gray-300 animate-pulse">LOADING STATS...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Templates Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Total Templates</p>
                  <p className="text-5xl font-black text-[#1F5C3E]">{stats.templates}</p>
                </div>
                <div className="w-14 h-14 bg-[#EAF3DE] rounded-2xl flex items-center justify-center text-2xl">📄</div>
              </div>
              <button
                onClick={() => navigate('/admin/templates')}
                className="w-full bg-[#1F5C3E] text-white text-[11px] font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-[#1F5C3E]/10"
              >
                Manage Templates
              </button>
            </div>

            {/* Categories Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Total Categories</p>
                  <p className="text-5xl font-black text-[#1F5C3E]">{stats.categories}</p>
                </div>
                <div className="w-14 h-14 bg-[#EAF3DE] rounded-2xl flex items-center justify-center text-2xl">📁</div>
              </div>
              <button
                onClick={() => navigate('/admin/categories')}
                className="w-full bg-[#1F5C3E] text-white text-[11px] font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-[#1F5C3E]/10"
              >
                Manage Categories
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
