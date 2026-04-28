import React, { useState } from 'react';
import { Search, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* Main Header Verde */}
      <header className="sticky top-0 z-50 shadow-md" style={{ backgroundColor: '#1F5C3E' }}>
        <div className="h-16 flex items-center">
          <div className="w-full max-w-[1550px] mx-auto px-12 flex items-center justify-between gap-12">
            
            {/* Logo: TrackySheets su due righe */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-2.5 no-underline">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-black text-lg" style={{ color: '#1F5C3E' }}>
                TS
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-black text-white text-sm uppercase tracking-tighter">Tracky</span>
                <span className="font-light text-green-100 text-xs uppercase tracking-widest">Sheets</span>
              </div>
            </Link>

            {/* Centro: Barra di ricerca fissa 600px */}
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-[600px] relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 rounded-full bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all text-sm"
                />
              </div>
            </div>

            {/* Destra: Help */}
            <div className="flex-shrink-0">
              <Link to="/help" className="flex items-center gap-2 text-green-100 hover:text-white transition-colors no-underline">
                <HelpCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Help</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigazione Bianca (Sotto) */}
      <nav className="bg-white border-b border-gray-100">
        <div className="h-12 flex items-center">
          <div className="w-full max-w-[1550px] mx-auto px-12 flex items-center gap-8">
            <Link to="/" className="text-[12px] font-bold text-[#1F5C3E] no-underline tracking-widest uppercase">
              Home
            </Link>
            <Link to="/templates" className="text-[12px] font-bold text-gray-400 no-underline tracking-widest uppercase hover:text-[#1F5C3E]">
              All Templates
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
