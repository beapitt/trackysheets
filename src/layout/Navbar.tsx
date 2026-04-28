import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NAV_LINKS = [
  { label: "Finance", href: "/category/finance" },
  { label: "Budgeting", href: "/category/budgeting" },
  { label: "Productivity", href: "/category/productivity" },
  { label: "Calendars", href: "/category/calendars" },
];

export default function Navbar() {
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <header
      style={{ backgroundColor: "#1F5C3E" }}
      className="w-full sticky top-0 z-50 shadow-md"
    >
      {/* Container allargato a 1550px - Rimuove l'oceano laterale */}
      <div className="mx-auto max-w-[1550px] px-4 md:px-8 flex items-center justify-between h-16">
        
        {/* Logo - Spostato più a sinistra nel nuovo layout */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 no-underline">
          <span
            className="flex items-center justify-center w-8 h-8 rounded text-[10px] font-black"
            style={{ backgroundColor: "#EAF3DE", color: "#1F5C3E" }}
          >
            TS
          </span>
          <span className="text-white font-bold tracking-tight text-xl">
            TrackySheets
          </span>
        </Link>

        {/* Search Bar - Più ampia e moderna */}
        <div className="flex-1 max-w-lg mx-10 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search templates..."
            className="w-full bg-white/10 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/40 outline-none focus:bg-white/20 transition-all"
          />
          <span className="absolute left-4 top-2.5 opacity-40 text-xs">🔍</span>
        </div>

        {/* Spazio bilanciamento destra */}
        <div className="hidden md:block w-32"></div>
      </div>

      {/* Riga Navigazione Secondaria */}
      <div className="w-full border-t border-white/5 bg-black/5">
        <div className="mx-auto max-w-[1550px] px-4 md:px-8 flex items-center h-10 gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`text-[11px] font-bold uppercase tracking-[0.15em] no-underline transition-all h-full flex items-center border-b-2 ${
                  isActive 
                  ? "text-white border-white/60" 
                  : "text-white/60 border-transparent hover:text-white hover:border-white/20"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          
          <Link
            to="/templates"
            className="ml-auto text-[11px] font-black uppercase tracking-[0.15em] no-underline text-[#EAF3DE] hover:opacity-80 transition-all flex items-center gap-1"
          >
            All Templates <span className="text-xs">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
