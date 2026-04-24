import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Category {
  id: string;
  name: string;
  slug: string;
  seo_title: string;
  meta_description: string;
  placement: string;
  sort_order: number;
}

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    seo_title: '',
    meta_description: '',
    placement: 'sidebar',
    sort_order: 0,
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
      setMessage('Error loading category');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'sort_order' ? parseInt(value) : value,
      }));
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      setMessage('Please fill in all required fields');
      setMessageType('error');
      return;
    }

    setSaving(true);
    try {
      if (id && id !== 'new') {
        const { error } = await supabase
          .from('categories')
          .update(formData)
          .eq('id', id);

        if (error) throw error;
        setMessage('Category updated successfully');
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([formData]);

        if (error) throw error;
        setMessage('Category created successfully');
      }

      setMessageType('success');
      setTimeout(() => navigate('/admin/categories'), 2000);
    } catch (err) {
      setMessage('Error saving category');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-48 bg-green-900 text-white p-6">
        <div className="mb-8">
          <div className="text-2xl font-bold mb-2">TS</div>
          <div className="text-sm">TrackySheets Admin</div>
        </div>
        <nav className="space-y-2">
          <a href="/admin/templates" className="block px-4 py-2 rounded hover:bg-white hover:bg-opacity-5">Templates</a>
          <a href="/admin/categories" className="block px-4 py-2 rounded bg-white bg-opacity-10 border-l-4 border-green-100">Categories</a>
          <a href="/admin/settings" className="block px-4 py-2 rounded hover:bg-white hover:bg-opacity-5">Settings</a>
          <a href="/admin/dashboard" className="block px-4 py-2 rounded hover:bg-white hover:bg-opacity-5">Dashboard</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-green-900 mb-6">{id && id !== 'new' ? 'Edit Category' : 'New Category'}</h1>

          {message && (
            <div className={`p-4 rounded mb-6 ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {messageType === 'success' ? '✅' : '❌'} {message}
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-8">
            <form className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Category name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="auto-generated"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              {/* SEO Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">SEO Title</label>
                <input
                  type="text"
                  name="seo_title"
                  value={formData.seo_title}
                  onChange={handleInputChange}
                  placeholder="SEO title"
                  maxLength={60}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.seo_title.length}/60</p>
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Meta Description</label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  placeholder="Meta description"
                  rows={2}
                  maxLength={160}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.meta_description.length}/160</p>
              </div>

              {/* Placement */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Placement</label>
                <select
                  name="placement"
                  value={formData.placement}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                >
                  <option value="sidebar">Sidebar</option>
                  <option value="top">Top Navigation</option>
                  <option value="both">Both</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Sort Order</label>
                <input
                  type="number"
                  name="sort_order"
                  value={formData.sort_order}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6 border-t">
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
        </div>
      </main>
    </div>
  );
}


