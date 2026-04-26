import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface SidebarProps {
  videoId?: string;
}

export default function Sidebar({ videoId }: SidebarProps) {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('*').order('name');
      if (data) setCategories(data);
    }
    fetchCategories();
  }, []);

  // Pulizia dell'ID YouTube (estrae l'ID anche se incolli il link intero)
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  const cleanVideoId = getYouTubeId(videoId || '');

  return (
    <aside className="w-72 flex-shrink-0 font-sans py-8 pr-8 border-r border-gray-50 bg-white">
      {/* SOCIAL SECTION */}
      <div className="mb-10">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Follow TrackySheets</h3>
        <div className="flex gap-4 items-center">
          <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:opacity-70 transition">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png" className="w-5 h-5" alt="Pinterest" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:opacity-70 transition">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" className="w-10 h-auto" alt="YouTube" />
          </a>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="mb-10">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Categories</h3>
        <nav className="flex flex-col gap-2">
          {categories.map(cat => (
            <Link key={cat.id} to={`/category/${cat.slug}`} className="text-gray-600 hover:text-[#1a8856] text-[14px] font-semibold no-underline py-1 transition-colors">
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* VIDEO TUTORIAL - SPOSTATO QUI */}
      {cleanVideoId && (
        <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <h3 className="text-[10px] font-black text-[#1a8856] uppercase tracking-[0.2em] mb-3 text-center">Video Tutorial</h3>
          <div className="aspect-video rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <iframe 
              width="100%" height="100%" 
              src={`https://www.youtube.com/embed/${cleanVideoId}`} 
              frameBorder="0" allowFullScreen 
            />
          </div>
        </div>
      )}
    </aside>
  );
}
