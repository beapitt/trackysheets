import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

interface Category {
  id: string;
  name: string;
}

export default function EditTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
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
    thumbnail: null, img_1: null, img_2: null, img_3: null,
  });

  const [previews, setPreviews] = useState<{ [key: string]: string }>({
    thumbnail: '', img_1: '', img_2: '', img_3: '',
  });

  useEffect(() => {
    const init = async () => {
      await fetchCategories();
      if (id && id !== 'new') await fetchTemplate();
      setLoading(false);
    };
    init();
  }, [id]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name').order('name');
    if (data) setCategories(data);
  };

  const fetchTemplate = async () => {
    const { data, error } = await supabase.from('templates').select('*').eq('id', id).single();
    if (data) {
      setFormData(data);
      setPreviews({
        thumbnail: data.thumbnail || '',
        img_1: data.img_1 || '',
        img_2: data.img_2 || '',
        img_3: data.img_3 || '',
      });
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: val }));

    if (name === 'title') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [name]: file }));
      setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
    }
  };

  const uploadFile = async (file: File, fieldName: string) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('templates').upload(`${fieldName}/${fileName}`, file);
    if (error) throw error;
    const { data } = supabase.storage.from('templates').getPublicUrl(`${fieldName}/${fileName}`);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!formData.title || !formData.category) {
      setMessage('Title and Category are required');
      setMessageType('error');
      return;
    }
    setSaving(true);
    try {
      const finalData = { ...formData };
      for (const [key, file] of Object.entries(files)) {
        if (file) finalData[key] = await uploadFile(file, key);
      }

      const { error } = (id && id !== 'new')
        ? await supabase.from('templates').update(finalData).eq('id', id)
        : await supabase.from('templates').insert([finalData]);

      if (error) throw error;
      setMessage('Success!');
      setMessageType('success');
      setTimeout(() => navigate('/admin/templates'), 1500);
    } catch (err: any) {
      setMessage(err.message);
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 text-left font-sans">
      <aside className="w-48 bg-green-900 text-white p-6 shrink-0">
        <div className="text-2xl font-bold mb-8 text-white">TS</div>
        <nav className="space-y-3 uppercase text-xs font-bold">
          <Link to="/admin/templates" className="block text-white no-underline opacity-100 border-l-4 border-green-300 pl-2">Templates</Link>
          <Link to="/admin/categories" className="block text-white no-underline opacity-60 hover:opacity-100">Categories</Link>
          <Link to="/admin/settings" className="block text-white no-underline opacity-60 hover:opacity-100">Settings</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-green-900 mb-6 uppercase">Template Details</h1>
          
          {message && <div className={`p-4 mb-6 rounded ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message}</div>}

          <div className="bg-white p-8 rounded shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Title *</label>
                <input name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2 border rounded outline-none focus:ring-1 focus:ring-green-700" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Category *</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2 border rounded outline-none">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Short Description</label>
              <textarea name="short_description" value={formData.short_description} onChange={handleInputChange} rows={2} className="w-full p-2 border rounded outline-none" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {['thumbnail', 'img_1', 'img_2', 'img_3'].map(f => (
                <div key={f}>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">{f}</label>
                  <input type="file" name={f} onChange={handleFileChange} className="text-[10px] w-full" />
                  {previews[f] && <img src={previews[f]} className="mt-2 w-full h-20 object-cover rounded border" />}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button onClick={handleSave} disabled={saving} className="bg-green-700 text-white px-8 py-2 rounded font-bold uppercase text-xs shadow-md">
                {saving ? 'Saving...' : 'Save Template'}
              </button>
              <Link to="/admin/templates" className="bg-gray-200 text-gray-600 px-8 py-2 rounded font-bold uppercase text-xs no-underline">Cancel</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
