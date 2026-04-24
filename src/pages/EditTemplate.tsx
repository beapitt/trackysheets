import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function EditTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previews, setPreviews] = useState<any>({});
  const [files, setFiles] = useState<any>({});

  const [formData, setFormData] = useState({
    title: '', slug: '', category: '', short_description: '', long_description: '',
    thumbnail: '', img_1: '', img_2: '', img_3: '',
    download_url: '', youtube_url: '', seo_title: '', meta_description: '',
    featured: false, status: 'published'
  });

  useEffect(() => {
    const init = async () => {
      const { data: cats } = await supabase.from('categories').select('*');
      if (cats) setCategories(cats);
      if (id && id !== 'new') {
        const { data } = await supabase.from('templates').select('*').eq('id', id).single();
        if (data) {
          setFormData(data);
          setPreviews({thumbnail: data.thumbnail, img_1: data.img_1, img_2: data.img_2, img_3: data.img_3});
        }
      }
      setLoading(false);
    };
    init();
  }, [id]);

  const handleFile = (e: any) => {
    const file = e.target.files[0];
    const name = e.target.name;
    if (file) {
      setFiles({...files, [name]: file});
      setPreviews({...previews, [name]: URL.createObjectURL(file)});
    }
  };

  const upload = async (file: File, path: string) => {
    const name = `${Date.now()}-${file.name}`;
    await supabase.storage.from('templates').upload(`${path}/${name}`, file);
    const { data } = supabase.storage.from('templates').getPublicUrl(`${path}/${name}`);
    return data.publicUrl;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let finalData = { ...formData };
      for (const [key, file] of Object.entries(files)) {
        if (file) finalData[key] = await upload(file as File, key);
      }
      const { error } = (id && id !== 'new') 
        ? await supabase.from('templates').update(finalData).eq('id', id)
        : await supabase.from('templates').insert([finalData]);
      if (error) throw error;
      navigate('/admin/templates');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 font-sans">Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans text-left text-gray-800">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-green-900 mb-8 border-b pb-4 uppercase">Edit Template</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Title *</label>
            <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border rounded mt-1 outline-none" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Category *</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 border rounded mt-1">
              <option value="">Select...</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-xs font-bold uppercase text-gray-400">Short Description</label>
          <textarea value={formData.short_description} onChange={e => setFormData({...formData, short_description: e.target.value})} className="w-full p-3 border rounded mt-1" rows={2} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {['thumbnail', 'img_1', 'img_2', 'img_3'].map(f => (
            <div key={f} className="border p-2 rounded bg-gray-50 text-center">
              <label className="block text-[10px] font-bold uppercase mb-1">{f}</label>
              <input type="file" name={f} onChange={handleFile} className="w-full text-[10px]" />
              {previews[f] && <img src={previews[f]} className="mt-2 w-full h-20 object-cover rounded" alt="preview" />}
            </div>
          ))}
        </div>

        <div className="space-y-4 border-t pt-6">
          <label className="block text-xs font-bold uppercase text-gray-300">Links & SEO</label>
          <input placeholder="Download URL" value={formData.download_url} onChange={e => setFormData({...formData, download_url: e.target.value})} className="w-full p-3 border rounded" />
          <input placeholder="SEO Title" value={formData.seo_title} onChange={e => setFormData({...formData, seo_title: e.target.value})} className="w-full p-3 border rounded" />
          <textarea placeholder="Meta Description" value={formData.meta_description} onChange={e => setFormData({...formData, meta_description: e.target.value})} className="w-full p-3 border rounded" />
          
          <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-3 border rounded">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="mt-8 flex gap-4">
          <button onClick={handleSave} disabled={saving} className="flex-1 bg-green-800 text-white p-4 rounded font-bold uppercase hover:bg-green-900 transition">
            {saving ? 'Saving...' : 'Save Template'}
          </button>
          <Link to="/admin/templates" className="p-4 text-gray-400 font-bold no-underline uppercase text-sm">Cancel</Link>
        </div>
      </div>
    </div>
  );
}
