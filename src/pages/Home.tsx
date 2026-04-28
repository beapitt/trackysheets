import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Footer from '../components/Footer'
import { Search, ArrowRight, MonitorPlay } from 'lucide-react'

const PinterestIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#E60023">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.947-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.22 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24 18.637 24 24 18.632 24 12.012 24 5.39 18.637 0 12.017 0z"/>
  </svg>
);

export default function Home() {
  const [templates, setTemplates] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      // Carica Templates
      const { data: tData } = await supabase.from('templates').select('*').order('created_at', { ascending: false })
      // Carica Categorie
      const { data: cData } = await supabase.from('categories').select('*').order('name')
      // Carica Settings (per il video della home)
      const { data: sData } = await supabase.from('settings').select('*').single()
      
      if (tData) setTemplates(tData)
      if (cData) setCategories(cData)
      if (sData) setSettings(sData)
      setLoading(false)
    }
    fetchData()
  }, [])

  const getYouTubeID = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = settings?.home_video_url ? getYouTubeID(settings.home_video_url) : null;
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <div className="w-full max-w-[1550px] mx-auto px-12 py-10">
        <div className="flex flex-col lg:flex-row gap-14 items-start">
          
          <main className="flex-[0.74] w-full">
            {/* Placeholder per i 3 Box che faremo dopo */}
            <div className="grid grid-cols-3 gap-6 mb-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-44 bg-[#f5f4ed] rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  Featured Section {i}
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {templates.map((template) => (
                <Link key={template.id} to={`/template/${template.slug}`} className="group no-underline">
                  <div className="aspect-[16/10] bg-[#f5f4ed] rounded-xl overflow-hidden mb-4 border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                    <img src={template.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={template.title} />
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 leading-tight mb-1 group-hover:text-[#1F5C3E] transition-colors">
                    {template.title}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                    {template.software || 'Google Sheets'}
                  </p>
                </Link>
              ))}
            </div>
          </main>

          {/* SIDEBAR IDENTICA AL PRODOTTO */}
          <aside className="flex-[0.26] w-full sticky top-24 pt-4 flex flex-col gap-10 border-l border-gray-50 pl-8">
            
            {/* Video Dinamico dai Settings */}
            {videoId ? (
              <div>
                <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-100 shadow-lg mb-3">
                   <iframe
                    width="100%" height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="Home Video Guide" frameBorder="0" allowFullScreen
                  ></iframe>
                </div>
                <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#374151]">
                  <MonitorPlay size={16} /> Tutorial & Guide
                </h4>
              </div>
            ) : (
              <div className="aspect-video bg-[#f5f4ed] rounded-xl flex items-center justify-center border border-gray-100 text-gray-400 text-[10px] font-bold">
                VIDEO NON CONFIGURATO
              </div>
            )}

            {/* Ricerca Categorie */}
            <div className="flex flex-col gap-4">
               <div className="bg-[#1F5C3E] text-white py-2 px-4 rounded-md text-center">
                  <span className="text-[11px] font-black uppercase tracking-widest">Categories</span>
               </div>
               <div className="relative">
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search categories..." 
                    className="w-full bg-[#f5f4ed] border border-gray-100 rounded-lg py-2.5 pl-10 pr-4 text-xs font-bold text-gray-600 focus:ring-1 focus:ring-[#1F5C3E] transition-all"
                  />
                  <Search className="absolute left-3 top-3 text-gray-400" size={14} />
               </div>
               <div className="flex flex-col gap-1 px-1">
                  {filteredCategories.slice(0, 18).map((cat) => (
                    <Link key={cat.id} to={`/category/${cat.slug}`} className="text-[12px] font-bold text-gray-500 hover:text-[#1F5C3E] no-underline py-1.5 border-b border-gray-50 transition-colors">
                      {cat.name}
                    </Link>
                  ))}
               </div>
            </div>

            {/* Social */}
            <div className="flex flex-col gap-3">
               <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">Follow us on</h4>
               <a href="#" className="flex items-center justify-between w-full border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 transition-colors no-underline">
                  <div className="flex items-center gap-2.5">
                    <PinterestIcon />
                    <span className="text-[12px] font-bold text-gray-700">Pinterest</span>
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase">Follow <ArrowRight size={10} className="inline ml-0.5" /></span>
               </a>
               <a href="#" className="flex items-center justify-between w-full border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 transition-colors no-underline">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 bg-[#FF0000] rounded-sm flex items-center justify-center text-white text-[8px]">▶</div>
                    <span className="text-[12px] font-bold text-gray-700">YouTube</span>
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase">Subscribe <ArrowRight size={10} className="inline ml-0.5" /></span>
               </a>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  )
}
