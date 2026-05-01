import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Footer from '../components/Footer'
import Sidebar from '../layout/Sidebar'
import CategoryPills from '../components/CategoryPills'

export default function Home() {
  const [templates, setTemplates] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: tData } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6); // LIMITATO A 6 PER MASSIMA PULIZIA (2 RIGHE DA 3)

      const { data: cData } = await supabase.from('categories').select('*').order('name')
      
      if (tData) setTemplates(tData)
      if (cData) setCategories(cData)
      setLoading(false)
    }
    fetchData()
    window.scrollTo(0, 0);
  }, [])

  if (loading) return null;

  return (
    <>
      <Navbar />
      
      <CategoryPills categories={categories} />

      {/* CONTAINER ALLINEATO A 1440px - Uguale alla Navbar e alla Pagina Prodotto */}
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 md:px-10 pt-10 pb-16">
        
        <div className="flex flex-col lg:flex-row items-start gap-12">
          
          {/* Griglia Template (Sinistra) */}
          <div className="flex-1 min-w-0 w-full">
            <section className="text-left mb-10">
              <p className="text-[11px] font-black tracking-[0.2em] uppercase text-[#1F5C3E] mb-3">
                Free Google Sheets Templates
              </p>
              <h1 className="text-[32px] md:text-[42px] font-bold text-[#1f2937] leading-[1.1] mb-4 tracking-tight">
                Spreadsheets that <br className="hidden md:block" /> work for you
              </h1>
              
              <p className="text-[15px] leading-relaxed text-[#4b5563] border-l-4 border-[#C0DD97] pl-6 mb-8 max-w-2xl">
                TrackySheets provides professional Google Sheets templates for budgeting, invoicing, 
                and project tracking. No login or registration required — just professional tools at your fingertips.
              </p>

              {/* STEP BOXES - Allineati */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { num: `50+`, sub: "free templates", n: "01" },
                  { num: "100%", sub: "Google Sheets", n: "02" },
                  { num: "0", sub: "login required", n: "03" },
                ].map((s) => (
                  <div key={s.n} className="bg-[#EAF3DE]/50 rounded-2xl p-5 border border-[#C0DD97]/20">
                    <span className="text-[10px] font-black text-[#1F5C3E] block mb-1 opacity-40 uppercase tracking-widest">Step {s.n}</span>
                    <span className="text-[26px] font-bold text-[#1F5C3E] block leading-none mb-1">{s.num}</span>
                    <span className="text-[11px] text-[#1F5C3E] uppercase font-black tracking-tight opacity-70">{s.sub}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* SEZIONE TEMPLATE - 6 pezzi per 2 righe perfette */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-[18px] font-bold text-[#1f2937]">Newly released</h2>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#1F5C3E] text-white uppercase tracking-wider">NEW</span>
                </div>
                <Link to="/templates" className="text-[12px] font-bold text-[#1F5C3E] no-underline hover:underline">
                  View all templates →
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates.map((template) => (
                  <Link key={template.id} to={`/template/${template.slug}`} className="group no-underline block">
                    <div className="aspect-[16/10] bg-[#f5f4ed] rounded-2xl overflow-hidden mb-4 border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                      <img src={template.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={template.title} />
                    </div>
                    <h3 className="text-[15px] font-bold text-gray-900 mb-1 group-hover:text-[#1F5C3E] transition-colors">{template.title}</h3>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Free Download</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* HOW IT WORKS COMPATTO */}
            <section className="border-t border-gray-100 pt-10 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  { n: "01", title: "Choose", body: "Pick a professional template from our curated library." },
                  { n: "02", title: "Copy", body: "One click to save a fully editable copy to your Drive." },
                  { n: "03", title: "Use", body: "Start managing your business data immediately for free." },
                ].map((s) => (
                  <div key={s.n} className="flex flex-col items-center md:items-start text-center md:text-left">
                    <span className="text-[32px] font-black text-[#C0DD97]/40 block mb-2 leading-none">{s.n}</span>
                    <h4 className="text-[14px] font-bold text-gray-900 mb-2 uppercase tracking-wide">{s.title}</h4>
                    <p className="text-[13px] text-[#6b7280] leading-relaxed">{s.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-24 self-start">
            <Sidebar />
          </aside>

        </div>
      </main>
      <Footer />
    </>
  )
}
