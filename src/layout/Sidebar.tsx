import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Settings {
  featured_video_id: string;
  pinterest_url: string;
  youtube_url: string;
}

export default function Sidebar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories from Supabase
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name', { ascending: true });

      if (categoriesData) {
        setCategories(categoriesData);
        setFilteredCategories(categoriesData);
      }

      // Fetch settings for featured video and social links
      const { data: settingsData } = await supabase
        .from('settings')
        .select('featured_video_id, pinterest_url, youtube_url')
        .single();

      if (settingsData) {
        setSettings(settingsData);
      }
    } catch (err) {
      console.error('Error fetching sidebar data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = categories.filter(cat =>
      cat.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  if (loading) {
    return (
      <div className="w-64 p-8 text-[10px] font-black uppercase tracking-widest text-gray-400 font-sans">
        Loading...
      </div>
    );
  }

  return (
    <aside className="w-64 flex flex-col font-sans sticky top-24 self-start bg-white">
      
      {/* ── SECTION: CATEGORIES ── */}
      <div className="mb-10">
        {/* Header box in Dark Green #1F5C3E */}
        <div className="bg-[#1F5C3E] text-white px-4 py-3 font-black text-[10px] uppercase tracking-[0.2em] rounded-sm mb-4">
          Categories
        </div>

        {/* Search input with Warm Cream #f5f4ed */}
        <div className="px-1 mb-4 relative">
          <input
            type="text"
            placeholder="Filter categories..."
            value={searchTerm}
            onChange={e => handleSearch(e.target.value)}
            className="w-full bg-[#f5f4ed] border border-gray-100 rounded-md py-2.5 px-3 pl-8 text-[11px] font-semibold outline-none focus:border-[#1F5C3E] transition-all"
          />
          <span className="absolute left-3 top-3 text-gray-400 text-[10px]">🔍</span>
        </div>

        {/* Interactive category list */}
        <nav className="flex flex-col gap-0.5 px-1 max-h-[400px] overflow-y-auto custom-sidebar-scroll">
          {filteredCategories.map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group flex items-center justify-between text-gray-600 hover:text-[#1F5C3E] py-2 px-3 rounded-md hover:bg-[#EAF3DE] transition-all no-underline"
            >
              <span className="text-[12px] font-bold tracking-tight">{cat.name}</span>
              <span className="text-[10px] text-gray-300 group-hover:text-[#1F5C3E] opacity-0 group-hover:opacity-100 transition-all">→</span>
            </Link>
          ))}
          {filteredCategories.length === 0 && (
            <p className="text-[10px] text-gray-400 px-3 italic">No results found</p>
          )}
        </nav>
      </div>

      {/* ── SECTION: FEATURED VIDEO ── */}
      {settings?.featured_video_id && (
        <div className="mb-10">
          <div className="bg-[#1F5C3E] text-white px-4 py-3 font-black text-[10px] uppercase tracking-[0.2em] rounded-sm mb-4">
            Video Tutorial
          </div>
          <div className="p-1 bg-[#f5f4ed] rounded-lg border border-gray-100 shadow-sm">
            <div className="aspect-video rounded-md overflow-hidden bg-black">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${settings.featured_video_id}`}
                title="Tutorial Video"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION: SOCIAL BADGES (Official Look) ── */}
      <div className="px-1 border-t border-gray-50 pt-8">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Follow Us</h4>
        <div className="flex flex-col gap-2">
          {settings?.pinterest_url && (
            <a
              href={settings.pinterest_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 bg-[#f5f4ed] border border-gray-100 rounded-lg hover:border-[#E60023] transition-all no-underline group"
            >
              <div className="w-6 h-6 bg-[#E60023] text-white rounded flex items-center justify-center text-[10px] font-black shadow-sm">P</div>
              <span className="text-[11px] font-black text-gray-700 group-hover:text-[#E60023]">Pinterest</span>
            </a>
          )}
          {settings?.youtube_url && (
            <a
              href={settings.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 bg-[#f5f4ed] border border-gray-100 rounded-lg hover:border-[#FF0000] transition-all no-underline group"
            >
              <div className="w-6 h-6 bg-[#FF0000] text-white rounded flex items-center justify-center text-[10px] font-black shadow-sm">Y</div>
              <span className="text-[11px] font-black text-gray-700 group-hover:text-[#FF0000]">YouTube</span>
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}
