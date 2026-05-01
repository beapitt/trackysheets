"use client";
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, HelpCircle } from 'lucide-react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/templates?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Definisco i link fuori dal return per forzare il refresh della logica
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Templates', path: '/templates' },
    { name: 'Finance', path: '/category/finance' },
    { name: 'Budgeting', path: '/category/budgeting' },
    { name: 'Productivity', path: '/category/productivity' }
  ];

  return (
    <header className="sticky top-0 z-[100] w-full shadow-md font-inter" style={{ backgroundColor: '#1F5C3E' }}>
      <div className="h-[60px] flex items-center border-b border-white/5 px-6 md:px-10">
        <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          
          <Link to="/" className="flex items-center gap-3 no-underline group flex-shrink-0">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-[#1F5C3E] text-lg shadow-sm">TS</div>
            <span className="text-white font-bold text-[19px] tracking-tight hidden sm:block">TrackySheets</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-[450px] mx-4 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-100/40" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-green-100/30 focus:bg-white focus:text-gray-900 focus:outline-none transition-all text-sm font-medium"
            />
          </form>

          <div className="flex items-center gap-5 text-right">
            <Link to="/help" className="flex items-center gap-2 text-green-100/70 hover:text-white transition-colors no-underline">
              <HelpCircle size={20} />
              <span className="text-[13px] font-bold uppercase tracking-wider hidden md:block">Help</span>
            </Link>
          </div>
        </div>
      </div>

      <nav className="h-[42px] flex items-center bg-black/10">
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.name}
                  to={link.path}
                  className={`text-[11px] font-black no-underline uppercase tracking-[0.15em] relative py-2 transition-colors ${
                    isActive ? 'text-white' : 'text-green-100/40 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C0DD97]"></span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
