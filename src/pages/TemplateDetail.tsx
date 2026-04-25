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

  useEffect(() => {
    async function fetchTemplate() {
      const { data } = await supabase.from('templates').select('*').eq('slug', slug).single();
      if (data) setTemplate(data);
      setLoading(false);
    }
    fetchTemplate();
  }, [slug]);

  if (loading) return <div className="p-20 text-center font-sans italic text-gray-400">Loading template...</div>;
  if (!template) return <div className="p-20 text-center font-sans">Template not found.</div>;

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto flex flex-1 w-full">
        <main className="flex-1 p-8 bg-white border-r border-gray-100 text-left">
          <div className="mb-4 text-[11px] text-gray-400 font-bold uppercase tracking-widest">
            Home / {template.category} / {template.title}
          </div>
          <h1 className="text-3xl font-bold text-[#14532d] mb-2 uppercase tracking-tight">{template.title}</h1>
          <p className="text-[#1a8856] text-xs font-bold uppercase tracking-widest mb-8">{template.category}</p>
          
          <div className="aspect-video w-full bg-gray-100 rounded shadow-inner overflow-hidden mb-10 border border-gray-200">
            <img src={template.thumbnail} alt={template.title} className="w-full h-full object-cover" />
          </div>

          <div className="prose max-w-none text-gray-700 leading-relaxed mb-12">
             <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2 uppercase tracking-wide">Description</h2>
             <p className="whitespace-pre-wrap text-[15px]">{template.short_description}</p>
             <div className="mt-6 text-gray-600 italic">{template.long_description}</div>
          </div>

          <div className="bg-green-50 p-10 rounded-lg border border-green-100 flex flex-col items-center gap-6 shadow-sm">
            <h3 className="text-[#14532d] font-bold text-lg uppercase tracking-tight">Free Download</h3>
            <a href={template.download_url} target="_blank" rel="noopener noreferrer" 
               className="bg-[#1a8856] hover:bg-[#14532d] text-white px-12 py-5 rounded font-bold text-sm uppercase tracking-[0.2em] no-underline shadow-lg transition-all">
               📥 Download for Google Sheets
            </a>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No registration required • 100% Free</p>
          </div>
        </main>
        <Sidebar />
      </div>
      <Footer />
    </div>
  );
}
