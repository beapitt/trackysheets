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
}

export default function CategoryPills({ categories, activeSlug }: CategoryPillsProps) {
  return (
    <div className="relative w-full bg-white lg:hidden">
      {/* Container con scorrimento forzato e senza scrollbar visibile */}
      <div 
        className="w-full overflow-x-auto py-3 no-scrollbar flex flex-row items-center select-none"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch' 
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          .no-scrollbar::-webkit-scrollbar { display: none; }
        `}} />
        
        <div className="flex flex-row gap-2 px-5 min-w-max">
          <Link
            to="/templates"
            className={`whitespace-nowrap px-4 py-2 rounded-full text-[12px] font-bold transition-all border ${
              !activeSlug 
                ? 'bg-[#1F5C3E] text-white border-[#1F5C3E] shadow-sm' 
                : 'bg-gray-50 text-gray-500 border-gray-100'
            }`}
          >
            All
          </Link>
          
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-[12px] font-bold transition-all border ${
                activeSlug === cat.slug
                  ? 'bg-[#1F5C3E] text-white border-[#1F5C3E] shadow-sm'
                  : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-300'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Sfumatura sottile a destra per indicare che c'è altro contenuto */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
    </div>
  );
}
