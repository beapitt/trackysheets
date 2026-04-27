import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import Footer from '../components/Footer'

// Official Google Drive Icon SVG
const GoogleDriveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 87.3 78" className="mr-3">
    <path fill="#0066DA" d="M6.6 66.8l13.4-23.1H74L60.6 66.8z"/>
    <path fill="#00832D" d="M13.4 20.7l13.4 23.1L6.6 66.8 0 55.4z"/>
    <path fill="#FFBA00" d="M26.8 43.8L40.2 20.7 53.6 43.8z"/>
    <path fill="#0066DA" d="M40.2 20.7L53.6 43.8 80.6 43.8 67.2 20.7z"/>
    <path fill="#EA4335" d="M26.8 43.8L13.4 20.7 40.2 20.7z"/>
    <path fill="#00832D" d="M53.6 43.8L67.2 20.7 87.3 55.4 74 78z"/>
  </svg>
);

export default function TemplateDetail() {
  const { slug } = useParams()
  const [template, setTemplate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTemplate() {
      const { data } = await supabase
        .from('templates')
        .select('*')
        .eq('slug', slug)
        .single()

      if (data) {
        setTemplate(data)
        setSelectedImg(data.thumbnail)
      }
      setLoading(false)
    }
    fetchTemplate()
  }, [slug])

  if (loading) return (
    <div className="p-20 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
      Loading
    </div>
  )
  
  if (!template) return (
    <div className="p-20 text-center font-sans text-gray-500">
      Template not found
    </div>
  )

  const gallery = [
    template.thumbnail,
    template.img_1,
    template.img_2,
    template.img_3,
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 px-8">
        
        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 pt-16">
          
          {/* Breadcrumbs */}
          <nav className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-10">
            <Link to="/" className="hover:text-[#1F5C3E] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">{template.title}</span>
          </nav>

          {/* Page Title */}
          <h1 className="text-6xl font-black tracking-tighter leading-[0.9] mb-14 text-gray-900">
            {template.title}
          </h1>

          {/* Visual Showcase Section */}
          <div className="grid lg:grid-cols-12 gap-12 mb-24">
            <div className="lg:col-span-7">
              <div className="aspect-video bg-[#f5f4ed] rounded-[32px] overflow-hidden mb-6 border border-gray-100/50 shadow-sm">
                <img src={selectedImg || ''} className="w-full h-full object-cover" alt="Template Preview" />
              </div>
              <div className="flex gap-3">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(img)}
                    className={`w-24 aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImg === img ? 'border-[#1F5C3E]' : 'border-transparent opacity-30 hover:opacity-100'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar-style CTA within main grid */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-[#f5f4ed] rounded-[32px] p-8 border border-gray-100 shadow-sm">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1F5C3E] mb-6">
                  Technical Specifications
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Software</span>
                    <span className="text-[11px] font-black text-[#1F5C3E]">{template.software || 'Google Sheets'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Difficulty</span>
                    <span className="text-[11px] font-black text-[#1F5C3E]">{template.difficulty || 'Beginner'}</span>
                  </div>
                </div>
              </div>

              <a 
                href={template.download_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full bg-[#1F5C3E] text-white px-8 py-6 rounded-2xl font-black uppercase text-[11px] tracking-widest no-underline shadow-xl shadow-green-900/10 hover:bg-[#27500A] hover:translate-y-[-2px] transition-all"
              >
                <div className="flex items-center">
                  <GoogleDriveIcon />
                  Get Template
                </div>
                <span className="text-lg">→</span>
              </a>
            </div>
          </div>

          {/* ── DESCRIPTION AREA ── */}
          <div className="max-w-3xl">
            
            {/* Introductory Hook */}
            <div className="border-l-[3px] border-[#C0DD97] pl-8 mb-20">
              <p className="text-[22px] font-light text-gray-500 leading-relaxed italic">
                {template.short_description}
              </p>
            </div>

            {/* Features Grid (Naked Icons) */}
            <div className="mb-28">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-12">
                What’s included
              </h3>
              <div className="grid md:grid-cols-3 gap-12">
                {template.features?.map((f: any, i: number) => (
                  <div key={i}>
                    <div className="text-5xl mb-6 grayscale hover:grayscale-0 transition-all duration-500 cursor-default">
                      {f.icon}
                    </div>
                    <h4 className="text-[13px] font-black uppercase tracking-tight mb-2 text-gray-900">
                      {f.title}
                    </h4>
                    <p className="text-[12px] font-light text-gray-500 leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Use (Claude Style Cream Box) */}
            <div className="bg-[#f5f4ed] rounded-[40px] p-16 mb-24 border border-gray-100/50">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-12 text-center">
                How to use this template
              </h3>
              <div className="space-y-12">
                {template.how_to_use?.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-8">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1F5C3E] text-white text-[11px] font-black shrink-0 shadow-lg shadow-green-900/10">
                      {i + 1}
                    </div>
                    <p className="text-[15px] font-light text-gray-600 leading-relaxed pt-1">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className="mt-16 lg:w-64">
          <Sidebar />
        </aside>

      </div>

      <Footer />
    </div>
  )
}
