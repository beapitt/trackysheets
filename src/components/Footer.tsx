import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#14532d] text-white pt-16 pb-12 border-t-4 border-[#1a8856]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-12 text-left">
          
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#14532d] text-white px-2 py-1 rounded font-bold text-lg border border-white/40 shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                TS
              </div>
              <span className="text-white font-bold text-xl tracking-tight">TrackySheets</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Professional <strong>Free Sheets & Planners</strong>. <br/>
              The ultimate guide to Google Sheets.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-green-300 text-[10px] uppercase tracking-[0.2em] mb-6">Explore</h4>
            <ul className="space-y-3 p-0 list-none text-sm font-medium">
              <li><Link to="/" className="text-gray-200 hover:text-white no-underline transition">All Templates</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-green-300 text-[10px] uppercase tracking-[0.2em] mb-6">Legal</h4>
            <ul className="space-y-3 p-0 list-none text-sm text-gray-200 font-medium">
              <li className="hover:text-white cursor-pointer transition">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer transition">Terms of Service</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} TrackySheets • Free Sheets & Planners
        </div>
      </div>
    </footer>
  );
}
