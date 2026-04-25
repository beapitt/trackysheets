import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import Footer from '../components/Footer';

export default function Home() {
  const [settings, setSettings] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: s } = await supabase.from('settings').select('*').single();
      const { data: t } = await supabase.from('templates').select('*').eq('status', 'published').order('created_at', { ascending: false });
      if (s) setSettings(s);
      if (t) setTemplates(t);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-20 text-center font-sans italic text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto flex flex-1 w-full border-x border-gray-50">
        <main className="flex-1 p-8 text-left">
          
          {/* Ad Slot Top */}
          {settings?.ad_slot_1 && (
            <div className="mb-8 flex justify-center" dangerouslySetInnerHTML={{ __html: settings.ad_slot_1 }} />
          )}

          {/* Hero Section - Senza Uppercase forzato */}
          <section className="mb-12">
            <h1 className="text-3xl font-bold text-[#14532d] mb-4 tracking-tight leading-tight">
              {settings?.hero_title || 'Professional Google Sheets Templates'}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
              {settings?.hero_subtitle}
            </p>
          </section>

          {/* Grid Header */}
          <div className="border-b-2 border-[#14532d] mb-8">
            <span className="bg-[#14532d] text-white px-4 py-1 text-[11px] font-bold uppercase tracking-widest inline-block">
              Latest Templates
            </span>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {templates.map(item => (
              <Link key={item.id} to={`/template/${item.slug}`} className="group no-underline block">
                <div className="aspect-video bg-gray-50 rounded border border-gray-100 overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="mt-4 font-bold text-gray-800 group-hover:text-[#1a8856] transition text-lg">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2 leading-relaxed">
                  {item.short_description}
                </p>
              </Link>
            ))}
          </div>

          {/* Ad Slot Bottom */}
          {settings?.ad_slot_3 && (
            <div className="mt-16 pt-8 border-t border-gray-50 flex justify-center" dangerouslySetInnerHTML={{ __html: settings.ad_slot_3 }} />
          )}
        </main>

        <Sidebar />
      </div>

      <Footer />
    </div>
  );
}
