import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/supabase';

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
    if (id) {
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
      setCategory(data);
      setFormData(data);
      setLoading(false);
    } catch (err) {
      setMessage('❌ Error loading category');
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

  const handleSave = async () => {
    setSaving(true);
    try {
      let updatedData = { ...formData };

      // Auto-generate slug from name if changed
      if (updatedData.name !== category?.name) {
        updatedData.slug = updatedData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      }

      if (id) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update(updatedData)
          .eq('id', id);

        if (error) throw error;
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert([updatedData]);

        if (error) throw error;
      }

      setMessage('✅ Category saved successfully!');
      setTimeout(() => navigate('/admin/categories'), 2000);
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading category...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-48 bg-green-900 text-white p-6 fixed h-screen overflow-y-auto">
        <div className="mb-8">
          <div className="text-2xl font-bold mb-2">TS</div>
          <div className="text-sm">TrackySheets Admin</div>
        </div>
        <nav className="space-y-2">
          <a href="/admin/templates" className="block px-4 py-2 rounded hover:bg-white hover:bg-opacity-5">Templates</a>
          <a href="/admin/categories" className="block px-4 py-2 rounded bg-white bg-opacity-10 border-l-4 border-green-100">Categories</a>
          <a href="/admin/settings" className="block px-4 py-2 rounded hover:bg-white hover:bg-opacity-5">Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-48 p-8">
        {/* Header */}
        <div className="bg-green-900 text-white p-6 rounded-lg mb-8">
          <h1 className="text-2xl font-bold">{id ? 'Edit Category' : 'Create New Category'}</h1>
          <p className="text-sm text-green-100 mt-1">Update category details and SEO information</p>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
          <form className="space-y-6">
            {/* Name & Slug */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="Advanced Finance"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="advanced-finance"
                  required
                />
              </div>
            </div>

            {/* SEO Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">SEO Title *</label>
              <input
                type="text"
                name="seo_title"
                value={formData.seo_title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                placeholder="Free Advanced Finance Spreadsheet Templates"
                maxLength={60}
                required
              />
              <p className="text-xs text-gray-500 mt-1">{formData.seo_title.length}/60</p>
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Meta Description *</label>
              <textarea
                name="meta_description"
                value={formData.meta_description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                placeholder="Free advanced finance spreadsheet templates for budgeting, investing, and financial planning."
                maxLength={160}
                required
              />
              <p className="text-xs text-gray-500 mt-1">{formData.meta_description.length}/160</p>
            </div>

            {/* Placement */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Placement *</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="placement"
                    value="sidebar"
                    checked={formData.placement === 'sidebar'}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-700"
                  />
                  <span className="text-sm text-gray-700">Sidebar Only</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="placement"
                    value="top"
                    checked={formData.placement === 'top'}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-700"
                  />
                  <span className="text-sm text-gray-700">Top Menu Only</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="placement"
                    value="both"
                    checked={formData.placement === 'both'}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-700"
                  />
                  <span className="text-sm text-gray-700">Both Sidebar & Top Menu</span>
                </label>
              </div>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Sort Order</label>
              <input
                type="number"
                name="sort_order"
                value={formData.sort_order}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                placeholder="1"
                min="1"
              />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first in listings</p>
            </div>

            {/* Buttons */}
            <div className="border-t pt-6 flex gap-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                {saving ? '💾 Saving...' : '💾 Save Category'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/categories')}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg transition"
              >
                ↩️ Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

