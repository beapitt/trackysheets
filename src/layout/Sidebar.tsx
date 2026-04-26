import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface SidebarProps {
  videoId?: string;
  templateData?: any;
}

export default function Sidebar({ videoId, templateData }: SidebarProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const { slug } = useParams();

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('*').order('name');
      if (data) setCategories(data);
    }
    fetchCategories();
  }, []);

  // Video ID di default per la Home se non ne viene passato uno specifico
  const currentVideoId = videoId || "TENAbUa-R-w"; 

  return (
    <aside className="w-80 flex-shrink-0 font-sans py-8 pr-8 border-r border-gray-50 bg-white">
      <div className="sticky top-6 space-y-10">
        
        {/* VIDEO TUTORIAL */}
        <div className="rounded-xl overflow-hidden shadow-md border border-gray-100 bg-gray-50 p-1">
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${currentVideoId}`} frameBorder="0" allowFullScreen />
          </div>
          <p className="text-[10px] font-bold text-[#1a8856] uppercase tracking-widest text-center py-2 m-0">Video Tutorial</p>
        </div>

        {/* CATEGORIES HEADER - NO ITALIC */}
        <div>
          <div className="bg-[#14532d] py-2 px-4 mb-4 rounded shadow-sm">
            <h3 className="text-white text-[10px] font-black uppercase tracking-[0.2em] m-0">Categories</h3>
          </div>
          
          {/* SEARCH BOX RIFINITA (Claude Style) */}
          <div className="mb-4 relative px-1">
            <input 
              type="text" 
              placeholder="Filter categories..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[11px] outline-none focus:border-[#1a8856] transition-all shadow-sm pl-8" 
            />
            <span className="absolute left-3.5 top-3 text-gray-400">🔍</span>
          </div>

          <nav className="flex flex-col gap-1">
            {categories.map(cat => {
              const isActive = slug === cat.slug;
              return (
                <Link 
                  key={cat.id} 
                  to={`/category/${cat.slug}`} 
                  className={`text-[12px] no-underline py-2.5 px-4 rounded-lg transition-all flex items-center justify-between ${
                    isActive 
                    ? 'bg-[#1a8856] text-white font-black shadow-md' 
                    : 'text-gray-500 hover:bg-[#f0fdf4] hover:text-[#1a8856] font-semibold'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[9px] ${isActive ? 'text-green-100' : 'text-gray-300'}`}>12</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* FOLLOW US ON - SISTEMATO */}
        <div>
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5 pl-1">Follow us on</h3>
          <div className="flex gap-6 items-center pl-2">
            <a href="#" className="hover:opacity-70 transition-opacity"><img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png" className="w-7 h-7" alt="Pinterest" /></a>
            <a href="#" className="hover:opacity-70 transition-opacity"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" className="w-14 h-auto" alt="YouTube" /></a>
          </div>
        </div>
      </div>
    </aside>
  );
}
