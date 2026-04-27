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

  if (loading) return <div className="p-20 text-center font-sans uppercase tracking-[0.2em] text-[10px] font-black">Loading...</div>;
  if (!template) return <div className="p-20 text-center font-sans">Template not found.</div>;

  const gallery = [template.thumbnail, template.img_1, template.img_2, template.img_3].filter(Boolean);

  return (
    <div className="min-h-screen bg-white flex flex-col text-left" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <div className="max-w-7xl mx-auto flex flex-1 w-full border-x border-gray-50 items-start">
        
        <main className="flex-1 p-10 border-r border-gray-50">
          {/* Breadcrumbs */}
          <nav className="flex gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">
            <Link to="/" className="no-underline text-gray-400">Home</Link>
            <span>/</span>
            <span className="text-gray-300">{template.title}</span>
          </nav>

          {/* TITOLO FORZATO: Questo risolverà il problema del font diverso */}
          <h1 
            className="text-5xl font-black text-gray-900 mb-10 tracking-[-0.05em] leading-[0.95]" 
            style={{ 
              fontWeight: 900, 
              fontFamily: "'Inter', sans-serif", // Forzatura assoluta
              letterSpacing: '-0.05em' 
            }}
          >
            {template.title}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
            <div className="lg:col-span-7">
              <div className="aspect-video bg-[#f5f4ed] rounded-xl overflow-hidden border border-gray-100 mb-4">
                <img src={selectedImg || ''} className="w-full h-full object-cover" alt="Preview" />
              </div>
              <div className="flex gap-2">
                {gallery.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(img)} className={`w-20 aspect-video rounded-lg border-2 transition-all ${selectedImg === img ? 'border-[#1F5C3E]' : 'border-transparent opacity-40'}`}>
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-[#f5f4ed] rounded-xl p-6 mb-6 border border-gray-100">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1F5C3E] mb-4">Technical Specifications</h4>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-gray-200/50 pb-2 text-[10px]">
                    <span className="font-bold text-gray-400 uppercase">Software</span>
                    <span className="font-black text-[#1F5C3E]">{template.software || 'Google Sheets'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200/50 pb-2 text-[10px]">
                    <span className="font-bold text-gray-400 uppercase">Difficulty</span>
                    <span className="font-black text-[#1F5C3E]">{template.difficulty || 'Beginner'}</span>
                  </div>
                </div>
              </div>
              <a href={template.download_url} target="_blank" className="flex items-center justify-between w-full bg-[#1F5C3E] text-white px-6 py-5 rounded-xl font-black uppercase text-[11px] tracking-widest no-underline shadow-md hover:bg-[#27500A] transition-all" style={{ backgroundColor: '#1F5C3E', color: 'white' }}>
                <span>Download Template</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* ── SEZIONE DESCRIZIONE COMPLETA (Stile Claude) ── */}
          <div className="max-w-4xl mx-auto py-12">
            <div className="bg-[#f5f4ed] rounded-3xl p-10 border border-gray-100 shadow-sm">
              
              {/* Introduzione con bordo laterale */}
              <div className="border-l-4 border-[#C0DD97] pl-8 mb-12">
                <p className="text-[18px] text-gray-700 leading-relaxed" style={{ fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>
                  {template.short_description}
                </p>
              </div>

              {/* Griglia Feature (3 Colonne) */}
              <div className="mb-16">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1F5C3E] mb-8">What's Included</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {template.features?.map((f: any, i: number) => (
                    <div key={i} className="flex flex-col items-start bg-white/50 p-6 rounded-2xl border border-white">
                      <span className="text-4xl mb-4">{f.icon}</span>
                      <h4 className="text-[14px] font-black text-gray-900 uppercase mb-2 tracking-tight">{f.title}</h4>
                      <p className="text-[12px] text-gray-500 leading-relaxed" style={{ fontWeight: 400 }}>{f.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to use Step Numerati */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1F5C3E] mb-10">How to use</h3>
                <div className="space-y-8">
                  {template.how_to_use?.map((step: string, i: number) => (
                    <div key={i} className="flex gap-6 items-center bg-white/30 p-4 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-[#1F5C3E] text-white flex items-center justify-center shrink-0 font-black text-[12px]">
                        {i + 1}
                      </div>
                      <p className="text-[15px] text-gray-700 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
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
