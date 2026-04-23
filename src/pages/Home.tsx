import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";

const GREEN_DARK = "#2D5A27";
const GREEN_MINT = "#E8F5E9"; 

export default function Home() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const activeCat = params.get("cat");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: tpls } = await supabase.from("templates").select("*").order("created_at", { ascending: false });
        const { data: cats } = await supabase.from("categories").select("*").order("name");
        setTemplates(tpls || []);
        setCategories(cats || []);
      } catch (err) {
        console.error(err);
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
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* HEADER FISSO */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <header style={{ backgroundColor: GREEN_DARK }} className="h-12 flex items-center shadow-md">
          <div className="max-w-[1100px] mx-auto w-full px-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 no-underline">
              <div className="w-8 h-8 flex items-center justify-center border border-white/30 rounded-lg shadow-lg bg-transparent">
                <span className="text-white font-black text-sm">TS</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[15px] font-bold text-white">TrackySheets</span>
                <span className="text-[7.5px] font-medium text-white/80 capitalize mt-0.5">Smart Trackers & Planners</span>
              </div>
            </Link>

            <div className="flex items-center gap-2 max-w-[300px] w-full mx-4">
              <input 
                type="text" 
                placeholder="Search templates..." 
                className="w-full bg-white border-none rounded-sm px-3 py-1 text-[11px] text-gray-800 outline-none h-7 shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center border border-white/10 shrink-0 text-white">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </div>

            <Link to="/admin" className="text-[9px] font-bold text-white uppercase border border-white/40 px-3 py-1 rounded-full no-underline">Admin</Link>
          </div>
        </header>

        <div style={{ backgroundColor: GREEN_MINT }} className="h-9 border-b border-green-100 flex items-center">
          <div className="max-w-[1100px] mx-auto w-full px-4 flex gap-6 text-[10px] font-bold text-green-800 uppercase tracking-tight">
            <Link to="/" className="no-underline">Home</Link>
            {categories.slice(0, 5).map(cat => (
              <Link key={cat.id} to={`/?cat=${cat.id}`} className="no-underline whitespace-nowrap">{cat.name}</Link>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[84px]"></div>

      {/* LAYOUT IDENTICO A MANUS */}
      <div className="max-w-[1100px] mx-auto px-4 py-6 flex flex-col md:flex-row gap-8 text-left">
        
        {/* CORPO CENTRALE */}
        <main className="flex-1 order-2 md:order-1">
          
          {/* INTRO BOX - STILE ESATTO MANUS */}
          <div style={{
            backgroundColor: "white",
            border: "1px solid #ddd",
            padding: "10px 12px",
            marginBottom: 20,
            fontSize: "13px",
            lineHeight: "1.6",
          }}>
            <h1 style={{ fontSize: "18px", color: GREEN_DARK, marginBottom: "6px", fontWeight: "bold" }}>
              Spreadsheet Templates, Calculators, and Calendars
            </h1>
            <p style={{ color: "#555", marginBottom: "6px", fontSize: "12px" }}>
              <em>by TrackySheets — The Guide to Google Sheets & Excel</em>
            </p>
            <p style={{ marginBottom: "6px" }}>
              TrackySheets provides professionally designed spreadsheet templates for business, personal, and home use.
              Our collection is optimized for Google Sheets and available for free download.
            </p>
          </div>

          {/* NEW TEMPLATES SECTION */}
          <div className="mb-6">
            <div style={{
              backgroundColor: GREEN_DARK,
              color: "white",
              fontWeight: "bold",
              fontSize: "13px",
              padding: "5px 10px",
              marginBottom: "15px",
            }}>
              New Templates
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(t => (
                <Link key={t.id} to={`/template/${t.slug}`} className="group block no-underline border border-gray-100 p-2 hover:shadow-sm">
                  <div className="aspect-video bg-gray-50 overflow-hidden mb-2">
                    <img src={t.thumbnail_url} className="w-full h-full object-cover" alt={t.title} />
                  </div>
                  <h4 className="font-bold text-[13px] leading-tight text-gray-800 group-hover:text-[#2D5A27]">{t.title}</h4>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Free Download</p>
                </Link>
              ))}
            </div>
          </div>
        </main>

        {/* SIDEBAR RIFINITA */}
        <aside className="w-full md:w-52 shrink-0 order-1 md:order-2">
          
          {/* FOLLOW US */}
          <div className="mb-8">
            <h3 className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest border-b pb-1">Follow Us On</h3>
            <div className="flex gap-4 items-center px-1">
              <a href="#" className="text-gray-400 hover:text-[#E60023]">Pinterest</a>
              <a href="#" className="text-gray-400 hover:text-[#FF0000]">YouTube</a>
            </div>
          </div>

          {/* CATEGORIES BOX */}
          <div className="border border-gray-100 p-4 bg-[#FCFDFD]">
            <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest border-b border-gray-100 pb-1">
              Template Categories
            </h3>
            <nav className="flex flex-col">
              <Link to="/" className={`group flex items-center justify-between py-2 text-[12px] no-underline ${!activeCat ? "text-[#2D5A27] font-bold" : "text-gray-600"}`}>
                <span>All Sheets</span>
                <span className="text-[10px] opacity-30">›</span>
              </Link>
              {categories.map(cat => (
                <Link 
                  key={cat.id} 
                  to={`/?cat=${cat.id}`} 
                  className={`group flex items-center justify-between py-2 text-[12px] border-t border-gray-50 no-underline ${activeCat === cat.id ? "text-[#2D5A27] font-bold" : "text-gray-600"}`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-30 group-hover:opacity-100 transition-opacity">›</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

      </div>
    </div>
  );
}
