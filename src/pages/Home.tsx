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

        setTemplates(tplsRes.data || []);
        setCategories(catsRes.data || []);
        setSettings(settingsRes.data);
      } catch (err) {
        console.error("Error:", err);
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
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-[#333]">
      
      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50 shadow-sm">
        <header style={{ backgroundColor: GREEN_DARK }} className="h-12 flex items-center">
          <div className="max-w-[1060px] mx-auto w-full px-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 no-underline">
              <div className="w-8 h-8 flex items-center justify-center border border-white/30 rounded shadow-lg bg-transparent">
                <span className="text-white font-black text-sm">TS</span>
              </div>
              <div className="flex flex-col leading-none text-left ml-2">
                <span className="text-[15px] font-bold text-white">{settings?.site_name || 'TrackySheets'}</span>
                <span className="text-[7.5px] font-medium text-white/80 uppercase mt-0.5 tracking-wider">Smart Trackers</span>
              </div>
            </Link>

            <div className="flex items-center gap-2 max-w-[280px] w-full">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-white rounded-sm px-3 py-1 text-[11px] outline-none h-7"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button style={{ backgroundColor: GREEN_SECTION }} className="h-7 px-3 rounded-full text-white text-[10px] font-bold">GO</button>
            </div>
          </div>
        </header>

        <nav style={{ backgroundColor: GREEN_MEDIUM }} className="h-9 flex items-center border-b border-black/10">
          <div className="max-w-[1060px] mx-auto w-full px-4 flex text-[13px] font-bold text-white gap-6">
            <Link to="/" className="no-underline hover:opacity-80">Home</Link>
          </div>
        </nav>
      </div>

      <div className="h-[84px]"></div>

      {/* MAIN GRID */}
      <div className="max-w-[1060px] mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        
        <main className="flex-[0_0_70%] order-2 md:order-1 text-left">
          <div className="bg-white border border-[#ddd] p-[10px_12px] mb-4 leading-[1.4]">
            <h1 className="text-[18px] font-bold mb-2 pb-1 border-b-2" style={{ color: GREEN_DARK, borderColor: GREEN_DARK }}>
              {settings?.site_description_title || 'Spreadsheet Templates'}
            </h1>
            <p className="text-[13px] text-[#333]">{settings?.site_description_text}</p>
          </div>

          <section>
            <div style={{ backgroundColor: GREEN_SECTION }} className="text-white font-bold text-[13px] p-[5px_10px] mb-4">New Templates</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(t => (
                <Link key={t.id} to={`/template/${t.slug}`} className="group block bg-white border border-[#ddd] no-underline hover:shadow-md transition-all">
                  <div className="aspect-[16/10] bg-[#f9f9f9]">
                    <img src={t.thumbnail_url} className="w-full h-full object-contain" alt={t.title} />
                  </div>
                  <div className="p-2">
                    <h4 className="font-bold text-[12px] text-[#2D5A27]">{t.title}</h4>
                    <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">Free Download</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>

        <aside className="flex-1 order-1 md:order-2 text-left">
          <div style={{ backgroundColor: "#F9FDF9" }} className="p-4 border border-[#ddd] rounded shadow-sm">
            <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 border-b pb-1">Follow Us On</h3>
            <div className="flex gap-4 mb-8">
              <span className="text-[10px] font-bold text-[#E60023]">PINTEREST</span>
              <span className="text-[10px] font-bold text-[#FF0000]">YOUTUBE</span>
            </div>

            <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 border-b pb-1">Categories</h3>
            <nav className="flex flex-col gap-1">
              {categories.map(cat => (
                <Link 
                  key={cat.id} 
                  to={`/?cat=${cat.id}`} 
                  className={`flex items-center justify-between px-2 py-1.5 text-[12px] no-underline border-b border-gray-50 ${activeCat === cat.id ? "text-[#2D5A27] font-bold bg-white shadow-sm" : "text-gray-600 hover:bg-[#f0f8f0]"}`}
                >
                  <span>{cat.name}</span>
                  <span className="opacity-30">›</span>
                </Link>
              ))}
            </nav>
          </div>
          
          {settings?.homepage_video_url && (
            <div className="mt-6">
              <div style={{ backgroundColor: GREEN_DARK }} className="text-white text-[10px] font-bold p-1 px-2 mb-2 uppercase">Tutorial</div>
              <div className="aspect-video bg-black border border-[#ddd]">
                <iframe width="100%" height="100%" src={settings.homepage_video_url} frameBorder="0" allowFullScreen></iframe>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
