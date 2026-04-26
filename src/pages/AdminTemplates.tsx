import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage.from('templates').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('templates').getPublicUrl(filePath);
      setEditingTemplate({ ...editingTemplate, [field]: data.publicUrl });
    } catch (error: any) {
      alert('Error uploading: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('templates').upsert(editingTemplate);
    if (error) alert('Error saving: ' + error.message);
    else {
      alert('Template saved successfully!');
      setEditingTemplate(null);
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      const { error } = await supabase.from('templates').delete().eq('id', id);
      if (error) alert('Error deleting: ' + error.message);
      else fetchData();
    }
  };

  if (loading) return <div className="p-10 italic text-gray-500 font-sans">Loading database...</div>;

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen text-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-[#14532d] uppercase tracking-tight">Manage Templates</h1>
          <button 
            onClick={() => setEditingTemplate({ title: '', slug: '', price: 0, status: 'draft', software_os: 'Google Sheets', file_format: 'Google Sheets Spreadsheet' })}
            className="bg-[#1a8856] text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-[#14532d] transition"
          >
            + Add New Template
          </button>
        </div>

        {editingTemplate ? (
          <form onSubmit={handleSave} className="space-y-8 bg-white p-8 rounded-xl shadow-xl border border-gray-100">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-bold text-gray-800">Edit Template Details</h2>
              <button type="button" onClick={() => setEditingTemplate(null)} className="text-gray-400 hover:text-red-500 font-bold text-2xl transition">✕</button>
            </div>

            {/* BASIC INFO */}
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
                <select value={editingTemplate.status || 'draft'} onChange={(e) => setEditingTemplate({...editingTemplate, status: e.target.value})} className={`w-full p-3 border rounded-lg outline-none font-bold ${editingTemplate.status === 'published' ? 'border-green-500 text-green-600' : 'border-gray-300 text-gray-400'}`}>
                  <option value="draft">📁 Draft</option>
                  <option value="published">🚀 Published</option>
                </select>
              </div>
            </div>

            {/* MEDIA SECTION */}
            <div className="p-6 bg-green-50/20 rounded-xl border border-green-100 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-[#14532d] uppercase mb-2 tracking-widest">Download URL (Google Drive)</label>
                <input type="text" value={editingTemplate.download_url || ''} onChange={(e) => setEditingTemplate({...editingTemplate, download_url: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['thumbnail', 'img_1', 'img_2', 'img_3'].map((field) => (
                  <div key={field}>
                    <label className="block text-[10px] font-black text-[#14532d] uppercase mb-2 tracking-widest">{field.replace('_', ' ')}</label>
                    <div className="flex gap-2">
                      <input type="text" value={editingTemplate[field] || ''} readOnly className="flex-1 p-2 border border-gray-200 rounded-lg text-[10px] bg-gray-50 text-gray-400" />
                      <label className="bg-[#1a8856] text-white px-4 py-2 rounded-lg cursor-pointer text-xs font-bold hover:bg-[#14532d] transition shadow-sm">
                        {uploading ? '...' : 'Upload'}
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, field)} disabled={uploading} />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
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

            {/* DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Price</label><input type="number" value={editingTemplate.price ?? 0} onChange={(e) => setEditingTemplate({...editingTemplate, price: parseFloat(e.target.value)})} className="w-full p-3 border border-gray-200 rounded-lg outline-none" /></div>
              <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">OS</label><input type="text" value={editingTemplate.software_os || ''} onChange={(e) => setEditingTemplate({...editingTemplate, software_os: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none" /></div>
              <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Format</label><input type="text" value={editingTemplate.file_format || ''} onChange={(e) => setEditingTemplate({...editingTemplate, file_format: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none" /></div>
            </div>

            {/* DESCRIPTIONS */}
            <div className="space-y-4">
              <div><label className="flex justify-between mb-2"><span className="text-[10px] font-black text-[#1a8856] uppercase tracking-widest">Short Description</span><span className="text-[10px] text-gray-400 italic">Use &lt;b&gt;...&lt;/b&gt; for bold</span></label>
              <textarea value={editingTemplate.short_description || ''} onChange={(e) => setEditingTemplate({...editingTemplate, short_description: e.target.value})} className="w-full p-4 border border-gray-200 rounded-lg h-32 outline-none shadow-inner" /></div>
              <div><label className="flex justify-between mb-2"><span className="text-[10px] font-black text-[#1a8856] uppercase tracking-widest">Long Description</span><span className="text-[10px] text-gray-400 italic">Use &lt;b&gt;...&lt;/b&gt; for bold</span></label>
              <textarea value={editingTemplate.long_description || ''} onChange={(e) => setEditingTemplate({...editingTemplate, long_description: e.target.value})} className="w-full p-4 border border-gray-200 rounded-lg h-64 outline-none font-mono text-sm" /></div>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <button type="submit" className="bg-[#1a8856] text-white px-10 py-3 rounded-lg font-bold shadow-lg hover:bg-[#14532d] transition-all uppercase tracking-widest text-xs">Save Changes</button>
              <button type="button" onClick={() => setEditingTemplate(null)} className="bg-gray-100 text-gray-400 px-10 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all uppercase tracking-widest text-xs">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                  <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {templates.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-bold text-gray-700">{t.title}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${t.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>{t.status}</span></td>
                    <td className="p-4 text-right space-x-4">
                      <button onClick={() => setEditingTemplate(t)} className="text-[#1a8856] font-bold text-xs hover:underline uppercase tracking-widest">Edit</button>
                      <button onClick={() => handleDelete(t.id)} className="text-red-400 font-bold text-xs hover:underline uppercase tracking-widest">Delete</button>
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
