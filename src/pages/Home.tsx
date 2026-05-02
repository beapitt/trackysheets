import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Footer from '../components/Footer'
import Sidebar from '../layout/Sidebar'
import { usePageMeta } from '../hooks/usePageMeta'

export default function Home() {
  const [templates, setTemplates] = useState<any[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      // Carichiamo i template e i settings del sito in parallelo
      const [templatesRes, settingsRes] = await Promise.all([
        supabase.from('templates').select('*').order('created_at', { ascending: false }).limit(6),
        supabase.from('settings').select('*').single()
      ]);

      if (templatesRes.data) setTemplates(templatesRes.data);
      if (settingsRes.data) setSettings(settingsRes.data);
      
      setLoading(false)
    }
    fetchData()
    window.scrollTo(0, 0);
  }, [])

  // --- LOGICA SEO ---
  // Usiamo i dati dal DB, con dei fallback se i campi sono vuoti
  const seoTitle = settings?.site_name || 'TrackySheets – Free Google Sheets Templates';
  const seoDesc = settings?.site_description || 'Professional Google Sheets tools for your daily tasks. No login required. Safe and professional files.';
  
  usePageMeta(seoTitle, seoDesc);

  if (loading) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden antialiased font-inter text-left">
      <Navbar />
      
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-5 md:px-10 pt-4 md:pt-6 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 min-w-0">
            {/* HERO SECTION - ORA DINAMICA DAL DB */}
            <section className="text-left mb-8">
              <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1F5C3E] mb-2">
                {settings?.site_name || 'TrackySheets'}
              </p>
              <h1 className="text-[28px] md:text-[38px] font-bold text-[#1f2937] leading-tight mb-3 whitespace-pre-line">
                {settings?.hero_title || 'Spreadsheets that \n work for you'}
              </h1>
              <p className="text-[15px] leading-relaxed text-[#4b5563] border-l-4 border-[#C0DD97] pl-5 max-w-2xl font-medium">
                {settings?.hero_subtitle || 'Professional Google Sheets tools for your daily tasks. No login required.'}
              </p>
            </section>

            {/* LISTA TEMPLATE */}
            <section className="mb-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-[#1f2937]">Newly released</h2>
                <Link to="/templates" className="text-xs font-bold text-[#1F5C3E] no-underline hover:underline">View all →</Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((t) => (
                  <Link key={t.id} to={`/template/${t.slug}`} className="group no-underline block">
                    <div className="aspect-[16/10] bg-gray-50 rounded-2xl overflow-hidden mb-3 border border-gray-100 transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                      <img src={t.thumbnail} className="w-full h-full object-cover" alt={t.title} />
                    </div>
                    <h3 className="text-[14px] font-bold text-gray-900 mb-0.5 group-hover:text-[#1F5C3E] transition-colors">
                      {t.title}
                    </h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Free Download</p>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="w-full lg:w-[300px] shrink-0 lg:sticky lg:top-24 self-start">
            <Sidebar />
          </aside>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
