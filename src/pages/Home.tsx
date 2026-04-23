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

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* 1. HEADER UNIFICATO (DARK + MINT) */}
      <div className="sticky top-0 z-50 shadow-sm">
        
        {/* BARRA SCURA (Logo, Search, Admin) */}
        <header style={{ backgroundColor: GREEN_DARK }} className="h-20">
          <div className="max-w-[1100px] mx-auto px-4 h-full flex items-center justify-between">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 flex items-center justify-center rounded bg-white text-[#2D5A27] font-black text-lg">TS</div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black tracking-tighter text-white">
                  Tracky<span className="text-green-200">Sheets</span>
                </span>
                <span className="text-[10px] font-medium text-green-100 mt-1 capitalize">
                  Smart Trackers & Planners
                </span>
              </div>
            </Link>

            {/* Search Bar centrale */}
            <div className="flex-1 max-w-sm mx-8">
              <input 
                type="text" 
                placeholder="Search templates..." 
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm text-white placeholder:text-green-200 outline-none focus:bg-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Admin Button */}
            <Link to="/admin" className="text-[11px] font-black text-white/70 hover:text-white uppercase tracking-widest border border-white/20 px-3 py-1 rounded">
              Admin
            </Link>
          </div>
        </header>

        {/* BARRA MINT (Attaccata alla scura) */}
        <div style={{ backgroundColor: GREEN_MINT }} className="border-b border-green-100">
          <div className="max-w-[1100px] mx-auto px-4 py-3 flex gap-6 text-[12px] font-bold text-green-800">
            <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
            {categories.slice(0, 5).map(cat => (
              <Link key={cat.id} to={`/?cat=${cat.id}`} className="hover:text-green-600 transition-colors whitespace-nowrap">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 2. CONTENUTO PAGINA */}
      <div className="max-w-[1100px] mx-auto px-4 py-10 flex gap-10">
        
        {/* SIDEBAR */}
        <aside className="w-52 shrink-0 hidden md:block">
          <h3 className="text-[11px] font-black uppercase text-gray-400 mb-4 tracking-widest border-b pb-2">Templates</h3>
          <nav className="flex flex-col gap-2">
            {categories.map(cat => (
              <Link key={cat.id} to={`/?cat=${cat.id}`} className="text-[13px] text-gray-600 hover:text-[#2D5A27] font-medium">
                {cat.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main className="flex-1">
          
          {/* INTRO BOX */}
          <div className="border border-gray-200 p-8 mb-10 bg-white shadow-sm rounded-sm">
            <h1 className="text-2xl font-bold text-[#2D5A27] mb-3">
              Spreadsheet Templates, Calculators, and Calendars
            </h1>
            <p className="text-gray-400 text-xs mb-4">by TrackySheets — The Guide to Google Sheets</p>
            <p className="text-[14px] leading-relaxed text-gray-700">
              TrackySheets provides professionally designed spreadsheet templates for business, personal, and home use. 
              Our collection is optimized for Google Sheets and available for free.
            </p>
          </div>

          {/* SEZIONE TEMPLATES */}
          <section className="mb-12">
            <div className="bg-[#2D5A27] text-white font-bold text-[11px] px-4 py-2 mb-6 uppercase tracking-widest">
              New Templates
            </div>
            {loading ? (
              <div className="text-center py-10 text-gray-300">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates.map(t => (
                  <Link key={t.id} to={`/template/${t.slug}`} className="group block">
                    <div className="aspect-video bg-gray-100 overflow-hidden border border-gray-100 mb-3 group-hover:shadow-md transition-all">
                      <img src={t.thumbnail_url} className="w-full h-full object-cover" alt={t.title} />
                    </div>
                    <h4 className="font-bold text-[15px] leading-tight text-gray-800 group-hover:text-[#2D5A27]">{t.title}</h4>
                    <p className="text-[10px] font-black text-green-700 mt-2 uppercase tracking-tighter">Free Download</p>
                  </Link>
                ))}
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}
