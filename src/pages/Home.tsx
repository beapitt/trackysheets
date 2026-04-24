import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";

const GREEN_DARK = "#2D5A27";
const GREEN_MEDIUM = "#198754";
const GREEN_SECTION = "#4a7c2f";

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
        const [tplsRes, catsRes, settingsRes] = await Promise.all([
          supabase.from("templates").select("*").order("created_at", { ascending: false }),
          supabase.from("categories").select("*").order("name", { ascending: true }),
          supabase.from("site_settings").select("*").maybeSingle()
        ]);

        if (tplsRes.data) setTemplates(tplsRes.data);
        if (catsRes.data) setCategories(catsRes.data);
        if (settingsRes.data) setSettings(settingsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTemplates = templates.filter(t => {
    const titleMatch = t.title?.toLowerCase() || "";
    const matchesSearch = titleMatch.includes(searchQuery.toLowerCase());
    const matchesCat = activeCat ? t.category_id === activeCat : true;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-[#333]">
      
      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50 shadow-sm">
        <header style={{ backgroundColor: GREEN_DARK }} className="h-12 flex items-center">
          <div className="max-w-[1060px] mx-auto w-full px-4 flex items-center justify-between">
            
            <Link to="/" className="flex items-center gap-2 no-underline">
              <div className="w-8 h-8 flex items-center justify-center border border-white/30 rounded shadow-lg bg-transparent shrink-0">
                <span className="text-white font-black text-sm uppercase">TS</span>
              </div>
              <div className="flex flex-col leading-none text-left ml-2">
                <span className="text-[15px] font-bold text-white">TrackySheets</span>
                <span className="text-[7.5px] font-medium text-white/80 capitalize mt-0.5 tracking-wider">Smart Trackers & Planners</span>
              </div>
            </Link>

            <div className="flex items-center gap-2 max-w-[320px] w-full mx-4">
              <input 
                type="text" 
                placeholder="Search templates..." 
                className="w-full bg-white border-none rounded-sm px-3 py-1 text-[11px] text-gray-800 outline-none h-7 shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button style={{ backgroundColor: GREEN_SECTION }} className="h-7 px-4 rounded-full text-white text-[10px] font-bold uppercase hover:opacity-90">GO</button>
            </div>

            <Link to="/admin" className="text-[9px] font-bold text-white uppercase border border-white/40 px-3 py-1 rounded-full no-underline hover:bg-white/10 shrink-0">
              Admin
            </Link>
          </div>
        </header>

        <nav style={{ backgroundColor: GREEN_MEDIUM }} className="h-9 flex items-center border-b border-black/10">
          <div className="max-w-[1060px] mx-auto w-full px-4 flex text-[13px] font-bold text-white gap-6">
            <Link to="/" className="no-underline hover:opacity-80">Home</Link>
          </div>
        </nav>
      </div>

      <div className="h-[84px]"></div>

      <div className="max-w-[1060px] mx-auto px-4 py-6 flex flex-col md:flex-row gap-8">
        
        <main className="flex-[0_0_70%] order-2 md:order-1 text-left">
          <div className="bg-white border border-[#ddd] p-[10px_12px] mb-4 leading-[1.4]">
            <h1 className="text-[18px] font-bold mb-2 pb-1 border-b-2" style={{ color: GREEN_DARK, borderColor: GREEN_DARK }}>
              {settings?.site_description_title || 'Spreadsheet Templates, Calculators, and Calendars'}
            </h1>
            <p className="text-[13px] text-[#333]">
              {settings?.site_description_text || 'TrackySheets provides professionally designed spreadsheet templates for business, personal, and home use.'}
            </p>
          </div>

          <section>
            <div style={{ backgroundColor: GREEN_DARK }} className="text-white font-bold text-[13px] p-[5px_10px] mb-4">New Templates</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredTemplates.map(t => (
                <Link key={t.id} to={`/template/${t.slug}`} className="group block bg-white border border-[#ddd] no-underline transition-all hover:border-[#aaa] hover:shadow-sm">
                  <div className="aspect-[16/10] bg-[#f9f9f9] border-b border-[#eee]">
                    <img src={t.thumbnail_url || ""} className="w-full h-full object-contain" alt={t.title} />
                  </div>
                  <div className="p-2">
                    <h4 className="font-bold text-[12px] text-[#2D5A27] leading-tight">{t.title}</h4>
                    <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">Free Download</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>

        <aside className="w-full md:w-[282px] shrink-0 order-1 md:order-2 text-left">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[12px] font-bold text-[#333]">Follow us on</span>
              <a href={settings?.pinterest_url || '#'} className="hover:opacity-80">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#E60023"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.41 7.63 11.17-.1-.95-.19-2.41.04-3.45.21-.93 1.34-5.69 1.34-5.69s-.34-.69-.34-1.7c0-1.6 1.05-2.8 2.08-2.8.98 0 1.46.74 1.46 1.63 0 .99-.63 2.47-.95 3.84-.27 1.15.58 2.08 1.71 2.08 2.05 0 3.63-2.17 3.63-5.3 0-2.77-1.99-4.71-4.83-4.71-3.3 0-5.23 2.47-5.23 5.02 0 1 .38 2.07.86 2.65.09.11.11.21.08.32-.09.37-.28 1.14-.32 1.29-.05.21-.17.25-.39.15-1.45-.67-2.35-2.8-2.35-4.5 0-3.66 2.66-7.02 7.67-7.02 4.03 0 7.17 2.87 7.17 6.72 0 4.01-2.52 7.23-6.02 7.23-1.18 0-2.28-.61-2.66-1.33l-.72 2.76c-.26 1-1 2.25-1.49 3.05C10.12 23.85 11.03 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/></svg>
              </a>
              <a href={settings?.youtube_url || '#'} className="hover:opacity-80">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.5 6.2c-.3-1.1-1.1-1.9-2.2-2.2C19.3 3.5 12 3.5 12 3.5s-7.3 0-9.3.5c-1.1.3-1.9 1.1-2.2 2.2C0 8.2 0 12 0 12s0 3.8.5 5.8c.3 1.1 1.1 1.9 2.2 2.2 2 1.1 9.3 1.1 9.3 1.1s7.3 0 9.3-.5c1.1-.3 1.9-1.1 2.2-2.2.5-2 .5-5.8.5-5.8s0-3.8-.5-5.8zM9.5 15.5V8.5l6.5 3.5-6.5 3.5z"/></svg>
              </a>
            </div>
            
            <div className="border border-[#ddd] bg-white">
              <div style={{ backgroundColor: GREEN_DARK }} className="text-white font-bold text-[12px] p-[8px_12px] uppercase tracking-tight">
                Template Categories
              </div>
              <nav className="flex flex-col">
                {categories.map(cat => (
                  <Link 
                    key={cat.id} 
                    to={`/?cat=${cat.id}`} 
                    className={`group flex items-center justify-between px-3 py-2.5 text-[13px] no-underline border-b border-[#eee] last:border-0 transition-all ${activeCat === cat.id ? "bg-[#f5f8f5] text-[#2D5A27] font-bold" : "text-[#444] hover:bg-[#f9f9f9]"}`}
                  >
                    <span className="flex items-center">
                      <span className="mr-2 text-[#999] text-[10px]">›</span>
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {settings?.homepage_video_url && (
            <div className="border border-[#ddd] bg-white">
              <div style={{ backgroundColor: GREEN_DARK }} className="text-white font-bold text-[12px] p-[8px_12px] uppercase">
                Featured Video
              </div>
              <div className="aspect-video bg-black">
                <iframe width="100%" height="100%" src={settings.homepage_video_url} frameBorder="0" allowFullScreen></iframe>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
