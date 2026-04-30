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
  }, []);

  return (
    /* Aggiunto flex e flex-col per gestire l'altezza */
    <div className="flex flex-col min-h-screen bg-white font-sans text-left overflow-x-hidden">
      <Navbar />
      
      {/* 
          Aggiunto flex-grow: questo div si espanderà per riempire 
          tutto lo spazio vuoto, spingendo il Footer verso il basso.
      */}
      <div className="flex-grow w-full max-w-[1550px] mx-auto px-4 md:px-12 py-10">
        
        <div className="flex flex-col lg:flex-row items-start gap-12">
          
          <main className="w-full lg:flex-1 min-w-0">
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#1f2937] mb-6 border-b pb-4 uppercase tracking-tight text-left">
              Privacy Policy
            </h1>
            
            {loading ? (
              <p className="text-gray-400 italic">Loading policy...</p>
            ) : (
              <div 
                className="prose prose-slate max-w-none text-[15px] leading-relaxed text-gray-600 space-y-4 text-left"
                dangerouslySetInnerHTML={{ __html: content }} 
              />
            )}
            
            {!loading && !content && (
              <p className="text-gray-400 italic">Please update content in Admin Settings.</p>
            )}
          </main>

          <Sidebar />
          
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
