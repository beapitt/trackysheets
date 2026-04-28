import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, HelpCircle, Youtube } from 'lucide-react';

// Icona Pinterest per la Navbar
const PinterestIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.947-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.22 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24 18.637 24 24 18.632 24 12.012 24 5.39 18.637 0 12.017 0z"/>
  </svg>
);

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* Main Header - Sticky */}
      <header className="sticky top-0 z-50 shadow-md" style={{ backgroundColor: '#1F5C3E' }}>
        <div className="h-20 flex items-center px-12">
          {/* Container 1550px centrato */}
          <div className="w-full max-w-[1550px] mx-auto flex items-center justify-between gap-12">
            
            {/* SINISTRA: Logo & Brand */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 no-underline group">
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center font-black text-xl transition-transform group-hover:scale-105" style={{ color: '#1F5C3E' }}>
                TS
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-white text-[18px] tracking-tighter">
                  Tracky
                </span>
                <span className="font-light text-green-200 text-[14px] tracking-tight">
                  Sheets
                </span>
              </div>
            </Link>

            {/* CENTRO: Search Bar Bilanciata (600px) */}
            <div className="flex-1 max-w-[600px]">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#1F5C3E] transition-colors" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all border-none shadow-inner text-sm font-medium"
                />
              </div>
            </div>

            {/* DESTRA: Help & Social (Bilanciamento) */}
            <div className="flex items-center gap-8 flex-shrink-0">
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-green-100 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="text-green-100 hover:text-white transition-colors">
                <PinterestIcon />
              </a>
              <div className="h-6 w-[1px] bg-white/20 hidden md:block"></div>
              <Link to="/help" className="flex items-center gap-2 text-green-100 hover:text-white transition-colors no-underline">
                <HelpCircle size={20} />
                <span className="text-sm font-bold tracking-tight">Help</span>
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* Secondary Bar - Categorie Rapide */}
      <nav className="bg-white border-b border-gray-100 hidden md:block">
        <div className="h-11 flex items-center px-12">
          <div className="w-full max-w-[1550px] mx-auto flex items-center gap-10">
            <Link to="/" className="text-[12px] font-black uppercase tracking-widest text-gray-900 no-underline hover:text-[#1F5C3E]">
              Home
            </Link>
            <Link to="/templates" className="text-[12px] font-black uppercase tracking-widest text-gray-400 no-underline hover:text-[#1F5C3E]">
              All Templates
            </Link>
            <div className="h-4 w-[1px] bg-gray-100"></div>
            {/* Qui potrai aggiungere 2-3 categorie principali se vuoi, altrimenti resta pulito */}
            <span className="text-[11px] font-bold text-gray-300 italic">Explore our professional Google Sheets collection</span>
          </div>
        </div>
      </nav>
    </>
  );
}
