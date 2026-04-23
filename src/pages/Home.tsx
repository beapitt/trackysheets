import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const GREEN_DARK = "#2D5A27";

export default function Home() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = selectedCategory ? t.category_id === selectedCategory : true;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900">
      
      {/* HEADER SECTION */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between">
          
          {/* Logo & Search Block */}
          <div className="flex items-center gap-12 flex-1">
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <div className="w-11 h-11 flex items-center justify-center rounded-xl shadow-lg" style={{ backgroundColor: GREEN_DARK }}>
                <span className="text-white font-black text-lg tracking-tighter">TS</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black tracking-tighter uppercase" style={{ color: GREEN_DARK }}>
                  Tracky<span className="text-gray-900">Sheets</span>
                </span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Smart Templates</span>
              </div>
            </Link>

            {/* Client Search Bar */}
            <div className="max-w-md w-full relative hidden lg:block">
              <input 
                type="text" 
                placeholder="Search templates..." 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-green-900/10 focus:bg-white transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-4 top-3 text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>
          </div>

          {/* Navigation & Admin */}
          <div className="flex items-center gap-8">
            <nav className="hidden xl:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-gray-400">
              <Link to="/" className="hover:text-green-900 transition-colors">How it works</Link>
              <Link to="/admin" className="text-green-800 border border-green-800/20 px-4 py-2 rounded-lg hover:bg-green-50 transition-all">Admin Dashboard</Link>
            </nav>
            <button className="px-6 py-3 rounded-xl text-white text-[11px] font-black uppercase tracking-widest shadow-xl hover:opacity-90 transition-all" style={{ backgroundColor: GREEN_DARK }}>
              Get All Access
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
        
        {/* SIDEBAR */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-32">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Categories</h3>
            <nav className="flex flex-col gap-1">
              <button 
                onClick={() => setSelectedCategory(null)}
                className={`text-left px-5 py-4 rounded-2xl font-bold transition-all text-sm ${!selectedCategory ? "bg-white shadow-xl shadow-green-900/5 text-green-900" : "text-gray-400 hover:bg-gray-100"}`}
              >
                All Sheets
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-left px-5 py-4 rounded-2xl font-bold transition-all text-sm ${selectedCategory === cat.id ? "bg-white shadow-xl shadow-green-900/5 text-green-900" : "text-gray-400 hover:bg-gray-100"}`}
                >
                  {cat.name}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* MAIN GRID */}
        <main className="flex-1">
          <div className="mb-10">
            <h2 className="text-4xl font-black tracking-tight mb-2">
              {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : "Premium Templates"}
            </h2>
            <div className="h-1 w-20 rounded-full" style={{ backgroundColor: GREEN_DARK }}></div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(n => <div key={n} className="aspect-[4/5] bg-gray-200 rounded-[2.5rem] animate-pulse"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.map(item => (
                <Link 
                  key={item.id} 
                  to={`/template/${item.slug}`} 
                  className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={item.thumbnail_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Free</div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="font-black text-xl leading-tight mb-4 group-hover:text-green-800 transition-colors flex-1">{item.title}</h3>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">GS PRO</span>
                       <span className="text-green-800 font-black text-xs uppercase tracking-widest">Download →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
