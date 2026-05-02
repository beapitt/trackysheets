import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Footer from '../components/Footer'
import Sidebar from '../layout/Sidebar'

export default function CategoryPage() {
  const { slug } = useParams()
  const [category, setCategory] = useState<any>(null)
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategoryData() {
      setLoading(true)
      
      // 1. Recupero la categoria dallo slug
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()
      
      if (catData) {
        setCategory(catData)
        
        // 2. Recupero i template usando l'ID della categoria (più sicuro del nome)
        const { data: tData } = await supabase
          .from('templates')
          .select('*')
          .eq('category_id', catData.id)
          .order('created_at', { ascending: false })
        
        if (tData) setTemplates(tData)
      }

      setLoading(false)
    }
    fetchCategoryData()
    window.scrollTo(0, 0)
  }, [slug])

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white font-inter text-[#4b5563] antialiased overflow-x-hidden">
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-5 md:px-10 pt-6 md:pt-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="flex-1 min-w-0">
            {/* INTESTAZIONE CATEGORIA */}
            <header className="mb-8 border-b border-gray-50 pb-6 text-left">
              <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1F5C3E] mb-1">
                Category
              </p>
              <h1 className="text-[26px] md:text-[34px] font-bold text-[#1f2937] leading-tight uppercase">
                {category?.name || slug}
              </h1>
              {category?.description && (
                <p className="text-[15px] text-[#6b7280] mt-3 max-w-2xl font-medium leading-relaxed">
                  {category.description}
                </p>
              )}
            </header>

            {/* GRID TEMPLATES */}
            {templates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {templates.map((template) => (
                  <Link key={template.id} to={`/template/${template.slug}`} className="group no-underline block text-left">
                    <div className="aspect-[16/10] bg-[#f9f9f7] rounded-2xl overflow-hidden mb-4 border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                      <img 
                        src={template.thumbnail} 
                        className="w-full h-full object-cover" 
                        alt={template.title} 
                      />
                    </div>
                    <h3 className="text-[15px] font-bold text-[#1f2937] mb-1 group-hover:text-[#1F5C3E] transition-colors leading-snug">
                      {template.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-[#1F5C3E] uppercase tracking-widest">Free</span>
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Google Sheets</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium text-sm italic">No templates found in this category yet.</p>
                <Link to="/templates" className="mt-4 inline-block text-[#1F5C3E] font-bold text-xs uppercase underline">Browse all library</Link>
              </div>
            )}
          </div>

          {/* SIDEBAR STANDARD */}
          <aside className="w-full lg:w-[300px] shrink-0 lg:sticky lg:top-24 self-start">
            <Sidebar />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
