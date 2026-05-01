"use client";
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, HelpCircle, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    <header
      className="sticky top-0 z-[100] w-full font-inter"
      style={{ backgroundColor: '#1F5C3E' }}
    >
      {/* ── TOP BAR ── */}
      <div className="h-[60px] flex items-center border-b border-white/5 px-4 md:px-10">
        <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between gap-3 overflow-hidden">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline flex-shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-xl flex items-center justify-center font-black text-[#1F5C3E] text-base md:text-lg shadow-sm flex-shrink-0">
              TS
            </div>
            <span className="text-white font-bold text-[16px] md:text-[19px] tracking-tight hidden sm:block whitespace-nowrap">
              TrackySheets
            </span>
          </Link>

          {/* Search — Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:block flex-1 max-w-[450px] mx-4 relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-100/40" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2 rounded-xl bg-white/10 border border-white/15 text-white placeholder-green-100/30 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none transition-all text-sm font-medium"
            />
          </form>

          {/* Right: Help (desktop) + hamburger (mobile) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              to="/help"
              className="hidden md:flex items-center gap-1.5 text-green-100/70 hover:text-white transition-colors no-underline"
            >
              <HelpCircle size={20} />
              <span className="text-[12px] font-bold uppercase tracking-wider">Help</span>
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── DESKTOP SUB-NAV ── */}
      <nav
        className="hidden md:flex h-[42px] items-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.10)' }}
      >
        <div className="w-full max-w-[1440px] mx-auto px-10 flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[11px] font-bold no-underline uppercase tracking-[0.12em] relative py-2 transition-colors whitespace-nowrap ${isActive ? 'text-white' : 'text-green-100/50 hover:text-white'}`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C0DD97] rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      {isMenuOpen && (
        <div
          className="md:hidden border-t border-white/10 px-5 py-5 flex flex-col gap-5"
          style={{ backgroundColor: '#1F5C3E' }}
        >
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-100/40" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-green-100/30 focus:outline-none text-sm font-medium"
            />
          </form>

          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-2.5 px-2 rounded-lg text-[13px] font-semibold uppercase tracking-wider no-underline transition-colors ${isActive ? 'text-white bg-white/10' : 'text-green-100/70 hover:text-white hover:bg-white/5'}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <Link
            to="/help"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-2 text-green-100/60 hover:text-white no-underline text-[12px] font-bold uppercase tracking-widest transition-colors pt-2 border-t border-white/10"
          >
            <HelpCircle size={16} /> Help
          </Link>
        </div>
      )}
    </header>
  );
}
