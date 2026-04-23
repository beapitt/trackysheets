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
      
      {/* HEADER COMPATTISSIMO */}
      <div className="sticky top-0 z-50">
        
        {/* BARRA SCURA - Altezza ridotta (h-12) */}
        <header style={{ backgroundColor: GREEN_DARK }} className="h-12 flex items-center">
          <div className="max-w-[1100px] mx-auto w-full px-4 flex items-center justify-between">
            
            {/* LOGO TS - Bianco con bordino trasparente e ombra */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 flex items-center justify-center border border-white/30 rounded shadow-[0_2px_4px_rgba(0,0,0,0.2)] bg-transparent">
                <span className="text-white font-black text-sm">TS</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-black tracking-tighter text-white uppercase">
                  TrackySheets
                </span>
                <span className="text-[7px] font-bold text-white/80 uppercase tracking-widest">
                  Smart Trackers & Planners
                </span>
              </div>
            </Link>

            {/* BARRA DI RICERCA - Corta e centrata */}
            <div className="flex-1 max-w-[300px] relative mx-4">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-white border-none rounded-sm px-3 py-1 text-xs text-gray-800 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* ADMIN LINK */}
            <Link to="/admin" className="text-[9px] font-bold text-white/60 hover:text-white uppercase tracking-widest">
              Admin
            </Link>
          </div>
        </header>

        {/* BARRA MINT - Attaccata e sottile */}
        <div style={{ backgroundColor: GREEN_MINT }} className="h-9 border-b border-green-100 flex items-center">
          <div className="max-w-[1100px] mx-auto w-full px-4 flex gap-5 text-[10px] font-bold text-green-800 uppercase tracking-tight">
            <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
            {categories.slice(0, 5).map(cat => (
              <Link key={cat.id} to={`/?cat=${cat.id}`} className="hover:text-green-600 transition-colors whitespace-nowrap">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENUTO - Rimosse scritte extra sopra */}
      <div className="max-w-[1100px] mx-auto px-4 py-8 flex gap-8">
        
        {/* SIDEBAR */}
        <aside className="w-44 shrink-0 hidden md:block">
          <h3 className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest border-b pb-1">Templates</h3>
          <nav className="flex flex-col gap-1">
            {categories.map(cat => (
              <Link key={cat.id} to={`/?cat=${cat.id}`} className="text-[12px] text-gray-600 hover:text-[#2D5A27] font-medium transition-colors">
                {cat.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* MAIN AREA */}
        <main className="flex-1">
          
          <div className="border border-gray-200 p-6 mb-8 bg-white shadow-sm rounded-sm">
            <h1 className="text-lg font-bold text-[#2D5A27] mb-2 leading-tight">
              Spreadsheet Templates, Calculators, and Calendars
            </h1>
            <p className="text-gray-400 text-[9px] mb-3">by TrackySheets — The Guide to Google Sheets</p>
            <p className="text-[12px] leading-relaxed text-gray-700">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map(t => (
                  <Link key={t.id} to={`/template/${t.slug}`} className="group block">
                    <div className="aspect-video bg-gray-50 overflow-hidden border border-gray-100 mb-2 group-hover:shadow-sm transition-all">
                      <img src={t.thumbnail_url} className="w-full h-full object-cover" alt={t.title} />
                    </div>
                    <h4 className="font-bold text-[13px] leading-tight text-gray-800 group-hover:text-[#2D5A27] transition-colors">{t.title}</h4>
                    <p className="text-[8px] font-black text-green-700 mt-1 uppercase">Free Download</p>
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
