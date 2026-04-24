import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from "../supabase";

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
      const { error } = id && id !== 'new'
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

  const inputClass = "w-full p-2 border rounded outline-none focus:ring-1 focus:ring-green-600";
  const labelClass = "block text-[11px] font-bold text-gray-500 uppercase mb-1";

  if (loading) return <div className="p-8 font-sans">Loading...</div>;

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
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl space-y-6 border border-gray-200">
          <h1 className="text-xl font-bold uppercase text-[#2D5A27] border-b pb-2">
            {id && id !== 'new' ? 'Edit Category' : 'Add New Category'}
          </h1>

          {message && (
            <div className={`p-3 rounded font-bold text-xs ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-left">

            <div>
              <label className={labelClass}>Category Name *</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className={inputClass}
                placeholder="e.g. Finance"
              />
            </div>

            <div>
              <label className={labelClass}>Slug *</label>
              <input
                required
                type="text"
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                className={inputClass}
                placeholder="e.g. finance"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Placement</label>
                <select
                  value={formData.placement}
                  onChange={e => setFormData({ ...formData, placement: e.target.value })}
                  className={inputClass}
                >
                  <option value="sidebar">Sidebar</option>
                  <option value="header">Header</option>
                  <option value="footer">Footer</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Sort Order</label>
                <input
                  type="number"
                  min={1}
                  value={formData.sort_order}
                  onChange={e => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>SEO Title</label>
              <input
                type="text"
                value={formData.seo_title}
                onChange={e => setFormData({ ...formData, seo_title: e.target.value })}
                className={inputClass}
                placeholder="SEO optimized title"
              />
            </div>

            {/* ✅ Campo mancante aggiunto */}
            <div>
              <label className={labelClass}>Meta Description</label>
              <textarea
                value={formData.meta_description}
                onChange={e => setFormData({ ...formData, meta_description: e.target.value })}
                className={inputClass}
                rows={3}
                placeholder="Brief description for search engines"
              />
            </div>

            <div className="pt-4 flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#2D5A27] text-white px-8 py-2 rounded font-bold uppercase text-xs disabled:opacity-50"
              >
                {saving ? 'Saving...' : '💾 Save Category'}
              </button>
              <Link
                to="/admin/categories"
                className="bg-gray-200 text-gray-700 px-8 py-2 rounded font-bold no-underline uppercase text-xs"
              >
                Cancel
              </Link>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
