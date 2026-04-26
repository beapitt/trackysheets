import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import Footer from '../components/Footer';

// DEFINIZIONE DELLA CARD (Direttamente qui per evitare errori di import)
function TemplateCard({ template }: { template: any }) {
  return (
    <Link key={template.id} to={`/template/${template.slug}`} className="group no-underline block">
      <div className="aspect-video bg-gray-50 rounded border border-gray-100 overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300">
        <img 
          src={template.thumbnail} 
          alt={template.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </div>
      <h3 className="mt-5 font-bold text-gray-800 group-hover:text-[#1a8856] transition text-xl leading-tight tracking-tight">
        {template.title}
      </h3>
      <p className="mt-2 text-gray-500 text-sm line-clamp-2">
        {template.seo_title || 'Professional Google Sheets template'}
      </p>
    </Link>
  );
}

export default function Home() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplates() {
      const { data } = await supabase
        .from('templates')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      if (data) setTemplates(data);
      setLoading(false);
    }
    fetchTemplates();
  }, []);

  const featuredTemplate = templates[0]; 
  const recentTemplates = templates.slice(1); 

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto flex flex-1 w-full border-x border-gray-50 text-left items-start">
        <main className="flex-1 p-8 border-r border-gray-50">
          
          {/* 1. HERO STATS SECTION */}
          <section className="mb-12">
            <h1 className="text-4xl font-black text-[#14532d] mb-6 tracking-tight leading-tight">
              Free Google Sheets Templates <br/>
              <span className="text-gray-400 font-medium text-2xl">Professional. Simple. Ready to use.</span>
            </h1>
            
            <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-8">
              <div className="text-center border-r border-gray-100">
                <span className="block text-3xl font-black text-[#1a8856]">50+</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Templates</span>
              </div>
              <div className="text-center border-r border-gray-100">
                <span className="block text-3xl font-black text-[#1a8856]">100%</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Free Access</span>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-black text-[#1a8856]">NO</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Registration</span>
              </div>
            </div>
          </section>

          {/* 2. FEATURED TEMPLATE (WIDE CARD) */}
          {featuredTemplate && (
            <section className="mb-16">
              <div className="bg-gray-50 rounded-2xl p-1 border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 aspect-video overflow-hidden rounded-xl">
                  <img src={featuredTemplate.thumbnail} className="w-full h-full object-cover" alt="Featured" />
                </div>
                <div className="w-full md:w-1/2 pr-8 pb-4 md:pb-0 p-6 md:p-0">
                  <span className="text-[#1a8856] text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">Featured Template</span>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{featuredTemplate.title}</h2>
                  <div 
                    className="text-gray-600 text-sm mb-6 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: featuredTemplate.short_description }}
                  />
                  <Link to={`/template/${featuredTemplate.slug}`} className="inline-block text-[#1a8856] font-bold text-sm uppercase tracking-widest border-b-2 border-[#1a8856] pb-1 hover:text-[#14532d] transition-all no-underline">
                    Get this template →
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* 3. RECENT TEMPLATES GRID */}
          <section>
            <div className="bg-[#1a8856] py-3 px-6 mb-10 rounded shadow-sm">
              <h2 className="text-white text-sm font-black uppercase tracking-[0.25em] m-0">
                Newly Released Templates
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="h-64 bg-gray-50 animate-pulse rounded-xl"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {recentTemplates.map(t => (
                  <TemplateCard key={t.id} template={t} />
                ))}
              </div>
            )}
          </section>

          {/* 4. HOW IT WORKS */}
          <section className="mt-20 pt-12 border-t border-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <span className="text-4xl font-black text-gray-100 block mb-2 tracking-tighter">01</span>
                <h4 className="font-bold text-gray-800 mb-2 uppercase text-xs tracking-widest">Choose</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Select a professional template from our curated library.</p>
              </div>
              <div>
                <span className="text-4xl font-black text-gray-100 block mb-2 tracking-tighter">02</span>
                <h4 className="font-bold text-gray-800 mb-2 uppercase text-xs tracking-widest">Copy</h4>
                <p className="text-sm text-gray-500 leading-relaxed">One click to copy the file directly to your Google Drive.</p>
              </div>
              <div>
                <span className="text-4xl font-black text-gray-100 block mb-2 tracking-tighter">03</span>
                <h4 className="font-bold text-gray-800 mb-2 uppercase text-xs tracking-widest">Use</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Start using it immediately with your own data. For free.</p>
              </div>
            </div>
          </section>

        </main>

        <Sidebar />
      </div>

      <Footer />
    </div>
  );
}
