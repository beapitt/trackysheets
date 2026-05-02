import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../layout/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../layout/Sidebar'; 

export default function Terms() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTerms() {
      const { data } = await supabase
        .from('settings')
        .select('*') // Preleviamo tutto per sicurezza
        .maybeSingle();
      
      // Controllo incrociato: prova a leggere 'terms_of_use' o 'terms_of_service'
      const termsData = data?.terms_of_use || data?.terms_of_service;
      
      if (termsData) {
        setContent(termsData);
      }
      setLoading(false);
    }
    fetchTerms();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white font-inter text-[#4b5563] antialiased overflow-x-hidden">
      <Navbar />
      
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-5 md:px-10 pt-6 md:pt-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="flex-1 min-w-0">
            {/* INTESTAZIONE */}
            <div className="mb-8 border-b border-gray-50 pb-6 text-left">
              <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1F5C3E] mb-1">Legal</p>
              <h1 className="text-[26px] md:text-[34px] font-bold text-[#1f2937] leading-tight uppercase">
                Terms of Use
              </h1>
            </div>
            
            {loading ? (
              <div className="py-20 text-center">
                <p className="text-gray-400 italic font-bold text-[10px] uppercase tracking-widest animate-pulse">Loading terms...</p>
              </div>
            ) : (
              <div 
                className="text-[15px] leading-relaxed text-[#4b5563] font-medium space-y-6 text-left"
                dangerouslySetInnerHTML={{ __html: content }} 
              />
            )}
            
            {!loading && !content && (
              <div className="bg-gray-50 p-10 rounded-3xl border border-dashed border-gray-200 text-center">
                <p className="text-gray-400 italic text-sm">Please update content in Admin Settings (Check 'terms_of_use' field).</p>
              </div>
            )}
          </div>

          {/* SIDEBAR ALLINEATA */}
          <aside className="w-full lg:w-[300px] shrink-0 lg:sticky lg:top-24 self-start">
             <Sidebar />
          </aside>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
