import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Template {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string;
  long_description: string;
  thumbnail: string;
  img_1: string;
  img_2: string;
  img_3: string;
  download_url: string;
  youtube_url: string;
  seo_title: string;
  meta_description: string;
  featured: boolean;
  status: 'draft' | 'published';
}

export default function EditTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    short_description: '',
    long_description: '',
    thumbnail: '',
    img_1: '',
    img_2: '',
    img_3: '',
    download_url: '',
    youtube_url: '',
    seo_title: '',
    meta_description: '',
    featured: false,
    status: 'draft' as 'draft' | 'published',
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    thumbnail: null,
    img_1: null,
    img_2: null,
    img_3: null,
  });

  useEffect(() => {
    if (id && id !== 'new') {
      fetchTemplate();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchTemplate = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setTemplate(data);
        setFormData(data);
      }
    } catch (err) {
      setMessage('Error loading template');
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
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === 'title') {
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: generateSlug(value),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [name]: file }));
    }
  };

  const uploadFile = async (file: File, fieldName: string) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from('templates')
      .upload(`${fieldName}/${fileName}`, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('templates')
      .getPublicUrl(`${fieldName}/${fileName}`);

    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug || !formData.category) {
      setMessage('Please fill in all required fields');
      setMessageType('error');
      return;
    }

    setSaving(true);
    try {
      const updateData = { ...formData };

      for (const [fieldName, file] of Object.entries(files)) {
        if (file) {
          updateData[fieldName] = await uploadFile(file, fieldName);
        }
      }

      if (id && id !== 'new') {
        const { error } = await supabase
          .from('templates')
          .update(updateData)
          .eq('id', id);

        if (error) throw error;
        setMessage('Template updated successfully');
      } else {
        const { error } = await supabase
          .from('templates')
          .insert([updateData]);

        if (error) throw error;
        setMessage('Template created successfully');
      }

      setMessageType('success');
      setTimeout(() => navigate('/admin/templates'), 2000);
    } catch (err) {
      setMessage('Error saving template');
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
          <a href="/admin/templates" className="block px-4 py-2 rounded bg-white bg-opacity-10 border-l-4 border-green-100">Templates</a>
          <a href="/admin/categories" className="block px-4 py-2 rounded hover:bg-white hover:bg-opacity-5">Categories</a>
          <a href="/admin/settings" className="block px-4 py-2 rounded hover:bg-white hover:bg-opacity-5">Settings</a>
          <a href="/admin/dashboard" className="block px-4 py-2 rounded hover:bg-white hover:bg-opacity-5">Dashboard</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-green-900 mb-6">{id && id !== 'new' ? 'Edit Template' : 'New Template'}</h1>

          {message && (
            <div className={`p-4 rounded mb-6 ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {messageType === 'success' ? '✅' : '❌'} {message}
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-8">
            <form className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Template title"
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

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                >
                  <option value="">Select a category</option>
                  <option value="Finance">Finance</option>
                  <option value="Business">Business</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Short Description</label>
                <textarea
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  placeholder="Brief description"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              {/* Long Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Long Description</label>
                <textarea
                  name="long_description"
                  value={formData.long_description}
                  onChange={handleInputChange}
                  placeholder="Detailed description"
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Thumbnail Image</label>
                <input
                  type="file"
                  name="thumbnail"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {formData.thumbnail && <p className="text-sm text-gray-600 mt-2">Current: {formData.thumbnail}</p>}
              </div>

              {/* Carousel Images */}
              <div className="grid grid-cols-3 gap-4">
                {['img_1', 'img_2', 'img_3'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Image {field.split('_')[1]}</label>
                    <input
                      type="file"
                      name={field}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    {formData[field] && <p className="text-sm text-gray-600 mt-2">Current: {formData[field]}</p>}
                  </div>
                ))}
              </div>

              {/* Download URL */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Download URL</label>
                <input
                  type="url"
                  name="download_url"
                  value={formData.download_url}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              {/* YouTube URL */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">YouTube URL</label>
                <input
                  type="url"
                  name="youtube_url"
                  value={formData.youtube_url}
                  onChange={handleInputChange}
                  placeholder="https://www.youtube.com/watch?v=..."
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

              {/* Featured */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-green-700 rounded focus:ring-2 focus:ring-green-700"
                />
                <label className="ml-2 text-sm font-bold text-gray-700">Featured</label>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                  {saving ? '💾 Saving...' : '💾 Save Template'}
                </button>
                <button
                  type="button"
                  onClick={( ) => navigate('/admin/templates')}
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
