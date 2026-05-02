import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState({
    id: null,
    site_name: '',
    site_description: '',
    admin_email: '',
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
        setSettings(data);
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
    setMessage('');

    try {
      const { error } = await supabase
        .from('settings')
        .update(settings) // Inviamo tutto l'oggetto settings aggiornato
        .eq('id', settings.id);

      if (error) throw error;

      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Update error:', error);
      alert('Error updating settings.');
    } finally {
      setLoading(false);
    }
  }

  if (loading && !settings.id) return <div className="p-8 font-inter font-bold text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 font-inter text-left">
      <h1 className="text-2xl font-bold text-gray-800 mb-8 uppercase tracking-tight">Site Admin Panel</h1>
      
      {message && <div className="bg-green-100 text-[#1F5C3E] p-4 rounded-xl mb-6 font-bold shadow-sm">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* GENERAL SEO & CONFIG */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xs font-black text-[#1F5C3E] uppercase tracking-[0.2em] mb-4 border-b pb-2">General & SEO</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Site Name</label>
              <input type="text" className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 font-medium" 
                value={settings.site_name || ''} onChange={e => setSettings({...settings, site_name: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Admin Email</label>
              <input type="email" className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 font-medium" 
                value={settings.admin_email || ''} onChange={e => setSettings({...settings, admin_email: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Site Meta Description (Home SEO)</label>
              <textarea className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 h-20 font-medium" 
                value={settings.site_description || ''} onChange={e => setSettings({...settings, site_description: e.target.value})} />
            </div>
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xs font-black text-[#1F5C3E] uppercase tracking-[0.2em] mb-4 border-b pb-2">Home Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Hero Title</label>
              <input type="text" className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 font-medium" 
                value={settings.hero_title || ''} onChange={e => setSettings({...settings, hero_title: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Hero Subtitle</label>
              <textarea className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 h-20 font-medium" 
                value={settings.hero_subtitle || ''} onChange={e => setSettings({...settings, hero_subtitle: e.target.value})} />
            </div>
          </div>
        </div>

        {/* SOCIAL & TRACKING */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xs font-black text-[#1F5C3E] uppercase tracking-[0.2em] mb-4 border-b pb-2">Social, Video & Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">YouTube URL</label>
              <input type="text" className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 font-medium" 
                value={settings.youtube_url || ''} onChange={e => setSettings({...settings, youtube_url: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pinterest URL</label>
              <input type="text" className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 font-medium" 
                value={settings.pinterest_url || ''} onChange={e => setSettings({...settings, pinterest_url: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Featured Video ID (Home)</label>
              <input type="text" className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 font-medium" placeholder="e.g. dQw4w9WgXcQ"
                value={settings.featured_video_id || ''} onChange={e => setSettings({...settings, featured_video_id: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Google Analytics ID</label>
              <input type="text" className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 font-medium" placeholder="G-XXXXXXXXXX"
                value={settings.ga_id || ''} onChange={e => setSettings({...settings, ga_id: e.target.value})} />
            </div>
          </div>
        </div>

        {/* LEGAL CONTENT */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xs font-black text-[#1F5C3E] uppercase tracking-[0.2em] mb-4 border-b pb-2">Legal Content (HTML)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Privacy Policy</label>
              <textarea className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 h-32 font-medium" 
                value={settings.privacy_policy || ''} onChange={e => setSettings({...settings, privacy_policy: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Terms of Use</label>
              <textarea className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 h-32 font-medium" 
                value={settings.terms_of_use || ''} onChange={e => setSettings({...settings, terms_of_use: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Disclaimer</label>
              <textarea className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 h-32 font-medium" 
                value={settings.disclaimer || ''} onChange={e => setSettings({...settings, disclaimer: e.target.value})} />
            </div>
          </div>
        </div>
        
        <button type="submit" disabled={loading} className="w-full bg-[#1F5C3E] text-white font-bold py-5 rounded-2xl shadow-lg hover:bg-black transition-all uppercase tracking-widest">
          {loading ? 'Saving...' : 'Save All Settings'}
        </button>
      </form>
    </div>
  );
}
