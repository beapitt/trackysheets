"use client";
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, HelpCircle, Command, X } from 'lucide-react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-[100] w-full shadow-lg" style={{ backgroundColor: '#1F5C3E' }}>
      {/* RIGA 1: LOGO - SEARCH - HELP */}
      <div className="h-16 flex items-center border-b border-white/10 px-4 md:px-12">
        <div className="w-full max-w-[1550px] mx-auto flex items-center justify-between gap-4">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2.5 no-underline group flex-shrink-0">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center font-black text-[#1F5C3E] text-base group-hover:scale-105 transition-transform">
              TS
            </div>
            <span className="text-white font-semibold text-lg tracking-tight hidden sm:block">
              TrackySheets
            </span>
          </Link>

          {/* SEARCH DESKTOP (Visibile solo da tablet in su) */}
          <div className="hidden md:block flex-1 max-w-[500px] mx-4 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-100/50" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-12 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-green-100/50 focus:bg-white focus:text-gray-900 focus:outline-none transition-all text-sm"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-1 rounded bg-white/10 border border-white/10 text-[10px] text-green-100/40 font-mono group-focus-within:hidden">
              <Command size={10} /> K
            </div>
          </div>

          {/* ACTIONS MOBILE & HELP */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            {/* Pulsante ricerca mobile */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
            >
              <Search size={22} />
            </button>
            <Link to="/help" className="flex items-center gap-2 text-green-100 hover:text-white transition-colors no-underline">
              <HelpCircle size={22} className="md:w-[18px] md:h-[18px]" />
              <span className="text-sm font-medium hidden md:block">Help</span>
            </Link>
          </div>
        </div>
      </div>

      {/* SEARCH OVERLAY MOBILE (Appare sopra la riga 1) */}
      {isSearchOpen && (
        <div className="absolute inset-0 z-[110] bg-[#1F5C3E] flex items-center px-4 gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              autoFocus
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-white/30"
            />
          </div>
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      )}

      {/* RIGA 2: CATEGORIE SCORREVOLI */}
      <nav className="h-11 flex items-center overflow-x-auto no-scrollbar bg-[#1a4d34]">
        <div className="w-full max-w-[1550px] mx-auto px-4 md:px-12 flex items-center justify-between min-w-max md:min-w-0">
          <div className="flex items-center gap-4 md:gap-8">
            <Link 
              to="/" 
              className={`text-[10px] md:text-[11px] font-bold no-underline uppercase tracking-widest pb-1 mt-1 transition-all whitespace-nowrap ${
                location.pathname === '/' 
                ? 'text-white border-b-2 border-white' 
                : 'text-green-100/60 hover:text-white'
              }`}
            >
              Home
            </Link>

            {['Finance', 'Budgeting', 'Productivity', 'Calendars'].map((cat) => (
              <Link 
                key={cat} 
                to={`/category/${cat.toLowerCase()}`} 
                className={`text-[10px] md:text-[11px] font-bold no-underline uppercase tracking-widest transition-colors pb-1 mt-1 whitespace-nowrap ${
                  location.pathname === `/category/${cat.toLowerCase()}`
                  ? 'text-white border-b-2 border-white'
                  : 'text-green-100/60 hover:text-white'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
          
          <Link 
            to="/templates" 
            className={`text-[10px] md:text-[11px] font-black no-underline uppercase tracking-widest flex items-center gap-2 group transition-all pb-1 mt-1 ml-4 whitespace-nowrap ${
              location.pathname === '/templates'
              ? 'text-white border-b-2 border-white'
              : 'text-white hover:text-green-200'
            }`}
          >
            All Templates 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </nav>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </header>
  );
}
