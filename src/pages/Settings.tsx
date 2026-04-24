import React, { useEffect, useState } from 'react';
import { supabase } from "../lib/supabase";
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
      setMessage('❌ Error saving settings');
    } else {
      setMessage('✅ Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <div className="p-8 text-left font-sans">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 text-left font-sans">
      {/* Sidebar */}
      <aside className="w-48 bg-[#1a3a1a] text-white p-6 shrink-0">
        <div className="mb-8 font-bold text-2xl">TS</div>
        <nav className="space-y-2 text-sm">
          <Link to="/admin/templates" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Templates</Link>
          <Link to="/admin/categories" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Categories</Link>
          <Link to="/admin/settings" className="block px-4 py-2 rounded bg-white/10 border-l-4 border-green-400 no-underline text-white font-bold">Settings</Link>
          <Link to="/admin" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white border-t border-white/10 mt-4 pt-4">Dashboard</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="bg-[#2D5A27] text-white p-6 rounded-lg mb-8 shadow-md">
          <h1 className="text-2xl font-bold">Site Configuration</h1>
          <p className="text-sm text-green-100 mt-1">Manage global site settings, SEO, and Analytics</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg font-bold ${message.includes('❌') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 max-w-4xl">
          {/* General Settings */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-gray-700">General Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Site Title</label>
                <input type="text" value={settings.site_name || ''} onChange={e => setSettings({...settings, site_name: e.target.value})} className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-green-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Homepage Hero Title</label>
                <input type="text" value={settings.site_description_title || ''} onChange={e => setSettings({...settings, site_description_title: e.target.value})} className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-green-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Homepage Hero Description</label>
                <textarea rows={4} value={settings.site_description_text || ''} onChange={e => setSettings({...settings, site_description_text: e.target.value})} className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-green-600 text-sm" />
              </div>
            </div>
          </div>

          {/* Marketing & Social */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-gray-700">Marketing & Social Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Google Analytics ID</label>
                <input type="text" placeholder="G-XXXXXXXXXX" value={settings.ga_id || ''} onChange={e => setSettings({...settings, ga_id: e.target.value})} className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-green-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Featured Video URL (YouTube)</label>
                <input type="text" value={settings.homepage_video_url || ''} onChange={e => setSettings({...settings, homepage_video_url: e.target.value})} className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-green-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pinterest URL</label>
                <input type="url" value={settings.pinterest_url || ''} onChange={e => setSettings({...settings, pinterest_url: e.target.value})} className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-green-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">YouTube Channel URL</label>
                <input type="url" value={settings.youtube_url || ''} onChange={e => setSettings({...settings, youtube_url: e.target.value})} className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-green-600" />
              </div>
            </div>
          </div>

          {/* SEO & Meta */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-gray-700">SEO & Meta Tags</h2>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Custom Meta Tags (one per line)</label>
              <textarea rows={3} placeholder="description=Free spreadsheet templates" value={settings.meta_tags || ''} onChange={e => setSettings({...settings, meta_tags: e.target.value})} className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-green-600 font-mono text-sm" />
            </div>
          </div>

          <div className="text-left pb-10">
            <button onClick={handleSave} className="bg-[#2D5A27] hover:bg-[#1a3a1a] text-white font-bold py-3 px-10 rounded shadow-lg transition-transform active:scale-95">
              💾 Save All Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
