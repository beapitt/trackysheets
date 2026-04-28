import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import Footer from '../components/Footer'
import { LayoutGrid, Zap, BarChart3, Check } from 'lucide-react'

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
  const featureIcons = [<LayoutGrid size={18} />, <Zap size={18} />, <BarChart3 size={18} />];

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-sans">
      <Navbar />

      <div className="w-full max-w-[1550px] mx-auto px-12 py-8">
        
        <nav className="text-[11px] font-bold text-gray-400 mb-6 uppercase tracking-[0.1em]">
          <Link to="/" className="hover:text-[#1F5C3E] no-underline">Home</Link>
          <span className="mx-3 text-gray-200">/</span>
          <span className="text-gray-600">{template.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-14 items-start">
          
          <main className="flex-[0.72] w-full">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-10 leading-tight">
              {template.title}
            </h1>

            <div className="grid xl:grid-cols-12 gap-10 mb-20">
              <div className="xl:col-span-8">
                <div className="aspect-[21/9] bg-[#f5f4ed] rounded-xl overflow-hidden mb-5 border border-gray-100">
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

              {/* BOX DATI E PULSANTE AGGIORNATO */}
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
                        {/* Valore in Grigio Antracite ben spaziato */}
                        <span className="text-[#4b5563] font-black text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PULSANTE CON FRECCIA A SINISTRA */}
                <a href={template.download_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#1F5C3E] text-white py-4 rounded-xl font-bold uppercase text-[12px] tracking-[0.1em] shadow-lg hover:bg-black transition-all no-underline">
                  <span className="text-lg">↓</span> Download for Google Sheets
                </a>
                
                {/* MICRO-RASSICURAZIONI BOLD E GRIGIO SCURO */}
                <div className="mt-4 flex justify-center items-center gap-4 text-[10.5px] font-extrabold text-[#4b5563] tracking-tight">
                  <span className="flex items-center gap-1.5 whitespace-nowrap">✓ NO REGISTRATION</span>
                  <span className="flex items-center gap-1.5 whitespace-nowrap">✓ SAFE & NO MACROS</span>
                </div>
              </div>
            </div>

            <div className="max-w-[850px]">
              <div className="border-l-4 border-[#C0DD97] pl-10 mb-20">
                <div 
                  className="text-[19px] text-gray-600 leading-relaxed font-normal prose prose-flat"
                  dangerouslySetInnerHTML={{ __html: template.long_description }} 
                />
              </div>

              <div className="mb-20">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-gray-800 mb-8">What's included</h3>
                <div className="grid md:grid-cols-3 gap-5">
                  {featuresList.map((f: string, i: number) => {
                    const [title, desc] = f.includes(':') ? f.split(':') : ['Highlight', f];
                    return (
                      <div key={i} className="bg-[#f5f4ed] p-6 rounded-2xl border border-gray-100">
                        <div className="text-[#1F5C3E] mb-4">{featureIcons[i] || <LayoutGrid size={18} />}</div>
                        <h4 className="text-[13px] font-bold uppercase mb-2 text-gray-900 tracking-tight">{title}</h4>
                        <p className="text-[11px] text-gray-500 leading-snug font-medium">{desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mb-24">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-gray-800 mb-10">How to use this template</h3>
                <div className="space-y-5">
                  {howToUseList.map((step: string, i: number) => (
                    <div key={i} className="flex items-start gap-6">
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

          <aside className="flex-[0.28] w-full sticky top-24 pt-4">
            <Sidebar />
          </aside>

        </div>
      </div>
      <Footer />
    </div>
  )
}
