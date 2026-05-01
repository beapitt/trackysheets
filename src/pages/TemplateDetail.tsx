import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Footer from '../components/Footer'
import Sidebar from '../layout/Sidebar'
import { 
  LayoutGrid, Zap, BarChart3, X, ChevronDown, Download, ShieldCheck
} from 'lucide-react'

export default function TemplateDetail() {
  const { slug } = useParams()
  const [template, setTemplate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState<string | null>(null)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    async function fetchData() {
      const { data: tData } = await supabase.from('templates').select('*').eq('slug', slug).single()
      if (tData) {
        setTemplate(tData)
        setSelectedImg(tData.thumbnail)
      }
      setLoading(false)
    }
    fetchData()
    window.scrollTo(0, 0);
  }, [slug])

  if (loading) return <div className="p-20 text-center font-bold text-gray-300 uppercase tracking-widest text-[10px]">Loading...</div>
  if (!template) return <div className="p-20 text-center font-sans text-gray-500">Template not found</div>

  const gallery = [template.thumbnail, template.img_1, template.img_2, template.img_3].filter(Boolean)
  
  const parseList = (data: any) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') return data.split('\n').map(item => item.trim()).filter(item => item !== '');
    return [];
  };

  const featuresList = parseList(template.features);
  
  const howToUseSteps = [
    "Click the download button to access the official Google Sheets link.",
    "Make a copy of the file to your personal Google Drive.",
    "Start tracking your data instantly with visual reports."
  ];

  const featureIcons = [
    <LayoutGrid size={22} strokeWidth={2.5} className="text-[#1F5C3E]" />, 
    <Zap size={22} strokeWidth={2.5} className="text-[#1F5C3E]" />, 
    <BarChart3 size={22} strokeWidth={2.5} className="text-[#1F5C3E]" />
  ];

  const faqData = Array.isArray(template.faqs) ? template.faqs : [];

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-sans text-left">
      <Navbar />

      {/* Container allineato alla Navbar (max-w-7xl = 1280px). 
          Padding ridotto per eliminare l'"oceano" di spazio.
      */}
      <main className="w-full max-w-7xl mx-auto px-6 md:px-10 py-4">
        
        {/* mt-8 forzato per allineare il titolo alla voce 'Home' della Navbar */}
        <div className="flex flex-col lg:flex-row gap-10 items-start relative mt-8">
          
          <div className="w-full lg:flex-[0.72] min-w-0">
            
            {/* TITOLO: Allineato verticalmente */}
            <div className="mb-6">
              <h1 className="text-[24px] md:text-[32px] text-[#1f2937] font-extrabold tracking-tight leading-tight mb-2">
                {template.title}
              </h1>
              <p className="text-[14px] text-gray-500 leading-relaxed max-w-2xl">
                {template.short_description?.replace(/<\/?[^>]+(>|$)/g, "")}
              </p>
            </div>

            {/* GALLERY + SPECS: Layout originale compattato */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              <div className="lg:col-span-8">
                <div 
                  className="aspect-video bg-[#f5f4ed] rounded-xl overflow-hidden mb-3 border border-gray-100 shadow-sm cursor-zoom-in"
                  onClick={() => setLightboxImg(selectedImg)}
                >
                  <img src={selectedImg || ''} className="w-full h-full object-cover" alt="Preview" />
                </div>
                <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
                  {gallery.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImg(img)} 
                      className={`flex-shrink-0 w-24 aspect-video rounded-lg overflow-hidden border-2 transition-all ${selectedImg === img ? 'border-[#1F5C3E]' : 'border-transparent opacity-60'}`}>
                      <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                    </button>
                  ))}
                </div>
              </div>

              {/* BOX METADATI: Ripristinato accanto alla gallery */}
              <div className="lg:col-span-4 flex flex-col w-full">
                <div className="bg-[#f5f4ed] rounded-xl p-5 border border-gray-100 mb-4 shadow-sm">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Specifications</h4>
                  <div className="space-y-3 text-[12px]">
                    {[
                      { label: 'Software', value: template.software || 'Google Sheets' },
                      { label: 'License', value: 'Personal Use' },
                      { label: 'Format', value: template.file_format || 'Instant Copy' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between border-b border-gray-200/40 pb-2 last:border-0">
                        <span className="text-gray-400 font-bold">{item.label}</span>
                        <span className="text-gray-700 font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a href={template.google_sheets_url || template.download_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#1F5C3E] text-white py-4 rounded-xl font-bold uppercase text-[12px] tracking-widest shadow-md hover:bg-black transition-all no-underline">
                  <Download size={18} /> Download Now
                </a>
              </div>
            </div>

            {/* DESCRIPTION: Margine ridotto */}
            <div className="border-l-4 border-[#C0DD97] pl-5 mb-8">
              <div className="text-[15px] text-gray-600 leading-relaxed space-y-3">
                {template.long_description?.split('\n').map((line: string, i: number) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>

            {/* WHAT'S INCLUDED: Spazio compattato mb-8 */}
            <div className="mb-8 pt-4 border-t border-gray-50">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-5">Features Included</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featuresList.slice(0, 3).map((f: string, i: number) => (
                  <div key={i} className="bg-[#f5f4ed] p-5 rounded-xl border border-gray-100 flex flex-col gap-2 min-h-[90px] justify-center">
                    {featureIcons[i]}
                    <div className="text-[14px] font-bold text-gray-800 leading-tight">
                      {f.includes(':') ? f.split(':')[0] : f}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HOW TO USE: Spazio compattato mb-8 */}
            <div className="mb-8 border-t border-gray-100 pt-6">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4">How to use this template</h3>
              <div className="space-y-4">
                {howToUseSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-4 max-w-4xl">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#1F5C3E] text-white text-[10px] font-black shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-[14px] text-gray-600 font-medium leading-snug">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ: Compattate e con titolo descrittivo */}
            {faqData.length > 0 && (
              <div className="mb-8 border-t border-gray-100 pt-6">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4">Frequently Asked Questions about this Template</h3>
                <div className="divide-y divide-gray-100 border-b border-gray-100">
                  {faqData.map((item: any, i: number) => (
                    <div key={i} className="py-0.5">
                      <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex justify-between items-center py-3.5 text-left group">
                        <span className="text-[14px] font-bold text-gray-800 group-hover:text-[#1F5C3E] transition-colors">{item.q}</span>
                        <ChevronDown size={16} className={`text-gray-300 transition-all ${openFaq === i ? 'rotate-180 text-[#1F5C3E]' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-60 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="text-[13px] text-gray-500 leading-relaxed">{item.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR: Larghezza corretta (280px) e Sticky Dinamica */}
          <aside className="w-full lg:w-[280px] shrink-0 lg:sticky lg:top-24 self-start">
             <div className="hidden lg:block bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
                <div className="flex items-center gap-3 text-[#1F5C3E] mb-2">
                  <ShieldCheck size={20} />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-900">Safe Template</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed uppercase font-bold tracking-tighter">Verified by Google Infrastructure</p>
             </div>
            <Sidebar />
          </aside>
        </div>
      </main>

      <Footer />

      {/* Lightbox per immagini grandi */}
      {lightboxImg && (
        <div className="fixed inset-0 bg-black/95 z-[110] flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setLightboxImg(null)}>
          <img src={lightboxImg} className="max-w-full max-h-full rounded-lg shadow-2xl" alt="Enlarged" />
        </div>
      )}
    </div>
  )
}
