import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from "../lib/supabase";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', slug: '', seo_title: '', meta_description: '', placement: 'Sidebar'
  });

  useEffect(() => {
    if (id) fetchCategory();
  }, [id]);

  async function fetchCategory() {
    const { data } = await supabase.from("categories").select("*").eq("id", id).single();
    if (data) setFormData(data);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = id 
      ? await supabase.from("categories").update(formData).eq("id", id)
      : await supabase.from("categories").insert([formData]);

    if (error) alert("Error: " + error.message);
    else navigate('/admin/categories');
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-left font-sans">
      <aside className="w-48 bg-[#1a3a1a] text-white p-6 shrink-0">
        <div className="mb-8 font-bold text-2xl">TS</div>
        <nav className="space-y-2 text-sm font-medium">
          <Link to="/admin/templates" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Templates</Link>
          <Link to="/admin/categories" className="block px-4 py-2 rounded bg-white/10 border-l-4 border-green-400 no-underline text-white font-bold">Categories</Link>
          <Link to="/admin/settings" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Settings</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <div className="max-w-3xl bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-[#2D5A27] mb-6 border-b pb-4 uppercase tracking-tight">
            {id ? 'Edit Category' : 'Add New Category'}
          </h1>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Slug</label>
                <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-2 border rounded" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Placement</label>
              <select value={formData.placement} onChange={e => setFormData({...formData, placement: e.target.value})} className="w-full p-2 border rounded">
                <option value="Sidebar">Sidebar</option>
                <option value="Top Menu">Top Menu</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">SEO Title</label>
              <input type="text" value={formData.seo_title} onChange={e => setFormData({...formData, seo_title: e.target.value})} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Meta Description</label>
              <textarea rows={3} value={formData.meta_description} onChange={e => setFormData({...formData, meta_description: e.target.value})} className="w-full p-2 border rounded text-sm" />
            </div>
            <div className="pt-4 flex gap-4">
              <button disabled={loading} type="submit" className="bg-[#2D5A27] text-white px-8 py-2 rounded font-bold uppercase text-xs">Save Category</button>
              <Link to="/admin/categories" className="bg-gray-200 text-gray-700 px-8 py-2 rounded font-bold no-underline uppercase text-xs">Cancel</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
