import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ChevronRight, Search, Youtube, Pin } from "lucide-react";

// MANUS COLORS
const GREEN_DARK = "#2D5A27";
const GREEN_MEDIUM = "#198754";
const GREEN_SECTION = "#4a7c2f";
const GREEN_MINT_HOVER = "#146c43";

export default function Home() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const activeCat = params.get("cat");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Settings, Templates and Categories
        const [tplsRes, catsRes, settingsRes] = await Promise.all([
          supabase.from("templates").select("*").order("created_at", { ascending: false }),
          supabase.from("categories").select("*").order("sort_order", { ascending: true }),
          supabase.from("site_settings").select("*").single()
        ]);

        setTemplates(tplsRes.data || []);
        setCategories(catsRes.data || []);
        setSettings(settingsRes.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCat ? t.category_id === activeCat : true;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-['Arial','Helvetica_Neue',sans-serif] text-[#333]">
      
      {/* 1. HEADER & NAVIGATION */}
      <div className="fixed top-0 left-0 right-0 z-50 shadow-sm">
        <header style={{ backgroundColor: GREEN_DARK }} className="h-12 flex items-center">
          <div className="max-w-[1060px] mx-auto w-full px-4 flex items-center justify-between">
            
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-2.5 no-underline group">
              <div className="w-8 h-8 flex items-center justify-center border border-white/30 rounded-lg shadow-lg bg-transparent">
                <span className="text-white font-black text-sm uppercase">TS</span>
              </div>
              <div className="flex flex-col leading-none text-left">
                <span className="text-[15px] font-bold text-white">{settings?.site_name || 'TrackySheets'}</span>
                <span className="text-[7.5px] font-medium text-white/80 capitalize mt-0.5">Smart Trackers & Planners</span>
              </div>
            </Link>

            {/* Search - Manus Style */}
            <div className="flex items-center gap-2 max-w-[300px] w-full mx-4">
              <input 
                type="text" 
                placeholder="Search templates..." 
                className="w-full bg-white border-none rounded-sm px-3 py-1 text-[11px] text-gray-800 outline-none h-7 shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button style={{ backgroundColor: GREEN_SECTION }} className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white hover:opacity-90">
                <Search size={14} strokeWidth={3} />
              </button>
            </div>

            <Link to="/admin" className="text-[9px] font-bold text-white uppercase border border-white/40 px-3 py-1 rounded-full no-underline hover:bg-white/10">Admin</Link>
          </div>
        </header>

        {/* Top Mint Bar (Medium Green) */}
        <div style={{ backgroundColor: GREEN_MEDIUM }} className="h-auto flex items-center border-b border-black/10">
          <div className="max-w-[1060px] mx-auto w-full flex text-[13px] font-bold text-white overflow-x-auto no-scrollbar">
            <Link to="/" className="px-4 py-2 hover:bg-[#146c43] no-underline">Home</Link>
            {categories.filter(c => c.placement === 'top-menu' || c.placement === 'both').map(cat => (
              <Link key={cat.id} to={`/?cat=${cat.id}`} className="px-4 py-2 hover:bg-[#146c43] no-underline whitespace-nowrap">{cat.name}</Link>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[84px]"></div>

      {/* 2. MAIN LAYOUT GRID */}
      <div className="max-w-[1060px] mx-auto px-4 py-6 flex flex-col md:flex-row gap-4">
        
        {/* LEFT: MAIN CONTENT (70%) */}
        <main className="flex-[0_0_70%] order-2 md:order-1 text-left">
          
          {/* Intro/Hero Block */}
          <div className="bg-white border border-[#ddd] p-[10px_12px] mb-[10px] leading-[1.4]">
            <h1 className="text-[18px] font-bold mb-[10px] pb-1 border-b-2" style={{ color: GREEN_DARK, borderColor: GREEN_DARK }}>
              {settings?.site_description_title}
            </h1>
            <p className="text-[#555] text-[12px] mb-1.5 italic">by {settings?.site_name} — The Guide to Google Sheets & Excel</p>
            <p className="text-[13px] text-[#333] mb-1.5">{settings?.site_description_text}</p>
          </div>

          {/* Template Grid */}
          <section className="mb-6">
            <div style={{ backgroundColor: GREEN_SECTION }} className="text-white font-bold text-[13px] p-[5px_10px] mb-2">
              New Templates
            </div>
            {loading ? (
              <div className="text-center py-10 text-gray-400 text-[12px]">Loading templates...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[10px]">
                {filteredTemplates.map(t => (
                  <Link key={t.id} to={`/template/${t.slug}`} className="group block bg-white border border-[#ddd] overflow-hidden no-underline hover:border-[#aaa] transition-all hover:shadow-[0_1px_4px_rgba(0,0,0,0.12)]">
                    <div className="aspect-[16/10] bg-[#f9f9f9] border-b border-[#eee]">
                      <img src={t.thumbnail_url} className="w-full h-full object-contain" alt={t.title} />
                    </div>
                    <div className="p-[6px_8px]">
                      <h4 className="font-bold text-[12px] text-[#2D5A27] leading-[1.3] mb-[3px] group-hover:underline">{t.title}</h4>
                      <p className="text-[11px] text-[#555] leading-[1.35] uppercase font-bold">Free Download</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </main>

        {/* RIGHT: SIDEBAR (30%) */}
        <aside className="flex-1 order-1 md:order-2 text-left">
          
          {/* Follow Us Section */}
          <div className="mb-[12px]">
            <h3 className="text-[12px] font-medium text-[#333] mb-2 tracking-wide uppercase border-b border-gray-100 pb-1">Follow Us On</h3>
            <div className="flex gap-2 items-center">
              <a href={settings?.pinterest_url || '#'} target="_blank" rel="noopener noreferrer" className="text-[#E60023] hover:opacity-80">
                <Youtube size={20} /> {/* Placeholder for Pinterest SVG */}
              </a>
              <a href={settings?.youtube_url || '#'} target="_blank" rel="noopener noreferrer" className="text-[#FF0000] hover:opacity-80">
                <Youtube size={24} />
              </a>
            </div>
          </div>

          {/* Template Categories */}
          <div className="mb-6">
            <div style={{ backgroundColor: GREEN_DARK }} className="text-white font-bold text-[11px] p-[5px_10px] mb-2 uppercase">
              Template Categories
            </div>
            <nav className="flex flex-col border border-[#ddd] bg-white">
              {categories.filter(c => c.placement === 'sidebar' || c.placement === 'both').map(cat => (
                <Link 
                  key={cat.id} 
                  to={`/?cat=${cat.id}`} 
                  className={`group flex items-center justify-between px-3 py-2 text-[12px] border-b border-[#eee] no-underline transition-all ${activeCat === cat.id ? "bg-[#e8f5e9] text-[#2D5A27] font-bold" : "text-[#333] hover:bg-[#f0f8f0]"}`}
                >
                  <span>{cat.name}</span>
                  <ChevronRight size={10} className={`${activeCat === cat.id ? "opacity-100" : "opacity-30 group-hover:opacity-100"}`} />
                </Link>
              ))}
            </nav>
          </div>

          {/* Featured Video (Dinamico da DB) */}
          {settings?.homepage_video_url && (
            <div className="mt-8">
              <div style={{ backgroundColor: GREEN_DARK }} className="text-white font-bold text-[10px] p-[5px_10px] mb-2 uppercase">
                Featured Tutorial
              </div>
              <div className="aspect-video w-full border border-[#ddd] bg-black">
                <iframe 
                  width="100%" height="100%" 
                  src={settings.homepage_video_url}
                  frameBorder="0" allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}
