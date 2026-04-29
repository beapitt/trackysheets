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
      // Recupera il testo dalla colonna terms_of_use nella tabella settings
      const { data } = await supabase
        .from('settings')
        .select('terms_of_use')
        .maybeSingle();
      
      if (data?.terms_of_use) {
        setContent(data.terms_of_use);
      }
      setLoading(false);
    }
    fetchTerms();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      
      <div className="w-full max-w-[1550px] mx-auto px-12 py-10">
        <div className="flex flex-row items-start gap-12">
          
          <main className="flex-1 min-w-0 text-left">
            {/* Margine ridotto mb-4 per eliminare lo spazio bianco */}
            <h1 className="text-[32px] font-bold text-[#1f2937] mb-4 border-b pb-4 uppercase tracking-tight text-left">
              Terms of Use
            </h1>
            
            {loading ? (
              <p className="text-gray-400 italic text-left">Loading terms...</p>
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

          {/* Sidebar corretta (quella della Home) */}
          <Sidebar />
          
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
