import '../index.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import Footer from '../components/Footer';
import CookieBanner from '../components/CookieBanner';

export default function Home() {
  const [settings, setSettings] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: s } = await supabase.from('settings').select('*').limit(1).single();
        if (s) setSettings(s);
        
        const { data: t } = await supabase.from('templates').select('*').eq('status', 'published').order('created_at', { ascending: false });
        if (t) setTemplates(t);
      } catch (err) {
        console.error('Error fetching Home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
      <div className="text-gray-400 italic">Loading TrackySheets...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans flex flex-col">
      <Navbar />
      
      {/* Container Centrale */}
      <div className="max-w-7xl mx-auto flex flex-1 w-full">
        
        {/* MAIN CONTENT - Ora a SINISTRA */}
        <main className="flex-1 p-8 bg-white shadow-inner text-left">
          
          {/* Spazio Ad Slot 1 (si vede solo se compilato su Supabase) */}
          {settings?.ad_slot_1 && (
            <div className="bg-gray-50 border border-dashed border-gray-300 p-4 mb-8 text-center text-[11px] text-gray-400 uppercase tracking-widest">
              {settings.ad_slot_1}
            </div>
          )}

          {/* Hero Section */}
          <section className="mb-12 border-b border-gray-100 pb-8">
            <h1 className="text-[32px] font-bold text-[#14532d] leading-tight mb-4">
              {settings?.hero_title || 'Professional Spreadsheet Templates'}
            </h1>
            <p className="text-[#1a8856] text-[11px] font-bold uppercase tracking-[0.2em] mb-6">
              Free Google Sheets Tools & Planners
            </p>
            
            <div className="text-gray-700 text-[15px] space-y-4 leading-relaxed max-w-4xl">
              <p className="font-medium text-gray-900">
                {settings?.hero_subtitle}
              </p>
              <p>
                Every tool in our library is built to be powerful, user-friendly, and <strong>100% free to download</strong>. 
                Whether you need a complex rental property analyzer or a simple monthly budget, our templates are 
                fully optimized for <strong>Google Sheets</strong>.
              </p>
            </div>

            {/* Social Follow */}
            <div className="flex items-center gap-4 mt-8 pt-4 border-t border-gray-50">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Follow Us:</span>
              {settings?.pinterest_url && (
                <a href={settings.pinterest_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition text-lg no-underline">📌</a>
              )}
              {settings?.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition text-lg no-underline">▶️</a>
              )}
            </div>
          </section>

          {/* Templates Section Header */}
          <div className="bg-[#14532d] text-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] mb-8">
            All Templates
          </div>

          {/* Griglia Template */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {templates.map(item => (
              <Link key={item.id} to={`/template/${item.slug}`} className="group no-underline block">
                <div className="aspect-video bg-gray-100 rounded-sm overflow-hidden border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow">
                  {item.thumbnail ? (
                    <img 
                      src={item.thumbnail} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold uppercase text-[10px]">No Preview</div>
                  )}
                </div>
                <h3 className="mt-4 font-bold text-gray-800 group-hover:text-[#1a8856] transition text-[16px] leading-snug">
                  {item.title}
                </h3>
                <div className="mt-1 text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                  Category: {item.category}
                </div>
              </Link>
            ))}
          </div>

          {/* Ad Slot 3 */}
          {settings?.ad_slot_3 && (
            <div className="bg-gray-50 border border-dashed border-gray-300 p-8 mt-16 text-center text-[11px] text-gray-400 uppercase tracking-widest">
              {settings.ad_slot_3}
            </div>
          )}
        </main>

        {/* SIDEBAR - Ora a DESTRA */}
        <Sidebar />
      </div>

      <Footer />
      <CookieBanner />
    </div>
  );
}
