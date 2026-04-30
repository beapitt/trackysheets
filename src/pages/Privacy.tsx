import { useState, useEffect } from 'react';
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
      if (data?.privacy_policy) setContent(data.privacy_policy);
      setLoading(false);
    }
    fetchPrivacy();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Navbar />
      
      {/* flex-1 spinge il footer in fondo anche su pagine corte */}
      <div className="flex-1 w-full max-w-[1550px] mx-auto px-4 md:px-10 py-8">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-10">
          
          {/* Main content */}
          <main className="w-full lg:flex-1 min-w-0">
            <h1 className="text-[22px] font-medium tracking-tight text-[#1f2937] border-b border-gray-100 pb-4 mb-6 uppercase"
                style={{ letterSpacing: '-0.02em' }}>
              Privacy Policy
            </h1>
            
            {loading ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : (
              <div
                className="prose prose-sm max-w-none text-[14px] text-gray-600 leading-relaxed mb-16 text-left"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </main>

          {/* Sidebar sticky su desktop */}
          <aside className="w-full lg:w-[260px] lg:flex-none lg:sticky lg:top-[88px] lg:self-start">
            <Sidebar />
          </aside>
          
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
