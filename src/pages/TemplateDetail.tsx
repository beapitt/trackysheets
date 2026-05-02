import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Footer from '../components/Footer'
import Sidebar from '../layout/Sidebar'
import { ChevronDown, Download, X, CheckCircle2, MonitorPlay } from 'lucide-react'

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

  // Helper per il Video ID
  const getYouTubeID = (url: string) => {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\??v?=?))([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };
  const videoId = template.youtube_url ? getYouTubeID(template.youtube_url) : null;

  return (
    <div className="min-h-screen bg-white text-[#4b5563] font-inter antialiased overflow-x-hidden">
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-5 md:px-10 pt-4 md:pt-6 pb-12">
        
        {/* TITOLO E DESCRIZIONE - Rimosso Italic e aggiunto stile */}
        <div className="mb-6 text-left">
          <h1 className="text-[26px] md:text-[36px] font-extrabold tracking-tight text-[#1f2937] leading-tight">
            {template.title}
          </h1>
          <p className="text-[15px] md:text-[16px] text-[#6b7280] mt-2 font-medium max-w-4xl leading-relaxed">
            {template.short_description}
          </p>
        </div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 xl:col-span-9">
            {/* GALLERY */}
            <div className="mb-6">
              <div
                className="aspect-video bg-[#f9f9f7] rounded-[24px] overflow-hidden border border-gray-100 shadow-sm cursor-zoom-in group relative"
                onClick={() => setLightboxImg(selectedImg)}
              >
                <img src={selectedImg || ''} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]" alt="Preview" />
              </div>

              <div className="flex gap-3 mt-4 overflow-x-auto pb-1 no-scrollbar">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(img)}
                    className={`w-24 md:w-32 shrink-0 aspect-video rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedImg === img ? 'border-[#1F5C3E] shadow-md' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="Gallery thumbnail" />
                  </button>
                ))}
              </div>
            </div>

            {/* LONG DESCRIPTION */}
            <div className="mb-10 max-w-4xl text-left">
              <div className="text-[16px] text-[#4b5563] leading-relaxed whitespace-pre-wrap font-medium">
                {template.long_description}
              </div>
            </div>

            {/* HOW IT WORKS (CERCHIETTI VERDI) */}
            <div className="mb-10 bg-[#f9f9f6] p-8 rounded-[32px] border border-gray-100 max-w-4xl text-left">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1F5C3E] mb-6">How it works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { t: 'Click Download Now', d: 'Get instant access to the file link.' },
                  { t: 'Select "Make a copy"', d: 'The file will be saved directly to your Drive.' },
                  { t: 'Ready to use', d: 'Start tracking your data immediately.' }
                ].map((step, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1F5C3E] text-white flex items-center justify-center text-[14px] font-black shadow-lg shadow-[#1F5C3E]/20">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-[#1f2937] mb-1">{step.t}</h4>
                      <p className="text-[13px] text-gray-500 leading-snug">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ - SPOSTATE QUI SOTTO (CENTRO) */}
            {faqData.length > 0 && (
              <div className="mb-10 max-w-4xl text-left">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-2">
                  {faqData.map((item: any, i: number) => (
                    <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden transition-all">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-[14px] font-bold text-[#1f2937]">{item.q}</span>
                        <ChevronDown size={18} className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-[#1F5C3E]' : 'text-gray-300'}`} />
                      </button>
                      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaq === i ? 'max-h-[500px] border-t border-gray-50' : 'max-h-0'}`}>
                        <div className="p-4 bg-white">
                          <p className="text-[14px] text-[#6b7280] leading-relaxed font-medium">{item.a}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 self-start space-y-6">
            
            {/* BOX DOWNLOAD STILE CLAUDE */}
            <div className="bg-[#fcfcf9] rounded-[32px] p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#1F5C3E] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Template Specs</span>
              </div>
              
              <div className="space-y-4 mb-8">
                {[
                  {l:'Software', v:'Google Sheets'}, 
                  {l:'Version', v:'1.0 (Latest)'}, 
                  {l:'License', v:'Personal Use'}
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-3">
                    <span className="text-[12px] text-gray-400 font-bold">{item.l}</span>
                    <span className="text-[12px] text-[#1f2937] font-black">{item.v}</span>
                  </div>
                ))}
              </div>

              <a
                href={template.google_sheets_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between w-full bg-[#1F5C3E] text-white p-2 pr-4 rounded-2xl font-bold text-[15px] hover:bg-black transition-all shadow-xl shadow-[#1F5C3E]/10 no-underline"
              >
                <div className="bg-white/10 p-3 rounded-xl group-hover:bg-white/20 transition-colors">
                  <Download size={20} />
                </div>
                <span>Download for Sheets</span>
                <ChevronDown size={18} className="-rotate-90 opacity-50" />
              </a>

              <div className="mt-8 flex flex-col gap-3">
                <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-50">
                  <CheckCircle2 size={16} className="text-[#1F5C3E]" />
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">No Macros / Safe File</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-50">
                  <CheckCircle2 size={16} className="text-[#1F5C3E]" />
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">100% Free Forever</span>
                </div>
              </div>
            </div>

            {/* VIDEO GUIDE SE PRESENTE */}
            {videoId && (
              <div className="bg-white rounded-[32px] p-2 border border-gray-100 overflow-hidden shadow-sm">
                <div className="aspect-video bg-black rounded-[26px] overflow-hidden relative group">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${videoId}`} 
                    title="YouTube video guide"
                    frameBorder="0" 
                    allowFullScreen
                  />
                </div>
                <div className="p-4 flex items-center gap-2">
                  <MonitorPlay size={16} className="text-[#1F5C3E]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Video Tutorial</span>
                </div>
              </div>
            )}

            <Sidebar />
          </aside>
        </div>
      </main>

      {/* LIGHTBOX */}
      {lightboxImg && (
        <div className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setLightboxImg(null)}>
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
            <X size={32} />
          </button>
          <img src={lightboxImg} className="max-w-full max-h-full rounded-2xl object-contain shadow-2xl animate-in zoom-in duration-300" alt="Full view" />
        </div>
      )}

      <Footer />
    </div>
  )
}
