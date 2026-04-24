import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function EditTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '', slug: '', category: '', short_description: '', long_description: '',
    thumbnail: '', img_1: '', img_2: '', img_3: '',
    download_url: '', youtube_url: '', seo_title: '', meta_description: '',
    featured: false, status: 'draft'
  });

  useEffect(() => {
    const load = async () => {
      const { data: cats } = await supabase.from('categories').select('*');
      if (cats) setCategories(cats);
      if (id && id !== 'new') {
        const { data } = await supabase.from('templates').select('*').eq('id', id).single();
        if (data) setFormData(data);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = (id && id !== 'new') 
      ? await supabase.from('templates').update(formData).eq('id', id)
      : await supabase.from('templates').insert([formData]);
    
    if (error) alert(error.message);
    else navigate('/admin/templates');
    setSaving(false);
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen text-left font-sans">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">EDIT TEMPLATE</h1>
        
        <div className="grid gap-4">
          <input placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="border p-2 w-full" />
          
          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="border p-2 w-full">
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>

          <textarea placeholder="Short Description" value={formData.short_description} onChange={e => setFormData({...formData, short_description: e.target.value})} className="border p-2 w-full" />
          <textarea placeholder="Long Description" value={formData.long_description} onChange={e => setFormData({...formData, long_description: e.target.value})} className="border p-2 w-full" rows={5} />
          
          <input placeholder="Thumbnail URL" value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})} className="border p-2 w-full" />
          <input placeholder="Download URL" value={formData.download_url} onChange={e => setFormData({...formData, download_url: e.target.value})} className="border p-2 w-full" />
          
          <div className="bg-gray-50 p-4 border rounded">
            <p className="font-bold mb-2">SEO SECTION</p>
            <input placeholder="SEO Title" value={formData.seo_title} onChange={e => setFormData({...formData, seo_title: e.target.value})} className="border p-2 w-full mb-2" />
            <textarea placeholder="Meta Description" value={formData.meta_description} onChange={e => setFormData({...formData, meta_description: e.target.value})} className="border p-2 w-full" />
          </div>

          <button onClick={handleSave} disabled={saving} className="bg-green-700 text-white p-3 rounded font-bold">
            {saving ? 'SAVING...' : 'SAVE EVERYTHING'}
          </button>
          <Link to="/admin/templates" className="text-center text-gray-500">Cancel</Link>
        </div>
      </div>
    </div>
  );
}
