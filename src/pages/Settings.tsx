import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState({
    id: null,
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
      // Usiamo .select('*') per essere certi di prendere l'ID e tutti i campi
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
      // Creiamo un oggetto pulito da inviare, assicurandoci che i nomi coincidano con Supabase
      const updateData = {
        hero_title: settings.hero_title,
        hero_subtitle: settings.hero_subtitle,
        pinterest_url: settings.pinterest_url,
        youtube_url: settings.youtube_url,
        featured_video_id: settings.featured_video_id,
        ga_id: settings.ga_id,
        ad_slot_1: settings.ad_slot_1,
        ad_slot_2: settings.ad_slot_2,
        ad_slot_3: settings.ad_slot_3,
        privacy_policy: settings.privacy_policy,
        terms_of_use: settings.terms_of_use, // Nome esatto confermato da te
        disclaimer: settings.disclaimer
      };

      const { error } = await supabase
        .from('settings')
        .update(updateData)
        .eq('id', settings.id);

      if (error) throw error;

      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Update error:', error);
      alert('Error updating settings. Check console for details.');
    } finally {
      setLoading(false);
    }
  }

  if (loading && !settings.id) return <div className="p-8 font-inter font-bold text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 font-inter text-left">
      <h1 className="text-2xl font-bold text-gray-800 mb-8 uppercase tracking-tight">Site Settings</h1>
      
      {message && <div className="bg-green-100 text-[#1F5C3E] p-4 rounded-xl mb-6 font-bold shadow-sm">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Usiamo la stessa struttura che hai già, ma con i nomi corretti */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xs font-black text-[#1F5C3E] uppercase tracking-[0.2em] mb-4 border-b pb-2">Legal Content</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Privacy Policy</label>
              <textarea className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 h-32 font-medium" 
                value={settings.privacy_policy || ''} 
                onChange={e => setSettings({...settings, privacy_policy: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Terms of Use</label>
              <textarea className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 h-32 font-medium" 
                value={settings.terms_of_use || ''} 
                onChange={e => setSettings({...settings, terms_of_use: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Disclaimer</label>
              <textarea className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 h-32 font-medium" 
                value={settings.disclaimer || ''} 
                onChange={e => setSettings({...settings, disclaimer: e.target.value})} 
              />
            </div>
          </div>
        </div>

        {/* ... Altre sezioni (Hero, Social etc) rimangono uguali ... */}
        
        <button type="submit" disabled={loading} className="w-full bg-[#1F5C3E] text-white font-bold py-5 rounded-2xl shadow-lg hover:bg-black transition-all uppercase tracking-widest">
          {loading ? 'Saving...' : 'Save All Settings'}
        </button>
      </form>
    </div>
  );
}
