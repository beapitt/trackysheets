import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState({
    id: null, // AGGIUNTO: Necessario per l'update di Supabase
    hero_title: '',
    hero_subtitle: '',
    pinterest_url: '',
    youtube_url: '',
    featured_video_id: '',
    ga_id: '',
    ad_slot_1: '',
    ad_slot_2: '',
    ad_slot_3: '',
    privacy_policy: '',
    terms_of_use: '',
    disclaimer: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const { data, error } = await supabase.from('settings').select('*').maybeSingle();
      if (error) throw error;
      if (data) {
        setSettings({
          ...data,
          // Forza la lettura corretta anche se il database ha nomi leggermente diversi
          terms_of_use: data.terms_of_use || data.terms_of_service || ''
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Usiamo l'ID recuperato dal database per colpire la riga giusta
      const { error } = await supabase
        .from('settings')
        .update(settings)
        .eq('id', settings.id);

      if (error) throw error;
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Update error:', error);
      alert('Error updating settings');
    } finally {
      setLoading(false);
    }
  }

  if (loading && !settings.id) return <div className="p-8 font-inter font-bold text-gray-400 uppercase tracking-widest">Loading Settings...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 font-inter text-left antialiased">
      <h1 className="text-2xl font-bold text-gray-800 mb-8 uppercase tracking-tight">Site Settings</h1>
      
      {message && <div className="bg-green-100 text-[#1F5C3E] p-4 rounded-xl mb-6 font-bold shadow-sm">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Hero Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xs font-black text-[#1F5C3E] uppercase tracking-[0.2em] mb-4 border-b pb-2">Hero Section</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Hero Title</label>
              <input type="text" className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-[#1F5C3E] transition-all font-medium" value={settings.hero_title} onChange={e => setSettings({...settings, hero_title: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Hero Subtitle</label>
              <textarea className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-[#1F5C3E] transition-all h-24 font-medium" value={settings.hero_subtitle} onChange={e => setSettings({...settings, hero_subtitle: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Social & Video */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xs font-black text-[#1F5C3E] uppercase tracking-[0.2em] mb-4 border-b pb-2">Social & Video</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pinterest URL</label>
              <input type="text" className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-[#1F5C3E] font-medium" value={settings.pinterest_url} onChange={e => setSettings({...settings, pinterest_url: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">YouTube Channel URL</label>
              <input type="text" className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-[#1F5C3E] font-medium" value={settings.youtube_url} onChange={e => setSettings({...settings, youtube_url: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Legal Content - PUNTO CRITICO */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xs font-black text-[#1F5C3E] uppercase tracking-[0.2em] mb-4 border-b pb-2">Legal Content</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Privacy Policy</label>
              <textarea className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-[#1F5C3E] transition-all h-32 font-medium" value={settings.privacy_policy} onChange={e => setSettings({...settings, privacy_policy: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Terms of Use</label>
              <textarea className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-[#1F5C3E] transition-all h-32 font-medium" value={settings.terms_of_use} onChange={e => setSettings({...settings, terms_of_use: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Disclaimer</label>
              <textarea className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-[#1F5C3E] transition-all h-32 font-medium" value={settings.disclaimer} onChange={e => setSettings({...settings, disclaimer: e.target.value})} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-[#1F5C3E] text-white font-bold py-5 rounded-2xl shadow-lg hover:bg-black transition-all uppercase tracking-widest active:scale-[0.98]">
          {loading ? 'Saving...' : 'Save All Settings'}
        </button>
      </form>
    </div>
  );
}
