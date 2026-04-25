import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="font-sans w-full">
      <div className="bg-[#14532d] text-white py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 no-underline text-white">
            <div className="text-xl font-bold bg-[#14532d] text-white px-2 py-1 rounded border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)]">TS</div>
            <div className="text-left">
              <div className="text-sm font-bold leading-none tracking-tight">TrackySheets</div>
              <div className="text-[10px] text-green-200 uppercase tracking-widest mt-1 opacity-90 font-medium">Smart Trackers & Planners</div>
            </div>
          </Link>
          
          <div className="relative hidden md:block">
            <input type="text" placeholder="Search templates..." className="w-64 px-4 py-1.5 rounded text-gray-900 text-[12px] outline-none border-none shadow-inner" />
          </div>
        </div>
      </div>

      <div className="bg-[#1a8856] border-b border-green-700 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-8 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em]">
          <Link to="/" className="text-white no-underline hover:text-green-100 transition">HOME</Link>
          <Link to="/templates" className="text-white no-underline hover:text-green-100 transition">TEMPLATES</Link>
        </div>
      </div>
    </div>
  );
}
