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
        .limit(6);

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

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 md:px-10 pt-6 pb-16">
        
        <div className="flex flex-col lg:flex-row items-start gap-10">
          
          {/* Colonna Principale con micro-allineamento logo */}
          <div className="flex-1 min-w-0 w-full md:ml-[2px]">
            <section className="text-left mb-6">
              <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1F5C3E] mb-2">
                Free Google Sheets Templates
              </p>
              <h1 className="text-[32px] md:text-[38px] font-bold text-[#1f2937] leading-[1.1] mb-3 tracking-tight">
                Spreadsheets that <br className="hidden md:block" /> work for you
              </h1>
              
              <p className="text-[14px] leading-relaxed text-[#4b5563] border-l-4 border-[#C0DD97] pl-5 mb-6 max-w-2xl">
                Professional Google Sheets templates for budgeting and project tracking. 
                No login required — just professional tools at your fingertips.
              </p>

              {/* STEP BOXES - RETTANGOLARI, BASSI, SMUSSATI */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { num: `50+`, sub: "free templates", n: "01" },
                  { num: "100%", sub: "Google Sheets", n: "02" },
                  { num: "0", sub: "login required", n: "03" },
                ].map((s) => (
                  <div key={s.n} className="bg-gray-50/60 rounded-xl px-4 py-2.5 border border-gray-100 flex items-center justify-between md:justify-start md:gap-4 transition-all hover:bg-gray-50">
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Step {s.n}</span>
                       <span className="text-[18px] font-bold text-gray-700 leading-none">{s.num}</span>
                    </div>
                    <span className="text-[9px] text-gray-500 uppercase font-black tracking-tight opacity-70 md:mt-3">
                      {s.sub}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* SEZIONE TEMPLATE - RITMO SERRATO */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-[16px] font-bold text-[#1f2937]">Newly released</h2>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-[#1F5C3E] text-white uppercase tracking-wider">NEW</span>
                </div>
                <Link to="/templates" className="text-[11px] font-bold text-[#1F5C3E] no-underline opacity-80 hover:opacity-100">
                  View all templates →
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <Link key={template.id} to={`/template/${template.slug}`} className="group no-underline block">
                    <div className="aspect-[16/10] bg-[#f5f4ed] rounded-xl overflow-hidden mb-3 border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                      <img src={template.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={template.title} />
                    </div>
                    <h3 className="text-[13px] font-bold text-gray-900 mb-0.5 group-hover:text-[#1F5C3E] transition-colors text-left">{template.title}</h3>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-left">Free Download</p>
                  </Link>
                ))}
              </div>
            </section>

            {/* HOW IT WORKS MINIMALE */}
            <section className="border-t border-gray-100 pt-6 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { n: "01", title: "Choose", body: "Pick a professional template from our library." },
                  { n: "02", title: "Copy", body: "One click to save a copy to your Drive." },
                  { n: "03", title: "Use", body: "Start managing your data for free." },
                ].map((s) => (
                  <div key={s.n} className="flex flex-col items-center md:items-start text-center md:text-left">
                    <span className="text-[20px] font-black text-gray-100 block mb-1">{s.n}</span>
                    <h4 className="text-[11px] font-bold text-gray-700 mb-1 uppercase tracking-wider">{s.title}</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed max-w-[180px]">{s.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="w-full lg:w-[300px] shrink-0 lg:sticky lg:top-24 self-start">
            <Sidebar />
          </aside>

        </div>
      </main>
      <Footer />
    </>
  )
}
