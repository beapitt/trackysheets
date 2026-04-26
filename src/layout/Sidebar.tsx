import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface SidebarProps {
  videoId?: string;
  templateData?: {
    software_os?: string;
    file_format?: string;
    price?: number;
    created_at?: string;
  };
}

export default function Sidebar({ videoId, templateData }: SidebarProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const { slug } = useParams(); // Per capire in quale categoria ci troviamo

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('*').order('name');
      if (data) setCategories(data);
    }
    fetchCategories();
  }, []);

  // Formattazione data semplice
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recent';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <aside className="w-80 flex-shrink-0 font-sans py-8 pr-8 border-r border-gray-50 bg-white">
      {/* Container Sticky: segue l'utente durante lo scroll */}
      <div className="sticky top-6 space-y-10">
        
        {/* 1. VIDEO TUTORIAL (IN ALTO) */}
        {videoId && (
          <div className="rounded-xl overflow-hidden shadow-md border border-gray-100 bg-gray-50 p-1">
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe 
                width="100%" height="100%" 
                src={`https://www.youtube.com/embed/${videoId}`} 
                frameBorder="0" allowFullScreen 
              />
            </div>
            <p className="text-[10px] font-bold text-[#1a8856] uppercase tracking-widest text-center py-2 m-0">
              Video Tutorial
            </p>
          </div>
        )}

        {/* 2. METADATA BOX (TECHNICAL INFO) */}
        {templateData && (
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Technical Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Software:</span>
                <span className="font-bold text-gray-800">{templateData.software_os || 'Google Sheets'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Format:</span>
                <span className="font-bold text-gray-800">{templateData.file_format || 'Spreadsheet'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Last Update:</span>
                <span className="font-bold text-gray-800">{formatDate(templateData.created_at)}</span>
              </div>
              <div className="flex justify-between text-xs border-t border-gray-200 pt-2">
                <span className="text-gray-500">License:</span>
                <span className="font-bold text-[#1a8856] uppercase">Free</span>
              </div>
            </div>
          </div>
        )}

        {/* 3. CATEGORIES WITH GREEN BAR */}
        <div>
          <div className="bg-[#14532d] py-2 px-4 mb-4 rounded shadow-sm">
            <h3 className="text-white text-[10px] font-black uppercase tracking-[0.2em] m-0">
              Categories
            </h3>
          </div>
          <nav className="flex flex-col gap-1">
            {categories.map(cat => {
              const isActive = slug === cat.slug;
              return (
                <Link 
                  key={cat.id} 
                  to={`/category/${cat.slug}`} 
                  className={`text-[13px] no-underline py-2 px-3 rounded transition-all flex items-center ${
                    isActive 
                    ? 'bg-gray-100 text-[#1a8856] font-black border-l-4 border-[#1a8856]' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#1a8856] font-semibold'
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 4. FOLLOW US ON (BIG ICONS) */}
        <div>
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5">Follow us on</h3>
          <div className="flex gap-6 items-center">
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png" className="w-8 h-8" alt="Pinterest" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" className="w-16 h-auto" alt="YouTube" />
            </a>
          </div>
        </div>

      </div>
    </aside>
  );
}
