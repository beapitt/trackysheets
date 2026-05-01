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
        .limit(8);

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
      
      {/* Mobile Only View */}
      <CategoryPills categories={categories} />

      <main className="flex-grow w-full max-w-[1550px] mx-auto px-6 md:px-12 py-10">
        
        {/* IL CONTENITORE PADRE: items-start è vitale per lo sticky */}
        <div className="flex flex-col lg:flex-row items-start gap-12">
          
          <div className="flex-1 min-w-0 w-full">
            <section className="text-left">
              <p className="text-[11px] font-bold tracking-widest uppercase text-[#1F5C3E] mb-2">
                Free Google Sheets Templates
              </p>
              <h1 className="text-[28px] font-bold text-[#1f2937] leading-tight mb-2">
                Spreadsheets that work for you
              </h1>
              <p className="text-[14px] text-[#4b5563] mb-6">Professional. Simple. Ready to use.</p>
              
              <p className="text-[13px] leading-relaxed text-[#374151] border-l-2 border-[#C0DD97] pl-4 mb-6 max-w-2xl">
                TrackySheets provides free Google Sheets templates for budgeting, invoicing, 
                project tracking, and more — no login or registration required.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                {[
                  { num: `50+`, sub: "free templates", n: "01" },
                  { num: "100%", sub: "Google Sheets", n: "02" },
                  { num: "0", sub: "login required", n: "03" },
                ].map((s) => (
                  <div key={s.n} className="bg-[#EAF3DE] rounded-xl p-4 border border-[#C0DD97]/20 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-[#3B6D11] block mb-0.5 opacity-50 uppercase tracking-tighter">Step {s.n}</span>
                    <span className="text-[22px] font-bold text-[#27500A] block leading-none mb-0.5">{s.num}</span>
                    <span className="text-[10px] text-[#3B6D11] uppercase font-bold tracking-tight">{s.sub}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-[16px] font-bold text-[#1f2937]">Newly released</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF3DE] text-[#1F5C3E] uppercase">NEW</span>
                </div>
                <Link to="/templates" className="text-[11px] font-bold text-[#1F5C3E] no-underline opacity-80">
                  View all templates →
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template) => (
                  <Link key={template.id} to={`/template/${template.slug}`} className="group no-underline block">
                    <div className="aspect-[16/10] bg-[#f5f4ed] rounded-xl overflow-hidden mb-3 border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                      <img src={template.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" alt={template.title} />
                    </div>
                    <h3 className="text-[14px] font-bold text-gray-900 mb-0.5 group-hover:text-[#1F5C3E]">{template.title}</h3>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Free Download</span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="border-t border-gray-100 pt-6 pb-8">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F5C3E] mb-6 text-center">How it works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>

          {/* Sidebar: Solo Desktop, Sticky */}
          <aside className="hidden lg:block w-[320px] shrink-0 sticky top-24 self-start">
            <Sidebar />
          </aside>

        </div>
      </main>
      <Footer />
    </>
  )
}
