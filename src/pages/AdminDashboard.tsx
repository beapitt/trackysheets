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
        supabase.from('templates').select('id', { count: 'exact' }),
        supabase.from('categories').select('id', { count: 'exact' }),
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-48 bg-green-900 text-white p-6">
        <div className="mb-8">
          <div className="text-2xl font-bold mb-2">TS</div>
          <div className="text-sm">TrackySheets Admin</div>
        </div>
        <nav className="space-y-2">
          <a href="/admin/templates" className="block px-4 py-2 rounded hover:bg-white hover:bg-opacity-5">Templates</a>
          <a href="/admin/categories" className="block px-4 py-2 rounded hover:bg-white hover:bg-opacity-5">Categories</a>
          <a href="/admin/settings" className="block px-4 py-2 rounded hover:bg-white hover:bg-opacity-5">Settings</a>
          <a href="/admin/dashboard" className="block px-4 py-2 rounded bg-white bg-opacity-10 border-l-4 border-green-100">Dashboard</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-green-900 mb-8">Admin Dashboard</h1>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {/* Templates Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Templates</p>
                  <p className="text-4xl font-bold text-green-900">{stats.templates}</p>
                </div>
                <div className="text-5xl">📄</div>
              </div>
              <button
                onClick={() => navigate('/admin/templates')}
                className="mt-4 w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Manage Templates
              </button>
            </div>

            {/* Categories Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Categories</p>
                  <p className="text-4xl font-bold text-green-900">{stats.categories}</p>
                </div>
                <div className="text-5xl">📁</div>
              </div>
              <button
                onClick={() => navigate('/admin/categories')}
                className="mt-4 w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg transition"
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
