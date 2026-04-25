import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="font-sans w-full">
      {/* Top Bar - Verde Scuro */}
      <div className="bg-[#14532d] text-white py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 no-underline text-white flex-shrink-0">
            <div className="text-xl font-bold bg-white text-[#14532d] px-2 rounded">TS</div>
            <div>
              <div className="text-sm font-bold leading-none uppercase tracking-tight">TrackySheets</div>
              <div className="text-[10px] text-green-200 uppercase tracking-widest mt-1">The Guide to Google Sheets</div>
            </div>
          </Link>
          
          <div className="flex items-center gap-4 ml-auto">
            {/* Ricerca ridimensionata e discreta */}
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Search templates..." 
                className="w-64 px-4 py-1.5 rounded text-gray-900 text-[13px] outline-none border-none shadow-inner focus:ring-2 focus:ring-[#1a8856]" 
              />
            </div>
            <Link to="/admin" className="bg-[#facc15] hover:bg-yellow-500 text-gray-900 font-bold px-4 py-1.5 rounded text-[11px] transition no-underline shadow-sm uppercase tracking-wider">
              ⚙️ ADMIN
            </Link>
          </div>
        </div>
      </div>

      {/* Nav Bar - Verde Google Sheets */}
      <div className="bg-[#1a8856] border-b border-green-700 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-8 py-2.5">
          <Link to="/" className="text-white text-[11px] font-bold no-underline hover:text-green-100 tracking-[0.2em] transition">
            HOME
          </Link>
          <Link to="/templates" className="text-white text-[11px] font-bold no-underline hover:text-green-100 tracking-[0.2em] transition">
            TEMPLATES
          </Link>
        </div>
      </div>
    </div>
  );
}
