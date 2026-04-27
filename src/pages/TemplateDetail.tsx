import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import Footer from '../components/Footer';

export default function TemplateDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
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

  const convertYouTubeUrl = (url: string) => {
    if (!url) return '';
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  if (loading) return <div className="p-20 text-center font-sans uppercase tracking-widest text-[10px] font-black">Loading...</div>;
  if (!template) return <div className="p-20 text-center font-sans">Template not found.</div>;

  const gallery = [template.thumbnail, template.img_1, template.img_2, template.img_3].filter(Boolean);

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <div className="max-w-7xl mx-auto flex flex-1 w-full border-x border-gray-50 items-start">
        <Sidebar />
        
        <main className="flex-1 p-10 border-l border-gray-50 text-left">
          {/* Breadcrumbs */}
          <nav className="flex gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">
            <Link to="/" className="hover:text-[#1F5C3E] no-underline">Home</Link>
            <span>/</span>
            <span className="text-gray-300">{template.title}</span>
          </nav>

          <h1 className="text-5xl font-black text-gray-900 mb-12 tracking-tighter leading-none" style={{ fontWeight: 900 }}>
            {template.title}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
            {/* Gallery Section */}
            <div className="lg:col-span-7">
              <div className="aspect-video bg-[#f5f4ed] rounded-xl overflow-hidden border border-gray-100 mb-4">
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

            {/* Specs & Download */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="bg-[#f5f4ed] rounded-xl p-6 mb-8 border border-gray-100">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1F5C3E] mb-6">Technical Specifications</h4>
                <div className="space-y-4">
                  {[
                    { label: "Software", value: template.software || "Google Sheets" },
                    { label: "Difficulty", value: template.difficulty || "Beginner" },
                    { label: "License", value: template.license || "Free Personal Use" }
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center border-b border-gray-200/50 pb-2 last:border-0">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                      <span className="text-[11px] font-black text-[#1F5C3E]">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a 
                href={template.download_url} 
                target="_blank" 
                className="flex items-center justify-between w-full bg-[#1F5C3E] text-white px-6 py-5 rounded-xl font-black uppercase text-[11px] tracking-widest no-underline shadow-xl hover:bg-[#27500A] transition-all"
                style={{ backgroundColor: '#1F5C3E', color: 'white' }}
              >
                <span>Download for Google Sheets</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Long Description Area */}
          <div className="max-w-3xl">
            <div className="border-l-4 border-[#C0DD97] pl-8 mb-20">
              <p className="text-[18px] text-gray-500 italic leading-relaxed" style={{ fontWeight: 300 }}>
                {template.short_description}
              </p>
            </div>

            {/* Key Features - Light Grid */}
            <div className="mb-24">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-10">What's Included</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {template.features?.map((f: any, i: number) => (
                  <div key={i} className="flex flex-col items-start">
                    <span className="text-4xl mb-5">{f.icon}</span>
                    <h4 className="text-[14px] font-black text-gray-900 uppercase mb-2 tracking-tight">{f.title}</h4>
                    <p className="text-[12px] text-gray-500 leading-relaxed" style={{ fontWeight: 300 }}>{f.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Use - Fixed Logic */}
            <div className="pt-16 border-t border-gray-50 mb-20">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-12">How to use this template</h3>
              <div className="space-y-12">
                {template.how_to_use?.map((step: any, i: number) => (
                  <div key={i} className="flex gap-8 items-start">
                    <div className="w-8 h-8 rounded-full bg-[#1F5C3E] text-white flex items-center justify-center shrink-0 font-black text-[12px]">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <p className="text-[15px] text-gray-600 leading-relaxed pt-1" style={{ fontWeight: 300 }}>
                      {typeof step === 'string' ? step : step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Tutorial */}
            {template.youtube_url && (
              <div className="mb-20">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">Video Tutorial</h3>
                <div className="aspect-video rounded-2xl overflow-hidden bg-gray-900 shadow-sm">
                  <iframe width="100%" height="100%" src={convertYouTubeUrl(template.youtube_url)} frameBorder="0" allowFullScreen />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
