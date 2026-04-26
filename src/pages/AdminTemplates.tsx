import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function AdminTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('templates')
      .upsert(editingTemplate);

    if (error) {
      alert('Error saving template: ' + error.message);
    } else {
      alert('Template saved successfully!');
      setEditingTemplate(null);
      fetchData();
    }
  };

  if (loading) return <div className="p-10 italic text-gray-500">Loading...</div>;

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-[#14532d] uppercase tracking-tight">Manage Templates</h1>
          <button 
            onClick={() => setEditingTemplate({ 
              title: '', slug: '', price: 0, software_os: 'Google Sheets', 
              file_format: 'Google Sheets Spreadsheet', status: 'draft' 
            })}
            className="bg-[#1a8856] text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-[#14532d] transition"
          >
            + Add New Template
          </button>
        </div>

        {editingTemplate ? (
          <form onSubmit={handleSave} className="space-y-8 bg-white p-8 rounded-xl shadow-xl border border-gray-100">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-bold text-gray-800">Edit Template</h2>
              <button type="button" onClick={() => setEditingTemplate(null)} className="text-gray-400 hover:text-red-500 font-bold">✕ Close</button>
            </div>

            {/* BASIC INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Title</label>
                <input
                  type="text"
                  value={editingTemplate.title || ''}
                  onChange={(e) => setEditingTemplate({...editingTemplate, title: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#1a8856]"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Slug (URL)</label>
                <input
                  type="text"
                  value={editingTemplate.slug || ''}
                  onChange={(e) => setEditingTemplate({...editingTemplate, slug: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#1a8856]"
                  required
                />
              </div>
            </div>

            {/* FILE & MEDIA SECTION */}
            <div className="p-6 bg-blue-50/30 rounded-xl border border-blue-100 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-[#1e40af] uppercase tracking-widest mb-2">Download URL (Google Drive Link)</label>
                <input
                  type="text"
                  value={editingTemplate.download_url || ''}
                  onChange={(e) => setEditingTemplate({...editingTemplate, download_url: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                  placeholder="https://drive.google.com/..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-[#1e40af] uppercase mb-2">Main Thumbnail URL</label>
                  <input
                    type="text"
                    value={editingTemplate.thumbnail || ''}
                    onChange={(e) => setEditingTemplate({...editingTemplate, thumbnail: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg outline-none"
                    placeholder="URL Image"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#1e40af] uppercase mb-2">Screenshot 1 URL</label>
                  <input
                    type="text"
                    value={editingTemplate.img_1 || ''}
                    onChange={(e) => setEditingTemplate({...editingTemplate, img_1: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#1e40af] uppercase mb-2">Screenshot 2 URL</label>
                  <input
                    type="text"
                    value={editingTemplate.img_2 || ''}
                    onChange={(e) => setEditingTemplate({...editingTemplate, img_2: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#1e40af] uppercase mb-2">Screenshot 3 URL</label>
                  <input
                    type="text"
                    value={editingTemplate.img_3 || ''}
                    onChange={(e) => setEditingTemplate({...editingTemplate, img_3: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SEO & VIDEO SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-green-50/30 rounded-xl border border-green-100">
              <div>
                <label className="block text-[10px] font-black text-[#14532d] uppercase mb-2">SEO Title (Google)</label>
                <input
                  type="text"
                  value={editingTemplate.seo_title || ''}
                  onChange={(e) => setEditingTemplate({...editingTemplate, seo_title: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a8856] outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#14532d] uppercase mb-2">YouTube Video ID</label>
                <input
                  type="text"
                  value={editingTemplate.youtube_url || ''}
                  onChange={(e) => setEditingTemplate({...editingTemplate, youtube_url: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a8856] outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-[#14532d] uppercase mb-2">Meta Description (SEO)</label>
                <textarea
                  value={editingTemplate.meta_description || ''}
                  onChange={(e) => setEditingTemplate({...editingTemplate, meta_description: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg h-20 outline-none"
                />
              </div>
            </div>

            {/* TECHNICAL & DESCRIPTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-xl">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">Price (0=Free)</label>
                <input
                  type="number"
                  value={editingTemplate.price ?? 0}
                  onChange={(e) => setEditingTemplate({...editingTemplate, price: parseFloat(e.target.value)})}
                  className="w-full p-3 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">OS</label>
                <input
                  type="text"
                  value={editingTemplate.software_os || 'Google Sheets'}
                  onChange={(e) => setEditingTemplate({...editingTemplate, software_os: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">Format</label>
                <input
                  type="text"
                  value={editingTemplate.file_format || 'Google Sheets Spreadsheet'}
                  onChange={(e) => setEditingTemplate({...editingTemplate, file_format: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex justify-between mb-2 italic">
                  <span className="text-[10px] font-black text-[#1a8856] uppercase">Short Description (Above Images)</span>
                  <span className="text-[10px] text-gray-400">Use &lt;b&gt;text&lt;/b&gt; for bold</span>
                </label>
                <textarea
                  value={editingTemplate.short_description || ''}
                  onChange={(e) => setEditingTemplate({...editingTemplate, short_description: e.target.value})}
                  className="w-full p-4 border border-gray-200 rounded-lg h-32 outline-none shadow-inner"
                />
              </div>
              <div>
                <label className="flex justify-between mb-2 italic">
                  <span className="text-[10px] font-black text-[#1a8856] uppercase">Long Description (Bottom)</span>
                  <span className="text-[10px] text-gray-400">Use &lt;b&gt;text&lt;/b&gt; for bold</span>
                </label>
                <textarea
                  value={editingTemplate.long_description || ''}
                  onChange={(e) => setEditingTemplate({...editingTemplate, long_description: e.target.value})}
                  className="w-full p-4 border border-gray-200 rounded-lg h-64 outline-none font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <button type="submit" className="bg-[#1a8856] text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-[#14532d] transition-all">Save Changes</button>
              <button type="button" onClick={() => setEditingTemplate(null)} className="bg-gray-100 text-gray-500 px-8 py-3 rounded-lg font-bold">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Template Name</th>
                  <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {templates.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-bold text-gray-700">{t.title}</td>
                    <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase">{t.status}</span></td>
                    <td className="p-4">
                      <button onClick={() => setEditingTemplate(t)} className="text-[#1a8856] hover:underline font-bold text-sm">Edit</button>
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
