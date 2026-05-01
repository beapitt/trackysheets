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
        .limit(6); // 2 RIGHE DA 3 PERFETTE

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

      {/* CONTAINER 1440px + MICRO-ADJUSTMENT MARGIN PER LOGO ALIGNMENT */}
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 md:px-10 pt-8 pb-16">
        
        {/* RIDOTTO GAP A 10 PER RITMO PIÙ TESO */}
        <div className="flex flex-col lg:flex-row items-start gap-10">
          
          {/* Colonna Principale */}
          <div className="flex-1 min-w-0 w-full md:ml-[2px]">
            <section className="text-left mb-8">
              <p className="text-[11px] font-black tracking-[0.2em] uppercase text-[#1F5C3E] mb-2.5">
                Free Google Sheets Templates
              </p>
              <h1 className="text-[32px] md:text-[40px] font-bold text-[#1f2937] leading-[1.1] mb-4 tracking-tight">
                Spreadsheets that <br className="hidden md:block" /> work for you
              </h1>
              
              <p className="text-[15px] leading-relaxed text-[#4b5563] border-l-4 border-[#C0DD97] pl-6 mb-8 max-w-2xl">
                Professional Google Sheets templates for budgeting, invoicing, 
                and project tracking. No login required — just tools at your fingertips.
              </p>

              {/* STEP BOXES - PIÙ SOTTILI, GRIGI E DISCRETI */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {[
                  { num: `50+`, sub: "free templates", n: "01" },
                  { num: "100%", sub: "Google Sheets", n: "02" },
                  { num: "0", sub: "login required", n: "03" },
                ].map((s) => (
                  <div key={s.n} className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 transition-colors hover:bg-gray-50">
                    <span className="text-[9px] font-black text-gray-400 block mb-0.5 uppercase tracking-widest text-left">Step {s.n}</span>
                    <span className="text-[24px] font-bold text-[#374151] block leading-none mb-1 text-left">{s.num}</span>
                    <span className="text-[10px] text-gray-500 uppercase font-black tracking-tight text-left opacity-80">{s.sub}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* SEZIONE TEMPLATE - RITMO PIÙ SERRATO */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <h2 className="text-[17px] font-bold text-[#1f2937]">Newly released</h2>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-[#1F5C3E] text-white uppercase">NEW</span>
                </div>
                <Link to="/templates" className="text-[12px] font-bold text-[#1F5C3E] no-underline hover:opacity-70 transition-opacity">
                  View all templates →
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates.map((template) => (
                  <Link key={template.id} to={`/template/${template.slug}`} className="group no-underline block">
                    <div className="aspect-[16/10] bg-[#f5f4ed] rounded-2xl overflow-hidden mb-3.5 border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                      <img src={template.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={template.title} />
                    </div>
                    <h3 className="text-[14px] font-bold text-gray-900 mb-0.5 group-hover:text-[#1F5C3E] transition-colors text-left">{template.title}</h3>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Free Download</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* HOW IT WORKS ANCORA PIÙ MINIMALE */}
            <section className="border-t border-gray-100 pt-8 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { n: "01", title: "Choose", body: "Pick a professional template from our library." },
                  { n: "02", title: "Copy", body: "One click to save an editable copy to your Drive." },
                  { n: "03", title: "Use", body: "Start managing your data immediately for free." },
                ].map((s) => (
                  <div key={s.n} className="flex flex-col items-center md:items-start text-center md:text-left">
                    <span className="text-[24px] font-black text-gray-100 block mb-1 leading-none">{s.n}</span>
                    <h4 className="text-[12px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">{s.title}</h4>
                    <p className="text-[12px] text-gray-500 leading-relaxed max-w-[200px]">{s.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar - Leggermente più stretta per focus centrale */}
          <aside className="w-full lg:w-[300px] shrink-0 lg:sticky lg:top-24 self-start">
            <Sidebar />
          </aside>

        </div>
      </main>
      <Footer />
    </>
  )
}
