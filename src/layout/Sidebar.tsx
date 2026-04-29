import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MonitorPlay } from 'lucide-react';

export default function Sidebar() {
  const [categories, setCategories] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: cat } = await supabase.from('categories').select('*').order('name');
      const { data: set } = await supabase.from('settings').select('*').maybeSingle();
      if (cat) setCategories(cat);
      if (set) setSettings(set);
    }
    fetchData();
  }, []);

  return (
    <aside 
      className="hidden lg:flex flex-col gap-10 pl-8 border-l border-gray-50"
      style={{ position: 'sticky', top: '124px', height: 'fit-content', width: '260px' }}
    >
      {/* CATEGORIES */}
      <div className="flex flex-col gap-4">
        <div className="bg-[#1F5C3E] text-white py-2 px-4 rounded-md text-center">
          <span className="text-[11px] font-black uppercase tracking-widest">Categories</span>
        </div>
        <nav className="flex flex-col gap-1">
          {categories.map(cat => (
            <Link key={cat.id} to={`/category/${cat.slug}`} className="text-[12px] font-bold text-gray-500 hover:text-[#1F5C3E] no-underline py-2 border-b border-gray-50 transition-colors">
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* VIDEO */}
      {settings?.youtube_url && (
        <div className="w-full">
          <div className="aspect-video bg-black rounded-xl overflow-hidden border border-gray-100 shadow-lg mb-3">
             <iframe width="100%" height="100%" src={settings.youtube_url.replace('watch?v=', 'embed/')} frameBorder="0" allowFullScreen></iframe>
          </div>
          <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#374151]">
            <MonitorPlay size={16} /> Video Guide
          </h4>
        </div>
      )}
    </aside>
  );
}
