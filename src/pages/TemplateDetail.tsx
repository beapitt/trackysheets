import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Footer from '../components/Footer'
import Sidebar from '../layout/Sidebar'
import { LayoutGrid, Zap, BarChart3, X, ChevronDown, Download } from 'lucide-react'

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

  if (loading || !template) return null;

  const gallery = [template.thumbnail, template.img_1, template.img_2, template.img_3].filter(Boolean)
  const faqData = Array.isArray(template.faqs) ? template.faqs : [];

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-inter text-left">
      <Navbar />

      <main className="w-full max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-20">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          <div className="w-full lg:flex-[0.74] min-w-0">
            {/* TITOLO INTER - Allineato alla H di Home */}
            <div className="mb-8">
              <h1 className="text-[26px] md:text-[28px] text-[#1f2937] font-medium tracking-tight leading-tight mb-2">
                {template.title}
              </h1>
              <p className="text-[14px] text-gray-500 max-w-3xl">Free Google Sheets template — automated dashboard for business finances</p>
            </div>

            {/* GALLERY + IL TUO BOX METADATI ORIGINALE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
              <div className="lg:col-span-7">
                <div className="aspect-video bg-[#f5f4ed] rounded-xl overflow-hidden mb-4 border border-gray-100 cursor-zoom-in" onClick={() => setLightboxImg(selectedImg)}>
                  <img src={selectedImg || ''} className="w-full h-full object-cover" alt="Preview" />
                </div>
                <div className="flex gap-2">
                  {gallery.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImg(img)} className={`w-20 aspect-video rounded-lg overflow-hidden border-2 transition-all ${selectedImg === img ? 'border-[#1F5C3E]' : 'border-transparent opacity-50'}`}>
                      <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                    </button>
                  ))}
                </div>
              </div>

              {/* SCHEDA TECNICA ORIGINALE (Screenshot 2) */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="bg-[#f9f9f6] rounded-xl p-6 border border-gray-100 mb-4">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-200 pb-2">Scheda Tecnica</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Software', value: 'Google Sheets', bold: true },
                      { label: 'Compatibilità', value: 'Excel, Sheets' },
                      { label: 'Licenza', value: 'Free' },
                      { label: 'Difficoltà', value: 'Beginner', bold: true },
                      { label: 'Aggiornato', value: 'Apr 2026' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[13px] border-b border-gray-200/50 pb-2 last:border-0">
                        <span className="text-gray-500">{item.label}</span>
                        <span className={`text-gray-900 ${item.bold ? 'font-bold' : ''}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a href={template.google_sheets_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#1F5C3E] text-white py-3.5 rounded-lg font-bold text-[14px] shadow-sm hover:bg-[#16422d] transition-all no-underline">
                  <Download size={18} /> Download for Google Sheets
                </a>
                <div className="flex justify-center gap-6 mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                   <span>✓ No macros</span> <span>✓ Safe</span> <span>✓ 100% free</span>
                </div>
              </div>
            </div>

            {/* SEZIONI INFERIORI COMPATTATE */}
            <div className="border-l-4 border-[#C0DD97] pl-6 mb-10 text-[15px] text-gray-600 leading-relaxed">
              {template.long_description}
            </div>

            {/* FAQ RIPULITE */}
            {faqData.length > 0 && (
              <div className="pt-8 border-t border-gray-100">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6">Frequently Asked Questions</h3>
                <div className="divide-y divide-gray-100">
                  {faqData.map((item: any, i: number) => (
                    <div key={i} className="py-1">
                      <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex justify-between items-center py-4 text-left">
                        <span className="text-[14px] font-bold text-gray-800">{item.q}</span>
                        <ChevronDown size={16} className={`text-gray-300 transition-all ${openFaq === i ? 'rotate-180 text-[#1F5C3E]' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="text-[13px] text-gray-500">{item.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="w-full lg:w-[280px] shrink-0 lg:sticky lg:top-24 self-start">
            <Sidebar />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
