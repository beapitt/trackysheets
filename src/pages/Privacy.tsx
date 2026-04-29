import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../layout/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../layout/Sidebar'; // Percorso corretto

export default function Privacy() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('settings').select('privacy_policy').maybeSingle();
      if (data?.privacy_policy) setContent(data.privacy_policy);
      setLoading(false);
    }
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <div className="w-full max-w-[1550px] mx-auto px-12 py-10">
        <div className="flex flex-row items-start gap-12">
          <main className="flex-1 min-w-0">
            <h1 className="text-[32px] font-bold text-[#1f2937] mb-10 border-b pb-4">Privacy Policy</h1>
            {loading ? (
              <div className="animate-pulse flex space-y-4 flex-col">
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-full"></div>
              </div>
            ) : (
              <div className="prose prose-slate max-w-none text-[15px] leading-relaxed text-gray-600" 
                   dangerouslySetInnerHTML={{ __html: content }} />
            )}
          </main>
          <Sidebar /> 
        </div>
      </div>
      <Footer />
    </div>
  );
}
