import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const GREEN = "#2D5A27";
const inputCls = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white outline-none focus:ring-2 focus:ring-green-900/20";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Templates");
  const [dataList, setDataList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState("");

  const fetchData = async () => {
    const table = activeTab.toLowerCase();
    const { data } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    const { data: cats } = await supabase.from('categories').select('*').order('name');
    setDataList(data || []);
    setCategories(cats || []);
  };

  useEffect(() => { fetchData(); }, [activeTab]);

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
    } catch (err: any) { alert(err.message); }
    setUploading("");
  };

  const handleSave = async () => {
    if (!form.title && !form.name) return alert("Required fields missing");
    setLoading(true);
    const table = activeTab.toLowerCase();
    const slug = form.slug || (form.title || form.name).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    try {
      const { error } = await supabase.from(table).upsert([{ ...form, slug }]);
      if (error) throw error;
      setModal(false);
      fetchData();
    } catch (err: any) { alert(err.message); }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const table = activeTab.toLowerCase();
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err: any) { alert(err.message); }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <aside className="w-64 bg-white border-r p-6 shrink-0 shadow-sm">
        <div className="font-black text-2xl mb-10 tracking-tighter" style={{color: GREEN}}>TRACKY.</div>
        <nav className="space-y-2">
          {["Templates", "Categories"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${activeTab === t ? "bg-green-50 text-green-900" : "text-gray-400 hover:bg-gray-50"}`}>
              {t}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-end mb-10">
          <h1 className="text-4xl font-black">{activeTab}</h1>
          <button onClick={() => { setForm({}); setModal(true); }} className="text-white px-8 py-3 rounded-xl font-bold" style={{backgroundColor: GREEN}}>+ Add New</button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-[10px] uppercase font-black text-gray-400">
              <tr>
                <th className="p-6">Preview</th>
                <th className="p-6">Name / Title</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dataList.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6">
                    <img src={item.thumbnail_url || item.image_url || "https://via.placeholder.com/100"} className="h-12 w-20 object-cover rounded-lg border bg-gray-100" />
                  </td>
                  <td className="p-6">
                    <div className="font-bold">{item.title || item.name}</div>
                    <div className="text-xs text-gray-400 font-mono">{item.slug}</div>
                  </td>
                  <td className="p-6 text-right space-x-4">
                    <button onClick={() => { setForm(item); setModal(true); }} className="font-black text-green-800">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="font-black text-red-400 hover:text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <h2 className="text-3xl font-black mb-8">{form.id ? 'Edit' : 'Add'} {activeTab}</h2>
              <div className="space-y-6">
                {activeTab === "Templates" ? (
                  <>
                    <div><label className="text-xs font-black text-gray-400 uppercase">Title</label><input className={inputCls} value={form.title || ""} onChange={e => setForm({...form, title: e.target.value})} /></div>
                    <div><label className="text-xs font-black text-gray-400 uppercase">Category</label>
                      <select className={inputCls} value={form.category_id || ""} onChange={e => setForm({...form, category_id: e.target.value})}>
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div><label className="text-xs font-black text-gray-400 uppercase">Description</label><textarea className={inputCls} rows={3} value={form.description || ""} onChange={e => setForm({...form, description: e.target.value})} /></div>
                    <div><label className="text-xs font-black text-gray-400 uppercase">Google Sheets Link</label><input className={inputCls} value={form.download_url || ""} onChange={e => setForm({...form, download_url: e.target.value})} /></div>
                    <div className="grid grid-cols-4 gap-4 bg-gray-50 p-4 rounded-2xl">
                      {['thumbnail_url', 'carousel_url_1', 'carousel_url_2', 'carousel_url_3'].map((f, i) => (
                        <div key={f} className="relative aspect-square bg-white rounded-xl border flex items-center justify-center overflow-hidden">
                          {form[f] ? <img src={form[f]} className="h-full w-full object-cover" /> : <span className="text-[10px] text-gray-300">Img {i}</span>}
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleUpload(e, f)} />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div><label className="text-xs font-black text-gray-400 uppercase">Category Name</label><input className={inputCls} value={form.name || ""} onChange={e => setForm({...form, name: e.target.value})} /></div>
                    <div><label className="text-xs font-black text-gray-400 uppercase">Category Image</label><input type="file" onChange={e => handleUpload(e, 'image_url')} /></div>
                  </>
                )}
                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button onClick={() => setModal(false)} className="px-6 py-2 font-bold text-gray-400">CANCEL</button>
                  <button onClick={handleSave} disabled={loading} className="text-white px-10 py-3 rounded-xl font-black" style={{backgroundColor: GREEN}}>
                    {loading ? "SAVING..." : "SAVE DATA"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
