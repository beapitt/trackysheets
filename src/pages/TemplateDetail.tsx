import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import Footer from '../components/Footer';

// Official Google Drive Icon SVG
const GoogleDriveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 87.3 78" className="mr-3">
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

  if (loading) return <div className="min-h-screen flex items-center justify-center font-sans font-black text-[10px] uppercase tracking-widest text-gray-400">Loading Template...</div>;
  if (!template) return <div className="min-h-screen flex items-center justify-center font-sans">Template not found.</div>;

  // Gallery Array
  const gallery = [template.thumbnail, template.img_1, template.img_2, template.img_3].filter(Boolean);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto flex flex-1 w-full border-x border-gray-50 items-start">
        <main className="flex-1 p-8 border-r border-gray-50 text-left">
          
          {/* ── BREADCRUMBS ── */}
          <nav className="flex gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">
            <Link to="/" className="hover:text-[#1F5C3E] no-underline">Home</Link>
            <span>/</span>
            <span className="text-gray-300">{template.title}</span>
          </nav>

          {/* ── TITLE ── */}
          <h1 className="text-4xl font-black text-gray-900 mb-10 tracking-tight leading-none">
            {template.title}
          </h1>

          {/* ── TOP SECTION ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
            
            {/* Gallery */}
            <div className="lg:col-span-7">
              <div 
                className="aspect-video bg-[#f5f4ed] rounded-xl overflow-hidden border border-gray-100 mb-4 cursor-zoom-in group relative"
                onClick={() => window.open(selectedImg || '', '_blank')}
              >
                <img src={selectedImg || ''} className="w-full h-full object-cover" alt="Preview" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all flex items-center justify-center">
                   <span className="bg-white/90 px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm text-[10px] font-black uppercase tracking-widest">🔍 View Full Image</span>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 custom-sidebar-scroll">
                {gallery.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedImg(img)} 
                    className={`w-24 aspect-video rounded-lg border-2 transition-all overflow-hidden shrink-0 ${selectedImg === img ? 'border-[#1F5C3E]' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Technical Specs & Download */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="bg-soft-cream rounded-xl p-6 mb-6 border border-gray-100 shadow-sm">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1F5C3E] mb-6 border-b border-[#1F5C3E]/10 pb-2">Technical Specifications</h4>
                <div className="space-y-4">
                  {[
                    { label: "Software", value: template.software || "Google Sheets" },
                    { label: "Difficulty", value: template.difficulty || "Beginner" },
                    { label: "License", value: template.license || "Free Personal Use" }
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center border-b border-[#1F5C3E]/5 pb-2 last:border-0">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.label}</span>
                      <span className="text-[11px] font-black text-[#1F5C3E]">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download Button */}
              <a 
                href={template.download_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full bg-brand-primary text-white px-6 py-5 rounded-xl font-black uppercase text-[11px] tracking-[0.15em] shadow-xl hover:bg-[#27500A] transition-all no-underline group mb-6"
              >
                <div className="flex items-center">
                  <GoogleDriveIcon />
                  Download for Google Sheets
                </div>
                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </a>

              {/* Suitability Box */}
              {template.suitability && (
                <div className="p-5 rounded-xl border-l-4 border-[#1F5C3E] bg-[#f5f4ed]/50">
                  <p className="text-[12px] text-gray-500 leading-relaxed italic m-0">
                    <span className="font-black text-[#1F5C3E] uppercase not-italic mr-2">Best for:</span> {template.suitability}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── CONTENT SECTION ── */}
          <div className="max-w-3xl">
            <h2 className="text-2xl font-black mb-8 uppercase tracking-tight text-gray-900 border-b-4 border-[#f5f4ed] inline-block">Project Description</h2>
            <div className="text-[15px] text-gray-600 leading-relaxed mb-20 whitespace-pre-wrap font-medium">
              {template.long_description || template.description}
            </div>

            {/* Features JSONB */}
            {template.features && Array.isArray(template.features) && (
              <div className="mb-20">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">What's Included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {template.features.map((f: any, i: number) => (
                    <div key={i} className="flex gap-5 p-5 rounded-xl bg-soft-cream border border-gray-100">
                      <span className="text-3xl grayscale-[0.3]">{f.icon}</span>
                      <div>
                        <h4 className="text-[12px] font-black text-gray-900 uppercase mb-1 tracking-tight">{f.title}</h4>
                        <p className="text-[11px] text-gray-500 leading-snug m-0 font-medium">{f.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How to use Step Array */}
            {template.how_to_use && Array.isArray(template.how_to_use) && (
              <div className="p-10 rounded-2xl bg-white border-2 border-dashed border-gray-100">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-10 text-center">How to use this template</h3>
                <div className="space-y-12">
                  {template.how_to_use.map((step: string, i: number) => (
                    <div key={i} className="flex gap-8 group">
                      <span className="text-5xl font-black outline-text-brand leading-none opacity-20 group-hover:opacity-100 transition-opacity">
                        0{i+1}
                      </span>
                      <p className="text-[14px] text-gray-600 leading-relaxed pt-2 font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        <Sidebar />
      </div>

      <Footer />
    </div>
  );
}
