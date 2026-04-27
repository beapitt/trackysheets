import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import Footer from '../components/Footer';

// Icona Google Drive originale (SVG)
const GoogleDriveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 87.3 78" className="mr-2">
    <path fill="#0066DA" d="M6.6 66.8l13.4-23.1H74L60.6 66.8z"/>
    <path fill="#00832D" d="M13.4 20.7l13.4 23.1L6.6 66.8 0 55.4z"/>
    <path fill="#FFBA00" d="M26.8 43.8L40.2 20.7 53.6 43.8z"/>
    <path fill="#0066DA" d="M40.2 20.7L53.6 43.8 80.6 43.8 67.2 20.7z"/>
    <path fill="#EA4335" d="M26.8 43.8L13.4 20.7 40.2 20.7z"/>
    <path fill="#00832D" d="M53.6 43.8L67.2 20.7 87.3 55.4 74 78z"/>
  </svg>
);

export default function TemplateDetail() {
  const { slug } = useParams();
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplate() {
      const { data } = await supabase.from('templates').select('*').eq('slug', slug).single();
      if (data) {
        setTemplate(data);
        setSelectedImg(data.thumbnail);
      }
      setLoading(false);
    }
    fetchTemplate();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-sans">Loading...</div>;
  if (!template) return <div className="min-h-screen flex items-center justify-center font-sans">Not found.</div>;

  const gallery = [template.thumbnail, template.img_1, template.img_2, template.img_3].filter(Boolean);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto flex flex-1 w-full border-x border-gray-50 items-start">
        <main className="flex-1 p-8 border-r border-gray-50 text-left">
          
          <nav className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6 flex gap-2">
            <Link to="/" className="hover:text-[#1F5C3E] no-underline">Home</Link>
            <span>/</span>
            <span className="text-gray-300">{template.title}</span>
          </nav>

          <h1 className="text-3xl font-black text-gray-900 mb-10 tracking-tight">{template.title}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
            {/* Gallery */}
            <div className="lg:col-span-7">
              <div 
                className="aspect-video bg-gray-50 rounded-lg overflow-hidden border border-gray-100 mb-4 cursor-zoom-in group relative"
                onClick={() => window.open(selectedImg || '', '_blank')}
              >
                <img src={selectedImg || ''} className="w-full h-full object-cover" alt="Preview" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all flex items-center justify-center">
                   <span className="bg-white/90 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm text-[10px] font-black uppercase tracking-widest">🔍 View Full Image</span>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {gallery.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(img)} className={`w-20 aspect-video rounded border-2 transition-all overflow-hidden shrink-0 ${selectedImg === img ? 'border-[#1F5C3E]' : 'border-transparent opacity-50'}`}>
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar Dati & Download */}
            <div className="lg:col-span-5">
              <div className="bg-[#EAF3DE] rounded-lg border border-[#C0DD97]/20 p-5 mb-6">
                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#27500A] mb-4">Template Specifications</h4>
                <div className="space-y-3">
                  {[
                    { label: "Software", value: template.software || "Google Sheets" },
                    { label: "Difficulty", value: template.difficulty || "Beginner" },
                    { label: "License", value: template.license || "Free Personal Use" }
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-[#27500A]/5 last:border-0">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{item.label}</span>
                      <span className="text-[11px] font-black text-[#1F5C3E]">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a 
                href={template.download_url} 
                target="_blank" 
                className="flex items-center justify-center w-full bg-[#1F5C3E] text-white py-4 rounded-lg font-black uppercase text-[11px] tracking-widest shadow-xl hover:bg-[#27500A] transition-all no-underline mb-6"
              >
                <GoogleDriveIcon />
                Download for Google Sheets
              </a>

              {template.suitability && (
                <div className="p-4 border-l-2 border-[#C0DD97] bg-gray-50/50">
                  <p className="text-[11px] text-gray-500 leading-relaxed italic m-0">
                    <span className="font-black text-gray-400 uppercase not-italic mr-1">Best for:</span> {template.suitability}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Dettagli Dinamici */}
          <div className="max-w-3xl">
            <h2 className="text-xl font-black mb-6 uppercase tracking-tight text-gray-800 underline decoration-[#C0DD97] decoration-4 underline-offset-8">Description</h2>
            <div className="text-sm text-gray-600 leading-relaxed mb-16 whitespace-pre-wrap">
              {template.description}
            </div>

            {template.features && (
              <div className="mb-16">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">What's Included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {template.features.map((f: any, i: number) => (
                    <div key={i} className="flex gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="text-2xl">{f.icon}</span>
                      <div>
                        <h4 className="text-[11px] font-black text-gray-800 uppercase mb-1">{f.title}</h4>
                        <p className="text-[11px] text-gray-500 leading-snug m-0">{f.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {template.how_to_use && (
              <div className="p-8 rounded-2xl border-2 border-dashed border-gray-100">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-8">How to use</h3>
                <div className="space-y-8">
                  {template.how_to_use.map((step: string, i: number) => (
                    <div key={i} className="flex gap-6">
                      <span className="text-3xl font-black text-[#EAF3DE] leading-none">0{i+1}</span>
                      <p className="text-sm text-gray-600 leading-relaxed pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
        <Sidebar videoId={template.video_id} />
      </div>
      <Footer />
    </div>
  );
}
