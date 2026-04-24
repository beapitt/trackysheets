import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from "../supabase";

export default function EditTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '', slug: '', category: '', short_description: '', long_description: '',
    thumbnail: '', img_1: '', img_2: '', img_3: '',
    download_url: '', youtube_url: '', seo_title: '', meta_description: '',
    featured: false, status: 'draft' as 'draft' | 'published',
  });

  useEffect(() => {
    if (id && id !== 'new') fetchTemplate();
    else setLoading(false);
  }, [id]);

  async function fetchTemplate() {
    try {
      const { data, error } = await supabase.from('templates').select('*').eq('id', id).single();
      if (error) throw error;
      if (data) setFormData(data);
    } catch (err) {
      setMessage('❌ Error loading template');
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = id && id !== 'new'
        ? await supabase.from('templates').update(formData).eq('id', id)
        : await supabase.from('templates').insert([formData]);

      if (error) throw error;
      setMessage('✅ Template saved successfully!');
      setTimeout(() => navigate('/admin/templates'), 1500);
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 font-sans text-gray-500">Loading...</div>;

  const labelClass = "block text-[11px] font-bold text-gray-500 uppercase mb-2";
  const inputClass = "w-full p-2 border border-gray-300 rounded outline-none focus:ring-1 focus:ring-green-600 text-sm";

  return (
    <div className="flex min-h-screen bg-gray-100 text-left font-sans">
      <aside className="w-48 bg-[#1a3a1a] text-white p-6 shrink-0">
        <div className="mb-8 font-bold text-2xl uppercase tracking-tighter">TS</div>
        <nav className="space-y-2 text-sm font-bold uppercase tracking-tight">
          <Link to="/admin/templates" className="block px-4 py-2 rounded bg-white/10 border-l-4 border-green-400 no-underline text-white font-bold">Templates</Link>
          <Link to="/admin/categories" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Categories</Link>
          <Link to="/admin/settings" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Settings</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 text-left overflow-y-auto">
        <div className="bg-[#2D5A27] text-white p-6 rounded-lg mb-8 shadow-md">
          <h1 className="text-2xl font-bold uppercase tracking-tight">
            {id && id !== 'new' ? 'Edit Template' : 'New Template'}
          </h1>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm max-w-4xl border border-gray-200">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Title *</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Slug *</label>
                <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className={inputClass} />
              </div>
            </div>
            <div className="pt-4 border-t">
              <button type="submit" disabled={saving} className="bg-[#2D5A27] text-white px-8 py-2 rounded font-bold uppercase text-xs shadow-md">
                {saving ? 'Saving...' : '💾 Save Template'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
