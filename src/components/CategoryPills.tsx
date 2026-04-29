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
    <div className="w-full overflow-x-auto py-4 lg:hidden bg-white border-b border-gray-50 select-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {/* CSS interno per nascondere la scrollbar su Chrome/Safari */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
      
      <div className="flex flex-row gap-2 px-6 no-scrollbar">
        <Link
          to="/templates"
          className={`whitespace-nowrap px-4 py-2 rounded-full text-[12px] font-bold transition-all border ${
            !activeSlug 
              ? 'bg-[#1F5C3E] text-white border-[#1F5C3E] shadow-sm' 
              : 'bg-[#f8fafc] text-gray-600 border-gray-200 hover:border-[#1F5C3E]'
          }`}
        >
          All Templates
        </Link>
        
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/category/${cat.slug}`}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-[12px] font-bold transition-all border ${
              activeSlug === cat.slug
                ? 'bg-[#1F5C3E] text-white border-[#1F5C3E] shadow-sm'
                : 'bg-[#f8fafc] text-gray-600 border-gray-200 hover:border-[#1F5C3E]'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
