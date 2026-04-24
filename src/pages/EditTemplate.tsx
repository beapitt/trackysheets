import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from "../lib/supabase";

export default function EditTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '', slug: '', category_id: '', short_description: '', description: '',
    download_url: '', thumbnail_url: '', youtube_url: '', 
    img_1: '', img_2: '', img_3: '',
    seo_title: '', meta_description: '', is_featured: false
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
          <Link to="/admin/categories" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Categories</Link>
          <Link to="/admin/settings" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Settings</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl bg-white rounded-lg shadow-md mb-10">
          <div className="bg-[#2D5A27] p-6 text-white font-bold text-xl uppercase tracking-tight">
            {id ? 'Edit Template' : 'Add New Template'}
          </div>
          <form onSubmit={handleSave} className="p-8 space-y-8">
            
            {/* BASIC INFO */}
            <section className="space-y-4">
              <h3 className="font-bold text-gray-400 uppercase text-xs border-b pb-1">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Slug</label>
                  <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-2 border rounded" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Category</label>
                  <select required value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full p-2 border rounded">
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">YouTube Video URL</label>
                  <input type="text" value={formData.youtube_url} onChange={e => setFormData({...formData, youtube_url: e.target.value})} className="w-full p-2 border rounded" placeholder="https://www.youtube.com/watch?v=..." />
                </div>
              </div>
            </section>

            {/* ASSETS & DOWNLOAD */}
            <section className="space-y-4">
              <h3 className="font-bold text-gray-400 uppercase text-xs border-b pb-1">Assets & Download</h3>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Main Thumbnail URL</label>
                <input required type="text" value={formData.thumbnail_url} onChange={e => setFormData({...formData, thumbnail_url: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Carousel Image 1</label>
                  <input type="text" value={formData.img_1} onChange={e => setFormData({...formData, img_1: e.target.value})} className="w-full p-2 border rounded text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Carousel Image 2</label>
                  <input type="text" value={formData.img_2} onChange={e => setFormData({...formData, img_2: e.target.value})} className="w-full p-2 border rounded text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Carousel Image 3</label>
                  <input type="text" value={formData.img_3} onChange={e => setFormData({...formData, img_3: e.target.value})} className="w-full p-2 border rounded text-xs" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Google Sheets Download URL</label>
                <input required type="url" value={formData.download_url} onChange={e => setFormData({...formData, download_url: e.target.value})} className="w-full p-2 border rounded" />
              </div>
            </section>

            {/* SEO & DESCRIPTION */}
            <section className="space-y-4">
              <h3 className="font-bold text-gray-400 uppercase text-xs border-b pb-1">SEO & Content</h3>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">SEO Title</label>
                <input type="text" value={formData.seo_title} onChange={e => setFormData({...formData, seo_title: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Meta Description</label>
                <textarea rows={2} value={formData.meta_description} onChange={e => setFormData({...formData, meta_description: e.target.value})} className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Full Description (HTML allowed)</label>
                <textarea rows={6} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded text-sm" />
              </div>
            </section>

            <div className="pt-6 border-t flex gap-4">
              <button disabled={loading} type="submit" className="bg-[#2D5A27] text-white px-10 py-3 rounded font-bold uppercase text-sm shadow-md">{loading ? 'Saving...' : 'Save Template'}</button>
              <Link to="/admin/templates" className="bg-gray-200 text-gray-700 px-10 py-3 rounded font-bold no-underline uppercase text-sm">Cancel</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
