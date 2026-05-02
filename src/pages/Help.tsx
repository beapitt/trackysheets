import React from 'react';
import Navbar from '../layout/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../layout/Sidebar';
import { Mail, LifeBuoy, Monitor, PlayCircle } from 'lucide-react';

export default function Help() {
  return (
    <div className="min-h-screen bg-white font-inter text-[#4b5563] antialiased overflow-x-hidden">
      <Navbar />
      
      <main className="max-w-[1440px] mx-auto px-5 md:px-10 pt-6 md:pt-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="flex-1 min-w-0">
            {/* INTESTAZIONE PAGINA */}
            <div className="mb-8 border-b border-gray-50 pb-6 text-left">
              <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1F5C3E] mb-1">Support</p>
              <h1 className="text-[26px] md:text-[34px] font-bold text-[#1f2937] leading-tight">
                Help & Support
              </h1>
            </div>
            
            <div className="space-y-10 text-left">
              {/* SEZIONE 1 */}
              <section className="flex gap-4 md:gap-6">
                <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-gray-50 items-center justify-center shrink-0">
                   <LifeBuoy className="text-[#1F5C3E]" size={24} />
                </div>
                <div>
                  <h3 className="text-[#1f2937] font-bold text-lg md:text-xl mb-2">How to use our templates</h3>
                  <p className="text-[15px] leading-relaxed">
                    All TrackySheets planners are free. To use them, simply click the <strong>"Make a copy"</strong> button on the template page. 
                    This will save a private, editable version directly into your Google Drive. 
                    Access is instant and no registration is required.
                  </p>
                </div>
              </section>

              {/* SEZIONE 2 */}
              <section className="flex gap-4 md:gap-6">
                <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-gray-50 items-center justify-center shrink-0">
                   <Monitor className="text-[#1F5C3E]" size={24} />
                </div>
                <div>
                  <h3 className="text-[#1f2937] font-bold text-lg md:text-xl mb-2">System Requirements</h3>
                  <p className="text-[15px] leading-relaxed">
                    You only need a free Google account and an internet connection. No installation or specialized software is required. 
                    The templates work best on desktop, but can be viewed on mobile via the Google Sheets app.
                  </p>
                </div>
              </section>

              {/* SEZIONE 3 */}
              <section className="flex gap-4 md:gap-6">
                <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-gray-50 items-center justify-center shrink-0">
                   <PlayCircle className="text-[#1F5C3E]" size={24} />
                </div>
                <div>
                  <h3 className="text-[#1f2937] font-bold text-lg md:text-xl mb-2">Video Guides</h3>
                  <p className="text-[15px] leading-relaxed">
                    Many of our planners include a dedicated video guide. You can find these in the sidebar of the specific product page or on our YouTube channel. 
                    If you can't find a guide, check the "Instructions" tab within the sheet.
                  </p>
                </div>
              </section>

              {/* BOX CONTATTO - COMPATTO E PROFESSIONALE */}
              <section className="bg-gray-50 rounded-3xl p-6 md:p-10 border border-gray-100 mt-12 text-center md:text-left">
                <h3 className="text-[#1f2937] font-bold text-xl md:text-2xl mb-3">Still need help?</h3>
                <p className="text-[14px] md:text-[15px] mb-8 text-gray-500 max-w-xl">
                  If you have technical issues with a template or suggestions for new ones, feel free to reach out to our team. We usually respond within 24 hours.
                </p>
                <a 
                  href="mailto:support@trackysheets.com" 
                  className="inline-flex items-center justify-center gap-3 bg-[#1F5C3E] text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all no-underline shadow-md"
                >
                  <Mail size={18} />
                  Contact Support
                </a>
              </section>
            </div>
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
