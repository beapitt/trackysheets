import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const GREEN = "#2D5A27";

export default function AdminDashboard() {
  const [tab, setTab] = useState("Templates");
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [uploadingField, setUploadingField] = useState("");

  const loadData = async () => {
    const { data: tpls } = await supabase.from('templates').select('*').order('created_at', { ascending: false });
    const { data: cats } = await supabase.from('categories').select('*').order('name');
    setTemplates(tpls || []);
    setCategories(cats || []);
  };

  useEffect(() => { loadData(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(field);
    try {
      const name = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      const { error } = await supabase.storage.from('templates').upload(name, file);
      if (error) throw error;
      const { data } = supabase.storage.from('templates').getPublicUrl(name);
      setForm((prev: any) => ({ ...prev, [field]: data.publicUrl }));
    } catch (err: any) {
      alert("Upload error: " + err.message);
    }
    setUploadingField("");
  };

  const handleSave = async () => {
    if (!form.title) {
      alert("Please enter a Title");
      return;
    }
    setLoading(true);
    try {
      const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const { error } = await supabase.from('templates').upsert([{ ...form, slug }]);
      
      if (error) throw error;

      alert("SUCCESS: Template saved to database!");
      setModal(false);
      setForm({});
      await loadData();
    } catch (err: any) {
      console.error(err);
      alert("DATABASE ERROR: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <aside className="w-64 bg-white border-r p-6 shrink-0">
        <div className="font-black text-2xl mb-10" style={{color: GREEN}}>TRACKY.</div>
        <button className="w-full text-left px-4 py-2 rounded font-bold bg-gray-100 text-green-900">Templates</button>
      </aside>

      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black">{tab}</h1>
          <button onClick={() => { setForm({}); setModal(true); }} className="text-white px-8 py-3 rounded-lg font-bold shadow-lg" style={{backgroundColor: GREEN}}>+ Add New</button>
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
              {templates.length === 0 ? (
                <tr><td colSpan={3} className="p-10 text-center text-gray-400">No templates found in database.</td></tr>
              ) : (
                templates.map(t => (
                  <tr key={t.id}>
                    <td className="p-5"><img src={t.thumbnail_url} className="h-12 w-20 object-cover rounded border" /></td>
                    <td className="p-5 font-bold">{t.title}</td>
                    <td className="p-5 text-right font-bold text-green-700">Edit</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {modal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-3xl p-10 w-full max-w-2xl shadow-2xl">
              <h2 className="text-2xl font-black mb-6">New Template</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400">Title</label>
                  <input className="w-full border rounded-lg px-4 py-2" value={form.title || ""} onChange={e => setForm({...form, title: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400">Google Sheets Link</label>
                  <input className="w-full border rounded-lg px-4 py-2" value={form.download_url || ""} onChange={e => setForm({...form, download_url: e.target.value})} />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {['thumbnail_url', 'carousel_url_1', 'carousel_url_2', 'carousel_url_3'].map((f) => (
                    <div key={f} className="h-20 bg-gray-100 rounded border relative overflow-hidden">
                      {form[f] ? <img src={form[f]} className="h-full w-full object-cover" /> : <div className="text-[8px] text-center mt-7">Upload</div>}
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleUpload(e, f)} />
                      {uploadingField === f && <div className="absolute inset-0 bg-white/80 text-[8px] flex items-center justify-center">...</div>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button onClick={() => setModal(false)} className="px-6 py-2 font-bold text-gray-400">Cancel</button>
                <button 
                  onClick={handleSave} 
                  disabled={loading}
                  className="text-white px-10 py-3 rounded-xl font-bold shadow-xl" 
                  style={{backgroundColor: GREEN, opacity: loading ? 0.5 : 1}}
                >
                  {loading ? "SAVING..." : "SAVE TEMPLATE"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
