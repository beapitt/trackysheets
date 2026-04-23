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
      
      {/* HEADER COMPATTO */}
      <div className="sticky top-0 z-50 shadow-sm">
        
        {/* BARRA SCURA (Logo + Ricerca + Admin) */}
        <header style={{ backgroundColor: GREEN_DARK }} className="h-14">
          <div className="max-w-[1100px] mx-auto px-4 h-full flex items-center justify-between gap-6">
            
            {/* Logo compatto */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 flex items-center justify-center rounded bg-white text-[#2D5A27] font-black text-sm">TS</div>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-black tracking-tighter text-white">
                  Tracky<span className="text-green-200">Sheets</span>
                </span>
                <span className="text-[8px] font-medium text-green-100 capitalize -mt-0.5">
                  Smart Trackers & Planners
                </span>
              </div>
            </Link>

            {/* Barra di ricerca STILE MANUS (Bianca, Sottile) */}
            <div className="flex-1 max-w-md relative">
              <input 
                type="text" 
                placeholder="Search templates..." 
                className="w-full bg-white border-none rounded-sm px-3 py-1.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-3 top-2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>

            {/* Admin link minimale */}
            <Link to="/admin" className="text-[10px] font-bold text-green-100/70 hover:text-white uppercase tracking-widest shrink-0">
              Admin
            </Link>
          </div>
        </header>

        {/* BARRA MINT (Attaccata, Altezza simile alla scura) */}
        <div style={{ backgroundColor: GREEN_MINT }} className="border-b border-green-100">
          <div className="max-w-[1100px] mx-auto px-4 py-2 flex gap-5 text-[11px] font-bold text-green-800 uppercase tracking-tight">
            <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
            {categories.slice(0, 5).map(cat => (
              <Link key={cat.id} to={`/?cat=${cat.id}`} className="hover:text-green-600 transition-colors whitespace-nowrap">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENUTO */}
      <div className="max-w-[1100px] mx-auto px-4 py-8 flex gap-8">
        
        {/* SIDEBAR */}
        <aside className="w-48 shrink-0 hidden md:block">
          <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest border-b pb-1">Templates</h3>
          <nav className="flex flex-col gap-1.5">
            {categories.map(cat => (
              <Link key={cat.id} to={`/?cat=${cat.id}`} className="text-[13px] text-gray-600 hover:text-[#2D5A27] font-medium hover:underline">
                {cat.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* MAIN AREA */}
        <main className="flex-1">
          
          <div className="border border-gray-200 p-6 mb-8 bg-white shadow-sm rounded-sm">
            <h1 className="text-xl font-bold text-[#2D5A27] mb-2">
              Spreadsheet Templates, Calculators, and Calendars
            </h1>
            <p className="text-gray-400 text-[10px] mb-3">by TrackySheets — The Guide to Google Sheets</p>
            <p className="text-[13px] leading-relaxed text-gray-700">
              TrackySheets provides professionally designed spreadsheet templates for business, personal, and home use. 
              Our collection is optimized for Google Sheets and available for free.
            </p>
          </div>

          <section>
            <div className="bg-[#2D5A27] text-white font-bold text-[10px] px-3 py-1.5 mb-6 uppercase tracking-widest">
              New Templates
            </div>
            
            {loading ? (
              <div className="text-center py-10 text-gray-300 text-xs">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map(t => (
                  <Link key={t.id} to={`/template/${t.slug}`} className="group block">
                    <div className="aspect-video bg-gray-50 overflow-hidden border border-gray-100 mb-2 group-hover:shadow-sm transition-all">
                      <img src={t.thumbnail_url} className="w-full h-full object-cover" alt={t.title} />
                    </div>
                    <h4 className="font-bold text-[14px] leading-tight text-gray-800 group-hover:text-[#2D5A27] underline-offset-2 group-hover:underline">{t.title}</h4>
                    <p className="text-[9px] font-black text-green-700 mt-1 uppercase">Free Download</p>
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
