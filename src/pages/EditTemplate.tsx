import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from "../supabase"; // Collegamento al tuo file reale

export default function EditTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '', slug: '', category_id: '', short_description: '', long_description: '',
    thumbnail: '', img_1: '', img_2: '', img_3: '',
    download_url: '', youtube_url: '', seo_title: '', meta_description: '',
    featured: false, status: 'draft'
  });

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
    if (id && id !== 'new') {
      fetchTemplate();
    } else {
      setLoading(false);
    }
  }, [id]);

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  }

  async function fetchTemplate() {
    const { data, error } = await supabase.from('templates').select('*').eq('id', id).single();
    if (data) setFormData(data);
    setLoading(false);
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadingField(fieldName);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('templates')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('templates').getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, [fieldName]: data.publicUrl }));
      setMessage(`✅ ${fieldName} uploaded!`);
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const { error } = id && id !== 'new'
      ? await supabase.from('templates').update(formData).eq('id', id)
      : await supabase.from('templates').insert([formData]);

    if (error) {
      setMessage('❌ Error: ' + error.message);
    } else {
      setMessage('✅ Saved successfully!');
      setTimeout(() => navigate('/admin/templates'), 1500);
    }
    setSaving(false);
  };

  if (loading) return <div className="p-10 font-sans">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 text-left font-sans">
      <aside className="w-48 bg-[#1a3a1a] text-white p-6 shrink-0">
        <div className="mb-8 font-bold text-2xl uppercase">TS</div>
        <nav className="space-y-2 text-sm">
          <Link to="/admin/templates" className="block px-4 py-2 rounded bg-white/10 border-l-4 border-green-400 no-underline text-white font-bold">Templates</Link>
          <Link to="/admin/categories" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Categories</Link>
          <Link to="/admin/settings" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Settings</Link>
          <Link to="/admin" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white border-t border-white/10 mt-4 pt-4">Dashboard</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="bg-[#2D5A27] text-white p-6 rounded-lg mb-8 shadow-md">
          <h1 className="text-2xl font-bold uppercase">{id && id !== 'new' ? 'Edit Template' : 'Add New Template'}</h1>
        </div>

        {message && <div className="mb-6 p-4 bg-white border-l-4 border-green-500 shadow-sm font-bold">{message}</div>}

        <form onSubmit={handleSave} className="bg-white p-8 rounded-lg shadow-sm space-y-8 max-w-4xl">
          <section className="space-y-4">
            <h3 className="font-bold text-gray-400 uppercase text-xs border-b pb-1">Media (Upload)</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Main Thumbnail</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'thumbnail')} className="text-xs w-full" />
                {uploadingField === 'thumbnail' && <p className="text-blue-600 text-[10px]">Uploading...</p>}
                {formData.thumbnail && <img src={formData.thumbnail} className="mt-2 h-20 w-32 object-cover rounded border" />}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(n => (
                  <div key={n}>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Img {n}</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, `img_${n}`)} className="text-[8px] w-full" />
                    {formData[`img_${n}` as keyof typeof formData] && <img src={formData[`img_${n}` as keyof typeof formData] as string} className="mt-1 h-10 w-full object-cover rounded border" />}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Slug</label>
                <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Category</label>
                <select required value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full p-2 border rounded">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Download URL</label>
                <input required type="url" value={formData.download_url} onChange={e => setFormData({...formData, download_url: e.target.value})} className="w-full p-2 border rounded" />
              </div>
          </section>

          <div className="pt-6 border-t">
            <button disabled={saving} type="submit" className="bg-[#2D5A27] text-white px-10 py-3 rounded font-bold uppercase text-sm">
              {saving ? 'Saving...' : '💾 Save Template'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
