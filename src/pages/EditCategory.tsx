import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// Percorso corretto basato sulla tua struttura: esce da pages ed entra in lib
import { supabase } from "../lib/supabase";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '', slug: '', seo_title: '', meta_description: '',
    placement: 'sidebar', sort_order: 1,
  });

  useEffect(() => {
    if (id && id !== 'new') fetchCategory();
    else setLoading(false);
  }, [id]);

  async function fetchCategory() {
    try {
      const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();
      if (error) throw error;
      if (data) setFormData(data);
    } catch (err) {
      setMessage('❌ Error loading category');
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = (id && id !== 'new')
        ? await supabase.from('categories').update(formData).eq('id', id)
        : await supabase.from('categories').insert([formData]);

      if (error) throw error;
      setMessage('✅ Category saved!');
      setTimeout(() => navigate('/admin/categories'), 1500);
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 font-sans">Loading...</div>;

  const labelClass = "block text-[11px] font-bold text-gray-500 uppercase mb-1";
  const inputClass = "w-full p-2 border rounded outline-none focus:ring-1 focus:ring-green-600 text-sm";

  return (
    <div className="flex min-h-screen bg-gray-100 text-left font-sans">
      <aside className="w-48 bg-[#1a3a1a] text-white p-6 shrink-0">
        <div className="mb-8 font-bold text-2xl uppercase">TS</div>
        <nav className="space-y-2 text-sm">
          <Link to="/admin/templates" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white font-bold">Templates</Link>
          <Link to="/admin/categories" className="block px-4 py-2 rounded bg-white/10 border-l-4 border-green-400 no-underline text-white font-bold">Categories</Link>
          <Link to="/admin/settings" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white font-bold">Settings</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 text-left">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl border border-gray-200">
          <h1 className="text-xl font-bold uppercase text-[#2D5A27] border-b pb-2 mb-6">Edit Category</h1>
          {message && <div className={`p-3 mb-4 rounded font-bold text-xs ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message}</div>}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className={labelClass}>Name *</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>SEO Title</label>
              <input type="text" value={formData.seo_title} onChange={e => setFormData({...formData, seo_title: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Meta Description</label>
              <textarea value={formData.meta_description} onChange={e => setFormData({...formData, meta_description: e.target.value})} className={inputClass} rows={3} />
            </div>
            <div className="pt-4 flex gap-4">
              <button type="submit" disabled={saving} className="bg-[#2D5A27] text-white px-8 py-2 rounded font-bold uppercase text-xs shadow-md">
                {saving ? 'Saving...' : '💾 Save'}
              </button>
              <Link to="/admin/categories" className="bg-gray-200 text-gray-700 px-8 py-2 rounded font-bold no-underline uppercase text-xs">Cancel</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

