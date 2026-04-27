import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import Footer from '../components/Footer';

// Official Google Drive Icon
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
      const { data } = await supabase.from('templates').select('*').eq('slug', slug).single();
      if (data) {
        setTemplate(data);
        setSelectedImg(data.thumbnail);
      }
      setLoading(false);
    }
    fetchTemplate();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-sans uppercase tracking-[0.2em] text-[10px] font-black text-gray-400">Loading...</div>;
  if (!template) return <div className="min-h-screen flex items-center justify-center font-sans">Template not found.</div>;

  const gallery = [template.thumbnail, template.img_1, template.img_2, template.img_3].filter(Boolean);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto flex flex-1 w-full border-x border-gray-50 items-start">
        <main className="flex-1 p-8 border-r border-gray-50 text-left">
          
          {/* Breadcrumbs */}
          <nav className="flex gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">
            <Link to="/" className="hover:text-[#1F5C3E] no-underline">Home</Link>
            <span>/</span>
            <span className="text-gray-300">{template.title}</span>
          </nav>

          <h1 className="text-4xl font-black text-gray-900 mb-12 tracking-tighter leading-none">
            {template.title}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
            {/* Gallery (Left) */}
            <div className="lg:col-span-7">
              <div 
                className="aspect-video bg-[#f5f4ed] rounded-xl overflow-hidden border border-gray-100 mb-4 cursor-zoom-in relative"
                onClick={() => window.open(selectedImg || '', '_blank')}
              >
                <img src={selectedImg || ''} className="w-full h-full object-cover" alt="Preview" />
              </div>
              <div className="flex gap-2">
                {gallery.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(img)} className={`w-20 aspect-video rounded-lg border-2 transition-all overflow-hidden ${selectedImg === img ? 'border-[#1F5C3E]' : 'border-transparent opacity-40'}`}>
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Specs & Action (Right) */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="bg-[#f5f4ed] rounded-xl p-6 mb-6 border border-gray-100">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1F5C3E] mb-6">Technical Specifications</h4>
                <div className="space-y-4">
                  {[
                    { label: "Software", value: template.software || "Google Sheets" },
                    { label: "Difficulty", value: template.difficulty || "Beginner" },
                    { label: "License", value: template.license || "Free Personal Use" }
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center border-b border-gray-200/30 pb-2 last:border-0">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                      <span className="text-[11px] font-black text-[#1F5C3E]">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a 
                href={template.download_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full bg-[#1F5C3E] text-white px-6 py-5 rounded-xl font-black uppercase text-[11px] tracking-widest no-underline shadow-lg hover:bg-[#27500A] transition-all"
                style={{ backgroundColor: '#1F5C3E', color: 'white' }}
              >
                <div className="flex items-center">
                  <GoogleDriveIcon />
                  Download for Google Sheets
                </div>
                <span className="text-lg">→</span>
              </a>
            </div>
          </div>

          {/* ── DESCRIPTION SECTION (Claude Style) ── */}
          <div className="max-w-3xl">
            
            {/* SEO Intro with border-left */}
            <div className="border-l-4 border-[#C0DD97] pl-8 mb-20">
              <p className="text-[18px] text-gray-500 italic leading-relaxed font-light">
                {template.long_description?.split('\n')[0] || template.short_description}
              </p>
            </div>

            {/* Feature Grid - 3 Columns (Icons only, no boxes) */}
            {template.features && (
              <div className="mb-24">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-10">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {template.features.map((f: any, i: number) => (
                    <div key={i} className="flex flex-col items-start">
                      <span className="text-4xl mb-5 grayscale-[0.2]">{f.icon}</span>
                      <h4 className="text-[14px] font-black text-gray-900 uppercase mb-2 tracking-tight">{f.title}</h4>
                      <p className="text-[12px] text-gray-500 leading-relaxed font-medium">{f.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How to Use - Green Circles */}
            {template.how_to_use && (
              <div className="pt-16 border-t border-gray-50">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-12">How to use this template</h3>
                <div className="space-y-12">
                  {template.how_to_use.map((step: string, i: number) => (
                    <div key={i} className="flex gap-8 items-start">
                      <div className="w-8 h-8 rounded-full bg-[#1F5C3E] text-white flex items-center justify-center shrink-0 font-black text-[12px]">
                        {i + 1}
                      </div>
                      <p className="text-[15px] text-gray-600 leading-relaxed pt-1 font-medium italic">
                        {step}
                      </p>
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
