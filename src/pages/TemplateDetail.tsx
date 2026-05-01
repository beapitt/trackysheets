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
    <div className="min-h-screen bg-white text-[#374151] font-inter antialiased overflow-x-hidden">
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-5 md:px-10 pt-4 md:pt-6 pb-12">
        
        {/* TITOLO E DESCRIZIONE BREVE - COMPATTI */}
        <div className="mb-4 md:mb-6 text-left">
          <h1 className="text-[24px] md:text-[32px] font-bold tracking-tight text-[#1f2937] leading-tight">
            {template.title}
          </h1>
          <p className="text-[14px] text-[#6b7280] mt-1 font-medium italic border-l-2 border-[#C0DD97] pl-4">
            {template.short_description}
          </p>
        </div>

        {/* GRID LAYOUT - GAP RIDOTTO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          <div className="lg:col-span-8 xl:col-span-9">
            
            {/* GALLERY - MARGINI RIDOTTI */}
            <div className="mb-6">
              <div
                className="aspect-video bg-[#f9f9f7] rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-zoom-in group relative"
                onClick={() => setLightboxImg(selectedImg)}
              >
                <img src={selectedImg || ''} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]" alt="Main view" />
              </div>

              <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(img)}
                    className={`w-20 md:w-24 shrink-0 aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImg === img ? 'border-[#1F5C3E] shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* DESCRIPTION - FONT INTER ANTRACITE */}
            <div className="mb-8 max-w-4xl text-left">
              <div className="text-[15px] md:text-[16px] text-[#4b5563] leading-relaxed whitespace-pre-wrap font-medium">
                {template.long_description}
              </div>
            </div>

            {/* HOW TO USE - BOX COMPATTO */}
            <div className="mb-8 bg-gray-50/50 p-5 md:p-6 rounded-2xl border border-gray-100 max-w-4xl text-left">
              <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
                Guide
              </h3>
              <div className="space-y-3">
                {[
                  'Click the "Download Now" button.',
                  'Select "Make a copy" in the new tab.',
                  'Access is instant and 100% free.'
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#1F5C3E] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-[13px] text-[#374151] font-bold leading-none">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ - COMPATTE */}
            {faqData.length > 0 && (
              <div className="pt-6 border-t border-gray-100 max-w-4xl text-left">
                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                  FAQ
                </h3>
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
          </div>

          {/* SIDEBAR - SENZA BUCHI */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 self-start">
            <div className="bg-[#f9f9f6] rounded-2xl p-4 border border-gray-100 mb-3 shadow-sm">
              <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 border-b border-gray-100 pb-2 text-center">
                Specs
              </h4>
              <div className="space-y-2 text-[12px]">
                {[
                  { label: 'Software', value: 'Google Sheets', bold: true },
                  { label: 'License', value: 'Personal use', bold: true },
                  { label: 'Format', value: 'Instant Copy' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-gray-400 font-bold">{item.label}</span>
                    <span className={`text-[#1f2937] ${item.bold ? 'font-bold' : 'font-medium'}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={template.google_sheets_url}
              target="_blank"
              className="flex items-center justify-center gap-2 w-full bg-[#1F5C3E] text-white py-3 rounded-xl font-bold text-[14px] hover:bg-black transition-all shadow-md no-underline mb-3"
            >
              <Download size={16} />
              Download Now
            </a>

            {/* CERCHIETTI VERDI - ATTACCATI AL DOWNLOAD */}
            <div className="flex flex-wrap justify-center gap-3 text-[9px] font-black text-gray-400 uppercase tracking-tight mb-6">
              <div className="flex items-center gap-1"><CheckCircle2 size={11} className="text-[#C0DD97]" /> No macros</div>
              <div className="flex items-center gap-1"><CheckCircle2 size={11} className="text-[#C0DD97]" /> 100% free</div>
            </div>

            <div className="pt-2 border-t border-gray-50">
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
          <img src={lightboxImg} className="max-w-full max-h-full rounded-lg object-contain" alt="Zoomed view" />
        </div>
      )}

      <Footer />
    </div>
  )
}
