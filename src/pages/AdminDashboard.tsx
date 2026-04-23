import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const GREEN = "#2D5A27";
const inputCls = "border border-gray-300 rounded px-3 py-2 text-sm w-full bg-white outline-none focus:ring-2 focus:ring-green-900/20";

export default function AdminDashboard() {
  const [tab, setTab] = useState("Templates");
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState("");

  const loadData = async () => {
    try {
      const { data: tpls } = await supabase.from('templates').select('*').order('created_at', { ascending: false });
      const { data: cats } = await supabase.from('categories').select('*').order('name');
      setTemplates(tpls || []);
      setCategories(cats || []);
    } catch (err: any) {
      console.error("Load error:", err.message);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(field);
    try {
      const name = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      const { error } = await supabase.storage.from('templates').upload(name, file);
      if (error) throw error;
      const { data } = supabase.storage.from('templates').getPublicUrl(name);
      setForm((prev: any) => ({ ...prev, [field]: data.publicUrl }));
    } catch (err: any) { 
      alert("Upload error: " + err.message); 
    } finally {
      setLoading("");
    }
  };

  const handleSave = async () => {
    if (!form.title) return alert("Title is required");
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    try {
      const { error } = await supabase.from('templates').upsert({ ...form, slug });
      if (error) throw error;
      setModal(false);
      loadData();
      alert("Saved successfully!");
    } catch (err: any) { 
      alert("Database error: " + err.message); 
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await supabase.from('templates').delete().eq('id', id);
    loadData();
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <aside className="w-64 bg-white border-r p-6 shrink-0">
        <div className="font-black text-2xl mb-10" style={{color: GREEN}}>TRACKY.</div>
        <nav className="space-y-1">
          {["Templates", "Categories"].map(t => (
            <button 
              key={t} 
              onClick={() => setTab(t)} 
              className={`w-full text-left px-4 py-2 rounded font-bold ${tab === t ? "bg-gray-100 text-green-900" : "text-gray-400 hover:bg-gray-50"}`}
            >
              {t}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black">{tab}</h1>
          <button 
            onClick={() => { setForm({}); setModal(true); }} 
            className="text-white px-8 py-3 rounded-lg font-bold shadow-lg" 
            style={{backgroundColor: GREEN}}
          >
            Add New {tab === "Templates" ? "Template" : "Category"}
          </button>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-[10px] uppercase font-black text-gray-400">
              <tr>
                <th className="p-5">Preview</th>
                <th className="p-5">Details</th>
                <th className="p-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {templates.length === 0 && (
                <tr><td colSpan={3} className="p-10 text-center text-gray-400 font-medium">No templates found. Add your first one!</td></tr>
              )}
              {templates.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="p-5">
                    <img src={t.thumbnail_url || "https://via.placeholder.com/150"} className="h-14 w-24 object-cover rounded-lg border bg-gray-50" />
                  </td>
                  <td className="p-5">
                    <div className="font-bold text-gray-900">{t.title}</div>
                    <div className="text-xs text-gray-400 font-mono">{t.slug}</div>
                  </td>
                  <td className="p-5 text-right">
                    <button onClick={() => { setForm(t); setModal(true); }} className="font-bold text-green-800 hover:underline mr-4">Edit</button>
                    <button onClick={() => deleteTemplate(t.id)} className="font-bold text-red-400 hover:text-red-600 transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-3xl p-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black">Template Editor</h2>
                <button onClick={() => setModal(false)} className="text-gray-400 text-3xl">&times;</button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-xs font-black uppercase text-gray-400">Title</label>
                  <input className={inputCls} value={form.title || ""} onChange={e => setForm({...form, title: e.target.value})} />
                </div>
                
                <div>
                  <label className="text-xs font-black uppercase text-gray-400">Category</label>
                  <select className={inputCls} value={form.category_id || ""} onChange={e => setForm({...form, category_id: e.target.value})}>
                    <option value="">Select Category</option>
                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-gray-400">YouTube URL</label>
                  <input className={inputCls} value={form.youtube_url || ""} onChange={e => setForm({...form, youtube_url: e.target.value})} />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-black uppercase text-gray-400">Description</label>
                  <textarea className={inputCls} rows={3} value={form.description || ""} onChange={e => setForm({...form, description: e.target.value})} />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-black uppercase text-gray-400">SEO Meta Description</label>
                  <input className={inputCls} value={form.seo_meta_description || ""} onChange={e => setForm({...form, seo_meta_description: e.target.value})} />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-black uppercase text-gray-400">Google Sheets Download Link</label>
                  <input className={inputCls} value={form.download_url || ""} onChange={e => setForm({...form, download_url: e.target.value})} />
                </div>
                
                <div className="col-span-2 grid grid-cols-4 gap-4 bg-gray-50 p-6 rounded-2xl border-2 border-dashed">
                  {['thumbnail_url', 'carousel_url_1', 'carousel_url_2', 'carousel_url_3'].map((f, i) => (
                    <div key={f} className="relative group h-28 bg-white border rounded-xl overflow-hidden shadow-inner">
                      {form[f] ? (
                        <img src={form[f]} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full flex items-center justify-center text-[10px] font-bold text-gray-300 px-2 text-center uppercase">
                          Upload {i === 0 ? 'Thumb' : `Slide ${i}`}
                        </div>
                      )}
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleUpload(e, f)} />
                      {loading === f && (
                        <div className="absolute inset-0 bg-white/90 flex items-center justify-center text-[10px] font-black text-green-800">
                          UPLOADING...
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-10">
                <button onClick={() => setModal(false)} className="px-8 py-3 border-2 rounded-xl font-bold text-gray-400 hover:bg-gray-50">CANCEL</button>
                <button 
                  onClick={handleSave} 
                  className="text-white px-12 py-3 rounded-xl font-bold shadow-xl hover:opacity-90 transition-opacity" 
                  style={{backgroundColor: GREEN}}
                >
                  SAVE TEMPLATE
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
              
