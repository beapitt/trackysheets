import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const GREEN_DARK = "#2D5A27";
const GREEN_MINT = "#E8F5E9"; // La striscia verde chiaro sotto l'header

export default function Home() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      
      {/* 1. HEADER (Logo + Search) */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1100px] mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded bg-[#2D5A27] text-white font-black text-lg">TS</div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tighter uppercase text-[#2D5A27]">
                Tracky<span className="text-gray-900">Sheets</span>
              </span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Smart Templates</span>
            </div>
          </Link>
          <div className="flex-1 max-w-sm mx-10">
            <input type="text" placeholder="Search templates..." className="w-full border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#2D5A27]" />
          </div>
          <Link to="/admin" className="text-xs font-bold text-gray-400 hover:text-[#2D5A27]">ADMIN</Link>
        </div>
      </header>

      {/* 2. MINT NAVIGATION STRIP (Le 6 categorie principali) */}
      <div style={{ backgroundColor: GREEN_MINT }} className="border-b border-green-100">
        <div className="max-w-[1100px] mx-auto px-4 py-3 flex gap-6 overflow-x-auto text-[11px] font-black uppercase tracking-widest text-green-800">
          <Link to="/" className="hover:underline">Home</Link>
          {categories.slice(0, 6).map(cat => (
            <Link key={cat.id} to={`/?cat=${cat.id}`} className="hover:underline whitespace-nowrap">
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 py-8 flex gap-10">
        
        {/* SIDEBAR (A sinistra, pulita) */}
        <aside className="w-52 shrink-0 hidden md:block">
          <h3 className="text-[11px] font-black uppercase text-gray-400 mb-4 tracking-widest border-b pb-2">All Categories</h3>
          <nav className="flex flex-col gap-2">
            {categories.map(cat => (
              <Link key={cat.id} to={`/?cat=${cat.id}`} className="text-[13px] text-gray-600 hover:text-[#2D5A27] hover:underline font-medium">
                {cat.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1">
          
          {/* INTRO TEXT BOX (Stile Manus) */}
          <div className="border border-gray-200 p-6 mb-8 bg-white shadow-sm">
            <h1 className="text-xl font-bold text-[#2D5A27] mb-2">
              Spreadsheet Templates, Calculators, and Calendars
            </h1>
            <p className="text-gray-500 text-xs italic mb-4">by TrackySheets — The Guide to Google Sheets</p>
            <p className="text-[13px] leading-relaxed text-gray-700">
              TrackySheets provides professionally designed spreadsheet templates for business, personal, and home use. 
              Our collection is optimized for Google Sheets and available for free.
            </p>
          </div>

          {/* NEW TEMPLATES SECTION */}
          <section className="mb-10">
            <div className="bg-[#2D5A27] text-white font-bold text-xs px-4 py-2 mb-6 uppercase tracking-widest">
              New Templates
            </div>
            {loading ? (
              <div className="text-center py-10 text-gray-400">Loading templates...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.slice(0, 6).map(t => (
                  <Link key={t.id} to={`/template/${t.slug}`} className="group border border-gray-100 p-2 hover:shadow-md transition-all">
                    <div className="aspect-video bg-gray-50 overflow-hidden mb-3">
                      <img src={t.thumbnail_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <h4 className="font-bold text-[14px] leading-tight text-gray-800 group-hover:text-[#2D5A27]">{t.title}</h4>
                    <p className="text-[11px] text-gray-400 mt-2 uppercase font-bold tracking-tighter">Free Download</p>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* FEATURED SECTION (Esempio) */}
          <section>
            <div className="bg-[#2D5A27] text-white font-bold text-xs px-4 py-2 mb-6 uppercase tracking-widest">
              Featured Templates
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {/* Qui potresti filtrare quelli 'featured' se aggiungiamo la colonna, per ora mostriamo gli altri */}
               {templates.slice(6, 12).map(t => (
                  <Link key={t.id} to={`/template/${t.slug}`} className="group border border-gray-100 p-2 hover:shadow-md transition-all">
                    <img src={t.thumbnail_url} className="aspect-video w-full object-cover mb-3" />
                    <h4 className="font-bold text-[14px] leading-tight text-gray-800">{t.title}</h4>
                  </Link>
                ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
