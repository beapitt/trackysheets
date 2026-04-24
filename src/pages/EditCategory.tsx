import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from "../supabase"; // Percorso relativo corretto

interface Category {
  id: string;
  name: string;
  slug: string;
  seo_title: string;
  meta_description: string;
  placement: 'sidebar' | 'top' | 'both';
  sort_order: number;
}

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    seo_title: '',
    meta_description: '',
    placement: 'sidebar' as 'sidebar' | 'top' | 'both',
    sort_order: 1,
  });

  useEffect(() => {
    if (id && id !== 'new') {
      fetchCategory();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setCategory(data);
        setFormData(data);
      }
    } catch (err) {
      setMessage('❌ Error loading category');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sort_order' ? parseInt(value) : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let updatedData = { ...formData };

      if (updatedData.name !== category?.name) {
        updatedData.slug = updatedData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      }

      const { error } = (id && id !== 'new')
        ? await supabase.from('categories').update(updatedData).eq('id', id)
        : await supabase.from('categories').insert([updatedData]);

      if (error) throw error;

      setMessage('✅ Category saved successfully!');
      setTimeout(() => navigate('/admin/categories'), 1500);
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-left font-sans">Loading category...</div>;

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

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="bg-[#2D5A27] text-white p-6 rounded-lg mb-8 shadow-md">
          <h1 className="text-2xl font-bold uppercase tracking-tight">
            {id && id !== 'new' ? 'Edit Category' : 'Create New Category'}
          </h1>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg font-bold ${message.includes('✅') ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : 'bg-red-100 text-red-800 border-l-4 border-red-500'}`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl border border-gray-200">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Category Name *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded outline-none focus:ring-1 focus:ring-green-600" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Slug *</label>
                <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded outline-none focus:ring-1 focus:ring-green-600" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">SEO Title *</label>
              <input required type="text" name="seo_title" value={formData.seo_title} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded outline-none focus:ring-1 focus:ring-green-600" maxLength={60} />
              <p className="text-[10px] text-gray-400 mt-1">{formData.seo_title.length}/60 characters</p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Meta Description *</label>
              <textarea required name="meta_description" value={formData.meta_description} onChange={handleChange} rows={3} className="w-full p-2 border border-gray-300 rounded outline-none focus:ring-1 focus:ring-green-600 text-sm" maxLength={160} />
              <p className="text-[10px] text-gray-400 mt-1">{formData.meta_description.length}/160 characters</p>
            </div>

            <div className="pt-4 flex gap-4">
              <button type="submit" disabled={saving} className="bg-[#2D5A27] text-white px-10 py-2 rounded font-bold uppercase text-xs shadow-md disabled:opacity-50">
                {saving ? 'Saving...' : '💾 Save Category'}
              </button>
              <Link to="/admin/categories" className="bg-gray-200 text-gray-700 px-10 py-2 rounded font-bold no-underline uppercase text-xs">Cancel</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

