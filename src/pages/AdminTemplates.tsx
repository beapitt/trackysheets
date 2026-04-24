import React, { useEffect, useState } from 'react';
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

export default function AdminTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    const { data } = await supabase.from("templates").select("*").order("created_at", { ascending: false });
    if (data) setTemplates(data);
    setLoading(false);
  }

  const filteredTemplates = templates.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100 text-left font-sans">
      <aside className="w-48 bg-[#1a3a1a] text-white p-6 shrink-0">
        <div className="mb-8 font-bold text-2xl">TS</div>
        <nav className="space-y-2 text-sm">
          <Link to="/admin/templates" className="block px-4 py-2 rounded bg-white/10 border-l-4 border-green-400 no-underline text-white font-bold">Templates</Link>
          <Link to="/admin/categories" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Categories</Link>
          <Link to="/admin/settings" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Settings</Link>
          <Link to="/admin" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white border-t border-white/10 mt-4 pt-4">Dashboard</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="bg-[#2D5A27] text-white p-6 rounded-lg mb-8 flex justify-between items-center shadow-md">
          <div>
            <h1 className="text-2xl font-bold">Manage Templates</h1>
            <p className="text-sm text-green-100">Edit or add new products</p>
          </div>
          <Link to="/admin/templates/new" className="bg-green-700 hover:bg-green-800 px-6 py-2 rounded font-bold text-white no-underline shadow">+ Add New</Link>
        </div>

        <div className="mb-6">
          <input 
            type="text" 
            placeholder="Search templates by title..." 
            className="w-full max-w-md p-2 border rounded shadow-sm outline-none focus:ring-2 focus:ring-green-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTemplates.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{t.title}</td>
                  <td className="px-6 py-4 text-sm flex gap-4">
                    <Link to={`/admin/templates/edit/${t.id}`} className="text-blue-600 hover:text-blue-900 font-bold no-underline">✏️ Edit</Link>
                    <button className="text-red-600 hover:text-red-900 font-bold bg-transparent border-none cursor-pointer">🗑️ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTemplates.length === 0 && !loading && <p className="p-10 text-center text-gray-500">No templates found.</p>}
        </div>
      </main>
    </div>
  );
}
