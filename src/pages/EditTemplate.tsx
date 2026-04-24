import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from "../supabase";

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const [formData, setFormData] = useState({
    title: '', slug: '', category: '', short_description: '', long_description: '',
    thumbnail: '', img_1: '', img_2: '', img_3: '',
    download_url: '', youtube_url: '', seo_title: '', meta_description: '',
    featured: false, status: 'draft' as 'draft' | 'published',
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    thumbnail: null, img_1: null, img_2: null, img_3: null,
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
      const { data, error } = await supabase.from('templates').select('*').eq('id', id).single();
      if (error) throw error;
      setFormData(data);
    } catch (err) {
      setMessage('❌ Error loading template');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) setFiles(prev => ({ ...prev, [fieldName]: file }));
  };

  const uploadFile = async (file: File, fieldName: string): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `uploads/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('templates').upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('templates').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let updatedData = { ...formData };
      for (const [fieldName, file] of Object.entries(files)) {
        if (file) {
          setUploadProgress(prev => ({ ...prev, [fieldName]: 50 }));
          const url = await uploadFile(file, fieldName);
          updatedData = { ...updatedData, [fieldName]: url };
          setUploadProgress(prev => ({ ...prev, [fieldName]: 100 }));
        }
      }

      const { error } = id && id !== 'new'
        ? await supabase.from('templates').update(updatedData).eq('id', id)
        : await supabase.from('templates').insert([updatedData]);

      if (error) throw error;
      setMessage('✅ Saved successfully!');
      setTimeout(() => navigate('/admin/templates'), 2000);
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase mb-2";

  if (loading) return <div className="p-8 font-sans">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 text-left font-sans">
      {/* Sidebar */}
      <aside className="w-48 bg-[#1a3a1a] text-white p-6 shrink-0">
        <div className="mb-8 font-bold text-2xl uppercase">TS</div>
        <nav className="space-y-2 text-sm">
          <Link to="/admin/templates" className="block px-4 py-2 rounded bg-white/10 border-l-4 border-green-400 no-underline text-white font-bold tracking-tight">Templates</Link>
          <Link to="/admin/categories" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Categories</Link>
          <Link to="/admin/settings" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Settings</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="bg-[#2D5A27] text-white p-6 rounded-lg mb-8 shadow-md">
          <h1 className="text-2xl font-bold uppercase">
            {id && id !== 'new' ? 'Edit Template' : 'Add New Template'}
          </h1>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-8 max-w-4xl space-y-6">

          {/* Row 1: Title + Slug */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className={inputClass}
                placeholder="Template title"
              />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                className={inputClass}
                placeholder="my-template-slug"
              />
            </div>
          </div>

          {/* Row 2: Category + Status */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className={inputClass}
                placeholder="e.g. Finance, HR..."
              />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                className={inputClass}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className={labelClass}>Short Description</label>
            <input
              type="text"
              value={formData.short_description}
              onChange={e => setFormData({ ...formData, short_description: e.target.value })}
              className={inputClass}
              placeholder="Brief summary shown in cards"
            />
          </div>

          {/* Long Description */}
          <div>
            <label className={labelClass}>Long Description</label>
            <textarea
              value={formData.long_description}
              onChange={e => setFormData({ ...formData, long_description: e.target.value })}
              className={inputClass}
              rows={6}
              placeholder="Full description of the template..."
            />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Download URL</label>
              <input
                type="url"
                value={formData.download_url}
                onChange={e => setFormData({ ...formData, download_url: e.target.value })}
                className={inputClass}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className={labelClass}>YouTube URL</label>
              <input
                type="url"
                value={formData.youtube_url}
                onChange={e => setFormData({ ...formData, youtube_url: e.target.value })}
                className={inputClass}
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>

          {/* SEO */}
          <div className="grid grid-cols-2 gap-6">
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
            <div>
              <label className={labelClass}>Meta Description</label>
              <input
                type="text"
                value={formData.meta_description}
                onChange={e => setFormData({ ...formData, meta_description: e.target.value })}
                className={inputClass}
                placeholder="Meta description for search engines"
              />
            </div>
          </div>

          {/* Featured toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={e => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 accent-green-600"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
              Featured template
            </label>
          </div>

          {/* Image uploads */}
          <div className="border-t pt-6">
            <h2 className="text-sm font-bold text-gray-500 uppercase mb-4">Images</h2>
            <div className="grid grid-cols-2 gap-6">
              {(['thumbnail', 'img_1', 'img_2', 'img_3'] as const).map((field) => (
                <div key={field}>
                  <label className={labelClass}>
                    {field === 'thumbnail' ? 'Thumbnail' : `Image ${field.split('_')[1]}`}
                  </label>
                  {/* Current image preview */}
                  {formData[field] && (
                    <img
                      src={formData[field]}
                      alt={field}
                      className="w-full h-32 object-cover rounded mb-2 border"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileChange(e, field)}
                    className="w-full text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {/* URL fallback */}
                  <input
                    type="url"
                    value={formData[field]}
                    onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                    className={`${inputClass} mt-2 text-xs`}
                    placeholder="...or paste image URL"
                  />
                  {uploadProgress[field] !== undefined && uploadProgress[field] < 100 && (
                    <div className="mt-1 text-xs text-green-600">Uploading... {uploadProgress[field]}%</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-[#2D5A27] text-white rounded hover:bg-green-800 disabled:opacity-50 font-semibold"
            >
              {saving ? 'Saving...' : '💾 Save Template'}
            </button>
            <button
              onClick={() => navigate('/admin/templates')}
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-600"
            >
              Cancel
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
