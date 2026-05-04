import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, X } from 'lucide-react';

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

  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data: cats } = await supabase.from('categories').select('*');
      if (cats) setCategories(cats);
      if (id && id !== 'new') {
        const { data } = await supabase.from('templates').select('*').eq('id', id).single();
        if (data) {
          setFormData(data);
          setPreviews({
            thumbnail: data.thumbnail, 
            img_1: data.img_1, 
            img_2: data.img_2, 
            img_3: data.img_3
          });
          setFaqs(Array.isArray(data.faqs) ? data.faqs : []);
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
      setFiles({ ...files, [name]: file });
      setPreviews({ ...previews, [name]: URL.createObjectURL(file) });
    }
  };

  const removeImage = (field: string) => {
    setPreviews({ ...previews, [field]: null });
    setFormData({ ...formData, [field]: '' });
    const newFiles = { ...files };
    delete newFiles[field];
    setFiles(newFiles);
  };

  const upload = async (file: File, path: string) => {
    const name = `${Date.now()}-${file.name}`;
    await supabase.storage.from('templates').upload(`${path}/${name}`, file);
    const { data } = supabase.storage.from('templates').getPublicUrl(`${path}/${name}`);
    return data.publicUrl;
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { q: '', a: '' }]);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index: number, field: 'q' | 'a', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let finalData = { 
        ...formData,
        faqs: faqs 
      };
      
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

  if (loading) return <div className="p-10 font-sans text-center">Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans text-left text-gray-800">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-green-900 mb-8 border-b pb-4 uppercase">Edit Template</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Title *</label>
            <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border rounded mt-1 outline-none focus:border-green-800" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Category *</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 border rounded mt-1 outline-none">
              <option value="">Select...</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* --- DESCRIZIONI --- */}
        <div className="space-y-6 mb-6">
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Short Description</label>
            <textarea 
              value={formData.short_description} 
              onChange={e => setFormData({...formData, short_description: e.target.value})} 
              className="w-full p-3 border rounded mt-1 outline-none focus:border-green-800" 
              rows={2} 
              placeholder="A short tagline for the top of the page..."
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Long Description (Product Details)</label>
            <textarea 
              value={formData.long_description} 
              onChange={e => setFormData({...formData, long_description: e.target.value})} 
              className="w-full p-3 border rounded mt-1 outline-none focus:border-green-800" 
              rows={6} 
              placeholder="Detailed explanation of features, how to use, and benefits..."
            />
          </div>
        </div>

        {/* --- IMMAGINI --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {['thumbnail', 'img_1', 'img_2', 'img_3'].map(f => (
            <div key={f} className="border p-2 rounded bg-gray-50 text-center relative">
              {previews[f] && (
                <button
                  type="button"
                  onClick={() => removeImage(f)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-lg hover:bg-red-700 z-10 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
              <label className="block text-[10px] font-bold uppercase mb-1">{f.replace('_', ' ')}</label>
              <input type="file" name={f} onChange={handleFile} className="w-full text-[10px] mb-2" />
              {previews[f] ? (
                <img src={previews[f]} className="w-full h-24 object-cover rounded shadow-sm border border-gray-200" alt="preview" />
              ) : (
                <div className="w-full h-24 border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-300 text-[10px] bg-white italic">
                  No image
                </div>
              )}
            </div>
          ))}
        </div>

        {/* --- FAQ --- */}
        <div className="border-t pt-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-xs font-bold uppercase text-gray-400">Template Specific FAQs</label>
            <button 
              type="button" 
              onClick={handleAddFaq}
              className="bg-green-100 text-green-800 px-3 py-1 rounded text-[10px] font-bold uppercase hover:bg-green-800 hover:text-white transition"
            >
              + Add FAQ
            </button>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative text-left">
                <button 
                  type="button" 
                  onClick={() => handleRemoveFaq(index)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition"
                >
                  <Trash2 size={16} />
                </button>
                <div className="space-y-2 pr-8 text-left">
                  <input 
                    placeholder="Question..." 
                    value={faq.q} 
                    onChange={e => handleFaqChange(index, 'q', e.target.value)}
                    className="w-full p-2 text-sm font-bold border rounded bg-white outline-none focus:border-green-800"
                  />
                  <textarea 
                    placeholder="Answer..." 
                    value={faq.a} 
                    onChange={e => handleFaqChange(index, 'a', e.target.value)}
                    className="w-full p-2 text-sm border rounded bg-white outline-none focus:border-green-800"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- LINKS & SEO --- */}
        <div className="space-y-4 border-t pt-6">
          <label className="block text-xs font-bold uppercase text-gray-400">Links & SEO</label>
          <input placeholder="Download URL" value={formData.download_url} onChange={e => setFormData({...formData, download_url: e.target.value})} className="w-full p-3 border rounded outline-none focus:border-green-800" />
          <input placeholder="SEO Title" value={formData.seo_title} onChange={e => setFormData({...formData, seo_title: e.target.value})} className="w-full p-3 border rounded outline-none focus:border-green-800" />
          <textarea placeholder="Meta Description" value={formData.meta_description} onChange={e => setFormData({...formData, meta_description: e.target.value})} className="w-full p-3 border rounded outline-none focus:border-green-800" rows={3} />
          
          <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-3 border rounded outline-none bg-white">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="mt-8 flex gap-4">
          <button onClick={handleSave} disabled={saving} className="flex-1 bg-green-800 text-white p-4 rounded-lg font-bold uppercase hover:bg-green-900 transition shadow-md disabled:bg-gray-400">
            {saving ? 'Saving...' : 'Save Template'}
          </button>
          <Link to="/admin/templates" className="p-4 text-gray-500 font-bold uppercase text-sm flex items-center justify-center">Cancel</Link>
        </div>
      </div>
    </div>
  );
}
