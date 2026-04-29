import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Footer from '../components/Footer'
import CategoryPills from '../components/CategoryPills'
import { Search, ArrowRight, MonitorPlay } from 'lucide-react'

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

export default function Home() {
  const [templates, setTemplates] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: tData } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);

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
    <div className="min-h-screen bg-white font-sans text-left">
      <Navbar />
      
      {/* Category Pills visibili solo su Mobile */}
      <CategoryPills categories={categories} />

      <div className="w-full max-w-[1550px] mx-auto px-6 md:px-12 py-10 text-left">
        {/* Layout adattivo: colonna su mobile, riga su schermi larghi */}
        <div className="flex flex-col lg:flex-row items-start gap-12 text-left">
          
          <main className="flex-1 min-w-0 text-left w-full">
            <section className="text-left">
              <p className="text-[11px] font-bold tracking-widest uppercase text-[#1F5C3E] mb-2 text-left">
                Free Google Sheets Templates
              </p>
              <h1 className="text-[28px] font-bold text-[#1f2937] leading-tight mb-2 text-left">
                Spreadsheets that work for you
              </h1>
              <p className="text-[14px] text-[#4b5563] mb-6 text-left">Professional. Simple. Ready to use.</p>
              
              <p className="text-[13px] leading-relaxed text-[#374151] border-l-2 border-[#C0DD97] pl-4 mb-6 max-w-2xl text-left">
                TrackySheets provides free Google Sheets templates for budgeting, invoicing, 
                project tracking, and more — no login or registration required.
              </p>

              {/* Box statistiche: 1 colonna su mobile, 3 su desktop */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 text-left">
                {[
                  { num: `50+`, sub: "free templates", n: "01" },
                  { num: "100%", sub: "Google Sheets", n: "02" },
                  { num: "0", sub: "login required", n: "03" },
                ].map((s) => (
                  <div key={s.n} className="bg-[#EAF3DE] rounded-xl p-4 border border-[#C0DD97]/20 flex flex-col justify-center text-left">
                    <span className="text-[10px] font-bold text-[#3B6D11] block mb-0.5 opacity-50 uppercase tracking-tighter text-left">Step {s.n}</span>
                    <span className="text-[22px] font-bold text-[#27500A] block leading-none mb-0.5 text-left">{s.num}</span>
                    <span className="text-[10px] text-[#3B6D11] uppercase font-bold tracking-tight text-left">{s.sub}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-6 text-left">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-[16px] font-bold text-[#1f2937] text-left">Newly released</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF3DE] text-[#1F5C3E] uppercase">NEW</span>
                </div>
                <Link to="/templates" className="text-[11px] font-bold text-[#1F5C3E] no-underline opacity-80">
                  View all templates →
                </Link>
              </div>
              
              {/* Griglia prodotti: 1 colonna mobile, 2 desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {templates.map((template) => (
                  <Link key={template.id} to={`/template/${template.slug}`} className="group no-underline block text-left">
                    <div className="aspect-[16/10] bg-[#f5f4ed] rounded-xl overflow-hidden mb-3 border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                      <img src={template.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" alt={template.title} />
                    </div>
                    <h3 className="text-[14px] font-bold text-gray-900 mb-0.5 group-hover:text-[#1F5C3E] text-left">{template.title}</h3>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">Free Download</span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="border-t border-gray-100 pt-6 pb-8 text-left">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F5C3E] mb-6 text-center">How it works</h3>
              {/* Steps: 1 colonna mobile, 3 desktop */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {[
                  { n: "01", title: "Choose", body: "Pick a template from our library." },
                  { n: "02", title: "Copy", body: "Click 'Make a copy' to save it to your Drive." },
                  { n: "03", title: "Use", body: "Start tracking your data immediately." },
                ].map((s) => (
                  <div key={s.n} className="text-center">
                    <span className="text-[28px] font-bold text-[#EAF3DE] block mb-0.5 leading-none">{s.n}</span>
                    <h4 className="text-[13px] font-bold text-gray-900 mb-1">{s.title}</h4>
                    <p className="text-[11px] text-[#6b7280] leading-relaxed">{s.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>

          <aside 
            className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-8 text-left"
            style={{ position: 'sticky', top: '130px', alignSelf: 'flex-start' }}
          >
            {videoId && (
              <div className="text-left">
                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-xl mb-3">
                   <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen></iframe>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-left">
                  <MonitorPlay size={14} /> Video Guide
                </div>
              </div>
            )}

            <div className="text-left">
               <div className="bg-[#1F5C3E] text-white py-3 px-5 rounded-lg text-center mb-4 font-bold text-[10px] uppercase tracking-widest">
                 Browse Categories
               </div>
               <div className="flex flex-col gap-0.5 text-left">
                  {filteredCategories.slice(0, 8).map((cat) => (
                    <Link key={cat.id} to={`/category/${cat.slug}`} className="text-[12px] font-bold text-gray-500 hover:text-[#1F5C3E] no-underline py-2 border-b border-gray-50 hover:bg-gray-50 px-2 rounded-md transition-all text-left">
                      {cat.name}
                    </Link>
                  ))}
               </div>
            </div>

            <div className="pt-2 text-left">
               <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-3 text-left">Follow us on</p>
               <div className="flex flex-col gap-2 text-left">
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
