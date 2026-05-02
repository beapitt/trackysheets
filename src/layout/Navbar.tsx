"use client";
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, LayoutGrid, Mail } from 'lucide-react';
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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Templates', path: '/templates' },
    ...categories.slice(0, 3).map(cat => ({ name: cat.name, path: `/category/${cat.slug}` }))
  ];

  const isTemplatePage = location.pathname.startsWith('/template/');
  const currentPageLabel = isTemplatePage ? 'Template' : 'Home';

  return (
    <header className="sticky top-0 z-[100] w-full shadow-md font-inter" style={{ backgroundColor: '#1F5C3E' }}>
      
      {/* BARRA PRINCIPALE */}
      <div className="h-[64px] flex items-center px-4 md:px-10">
        <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          
          <Link to="/" className="flex items-center gap-3 no-underline flex-shrink-0 text-white">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center font-black text-[#1F5C3E] text-lg">TS</div>
            <span className="font-bold text-[19px] hidden sm:block">TrackySheets</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-[500px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 outline-none focus:bg-white/20 transition-all text-sm font-medium"
            />
          </form>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors shrink-0"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* SEGNALAZIONE PAGINA ATTIVA MOBILE - ALLINEATA A SINISTRA */}
      <div className="flex md:hidden h-[34px] items-center bg-black/10 border-t border-white/5">
        <div className="w-full px-4">
          <span className="inline-block text-[10px] font-black text-white uppercase tracking-[0.2em] border-b-2 border-white pb-1">
            {currentPageLabel}
          </span>
        </div>
      </div>

      {/* SUB-NAV DESKTOP */}
      <nav className="hidden md:flex h-[42px] items-center bg-black/10 border-t border-white/5">
        <div className="w-full max-w-[1440px] mx-auto px-10 flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`text-[11px] font-black no-underline uppercase tracking-[0.15em] transition-all pb-1 border-b-2 ${
                  isActive ? 'text-white border-white' : 'text-white/60 border-transparent hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* MENU A SCOMPARSA */}
      {isMenuOpen && (
        <div className="absolute top-[64px] md:top-[106px] left-0 w-full bg-white border-b border-gray-200 shadow-2xl animate-in slide-in-from-top-2 duration-200 text-left">
          <div className="max-w-[1440px] mx-auto px-6 py-8 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-8">
              <div className="flex items-center gap-2 mb-6 text-[#1F5C3E]">
                <LayoutGrid size={18} />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Full Menu</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-1">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className={`text-[15px] font-bold py-2.5 border-b border-gray-50 no-underline ${location.pathname === '/' ? 'text-[#1F5C3E]' : 'text-gray-600'}`}>Home</Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-[15px] font-bold py-2.5 border-b border-gray-50 no-underline ${location.pathname.includes(cat.slug) ? 'text-[#1F5C3E]' : 'text-gray-600'}`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="md:col-span-4 flex flex-col gap-6 border-t md:border-t-0 md:border-l border-gray-100 pt-8 md:pt-0 md:pl-10">
              <Link to="/help" onClick={() => setIsMenuOpen(false)} className="text-[15px] font-bold text-gray-600 no-underline">Help Center</Link>
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#1F5C3E]">Support</span>
                <p className="text-[13px] text-gray-500 font-medium">support@trackysheets.com</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
