import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from "../lib/supabase";

export default function EditTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category_id: '',
    description: '',
    download_url: '',
    thumbnail_url: '',
    is_featured: false
  });

  useEffect(() => {
    fetchCategories();
    if (id) fetchTemplate();
  }, [id]);

  async function fetchCategories() {
    const { data } = await supabase.from("categories").select("*").order("name");
    if (data) setCategories(data);
  }

  async function fetchTemplate() {
    const { data } = await supabase.from("templates").select("*").eq("id", id).single();
    if (data) setFormData(data);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = id 
      ? await supabase.from("templates").update(formData).eq("id", id)
      : await supabase.from("templates").insert([formData]);

    if (error) alert("Error: " + error.message);
    else navigate('/admin/templates');
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-left font-sans">
      <aside className="w-48 bg-[#1a3a1a] text-white p-6 shrink-0">
        <div className="mb-8 font-bold text-2xl">TS</div>
        <nav className="space-y-2 text-sm">
          <Link to="/admin/templates" className="block px-4 py-2 rounded bg-white/10 border-l-4 border-green-400 no-underline text-white font-bold">Templates</Link>
          <Link to="/admin/categories" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white font-bold">Categories</Link>
          <Link to="/admin/settings" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white font-bold">Settings</Link>
          <Link to="/admin" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white border-t border-white/10 mt-4 pt-4">Dashboard</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-4xl bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#2D5A27] p-6 text-white font-bold text-xl">
            {id ? 'Edit Template' : 'Add New Template'}
          </div>
          <form onSubmit={handleSave} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug</label>
                <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-2 border rounded" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
              <select required value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full p-2 border rounded">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Download URL</label>
              <input required type="url" value={formData.download_url} onChange={e => setFormData({...formData, download_url: e.target.value})} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
              <textarea rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded text-sm" />
            </div>
            <div className="flex gap-4 pt-4">
              <button disabled={loading} type="submit" className="bg-[#2D5A27] text-white px-8 py-2 rounded font-bold">{loading ? 'Saving...' : 'Save'}</button>
              <Link to="/admin/templates" className="bg-gray-200 text-gray-700 px-8 py-2 rounded font-bold no-underline">Cancel</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
