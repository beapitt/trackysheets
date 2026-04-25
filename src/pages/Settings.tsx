import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState({
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
      const { data, error } = await supabase.from('settings').select('*').single();
      if (error) throw error;
      if (data) setSettings(data);
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
      const { error } = await supabase.from('settings').update(settings).eq('id', (settings as any).id);
      if (error) throw error;
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      alert('Error updating settings');
    } finally {
      setLoading(false);
    }
  }

  if (loading && !settings.hero_title) return <div className="p-8">Loading Settings...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 font-sans text-left">
      <h1 className="text-2xl font-bold text-gray-800 mb-8 uppercase tracking-tight">Site Settings</h1>
      
      {message && <div className="bg-green-100 text-green-700 p-4 rounded mb-6 font-bold">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Hero Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-sm font-bold text-[#14532d] uppercase tracking-widest mb-4 border-b pb-2">Hero Section</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hero Title</label>
              <input type="text" className="w-full p-2 border rounded" value={settings.hero_title} onChange={e => setSettings({...settings, hero_title: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hero Subtitle</label>
              <textarea className="w-full p-2 border rounded h-24" value={settings.hero_subtitle} onChange={e => setSettings({...settings, hero_subtitle: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Social & Video */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-sm font-bold text-[#14532d] uppercase tracking-widest mb-4 border-b pb-2">Social & Video</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pinterest URL</label>
              <input type="text" className="w-full p-2 border rounded" value={settings.pinterest_url} onChange={e => setSettings({...settings, pinterest_url: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">YouTube Channel URL</label>
              <input type="text" className="w-full p-2 border rounded" value={settings.youtube_url} onChange={e => setSettings({...settings, youtube_url: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Featured Video ID (YouTube)</label>
              <input type="text" className="w-full p-2 border rounded" placeholder="e.g. dQw4w9WgXcQ" value={settings.featured_video_id} onChange={e => setSettings({...settings, featured_video_id: e.target.value})} />
            </div>
          </div>
        </div>

        {/* ADS & Analytics */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-sm font-bold text-[#14532d] uppercase tracking-widest mb-4 border-b pb-2">Ads & Analytics</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Google Analytics ID</label>
              <input type="text" className="w-full p-2 border rounded" value={settings.ga_id} onChange={e => setSettings({...settings, ga_id: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ad Slot 1 (Top)</label>
              <textarea className="w-full p-2 border rounded h-20 font-mono text-xs" value={settings.ad_slot_1} onChange={e => setSettings({...settings, ad_slot_1: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ad Slot 2 (Middle)</label>
              <textarea className="w-full p-2 border rounded h-20 font-mono text-xs" value={settings.ad_slot_2} onChange={e => setSettings({...settings, ad_slot_2: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ad Slot 3 (Bottom)</label>
              <textarea className="w-full p-2 border rounded h-20 font-mono text-xs" value={settings.ad_slot_3} onChange={e => setSettings({...settings, ad_slot_3: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Legal Sections */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-sm font-bold text-[#14532d] uppercase tracking-widest mb-4 border-b pb-2">Legal Content</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Privacy Policy</label>
              <textarea className="w-full p-2 border rounded h-32" value={settings.privacy_policy} onChange={e => setSettings({...settings, privacy_policy: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Terms of Use</label>
              <textarea className="w-full p-2 border rounded h-32" value={settings.terms_of_use} onChange={e => setSettings({...settings, terms_of_use: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Disclaimer</label>
              <textarea className="w-full p-2 border rounded h-32" value={settings.disclaimer} onChange={e => setSettings({...settings, disclaimer: e.target.value})} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-[#14532d] text-white font-bold py-4 rounded shadow-md hover:bg-green-800 transition uppercase tracking-widest">
          {loading ? 'Saving...' : 'Save All Settings'}
        </button>
      </form>
    </div>
  );
}
