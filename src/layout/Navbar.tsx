"use client";
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // O 'next/link' se usi Next.js
import { Search, HelpCircle, Command } from 'lucide-react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 w-full shadow-lg" style={{ backgroundColor: '#1F5C3E' }}>
      {/* RIGA 1: LOGO - SEARCH - HELP */}
      <div className="h-16 flex items-center border-b border-white/10">
        <div className="w-full max-w-[1550px] mx-auto px-12 flex items-center justify-between">
          
          {/* Logo su una riga come suggerito da Claude */}
          <Link to="/" className="flex items-center gap-2.5 no-underline group">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center font-black text-[#1F5C3E] text-base group-hover:scale-105 transition-transform">
              TS
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">
              TrackySheets
            </span>
          </Link>

          {/* Search Bar "Vetro" di Claude (600px) */}
          <div className="flex-1 max-w-[600px] mx-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-100/50" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-12 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-green-100/50 focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/10 transition-all text-sm"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-1 rounded bg-white/10 border border-white/10 text-[10px] text-green-100/40 font-mono group-focus-within:hidden">
                <Command size={10} /> K
              </div>
            </div>
          </div>

          {/* Solo Help a destra per pulizia */}
          <Link to="/help" className="flex items-center gap-2 text-green-100 hover:text-white transition-colors no-underline">
            <HelpCircle size={18} />
            <span className="text-sm font-medium">Help</span>
          </Link>
        </div>
      </div>

      {/* RIGA 2: CATEGORIE PRINCIPALI (Allineate ai 1550px) */}
      <nav className="h-11 flex items-center">
        <div className="w-full max-w-[1550px] mx-auto px-12 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-[11px] font-bold text-white no-underline uppercase tracking-widest border-b-2 border-white pb-1 mt-1">
              Home
            </Link>
            {/* Solo le categorie top per non affollare */}
            {['Finance', 'Budgeting', 'Productivity', 'Calendars'].map((cat) => (
              <Link key={cat} to={`/category/${cat.toLowerCase()}`} className="text-[11px] font-bold text-green-100/70 hover:text-white no-underline uppercase tracking-widest transition-colors">
                {cat}
              </Link>
            ))}
          </div>
          
          <Link to="/templates" className="text-[11px] font-black text-white no-underline uppercase tracking-widest flex items-center gap-2 group">
            All Templates 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
