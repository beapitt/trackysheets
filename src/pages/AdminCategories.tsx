import React, { useEffect, useState } from 'react';
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data } = await supabase.from("categories").select("*").order("name", { ascending: true });
    if (data) setCategories(data);
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-left font-sans">
      <aside className="w-48 bg-[#1a3a1a] text-white p-6 shrink-0">
        <div className="mb-8 font-bold text-2xl">TS</div>
        <nav className="space-y-2 text-sm">
          <Link to="/admin/templates" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Templates</Link>
          <Link to="/admin/categories" className="block px-4 py-2 rounded bg-white/10 border-l-4 border-green-400 no-underline text-white font-bold">Categories</Link>
          <Link to="/admin/settings" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Settings</Link>
          <Link to="/admin" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white border-t border-white/10 mt-4 pt-4">Dashboard</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="bg-[#2D5A27] text-white p-6 rounded-lg mb-8 flex justify-between items-center shadow-md">
          <div>
            <h1 className="text-2xl font-bold">Manage Categories</h1>
            <p className="text-sm text-green-100">Organize your site categories</p>
          </div>
          <button className="bg-green-700 hover:bg-green-800 px-6 py-2 rounded font-bold text-white">+ Add Category</button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.slug}</td>
                  <td className="px-6 py-4 text-sm flex gap-3 text-left">
                    <button className="text-blue-600 hover:text-blue-900 font-bold">✏️ Edit</button>
                    <button className="text-red-600 hover:text-red-900 font-bold">🗑️ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
