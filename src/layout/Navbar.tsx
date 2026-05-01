"use client";
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, HelpCircle, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // CONTROLLO MANUALE LARGHEZZA - Ignora Tailwind
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // Controlla subito
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/templates?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Templates', path: '/templates' },
    { name: 'Finance', path: '/category/finance' },
    { name: 'Budgeting', path: '/category/budgeting' },
    { name: 'Productivity', path: '/category/productivity' },
  ];

  return (
    <header className="sticky top-0 z-[100] w-full shadow-md font-inter" style={{ backgroundColor: '#1F5C3E' }}>
      <div className="h-[60px] flex items-center border-b border-white/5 px-4 md:px-10">
        <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 no-underline flex-shrink-0 text-white">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center font-black text-[#1F5C3E] text-lg">TS</div>
            {!isMobile && <span className="font-bold text-[19px]">TrackySheets</span>}
          </Link>

          {/* Ricerca: La mostriamo solo se NON siamo su mobile */}
          {!isMobile && (
            <form onSubmit={handleSearch} className="flex-1 max-w-[450px] mx-4 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-100/40" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white outline-none text-sm"
              />
            </form>
          )}

          {/* Bottoni Destra */}
          <div className="flex items-center gap-4">
            {!isMobile && (
              <Link to="/help" className="text-white no-underline font-bold text-[13px] uppercase tracking-wider opacity-80 hover:opacity-100">
                Help
              </Link>
            )}

            {/* Hamburger: Appare solo se SIAMO su mobile */}
            {isMobile && (
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-1"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SUB-NAV DESKTOP: Appare solo se NON siamo su mobile */}
      {!isMobile && (
        <nav className="h-[42px] flex items-center bg-black/10">
          <div className="w-full max-w-[1440px] mx-auto px-10 flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="text-[11px] font-black text-white no-underline uppercase tracking-[0.15em] opacity-60 hover:opacity-100 transition-opacity"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* MENU MOBILE: Appare solo se siamo su mobile E il menu è aperto */}
      {isMobile && isMenuOpen && (
        <div className="bg-[#1F5C3E] border-t border-white/10 px-6 py-6 flex flex-col gap-5 shadow-2xl">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-100/40" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white outline-none"
            />
          </form>

          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={() => setIsMenuOpen(false)}
                className="text-white font-bold no-underline uppercase tracking-widest py-1"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
