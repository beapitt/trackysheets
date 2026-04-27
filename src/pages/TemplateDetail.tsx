import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import Footer from '../components/Footer';

export default function TemplateDetail() {
  const { slug } = useParams();
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplate() {
      const { data } = await supabase.from('templates').select('*').eq('slug', slug).single();
      if (data) { setTemplate(data); setSelectedImg(data.thumbnail); }
      setLoading(false);
    }
    fetchTemplate();
  }, [slug]);

  if (loading) return <div className="p-20 text-center font-sans font-black uppercase text-[10px]">Loading...</div>;
  if (!template) return <div className="p-20 text-center font-sans">Template not found.</div>;

  const gallery = [template.thumbnail, template.img_1, template.img_2, template.img_3].filter(Boolean);

  return (
    <div className="min-h-screen bg-white flex flex-col text-left" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      
      <div className="max-w-7xl mx-auto flex flex-1 w-full border-x border-gray-50 items-start">
        <main className="flex-1 p-12 border-r border-gray-50">
          
          {/* ── BREADCRUMBS ── */}
          <nav className="flex gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">
            <Link to="/" className="no-underline text-gray-400">Home</Link>
            <span>/</span>
            <span className="text-gray-300">{template.title}</span>
          </nav>

          {/* ── TITOLO: FORZATO INTER BLACK 900 ── */}
          <h1 
            className="text-6xl font-black text-gray-900 mb-12 tracking-[-0.05em] leading-[0.9]"
            style={{ fontWeight: 900, fontFamily: "'Inter', sans-serif" }}
          >
            {template.title}
          </h1>

          {/* ── GALLERY & SPECS SECTION ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
            <div className="lg:col-span-7">
              <div className="aspect-video bg-[#f5f4ed] rounded-[32px] overflow-hidden border border-gray-100 mb-6 shadow-sm">
                <img src={selectedImg || ''} className="w-full h-full object-cover" alt="Preview" />
              </div>
              <div className="flex gap-3">
                {gallery.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(img)} className={`w-24 aspect-video rounded-xl border-2 transition-all overflow-hidden ${selectedImg === img ? 'border-[#1F5C3E]' : 'border-transparent opacity-40'}`}>
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-start">
              <div className="bg-[#f5f4ed] rounded-[32px] p-8 mb-6 border border-gray-50 shadow-sm">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1F5C3E] mb-6">Technical Specifications</h4>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-200/50 pb-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Software</span>
                    <span className="text-[11px] font-black text-[#1F5C3E]">{template.software || 'Google Sheets'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Difficulty</span>
                    <span className="text-[11px] font-black text-[#1F5C3E]">{template.difficulty || 'Beginner'}</span>
                  </div>
                </div>
              </div>
              
              <a 
                href={template.download_url} 
                target="_blank" 
                className="flex items-center justify-between w-full bg-[#1F5C3E] text-white px-8 py-6 rounded-[24px] font-black uppercase text-[12px] tracking-[0.1em] no-underline shadow-xl hover:translate-y-[-2px] transition-all"
                style={{ backgroundColor: '#1F5C3E' }}
              >
                <span>Download Template</span>
                <span className="text-xl">→</span>
              </a>
            </div>
          </div>

          {/* ── LONG DESCRIPTION (CLAUDE STYLE) ── */}
          <div className="max-w-3xl">
            
            {/* 1. Intro Hook (No Italic, Light Weight) */}
            <div className="border-l-[3px] border-[#C0DD97] pl-10 mb-20 mt-10">
              <p 
                className="text-[22px] text-gray-600 leading-[1.6]" 
                style={{ fontWeight: 300, fontFamily: "'Inter', sans-serif" }}
              >
                {template.short_description}
              </p>
            </div>

            {/* 2. Feature Grid (3 Columns, Naked Icons) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-28">
              {template.features?.map((f: any, i: number) => (
                <div key={i} className="flex flex-col items-start">
                  <span className="text-5xl mb-6 grayscale-[0.2]">{f.icon}</span>
                  <h4 className="text-[14px] font-black text-gray-900 uppercase mb-3 tracking-tight" style={{ fontWeight: 900 }}>{f.title}</h4>
                  <p className="text-[13px] text-gray-500 leading-relaxed" style={{ fontWeight: 400 }}>{f.description}</p>
                </div>
              ))}
            </div>

            {/* 3. How to Use (Elegant Cream Box) */}
            <div className="bg-[#f5f4ed] rounded-[48px] p-16 mb-20 border border-gray-100/50">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-14 text-center">How to use this template</h3>
              <div className="space-y-12">
                {template.how_to_use?.map((step: string, i: number) => (
                  <div key={i} className="flex gap-10 items-start group">
                    <div className="w-10 h-10 rounded-full bg-[#1F5C3E] text-white flex items-center justify-center shrink-0 font-black text-[14px] shadow-lg shadow-green-900/10">
                      {i + 1}
                    </div>
                    <div className="pt-2">
                       <p className="text-[16px] text-gray-700 leading-relaxed" style={{ fontWeight: 400 }}>{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>

        <Sidebar />
      </div>
      <Footer />
    </div>
  );
}
