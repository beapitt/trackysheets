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
    async function fetchData() {
      // Carica i settings del sito
      const { data: s } = await supabase.from('settings').select('*').single();
      // Carica solo i template pubblicati, i più recenti per primi
      const { data: t } = await supabase.from('templates')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

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
        <main className="flex-1 p-8 text-left border-r border-gray-50">
          
          {/* Editorial Header (Vertex42 Style) */}
          <section className="mb-12 border-b border-gray-100 pb-10">
            <h1 className="text-3xl font-bold text-[#14532d] mb-6 tracking-tight">
              Spreadsheet Templates, Calculators, and Calendars
            </h1>
            <div className="text-gray-600 text-[16px] leading-relaxed max-w-4xl space-y-4">
              <p>
                <strong>TrackySheets</strong> provides professionally designed <strong>spreadsheet templates</strong> for business, personal, home, and educational use. 
              </p>
              <p>
                Our collection of user-friendly tools includes some of the most powerful and popular trackers you can find. 
                All templates are <strong>optimized for Google Sheets</strong> and available for download.
              </p>
            </div>
          </section>

          {/* Green Bar Title - Stile Manus */}
          <div className="bg-[#1a8856] py-3 px-6 mb-10 rounded shadow-sm">
            <h2 className="text-white text-sm font-black uppercase tracking-[0.25em] m-0">
              Newly Released Templates
            </h2>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {templates.map(item => (
              <Link key={item.id} to={`/template/${item.slug}`} className="group no-underline block">
                <div className="aspect-video bg-gray-50 rounded border border-gray-100 overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <h3 className="mt-5 font-bold text-gray-800 group-hover:text-[#1a8856] transition text-xl leading-tight tracking-tight">
                  {item.title}
                </h3>
                {/* Piccola descrizione preview opzionale */}
                <p className="mt-2 text-gray-500 text-sm line-clamp-2">
                   {item.seo_title || 'Professional Google Sheets template'}
                </p>
              </Link>
            ))}
          </div>
        </main>

        <Sidebar />
      </div>

      <Footer />
      <CookieBanner />
    </div>
  );
}
