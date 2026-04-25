import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Controllo se l'utente è loggato
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="font-sans w-full">
      {/* Top Bar - Verde Scuro */}
      <div className="bg-[#14532d] text-white py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 no-underline text-white flex-shrink-0">
            <div className="text-xl font-bold bg-white text-[#14532d] px-2 rounded tracking-tighter">TS</div>
            <div>
              <div className="text-sm font-bold leading-none tracking-tight">TrackySheets</div>
              <div className="text-[10px] text-green-200 uppercase tracking-widest mt-1 opacity-80">The Guide to Google Sheets</div>
            </div>
          </Link>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Search templates..." 
                className="w-64 px-4 py-1.5 rounded text-gray-900 text-[13px] outline-none border-none shadow-inner" 
              />
            </div>
            
            {/* Mostra Admin SOLO se l'utente è loggato */}
            {user && (
              <Link to="/admin" className="bg-[#facc15] hover:bg-yellow-500 text-gray-900 font-bold px-4 py-1.5 rounded text-[11px] transition no-underline shadow-sm uppercase tracking-wider">
                ⚙️ Admin
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Nav Bar - Verde Google Sheets */}
      <div className="bg-[#1a8856] border-b border-green-700 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-8 py-2.5">
          <Link to="/" className="text-white text-[11px] font-bold no-underline hover:text-green-100 tracking-[0.2em] transition">HOME</Link>
          <Link to="/templates" className="text-white text-[11px] font-bold no-underline hover:text-green-100 tracking-[0.2em] transition">TEMPLATES</Link>
        </div>
      </div>
    </div>
  );
}
