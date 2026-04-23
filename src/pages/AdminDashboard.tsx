import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

const GREEN = "#2D5A27";
const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
const inputCls = "border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30 w-full bg-white";

async function uploadFile(file: File) {
  const fileName = `${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from('templates').upload(fileName, file);
  if (error) throw error;
  const { data } = supabase.storage.from('templates').getPublicUrl(fileName);
  return data.publicUrl;
}

export default function AdminDashboard() {
  const [tabs, setTabs] = useState("Templates");
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>({});
  const [uploading, setUploading] = useState("");

  const loadData = async () => {
    const { data: tpls } = await supabase.from('templates').select('*').order('created_at', { ascending: false });
    const { data: cats } = await supabase.from('categories').select('*').order('name');
    setTemplates(tpls || []);
    setCategories(cats || []);
  };

  useEffect(() => { loadData(); }, []);

  const handleUpload = async (e: any, field: string) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(field);
    try {
      const url = await uploadFile(file);
      setForm({ ...form, [field]: url });
    } catch (err) { alert("Upload fallito!"); }
    setUploading("");
  };

  const save = async () => {
    if (!form.title || !form.slug) return alert("Title e Slug sono obbligatori!");
    const { error } = await supabase.from('templates').upsert([form]);
    if (error) alert(error.message);
    else { setModal(false); loadData(); }
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm("Sei sicura di voler eliminare questo template?")) return;
    await supabase.from('templates').delete().eq('id', id);
    loadData();
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <aside className="w-64 bg-white border-r p-6 shrink-0">
        <div className="font-bold text-xl mb-8" style={{color: GREEN}}>TRACKY ADMIN</div>
        <nav className="space-y-1">
          <button onClick={() => setTabs("Templates")} className={`w-full text-left px-4 py-2 rounded-md font-medium ${tabs === "Templates" ? "bg-green-50 text-green-700" : "text-gray-500 hover:bg-gray-50"}`}>Templates</button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Manage Templates</h2>
          <button onClick={() => { setForm({}); setModal(true); }} className="text-white px-6 py-2 rounded-lg font-bold shadow-sm" style={{backgroundColor: GREEN}}>+ New Template</button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b text-xs uppercase text-gray-400 font-bold">
              <tr>
                <th className="p-4">Preview</th>
                <th className="p-4">Title & Slug</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {templates.map((t: any) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <img src={t.thumbnail_url || 'https://via.placeholder.com/150'} className="h-12 w-20 object-cover rounded shadow-sm border" />
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{t.title}</div>
                    <div className="text-xs text-gray-400 font-mono">{t.slug}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {categories.find((c: any) => c.id === t.category_id)?.name || "—"}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => { setForm(t); setModal(true); }} className="text-green-700 font-bold mr-4 hover:underline">Edit</button>
                    <button onClick={() => deleteTemplate(t.id)} className="text-red-400 hover:text-red-600 transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Template Editor</h3>
                <button onClick={() => setModal(false)} className="text-gray-400 text-2xl">&times;</button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-xs font-bold uppercase text-gray-400">Title</label>
                  <input className={inputCls} value={form.title || ""} onChange={e => setForm({...form, title: e.target.value, slug: toSlug(e.target.value)})} />
                </div>
                
                <div>
                  <label className="text-xs font-bold uppercase text-gray-400">Slug</label>
                  <input className={inputCls} value={form.slug || ""} onChange={e => setForm({...form, slug: e.target.value})} />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-gray-400">Category</label>
                  <select className={inputCls} value={form.category_id || ""} onChange={e => setForm({...form, category_id: e.target.value})}>
                    <option value="">Select Category</option>
                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold uppercase text-gray-400">Description</label>
                  <textarea className={inputCls} rows={3} value={form.description || ""} onChange={e => setForm({...form, description: e.target.value})} />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold uppercase text-gray-400">SEO Meta Description</label>
                  <input className={inputCls} value={form.seo_meta_description || ""} onChange={e => setForm({...form, seo_meta_description: e.target.value})} />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-gray-400">YouTube URL</label>
                  <input className={inputCls} value={form.youtube_url || ""} onChange={e => setForm({...form, youtube_url: e.target.value})} />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-gray-400">Google Sheets URL</label>
                  <input className={inputCls} value={form.download_url || ""} onChange={e => setForm({...form, download_url: e.target.value})} />
                </div>

                <div className="col-span-2 grid grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-dashed">
                   {['thumbnail_url', 'carousel_url_1', 'carousel_url_2', 'carousel_url_3'].map((field, i) => (
                     <div key={field} className="text-center">
                       <label className="text-[10px] font-bold uppercase text-gray-400 block mb-2">{i === 0 ? "Main Thumb" : `Slide ${i}`}</label>
                       <div className="relative group">
                         {form[field] ? (
                           <img src={form[field]} className="h-16 w-full object-cover rounded border bg-white" />
                         ) : (
                           <div className="h-16 w-full bg-white border rounded flex items-center justify-center text-gray-300 text-xs">Empty</div>
                         )}
                         <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleUpload(e, field)} />
                         {uploading === field && <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-[10px]">...</div>}
                       </div>
                     </div>
                   ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                <button onClick={() => setModal(false)} className="px-6 py-2 border rounded-lg font-medium hover:bg-gray-50">Cancel</button>
                <button onClick={save} className="text-white px-10 py-2 rounded-lg font-bold shadow-md" style={{backgroundColor: GREEN}}>Save Template</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
