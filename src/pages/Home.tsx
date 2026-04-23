import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";

const GREEN_DARK = "#2D5A27";
const GREEN_MINT = "#E8F5E9"; 
const SIDEBAR_MINT = "#F1F9F1"; // Mint ancora più leggero per lo sfondo sidebar

export default function Home() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  
  // Estrae la categoria dalla URL per l'effetto "resta selezionata"
  const params = new URLSearchParams(location.search);
  const activeCat = params.get("cat");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: tpls } = await supabase.from("templates").select("*").order("created_at", { ascending: false });
      const { data: cats } = await supabase.from("categories").select("*").order("name");
      setTemplates(tpls || []);
      setCategories(cats || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCat ? t.category_id === activeCat : true;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* HEADER SECTION */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <header style={{ backgroundColor: GREEN_DARK }} className="h-12 flex items-center shadow-md">
          <div className="max-w-[1100px] mx-auto w-full px-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 shrink-0 no-underline">
              <div className="w-8 h-8 flex items-center justify-center border border-white/30 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.3)] bg-transparent">
                <span className="text-white font-black text-sm">TS</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[15px] font-bold tracking-tight text-white">TrackySheets</span>
                <span className="text-[7.5px] font-medium text-white/80 capitalize tracking-wide mt-0.5">Smart Trackers & Planners</span>
              </div>
            </Link>

            <div className="flex items-center gap-2 max-w-[320px] w-full mx-4">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Search templates..." 
                  className="w-full bg-white border-none rounded-sm px-3 py-1 text-[11px] text-gray-800 outline-none h-7 shadow-inner"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors border border-white/10 shrink-0">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            <Link to="/admin" className="text-[9px] font-bold text-white uppercase tracking-widest no-underline border border-white/40 px-3 py-1 rounded-full hover:bg-white/10 transition-all">
              Admin
            </Link>
          </div>
        </header>

        <div style={{ backgroundColor: GREEN_MINT }} className="h-9 border-b border-green-100 flex items-center">
          <div className="max-w-[1100px] mx-auto w-full px-4 flex gap-6 text-[10px] font-bold text-green-800 uppercase tracking-tight">
            <Link to="/" className="hover:text-green-600 no-underline">Home</Link>
            {categories.slice(0, 5).map(cat => (
              <Link key={cat.id} to={`/?cat=${cat.id}`} className={`hover:text-green-600 no-underline whitespace-nowrap ${activeCat === cat.id ? "text-green-900 underline" : ""}`}>{cat.name}</Link>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[84px]"></div>

      <div className="max-w-[1100px] mx-auto px-4 py-8 flex flex-col md:flex-row gap-10">
        
        {/* LEFT: MAIN CONTENT */}
        <main className="flex-1 order-2 md:order-1">
          <div className="border border-gray-200 p-6 mb-8 bg-white shadow-sm rounded-sm">
            <h1 className="text-xl font-bold text-[#2D5A27] mb-2 leading-tight">
              Spreadsheet Templates, Calculators, and Calendars
            </h1>
            <p className="text-gray-400 text-[9px] mb-3 uppercase tracking-tighter font-bold">by TrackySheets — The Guide to Google Sheets</p>
            <p className="text-[13px] leading-relaxed text-gray-700">
              TrackySheets provides professionally designed spreadsheet templates for business, personal, and home use. 
              Our collection is optimized for Google Sheets and available for free.
            </p>
          </div>

          <section>
            <div className="bg-[#2D5A27] text-white font-bold text-[9px] px-3 py-1.5 mb-6 uppercase tracking-widest">
              New Templates
            </div>
            {loading ? (
              <div className="text-center py-10 text-gray-300 text-[10px]">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {filteredTemplates.map(t => (
                  <Link key={t.id} to={`/template/${t.slug}`} className="group block no-underline h-full">
                    <div className="aspect-video bg-gray-50 overflow-hidden border border-gray-100 mb-2 group-hover:shadow-md transition-all">
                      <img src={t.thumbnail_url} className="w-full h-full object-cover" alt={t.title} />
                    </div>
                    <h4 className="font-bold text-[14px] leading-tight text-gray-800 group-hover:text-[#2D5A27] no-underline">{t.title}</h4>
                    <p className="text-[9px] font-black text-green-700 mt-1 uppercase">Free Download</p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </main>

        {/* RIGHT: SIDEBAR RIFINITA */}
        <aside className="w-full md:w-60 shrink-0 order-1 md:order-2">
          <div style={{ backgroundColor: SIDEBAR_MINT }} className="p-5 rounded-lg border border-green-50 shadow-sm">
            
            {/* FOLLOW US ON */}
            <div className="mb-10">
              <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-[0.1em] border-b border-gray-200 pb-1">Follow Us On</h3>
              <div className="flex gap-4">
                {/* Pinterest */}
                <a href="#" className="hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-[#E60023]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.41 7.63 11.17-.1-.95-.19-2.41.04-3.45.21-.93 1.34-5.69 1.34-5.69s-.34-.69-.34-1.7c0-1.6 1.05-2.8 2.08-2.8.98 0 1.46.74 1.46 1.63 0 .99-.63 2.47-.95 3.84-.27 1.15.58 2.08 1.71 2.08 2.05 0 3.63-2.17 3.63-5.3 0-2.77-1.99-4.71-4.83-4.71-3.3 0-5.23 2.47-5.23 5.02 0 1 .38 2.07.86 2.65.09.11.11.21.08.32-.09.37-.28 1.14-.32 1.29-.05.21-.17.25-.39.15-1.45-.67-2.35-2.8-2.35-4.5 0-3.66 2.66-7.02 7.67-7.02 4.03 0 7.17 2.87 7.17 6.72 0 4.01-2.52 7.23-6.02 7.23-1.18 0-2.28-.61-2.66-1.33l-.72 2.76c-.26 1-1 2.25-1.49 3.05C10.12 23.85 11.03 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/></svg>
                </a>
                {/* YouTube */}
                <a href="#" className="hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.5 6.2c-.3-1.1-1.1-1.9-2.2-2.2C19.3 3.5 12 3.5 12 3.5s-7.3 0-9.3.5c-1.1.3-1.9 1.1-2.2 2.2C0 8.2 0 12 0 12s0 3.8.5 5.8c.3 1.1 1.1 1.9 2.2 2.2 2 1.1 9.3 1.1 9.3 1.1s7.3 0 9.3-.5c1.1-.3 1.9-1.1 2.2-2.2.5-2 .5-5.8.5-5.8s0-3.8-.5-5.8zM9.5 15.5V8.5l6.5 3.5-6.5 3.5z"/></svg>
                </a>
              </div>
            </div>

            {/* TEMPLATE CATEGORIES */}
            <div>
              <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-[0.1em] border-b border-gray-200 pb-1">Template Categories</h3>
              <nav className="flex flex-col gap-1">
                <Link to="/" className={`text-[13px] px-2 py-1.5 rounded no-underline transition-colors ${!activeCat ? "text-[#2D5A27] font-black bg-white/50 shadow-sm" : "text-gray-600 hover:text-[#2D5A27]"}`}>
                  All Sheets
                </Link>
                {categories.map(cat => (
                  <Link 
                    key={cat.id} 
                    to={`/?cat=${cat.id}`} 
                    className={`text-[13px] px-2 py-1.5 rounded no-underline transition-colors ${activeCat === cat.id ? "text-[#2D5A27] font-black bg-white/50 shadow-sm" : "text-gray-600 hover:text-[#2D5A27]"}`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
