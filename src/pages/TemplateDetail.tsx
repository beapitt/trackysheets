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
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('slug', slug)
        .single();

      if (data) {
        setTemplate(data);
        setSelectedImg(data.thumbnail);
      }
      setLoading(false);
    }
    fetchTemplate();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!template) return <div className="min-h-screen flex items-center justify-center">Template not found.</div>;

  // Uniamo le tue immagini esistenti in un array per la galleria
  const gallery = [template.thumbnail, template.img_1, template.img_2, template.img_3].filter(Boolean);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto flex flex-1 w-full border-x border-gray-50 text-left items-start">
        <main className="flex-1 p-8 border-r border-gray-50">
          
          {/* HEADER PRODOTTO */}
          <div className="mb-8">
            <nav className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex gap-2">
              <Link to="/" className="hover:text-[#1F5C3E]">Home</Link>
              <span>/</span>
              <span className="text-gray-300">{template.title}</span>
            </nav>
            <h1 className="text-3xl font-black text-gray-900 leading-tight mb-2">{template.title}</h1>
          </div>

          {/* SEZIONE TOP: Immagine e Box Dati Tecnici */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            
            {/* Galleria Immagini (8 Colonne) */}
            <div className="lg:col-span-8">
              <div className="aspect-video bg-gray-50 rounded-xl overflow-hidden border border-gray-100 mb-4 cursor-zoom-in group relative" onClick={() => window.open(selectedImg || '', '_blank')}>
                <img src={selectedImg || ''} className="w-full h-full object-cover" alt={template.title} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all flex items-center justify-center">
                   <span className="bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm text-xs font-bold">🔍 Click to zoom</span>
                </div>
              </div>
              
              <div className="flex gap-3 overflow-x-auto pb-2">
                {gallery.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedImg(img)}
                    className={`w-20 aspect-video rounded border-2 transition-all overflow-hidden shrink-0 ${selectedImg === img ? 'border-[#1F5C3E]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Dati Tecnici & Download (4 Colonne) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-[#EAF3DE] rounded-xl p-6 border border-[#C0DD97]/30">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#27500A] mb-4">Technical Specs</h4>
                <ul className="space-y-4 m-0 p-0 list-none">
                  <li className="flex justify-between border-b border-[#27500A]/5 pb-2">
                    <span className="text-[11px] font-bold text-gray-500 uppercase">Software</span>
                    <span className="text-[11px] font-black text-[#1F5C3E]">{template.software || 'Google Sheets'}</span>
                  </li>
                  <li className="flex justify-between border-b border-[#27500A]/5 pb-2">
                    <span className="text-[11px] font-bold text-gray-500 uppercase">Difficulty</span>
                    <span className="text-[11px] font-black text-[#1F5C3E]">{template.difficulty || 'Beginner'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-[11px] font-bold text-gray-500 uppercase">License</span>
                    <span className="text-[11px] font-black text-[#1F5C3E]">{template.license || 'Free'}</span>
                  </li>
                </ul>
              </div>

              <a 
                href={template.download_url} 
                target="_blank" 
                rel="noreferrer"
                className="w-full bg-[#1F5C3E] text-white py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-lg hover:bg-[#27500A] transition-all text-center no-underline"
              >
                Get Template →
              </a>
              
              {template.suitability && (
                <div className="p-4 border-l-2 border-[#C0DD97]">
                  <h5 className="text-[10px] font-black uppercase text-gray-400 mb-2">Best for:</h5>
                  <p className="text-xs text-gray-500 leading-relaxed italic">{template.suitability}</p>
                </div>
              )}
            </div>
          </div>

          {/* DESCRIZIONE E CARATTERISTICHE */}
          <section className="border-t border-gray-100 pt-12">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold mb-6">Description</h2>
              <div className="prose prose-sm text-gray-600 mb-12">
                {template.description}
              </div>

              {/* Box Caratteristiche (Features) */}
              {template.features && Array.isArray(template.features) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {template.features.map((f: any, i: number) => (
                    <div key={i} className="p-5 rounded-xl border border-gray-100 bg-gray-50">
                      <span className="text-2xl mb-3 block">{f.icon}</span>
                      <h4 className="font-bold text-gray-900 mb-1 text-sm">{f.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{f.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Guida all'uso (How to use) */}
              {template.how_to_use && Array.isArray(template.how_to_use) && (
                <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#EAF3DE] text-[#1F5C3E] rounded-full flex items-center justify-center text-[10px]">?</span>
                    How to use this template
                  </h3>
                  <div className="space-y-6">
                    {template.how_to_use.map((step: string, i: number) => (
                      <div key={i} className="flex gap-4">
                        <span className="font-black text-[#C0DD97] text-xl">0{i+1}</span>
                        <p className="text-sm text-gray-600 pt-1 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>

        <Sidebar videoId={template.video_id} />
      </div>
      <Footer />
    </div>
  );
}
