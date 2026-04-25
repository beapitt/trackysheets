import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="bg-[#14532d] text-white px-2 py-1 rounded font-bold text-xl flex items-center justify-center min-w-[40px]">
            TS
          </div>
          <div className="flex flex-col text-left">
            {/* Rimosso uppercase, ora segue il testo che scriverai */}
            <span className="text-[#14532d] font-bold text-lg leading-tight tracking-tight">
              TrackySheets
            </span>
            <span className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase">
              Professional Google Sheets Templates
            </span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
