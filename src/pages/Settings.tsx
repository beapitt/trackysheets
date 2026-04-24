import React, { useEffect, useState } from 'react';
import { supabase } from "../lib/supabase"; // Ho tolto un ../ perché il file è in pages/
import { Link } from "react-router-dom";

export default function Settings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const { data, error } = await supabase.from("site_settings").select("*").maybeSingle();
      if (error) throw error;
      if (data) setSettings(data);
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    const { error } = await supabase.from("site_settings").update(settings).eq("id", 1);
    if (error) {
      setMessage('❌ Errore durante il salvataggio');
    } else {
      setMessage('✅ Impostazioni salvate con successo!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <div className="p-8 text-left">Caricamento...</div>;
  if (!settings) return <div className="p-8 text-left">Nessuna impostazione trovata nel database.</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 text-left font-sans">
      {/* Sidebar Manus Style */}
      <aside className="w-48 bg-[#1a3a1a] text-white p-6 shrink-0">
        <div className="mb-8">
          <div className="text-2xl font-bold mb-2">TS</div>
          <div className="text-[10px] uppercase tracking-widest opacity-70">Admin Panel</div>
        </div>
        <nav className="space-y-2 text-sm font-medium">
          <Link to="/admin/templates" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Templates</Link>
          <Link to="/admin/categories" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Categories</Link>
          <Link to="/admin/settings" className="block px-4 py-2 rounded bg-white/10 border-l-4 border-green-400 no-underline text-white font-bold">Settings</Link>
          <Link to="/admin" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white border-t border-white/10 mt-4 pt-4">Dashboard</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="bg-[#2D5A27] text-white p-6 rounded-lg mb-8 shadow-md">
          <h1 className="text-2xl font-bold">Configurazione Sito</h1>
          <p className="text-sm text-green-100 mt-1">Gestisci i testi della Home e i link social</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg font-bold ${message.includes('❌') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-3xl">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nome del Sito</label>
              <input
                type="text"
                value={settings.site_name || ''}
                onChange={e => setSettings({...settings, site_name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-700 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Pinterest URL</label>
                <input
                  type="url"
                  value={settings.pinterest_url || ''}
                  onChange={e => setSettings({...settings, pinterest_url: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-700 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">YouTube URL</label>
                <input
                  type="url"
                  value={settings.youtube_url || ''}
                  onChange={e => setSettings({...settings, youtube_url: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-700 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Titolo Descrizione Home</label>
              <input
                type="text"
                value={settings.site_description_title || ''}
                onChange={e => setSettings({...settings, site_description_title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-700 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Testo Descrizione Home</label>
              <textarea
                value={settings.site_description_text || ''}
                onChange={e => setSettings({...settings, site_description_text: e.target.value})}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-700 outline-none text-sm"
              />
            </div>

            <div className="pt-4 text-left">
              <button
                onClick={handleSave}
                className="bg-[#2D5A27] hover:bg-[#1a3a1a] text-white font-bold py-2 px-8 rounded transition-all shadow active:scale-95"
              >
                💾 Salva Configurazione
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
