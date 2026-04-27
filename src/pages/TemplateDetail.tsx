import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import Footer from '../components/Footer'

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

  if (loading) return <div className="p-20 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">Loading</div>
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
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 px-8">
        <main className="flex-1 pt-16">
          <nav className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-10">
            <Link to="/" className="hover:text-brand-green transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">{template.title}</span>
          </nav>

          <h1 className="text-6xl font-black tracking-tighter leading-[0.9] mb-14 text-gray-900">
            {template.title}
          </h1>

          <div className="grid lg:grid-cols-12 gap-12 mb-24">
            <div className="lg:col-span-7">
              <div className="aspect-video bg-warm-cream rounded-[32px] overflow-hidden mb-6 border border-gray-100/50 shadow-sm">
                <img src={selectedImg || ''} className="w-full h-full object-cover" alt="Preview" />
              </div>
              <div className="flex gap-3">
                {gallery.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(img)} 
                    className={`w-24 aspect-video rounded-xl overflow-hidden border-2 transition-all ${selectedImg === img ? 'border-brand-green' : 'border-transparent opacity-30 hover:opacity-100'}`}>
                    <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-warm-cream rounded-[32px] p-8 border border-gray-100 shadow-sm">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-green mb-6">Technical Specifications</h4>
                <div className="space-y-4 text-[11px] font-black uppercase tracking-tight">
                  <div className="flex justify-between border-b border-gray-200/50 pb-3">
                    <span className="text-gray-400">Software</span>
                    <span className="text-brand-green">{template.software || 'Google Sheets'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Difficulty</span>
                    <span className="text-brand-green">{template.difficulty || 'Beginner'}</span>
                  </div>
                </div>
              </div>
              <a href={template.download_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between w-full bg-brand-green text-white px-8 py-6 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl hover:translate-y-[-2px] transition-all">
                <div className="flex items-center"><GoogleDriveIcon /> Get Template</div>
                <span className="text-lg">→</span>
              </a>
            </div>
          </div>

          <div className="max-w-3xl">
            {/* DESCRIZIONE CORRETTA (Riconosce i tag HTML) */}
            <div className="border-l-[4px] border-[#C0DD97] pl-8 mb-20">
              <div 
                className="text-[20px] font-light text-gray-600 leading-relaxed prose prose-green"
                dangerouslySetInnerHTML={{ __html: template.long_description }} 
              />
            </div>

            {/* WHAT'S INCLUDED */}
            <div className="mb-28">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-8">What's included</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {featuresList.length > 0 ? featuresList.map((f: any, i: number) => (
                  <div key={i} className="bg-warm-cream p-5 rounded-2xl border border-gray-100/50">
                    <div className="text-2xl mb-3">{f.icon || '✨'}</div>
                    <h4 className="text-[12px] font-black uppercase mb-1 text-gray-900">{f.title || 'Feature'}</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{typeof f === 'string' ? f : f.description}</p>
                  </div>
                )) : <p className="text-gray-400 italic text-sm">No features listed.</p>}
              </div>
            </div>

            {/* HOW TO USE */}
            <div className="bg-warm-cream rounded-[40px] p-12 mb-24 border border-gray-100/50">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-10 text-center">How to use this template</h3>
              <div className="space-y-8">
                {howToUseList.length > 0 ? howToUseList.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-6">
                    <div className="w-7 h-7 flex items-center justify-center rounded-full bg-brand-green text-white text-[10px] font-black shrink-0 shadow-md">
                      {i + 1}
                    </div>
                    <p className="text-[14px] text-gray-600 leading-relaxed pt-1">{step}</p>
                  </div>
                )) : <p className="text-gray-400 italic text-sm text-center">No steps provided.</p>}
              </div>
            </div>
          </div>
        </main>
        <aside className="mt-16 lg:w-64"><Sidebar /></aside>
      </div>
      <Footer />
    </div>
  )
}
