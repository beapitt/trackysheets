import React from 'react';
import Navbar from '../layout/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../layout/Sidebar';

export default function Help() {
  return (
    <div className="min-h-screen bg-white font-sans text-left">
      <Navbar />
      
      <div className="w-full max-w-[1550px] mx-auto px-12 py-10 text-left">
        <div className="flex flex-row items-start gap-12 text-left">
          
          <main className="flex-1 min-w-0 text-left">
            <h1 className="text-[32px] font-bold text-[#1f2937] mb-4 border-b pb-4 uppercase tracking-tight text-left">
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
            </div>
          </main>

          <Sidebar />
          
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
