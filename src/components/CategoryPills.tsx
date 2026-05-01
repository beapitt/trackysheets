import React from 'react';
import { Link } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryPillsProps {
  categories: Category[];
  activeSlug?: string;
  isHome?: boolean; // Aggiungiamo questa prop
}

export default function CategoryPills({ categories, activeSlug, isHome }: CategoryPillsProps) {
  return (
    /* Sfondo verde per continuità con la Navbar */
    <div className="w-full lg:hidden border-b border-white/10" style={{ backgroundColor: '#1F5C3E' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      
      <div 
        className="w-full overflow-x-auto no-scrollbar flex flex-row items-center select-none py-3"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex flex-row gap-2 px-4 flex-nowrap">
          <Link
            to="/templates"
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[12px] font-bold transition-all border shrink-0 ${
              !activeSlug && !isHome
                ? 'bg-white text-[#1F5C3E] border-white' 
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
          >
            All Templates
          </Link>
          
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[12px] font-bold transition-all border shrink-0 ${
                activeSlug === cat.slug
                  ? 'bg-white text-[#1F5C3E] border-white'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
