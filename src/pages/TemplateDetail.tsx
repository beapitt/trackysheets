import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Footer from '../components/Footer'
import Sidebar from '../layout/Sidebar'
import { ChevronDown, Download, X, LayoutGrid, Zap, BarChart3, CheckCircle2 } from 'lucide-react'

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
    <div className="min-h-screen bg-white text-[#1a1a1a] font-inter antialiased">
      <Navbar />

      {/* ALLARGATO A 1440px per ridurre i margini laterali */}
      <main className="max-w-[1440px] mx-auto px-6 md:px-10 pt-8 pb-12">
        
        {/* TITOLO - Allineato alla H di Home */}
        <div className="mb-6">
          <h1 className="text-[26px] md:text-[32px] font-bold tracking-tight text-[#1f2937] leading-tight">
            {template.title}
          </h1>
          {/* RIPRISTINATA SHORT DESCRIPTION DINAMICA */}
          <p className="text-[14px] text-gray-600 mt-1.5 font-medium italic">
            {template.short_description}
          </p>
        </div>

        {/* GRID CAMBIATA: col-span-9 per la Gallery, col-span-3 per la Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-9">
            
            {/* GALLERY ANCORA PIÙ GRANDE */}
            <div className="mb-8">
              <div
                className="aspect-video bg-[#f5f4ed] rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-zoom-in group relative"
                onClick={() => setLightboxImg(selectedImg)}
              >
                <img src={selectedImg || ''} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]" />
              </div>

              <div className="flex gap-3 mt-4">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(img)}
                    className={`w-28 aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImg === img ? 'border-[#1F5C3E] shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="border-l-4 border-[#C0DD97] pl-6 mb-8 max-w-4xl">
              <div className="text-[16px] text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">
                {template.long_description}
              </div>
            </div>

            {/* HOW TO USE */}
            <div className="mb-8 bg-gray-50/50 p-8 rounded-2xl border border-gray-100 max-w-4xl">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-5">
                How to Use this Template
              </h3>
              <div className="space-y-4">
                {[
                  'Click the "Download Now" button in the sidebar.',
                  'In the new tab, click "Make a copy" to save it to your Google Drive.',
                  'Instant access: no login or registration required.'
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#1F5C3E] text-white flex items-center justify-center text-[12px] font-black shrink-0 shadow-sm">
                      {i + 1}
                    </div>
                    <p className="text-[14px] text-gray-700 font-semibold leading-snug">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            {faqData.length > 0 && (
              <div className="pt-6 border-t border-gray-100 max-w-4xl">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                  Frequently Asked Questions
                </h3>
                <div className="divide-y divide-gray-100">
                  {faqData.map((item: any, i: number) => (
                    <div key={i} className="py-0.5">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex justify-between items-center py-4 text-left group"
                      >
                        <span className="text-[14px] font-bold text-gray-800 group-hover:text-[#1F5C3E] transition-colors">{item.q}</span>
                        <ChevronDown size={16} className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-[#1F5C3E]' : 'text-gray-300'}`} />
                      </button>
                      <div className={`transition-all duration-200 overflow-hidden ${openFaq === i ? 'max-h-60 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="text-[13px] text-gray-500 leading-relaxed">{item.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR COMPATTATA (col-span-3) */}
          <aside className="lg:col-span-3 lg:sticky lg:top-24 self-start">
            <div className="bg-[#f9f9f6] rounded-2xl p-5 border border-gray-100 mb-4 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 border-b border-gray-200 pb-2 text-center">
                Technical Specifications
              </h4>
              <div className="space-y-3 text-[12px]">
                {[
                  { label: 'Software', value: 'Google Sheets', bold: true },
                  { label: 'License', value: 'Personal use only', bold: true },
                  { label: 'Format', value: 'Instant Copy' },
                  { label: 'Access', value: 'No Login' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-gray-200/50 pb-1.5 last:border-0">
                    <span className="text-gray-500 font-semibold">{item.label}</span>
                    <span className={`text-gray-900 ${item.bold ? 'font-bold' : 'font-medium'}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={template.google_sheets_url}
              target="_blank"
              className="flex items-center justify-center gap-3 w-full bg-[#1F5C3E] text-white py-3.5 rounded-xl font-bold text-[14px] hover:bg-black transition-all shadow-lg no-underline mb-3"
            >
              <Download size={18} />
              Download Now
            </a>

            <div className="flex flex-wrap justify-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-6">
              <div className="flex items-center gap-1"><CheckCircle2 size={11} className="text-[#C0DD97]" /> No macros</div>
              <div className="flex items-center gap-1"><CheckCircle2 size={11} className="text-[#C0DD97]" /> Safe</div>
              <div className="flex items-center gap-1"><CheckCircle2 size={11} className="text-[#C0DD97]" /> 100% free</div>
            </div>

            <div className="mt-6 border-t border-gray-50 pt-6">
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
          <img src={lightboxImg} className="max-w-full max-h-full rounded-lg object-contain shadow-2xl" />
        </div>
      )}

      <Footer />
    </div>
  )
}
