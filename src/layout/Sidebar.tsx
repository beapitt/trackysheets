import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Sidebar() {
  const [categories, setCategories] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data: cats } = await supabase.from('categories').select('*').order('name');
        if (cats) setCategories(cats);
        
        const { data: sett } = await supabase.from('settings').select('*').single();
        if (sett) setSettings(sett);
      } catch (err) {
        console.error('Error loading sidebar data:', err);
      }
    };
    getData();
  }, []);

  return (
    <aside className="w-64 flex-shrink-0 border-l border-gray-200 bg-white min-h-screen font-sans text-left">
      
      {/* SOCIAL SECTION - In cima alla Sidebar */}
      <div className="bg-gray-50 border-b border-gray-100 p-4 flex justify-around items-center">
        {settings?.pinterest_url && (
          <a href={settings.pinterest_url} target="_blank" rel="noopener noreferrer" className="no-underline group">
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl group-hover:scale-110 transition-transform">📌</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Pinterest</span>
            </div>
          </a>
        )}
        {settings?.youtube_url && (
          <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="no-underline group">
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl group-hover:scale-110 transition-transform">▶️</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">YouTube</span>
            </div>
          </a>
        )}
      </div>

      {/* Category Header */}
      <div className="bg-[#14532d] text-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em]">
        Template Categories
      </div>
      
      {/* Category List */}
      <nav className="p-2 border-b border-gray-100">
        {categories.length > 0 ? (
          categories.map(cat => (
            <Link 
              key={cat.id} 
              to={`/category/${cat.slug}`} 
              className="flex items-center gap-2 text-gray-700 hover:text-[#1a8856] py-1.5 px-3 no-underline text-[13px] hover:bg-green-50 transition border-b border-gray-50 last:border-0"
            >
              <span className="text-[#1a8856] font-bold text-lg leading-none">›</span>
              {cat.name}
            </Link>
          ))
        ) : (
          <div className="p-4 text-[12px] text-gray-400 italic text-center">No categories found</div>
        )}
      </nav>

      {/* Featured Video Section */}
      {settings?.featured_video_id && (
        <div className="mt-4">
          <div className="bg-[#14532d] text-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em]">
            Tutorial Video
          </div>
          <div className="p-4 bg-gray-50">
            <div className="aspect-video bg-black rounded-sm overflow-hidden shadow-sm border border-gray-200">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${settings.featured_video_id}`} 
                frameBorder="0" 
                allowFullScreen 
              />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
