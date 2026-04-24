import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from "../lib/supabase";

export default function EditTemplate() {
  const { id } = useParams(); // Se c'è un ID, siamo in modalità "Edit"
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category_id: '',
    short_description: '',
    description: '',
    download_url: '',
    thumbnail_url: '',
    youtube_url: '',
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

    if (error) {
      alert("Error saving: " + error.message);
    } else {
      navigate('/admin/templates');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-left font-sans flex">
      {/* Sidebar */}
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
        <div className="max-w-4xl bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#2D5A27] p-6 text-white">
            <h1 className="text-2xl font-bold">{id ? 'Edit Template' : 'Add New Template'}</h1>
          </div>

          <form onSubmit={handleSave} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-green-600 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug</label>
                <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-green-600 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
              <select required value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full p-2 border rounded outline-none">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Download URL (Google Sheets)</label>
              <input required type="url" value={formData.download_url} onChange={e => setFormData({...formData, download_url: e.target.value})} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-green-600" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Thumbnail Image URL</label>
              <input type="text" value={formData.thumbnail_url} onChange={e => setFormData({...formData, thumbnail_url: e.target.value})} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-green-600" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Long Description (HTML supported)</label>
              <textarea rows={6} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-green-600 text-sm" />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} />
              <label htmlFor="featured" className="text-sm font-bold text-gray-700">Feature this on homepage</label>
            </div>

            <div className="pt-6 border-t flex gap-4">
              <button disabled={loading} type="submit" className="bg-[#2D5A27] text-white px-8 py-2 rounded font-bold hover:bg-[#1a3a1a]">
                {loading ? 'Saving...' : 'Save Template'}
              </button>
              <Link to="/admin/templates" className="bg-gray-200 text-gray-700 px-8 py-2 rounded font-bold no-underline hover:bg-gray-300">Cancel</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
