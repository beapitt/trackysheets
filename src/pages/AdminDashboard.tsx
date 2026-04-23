import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const GREEN = "#2D5A27";
const inputCls = "border border-gray-300 rounded px-3 py-2 text-sm w-full bg-white focus:ring-2 focus:ring-green-700/30 outline-none";

export default function AdminDashboard() {
  const [tabs] = useState("Templates");
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>({});
  const [uploading, setUploading] = useState("");

  const loadData = async () => {
    try {
      const { data: tpls, error: tError } = await supabase.from('templates').select('*').order('created_at', { ascending: false });
      const { data: cats, error: cError } = await supabase.from('categories').select('*').order('name');
      if (tError) throw tError;
      setTemplates(tpls || []);
      setCategories(cats || []);
    } catch (err: any) {
      console.error("Errore caricamento:", err.message);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const { error } = await supabase.storage.from('templates').upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from('templates').getPublicUrl(fileName);
      setForm((prev: any) => ({ ...prev, [field]: data.publicUrl }));
    } catch (err: any) {
      alert("Errore upload: " + err.message);
    } finally {
      setUploading("");
    }
  };

  const save = async () => {
    if (!form.title) return alert("Inserisci almeno il titolo!");
    try {
      // Pulizia dati per l'invio
      const payload = { ...form };
      if (!payload.slug) payload.slug = form.title.toLowerCase().replace(/ /g, '-');
      
      const { error } = await supabase.from('templates').upsert(payload);
      if (error) throw error;
      
      setModal(false);
      loadData();
      alert("Salvato con successo!");
    } catch (err: any) {
      alert("Errore salvataggio tabella: " + err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-white border-r p-6 shrink-0">
        <div className="font-bold text-xl mb-8" style={{color: GREEN}}>TRACKY ADMIN</div>
        <button className="w-full text-left px-4 py-2 rounded bg-green-50 text-green-700 font-medium">Templates</button>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">I tuoi Template</h2>
          <button onClick={() => { setForm({}); setModal(true); }} className="text-white px-6 py-2 rounded-lg font-bold" style={{backgroundColor: GREEN}}>+ Nuovo Template</button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-xs text-gray-400 font-bold uppercase">
              <tr>
                <th className="p-4">Preview</th>
                <th className="p-4">Titolo</th>
                <th className="p-4 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {templates.length === 0 ? (
                <tr><td colSpan={3} className="p-10 text-center text-gray-400">Nessun template trovato. Creane uno!</td></tr>
              ) : (
                templates.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="p-4"><img src={t.thumbnail_url} className="h-12 w-20 object-cover rounded border bg-gray-100" /></td>
                    <td className="p-4 font-bold">{t.title}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => { setForm(t); setModal(true); }} className="text-green-700 font-bold hover:underline">Modifica</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {modal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-6">Dettagli Template</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Titolo</label>
                  <input className={inputCls} value={form.title || ""} onChange={e => setForm({...form, title: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Descrizione</label>
                  <textarea className={inputCls} rows={3} value={form.description || ""} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Google Sheets URL</label>
                  <input className={inputCls} value={form.download_url || ""} onChange={e => setForm({...form, download_url: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">YouTube Link</label>
                  <input className={inputCls} value={form.youtube_url || ""} onChange={e => setForm({...form, youtube_url: e.target.value})} />
                </div>
                
                {/* Sezione Upload */}
                <div className="col-span-2 bg-gray-50 p-4 rounded-xl grid grid-cols-4 gap-2">
                  {['thumbnail_url', 'carousel_url_1', 'carousel_url_2', 'carousel_url_3'].map((f, i) => (
                    <div key={f} className="text-center relative">
                      <label className="text-[10px] font-bold block mb-1">{i===0 ? "Principale" : `Slide ${i}`}</label>
                      <div className="h-20 w-full bg-white border rounded flex items-center justify-center overflow-hidden relative">
                        {form[f] ? <img src={form[f]} className="h-full w-full object-cover" /> : <span className="text-gray-300 text-[10px]">Vuoto</span>}
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleUpload(e, f)} />
                      </div>
                      {uploading === f && <div className="text-[9px] text-green-600 animate-pulse">Caricamento...</div>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setModal(false)} className="px-6 py-2 border rounded-lg">Annulla</button>
                <button onClick={save} className="text-white px-10 py-2 rounded-lg font-bold shadow-md" style={{backgroundColor: GREEN}}>SALVA ORA</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
              
