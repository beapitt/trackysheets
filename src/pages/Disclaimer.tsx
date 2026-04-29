import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../layout/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../layout/Sidebar';

export default function Disclaimer() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDisclaimer() {
      // Recupera il testo dalla colonna disclaimer nella tabella settings
      const { data } = await supabase
        .from('settings')
        .select('disclaimer')
        .maybeSingle();
      
      if (data?.disclaimer) {
        setContent(data.disclaimer);
      }
      setLoading(false);
    }
    fetchDisclaimer();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      
      <div className="w-full max-w-[1550px] mx-auto px-12 py-10">
        <div className="flex flex-row items-start gap-12">
          
          <main className="flex-1 min-w-0 text-left">
            <h1 className="text-[32px] font-bold text-[#1f2937] mb-4 border-b pb-4 uppercase tracking-tight text-left">
              Disclaimer
            </h1>
            
            {loading ? (
              <p className="text-gray-400 italic text-left">Loading disclaimer...</p>
            ) : (
              <div 
                className="prose prose-slate max-w-none text-[15px] leading-relaxed text-gray-600 space-y-4 text-left"
                dangerouslySetInnerHTML={{ __html: content }} 
              />
            )}
            
            {!loading && !content && (
              <p className="text-gray-400 italic text-left">Please update content in Admin Settings.</p>
            )}
          </main>

          {/* Sidebar corretta e aggiornata */}
          <Sidebar />
          
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
