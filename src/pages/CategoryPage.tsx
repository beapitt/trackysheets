import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import Footer from '../components/Footer';

export default function CategoryPage() {
  const { slug } = useParams();
  const [templates, setTemplates] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // 1. Trova il nome della categoria tramite lo slug
        const { data: catData } = await supabase
          .from('categories')
          .select('name')
          .eq('slug', slug)
          .single();

        if (catData) {
          setCategoryName(catData.name);
          // 2. Carica i template che appartengono a questa categoria
          const { data: tplData } = await supabase
            .from('templates')
            .select('*')
            .eq('category', catData.name)
            .eq('status', 'published')
            .order('created_at', { ascending: false });

          if (tplData) setTemplates(tplData);
        }
      } catch (err) {
        console.error('Error fetching category data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans italic text-gray-400">
      Loading category...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto flex flex-1 w-full text-left">
        <main className="flex-1 p-8 bg-white border-r border-gray-100">
          <div className="mb-4 text-[11px] text-gray-400 font-bold uppercase tracking-widest">
            Templates / {categoryName}
          </div>
          <h1 className="text-3xl font-bold text-[#14532d] mb-8 uppercase tracking-tight border-b pb-4">
            {categoryName}
          </h1>

          {templates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {templates.map(item => (
                <Link key={item.id} to={`/template/${item.slug}`} className="group no-underline block">
                  <div className="aspect-video bg-gray-100 rounded-sm overflow-hidden border border-gray-200 shadow-sm group-hover:shadow-md transition-all">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <h3 className="mt-4 font-bold text-gray-800 group-hover:text-[#1a8856] transition text-[16px]">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-gray-400 italic">
              No templates found in this category yet.
            </div>
          )}
        </main>
        <Sidebar />
      </div>
      <Footer />
    </div>
  );
}
