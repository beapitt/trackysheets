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
      const { data: tData } = await supabase.from('templates').select('*').order('created_at', { ascending: false }).limit(6);
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
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      
      <div className="w-full bg-white border-b border-gray-50">
        <div className="max-w-[1440px] mx-auto">
          <CategoryPills categories={categories} />
        </div>
      </div>

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-10 pt-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="flex-1 min-w-0">
            <section className="mb-10">
              <p className="text-[10px] font-black tracking-widest uppercase text-[#1F5C3E] mb-2">Free Google Sheets Templates</p>
              <h1 className="text-[32px] md:text-[42px] font-extrabold text-gray-900 leading-[1.1] mb-4 tracking-tight">
                Spreadsheets that <br className="hidden md:block" /> work for you
              </h1>
              <p className="text-[15px] leading-relaxed text-gray-600 border-l-4 border-[#C0DD97] pl-5 mb-8 max-w-2xl font-medium">
                Professional templates for budgeting and project tracking. No login required.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[{ n: "01", val: "50+", txt: "free templates" }, { n: "02", val: "100%", txt: "Google Sheets" }, { n: "03", val: "0", txt: "login required" }].map((s) => (
                  <div key={s.n} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between items-center md:flex-col md:items-start md:gap-1">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-bold text-gray-400 uppercase">Step {s.n}</span>
                      <span className="text-xl font-black text-gray-800">{s.val}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{s.txt}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Newly released</h2>
                <Link to="/templates" className="text-xs font-bold text-[#1F5C3E] no-underline">View all →</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((t) => (
                  <Link key={t.id} to={`/template/${t.slug}`} className="group no-underline">
                    <div className="aspect-[16/10] bg-gray-100 rounded-2xl overflow-hidden mb-3 border border-gray-100 transition-transform group-hover:-translate-y-1">
                      <img src={t.thumbnail} className="w-full h-full object-cover" alt={t.title} />
                    </div>
                    <h3 className="text-[14px] font-bold text-gray-900 mb-1 group-hover:text-[#1F5C3E]">{t.title}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Free Download</p>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-24 self-start">
            <Sidebar />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}
