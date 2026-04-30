import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    /* Ridotto padding top/bottom (pt-8 pb-8 invece di 16/12) */
    <footer className="bg-[#14532d] text-white pt-8 pb-8 border-t-4 border-[#1a8856]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Ridotto il gap tra le colonne (gap-8 invece di 16) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
          
          <div>
            {/* Ridotto margine inferiore del logo (mb-3 invece di 6) */}
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#14532d] text-white px-2 py-1 rounded font-bold text-lg border border-white/40">
                TS
              </div>
              <span className="text-white font-bold text-xl tracking-tight">TrackySheets</span>
            </div>
            <p className="text-gray-300 text-[13px] leading-snug">
              Professional <strong>Free Sheets & Planners</strong>. <br/>
              The ultimate guide to Google Sheets.
            </p>
          </div>
          
          <div>
            {/* Ridotto margine sotto EXPLORE (mb-3 invece di 6) */}
            <h4 className="font-bold text-green-300 text-[10px] uppercase tracking-[0.2em] mb-3">Explore</h4>
            <ul className="space-y-2 p-0 list-none text-sm font-medium">
              <li><Link to="/templates" className="text-gray-200 hover:text-white no-underline transition">All Templates</Link></li>
            </ul>
          </div>

          <div>
            {/* Ridotto margine sotto LEGAL (mb-3 invece di 6) */}
            <h4 className="font-bold text-green-300 text-[10px] uppercase tracking-[0.2em] mb-3">Legal</h4>
            <ul className="space-y-2 p-0 list-none text-sm font-medium">
              <li>
                <Link to="/privacy" className="text-gray-200 hover:text-white no-underline transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-200 hover:text-white no-underline transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-gray-200 hover:text-white no-underline transition">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Ridotto padding copyright (pt-6 invece di 8) */}
        <div className="border-t border-white/10 pt-6 text-center text-gray-400 text-[9px] font-bold uppercase tracking-[0.2em]">
          © {new Date().getFullYear()} TrackySheets • Free Sheets & Planners
        </div>
      </div>
    </footer>
  );
}
