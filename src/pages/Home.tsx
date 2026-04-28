import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import Footer from '../components/Footer';

function TemplateCard({ template }: { template: any }) {
  return (
    <Link key={template.id} to={`/template/${template.slug}`} className="group no-underline block">
      <div className="aspect-video bg-gray-50 rounded-xl border border-gray-100 overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300">
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

      {/* PORTATO A 1440PX PER ALLINEARSI ALLA NAVBAR */}
      <div className="max-w-[1440px] mx-auto flex flex-1 w-full text-left items-start px-6 md:px-10">
        <main className="flex-1 py-10 pr-12">
          
          {/* 1. HERO SECTION */}
          <section className="mb-16">
            <h1 className="text-5xl font-black text-[#1F5C3E] mb-4 tracking-tighter leading-tight">
              Free Google Sheets <br/> Templates
            </h1>
            <p className="text-gray-400 text-2xl mb-10 font-medium tracking-tight">Professional. Simple. Ready to use.</p>
            
            {/* STAT CARDS */}
            <div className="grid grid-cols-3 gap-6 mb-12">
              <div className="bg-[#EAF3DE] rounded-2xl p-8 text-center shadow-sm border border-[#dce9c9]">
                <span className="block text-4xl font-black text-[#27500A]">50+</span>
                <span className="text-[10px] uppercase tracking-widest text-[#3B6D11] font-bold">Templates</span>
              </div>
              <div className="bg-[#EAF3DE] rounded-2xl p-8 text-center shadow-sm border border-[#dce9c9]">
                <span className="block text-4xl font-black text-[#27500A]">100%</span>
                <span className="text-[10px] uppercase tracking-widest text-[#3B6D11] font-bold">Free Access</span>
              </div>
              <div className="bg-[#EAF3DE] rounded-2xl p-8 text-center shadow-sm border border-[#dce9c9]">
                <span className="block text-4xl font-black text-[#27500A]">0</span>
                <span className="text-[10px] uppercase tracking-widest text-[#3B6D11] font-bold">No Login</span>
              </div>
            </div>

            <div className="border-l-4 border-[#C0DD97] pl-8 py-2 mb-16">
               <p className="text-gray-500 text-base max-w-2xl leading-relaxed italic">
                Explore our library of <b>professional Google Sheets templates</b>. From advanced <b>budgeting tools</b> to <b>business trackers</b>, all our resources are free and optimized for immediate use.
              </p>
            </div>
          </section>

          {/* 2. FEATURED BOX */}
          {featuredTemplate && (
            <section className="mb-24">
              <div className="bg-gray-50 rounded-[32px] p-2 border border-gray-100 flex flex-col md:flex-row gap-10 items-center overflow-hidden shadow-sm">
                <div className="w-full md:w-1/2 aspect-video overflow-hidden rounded-[24px]">
                  <img src={featuredTemplate.thumbnail} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Featured" />
                </div>
                <div className="w-full md:w-1/2 p-8 pr-12 text-left">
                  <div className="bg-[#EAF3DE] text-[#27500A] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full inline-block mb-4">Featured Template</div>
                  <h2 className="text-3xl font-black mb-6 text-gray-900 leading-tight">{featuredTemplate.title}</h2>
                  <Link to={`/template/${featuredTemplate.slug}`} className="inline-block bg-[#1F5C3E] text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl no-underline hover:bg-black transition-all shadow-lg">Get Template →</Link>
                </div>
              </div>
            </section>
          )}

          {/* 3. NEWLY RELEASED */}
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black text-gray-900 m-0 uppercase tracking-tight">Newly released</h2>
                <span className="bg-[#1F5C3E] text-white text-[10px] font-bold px-3 py-1 rounded-full">NEW</span>
              </div>
              <Link to="/templates" className="text-[#1F5C3E] text-sm font-bold no-underline hover:underline tracking-widest uppercase">View all →</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {recentTemplates.map(t => <TemplateCard key={t.id} template={t} />)}
            </div>
          </section>

          {/* 4. HOW IT WORKS */}
          <div className="relative mt-32 mb-16">
            <hr className="border-gray-100" />
            <span className="absolute top-1/2 left-0 bg-white pr-6 -translate-y-1/2 text-[11px] font-black uppercase tracking-[0.3em] text-gray-300">How it works</span>
          </div>

          <section className="pb-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
              <div>
                <span className="text-7xl font-black outline-number block mb-4 opacity-20 text-[#1F5C3E]">01</span>
                <h4 className="font-bold text-gray-900 mb-3 uppercase text-[11px] tracking-widest">Select</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">Pick a professional tool from our library of 50+ templates.</p>
              </div>
              <div>
                <span className="text-7xl font-black outline-number block mb-4 opacity-20 text-[#1F5C3E]">02</span>
                <h4 className="font-bold text-gray-900 mb-3 uppercase text-[11px] tracking-widest">Copy</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">One click to save a private copy directly to your Google Drive.</p>
              </div>
              <div>
                <span className="text-7xl font-black outline-number block mb-4 opacity-20 text-[#1F5C3E]">03</span>
                <h4 className="font-bold text-gray-900 mb-3 uppercase text-[11px] tracking-widest">Use</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">Immediate access. No hidden fees. No login required ever.</p>
              </div>
            </div>
          </section>

        </main>

        {/* SIDEBAR ALLINEATA */}
        <aside className="w-[280px] sticky top-24 pt-10">
          <Sidebar />
        </aside>
      </div>
      <Footer />
    </div>
  );
}
