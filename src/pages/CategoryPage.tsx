import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Footer from '../components/Footer'
import { Search, MonitorPlay, ArrowRight } from 'lucide-react'

const PinterestIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#E60023">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.947-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.22 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24 18.637 24 24 18.632 24 12.012 24 5.39 18.637 0 12.017 0z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF0000">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function CategoryPage() {
  const { slug } = useParams()
  const [category, setCategory] = useState<any>(null)
  const [templates, setTemplates] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function fetchCategoryData() {
      setLoading(true)
      
      // 1. Recupero Categoria tramite Slug
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()
      
      if (catData) {
        setCategory(catData)
        
        // 2. Recupero Template tramite colonna 'category' (testo)
        const { data: tData } = await supabase
          .from('templates')
          .select('*')
          .eq('category', catData.name) 
          .order('created_at', { ascending: false })
        
        if (tData) setTemplates(tData)
      }

      // 3. Dati Sidebar e Settings
      const { data: allCats } = await supabase.from('categories').select('*').order('name')
      const { data: sData } = await supabase.from('settings').select('*').maybeSingle()
      
      if (allCats) setCategories(allCats)
      if (sData) setSettings(sData)

      setLoading(false)
    }
    fetchCategoryData()
  }, [slug])

  const getYouTubeID = (url: string) => {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\??v?=?))([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const videoId = settings?.youtube_url ? getYouTubeID(settings.youtube_url) : null;
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <div className="w-full max-w-[1550px] mx-auto px-12 py-10">
        <div className="flex flex-row items-start gap-12">
          
          <main className="flex-1 min-w-0">
            <header className="mb-8">
              <p className="text-[11px] font-bold tracking-widest uppercase text-[#1F5C3E] mb-2">
                Templates / {category?.name || slug}
              </p>
              <h1 className="text-[28px] font-bold text-[#1f2937] leading-tight uppercase">
                {category?.name || slug}
              </h1>
            </header>

            {templates.length > 0 ? (
              <div className="grid grid-cols-2 gap-8">
                {templates.map((template) => (
                  <Link key={template.id} to={`/template/${template.slug}`} className="group no-underline block">
                    <div className="aspect-[16/10] bg-[#f5f4ed] rounded-xl overflow-hidden mb-4 border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                      <img 
                        src={template.thumbnail} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" 
                        alt={template.title} 
                      />
                    </div>
                    <h3 className="text-[15px] font-bold text-gray-900 mb-1 group-hover:text-[#1F5C3E]">{template.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {template.software || 'Google Sheets'}
                      </span>
                      <span className="text-[10px] font-bold text-[#1F5C3E]">FREE →</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                <p className="text-gray-400 italic text-[13px]">No templates found in this category yet.</p>
              </div>
            )}
          </main>

          <aside 
            className="w-[320px] flex-shrink-0 flex flex-col gap-8"
            style={{ position: 'sticky', top: '130px', alignSelf: 'flex-start' }}
          >
            {videoId && (
              <div>
                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-xl mb-3">
                   <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen></iframe>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <MonitorPlay size={14} /> Video Guide
                </div>
              </div>
            )}

            <div>
               <div className="bg-[#1F5C3E] text-white py-3 px-5 rounded-lg text-center mb-4 font-bold text-[10px] uppercase tracking-widest">
                  Browse Categories
               </div>
               <div className="flex flex-col gap-0.5">
                  {filteredCategories.slice(0, 12).map((cat) => (
                    <Link 
                      key={cat.id} 
                      to={`/category/${cat.slug}`} 
                      className={`text-[12px] font-bold no-underline py-2 border-b border-gray-50 hover:bg-gray-50 px-2 rounded-md transition-all ${cat.slug === slug ? 'text-[#1F5C3E] bg-gray-50' : 'text-gray-500'}`}
                    >
                      {cat.name}
                    </Link>
                  ))}
               </div>
            </div>

            <div className="pt-2">
               <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-3 text-left">Follow us on</p>
               <div className="flex flex-col gap-2">
                  <a href="#" className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-2.5 hover:bg-gray-50 no-underline shadow-sm transition-all group">
                    <div className="flex items-center gap-3">
                      <PinterestIcon />
                      <span className="text-[13px] font-bold text-gray-800">Pinterest</span>
                    </div>
                    <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1 group-hover:text-[#1F5C3E]">Follow <ArrowRight size={12} /></span>
                  </a>
                  <a href="#" className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-2.5 hover:bg-gray-50 no-underline shadow-sm transition-all group">
                    <div className="flex items-center gap-3">
                      <YouTubeIcon />
                      <span className="text-[13px] font-bold text-gray-800">YouTube</span>
                    </div>
                    <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1 group-hover:text-[#FF0000]">Subscribe <ArrowRight size={12} /></span>
                  </a>
               </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  )
}
