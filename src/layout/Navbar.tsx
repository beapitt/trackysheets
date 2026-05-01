"use client";
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, LayoutGrid, HelpCircle, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('*').order('name');
      if (data) setCategories(data);
    }
    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/templates?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-[100] w-full shadow-md font-inter" style={{ backgroundColor: '#1F5C3E' }}>
      <div className="h-[64px] flex items-center px-4 md:px-8">
        <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between gap-4 md:gap-8">
          
          {/* LOGO (Sinistra) */}
          <Link to="/" className="flex items-center gap-3 no-underline flex-shrink-0 text-white">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center font-black text-[#1F5C3E] text-lg">TS</div>
            <span className="font-bold text-[19px] hidden sm:block">TrackySheets</span>
          </Link>

          {/* RICERCA CENTRALE (Stile ServiceNow) */}
          <form onSubmit={handleSearch} className="flex-1 max-w-[600px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 outline-none focus:bg-white/20 transition-all text-sm font-medium"
            />
          </form>

          {/* MENU HAMBURGER (Destra) */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors shrink-0"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* OVERLAY MENU A SCOMPARSA (Stile ServiceNow) */}
      {isMenuOpen && (
        <div className="absolute top-[64px] left-0 w-full bg-white border-b border-gray-200 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-[1440px] mx-auto px-6 py-8 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* Colonna Categorie (8/12) */}
            <div className="md:col-span-8">
              <div className="flex items-center gap-2 mb-6 text-[#1F5C3E]">
                <LayoutGrid size={18} />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Browse Categories</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1">
                {/* Voce Home fissa */}
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-[15px] font-bold py-2.5 border-b border-gray-50 no-underline transition-colors ${location.pathname === '/' ? 'text-[#1F5C3E] border-[#1F5C3E]/20' : 'text-gray-600 hover:text-[#1F5C3E]'}`}
                >
                  Home
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-[15px] font-bold py-2.5 border-b border-gray-50 no-underline transition-colors ${location.pathname.includes(cat.slug) ? 'text-[#1F5C3E] border-[#1F5C3E]/20' : 'text-gray-600 hover:text-[#1F5C3E]'}`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Colonna Info/Supporto (4/12) */}
            <div className="md:col-span-4 flex flex-col gap-8 border-t md:border-t-0 md:border-l border-gray-100 pt-8 md:pt-0 md:pl-10">
              <div>
                <div className="flex items-center gap-2 mb-4 text-gray-400">
                  <HelpCircle size={18} />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">Resources</span>
                </div>
                <div className="flex flex-col gap-4">
                  <Link to="/templates" onClick={() => setIsMenuOpen(false)} className="text-[15px] font-bold text-gray-600 no-underline hover:text-[#1F5C3E]">All Templates</Link>
                  <Link to="/help" onClick={() => setIsMenuOpen(false)} className="text-[15px] font-bold text-gray-600 no-underline hover:text-[#1F5C3E]">Help Center</Link>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-[#1F5C3E]">
                  <Mail size={16} />
                  <span className="text-[11px] font-black uppercase tracking-widest">Support</span>
                </div>
                <p className="text-[13px] text-gray-500 font-medium leading-relaxed">
                  Need help with a template? Contact our team.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
