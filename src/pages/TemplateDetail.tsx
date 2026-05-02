import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Footer from '../components/Footer'
import Sidebar from '../layout/Sidebar'
import { ChevronDown, Download, X, CheckCircle2 } from 'lucide-react'

export default function TemplateDetail() {
  const { slug } = useParams()
  const [template, setTemplate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState<string | null>(null)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('templates').select('*').eq('slug', slug).single()
      if (data) {
        setTemplate(data)
        setSelectedImg(data.thumbnail)
      }
      setLoading(false)
    }
    fetchData()
    window.scrollTo(0, 0)
  }, [slug])

  if (loading || !template) return null

  const gallery = [template.thumbnail, template.img_1, template.img_2, template.img_3].filter(Boolean)
  const faqData = Array.isArray(template.faqs) ? template.faqs : []

  return (
    <div className="min-h-screen bg-white text-[#4b5563] font-inter antialiased overflow-x-hidden">
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-5 md:px-10 pt-4 md:pt-6 pb-12">
        
        {/* TITOLO E DESCRIZIONE */}
        <div className="mb-6 text-left">
          <h1 className="text-[24px] md:text-[32px] font-bold tracking-tight text-[#1f2937] leading-tight">
            {template.title}
          </h1>
          <p className="text-[14px] text-[#6b7280] mt-1 font-medium italic border-l-2 border-[#C0DD97] pl-4">
            {template.short_description}
          </p>
        </div>

        {/* GRID LAYOUT - RIDOTTO GAP SU MOBILE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-10 items-start">
          
          <div className="lg:col-span-8 xl:col-span-9">
            {/* GALLERY */}
            <div className="mb-6">
              <div
                className="aspect-video bg-[#f9f9f7] rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-zoom-in group relative"
                onClick={() => setLightboxImg(selectedImg)}
              >
                <img src={selectedImg || ''} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]" alt="View" />
              </div>

              <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(img)}
                    className={`w-20 md:w-24 shrink-0 aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImg === img ? 'border-[#1F5C3E] shadow-md' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8 max-w-4xl text-left px-1">
              <div className="text-[16px] text-[#4b5563] leading-relaxed whitespace-pre-wrap font-medium">
                {template.long_description}
              </div>
            </div>

            {/* GUIDE BOX - AZZERATO MARGINE INFERIORE SU MOBILE */}
            <div className="mb-0 lg:mb-10 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 max-w-4xl text-left">
              <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Guide</h3>
              <div className="space-y-3">
                {['Click Download Now', 'Select Make a copy', 'Instant access'].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#1F5C3E] text-white flex items-center justify-center text-[10px] font-black">{i + 1}</div>
                    <p className="text-[13px] font-bold text-[#1f2937]">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR - ATTACCATA AL BOX SOPRA SU MOBILE */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 self-start mt-2 lg:mt-0">
            <div className="bg-[#f9f9f6] rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col">
              <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 border-b border-gray-100 pb-2 text-center">Specs</h4>
              
              <div className="space-y-2.5 text-[12px] mb-5">
                {[
                  {l:'Software', v:'Google Sheets'}, 
                  {l:'License', v:'Personal Use'}, 
                  {l:'Format', v:'Instant Copy'}
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-gray-400 font-bold">{item.l}</span>
                    <span className="text-[#1f2937] font-bold">{item.v}</span>
                  </div>
                ))}
              </div>

              <a
                href={template.google_sheets_url}
                target="_blank"
                className="flex items-center justify-center gap-2 w-full bg-[#1F5C3E] text-white py-3.5 rounded-xl font-bold text-[14px] hover:bg-black transition-all shadow-md no-underline"
              >
                <Download size={18} /> Download Now
              </a>

              <div className="flex flex-wrap justify-center gap-3 text-[9px] font-black text-gray-400 uppercase tracking-tight mt-5">
                <div className="flex items-center gap-1"><CheckCircle2 size={11} className="text-[#C0DD97]" /> No macros</div>
                <div className="flex items-center gap-1"><CheckCircle2 size={11} className="text-[#C0DD97]" /> 100% free</div>
              </div>
            </div>

            {/* FAQ - SPOSTATE SOTTO IL BOX DOWNLOAD SU MOBILE PER COMPATTEZZA */}
            {faqData.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100 text-left px-1">
                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">FAQ</h3>
                <div className="divide-y divide-gray-50">
                  {faqData.map((item: any, i: number) => (
                    <div key={i} className="py-0">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex justify-between items-center py-3 text-left group"
                      >
                        <span className="text-[13px] font-bold text-[#1f2937] group-hover:text-[#1F5C3E] transition-colors">{item.q}</span>
                        <ChevronDown size={14} className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-[#1F5C3E]' : 'text-gray-300'}`} />
                      </button>
                      <div className={`transition-all duration-200 overflow-hidden ${openFaq === i ? 'max-h-40 pb-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="text-[13px] text-[#6b7280] leading-relaxed">{item.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <Sidebar />
            </div>
          </aside>
        </div>
      </main>

      {/* LIGHTBOX */}
      {lightboxImg && (
        <div className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center p-4" onClick={() => setLightboxImg(null)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white">
            <X size={35} />
          </button>
          <img src={lightboxImg} className="max-w-full max-h-full rounded-lg object-contain shadow-2xl" alt="Zoomed view" />
        </div>
      )}

      <Footer />
    </div>
  )
}
