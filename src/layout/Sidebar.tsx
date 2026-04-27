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
    <aside className="w-64 flex flex-col p-6 sticky top-24 self-start bg-white" style={{ marginTop: '40px' }}>
      
      {/* ── CATEGORIES BOX ── */}
      <div className="mb-10">
        <div 
          className="text-white px-4 py-3 font-black text-[10px] uppercase tracking-[0.2em] rounded-sm mb-6"
          style={{ backgroundColor: '#1F5C3E', fontFamily: "'Inter', sans-serif" }}
        >
          Categories
        </div>
        
        <nav className="flex flex-col gap-1">
          {categories.map(cat => (
            <Link 
              key={cat.id} 
              to={`/category/${cat.slug}`} 
              className="text-[12px] font-bold text-gray-600 hover:text-[#1F5C3E] py-2 px-2 hover:bg-[#f5f4ed] rounded-md no-underline transition-all"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* ── VIDEO BOX ── */}
      {settings?.featured_video_id && (
        <div className="mb-10 pt-4 border-t border-gray-50">
          <div 
            className="text-white px-4 py-3 font-black text-[10px] uppercase tracking-[0.2em] rounded-sm mb-4 italic"
            style={{ backgroundColor: '#1F5C3E', fontFamily: "'Inter', sans-serif" }}
          >
            Tutorial
          </div>
          <div className="aspect-video bg-[#f5f4ed] rounded-lg overflow-hidden border border-gray-100 shadow-sm">
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
