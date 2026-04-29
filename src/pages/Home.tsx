import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Footer from '../components/Footer'
import { Search, ArrowRight, MonitorPlay } from 'lucide-react'

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

      <div className="w-full max-w-[1550px] mx-auto px-10 py-10">
        {/* FIX STICKY: items-start è vitale qui */}
        <div className="flex flex-row gap-[36px] items-start">
          
          <main className="flex-[0.74] min-w-0 flex flex-col gap-[20px]">
            
            <section className="pt-4">
              <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#1F5C3E] mb-2">
                Free Google Sheets Templates
              </p>
              <h1 className="text-[22px] font-medium tracking-tight text-[#1f2937] leading-tight mb-1" style={{ letterSpacing: '-0.02em' }}>
                Spreadsheets that work for you
              </h1>
              <p className="text-[13px] text-[#4b5563] mb-5">
                Professional. Simple. Ready to use.
              </p>
              
              <p className="text-[13px] leading-relaxed text-[#374151] border-l-2 border-[#C0DD97] pl-4 mb-8 max-w-3xl">
                TrackySheets provides free Google Sheets templates for budgeting, invoicing, 
                project tracking, and more — no login or registration required.
              </p>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { num: `50+`, sub: "free templates", n: "01" },
                  { num: "100%", sub: "Google Sheets", n: "02" },
                  { num: "0", sub: "login required", n: "03" },
                ].map((s) => (
                  <div key={s.n} className="bg-[#EAF3DE] rounded-xl p-4 flex flex-col">
                    <span className="text-[11px] font-bold text-transparent mb-1" 
                          style={{ WebkitTextStroke: "1.2px #3B6D11", lineHeight: 1 }}>
                      {s.n}
                    </span>
                    <span className="text-[22px] font-semibold text-[#27500A] leading-none mb-1">{s.num}</span>
                    <span className="text-[11px] text-[#3B6D11] uppercase font-medium tracking-wide">{s.sub}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-[15px] font-semibold text-[#1f2937] tracking-tight">Newly released</h2>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#EAF3DE] text-[#1F5C3E] uppercase tracking-wider">NEW</span>
                </div>
                <Link to="/templates" className="text-[12px] font-semibold text-[#1F5C3E] no-underline flex items-center gap-1">
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              <div className="h-[0.5px] bg-gray-100 mb-8" />

              <div className="grid grid-cols-3 gap-6">
                {templates.slice(0, 6).map((template) => (
                  <Link key={template.id} to={`/template/${template.slug}`} className="group no-underline block">
                    <div className="aspect-[16/10] bg-[#f5f4ed] rounded-xl overflow-hidden mb-3 border border-gray-100 shadow-sm transition-all">
                      <img src={template.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={template.title} />
                    </div>
                    <h3 className="text-[14px] font-bold text-gray-900 leading-tight mb-1 line-clamp-1">
                      {template.title}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{template.software || 'Google Sheets'}</span>
                      <span className="text-[10px] font-bold text-[#1F5C3E]">FREE →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="border-t border-gray-100 pt-10 mb-6">
              <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#1F5C3E] mb-10 text-center">
                How it works
              </h3>
              <div className="grid grid-cols-3 gap-8">
                {[
                  { n: "01", title: "Choose", body: "Browse by category and find the right template." },
                  { n: "02", title: "Copy", body: "One click to make a copy directly in Google Sheets." },
                  { n: "03", title: "Use", body: "Start entering data. Charts are ready to use." },
                ].map((s) => (
                  <div key={s.n} className="flex flex-col gap-2">
                    <span className="text-[24px] font-bold text-transparent" 
                          style={{ WebkitTextStroke: "1.5px #1F5C3E" }}>{s.n}</span>
                    <h4 className="text-[13px] font-bold text-gray-900 leading-snug">{s.title}</h4>
                    <p className="text-[12px] text-[#6b7280] leading-relaxed">{s.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>

          {/* SIDEBAR: STICKY TOP CORRETTO */}
          <aside className="flex-[0.26] w-[260px] sticky top-[100px] self-start flex flex-col gap-10 border-l border-gray-50 pl-8">
            {videoId && (
              <div>
                <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-100 shadow-lg mb-3">
                   <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} title="Guide" frameBorder="0" allowFullScreen></iframe>
                </div>
                <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#374151]">
                  <MonitorPlay size={16} /> Video Guide
                </h4>
              </div>
            )}

            <div className="flex flex-col gap-4">
               <div className="bg-[#1F5C3E] text-white py-2 px-4 rounded-md text-center">
                  <span className="text-[11px] font-black uppercase tracking-widest">Categories</span>
               </div>
               <div className="relative">
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Filter categories..." 
                         className="w-full bg-[#f5f4ed] border border-gray-100 rounded-lg py-2 pl-9 pr-4 text-xs font-bold text-gray-600 focus:ring-1 focus:ring-[#1F5C3E] outline-none" />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={13} />
               </div>
               <div className="flex flex-col gap-1 px-1">
                  {filteredCategories.slice(0, 18).map((cat) => (
                    <Link key={cat.id} to={`/category/${cat.slug}`} className="text-[12px] font-bold text-gray-500 hover:text-[#1F5C3E] no-underline py-1.5 border-b border-gray-50 transition-colors">
                      {cat.name}
                    </Link>
                  ))}
               </div>
            </div>

            <div className="flex flex-col gap-3">
               <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">Follow us</h4>
               <a href="#" className="flex items-center justify-between border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 transition-all no-underline">
                  <div className="flex items-center gap-2.5"><PinterestIcon /><span className="text-[12px] font-bold text-gray-700">Pinterest</span></div>
                  <span className="text-[10px] font-black text-[#1F5C3E] uppercase tracking-tighter">Follow →</span>
               </a>
            </div>
          </aside>

        </div>
      </div>
      <Footer />
    </div>
  )
}
