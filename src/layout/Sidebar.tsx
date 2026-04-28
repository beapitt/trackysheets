import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Sidebar() {
  const [categories, setCategories] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: cat } = await supabase.from('categories').select('*').order('name');
      const { data: set } = await supabase.from('settings').select('*').single();
      if (cat) setCategories(cat);
      if (set) setSettings(set);
    }
    fetchData();
  }, []);

  return (
    <aside className="w-full flex flex-col sticky top-10 self-start">
      
      {/* ── CATEGORIES BOX ── */}
      <div className="mb-10">
        <div 
          className="text-white px-5 py-3 font-bold text-[11px] uppercase tracking-[0.2em] rounded-sm mb-4"
          style={{ backgroundColor: '#1F5C3E', fontFamily: "'Inter', sans-serif" }}
        >
          All Templates
        </div>
        
        <nav className="flex flex-col">
          {categories.map(cat => (
            <Link 
              key={cat.id} 
              to={`/category/${cat.slug}`} 
              className="text-[13px] font-bold text-gray-500 hover:text-[#1F5C3E] py-2.5 px-2 hover:bg-[#f5f4ed] rounded-md no-underline transition-all border-b border-gray-50 last:border-0"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* ── VIDEO BOX ── */}
      {settings?.featured_video_id && (
        <div className="mb-10">
          <div 
            className="text-white px-5 py-3 font-bold text-[11px] uppercase tracking-[0.2em] rounded-sm mb-4 italic"
            style={{ backgroundColor: '#1F5C3E', fontFamily: "'Inter', sans-serif" }}
          >
            Tutorial
          </div>
          <div className="aspect-video bg-[#f5f4ed] rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${settings.featured_video_id}`} 
              frameBorder="0" 
              allowFullScreen 
            />
          </div>
        </div>
      )}
    </aside>
  );
}
