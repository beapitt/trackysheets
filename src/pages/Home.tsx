import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import Footer from '../components/Footer';
import TemplateCard from '../components/TemplateCard';

export default function Home() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplates() {
      const { data } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setTemplates(data);
      setLoading(false);
    }
    fetchTemplates();
  }, []);

  const featuredTemplate = templates[0]; // Il più recente diventa il "Featured"
  const recentTemplates = templates.slice(1); // Gli altri vanno nella griglia

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto flex flex-1 w-full border-x border-gray-50 text-left items-start">
        <main className="flex-1 p-8">
          
          {/* 1. HERO STATS SECTION */}
          <section className="mb-12">
            <h1 className="text-4xl font-black text-[#14532d] mb-6 tracking-tight">
              Free Google Sheets Templates <br/>
              <span className="text-gray-400 font-medium text-2xl">Professional. Simple. Ready to use.</span>
            </h1>
            
            <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-6">
              <div className="text-center border-r border-gray-100">
                <span className="block text-2xl font-black text-[#1a8856]">50+</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Templates</span>
              </div>
              <div className="text-center border-r border-gray-100">
                <span className="block text-2xl font-black text-[#1a8856]">100%</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Free Access</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-black text-[#1a8856]">NO</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Registration</span>
              </div>
            </div>
          </section>

          {/* 2. FEATURED TEMPLATE (WIDE CARD) */}
          {featuredTemplate && (
            <section className="mb-16">
              <div className="bg-gray-50 rounded-2xl p-1 border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 aspect-video overflow-hidden rounded-xl">
                  <img src={featuredTemplate.thumbnail} className="w-full h-full object-cover" alt="Featured" />
                </div>
                <div className="w-full md:w-1/2 pr-8 pb-4 md:pb-0">
                  <span className="text-[#1a8856] text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">Featured Template</span>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{featuredTemplate.title}</h2>
                  <div 
                    className="text-gray-600 text-sm mb-6 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: featuredTemplate.short_description }}
                  />
                  <a href={`/template/${featuredTemplate.slug}`} className="text-[#1a8856] font-bold text-sm uppercase tracking-widest border-b-2 border-[#1a8856] pb-1 hover:text-[#14532d] transition-all">
                    Get this template →
                  </a>
                </div>
              </div>
            </section>
          )}

          {/* 3. RECENT TEMPLATES GRID */}
          <section>
            <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-900">Latest Releases</h3>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">New updates every week</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="h-64 bg-gray-50 animate-pulse rounded-xl"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {recentTemplates.map(t => (
                  <TemplateCard key={t.id} template={t} />
                ))}
              </div>
            )}
          </section>

          {/* 4. HOW IT WORKS (Claude Suggestion) */}
          <section className="mt-20 pt-12 border-t border-gray-50">
            <div className="grid grid-cols-3 gap-8">
              <div className="text-left">
                <span className="text-3xl font-black text-gray-100 block mb-2">01</span>
                <h4 className="font-bold text-gray-800 mb-2">Choose</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Select a professional template from our curated library.</p>
              </div>
              <div className="text-left">
                <span className="text-3xl font-black text-gray-100 block mb-2">02</span>
                <h4 className="font-bold text-gray-800 mb-2">Copy</h4>
                <p className="text-xs text-gray-500 leading-relaxed">One click to copy the file directly to your Google Drive.</p>
              </div>
              <div className="text-left">
                <span className="text-3xl font-black text-gray-100 block mb-2">03</span>
                <h4 className="font-bold text-gray-800 mb-2">Personalize</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Start using it immediately with your own data. For free.</p>
              </div>
            </div>
          </section>

        </main>

        {/* Right Sidebar remains consistent */}
        <Sidebar />
      </div>

      <Footer />
    </div>
  );
}
