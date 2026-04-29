import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Footer from '../components/Footer'
import { Search, ArrowRight, MonitorPlay } from 'lucide-react'

// ... (PinterestIcon rimane uguale)

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
      // Prendiamo i settings
      const { data: sData } = await supabase.from('settings').select('*').maybeSingle()
      
      if (tData) setTemplates(tData)
      if (cData) setCategories(cData)
      if (sData) setSettings(sData)
      setLoading(false)
    }
    fetchData()
  }, [])

  // Funzione migliorata per estrarre l'ID anche con timestamp (es. &t=16s)
  const getYouTubeID = (url: string) => {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\??v?=?))([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  // USIAMO youtube_url COME VISTO SU SUPABASE
  const videoId = settings?.youtube_url ? getYouTubeID(settings.youtube_url) : null;
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <Navbar />
      <div className="w-full max-w-[1550px] mx-auto px-10 py-10">
        <div className="flex flex-col lg:flex-row gap-[36px] items-start">
          
          <main className="flex-1 min-w-0 flex flex-col gap-12">
            {/* ... Sezione Hero e Stat Cards (rimangono uguali) ... */}
            <section className="pt-4">
              <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#1F5C3E] mb-2">Free Google Sheets Templates</p>
              <h1 className="text-[26px] font-medium tracking-tight text-[#1f2937] leading-tight mb-1" style={{ letterSpacing: '-0.02em' }}>Spreadsheets that work for you</h1>
              <p className="text-[13px] text-[#4b5563] mb-5 font-normal">Professional. Simple. Ready to use.</p>
              <p className="text-[13px] leading-relaxed text-[#374151] border-l-2 border-[#C0DD97] pl-4 mb-8 max-w-3xl">
                TrackySheets provides free Google Sheets templates for budgeting, invoicing, project tracking, and more — no login or registration required.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { num: `50+`, sub: "free templates", n: "01" },
                  { num: "100%", sub: "Google Sheets", n: "02" },
                  { num: "0", sub: "login required", n: "03" },
                ].map((s) => (
                  <div key={s.n} className="bg-[#EAF3DE] rounded-xl p-4 flex flex-col">
                    <span className="text-[11px] font-bold text-transparent mb-1" style={{ WebkitTextStroke: "1.2px #3B6D11", lineHeight: 1 }}>{s.n}</span>
                    <span className="text-[22px] font-semibold text-[#27500A] leading-none mb-1">{s.num}</span>
                    <span className="text-[11px] text-[#3B6D11] uppercase font-medium tracking-wide">{s.sub}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ... Sezione Newly Released e How it Works (rimangono uguali) ... */}
          </main>

          <aside className="w-full lg:w-[260px] sticky top-24 pt-4 flex flex-col gap-10 lg:border-l lg:border-gray-50 lg:pl-8">
            {videoId ? (
              <div>
                <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-100 shadow-lg mb-3">
                   <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} title="Home Video Guide" frameBorder="0" allowFullScreen></iframe>
                </div>
                <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#374151]">
                  <MonitorPlay size={16} /> Home Video Guide
                </h4>
              </div>
            ) : (
              <div className="aspect-video bg-[#f5f4ed] rounded-xl flex items-center justify-center border border-gray-100 text-gray-400 text-[10px] font-bold">
                VIDEO TUTORIAL IN ARRIVO
              </div>
            )}
            
            {/* ... Categorie e Social (rimangono uguali) ... */}
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  )
}
