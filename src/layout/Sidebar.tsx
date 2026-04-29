import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Search, MonitorPlay, ArrowRight } from 'lucide-react';

const PinterestIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#E60023"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.947-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.22 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24 18.637 24 24 18.632 24 12.012 24 5.39 18.637 0 12.017 0z"/></svg>
);

const YouTubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);

export default function Sidebar() {
  const { slug } = useParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { data: cData } = await supabase.from('categories').select('*').order('name');
      const { data: sData } = await supabase.from('settings').select('*').maybeSingle();
      if (cData) setCategories(cData);
      if (sData) setSettings(sData);
    }
    fetchData();
  }, []);

  const getYouTubeID = (url: string) => {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\??v?=?))([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const videoId = settings?.youtube_url ? getYouTubeID(settings.youtube_url) : null;
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="w-[320px] flex-shrink-0 flex flex-col gap-8" style={{ position: 'sticky', top: '130px', alignSelf: 'flex-start' }}>
      
      {/* BOX VIDEO */}
      {videoId && (
        <div>
          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-xl mb-3">
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen></iframe>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <MonitorPlay size={14} /> Video Guide
          </div>
        </div>
      )}

      {/* CATEGORIE E RICERCA */}
      <div className="flex flex-col gap-4">
        <div className="bg-[#1F5C3E] text-white py-3 px-5 rounded-lg font-bold text-[11px] uppercase tracking-widest text-left">
          Categories
        </div>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search categories..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#f5f4ed] border border-gray-100 rounded-lg py-2 pl-9 pr-4 text-xs font-bold text-gray-600 outline-none focus:ring-1 focus:ring-[#1F5C3E]" 
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={13} />
        </div>

        <div className="flex flex-col gap-0.5">
          {filteredCategories.slice(0, 15).map((cat) => (
            <Link 
              key={cat.id} 
              to={`/category/${cat.slug}`} 
              className={`text-[12px] font-bold no-underline py-2 border-b border-gray-50 hover:bg-gray-50 px-2 rounded-md transition-all text-left ${cat.slug === slug ? 'text-[#1F5C3E] bg-gray-50' : 'text-gray-500'}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* SOCIAL */}
      <div className="pt-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-3 text-left">Follow us on</p>
        <div className="flex flex-col gap-2">
          <a href="#" className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-2.5 hover:bg-gray-50 no-underline shadow-sm transition-all group">
            <div className="flex items-center gap-3">
              <PinterestIcon />
              <span className="text-[13px] font-bold text-gray-800">Pinterest</span>
            </div>
            <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1 group-hover:text-[#1F5C3E]">Follow <ArrowRight size={12} /></span>
          </a>
          <a href="#" className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-2.5 hover:bg-gray-50 no-underline shadow-sm transition-all group">
            <div className="flex items-center gap-3">
              <YouTubeIcon />
              <span className="text-[13px] font-bold text-gray-800">YouTube</span>
            </div>
            <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1 group-hover:text-[#FF0000]">Subscribe <ArrowRight size={12} /></span>
          </a>
        </div>
      </div>
    </aside>
  );
}
