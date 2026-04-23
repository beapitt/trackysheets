import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

const GREEN = "#2D5A27";

const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
const inputCls = "border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30 w-full bg-white";

// Upload diretto a Supabase
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
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>({});
  const [uploading, setUploading] = useState("");

  const loadData = async () => {
    const { data } = await supabase.from('templates').select('*').order('created_at', { ascending: false });
    setTemplates(data || []);
  };

  useEffect(() => { loadData(); }, []);

  const handleUpload = async (e: any, field: string) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(field);
    try {
      const url = await uploadFile(file);
      setForm({ ...form, [field]: url });
    } catch (err) { alert("Upload fallito"); }
    setUploading("");
  };

  const save = async () => {
    const { error } = await supabase.from('templates').upsert([form]);
    if (error) alert(error.message);
    else { setModal(false); loadData(); }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r p-6">
        <h1 className="text-xl font-bold mb-8" style={{color: GREEN}}>Tracky Admin</h1>
        <nav className="space-y-2">
          <button onClick={() => setTabs("Templates")} className={`w-full text-left p-2 rounded ${tabs === "Templates" ? "bg-green-50 text-green-700" : ""}`}>Templates</button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Manage Templates</h2>
          <button onClick={() => { setForm({}); setModal(true); }} className="bg-green-700 text-white px-4 py-2 rounded">+ New Template</button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left">Preview</th>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t: any) => (
                <tr key={t.id} className="border-b">
                  <td className="p-4"><img src={t.thumbnail_url} className="h-12 w-20 object-cover rounded" /></td>
                  <td className="p-4 font-medium">{t.title}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => { setForm(t); setModal(true); }} className="text-blue-600 mr-4">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Template Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-bold">Title</label>
                  <input className={inputCls} value={form.title || ""} onChange={e => setForm({...form, title: e.target.value, slug: toSlug(e.target.value)})} />
                </div>
                <div>
                  <label className="text-sm font-bold">Thumbnail</label>
                  <input type="file" onChange={e => handleUpload(e, 'thumbnail_url')} />
                  {uploading === 'thumbnail_url' && <span>Caricamento...</span>}
                </div>
                <div>
                  <label className="text-sm font-bold">Download URL (Google Sheets)</label>
                  <input className={inputCls} value={form.download_url || ""} onChange={e => setForm({...form, download_url: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-bold">Description</label>
                  <textarea className={inputCls} rows={4} value={form.description || ""} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                {['carousel_url_1', 'carousel_url_2', 'carousel_url_3'].map(f => (
                  <div key={f}>
                    <label className="text-sm font-bold">Carousel Image</label>
                    <input type="file" onChange={e => handleUpload(e, f)} />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button onClick={save} className="bg-green-700 text-white px-6 py-2 rounded">Save Template</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
