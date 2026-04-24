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

  if (loading) return <div className="p-8 font-sans">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 text-left font-sans">
      <aside className="w-48 bg-[#1a3a1a] text-white p-6 shrink-0">
        <div className="mb-8 font-bold text-2xl uppercase">TS</div>
        <nav className="space-y-2 text-sm">
          <Link to="/admin/templates" className="block px-4 py-2 rounded bg-white/10 border-l-4 border-green-400 no-underline text-white font-bold tracking-tight">Templates</Link>
          <Link to="/admin/categories" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Categories</Link>
          <Link to="/admin/settings" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Settings</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="bg-[#2D5A27] text-white p-6 rounded-lg mb-8 shadow-md">
          <h1 className="text-2xl font-bold uppercase">{id && id !== 'new' ? 'Edit Template' : 'Add New Template'}</h1>
        </div>

        {message && <div className={`mb-6 p-4 rounded ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message}</div>}

        <div className="bg-white rounded-lg shadow p-8 max-w-4xl space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Title *</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-5
