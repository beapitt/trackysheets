import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import Footer from '../components/Footer';

function TemplateCard({ template }: { template: any }) {
  return (
    <Link key={template.id} to={`/template/${template.slug}`} className="group no-underline block">
      <div className="aspect-video bg-gray-50 rounded border border-gray-100 overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300">
        <img src={template.thumbnail} alt={template.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <h3 className="mt-5 font-bold text-gray-800 group-hover:text-[#1a8856] transition text-xl leading-tight tracking-tight">
        {template.title}
      </h3>
      <p className="mt-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest italic">{template.category || 'Google Sheets'}</p>
    </Link>
  );
}

export default function Home() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplates() {
      const { data } = await supabase.from('templates').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(9);
      if (data) setTemplates(data);
      setLoading(false);
    }
    fetchTemplates();
  }, []);

  const featuredTemplate = templates[0];
  const recentTemplates = templates.slice(1);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <style>{`
        .outline-number {
          color: transparent;
          -webkit-text-stroke: 1.5px #1a8856;
        }
      `}</style>

      <Navbar />

      <div className="max-w-7xl mx-auto flex flex-1 w-full border-x border-gray-50 text-left items-start">
        <main className="flex-1 p-8 border-r border-gray-50">
          
          {/* HERO & STAT CARDS (Claude Style) */}
          <section className="mb-12">
            <h1 className="text-4xl font-black text-[#14532d] mb-4 tracking-tight">Free Google Sheets Templates</h1>
            <p className="text-gray-400 text-2xl mb-8">Professional. Simple. Ready to use.</p>
            
            <div className="grid grid-cols-3 gap-6 mb-12">
              <div className="bg-[#EAF3DE] rounded-lg p-6 text-center shadow-sm">
                <span className="block text-3xl font-black text-[#27500A]">50+</span>
                <span className="text-[9px] uppercase tracking-widest text-[#3B6D11] font-bold">Templates</span>
              </div>
              <div className="bg-[#EAF3DE] rounded-lg p-6 text-center shadow-sm">
                <span className="block text-3xl font-black text-[#27500A]">100%</span>
                <span className="text-[9px] uppercase tracking-widest text-[#3B6D11] font-bold">Free Access</span>
              </div>
              <div className="bg-[#EAF3DE] rounded-lg p-6 text-center shadow-sm">
                <span className="block text-3xl font-black text-[#27500A]">0</span>
                <span className="text-[9px] uppercase tracking-widest text-[#3B6D11] font-bold">Login Required</span>
              </div>
            </div>
          </section>

          {/* FEATURED BOX */}
          {featuredTemplate && (
            <section className="mb-16">
              <div className="bg-gray-50 rounded-2xl p-1 border border-gray-100 flex flex-col md:flex-row gap-8 items-center overflow-hidden">
                <div className="w-full md:w-1/2 aspect-video overflow-hidden rounded-xl">
                  <img src={featuredTemplate.thumbnail} className="w-full h-full object-cover" alt="Featured" />
                </div>
                <div className="w-full md:w-1/2 p-6 md:p-0 pr-8">
                  <span className="text-[#1a8856] text-[10px] font-black uppercase tracking-widest mb-2 block">Featured Template</span>
                  <h2 className="text-2xl font-bold mb-4">{featuredTemplate.title}</h2>
                  <Link to={`/template/${featuredTemplate.slug}`} className="inline-block text-[#1a8856] font-bold text-sm uppercase tracking-widest border-b-2 border-[#1a8856] pb-1 no-underline">Get Template →</Link>
                </div>
              </div>
            </section>
          )}

          {/* GRID */}
          <section className="mb-12">
            <div className="bg-[#1a8856] py-3 px-6 mb-10 rounded shadow-sm">
              <h2 className="text-white text-sm font-black uppercase tracking-[0.25em] m-0">Newly Released Templates</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {recentTemplates.map(t => <TemplateCard key={t.id} template={t} />)}
            </div>
            
            {/* VIEW ALL CTA */}
            <div className="mt-12 text-center border-t border-gray-100 pt-10">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Showing 8 of 50+ templates</p>
              <Link to="/templates" className="inline-flex items-center gap-2 border-2 border-[#1a8856] text-[#1a8856] px-10 py-3 rounded font-black uppercase text-xs no-underline hover:bg-[#1a8856] hover:text-white transition-all">View All Templates →</Link>
            </div>
          </section>

          {/* TRANSITION LINE & HOW IT WORKS */}
          <div className="relative mt-24 mb-16">
            <hr className="border-gray-100" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[10px] font-black uppercase tracking-widest text-gray-300">How it works</span>
          </div>

          <section className="pb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <span className="text-6xl font-black outline-number block mb-2 opacity-40">01</span>
                <h4 className="font-bold text-gray-800 mb-2 uppercase text-[10px] tracking-widest">Select</h4>
                <p className="text-sm text-gray-500">Pick a professional tool from our curated library.</p>
              </div>
              <div>
                <span className="text-6xl font-black outline-number block mb-2 opacity-40">02</span>
                <h4 className="font-bold text-gray-800 mb-2 uppercase text-[10px] tracking-widest">Copy</h4>
                <p className="text-sm text-gray-500">Click to save the file directly to your Google Drive.</p>
              </div>
              <div>
                <span className="text-6xl font-black outline-number block mb-2 opacity-40">03</span>
                <h4 className="font-bold text-gray-800 mb-2 uppercase text-[10px] tracking-widest">Use</h4>
                <p className="text-sm text-gray-500">Immediate access. No login. 100% Free.</p>
              </div>
            </div>
          </section>

        </main>
        <Sidebar />
      </div>
      <Footer />
    </div>
  );
}
