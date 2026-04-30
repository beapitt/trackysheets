import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../layout/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../layout/Sidebar'; 

export default function Privacy() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrivacy() {
      const { data } = await supabase
        .from('settings')
        .select('privacy_policy')
        .maybeSingle();
      
      if (data?.privacy_policy) {
        setContent(data.privacy_policy);
      }
      setLoading(false);
    }
    fetchPrivacy();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-left">
      <Navbar />
      
      {/* 
          L'uso di flex-grow qui assicura che il contenuto occupi tutto lo spazio 
          disponibile spingendo il footer verso il basso.
      */}
      <main className="flex-grow w-full max-w-[1550px] mx-auto px-4 md:px-12 py-10">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          
          <div className="w-full lg:flex-1 min-w-0">
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#1f2937] mb-6 border-b pb-4 uppercase tracking-tight text-left">
              Privacy Policy
            </h1>
            
            {loading ? (
              <p className="text-gray-400 italic font-bold text-[10px] uppercase tracking-widest">Loading policy...</p>
            ) : (
              <div 
                className="prose prose-slate max-w-none text-[15px] leading-relaxed text-gray-600 mb-20 text-left"
                dangerouslySetInnerHTML={{ __html: content }} 
              />
            )}
            
            {!loading && !content && (
              <p className="text-gray-400 italic">Please update content in Admin Settings.</p>
            )}
          </div>

          {/* Sidebar: gestita per restare sticky su desktop */}
          <aside className="hidden lg:block w-[320px] shrink-0 sticky top-24 self-start">
             <Sidebar />
          </aside>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
