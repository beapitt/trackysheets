import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const GREEN = "#2D5A27";
const labelCls = "text-[10px] font-black uppercase text-gray-400 mb-1 block";
const inputCls = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white outline-none focus:ring-2 focus:ring-green-900/20 transition-all";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Templates");
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState("");

  const loadAllData = async () => {
    const { data: tpls } = await supabase.from('templates').select('*').order('created_at', { ascending: false });
    const { data: cats } = await supabase.from('categories').select('*').order('name');
    setTemplates(tpls || []);
    setCategories(cats || []);
  };

  useEffect(() => { loadAllData(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      const { error } = await supabase.storage.from('templates').upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from('templates').getPublicUrl(fileName);
      setForm((prev: any) => ({ ...prev, [field]: data.publicUrl }));
    } catch (err: any) { alert("Upload error: " + err.message); }
    setUploading("");
  };

  const handleSave = async () => {
    if (!form.title) return alert("Title is required!");
    setLoading(true);
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    try {
      const { error } = await supabase.from('templates').upsert([{ ...form, slug }]);
      if (error) throw error;
      alert("Success! Data saved to Supabase.");
      setModal(false);
      loadAllData();
    } catch (err: any) { alert("DB Error: " + err.message); }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 shrink-0 shadow-sm">
        <div className="font-black text-2xl mb-10 tracking-tighter" style={{color: GREEN}}>TRACKY.</div>
        <nav className="space-y-2">
          {["Templates", "Categories"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${activeTab === t ? "bg-green-50 text-green-900 shadow-sm" : "text-gray-400 hover:bg-gray-50"}`}>
              {t}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight">{activeTab}</h1>
            <p className="text-gray-400 text-sm font-medium">Manage your {activeTab.toLowerCase()} library</p>
          </div>
          <button onClick={() => { setForm({}); setModal(true); }} className="text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all" style={{backgroundColor: GREEN}}>
            + Add New
          </button>
        </div>

        {/* Table List */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase font-black text-gray-400">
              <tr>
                <th className="p-6">Preview</th>
                <th className="p-6">Content Details</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {templates.length === 0 ? (
                <tr><td colSpan={3} className="p-20 text-center text-gray-300 font-bold">Your database is currently empty.</td></tr>
              ) : (
                templates.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-6"><img src={t.thumbnail_url} className="h-16 w-28 object-cover rounded-xl border bg-gray-50 shadow-sm" /></td>
                    <td className="p-6">
                      <div className="font-bold text-lg">{t.title}</div>
                      <div className="text-xs text-gray-400 font-mono tracking-tight">{t.slug}</div>
                    </td>
                    <td className="p-6 text-right">
                      <button onClick={() => { setForm(t); setModal(true); }} className="font-black text-green-800 hover:bg-green-50 px-4 py-2 rounded-lg transition-all">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Full Modal */}
        {modal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black">Content Editor</h2>
                <button onClick={() => setModal(false)} className="text-gray-300 hover:text-gray-900 text-4xl">&times;</button>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2">
                  <label className={labelCls}>Title</label>
                  <input className={inputCls} placeholder="E.g. Monthly Budget Tracker" value={form.title || ""} onChange={e => setForm({...form, title: e.target.value})} />
                </div>

                <div>
                  <label className={labelCls}>Category</label>
                  <select className={inputCls} value={form.category_id || ""} onChange={e => setForm({...form, category_id: e.target.value})}>
                    <option value="">No Category</option>
                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>YouTube URL</label>
                  <input className={inputCls} placeholder="https://youtube.com/..." value={form.youtube_url || ""} onChange={e => setForm({...form, youtube_url: e.target.value})} />
                </div>

                <div className="col-span-2">
                  <label className={labelCls}>Description</label>
                  <textarea className={inputCls} rows={4} placeholder="Describe your sheet..." value={form.description || ""} onChange={e => setForm({...form, description: e.target.value})} />
                </div>

                <div className="col-span-2">
                  <label className={labelCls}>SEO Meta Description</label>
                  <input className={inputCls} placeholder="Short snippet for Google results" value={form.seo_meta_description || ""} onChange={e => setForm({...form, seo_meta_description: e.target.value})} />
                </div>

                <div className="col-span-2">
                  <label className={labelCls}>Google Sheets Link (Download URL)</label>
                  <input className={inputCls} placeholder="https://docs.google.com/spreadsheets/..." value={form.download_url || ""} onChange={e => setForm({...form, download_url: e.target.value})} />
                </div>

                {/* Image Upload Area */}
                <div className="col-span-2">
                  <label className={labelCls}>Visual Assets (Click to upload)</label>
                  <div className="grid grid-cols-4 gap-4 bg-gray-50 p-6 rounded-3xl border-2 border-dashed border-gray-200">
                    {['thumbnail_url', 'carousel_url_1', 'carousel_url_2', 'carousel_url_3'].map((f, i) => (
                      <div key={f} className="relative aspect-[4/3] bg-white rounded-2xl border shadow-inner overflow-hidden group cursor-pointer hover:border-green-300 transition-all">
                        {form[f] ? <img src={form[f]} className="h-full w-full object-cover" /> : <div className="h-full flex items-center justify-center text-[9px] text-gray-400 font-bold px-2 text-center uppercase">{i === 0 ? 'Thumb' : `Slide ${i}`}</div>}
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleUpload(e, f)} />
                        {uploading === f && <div className="absolute inset-0 bg-white/90 flex items-center justify-center text-[9px] font-black text-green-800">LOADING...</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-12 pt-8 border-t">
                <button onClick={() => setModal(false)} className="px-8 py-4 font-bold text-gray-400 hover:text-gray-900 transition-colors">CANCEL</button>
                <button onClick={handleSave} disabled={loading} className="text-white px-12 py-4 rounded-2xl font-black shadow-2xl hover:opacity-90 disabled:opacity-50 transition-all" style={{backgroundColor: GREEN}}>
                  {loading ? "SAVING DATA..." : "SAVE TO DATABASE"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
