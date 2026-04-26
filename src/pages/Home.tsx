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
      <div className="mt-2 flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        <span>{template.category}</span>
        <span>•</span>
        <span>Google Sheets</span>
      </div>
    </Link>
  );
}

export default function Home() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplates() {
      const { data } = await supabase
        .from('templates')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(9); // LIMITE PER COERENZA E VELOCITÀ
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
          opacity: 0.4;
        }
      `}</style>

      <Navbar />

      <div className="max-w-7xl mx-auto flex flex-1 w-full border-x border-gray-50 text-left items-start">
        <main className="flex-1 p-8 border-r border-gray-50">
          
          {/* 1. HERO SECTION & SEO */}
          <section className="mb-12">
            <h1 className="text-4xl font-black text-[#14532d] mb-4 tracking-tight leading-tight">
              Free Google Sheets Templates
            </h1>
            <p className="text-gray-400 font-medium text-2xl mb-4 italic">Professional. Simple. Ready to use.</p>
            
            {/* SEO SENTENCE (Suggerimento Claude) */}
            <p className="text-gray-500 text-sm max-w-2xl mb-8 leading-relaxed">
              Explore our library of <b>professional Google Sheets templates</b>. From advanced <b>budgeting tools</b> to <b>business trackers</b>, all our resources are free and optimized for immediate use.
            </p>
            
            <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-8">
              <div className="text-center border-r border-gray-100">
                <span className="block text-3xl font-black text-[#1a8856]">50+</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Templates</span>
              </div>
              <div className="text-center border-r border-gray-100">
                <span className="block text-3xl font-black text-[#1a8856]">100%</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Free</span>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-black text-[#1a8856]">NO</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Sign-up</span>
              </div>
            </div>
          </section>

          {/* 2. FEATURED TEMPLATE */}
          {featuredTemplate && (
            <section className="mb-16">
              <div className="bg-gray-50 rounded-2xl p-1 border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 aspect-video overflow-hidden rounded-xl">
                  <img src={featuredTemplate.thumbnail} className="w-full h-full object-cover" alt="Featured" />
                </div>
                <div className="w-full md:w-1/2 pr-8 p-6 md:p-0">
                  <span className="text-[#1a8856] text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">Featured This Month</span>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{featuredTemplate.title}</h2>
                  <div className="text-gray-600 text-sm mb-6 line-clamp-3" dangerouslySetInnerHTML={{ __html: featuredTemplate.short_description }} />
                  <Link to={`/template/${featuredTemplate.slug}`} className="inline-block text-[#1a8856] font-bold text-sm uppercase tracking-widest border-b-2 border-[#1a8856] pb-1 hover:text-[#14532d] transition-all no-underline">
                    Get Template →
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* 3. RECENT TEMPLATES GRID */}
          <section>
            <div className="bg-[#1a8856] py-3 px-6 mb-10 rounded shadow-sm">
              <h2 className="text-white text-sm font-black uppercase tracking-[0.25em] m-0">
                Newly Released Templates
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {recentTemplates.map(t => (
                <TemplateCard key={t.id} template={t} />
              ))}
            </div>

            {/* VIEW ALL CTA (Suggerimento Claude) */}
            <div className="mt-16 pt-8 border-t border-gray-100 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Showing 8 of 50+ free templates</p>
              <Link to="/templates" className="inline-flex items-center gap-2 border-2 border-[#1a8856] text-[#1a8856] px-10 py-3 rounded-lg font-black uppercase text-xs tracking-widest hover:bg-[#1a8856] hover:text-white transition-all no-underline">
                View All Templates <span>→</span>
              </Link>
            </div>
          </section>

          {/* 4. HOW IT WORKS - NUMERI CONTORNO */}
          <section className="mt-24 pt-12 border-t border-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
              <div>
                <span className="text-6xl font-black outline-number block mb-2 tracking-tighter">01</span>
                <h4 className="font-bold text-gray-800 mb-2 uppercase text-[10px] tracking-widest">Select</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Browse our collection and pick the tool you need.</p>
              </div>
              <div>
                <span className="text-6xl font-black outline-number block mb-2 tracking-tighter">02</span>
                <h4 className="font-bold text-gray-800 mb-2 uppercase text-[10px] tracking-widest">Copy</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Click download to copy the file to your Google Drive.</p>
              </div>
              <div>
                <span className="text-6xl font-black outline-number block mb-2 tracking-tighter">03</span>
                <h4 className="font-bold text-gray-800 mb-2 uppercase text-[10px] tracking-widest">Use</h4>
                <p className="text-sm text-gray-500 leading-relaxed">It's ready! No registration, no macros, 100% safe.</p>
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
