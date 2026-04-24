import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/supabase';

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
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

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
    if (id) {
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
      setTemplate(data);
      setFormData(data);
      setLoading(false);
    } catch (err) {
      setMessage('❌ Error loading template');
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [fieldName]: file }));
    }
  };

  const uploadFile = async (file: File, fieldName: string): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${id}/${fieldName}/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('templates')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('templates')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      throw new Error(`Failed to upload ${fieldName}`);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let updatedData = { ...formData };

      // Upload files if selected
      for (const [fieldName, file] of Object.entries(files)) {
        if (file) {
          setUploadProgress(prev => ({ ...prev, [fieldName]: 50 }));
          const url = await uploadFile(file, fieldName);
          updatedData = { ...updatedData, [fieldName]: url };
          setUploadProgress(prev => ({ ...prev, [fieldName]: 100 }));
        }
      }

      // Auto-generate slug from title if changed
      if (updatedData.title !== template?.title) {
        updatedData.slug = updatedData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      }

      if (id) {
        // Update existing template
        const { error } = await supabase
          .from('templates')
          .update(updatedData)
          .eq('id', id);

        if (error) throw error;
      } else {
        // Create new template
        const { error } = await supabase
          .from('templates')
          .insert([updatedData]);

        if (error) throw error;
      }

      setMessage('✅ Template saved successfully!');
      setTimeout(() => navigate('/admin/templates'), 2000);
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setSaving(false);
      setUploadProgress({});
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (loading) return <div className="p-8 text-center">Loading template...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-48 bg-green-900 text-white p-6 fixed h-screen overflow-y-auto">
        <div className="mb-8">
          <div className="text-2xl font-bold mb-2">TS</div>
          <div className="text-sm">TrackySheets Admin</div>
        </div>
        <nav className="space-y-2">
          <a href="/admin/templates" className="block px-4 py-2 rounded bg-white bg-opacity-10 border-l-4 border-green-100">Templates</a>
          <a href="/admin/categories" className="block px-4 py-2 rounded hover:bg-white hover:bg-opacity-5">Categories</a>
          <a href="/admin/settings" className="block px-4 py-2 rounded hover:bg-white hover:bg-opacity-5">Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-48 p-8">
        {/* Header */}
        <div className="bg-green-900 text-white p-6 rounded-lg mb-8">
          <h1 className="text-2xl font-bold">{id ? 'Edit Template' : 'Create New Template'}</h1>
          <p className="text-sm text-green-100 mt-1">Update template details and images</p>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-8 max-w-4xl">
          <form className="space-y-6">
            {/* Title & Slug */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="Invoice Tracker"
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
                  placeholder="invoice-tracker"
                  required
                />
              </div>
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Advanced Finance">Advanced Finance</option>
                  <option value="Invoices & Billing">Invoices & Billing</option>
                  <option value="Project Trackers">Project Trackers</option>
                  <option value="Business & Inventory">Business & Inventory</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Short Description *</label>
              <textarea
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                placeholder="Brief description for listings"
                required
              />
              <p className="text-xs text-gray-500 mt-1">{formData.short_description.length}/200</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Long Description *</label>
              <textarea
                name="long_description"
                value={formData.long_description}
                onChange={handleChange}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 font-mono text-sm"
                placeholder="Detailed description with HTML support"
                required
              />
              <p className="text-xs text-gray-500 mt-1">HTML supported: &lt;b&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;i&gt;, &lt;br&gt;, &lt;a&gt;</p>
            </div>

            {/* Image Uploads */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Images</h3>

              {/* Thumbnail */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Thumbnail Image *</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'thumbnail')}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  {uploadProgress.thumbnail && (
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-700 h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress.thumbnail}%` }}
                      />
                    </div>
                  )}
                </div>
                {formData.thumbnail && (
                  <img src={formData.thumbnail} alt="Thumbnail" className="mt-2 w-32 h-20 object-cover rounded" />
                )}
              </div>

              {/* Carousel Images */}
              {['img_1', 'img_2', 'img_3'].map((imgField) => (
                <div key={imgField} className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Carousel Image {imgField.split('_')[1]}</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, imgField)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    {uploadProgress[imgField] && (
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-700 h-2 rounded-full transition-all"
                          style={{ width: `${uploadProgress[imgField]}%` }}
                        />
                      </div>
                    )}
                  </div>
                  {formData[imgField as keyof typeof formData] && (
                    <img src={formData[imgField as keyof typeof formData] as string} alt={`Carousel ${imgField}`} className="mt-2 w-32 h-20 object-cover rounded" />
                  )}
                </div>
              ))}
            </div>

            {/* URLs & SEO */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">URLs & SEO</h3>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Download URL *</label>
                  <input
                    type="url"
                    name="download_url"
                    value={formData.download_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                    placeholder="https://docs.google.com/spreadsheets/..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">YouTube URL</label>
                  <input
                    type="url"
                    name="youtube_url"
                    value={formData.youtube_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">SEO Title *</label>
                <input
                  type="text"
                  name="seo_title"
                  value={formData.seo_title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="Free Invoice Tracker Spreadsheet"
                  maxLength={60}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{formData.seo_title.length}/60</p>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Meta Description *</label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="Brief description for search engines"
                  maxLength={160}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{formData.meta_description.length}/160</p>
              </div>
            </div>

            {/* Featured Toggle */}
            <div className="border-t pt-6">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-5 h-5 text-green-700 rounded"
                />
                <span className="text-sm font-bold text-gray-700">Featured on Homepage</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="border-t pt-6 flex gap-4">
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
      </main>
    </div>
  );
}

