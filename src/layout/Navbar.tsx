import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="font-sans">
      {/* TOP BAR - Verde Scuro #14532d */}
      <div className="bg-[#14532d] py-4 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo e Tagline */}
          <Link to="/" className="flex items-center gap-4 no-underline group">
            <div className="bg-[#1a8856] text-white px-2 py-1 rounded font-black text-xl flex items-center justify-center min-w-[42px] border border-[#1a8856]">
              TS
            </div>
            <div className="flex flex-col text-left">
              <span className="text-white font-bold text-xl leading-none tracking-tight">
                TrackySheets
              </span>
              <span className="text-gray-300 text-[12px] font-medium mt-1">
                Free Sheets & Planners
              </span>
            </div>
          </Link>

          {/* Search Bar - BIANCA per visibilità */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white rounded shadow-sm overflow-hidden border border-gray-200">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border-none text-gray-800 text-sm px-4 py-2 outline-none w-64 placeholder:text-gray-400"
            />
            <button type="submit" className="bg-gray-50 px-3 text-gray-500 hover:text-[#1a8856] border-l border-gray-100 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* NAV BAR - Verde Chiaro #1a8856 */}
      <div className="bg-[#1a8856] py-2 px-8">
        <div className="max-w-7xl mx-auto flex gap-8">
          <Link to="/" className="text-white no-underline text-xs font-bold uppercase tracking-widest hover:text-gray-100 transition">
            Home
          </Link>
          <Link to="/admin" className="text-white/80 no-underline text-xs font-bold uppercase tracking-widest hover:text-white transition">
            Admin Area
          </Link>
        </div>
      </div>
    </header>
  );
}
