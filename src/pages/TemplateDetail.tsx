import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import Footer from '../components/Footer'
import { LayoutGrid, Zap, BarChart3, Check, MonitorPlay } from 'lucide-react'

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

  if (loading) return <div className="p-20 text-center font-bold text-gray-300 uppercase tracking-widest">Loading...</div>
  if (!template) return <div className="p-20 text-center font-sans text-gray-500">Template not found</div>

  const gallery = [template.thumbnail, template.img_1, template.img_2, template.img_3].filter(Boolean)
  
  const parseList = (data: any) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      if (data.startsWith('[') && data.endsWith(']')) {
        try { return JSON.parse(data); } catch (e) { }
      }
      return data.split('\n').map(item => item.trim()).filter(item => item !== '');
    }
    return [];
  };

  const featuresList = parseList(template.features);
  const howToUseList = parseList(template.how_to_use);
  
  // Icone più spesse e visibili
  const featureIcons = [
    <LayoutGrid size={22} strokeWidth={2.5} className="text-[#1F5C3E]" />, 
    <Zap size={22} strokeWidth={2.5} className="text-[#1F5C3E]" />, 
    <BarChart3 size={22} strokeWidth={2.5} className="text-[#1F5C3E]" />
  ];

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-sans">
      <Navbar />

      <div className="w-full max-w-[1550px] mx-auto px-12 py-8">
        
        <nav className="text-[11px] font-bold text-gray-400 mb-4 uppercase tracking-[0.1em]">
          <Link to="/" className="hover:text-[#1F5C3E] no-underline">Home</Link>
          <span className="mx-3 text-gray-200">/</span>
          <span className="text-gray-600">{template.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-14 items-start">
          
          <main className="flex-[0.72] w-full">
            {/* TITOLO + SHORT DESCRIPTION */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 leading-tight">
                {template.title}
                </h1>
                <p className="text-xl text-gray-400 font-medium tracking-tight">
                    {template.short_description}
                </p>
            </div>

            <div className="grid xl:grid-cols-12 gap-10 mb-12">
              <div className="xl:col-span-8">
                <div className="aspect-[21/9] bg-[#f5f4ed] rounded-xl overflow-hidden mb-5 border border-gray-100 shadow-sm">
                  <img src={selectedImg || ''} className="w-full h-full object-cover" alt="Preview" />
                </div>
                <div className="flex gap-3">
                  {gallery.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImg(img)} 
                      className={`w-28 aspect-video rounded-xl overflow-hidden border-2 transition-all ${selectedImg === img ? 'border-[#1F5C3E]' : 'border-transparent opacity-40 hover:opacity-100'}`}>
                      <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                    </button>
                  ))}
                </div>
              </div>

              {/* SIDE BOX: SPECS & DOWNLOAD */}
              <div className="xl:col-span-4 flex flex-col">
                <div className="bg-[#f5f4ed] rounded-xl p-6 border border-gray-100 mb-4 shadow-sm">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-5">Technical Specifications</h4>
                  <div className="space-y-3 text-[12px]">
                    {[
                      { label: 'Software', value: template.software || 'Google Sheets' },
                      { label: 'License', value: 'Personal Use Only' },
                      { label: 'Format', value: template.file_format || 'Instant Copy' },
                      { label: 'Access', value: 'No Login Required' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between border-b border-gray-200/40 pb-2.5 last:border-0">
                        <span className="text-gray-500 font-bold">{item.label}</span>
                        <span className="text-[#4b5563] font-black text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a href={template.download_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#1F5C3E] text-white py-4 rounded-xl font-bold uppercase text-[12px] tracking-[0.1em] shadow-lg hover:bg-black transition-all no-underline">
                  <span className="text-lg">↓</span> Download for Google Sheets
                </a>
                
                <div className="mt-4 flex justify-center items-center gap-4 text-[10.5px] font-extrabold text-[#4b5563] tracking-tight">
                  <span className="flex items-center gap-1.5 whitespace-nowrap">✓ NO REGISTRATION</span>
                  <span className="flex items-center gap-1.5 whitespace-nowrap">✓ SAFE & NO MACROS</span>
                </div>
              </div>
            </div>

            {/* DESCRIPTION SECTION (COMPATTA E NO ITALIC) */}
            <div className="max-w-[850px]">
              <div className="border-l-4 border-[#C0DD97] pl-10 mb-12">
                <div className="text-[18px] text-gray-600 leading-snug font-normal prose prose-flat">
                    {template.long_description.split('\n').map((line: string, i: number) => {
                        if (line.includes(':')) {
                            const [boldPart, normalPart] = line.split(':');
                            return <p key={i} className="mb-2"><strong className="text-gray-900 font-bold">{boldPart}:</strong>{normalPart}</p>
                        }
                        return <p key={i} className="mb-2">{line}</p>
                    })}
                </div>
              </div>

              {/* WHAT'S INCLUDED - SPAZI RIDOTTI */}
              <div className="mb-12">
                <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#374151] mb-6">What's included</h3>
                <div className="grid md:grid-cols-3 gap-5">
                  {featuresList.map((f: string, i: number) => {
                    const [title, desc] = f.includes(':') ? f.split(':') : ['Highlight', f];
                    return (
                      <div key={i} className="bg-[#f5f4ed] p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="mb-4">{featureIcons[i] || featureIcons[0]}</div>
                        <h4 className="text-[13px] font-black uppercase mb-1 text-gray-900 tracking-tight">{title}</h4>
                        <p className="text-[11px] text-gray-500 leading-tight font-medium">{desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* HOW TO USE - SPAZI RIDOTTI E LINEA COMPATTA */}
              <div className="mb-16">
                <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#374151] mb-8">How to use this template</h3>
                <div className="space-y-4">
                  {howToUseList.map((step: string, i: number) => (
                    <div key={i} className="flex items-start gap-5">
                      <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#1F5C3E] text-white text-[11px] font-black shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-[15px] text-gray-600 leading-tight pt-1 font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>

          {/* SIDEBAR ALLARGATA (28%) */}
          <aside className="flex-[0.28] w-full sticky top-24 pt-4 flex flex-col gap-8">
            
            {/* VIDEO TUTORIAL - NO ITALIC - BOLD */}
            {template.youtube_url && (
              <div>
                <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#374151] mb-4">
                  <MonitorPlay size={16} /> VIDEO TUTORIAL
                </h4>
                <div className="aspect-video bg-[#f5f4ed] rounded-xl overflow-hidden border border-gray-100 shadow-md">
                   <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${template.youtube_url.split('v=')[1]}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            <Sidebar />
          </aside>

        </div>
      </div>
      <Footer />
    </div>
  )
}
