import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#14532d] text-white pt-12 pb-6 px-6 font-sans border-t-4 border-[#1a8856]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
        
        {/* Colonna 1: Logo e Descrizione */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="text-xl font-bold bg-white text-[#14532d] px-2 rounded tracking-tighter">TS</div>
            <span className="text-lg font-bold tracking-tight">TrackySheets</span>
          </div>
          <p className="text-green-100 text-sm leading-relaxed opacity-80">
            Professional Google Sheets templates, calculators, and planners designed to simplify your business and personal life. 100% Free.
          </p>
        </div>

        {/* Colonna 2: Resources */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-6 border-b border-green-700 pb-2">
            Resources
          </h4>
          <ul className="space-y-3 p-0 list-none text-sm">
            <li><Link to="/templates" className="text-green-100 no-underline hover:text-white transition">All Templates</Link></li>
            <li><Link to="/category/business" className="text-green-100 no-underline hover:text-white transition">Business Tools</Link></li>
            <li><Link to="/category/personal-finance" className="text-green-100 no-underline hover:text-white transition">Personal Finance</Link></li>
          </ul>
        </div>

        {/* Colonna 3: Legal */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-6 border-b border-green-700 pb-2">
            Legal
          </h4>
          <ul className="space-y-3 p-0 list-none text-sm">
            <li><Link to="/privacy" className="text-green-100 no-underline hover:text-white transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-green-100 no-underline hover:text-white transition">Terms of Use</Link></li>
            <li><Link to="/disclaimer" className="text-green-100 no-underline hover:text-white transition">Disclaimer</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-green-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-[11px] text-green-300 uppercase tracking-widest opacity-60 font-bold">
          © {new Date().getFullYear()} TrackySheets. All rights reserved.
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] text-green-400 font-medium">The Guide to Google Sheets</span>
        </div>
      </div>
    </footer>
  );
}
