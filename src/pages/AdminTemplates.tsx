import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// Import corretto per la struttura delle cartelle di Vercel
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
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
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
      <aside className="w-48 bg-[#1a3a1a] text-white p-6 shrink-0 font-sans">
        <div className="mb-8 font-bold text-2xl uppercase">TS</div>
        <nav className="space-y-2 text-sm">
          <Link to="/admin/templates" className="block px-4 py-2 rounded bg-white/10 border-l-4 border-green-400 no-underline text-white font-bold tracking-tight">Templates</Link>
          <Link to="/admin/categories" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Categories</Link>
          <Link to="/admin/settings" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Settings</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto text-left">
        <div className="bg-[#2D5A27] text-white p-6 rounded-lg mb-8 shadow-md">
          <h1 className="text-2xl font-bold uppercase">
            {id && id !== 'new' ? 'Edit Template' : 'Add New Template'}
          </h1>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded font-bold ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-8 max-w-4xl space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Title *</label>
              <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className={inputClass} placeholder="Template title" />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className={inputClass} placeholder="my-template-slug" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Category</label>
              <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className={inputClass} placeholder="e.g. Finance..." />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })} className={inputClass}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Long Description</label>
            <textarea value={formData.long_description} onChange={e => setFormData({ ...formData, long_description: e.target.value })} className={inputClass} rows={6} placeholder="Full description..." />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Download URL</label>
              <input type="url" value={formData.download_url} onChange={e => setFormData({ ...formData, download_url: e.target.value })} className={inputClass} placeholder="https://..." />
            </div>
            <div>
              <label className={labelClass}>YouTube URL</label>
              <input type="url" value={formData.youtube_url} onChange={e => setFormData({ ...formData, youtube_url: e.target.value })} className={inputClass} placeholder="https://youtube.com/..." />
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-sm font-bold text-gray-500 uppercase mb-4">Images</h2>
            <div className="grid grid-cols-2 gap-6">
              {(['thumbnail', 'img_1', 'img_2', 'img_3'] as const).map((field) => (
                <div key={field}>
                  <label className={labelClass}>{field.toUpperCase()}</label>
                  {formData[field] && <img src={formData[field]} alt={field} className="w-full h-32 object-cover rounded mb-2 border" />}
                  <input type="file" accept="image/*" onChange={e => handleFileChange(e, field)} className="w-full text-xs" />
                  {uploadProgress[field] < 100 && uploadProgress[field] > 0 && <div className="text-xs text-green-600">Uploading...</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#2D5A27] text-white rounded hover:bg-green-800 disabled:opacity-50 font-bold uppercase text-xs shadow-md">
              {saving ? 'Saving...' : '💾 Save Template'}
            </button>
            <Link to="/admin/templates" className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 no-underline font-bold uppercase text-xs">
              Cancel
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
