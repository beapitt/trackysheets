import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const GREEN_DARK = "#2D5A27";
const GREEN_MINT = "#E8F5E9"; 

export default function Home() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredTemplates = templates.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* HEADER SECTION - FIXED */}
      <div className="fixed top-0 left-0 right-0 z-50">
        
        {/* DARK BAR (h-12 = compact but comfortable) */}
        <header style={{ backgroundColor: GREEN_DARK }} className="h-12 flex items-center shadow-md">
          <div className="max-w-[1100px] mx-auto w-full px-4 flex items-center justify-between gap-4">
            
            {/* 1. LOGO SECTION */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 no-underline">
              {/* Highlighted TS with shadow and transparent-white border */}
              <div className="w-8 h-8 flex items-center justify-center border border-white/30 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.3)] bg-transparent">
                <span className="text-white font-black text-sm">TS</span>
              </div>
              <div className="flex flex-col leading-none">
                {/* Correct Capitalization: TrackySheets */}
                <span className="text-[16px] font-bold tracking-tight text-white">
                  TrackySheets
                </span>
                {/* Slogan */}
                <span className="text-[7.5px] font-medium text-white/80 capitalize tracking-wide mt-0.5">
                  Smart Trackers & Planners
                </span>
              </div>
            </Link>

            {/* 2. SEARCH BAR SECTION - White, short, with icon */}
            <div className="flex-1 max-w-[280px] relative">
              <input 
                type="text" 
                placeholder="Search templates..." 
                className="w-full bg-white border border-white/20 rounded-lg pl-3 pr-8 py-1.5 text-[11px] text-gray-800 placeholder:text-gray-400 outline-none shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/* Magnifying glass icon inside input */}
              <div className="absolute right-2.5 top-2 text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>

            {/* 3. ADMIN BUTTON - Highlighted with border */}
            <Link to="/admin" className="text-[10px] font-bold text-white uppercase tracking-widest no-underline border border-white/40 px-3.5 py-1.5 rounded-full hover:bg-white/10 hover:border-white/60 transition-all">
              Admin
            </Link>
          </div>
        </header>

        {/* MINT BAR (Attached to Dark Bar) */}
        <div style={{ backgroundColor: GREEN_MINT }} className="h-9 border-b border-green-100 flex items-center shadow-inner">
          <div className="max-w-[1100px] mx-auto w-full px-4 flex gap-6 text-[10px] font-bold text-green-800 uppercase tracking-tight">
            <Link to="/" className="hover:text-green-600 no-underline">Home</Link>
            {categories.slice(0, 5).map(cat => (
              <Link key={cat.id} to={`/?cat=${cat.id}`} className="hover:text-green-600 no-underline whitespace-nowrap">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* SPACER (Compensate fixed header) */}
      <div className="h-[84px]"></div>

      {/* CONTENT AREA */}
      <div className="max-w-[1100px] mx-auto px-4 py-8 flex gap-8">
        
        {/* SIDEBAR */}
        <aside className="w-40 shrink-0 hidden md:block">
          <h3 className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest border-b pb-1">Templates</h3>
          <nav className="flex flex-col gap-1">
            {categories.map(cat => (
              <Link key={cat.id} to={`/?cat=${cat.id}`} className="text-[12px] text-gray-600 hover:text-[#2D5A27] font-medium no-underline hover:underline">
                {cat.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main className="flex-1">
          <div className="border border-gray-200 p-6 mb-8 bg-white shadow-sm rounded-sm">
            <h1 className="text-xl font-bold text-[#2D5A27] mb-2 leading-tight">
              Spreadsheet Templates, Calculators, and Calendars
            </h1>
            <p className="text-gray-400 text-[9px] mb-3">by TrackySheets — The Guide to Google Sheets</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                {filteredTemplates.map(t => (
                  <Link key={t.id} to={`/template/${t.slug}`} className="group block no-underline h-full">
                    <div className="aspect-video bg-gray-50 overflow-hidden border border-gray-100 mb-2 group-hover:shadow-md transition-all">
                      <img src={t.thumbnail_url} className="w-full h-full object-cover" alt={t.title} />
                    </div>
                    <h4 className="font-bold text-[14px] leading-tight text-gray-800 group-hover:text-[#2D5A27] no-underline transition-colors">{t.title}</h4>
                    <p className="text-[9px] font-black text-green-700 mt-1 uppercase">Free Download</p>
                  </Link>
                ))}
                {filteredTemplates.length === 0 && (
                  <div className="col-span-3 text-center py-16 text-gray-400 text-sm">No templates found matching your search.</div>
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
