import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Sidebar() {
  const [categories, setCategories] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      const { data: cats } = await supabase.from('categories').select('*').order('name');
      if (cats) setCategories(cats);
      const { data: sett } = await supabase.from('settings').select('*').single();
      if (sett) setSettings(sett);
    };
    getData();
  }, []);

  return (
    <aside className="w-64 flex-shrink-0 border-l border-gray-200 bg-white min-h-screen font-sans text-left">
      <div className="p-6 bg-gray-50 border-b border-gray-100 text-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Follow us on</p>
        <div className="flex justify-center gap-6">
          {settings?.pinterest_url && (
            <a href={settings.pinterest_url} target="_blank" rel="noopener noreferrer">
              <svg className="w-6 h-6 fill-[#E60023] hover:scale-110 transition" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.17-.1-.95-.19-2.4.04-3.44.21-.93 1.34-5.69 1.34-5.69s-.34-.69-.34-1.71c0-1.6 0.93-2.8 2.09-2.8 0.98 0 1.46.74 1.46 1.63 0 .99-.63 2.47-.96 3.84-.27 1.15.58 2.08 1.71 2.08 2.05 0 3.63-2.16 3.63-5.28 0-2.76-1.98-4.69-4.81-4.69-3.28 0-5.21 2.46-5.21 5.01 0 .99.38 2.05.86 2.63.1.12.11.22.08.33-.09.37-.29 1.16-.33 1.32-.05.21-.17.26-.39.16-1.44-.67-2.34-2.78-2.34-4.48 0-3.64 2.65-6.99 7.63-6.99 4.01 0 7.12 2.85 7.12 6.67 0 3.98-2.51 7.18-5.99 7.18-1.17 0-2.27-.61-2.65-1.33 0 0-.58 2.21-.72 2.76-.26 1-0.96 2.25-1.43 3.03 1.12.35 2.31.54 3.54.54 6.63 0 12-5.37 12-12S18.63 0 12 0z"/></svg>
            </a>
          )}
          {settings?.youtube_url && (
            <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer">
              <svg className="w-6 h-6 fill-[#FF0000] hover:scale-110 transition" viewBox="0 0 24 24"><path d="M23.5 6.2c-.3-1.1-1.1-1.9-2.2-2.2C19.3 3.5 12 3.5 12 3.5s-7.3 0-9.3.5c-1.1.3-1.9 1.1-2.2 2.2C0 8.2 0 12.3 0 12.3s0 4.1.5 6.1c.3 1.1 1.1 1.9 2.2 2.2 2 1 9.3 1 9.3 1s7.3 0 9.3-.5c1.1-.3 1.9-1.1 2.2-2.2.5-2 .5-6.1.5-6.1s0-4.1-.5-6.1zM9.5 15.5V9l6.5 3.2-6.5 3.3z"/></svg>
            </a>
          )}
        </div>
      </div>

      <div className="bg-[#14532d] text-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em]">Template Categories</div>
      <nav className="p-2 border-b border-gray-100">
        {categories.map(cat => (
          <Link key={cat.id} to={`/category/${cat.slug}`} className="flex items-center gap-2 text-gray-700 hover:text-[#1a8856] py-2 px-3 no-underline text-[13px] hover:bg-green-50 transition border-b border-gray-50 last:border-0 uppercase font-bold tracking-tight">
            <span className="text-[#1a8856] leading-none">›</span>{cat.name}
          </Link>
        ))}
      </nav>
      {settings?.featured_video_id && (
        <div className="mt-6 p-4">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Tutorial Video</div>
          <div className="aspect-video bg-black rounded shadow-md overflow-hidden border border-gray-200">
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${settings.featured_video_id}`} frameBorder="0" allowFullScreen />
          </div>
        </div>
      )}
    </aside>
  );
}
