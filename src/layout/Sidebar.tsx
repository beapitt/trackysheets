import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ALL_CATEGORIES = [
  { name: "Finance", count: 12 },
  { name: "Budgeting", count: 8 },
  { name: "Productivity", count: 15 },
  { name: "Calendars", count: 5 },
  { name: "Business", count: 10 },
];

export default function Sidebar({ videoId }: { videoId?: string }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = ALL_CATEGORIES.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="w-64 flex flex-col gap-8 sticky top-24 self-start">
      
      {/* ── VIDEO TUTORIAL ── */}
      {videoId && (
        <div>
          <div className="bg-[#1F5C3E] text-white text-[10px] font-black tracking-[0.15em] px-3 py-2 rounded-t uppercase">
            Video Tutorial
          </div>
          <div className="aspect-video bg-black rounded-b overflow-hidden border border-gray-100">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* ── INTERACTIVE CATEGORIES ── */}
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 px-1">Categories</h4>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Filter categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-md py-2 pl-8 pr-3 text-xs outline-none focus:border-[#C0DD97] transition-all"
          />
          <span className="absolute left-2.5 top-2.5 text-gray-400 text-[10px]">🔍</span>
        </div>
        
        <nav className="flex flex-col gap-1">
          {filteredCategories.map((cat) => (
            <Link
              key={cat.name}
              to={`/category/${cat.name.toLowerCase()}`}
              className="flex items-center justify-between px-3 py-2 rounded-md text-xs font-bold text-gray-600 hover:bg-[#EAF3DE] hover:text-[#1F5C3E] transition-all no-underline"
            >
              {cat.name}
              <span className="text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">{cat.count}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* ── SOCIAL BADGES (Claude Style) ── */}
      <div className="pt-4 border-t border-gray-50">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 px-1">Follow Us</h4>
        <div className="flex flex-col gap-2">
          <a href="#" className="flex items-center gap-3 p-2 rounded-lg border border-gray-100 hover:bg-gray-50 transition-all no-underline">
            <span className="w-6 h-6 flex items-center justify-center bg-[#E60023] text-white rounded text-[10px] font-bold">P</span>
            <span className="text-[11px] font-bold text-gray-700">Pinterest</span>
          </a>
          <a href="#" className="flex items-center gap-3 p-2 rounded-lg border border-gray-100 hover:bg-gray-50 transition-all no-underline">
            <span className="w-6 h-6 flex items-center justify-center bg-[#FF0000] text-white rounded text-[10px] font-bold">Y</span>
            <span className="text-[11px] font-bold text-gray-700">YouTube</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
