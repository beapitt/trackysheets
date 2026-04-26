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

  if (loading) return <div className="p-20 text-center font-sans italic text-gray-400">Loading template...</div>;
  if (!template) return <div className="p-20 text-center font-sans">Template not found.</div>;

  const images = [template.thumbnail, template.img_1, template.img_2, template.img_3].filter(Boolean);

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Dynamic Styles for Vertex42 Professional Formatting */}
      <style>{`
        .custom-content p { margin-bottom: 1.25rem; line-height: 1.6; }
        .custom-content ul { margin-bottom: 1.25rem; padding-left: 1.5rem; list-style-type: disc; }
        .custom-content li { margin-bottom: 0.5rem; }
        .custom-content b, .custom-content strong { color: #111; font-weight: 700; }
        .custom-content { color: #4b5563; font-size: 15px; }
        
        /* Fix for potential layout issues with sticky sidebar */
        .main-container { align-items: flex-start; }
      `}</style>

      <Navbar />
      
      <div className="max-w-7xl mx-auto flex flex-1 w-full border-x border-gray-50 text-left main-container">
        <main className="flex-1 p-8">
          
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#14532d] mb-4 tracking-tight leading-tight">
              {template.title}
            </h1>
            <div 
              className="custom-content text-lg"
              dangerouslySetInnerHTML={{ __html: template.short_description }}
            />
          </div>

          {/* Carousel / Image Section */}
          <div className="mb-4 aspect-video bg-gray-50 rounded border border-gray-200 overflow-hidden shadow-sm">
            <img 
              src={activeImg} 
              alt={template.title} 
              className="w-full h-full object-cover transition-all duration-300" 
            />
          </div>

          {/* Miniature Gallery */}
          {images.length > 1 && (
            <div className="flex gap-3 mb-8">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImg(img)}
                  className={`w-24 h-16 rounded border-2 transition-all overflow-hidden ${
                    activeImg === img ? 'border-[#1a8856] shadow-md' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="Preview" />
                </button>
              ))}
            </div>
          )}

          {/* Download Action Area */}
          <div className="mb-12 flex flex-col gap-6 items-start">
            <a 
              href={template.download_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-[#1a8856] hover:bg-[#14532d] text-white px-8 py-4 rounded font-bold text-sm uppercase tracking-widest no-underline shadow-sm transition-all flex items-center gap-3"
            >
              <span className="text-xl">↓</span> Download for Google Sheets
            </a>
            
            {/* Quick Feature Badges (Recommended by Claude) */}
            <div className="flex flex-wrap gap-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <span className="flex items-center gap-1"><span className="text-[#1a8856]">✓</span> No Macros</span>
              <span className="flex items-center gap-1"><span className="text-[#1a8856]">✓</span> Safe & Secure</span>
              <span className="flex items-center gap-1"><span className="text-[#1a8856]">✓</span> 100% Free</span>
            </div>
          </div>

          {/* Main Content Area */}
          {template.long_description && (
            <div className="border-t border-gray-100 pt-8 mt-8">
              <div 
                className="custom-content"
                dangerouslySetInnerHTML={{ __html: template.long_description }} 
              />
            </div>
          )}
        </main>

        {/* Updated Sidebar: Now passing templateData for technical specs */}
        <Sidebar 
          videoId={getYouTubeId(template.youtube_url)} 
          templateData={template} 
        />
      </div>

      <Footer />
    </div>
  );
}
