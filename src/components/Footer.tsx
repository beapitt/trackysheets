import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#14532d] text-white pt-12 pb-6 px-6 font-sans border-t-4 border-[#1a8856]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
        
        {/* Colonna 1: Logo e Descrizione */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="text-xl font-bold bg-white text-[#14532d] px-2 rounded">TS</div>
            <span className="text-lg font-bold uppercase tracking-tight">TrackySheets</span>
          </div>
          <p className="text-green-100 text-sm leading-relaxed opacity-80">
            Professional Google Sheets templates, calculators, and planners designed to simplify your business and personal life. 100% Free.
          </p>
        </div>

        {/* Colonna 2: Risorse */}
        <div>
          <h4 className="text-[#facc15] font-bold text-xs uppercase tracking-[0.2em] mb-6">Resources</h4>
          <ul className="space-y-3 p-0 list-none text-sm">
            <li><Link to="/templates" className="text-white no-underline hover:text-green-300 transition">All Templates</Link></li>
            <li><Link to="/category/business" className="text-white no-underline hover:text-green-300 transition">Business Tools</Link></li>
            <li><Link to="/category/personal-finance" className="text-white no-underline hover:text-green-300 transition">Personal Finance</Link></li>
          </ul>
        </div>

        {/* Colonna 3: Legale */}
        <div>
          <h4 className="text-[#facc15] font-bold text-xs uppercase tracking-[0.2em] mb-6">Legal</h4>
          <ul className="space-y-3 p-0 list-none text-sm">
            <li><Link to="/privacy" className="text-white no-underline hover:text-green-300 transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-white no-underline hover:text-green-300 transition">Terms of Use</Link></li>
            <li><Link to="/disclaimer" className="text-white no-underline hover:text-green-300 transition">Disclaimer</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-green-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-[11px] text-green-300 uppercase tracking-widest opacity-60">
          © {new Date().getFullYear()} TrackySheets. All rights reserved.
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] text-green-400">Made for Google Sheets Users</span>
        </div>
      </div>
    </footer>
  );
}
