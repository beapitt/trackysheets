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
      <h3 className="mt-5 font-bold text-gray-800 group-hover:text-[#1F5C3E] transition text-xl leading-tight tracking-tight">
        {template.title}
      </h3>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{template.category || 'Google Sheets'}</span>
      </div>
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
          -webkit-text-stroke: 1.5px #1F5C3E;
        }
      `}</style>

      <Navbar />

      <div className="max-w-7xl mx-auto flex flex-1 w-full border-x border-gray-50 text-left items-start">
        <main className="flex-1 p-8 border-r border-gray-50">
          
          {/* 1. HERO SECTION */}
          <section className="mb-12">
            <h1 className="text-4xl font-black text-[#1F5C3E] mb-4 tracking-tight">Free Google Sheets Templates</h1>
            <p className="text-gray-400 text-2xl mb-8 font-medium">Professional. Simple. Ready to use.</p>
            
            {/* STAT CARDS (Claude Style) */}
            <div className="grid grid-cols-3 gap-6 mb-8">
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

            {/* SEO SENTENCE (Spostata dopo le stats come indicato da Claude) */}
            <div className="border-left-2 border-[#C0DD97] pl-4 border-l-2 py-1 mb-12">
               <p className="text-gray-500 text-sm max-w-2xl leading-relaxed">
                Explore our library of <b>professional Google Sheets templates</b>. From advanced <b>budgeting tools</b> to <b>business trackers</b>, all our resources are free and optimized for immediate use.
              </p>
            </div>
          </section>

          {/* 2. FEATURED BOX */}
          {featuredTemplate && (
            <section className="mb-20">
              <div className="bg-gray-50 rounded-2xl p-1 border border-gray-100 flex flex-col md:flex-row gap-8 items-center overflow-hidden">
                <div className="w-full md:w-1/2 aspect-video overflow-hidden rounded-xl">
                  <img src={featuredTemplate.thumbnail} className="w-full h-full object-cover" alt="Featured" />
                </div>
                <div className="w-full md:w-1/2 p-6 md:p-0 pr-8 text-left">
                  <div className="bg-[#EAF3DE] text-[#27500A] text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded inline-block mb-3">Featured Template</div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900">{featuredTemplate.title}</h2>
                  <Link to={`/template/${featuredTemplate.slug}`} className="inline-block text-[#27500A] font-bold text-sm uppercase tracking-widest border-b-2 border-[#1F5C3E] pb-1 no-underline hover:text-[#1F5C3E] transition-colors">Get Template →</Link>
                </div>
              </div>
            </section>
          )}

          {/* 3. NEWLY RELEASED HEADER (Nuovo Stile senza striscia verde) */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-800 m-0">Newly released</h2>
                <span className="bg-[#EAF3DE] text-[#27500A] text-[9px] font-bold px-2 py-0.5 rounded">NEW</span>
              </div>
              <Link to="/templates" className="text-[#1F5C3E] text-sm font-bold no-underline hover:underline">View all →</Link>
            </div>
            <hr className="border-gray-100 mb-10" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {recentTemplates.map(t => <TemplateCard key={t.id} template={t} />)}
            </div>
            
            {/* VIEW ALL CTA */}
            <div className="mt-16 text-center border-t border-gray-100 pt-10">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Showing 8 of 50+ templates</p>
              <Link to="/templates" className="inline-flex items-center gap-2 border-2 border-[#1F5C3E] text-[#1F5C3E] px-10 py-3 rounded font-black uppercase text-xs no-underline hover:bg-[#1F5C3E] hover:text-white transition-all">Explore all templates →</Link>
            </div>
          </section>

          {/* 4. HOW IT WORKS */}
          <div className="relative mt-28 mb-16">
            <hr className="border-gray-100" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[10px] font-black uppercase tracking-widest text-gray-300">How it works</span>
          </div>

          <section className="pb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
              <div>
                <span className="text-6xl font-black outline-number block mb-2 opacity-40">01</span>
                <h4 className="font-bold text-gray-800 mb-2 uppercase text-[10px] tracking-widest">Select</h4>
                <p className="text-sm text-gray-500">Pick a professional tool from our library.</p>
              </div>
              <div>
                <span className="text-6xl font-black outline-number block mb-2 opacity-40">02</span>
                <h4 className="font-bold text-gray-800 mb-2 uppercase text-[10px] tracking-widest">Copy</h4>
                <p className="text-sm text-gray-500">One click to save the file to your Google Drive.</p>
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
