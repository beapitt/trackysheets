import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Category {
  id: string;
  name: string;
  slug: string;
  seo_title: string;
  description: string; // Corretto: corrisponde a Supabase
  image_url: string;   // Aggiunto: corrisponde a Supabase
  placement: string;
  sort_order: number;
}

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    seo_title: '',
    description: '', // Corretto
    image_url: '',   // Corretto
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
        // Mappiamo i dati dal DB allo stato del form
        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          seo_title: data.seo_title || '',
          description: data.description || '',
          image_url: data.image_url || '',
          placement: data.placement || 'sidebar',
          sort_order: data.sort_order || 0,
        });
      }
    } catch (err) {
      console.error(err);
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
        [name]: name === 'sort_order' ? parseInt(value) || 0 : value,
      }));
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      setMessage('Please fill in all required fields (Name and Slug)');
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
      console.error(err);
      setMessage('Error saving category. Check if all columns match.');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 font-inter">
      {/* Sidebar Admin */}
      <aside className="w-48 bg-[#1F5C3E] text-white p-6 shrink-0">
        <div className="mb-8">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-[#1F5C3E] mb-2">TS</div>
          <div className="text-xs font-bold uppercase tracking-widest opacity-70">Admin Panel</div>
        </div>
        <nav className="space-y-4">
          <a href="/admin/templates" className="block text-[13px] font-bold no-underline text-white/70 hover:text-white">Templates</a>
          <a href="/admin/categories" className="block text-[13px] font-bold no-underline text-white border-l-2 border-white pl-2">Categories</a>
          <a href="/admin/settings" className="block text-[13px] font-bold no-underline text-white/70 hover:text-white">Settings</a>
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-black text-gray-800 mb-8 uppercase tracking-tight">
            {id && id !== 'new' ? 'Edit Category' : 'Create New Category'}
          </h1>

          {message && (
            <div className={`p-4 rounded-xl mb-6 font-bold shadow-sm ${messageType === 'success' ? 'bg-green-100 text-[#1F5C3E]' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Category Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 font-medium outline-none focus:ring-2 focus:ring-[#1F5C3E]/20" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Slug *</label>
                  <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 font-medium outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">SEO Title</label>
                <input type="text" name="seo_title" value={formData.seo_title} onChange={handleInputChange} maxLength={60} className="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 font-medium outline-none" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description (Meta Description)</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} maxLength={160} className="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 font-medium outline-none" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Category Image URL</label>
                <input type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="https://..." className="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 font-medium outline-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Placement</label>
                  <select name="placement" value={formData.placement} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 font-medium outline-none">
                    <option value="sidebar">Sidebar</option>
                    <option value="top">Top Navigation</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Sort Order</label>
                  <input type="number" name="sort_order" value={formData.sort_order} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 font-medium outline-none" />
                </div>
              </div>

              <div className="flex gap-4 pt-8 border-t border-gray-50">
                <button type="button" onClick={handleSave} disabled={saving} className="bg-[#1F5C3E] hover:bg-black text-white font-bold py-4 px-8 rounded-xl transition shadow-lg shadow-[#1F5C3E]/20 disabled:bg-gray-300">
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
                <button type="button" onClick={() => navigate('/admin/categories')} className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-4 px-8 rounded-xl transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
