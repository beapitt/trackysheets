import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="font-sans shadow-lg">
      <div className="bg-[#14532d] py-4 px-8 border-b border-black/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-4 no-underline group">
            <div className="bg-[#14532d] text-white px-2 py-1 rounded font-black text-xl flex items-center justify-center min-w-[42px] border border-white/40 shadow-[0_0_8px_rgba(255,255,255,0.2)]">
              TS
            </div>
            <div className="flex flex-col text-left">
              <span className="text-white font-bold text-xl leading-none tracking-tight">TrackySheets</span>
              <span className="text-gray-300 text-[12px] font-medium mt-1 uppercase tracking-wider">Free Sheets & Planners</span>
            </div>
          </Link>
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white rounded shadow-md overflow-hidden w-72">
            <input type="text" placeholder="Search templates..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-white border-none text-gray-800 text-sm px-4 py-2 outline-none w-full" />
            <button type="submit" className="bg-gray-100 px-3 text-gray-500 border-l border-gray-200 hover:text-[#1a8856] transition">🔍</button>
          </form>
        </div>
      </div>
      <div className="bg-[#1a8856] py-2.5 px-8">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="text-white no-underline text-xs font-bold uppercase tracking-[0.2em] hover:text-green-100 transition">Home</Link>
        </div>
      </div>
    </header>
  );
}
