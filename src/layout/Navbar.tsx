"use client";
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, HelpCircle, Command, X } from 'lucide-react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/templates?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-[100] w-full shadow-md" style={{ backgroundColor: '#1F5C3E' }}>
      {/* RIGA 1: LOGO - SEARCH - HELP (Altezza ottimizzata a 60px) */}
      <div className="h-[60px] flex items-center border-b border-white/5 px-4 md:px-12">
        <div className="w-full max-w-[1550px] mx-auto flex items-center justify-between gap-4">
          
          {/* LOGO - Più bilanciato con il footer */}
          <Link to="/" className="flex items-center gap-3 no-underline group flex-shrink-0">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-[#1F5C3E] text-lg group-hover:scale-105 transition-transform shadow-sm">
              TS
            </div>
            <span className="text-white font-bold text-[19px] tracking-tight hidden sm:block">
              TrackySheets
            </span>
          </Link>

          {/* SEARCH DESKTOP */}
          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-[450px] mx-4 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-100/40" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-12 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-green-100/30 focus:bg-white focus:text-gray-900 focus:outline-none transition-all text-sm font-medium"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-1 rounded bg-white/5 border border-white/5 text-[9px] text-green-100/30 font-bold group-focus-within:hidden">
              <Command size={10} /> ENTER
            </button>
          </form>

          {/* HELP & ACTIONS */}
          <div className="flex items-center gap-2 md:gap-5 flex-shrink-0">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
            >
              <Search size={22} />
            </button>
            <Link to="/help" className="flex items-center gap-2 text-green-100/70 hover:text-white transition-colors no-underline group">
              <HelpCircle size={20} className="transition-transform group-hover:rotate-12" />
              <span className="text-[13px] font-bold uppercase tracking-wider hidden md:block">Help</span>
            </Link>
          </div>
        </div>
      </div>

      {/* RIGA 2: CATEGORIE (Altezza ottimizzata a 40px) */}
      <nav className="h-[42px] flex items-center overflow-x-auto no-scrollbar bg-black/10">
        <div className="w-full max-w-[1550px] mx-auto px-4 md:px-12 flex items-center justify-between min-w-max md:min-w-0">
          <div className="flex items-center gap-6 md:gap-10">
            <Link 
              to="/" 
              className={`text-[10px] md:text-[11px] font-black no-underline uppercase tracking-[0.15em] transition-all relative py-2 ${
                location.pathname === '/' 
                ? 'text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-white' 
                : 'text-green-100/40 hover:text-white'
              }`}
            >
              Home
            </Link>

            {['Finance', 'Budgeting', 'Productivity', 'Calendars'].map((cat) => (
              <Link 
                key={cat} 
                to={`/category/${cat.toLowerCase()}`} 
                className={`text-[10px] md:text-[11px] font-black no-underline uppercase tracking-[0.15em] transition-all relative py-2 ${
                  location.pathname === `/category/${cat.toLowerCase()}`
                  ? 'text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-white'
                  : 'text-green-100/40 hover:text-white'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
          
          <Link 
            to="/templates" 
            className={`text-[10px] md:text-[11px] font-black no-underline uppercase tracking-[0.15em] flex items-center gap-2 group transition-all ml-4 ${
              location.pathname === '/templates'
              ? 'text-white border-b-2 border-white'
              : 'text-white/90 hover:text-green-200'
            }`}
          >
            All Templates 
            <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
          </Link>
        </div>
      </nav>

      {/* MOBILE SEARCH OVERLAY */}
      {isSearchOpen && (
        <form onSubmit={handleSearch} className="absolute inset-0 z-[110] bg-[#1F5C3E] flex items-center px-4 gap-3">
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
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </form>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </header>
  );
}
