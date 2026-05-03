import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, X, Upload } from 'lucide-react';

export default function AdminTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: t } = await supabase.from('templates').select('*').order('created_at', { ascending: false });
    const { data: c } = await supabase.from('categories').select('*').order('name');
    if (t) setTemplates(t);
    if (c) setCategories(c);
    setLoading(false);
  }

  // FUNZIONE PER RIMUOVERE IL LINK DELL'IMMAGINE
  const handleRemoveImage = (field: string) => {
    setEditingTemplate({ ...editingTemplate, [field]: '' });
  };

  const handleAddFaq = () => {
    const currentFaqs = Array.isArray(editingTemplate.faqs) ? editingTemplate.faqs : [];
    setEditingTemplate({ ...editingTemplate, faqs: [...currentFaqs, { q: '', a: '' }] });
  };

  const handleRemoveFaq = (index: number) => {
    const currentFaqs = Array.isArray(editingTemplate.faqs) ? editingTemplate.faqs : [];
    const newFaqs = currentFaqs.filter((_, i) => i !== index);
    setEditingTemplate({ ...editingTemplate, faqs: newFaqs });
  };

  const handleFaqChange = (index: number, field: 'q' | 'a', value: string) => {
    const currentFaqs = [...(editingTemplate.faqs || [])];
    currentFaqs[index][field] = value;
    setEditingTemplate({ ...editingTemplate, faqs: currentFaqs });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('templates').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('templates').getPublicUrl(fileName);
      setEditingTemplate({ ...editingTemplate, [field]: data.publicUrl });
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('templates').upsert(editingTemplate);
    if (error) alert('Error: ' + error.message);
    else {
      alert('Saved!');
      setEditingTemplate(null);
      fetchData();
    }
  };

  if (loading) return <div className="p-10 font-sans opacity-50">Loading database...</div>;

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen text-left">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-[#1F5C3E] uppercase tracking-tighter">Manage Templates</h1>
          <button onClick={() => setEditingTemplate({ title: '', slug: '', status: 'draft', faqs: [] })} className="bg-[#1F5C3E] text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition">+ Add Template</button>
        </div>

        {editingTemplate ? (
          <form onSubmit={handleSave} className="space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex justify-between items-center border-b pb-6">
              <h2 className="text-xl font-bold">Template Details</h2>
              <button type="button" onClick={() => setEditingTemplate(null)} className="text-gray-300 hover:text-red-500 transition"><X size={24}/></button>
            </div>

            {/* INFO BASE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label>
                <input type="text" value={editingTemplate.title || ''} onChange={(e) => setEditingTemplate({...editingTemplate, title: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:border-[#1F5C3E]" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                <select value={editingTemplate.category || ''} onChange={(e) => setEditingTemplate({...editingTemplate, category: e.target.value})} className="w-full p-3 border rounded-xl bg-white">
                  <option value="">Select...</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Status</label>
                <select value={editingTemplate.status || 'draft'} onChange={(e) => setEditingTemplate({...editingTemplate, status: e.target.value})} className="w-full p-3 border rounded-xl font-bold">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* IMMAGINI */}
            <div className="bg-gray-50 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
              {['thumbnail', 'img_1', 'img_2', 'img_3'].map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-[10px] font-bold text-[#1F5C3E] uppercase tracking-widest">{field.replace('_', ' ')}</label>
                  <div className="flex gap-2 items-center bg-white p-2 border rounded-xl">
                    {editingTemplate[field] ? (
                      <>
                        <img src={editingTemplate[field]} className="w-12 h-12 object-cover rounded-lg border" alt="" />
                        <span className="flex-1 text-[10px] text-gray-400 truncate">{editingTemplate[field]}</span>
                        <button type="button" onClick={() => handleRemoveImage(field)} className="p-2 text-red-500 hover:bg-red-50 transition rounded-lg"><Trash2 size={16}/></button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 text-[10px] text-gray-300 italic px-2">No image uploaded</div>
                        <label className="bg-[#1F5C3E] text-white px-4 py-2 rounded-lg cursor-pointer text-[10px] font-bold hover:bg-black transition">
                          {uploading ? '...' : 'UPLOAD'}
                          <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, field)} disabled={uploading} />
                        </label>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button type="submit" className="w-full bg-[#1F5C3E] text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-black transition shadow-lg shadow-[#1F5C3E]/20">Save Template</button>
          </form>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Template Name</th>
                  <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {templates.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 transition">
                    <td className="p-6 font-bold">{t.title}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${t.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-6 text-right space-x-4">
                      <button onClick={() => setEditingTemplate(t)} className="text-[#1F5C3E] font-bold text-xs hover:underline uppercase">Edit</button>
                      <button onClick={() => handleDelete(t.id)} className="text-red-400 font-bold text-xs hover:underline uppercase">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
