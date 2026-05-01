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
    <div className="w-full bg-white lg:hidden border-b border-gray-50 overflow-hidden">
      {/* CSS per nascondere la scrollbar su tutti i browser */}
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
            className={`whitespace-nowrap px-4 py-2 rounded-full text-[12px] font-bold transition-all border shrink-0 ${
              !activeSlug 
                ? 'bg-[#1F5C3E] text-white border-[#1F5C3E]' 
                : 'bg-gray-50 text-gray-500 border-gray-100'
            }`}
          >
            All
          </Link>
          
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-[12px] font-bold transition-all border shrink-0 ${
                activeSlug === cat.slug
                  ? 'bg-[#1F5C3E] text-white border-[#1F5C3E]'
                  : 'bg-gray-50 text-gray-500 border-gray-100'
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
