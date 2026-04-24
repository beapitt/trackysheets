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

  const [formData, setFormData] = useState({
    title: '', slug: '', category: '', short_description: '', long_description: '',
    thumbnail: '', img_1: '', img_2: '', img_3: '',
    download_url: '', youtube_url: '', seo_title: '', meta_description: '',
    featured: false, status: 'published' // Default su published così lo vedi subito
  });

  const [files, setFiles] = useState<any>({});

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

  if (loading) return <div className="p-10 font-sans">Loading Form...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans text-left">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-green-900 mb-8 border-b pb-4">CONFIGURAZIONE TEMPLATE</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400">Titolo *</label>
            <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border rounded mt-1" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400">Categoria *</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 border rounded mt-1">
              <option value="">Seleziona...</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-bold uppercase text-gray-400">Descrizione Breve</label>
          <textarea value={formData.short_description} onChange={e => setFormData({...formData, short_description: e.target.value})} className="w-full p-3 border rounded mt-1" rows={2} />
        </div>

        <div className="mb-6">
          <label className="block text-xs font-bold uppercase text-gray-400">Descrizione Lunga (HTML/Text)</label>
          <textarea value={formData.long_description} onChange={e => setFormData({...formData, long_description: e.target.value})} className="w-full p-3 border rounded mt-1" rows={4} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-green-50 rounded">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400">Stato</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2 border rounded">
              <option value="draft">Draft (Bozza)</option>
              <option value="published">Published (Pubblicato)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400">In Evidenza?</label>
            <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="mt-3 w-5 h-5" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {['thumbnail', 'img_1', 'img_2', 'img_3'].map(f => (
            <div key={f} className="border p-2 rounded bg-gray-50">
              <label className="block text-[10px] font-bold uppercase mb-1">{f}</label>
              <input type="file" name={f} onChange={handleFile} className="w-full text-[10px]" />
              {previews[f] && <img src={previews[f]} className="mt-2 w-full h-24 object-cover rounded" />}
            </div>
          ))}
        </div>

        <div className="space-y-4 border-t pt-6">
          <input placeholder="Download URL (Google Sheets Link)" value={formData.download_url} onChange={e => setFormData({...formData, download_url: e.target.value})} className="w-full p-3 border rounded" />
          <input placeholder="YouTube Preview URL" value={formData.youtube_url} onChange={e => setFormData({...formData, youtube_url: e.target.value})} className="w-full p-3 border rounded" />
          <input placeholder="SEO Title" value={formData.seo_title} onChange={e => setFormData({...formData, seo_title: e.target.value})} className="w-full p-3 border rounded" />
          <textarea placeholder="Meta Description SEO" value={formData.meta_description} onChange={e => setFormData({...formData, meta_description: e.target.value})} className="w-full p-3 border rounded" />
        </div>

        <div className="mt-8 flex gap-4">
          <button onClick={handleSave} disabled={saving} className="flex-1 bg-green-700 text-white p-4 rounded-xl font-bold uppercase hover:bg-green-800 transition">
            {saving ? 'Salvataggio in corso...' : 'SALVA TUTTO'}
          </button>
          <Link to="/admin/templates" className="p-4 text-gray-400 font-bold no-underline">ANNULLA</Link>
        </div>
      </div>
    </div>
  );
}
