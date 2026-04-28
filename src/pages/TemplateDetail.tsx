import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import Footer from '../components/Footer'

const GoogleDriveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 87.3 78" className="mr-2">
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
      const { data } = await supabase.from('templates').select('*').eq('slug', slug).single()
      if (data) {
        setTemplate(data)
        setSelectedImg(data.thumbnail)
      }
      setLoading(false)
    }
    fetchTemplate()
  }, [slug])

  if (loading) return <div className="p-20 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Loading...</div>
  if (!template) return <div className="p-20 text-center font-sans text-gray-500">Template not found</div>

  const gallery = [template.thumbnail, template.img_1, template.img_2, template.img_3].filter(Boolean)
  
  const parseList = (data: any) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      return data.split('\n').map(item => item.trim()).filter(item => item !== '');
    }
    return [];
  };

  const featuresList = parseList(template.features);
  const howToUseList = parseList(template.how_to_use);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* CONTENITORE UNIFICATO A 1440PX */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-8">
        
        {/* BREADCRUMB - Allineato a sinistra */}
        <nav className="text-[11px] font-bold text-gray-400 mb-8 uppercase tracking-[0.2em]">
          <Link to="/" className="hover:text-[#1F5C3E] no-underline">Home</Link>
          <span className="mx-3 text-gray-300">/</span>
          <span className="text-gray-900">{template.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          <main className="flex-1">
            {/* TITOLO - Proporzionato */}
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900 mb-10 leading-tight">
              {template.title}
            </h1>

            <div className="grid xl:grid-cols-12 gap-10 mb-20">
              {/* GALLERY PANORAMICA (21:9 Style Claude) */}
              <div className="xl:col-span-8">
                <div className="aspect-[21/9] bg-[#f5f4ed] rounded-3xl overflow-hidden mb-5 border border-gray-100 shadow-sm">
                  <img src={selectedImg || ''} className="w-full h-full object-cover" alt="Preview" />
                </div>
                <div className="flex gap-3">
                  {gallery.map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => setSelectedImg(img)} 
                      className={`w-28 aspect-video rounded-xl overflow-hidden border-2 transition-all ${selectedImg === img ? 'border-[#1F5C3E]' : 'border-transparent opacity-40 hover:opacity-100'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                    </button>
                  ))}
                </div>
              </div>

              {/* BOX DOWNLOAD & SPECS */}
              <div className="xl:col-span-4 flex flex-col gap-5">
                <div className="bg-[#f5f4ed] rounded-[32px] p-8 border border-gray-100">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1F5C3E] mb-6">Technical Details</h4>
                  <div className="space-y-4 text-[13px] font-bold">
                    <div className="flex justify-between border-b border-gray-200/50 pb-3">
                      <span className="text-gray-400">Software</span>
                      <span className="text-gray-900">{template.software || 'Google Sheets'}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200/50 pb-3">
                      <span className="text-gray-400">Format</span>
                      <span className="text-gray-900">Instant Download</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Difficulty</span>
                      <span className="text-gray-900">{template.difficulty || 'Beginner'}</span>
                    </div>
                  </div>
                </div>

                <a 
                  href={template.download_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full bg-[#1F5C3E] text-white px-8 py-6 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl hover:bg-black transition-all no-underline"
                >
                  <div className="flex items-center"><GoogleDriveIcon /> Download for Sheets</div>
                  <span className="text-xl">↓</span>
                </a>
              </div>
            </div>

            {/* DESCRIZIONE - Allineata e pulita */}
            <div className="max-w-4xl">
              <div className="border-l-4 border-[#C0DD97] pl-10 mb-20 text-xl text-gray-600 leading-relaxed font-light italic">
                <div dangerouslySetInnerHTML={{ __html: template.long_description }} />
              </div>

              {/* WHAT'S INCLUDED */}
              <div className="mb-20">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 mb-10">What's included</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {featuresList.map((f: string, i: number) => {
                    const [title, desc] = f.includes(':') ? f.split(':') : ['Highlight', f];
                    return (
                      <div key={i} className="bg-gray-50 p-7 rounded-[24px] border border-gray-100">
                        <div className="text-2xl mb-4">✨</div>
                        <h4 className="text-[13px] font-black uppercase mb-2 text-gray-900 tracking-tight">{title}</h4>
                        <p className="text-[12px] text-gray-500 leading-relaxed font-medium">{desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* HOW TO USE - Cerchi Verdi */}
              <div className="mb-24">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 mb-10">How to use</h3>
                <div className="space-y-6">
                  {howToUseList.map((step: string, i: number) => (
                    <div key={i} className="flex items-start gap-6">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1F5C3E] text-white text-[12px] font-black shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-[16px] text-gray-600 leading-snug font-medium pt-1.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>

          {/* SIDEBAR - Allineata a destra */}
          <aside className="w-[280px] sticky top-24">
            <Sidebar />
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  )
}
