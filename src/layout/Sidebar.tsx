import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Sidebar() {
  const [categories, setCategories] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      const { data: cats } = await supabase.from('categories').select('*').order('name');
      const { data: sett } = await supabase.from('settings').select('*').single();
      if (cats) setCategories(cats);
      if (sett) setSettings(sett);
    };
    getData();
  }, []);

  return (
    <aside className="w-64 flex-shrink-0 font-sans mt-10 ml-8 text-left"> {/* mt-10 crea lo spazio dall'header */}
      <div className="bg-gray-100 border-b border-gray-200 py-3 px-4 mb-6 flex items-center gap-3">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Follow us on</span>
        <div className="flex gap-2">
           {/* Icone Social Qui */}
        </div>
      </div>

      <div className="px-4">
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Categories</h3>
        <nav className="flex flex-col gap-3 text-left">
          {categories.map(cat => (
            <Link key={cat.id} to={`/category/${cat.slug}`} className="text-gray-600 hover:text-[#1a8856] text-[13px] no-underline transition font-semibold">
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
