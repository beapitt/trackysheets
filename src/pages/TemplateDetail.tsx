import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import Footer from '../components/Footer';

export default function TemplateDetail() {
  const { slug } = useParams();
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState<string>('');

  useEffect(() => {
    async function fetchTemplate() {
      const { data } = await supabase.from('templates').select('*').eq('slug', slug).single();
      if (data) {
        setTemplate(data);
        setActiveImg(data.thumbnail);
      }
      setLoading(false);
    }
    fetchTemplate();
  }, [slug]);

  if (loading) return <div className="p-20 text-center font-sans italic text-gray-400">Loading...</div>;
  if (!template) return <div className="p-20 text-center font-sans">Template not found.</div>;

  const images = [template.thumbnail, template.img_1, template.img_2, template.img_3].filter(Boolean);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto flex flex-1 w-full border-x border-gray-50 text-left">
        <main className="flex-1 p-8">
          
          {/* 1. Titolo e Short Description (Sopra) - ORA CON SUPPORTO GRASSETTO */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#14532d] mb-4 tracking-tight leading-tight">
              {template.title}
            </h1>
            <div 
              className="text-gray-700 text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: template.short_description }}
            />
          </div>

          {/* 2. Immagine Principale (Carousel) */}
          <div className="mb-4 aspect-video bg-gray-50 rounded border border-gray-200 overflow-hidden shadow-sm">
            <img src={activeImg} alt={template.title} className="w-full h-full object-cover transition-all duration-300" />
          </div>

          {/* Miniature sotto l'immagine */}
          {images.length > 1 && (
            <div className="flex gap-3 mb-8">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImg(img)}
                  className={`w-24 h-16 rounded border-2 transition-all overflow-hidden ${activeImg === img ? 'border-[#1a8856] shadow-md' : 'border-gray-200 hover:border-gray-400'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="Preview" />
                </button>
              ))}
            </div>
          )}

          {/* 3. Pulsante Download */}
          <div className="mb-12 flex justify-start">
            <a 
              href={template.download_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-[#1a8856] hover:bg-[#14532d] text-white px-8 py-3 rounded font-bold text-sm uppercase tracking-widest no-underline shadow-sm transition-all flex items-center gap-2"
            >
              <span>↓</span> Download for Google Sheets
            </a>
          </div>

          {/* 4. Long Description (Sotto) - ORA CON FORMATTAZIONE PULITA */}
          {template.long_description && (
            <div className="prose max-w-none border-t border-gray-100 pt-8 text-gray-600 leading-relaxed text-[15px]">
              <div dangerouslySetInnerHTML={{ __html: template.long_description }} />
            </div>
          )}
        </main>

        {/* Passiamo il video alla Sidebar così può mostrarlo lì invece che in fondo */}
        <Sidebar videoId={template.youtube_url} />
      </div>
      <Footer />
    </div>
  );
}
