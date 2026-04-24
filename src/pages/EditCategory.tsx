import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from "../supabase";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '', slug: '', seo_title: '', meta_description: '', placement: 'sidebar'
  });

  useEffect(() => {
    if (id && id !== 'new') fetchCategory();
    else setLoading(false);
  }, [id]);

  async function fetchCategory() {
    const { data } = await supabase.from('categories').select('*').eq('id', id).single();
    if (data) setFormData(data);
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = id && id !== 'new'
      ? await supabase.from('categories').update(formData).eq('id', id)
      : await supabase.from('categories').insert([formData]);

    if (!error) navigate('/admin/categories');
    else alert(error.message);
  };

  if (loading) return <div className="p-10 font-sans">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 text-left font-sans">
      <aside className="w-48 bg-[#1a3a1a] text-white p-6 shrink-0">
        <div className="mb-8 font-bold text-2xl uppercase">TS</div>
        <nav className="space-y-2 text-sm">
          <Link to="/admin/templates" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Templates</Link>
          <Link to="/admin/categories" className="block px-4 py-2 rounded bg-white/10 border-l-4 border-green-400 no-underline text-white font-bold">Categories</Link>
          <Link to="/admin/settings" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Settings</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl">
          <h2 className="text-xl font-bold mb-6 uppercase text-[#2D5A27] border-b pb-2">{id && id !== 'new' ? 'Edit Category' : 'Add New Category'}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase">Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase">Slug</label>
              <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase">SEO Title</label>
              <input type="text" value={formData.seo_title} onChange={e => setFormData({...formData, seo_title: e.target.value})} className="w-full p-2 border rounded" />
            </div>
            <button type="submit" className="bg-[#2D5A27] text-white px-8 py-2 rounded font-bold uppercase text-xs">Save Category</button>
          </form>
        </div>
      </main>
    </div>
  );
}
