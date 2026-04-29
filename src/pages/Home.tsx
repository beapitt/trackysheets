import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Footer from '../components/Footer'
import { Search, ArrowRight, MonitorPlay } from 'lucide-react'

// Icona Pinterest corretta
const PinterestIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="#E60023">
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
      const { data: tData } = await supabase.from('templates').select('*').order('created_at', { ascending: false })
      const { data: cData } = await supabase.from('categories').select('*').order('name')
      const { data: sData } = await supabase.from('settings').select('*').maybeSingle()
      if (tData) setTemplates(tData)
      if (cData) setCategories(cData)
      if (sData) setSettings(sData)
      setLoading(false)
    }
    fetchData()
  }, [])

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
        {/* FLEX CONTAINER PRINCIPALE - ITEMS-START E' VITALE */}
        <div className="flex flex-row items-start gap-12">
          
          {/* MAIN CONTENT */}
          <main className="flex-1 min-w-0">
            <section>
              <p className="text-[11px] font-bold tracking-widest uppercase text-[#1F5C3E] mb-2">
                Free Google Sheets Templates
              </p>
              <h1 className="text-[28px] font-bold text-[#1f2937] leading-tight mb-2">
                Spreadsheets that work for you
              </h1>
              <p className="text-[14px] text-[#4b5563] mb-8">Professional. Simple. Ready to use.</p>
              
              {/* BOX VERDI - GRID CONTROLLATA */}
              <div className="grid grid-cols-3 gap-4 mb-12">
                {[
                  { num: `50+`, sub: "free templates", n: "01" },
                  { num: "100%", sub: "Google Sheets", n: "02" },
                  { num: "0", sub: "login required", n: "03" },
                ].map((s) => (
                  <div key={s.n} className="bg-[#EAF3DE] rounded-xl p-5 border border-[#C0DD97]/20">
                    <span className="text-[11px] font-bold text-[#3B6D11] block mb-1 opacity-40 uppercase">Step {s.n}</span>
                    <span className="text-[26px] font-bold text-[#27500A] block leading-none mb-1">{s.num}</span>
                    <span className="text-[11px] text-[#3B6D11] uppercase font-bold tracking-wide">{s.sub}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* NEWLY RELEASED */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-[16px] font-bold text-[#1f2937]">Newly released</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF3DE] text-[#1F5C3E] uppercase">NEW</span>
                </div>
                <Link to="/templates" className="text-[12px] font-bold text-[#1F5C3E] no-underline hover:underline">
                  View all templates →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-8">
                {templates.slice(0, 4).map((template) => (
                  <Link key={template.id} to={`/template/${template.slug}`} className="group no-underline block">
                    <div className="aspect-[16/10] bg-[#f5f4ed] rounded-xl overflow-hidden mb-4 border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                      <img src={template.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" alt={template.title} />
                    </div>
                    <h3 className="text-[15px] font-bold text-gray-900 mb-1 group-hover:text-[#1F5C3E]">{template.title}</h3>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Free Download</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="border-t border-gray-100 pt-12 pb-12">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#1F5C3E] mb-12 text-center">How it works</h3>
              <div className="grid grid-cols-3 gap-10">
                {[
                  { n: "01", title: "Choose", body: "Pick a template from our library." },
                  { n: "02", title: "Copy", body: "Click 'Make a copy' to save it to your Drive." },
                  { n: "03", title: "Use", body: "Start tracking your data immediately." },
                ].map((s) => (
                  <div key={s.n} className="text-center">
                    <span className="text-[32px] font-bold text-[#EAF3DE] block mb-2">{s.n}</span>
                    <h4 className="text-[14px] font-bold text-gray-900 mb-2">{s.title}</h4>
                    <p className="text-[12px] text-[#6b7280] leading-relaxed">{s.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>

          {/* SIDEBAR - LARGHEZZA FISSA E STICKY REALE */}
          <aside 
            className="w-[280px] flex-shrink-0 flex flex-col gap-12"
            style={{ position: 'sticky', top: '130px', alignSelf: 'flex-start' }}
          >
            {/* VIDEO BOX */}
            {videoId && (
              <div>
                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-xl mb-4">
                   <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen></iframe>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  <MonitorPlay size={14} /> Video Guide
                </div>
              </div>
            )}

            {/* CATEGORIES */}
            <div>
               <div className="bg-[#1F5C3E] text-white py-3 px-5 rounded-lg text-center mb-6 font-bold text-[11px] uppercase tracking-widest">
                  Browse Categories
               </div>
               <div className="flex flex-col gap-1">
                  {filteredCategories.slice(0, 12).map((cat) => (
                    <Link key={cat.id} to={`/category/${cat.slug}`} className="text-[13px] font-bold text-gray-500 hover:text-[#1F5C3E] no-underline py-2.5 border-b border-gray-50 hover:bg-gray-50 px-2 rounded-md transition-all">
                      {cat.name}
                    </Link>
                  ))}
               </div>
            </div>

            {/* PINTEREST */}
            <div className="pt-6 border-t border-gray-100">
               <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Follow us on</p>
               <a href="#" className="flex items-center justify-between bg-white border border-gray-200 rounded-full px-5 py-3 hover:bg-gray-50 no-underline shadow-sm transition-all group">
                  <div className="flex items-center gap-3">
                    <PinterestIcon />
                    <span className="text-[12px] font-bold text-gray-700">Pinterest</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#1F5C3E] group-hover:translate-x-1 transition-transform">→</span>
               </a>
            </div>
          </aside>

        </div>
      </div>
      <Footer />
    </div>
  )
}
