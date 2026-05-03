import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, X } from 'lucide-react';

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
      alert('Saved successfully!');
      setEditingTemplate(null);
      fetchData();
    }
  };

  if (loading) return <div className="p-10 opacity-50">Loading database...</div>;

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen text-left">
      <div className="max-w-6xl mx-auto text-left">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-[#14532d] uppercase tracking-tight">Manage Templates</h1>
          <button onClick={() => setEditingTemplate({ title: '', slug: '', status: 'draft', faqs: [], software: 'Google Sheets', file_format: 'Instant Copy' })} className="bg-[#1a8856] text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-[#14532d] transition">+ Add New</button>
        </div>

        {editingTemplate ? (
          <form onSubmit={handleSave} className="space-y-8 bg-white p-8 rounded-xl shadow-xl border border-gray-100 text-left">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-bold text-gray-800">Edit Template</h2>
              <button type="button" onClick={() => setEditingTemplate(null)} className="text-gray-400 hover:text-red-500 font-bold text-2xl transition">✕</button>
            </div>

            {/* INFO BASE */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Title</label>
                <input type="text" value={editingTemplate.title || ''} onChange={(e) => setEditingTemplate({...editingTemplate, title: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#1a8856]" required />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Slug (URL)</label>
                <input type="text" value={editingTemplate.slug || ''} onChange={(e) => setEditingTemplate({...editingTemplate, slug: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#1a8856]" required />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Category</label>
                <select value={editingTemplate.category || ''} onChange={(e) => setEditingTemplate({...editingTemplate, category: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none bg-white font-semibold text-gray-600">
                  <option value="">Select...</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#1a8856] uppercase mb-2 tracking-widest">Status</label>
                <select value={editingTemplate.status || 'draft'} onChange={(e) => setEditingTemplate({...editingTemplate, status: e.target.value})} className="w-full p-3 border rounded-lg font-bold">
                  <option value="draft">📁 Draft</option>
                  <option value="published">🚀 Published</option>
                </select>
              </div>
            </div>

            {/* MEDIA & DRIVE */}
            <div className="p-6 bg-green-50/20 rounded-xl border border-green-100 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-[#14532d] uppercase mb-2 tracking-widest">Download URL (Google Drive)</label>
                <input type="text" value={editingTemplate.download_url || ''} onChange={(e) => setEditingTemplate({...editingTemplate, download_url: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none" placeholder="https://docs.google.com/spreadsheets/d/..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['thumbnail', 'img_1', 'img_2', 'img_3'].map((field) => (
                  <div key={field}>
                    <label className="block text-[10px] font-black text-[#14532d] uppercase mb-2 tracking-widest">{field.replace('_', ' ')}</label>
                    <div className="flex gap-2 items-center">
                      <input type="text" value={editingTemplate[field] || ''} readOnly className="flex-1 p-2 border border-gray-200 rounded-lg text-[10px] bg-gray-50 text-gray-400 truncate" />
                      {editingTemplate[field] && (
                        <button type="button" onClick={() => handleRemoveImage(field)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"><X size={14} /></button>
                      )}
                      <label className="bg-[#1a8856] text-white px-4 py-2 rounded-lg cursor-pointer text-xs font-bold hover:bg-[#14532d] transition shadow-sm">
                        {uploading ? '...' : 'Upload'}
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, field)} disabled={uploading} />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="p-6 bg-[#f5f4ed] rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Frequently Asked Questions</label>
                <button type="button" onClick={handleAddFaq} className="bg-[#1a8856] text-white px-3 py-1 rounded text-[10px] font-bold uppercase hover:bg-black transition">+ Add FAQ</button>
              </div>
              <div className="space-y-4">
                {(editingTemplate.faqs || []).map((faq: any, index: number) => (
                  <div key={index} className="flex gap-3 items-start bg-white p-4 rounded-lg border border-gray-100 relative">
                    <div className="flex-1 space-y-2">
                      <input placeholder="Question" value={faq.q} onChange={(e) => handleFaqChange(index, 'q', e.target.value)} className="w-full p-2 text-sm border rounded font-bold" />
                      <textarea placeholder="Answer" value={faq.a} onChange={(e) => handleFaqChange(index, 'a', e.target.value)} className="w-full p-2 text-sm border rounded" rows={2} />
                    </div>
                    <button type="button" onClick={() => handleRemoveFaq(index)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO & YT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200 text-left">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 tracking-widest">SEO Title</label>
                <input type="text" value={editingTemplate.seo_title || ''} onChange={(e) => setEditingTemplate({...editingTemplate, seo_title: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 tracking-widest">YouTube ID</label>
                <input type="text" value={editingTemplate.youtube_url || ''} onChange={(e) => setEditingTemplate({...editingTemplate, youtube_url: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none" placeholder="e.g. dQw4w9WgXcQ" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 tracking-widest">Meta Description</label>
                <textarea value={editingTemplate.meta_description || ''} onChange={(e) => setEditingTemplate({...editingTemplate, meta_description: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg h-20 outline-none" />
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <button type="submit" className="bg-[#1a8856] text-white px-10 py-3 rounded-lg font-bold shadow-lg hover:bg-[#14532d] transition-all uppercase tracking-widest text-xs">Save Changes</button>
              <button type="button" onClick={() => setEditingTemplate(null)} className="bg-gray-100 text-gray-400 px-10 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all uppercase tracking-widest text-xs">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                  <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {templates.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-bold text-gray-700 text-left">{t.title}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${t.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>{t.status}</span></td>
                    <td className="p-4 text-right space-x-4">
                      <button onClick={() => setEditingTemplate(t)} className="text-[#1a8856] font-bold text-xs hover:underline uppercase tracking-widest">Edit</button>
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
