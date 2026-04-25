import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
export default function Sidebar() {
  const [categories, setCategories] = useState<any[]>([]);
  const [video, setVideo] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data: cats } = await supabase.from('categories').select('*').order('name');
        if (cats) setCategories(cats);
        
        const { data: sett } = await supabase.from('settings').select('featured_video_id').single();
        if (sett) setVideo(sett.featured_video_id);
      } catch (err) {
        console.error('Error loading sidebar data:', err);
      }
    };
    getData();
  }, []);

  return (
    <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white min-h-screen font-sans text-left">
      {/* Category Header */}
      <div className="bg-[#14532d] text-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em]">
        Template Categories
      </div>
      
      {/* Category List */}
      <nav className="p-2">
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
          <div className="p-4 text-[12px] text-gray-400 italic">No categories found</div>
        )}
      </nav>

      {/* Featured Video Section */}
      {video && (
        <div className="mt-6 border-t border-gray-100">
          <div className="bg-[#14532d] text-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em]">
            Featured Video
          </div>
          <div className="p-4">
            <div className="aspect-video bg-black rounded-sm overflow-hidden shadow-sm border border-gray-200">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${video}`} 
                frameBorder="0" 
                allowFullScreen 
              />
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2 font-bold uppercase tracking-widest">
              Spreadsheet Tutorial
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
