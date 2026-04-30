import React from 'react';
import Navbar from '../layout/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../layout/Sidebar';
import { Mail } from 'lucide-react';

export default function Help() {
  return (
    <div className="min-h-screen bg-white font-sans text-left overflow-x-hidden">
      <Navbar />
      
      {/* Container fluido: padding ridotto su mobile (px-4) e pieno su desktop (md:px-12) */}
      <div className="w-full max-w-[1550px] mx-auto px-4 md:px-12 py-6 md:py-10 text-left">
        
        {/* FIX CRITICO: flex-col su mobile, flex-row solo da schermi grandi (lg:) */}
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 text-left">
          
          <main className="flex-1 min-w-0 text-left w-full">
            <h1 className="text-[26px] md:text-[32px] font-bold text-[#1f2937] mb-4 border-b pb-4 uppercase tracking-tight text-left">
              Help & Support
            </h1>
            
            <div className="prose prose-slate max-w-none text-[15px] leading-relaxed text-gray-600 space-y-8 text-left">
              <section>
                <h3 className="text-[#1F5C3E] font-bold text-xl mb-3 text-left">How to use our templates</h3>
                <p className="text-left">
                  All TrackySheets planners are free. To use them, simply click the <strong>"Make a copy"</strong> button on the template page. 
                  This will save a private, editable version directly into your Google Drive.
                </p>
              </section>

              <section>
                <h3 className="text-[#1F5C3E] font-bold text-xl mb-3 text-left">System Requirements</h3>
                <p className="text-left">
                  You only need a free Google account and an internet connection. No installation or specialized software is required.
                </p>
              </section>

              <section>
                <h3 className="text-[#1F5C3E] font-bold text-xl mb-3 text-left">Video Guides</h3>
                <p className="text-left">
                  Many of our complex planners include a dedicated video guide. You can find these in the sidebar of the specific product page or on our YouTube channel.
                </p>
              </section>

              {/* SEZIONE CONTATTI - Responsive padding */}
              <section className="bg-[#f8fafc] rounded-2xl p-6 md:p-8 border border-slate-100 mt-12">
                <h3 className="text-[#1F5C3E] font-bold text-xl mb-2 text-left">Still need help?</h3>
                <p className="text-left mb-6 text-slate-500 text-sm md:text-base">
                  If you have technical issues with a template or suggestions for new ones, feel free to reach out.
                </p>
                <a 
                  href="mailto:support@trackysheets.com" 
                  className="inline-flex items-center justify-center gap-3 bg-[#1F5C3E] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:bg-[#16432d] transition-all no-underline shadow-lg"
                >
                  <Mail size={20} />
                  Contact Support
                </a>
              </section>
            </div>
          </main>

          {/* La Sidebar ora scivolerà sotto il main grazie a flex-col */}
          <Sidebar />
          
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
